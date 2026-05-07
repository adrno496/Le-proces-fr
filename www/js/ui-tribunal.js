// Tribunal panel — DASHBOARD home that regroups everything (daily, free, historic, weekly).
// Pieces à conviction in detailed modals with hints. Verdict eval reveals the underlying truth
// and the lawyers' quality, scoring the user's judgment.

import { el, clear, toast, navigate } from "./app.js";
import { Storage, computeStreak, levelFromXp } from "./storage.js";
import {
  getDailyCase, generateFreeCase, askWitness, evaluateVerdict,
  computeXpGain, checkAchievements, ACHIEVEMENTS, CATEGORY_LABELS, CATEGORY_ICONS,
} from "./case-engine.js";
import { getTodayDateStr, formatDate, caseNumber } from "./format.js";
import { getCurrentTier, checkPromotion, tierProgress } from "./career.js";
import { unlockForCategory, entryById } from "./codex.js";
import { computeReputation } from "./reputation.js";
import { maybePromote } from "./jurisprudence.js";
import { recordOutcome } from "./parties.js";
import { maybeReward, progress as cabinetProgress } from "./cabinet.js";
import { progress as codexProgress } from "./codex.js";
import { recordVerdictForChallenge, multiplierForCategory, currentChallenge, getProgress as weeklyGet } from "./weekly-challenge.js";
import { currentChapter, chapterByDate } from "./narrative.js";
import { shareVerdict } from "./share.js";
import { isSupported as ttsSupported, readPlaidoiries, stop as stopTTS } from "./tts.js";
import { pickQuiz, score as quizScore } from "./quiz.js";

let typewriterTimer = null;
let verdictStartTs = null;

class Typewriter {
  constructor(node, text, speed = 22) {
    this.node = node; this.text = text; this.speed = speed;
    this.i = 0; this.paused = false;
  }
  start() {
    this.node.textContent = "";
    const tick = () => {
      if (this.paused) return;
      if (this.i >= this.text.length) return;
      this.node.textContent += this.text[this.i++];
      typewriterTimer = setTimeout(tick, this.speed);
    };
    tick();
  }
  finish() { this.node.textContent = this.text; this.i = this.text.length; }
}

function difficultyDots(d) {
  return "●".repeat(Math.max(1, Math.min(5, d))) + "○".repeat(5 - Math.max(1, Math.min(5, d)));
}

export async function renderTribunal(root) {
  stopTTS();
  clear(root);
  if (typeof window !== "undefined" && window._leprocesFreeCase) return renderCaseFlow(root, "free");
  if (typeof window !== "undefined" && window._leprocesHistoricCase) return renderCaseFlow(root, "historic");
  return renderDashboard(root);
}

// =====================================================================
// DASHBOARD : page d'accueil regroupant TOUT
// =====================================================================
async function renderDashboard(root) {
  const settings = Storage.getSettings();
  const profile = Storage.getProfile();
  const today = getTodayDateStr();
  const tier = getCurrentTier(profile);
  const tProg = tierProgress(profile);
  const reputation = computeReputation(profile);
  const ch = currentChallenge();
  const wp = weeklyGet();
  const wpCur = wp.week === ch.week ? wp.completed : 0;
  const verdictToday = await Storage.getVerdict(today);

  const container = el("div", { class: "panel panel-tribunal panel-dashboard" });
  root.appendChild(container);

  // Header banner
  container.appendChild(el("div", { class: "dash-hero" }, [
    el("img", { src: "icons/logo.png", alt: "", class: "dash-logo" }),
    el("div", { class: "dash-hero-text" }, [
      el("h1", {}, [`Maître ${profile.username || "Votre Honneur"}`]),
      el("div", { class: "dash-tier" }, [`${tier.icon} ${tier.name}`]),
      el("div", { class: "dash-rep" }, [`${reputation.icon} ${reputation.label}`]),
      el("div", { class: "xp-bar dash-xp" }, [
        el("div", { class: "xp-bar-fill", style: { width: `${tProg.pct}%` } }),
        el("div", { class: "xp-bar-label" }, [
          tProg.next ? `${profile.totalVerdicts || 0} / ${tProg.next.minVerdicts} verdicts` : "Sommet atteint",
        ]),
      ]),
      el("div", { class: "dash-streak" }, [`🔥 ${profile.streak || 0} jour${(profile.streak || 0) > 1 ? "s" : ""}  ·  ⭐ ${profile.totalXp || 0} XP`]),
    ]),
  ]));

  // Cards grid
  const grid = el("div", { class: "dash-grid" });

  // CARD 1 : Audience du jour
  const dailyCard = el("button", { class: `dash-card dash-daily ${verdictToday ? "done" : ""}`, onclick: () => {
    if (typeof window !== "undefined") { window._leprocesFreeCase = null; window._leprocesHistoricCase = null; }
    renderTribunal(root);
    setTimeout(() => loadDailyCase(root), 50);
  }}, [
    el("div", { class: "card-icon" }, ["⚖"]),
    el("div", { class: "card-title" }, ["Audience du jour"]),
    el("div", { class: "card-body" }, [
      verdictToday
        ? `✅ Verdict prononcé · ${verdictToday.verdict === "guilty" ? "Coupable" : "Non-coupable"}`
        : settings.apiKey ? "Cas généré par IA" : "Cas hors-ligne disponible",
    ]),
    el("div", { class: "card-cta" }, [verdictToday ? "Revoir →" : "Tenir l'audience →"]),
  ]);
  grid.appendChild(dailyCard);

  // CARD 2 : Audience libre
  const freeCard = el("button", { class: "dash-card dash-free", onclick: () => startFreeAudience(root) }, [
    el("div", { class: "card-icon" }, ["🎲"]),
    el("div", { class: "card-title" }, ["Audience libre"]),
    el("div", { class: "card-body" }, ["Un cas généré à la demande, dans une catégorie aléatoire."]),
    el("div", { class: "card-cta" }, ["Lancer →"]),
  ]);
  grid.appendChild(freeCard);

  // CARD 3 : Procès historiques
  const histCard = el("button", { class: "dash-card dash-hist", onclick: () => navigate("history") }, [
    el("div", { class: "card-icon" }, ["📜"]),
    el("div", { class: "card-title" }, ["Procès historiques"]),
    el("div", { class: "card-body" }, [`${(profile.historicJudged || []).length} / 10 jugés. Calas, Dreyfus, Outreau...`]),
    el("div", { class: "card-cta" }, ["Voir →"]),
  ]);
  grid.appendChild(histCard);

  // CARD 4 : Défi de la semaine
  const wpct = Math.round((wpCur / ch.target) * 100);
  const weeklyCard = el("button", { class: "dash-card dash-weekly", onclick: () => navigate("history") }, [
    el("div", { class: "card-icon" }, ["📅"]),
    el("div", { class: "card-title" }, ["Défi de la semaine"]),
    el("div", { class: "card-body" }, [`${ch.label} · × 2 XP — ${wpCur}/${ch.target}`]),
    el("div", { class: "weekly-mini-bar" }, [el("div", { class: "weekly-mini-fill", style: { width: `${wpct}%` } })]),
    el("div", { class: "card-cta" }, ["Détails →"]),
  ]);
  grid.appendChild(weeklyCard);

  // CARD 5 : Catégories
  const catCard = el("div", { class: "dash-card dash-categories" }, [
    el("div", { class: "card-icon" }, ["🎭"]),
    el("div", { class: "card-title" }, ["Catégories disponibles"]),
    el("div", { class: "muted" }, ["Cliquez sur une catégorie pour tenir une audience libre."]),
    el("div", { class: "cat-chips" },
      Object.keys(CATEGORY_LABELS).map(k => el("button", {
        class: "cat-chip", onclick: async (e) => {
          const btn = e.currentTarget;
          btn.disabled = true;
          const orig = btn.textContent;
          btn.textContent = "⏳ ...";
          toast(`⚖ Génération d'une audience ${CATEGORY_LABELS[k]}...`, "info", 1500);
          try {
            window._leprocesFreeCase = await generateFreeCase({ category: k });
            renderTribunal(root);
          } catch (err) {
            btn.disabled = false;
            btn.textContent = orig;
            toast(err.message || "Erreur", "error", 4000);
          }
        },
      }, [`${CATEGORY_ICONS[k] || ""} ${CATEGORY_LABELS[k]}`]))
    ),
  ]);
  grid.appendChild(catCard);

  container.appendChild(grid);

  // No API key warning
  if (!settings.apiKey) {
    container.appendChild(el("div", { class: "dash-warning" }, [
      el("strong", {}, ["ℹ Mode hors-ligne"]),
      el("p", {}, ["Aucune clé API configurée — l'app utilise un pool de 110 cas locaux. Vous pouvez à tout moment configurer une IA dans les paramètres pour des cas générés en temps réel."]),
      el("button", { class: "btn-secondary", onclick: () => navigate("settings") }, ["⚙ Paramètres IA"]),
    ]));
  }
}

// =====================================================================
// CASE FLOW (daily / free / historic, unifié)
// =====================================================================
async function renderCaseFlow(root, kind) {
  const container = el("div", { class: "panel panel-tribunal" });
  root.appendChild(container);

  // Bouton retour dashboard
  container.appendChild(el("button", { class: "btn-back", onclick: () => {
    if (typeof window !== "undefined") { window._leprocesFreeCase = null; window._leprocesHistoricCase = null; }
    renderTribunal(root);
  }}, ["← Tableau de bord"]));

  let caseData;
  if (kind === "free")     caseData = window._leprocesFreeCase;
  else if (kind === "historic") {
    caseData = { ...window._leprocesHistoricCase };
    // Enrich historic too if missing truth
    if (caseData.truth == null) {
      const { enrichCase } = await import("./case-engine.js");
      caseData = enrichCase(caseData);
    }
  }
  if (!caseData) {
    toast("Aucun cas chargé", "error");
    if (typeof window !== "undefined") { window._leprocesFreeCase = null; window._leprocesHistoricCase = null; }
    return renderTribunal(root);
  }
  caseData.caseNumber = caseData.caseNumber || (kind === "free" ? `LIBRE-${Date.now().toString(36).slice(-5).toUpperCase()}` : `HIST-${(caseData.id || "").toUpperCase()}`);
  renderCaseHeader(container, caseData, caseData.date || getTodayDateStr(), root, { kind });
}

async function loadDailyCase(root) {
  const container = root.querySelector(".panel-tribunal") || (() => {
    const c = el("div", { class: "panel panel-tribunal" });
    root.appendChild(c);
    return c;
  })();
  clear(container);
  // Bouton retour
  container.appendChild(el("button", { class: "btn-back", onclick: () => renderTribunal(root) }, ["← Tableau de bord"]));
  const today = getTodayDateStr();
  const settings = Storage.getSettings();

  if (!settings.apiKey) {
    // No API key: still play with offline pool
  }

  const placeholder = el("div", { class: "skeleton-screen" }, [
    el("div", { class: "skeleton skeleton-line w-30" }),
    el("div", { class: "skeleton skeleton-line w-80" }),
    el("div", { class: "skeleton skeleton-block" }),
    el("div", { class: "skeleton skeleton-block" }),
  ]);
  container.appendChild(placeholder);

  let caseData;
  try { caseData = await getDailyCase(); }
  catch (e) {
    placeholder.remove();
    toast(e.message, "error", 5000);
    container.appendChild(el("div", { class: "error-screen" }, [
      el("h2", {}, ["L'audience n'a pas pu débuter"]),
      el("p", {}, [e.message]),
      el("button", { class: "btn-primary", onclick: () => navigate("settings") }, ["⚙ Paramètres"]),
    ]));
    return;
  }
  placeholder.remove();
  const verdict = await Storage.getVerdict(today);
  if (verdict) return renderVerdictRecap(container, caseData, verdict, root, "daily");
  renderCaseHeader(container, caseData, today, root, { kind: "daily" });
}

async function startFreeAudience(root) {
  toast("⚖ Génération de l'audience...", "info", 1200);
  try {
    window._leprocesFreeCase = await generateFreeCase();
  } catch (e) {
    toast(e.message, "error", 4000);
    return;
  }
  const profile = Storage.getProfile();
  Storage.saveProfile({ freeAudiencesCount: (profile.freeAudiencesCount || 0) + 1 });
  renderTribunal(root);
}

function renderCaseHeader(container, caseData, today, root, ctx) {
  verdictStartTs = Date.now();
  const settings = Storage.getSettings();

  if (ctx.kind === "daily" && caseData.specialLabel) {
    container.appendChild(el("div", { class: "special-banner" }, [
      el("div", { class: "special-tag" }, [caseData.specialLabel]),
      el("div", { class: "special-desc" }, [caseData.specialDesc]),
    ]));
  }

  const header = el("div", { class: "case-header" }, [
    el("div", { class: "case-date" }, [
      ctx.kind === "free" ? "⚖ AUDIENCE LIBRE" :
      ctx.kind === "historic" ? `📜 PROCÈS HISTORIQUE — ${caseData.era || ""}` :
      formatDate(today).toUpperCase()
    ]),
    el("div", { class: "case-number" }, [`DOSSIER N° ${caseData.caseNumber}`]),
    el("hr", { class: "rule-double" }),
    el("h1", { class: "case-title" }, [caseData.title]),
    el("hr", { class: "rule-double" }),
    el("div", { class: "case-meta" }, [
      el("span", { class: "case-meta-item" }, [`${CATEGORY_ICONS[caseData.category] || ""} ${CATEGORY_LABELS[caseData.category] || caseData.category}`]),
      el("span", { class: "case-meta-item" }, [`Difficulté ${difficultyDots(caseData.difficulty || 3)}`]),
      caseData.multiplier && caseData.multiplier !== 1 ? el("span", { class: "case-meta-item gold" }, [`× ${caseData.multiplier} XP`]) : null,
    ]),
    el("div", { class: "case-context" }, [caseData.context]),
  ]);
  container.appendChild(header);

  if (settings.motto) container.appendChild(el("blockquote", { class: "judge-motto" }, [`"${settings.motto}"`]));

  const flavors = [];
  if (caseData.partyFlavor) flavors.push(caseData.partyFlavor);
  if (caseData.repFlavor) flavors.push(caseData.repFlavor);
  if (caseData.precedent) flavors.push(`📚 Jurisprudence personnelle citée : « ${caseData.precedent.title} ».`);
  if (flavors.length) {
    const fl = el("div", { class: "flavor-section" });
    flavors.forEach(f => fl.appendChild(el("div", { class: "flavor-line" }, [f])));
    container.appendChild(fl);
  }

  // Affichage des plaidoiries — avec niveau d'avocat visible
  const speechWrap = el("div", { class: "speech-stage hidden" });
  const proseHeader = el("div", { class: "speech-header" }, [
    el("h3", { class: "speech-title" }, [`⚔ ACCUSATION  ${"★".repeat(caseData.prosecutionQuality || 3)}${"☆".repeat(5 - (caseData.prosecutionQuality || 3))}`]),
    ttsSupported() ? el("button", { class: "btn-icon", title: "Écouter en TTS",
      onclick: () => listenSpeeches(caseData) }, ["🔊"]) : null,
  ]);
  const proseText = el("div", { class: "speech-text" });
  const defHeader = el("div", { class: "speech-header" }, [
    el("h3", { class: "speech-title" }, [`🛡 DÉFENSE  ${"★".repeat(caseData.defenseQuality || 3)}${"☆".repeat(5 - (caseData.defenseQuality || 3))}`]),
  ]);
  const defText = el("div", { class: "speech-text" });
  speechWrap.append(proseHeader, proseText, defHeader, defText);

  const startBtn = el("button", { class: "btn-primary btn-big", onclick: () => {
    startBtn.remove();
    speechWrap.classList.remove("hidden");
    const tw1 = new Typewriter(proseText, caseData.prosecutionSpeech, 18);
    tw1.start();
    proseText.addEventListener("click", () => tw1.finish(), { once: true });
    setTimeout(() => {
      const tw2 = new Typewriter(defText, caseData.defenseSpeech, 18);
      tw2.start();
      defText.addEventListener("click", () => tw2.finish(), { once: true });
    }, Math.min(caseData.prosecutionSpeech.length * 18 + 500, 4500));
    setTimeout(() => renderEvidenceWitnessAndVerdict(container, caseData, today, root, ctx), 2000);
  }}, ["📋 OUVRIR L'AUDIENCE"]);
  container.appendChild(startBtn);
  container.appendChild(speechWrap);
}

function listenSpeeches(caseData) {
  Storage.saveProfile({ ttsListened: true });
  toast("🔊 Lecture en cours...", "info", 1500);
  readPlaidoiries(caseData.prosecutionSpeech, caseData.defenseSpeech, {
    onStart: w => toast(`Lecture : ${w === "prosecution" ? "accusation" : "défense"}`, "info", 1500),
    onComplete: () => toast("Lecture terminée", "success", 1500),
  });
}

function renderEvidenceWitnessAndVerdict(container, caseData, today, root, ctx) {
  // Pieces à conviction — modal détaillé au clic
  if (caseData.evidence && caseData.evidence.length) {
    const ev = el("section", { class: "evidence-section" });
    ev.appendChild(el("h3", { class: "section-subtitle" }, [`📁 PIÈCES À CONVICTION (${caseData.evidence.length})`]));
    const grid = el("div", { class: "evidence-grid" });
    caseData.evidence.forEach(piece => {
      const card = el("button", { class: "evidence-card", onclick: () => openEvidenceModal(piece, card) }, [
        el("div", { class: "ev-icon" }, ["📄"]),
        el("div", { class: "ev-label" }, [piece.label]),
      ]);
      grid.appendChild(card);
    });
    ev.appendChild(grid);
    ev.appendChild(el("p", { class: "evidence-hint muted" }, ["💡 Cliquez sur chaque pièce pour la consulter en détail."]));
    container.appendChild(ev);
  }

  // Witnesses
  const witnessesPool = caseData.witnesses || [{ id: "w-1", name: "témoin", style: "" }];
  const qaWrap = el("section", { class: "qa-section" });
  qaWrap.appendChild(el("h3", { class: "section-subtitle" }, [`👥 INTERROGER LES TÉMOINS (${witnessesPool.length})`]));
  const witnessRow = el("div", { class: "witness-row" });
  let activeWitness = witnessesPool[0];
  function updateWitnessChips() {
    clear(witnessRow);
    witnessesPool.forEach(w => {
      witnessRow.appendChild(el("button", {
        class: `witness-chip ${w.id === activeWitness.id ? "active" : ""}`,
        onclick: () => { activeWitness = w; updateWitnessChips(); },
      }, [w.name]));
    });
  }
  updateWitnessChips();
  qaWrap.appendChild(witnessRow);
  const qaList = el("div", { class: "qa-list" });
  qaWrap.appendChild(qaList);
  const qaInput = el("input", { type: "text", class: "text-input", placeholder: `Question au ${activeWitness.name}...` });
  const askBtn = el("button", { class: "btn-secondary" }, ["INTERROGER"]);
  let qaState = [];
  askBtn.addEventListener("click", async () => {
    const q = qaInput.value.trim();
    if (!q) return;
    qaInput.value = "";
    askBtn.disabled = true;
    askBtn.textContent = "Le témoin réfléchit...";
    const row = el("div", { class: "qa-row" }, [
      el("div", { class: "qa-witness" }, [`🧑 ${activeWitness.name} (${activeWitness.style})`]),
      el("div", { class: "qa-question" }, [`❓ ${q}`]),
      el("div", { class: "qa-answer skeleton skeleton-line w-80" }),
    ]);
    qaList.appendChild(row);
    try {
      const settings = Storage.getSettings();
      let answer;
      if (settings.apiKey) {
        const enrichedCase = { ...caseData, witnessProfile: activeWitness };
        const res = await askWitness(enrichedCase, q, qaState);
        answer = res.answer;
      } else {
        // Réponse offline pseudo-cohérente avec la vérité du cas
        answer = generateOfflineWitnessAnswer(caseData, activeWitness, q);
      }
      qaState.push({ question: q, answer, witness: activeWitness.id });
      const ans = row.querySelector(".qa-answer");
      ans.classList.remove("skeleton", "skeleton-line", "w-80");
      ans.textContent = `🗣 ${answer}`;
      const profile = Storage.getProfile();
      Storage.saveProfile({ questionsAsked: (profile.questionsAsked || 0) + 1 });
    } catch (e) {
      row.querySelector(".qa-answer").textContent = `⚠ ${e.message}`;
      toast(e.message, "error");
    }
    askBtn.disabled = false;
    askBtn.textContent = "INTERROGER";
  });
  qaWrap.appendChild(el("div", { class: "input-row" }, [qaInput, askBtn]));
  container.appendChild(qaWrap);

  // Verdict block
  const verdictWrap = el("section", { class: "verdict-section" });
  verdictWrap.appendChild(el("h3", { class: "section-subtitle" }, ["🔨 VOTRE VERDICT"]));
  let chosen = null;
  const guiltyBtn = el("button", { class: "verdict-btn verdict-guilty", onclick: () => { chosen = "guilty"; updateBtns(); } }, ["⚖ COUPABLE"]);
  const innocentBtn = el("button", { class: "verdict-btn verdict-innocent", onclick: () => { chosen = "innocent"; updateBtns(); } }, ["🕊 NON-COUPABLE"]);
  function updateBtns() {
    guiltyBtn.classList.toggle("selected", chosen === "guilty");
    innocentBtn.classList.toggle("selected", chosen === "innocent");
  }
  verdictWrap.appendChild(el("div", { class: "verdict-row" }, [guiltyBtn, innocentBtn]));

  const sevLabel = el("div", { class: "slider-label" }, ["Sévérité : Modérée (3)"]);
  const slider = el("input", { type: "range", min: "1", max: "5", value: "3", class: "slider" });
  slider.addEventListener("input", e => {
    const v = +e.target.value;
    const labels = ["", "Avertissement", "Légère", "Modérée", "Sévère", "Maximale"];
    sevLabel.textContent = `Sévérité : ${labels[v]} (${v})`;
  });
  verdictWrap.append(sevLabel, slider);
  const argInput = el("textarea", { class: "text-input textarea", maxlength: "500", placeholder: "Argumentez votre verdict (motivation = bonus XP)" });
  verdictWrap.appendChild(argInput);
  const submitBtn = el("button", { class: "btn-primary btn-big hammer-btn", onclick: async () => {
    if (!chosen) return toast("Choisissez d'abord coupable ou non-coupable", "error");
    submitBtn.disabled = true;
    submitBtn.classList.add("hammering");
    const argument = argInput.value.trim();
    const severity = +slider.value;
    const verdictRec = await submitVerdict(caseData, today, chosen, severity, argument, qaState.length, ctx);
    setTimeout(() => {
      // Reset transient mode + show recap inline
      if (typeof window !== "undefined") { window._leprocesFreeCase = null; window._leprocesHistoricCase = null; }
      clear(container);
      container.appendChild(el("button", { class: "btn-back", onclick: () => renderTribunal(root) }, ["← Tableau de bord"]));
      renderVerdictRecap(container, caseData, verdictRec, root, ctx.kind || "daily");
    }, 1100);
  }}, ["🔨 PRONONCER LE VERDICT"]);
  verdictWrap.appendChild(submitBtn);
  container.appendChild(verdictWrap);
}

// Modal détaillé d'une pièce à conviction (sans révéler le slant — c'est au juge de juger)
function openEvidenceModal(piece, card) {
  piece.examined = true;
  card.classList.add("examined");
  const overlay = el("div", { class: "modal-overlay", onclick: e => { if (e.target.classList.contains("modal-overlay")) overlay.remove(); } });
  const modal = el("div", { class: "modal evidence-modal" });
  modal.appendChild(el("h2", {}, [`📄 ${piece.label}`]));
  modal.appendChild(el("hr"));
  modal.appendChild(el("p", { class: "evidence-body" }, [piece.body]));
  modal.appendChild(el("button", { class: "btn-primary", onclick: () => overlay.remove() }, ["FERMER"]));
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

// Réponse de témoin offline cohérente avec la vérité du cas
function generateOfflineWitnessAnswer(caseData, witness, question) {
  const truthBias = caseData.truth === "guilty" ? "vers une culpabilité" : "vers la défense";
  const styles = {
    "expert judiciaire": `Sur le plan technique, les éléments tendent ${truthBias}. Il convient cependant de rester prudent.`,
    "voisin direct": `J'habite à côté, j'ai vu des choses. Honnêtement, ça penchait ${truthBias}, mais je peux me tromper.`,
    "proche de la victime": `C'est difficile pour moi. Mais je dois dire la vérité, et la vérité va ${truthBias}.`,
    "témoin oculaire": `J'étais là. D'après ce que j'ai vu, les faits vont ${truthBias}.`,
    "témoin de moralité": `Je connais la personne depuis longtemps. Je dirais que tout pointe ${truthBias}.`,
    "ancien employé": `J'ai travaillé là-bas. Croyez-en mon expérience, les faits vont ${truthBias}.`,
  };
  return styles[witness.name] || `Selon mon témoignage, les éléments vont plutôt ${truthBias}.`;
}

async function submitVerdict(caseData, today, verdict, severity, argument, questionsCount, ctx) {
  const profile = Storage.getProfile();
  const newStreak = computeStreak(profile.lastVerdictDate, today, profile.streak);
  const baseXp = computeXpGain({ streak: newStreak, hasArgument: argument.length > 0 });
  const weeklyMul = multiplierForCategory(caseData.category);
  const specialMul = caseData.multiplier || 1;
  const kindMul = ctx.kind === "free" ? 0.5 : 1;

  // Évaluation de l'alignement avec la vérité cachée
  const evaluation = evaluateVerdict(caseData, verdict, severity);
  const xp = Math.round(baseXp * weeklyMul * specialMul * kindMul) + evaluation.bonusXp;

  const updates = {
    lastVerdictDate: today,
    streak: newStreak,
    longestStreak: Math.max(profile.longestStreak || 0, newStreak),
    totalVerdicts: (profile.totalVerdicts || 0) + (ctx.kind === "free" ? 0 : 1),
    totalXp: (profile.totalXp || 0) + xp,
    argumentsWritten: (profile.argumentsWritten || 0) + (argument.length > 0 ? 1 : 0),
    categoryCounts: { ...(profile.categoryCounts || {}) },
    difficultySum: (profile.difficultySum || 0) + (caseData.difficulty || 3),
    difficultiesSeen: Array.from(new Set([...(profile.difficultiesSeen || []), caseData.difficulty])),
    severitySum: (profile.severitySum || 0) + severity,
    guiltyCount: profile.guiltyCount || 0,
    innocentCount: profile.innocentCount || 0,
    guiltyStreakCurrent: profile.guiltyStreakCurrent || 0,
    innocentStreakCurrent: profile.innocentStreakCurrent || 0,
    guiltyStreakBest: profile.guiltyStreakBest || 0,
    innocentStreakBest: profile.innocentStreakBest || 0,
    historicJudged: profile.historicJudged || [],
    precedentsCreated: profile.precedentsCreated || 0,
    judgmentScoreSum: (profile.judgmentScoreSum || 0) + evaluation.score,
    alignedVerdicts: (profile.alignedVerdicts || 0) + (evaluation.aligned ? 1 : 0),
  };
  updates.categoryCounts[caseData.category] = (updates.categoryCounts[caseData.category] || 0) + 1;
  if (verdict === "guilty") {
    updates.guiltyCount += 1;
    updates.guiltyStreakCurrent += 1;
    updates.innocentStreakCurrent = 0;
    updates.guiltyStreakBest = Math.max(updates.guiltyStreakBest, updates.guiltyStreakCurrent);
  } else {
    updates.innocentCount += 1;
    updates.innocentStreakCurrent += 1;
    updates.guiltyStreakCurrent = 0;
    updates.innocentStreakBest = Math.max(updates.innocentStreakBest, updates.innocentStreakCurrent);
  }
  if (ctx.kind === "historic" && caseData.id && !updates.historicJudged.includes(caseData.id)) {
    updates.historicJudged.push(caseData.id);
  }
  Storage.saveProfile(updates);

  const verdictRecord = {
    verdict, severity, argument, xpGained: xp, submittedAt: Date.now(),
    questionsAsked: questionsCount, category: caseData.category,
    kind: ctx.kind || "daily",
    evaluation, // store the eval
    truth: caseData.truth, truthClarity: caseData.truthClarity,
    prosecutionQuality: caseData.prosecutionQuality, defenseQuality: caseData.defenseQuality,
  };
  if (ctx.kind === "daily") await Storage.saveVerdict(today, verdictRecord);

  recordOutcome(caseData.defendant?.id, today, caseData.category, verdict, caseData.title);
  recordVerdictForChallenge(caseData.category);
  const newCodexIds = unlockForCategory(caseData.category);
  const promoted = maybePromote(verdictRecord, caseData, newStreak);
  if (promoted) Storage.saveProfile({ precedentsCreated: (Storage.getProfile().precedentsCreated || 0) + 1 });
  const reward = maybeReward(Storage.getProfile());

  const cabP = cabinetProgress();
  const codP = codexProgress();
  const wkProg = Storage.getKey("weekly", { week: null, completed: 0 });
  const ctxAch = {
    hour: new Date().getHours(),
    special: caseData.special,
    cabinetCount: cabP.unlocked,
    cabinetFull: cabP.unlocked === cabP.total,
    codexPct: codP.pct,
    weeklyCompleted: wkProg.completedTotal || 0,
    freeAudiences: Storage.getProfile().freeAudiencesCount || 0,
    expertMode: Storage.getSettings().expertMode,
    tts: Storage.getProfile().ttsListened,
    evidenceAllExamined: (caseData.evidence || []).every(e => e.examined),
    historicCount: (Storage.getProfile().historicJudged || []).length,
    verdictMs: Date.now() - verdictStartTs,
    themesTried: (Storage.getProfile().themesTried || []).length,
  };
  const newly = [];
  for (const id of checkAchievements(Storage.getProfile(), ctxAch)) {
    if (!Storage.hasAchievement(id)) { Storage.addAchievement(id); newly.push(id); }
  }

  toast(`+${xp} XP · ${evaluation.label}`, evaluation.aligned ? "success" : "info", 4000);
  setTimeout(() => {
    if (newCodexIds.length) {
      const ent = entryById(newCodexIds[0]);
      if (ent) toast(`📖 Codex débloqué : ${ent.label}`, "success", 4000);
    }
  }, 700);
  setTimeout(() => {
    if (reward) toast(`🎁 Cabinet : ${reward.icon} ${reward.name} (${reward.rarity})`, "success", 4500);
  }, 1300);
  setTimeout(() => {
    if (promoted) toast("📚 Verdict promu au rang de précédent personnel.", "success", 4000);
  }, 1900);
  setTimeout(() => {
    if (newly.length) toast(`🏆 Succès : ${newly[0]}`, "success", 4000);
  }, 2500);

  return verdictRecord;
}

function renderVerdictRecap(container, caseData, verdict, root, kind) {
  const profile = Storage.getProfile();
  const tier = getCurrentTier(profile);
  const personalGuiltyRate = profile.totalVerdicts > 0 ? Math.round((profile.guiltyCount / profile.totalVerdicts) * 100) : 0;
  const evaluation = verdict.evaluation || { aligned: caseData.truth === verdict.verdict, score: 0, label: "" };

  container.appendChild(el("div", { class: "case-header" }, [
    el("div", { class: "case-date" }, [formatDate(verdict.date || getTodayDateStr()).toUpperCase()]),
    el("h1", { class: "case-title" }, [caseData.title]),
    el("hr", { class: "rule-double" }),
  ]));

  const recap = el("div", { class: "verdict-recap" });
  const isGuilty = verdict.verdict === "guilty";
  recap.appendChild(el("div", { class: `verdict-stamp ${isGuilty ? "stamp-guilty" : "stamp-innocent"} stamp-anim` }, [
    isGuilty ? "✗ COUPABLE" : "✓ NON-COUPABLE",
  ]));
  recap.appendChild(el("div", { class: "verdict-meta" }, [`Sévérité : ${verdict.severity}/5 · +${verdict.xpGained} XP`]));
  if (verdict.argument) recap.appendChild(el("blockquote", { class: "verdict-argument" }, [verdict.argument]));

  // RÉVÉLATION DE LA VÉRITÉ
  const truthBox = el("div", { class: `truth-box ${evaluation.aligned ? "aligned" : "diverged"}` });
  truthBox.appendChild(el("div", { class: "truth-title" }, ["📖 RÉVÉLATION DU DOSSIER"]));
  truthBox.appendChild(el("div", { class: "truth-line" }, [
    `Selon les éléments réels du dossier, le prévenu était `,
    el("strong", {}, [caseData.truth === "guilty" ? "COUPABLE" : "NON-COUPABLE"]),
    ` (clarté : ${"●".repeat(caseData.truthClarity || 3)}${"○".repeat(5 - (caseData.truthClarity || 3))}).`,
  ]));
  truthBox.appendChild(el("div", { class: "truth-eval" }, [
    `${evaluation.aligned ? "🎯" : "🤔"} ${evaluation.label} — Score de jugement : ${evaluation.score}/100`,
  ]));
  truthBox.appendChild(el("div", { class: "truth-lawyers" }, [
    el("div", {}, [`Niveau accusation : ${"★".repeat(caseData.prosecutionQuality || 3)}${"☆".repeat(5 - (caseData.prosecutionQuality || 3))}`]),
    el("div", {}, [`Niveau défense   : ${"★".repeat(caseData.defenseQuality || 3)}${"☆".repeat(5 - (caseData.defenseQuality || 3))}`]),
  ]));
  recap.appendChild(truthBox);

  recap.appendChild(el("div", { class: "verdict-stats" }, [
    el("div", {}, [`Vous avez voté coupable ${personalGuiltyRate}% du temps (sur ${profile.totalVerdicts} verdicts)`]),
    el("div", {}, [`${tier.icon} ${tier.name} · streak ${profile.streak} 🔥 · ${profile.totalXp || 0} XP`]),
  ]));

  // Quiz juridique post-verdict
  const q = pickQuiz(caseData.category);
  if (q) {
    const quizCard = el("section", { class: "quiz-card" });
    quizCard.appendChild(el("h3", { class: "section-subtitle" }, ["📝 QUIZ JURIDIQUE"]));
    quizCard.appendChild(el("p", { class: "quiz-q" }, [q.q]));
    q.options.forEach((opt, i) => {
      const btn = el("button", { class: "btn-secondary quiz-opt", onclick: () => {
        const correct = quizScore(q, i);
        btn.classList.add(correct ? "correct" : "wrong");
        if (correct) {
          Storage.saveProfile({ totalXp: (Storage.getProfile().totalXp || 0) + 5, perfectQuizzes: (Storage.getProfile().perfectQuizzes || 0) + 1 });
          toast(`✓ +5 XP — ${q.ref}`, "success", 4000);
        } else {
          toast(`✗ Bonne réponse : « ${q.options[q.correct]} » — ${q.ref}`, "error", 5000);
        }
        Array.from(quizCard.querySelectorAll(".quiz-opt")).forEach(b => b.disabled = true);
      }}, [opt]);
      quizCard.appendChild(btn);
    });
    recap.appendChild(quizCard);
  }

  const actions = el("div", { class: "actions-row" }, [
    el("button", { class: "btn-primary", onclick: async () => {
      try {
        await shareVerdict(caseData, verdict, profile);
        Storage.saveProfile({ shared: true });
        toast("Verdict partagé", "success");
      } catch { toast("Échec du partage", "error"); }
    }}, ["📤 Partager"]),
    el("button", { class: "btn-secondary", onclick: () => navigate("history") }, ["📜 Archives"]),
    el("button", { class: "btn-secondary", onclick: () => startFreeAudience(root) }, ["🎲 Audience libre"]),
    el("button", { class: "btn-secondary", onclick: () => renderTribunal(root) }, ["⚖ Tableau de bord"]),
  ]);
  recap.appendChild(actions);

  container.appendChild(recap);
}
