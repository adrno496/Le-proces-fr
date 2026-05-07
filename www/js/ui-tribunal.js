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
import { listHistoric, getHistoric } from "./historic-cases.js";
import { t, getLang } from "./i18n.js";
import { playHammer, primeAudio, startWhispers, stopWhispers } from "./audio.js";
import { recordVerdictForQuests, getQuests, describeQuest, rewardFor, claimReward } from "./quests.js";
import { buildJury, tally, juryVerdict } from "./jury.js";
import { vibrate, HAPTIC } from "./a11y.js";
import { pickRandomGuessCase, markGuessSeen, GUESS_CASES } from "./guess-sentence.js";
import { quoteOfTheSession } from "./citations.js";
import { todaysEntry as historicTodaysEntry } from "./historic-calendar.js";
import { decorateText, showGlossaryPopup } from "./glossary.js";
import { canClaim as canClaimLoot, claim as claimLoot } from "./lootbox.js";
import { tipOfTheSession } from "./tips.js";
import { buildChallengeLink, readChallengeFromURL, clearChallengeFromURL } from "./challenge-link.js";
import { fireConfetti } from "./confetti.js";
import { SAGAS, getSagaProgress, recordSagaVerdict, getNextSagaChapter } from "./sagas.js";
import { activeSeason } from "./seasons.js";
import { maybeTwist } from "./ia-audience.js";
import { currentChapter, chapterByDate, shouldShowChapter, markChapterSeen } from "./narrative.js";
import { shareVerdict, shareEmojiVerdict } from "./share.js";
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
      if (this.i >= this.text.length) {
        // Once complete, replace text with glossary-decorated content
        this.node.textContent = "";
        const frag = decorateText(this.text, (term, def) => showGlossaryPopup(term, def));
        if (frag) this.node.appendChild(frag);
        return;
      }
      this.node.textContent += this.text[this.i++];
      typewriterTimer = setTimeout(tick, this.speed);
    };
    tick();
  }
  finish() {
    this.node.textContent = "";
    const frag = decorateText(this.text, (term, def) => showGlossaryPopup(term, def));
    if (frag) this.node.appendChild(frag);
    this.i = this.text.length;
  }
}

function difficultyDots(d) {
  return "●".repeat(Math.max(1, Math.min(5, d))) + "○".repeat(5 - Math.max(1, Math.min(5, d)));
}

export async function renderTribunal(root) {
  stopTTS();
  stopWhispers();
  clear(root);
  // Cas de défi reçu par lien
  if (typeof window !== "undefined") {
    const challenge = readChallengeFromURL();
    if (challenge && !window._leprocesChallengeLoaded) {
      window._leprocesChallengeLoaded = true;
      window._leprocesFreeCase = { ...challenge, kind: "challenge", caseNumber: "DÉFI" };
      clearChallengeFromURL();
      toast(t("challenge.received") + (challenge.challengerVerdict ? ` (${t("challenge.their_verdict")} ${t(`card.daily.${challenge.challengerVerdict}`)})` : ""), "info", 5000);
    }
    if (window._leprocesFreeCase) return renderCaseFlow(root, "free");
    if (window._leprocesHistoricCase) return renderCaseFlow(root, "historic");
  }
  return renderDashboard(root);
}

// =====================================================================
// DASHBOARD : page d'accueil regroupant TOUT
// =====================================================================
async function renderDashboard(root) {
  const settings = Storage.getSettings();
  const profile = Storage.getProfile();
  const today = getTodayDateStr();

  // Display current chapter (one-shot per month) — uniquement APRÈS onboarding
  if (settings.onboarded && shouldShowChapter()) {
    setTimeout(() => showChapterModal(), 600);
  }
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
      el("h1", {}, [t("profile.master", { name: profile.username || t("settings.username_default") })]),
      el("div", { class: "dash-tier" }, [`${tier.icon} ${tier.name}`]),
      el("div", { class: "dash-rep" }, [`${reputation.icon} ${reputation.label}`]),
      el("div", { class: "xp-bar dash-xp" }, [
        el("div", { class: "xp-bar-fill", style: { width: `${tProg.pct}%` } }),
        el("div", { class: "xp-bar-label" }, [
          tProg.next ? `${profile.totalVerdicts || 0} / ${tProg.next.minVerdicts} verdicts` : "Sommet atteint",
        ]),
      ]),
      el("div", { class: "dash-streak" }, [`🔥 ${profile.streak || 0} ${(profile.streak || 0) > 1 ? "j" : "j"}  ·  ⭐ ${profile.totalXp || 0} XP`]),
      (() => {
        const milestones = [7, 30, 100, 365];
        const cur = profile.streak || 0;
        const next = milestones.find(m => m > cur);
        if (!next) return null;
        const remaining = next - cur;
        return el("div", { class: "dash-streak-next" }, [`${t("streak.next", { n: next })} (${remaining})`]);
      })(),
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
    el("div", { class: "card-title" }, [t("card.daily.title")]),
    el("div", { class: "card-body" }, [
      verdictToday
        ? `${t("card.daily.judged")} · ${verdictToday.verdict === "guilty" ? t("card.daily.guilty") : t("card.daily.innocent")}`
        : settings.apiKey ? t("card.daily.ai") : t("card.daily.offline"),
    ]),
    el("div", { class: "card-cta" }, [verdictToday ? t("card.daily.review") : t("card.daily.cta")]),
  ]);
  grid.appendChild(dailyCard);

  // CARD 2 : Audience libre
  const freeCard = el("button", { class: "dash-card dash-free", onclick: () => startFreeAudience(root) }, [
    el("div", { class: "card-icon" }, ["🎲"]),
    el("div", { class: "card-title" }, [t("card.free.title")]),
    el("div", { class: "card-body" }, [t("card.free.body")]),
    el("div", { class: "card-cta" }, [t("card.free.cta")]),
  ]);
  grid.appendChild(freeCard);

  // CARD 3 : Procès historiques
  const histCount = (profile.historicJudged || []).length;
  const histCard = el("button", { class: "dash-card dash-hist", onclick: () => showHistoricModal(root) }, [
    el("div", { class: "card-icon" }, ["📜"]),
    el("div", { class: "card-title" }, [t("card.historic.title")]),
    el("div", { class: "card-body" }, [t("card.historic.body", { judged: histCount })]),
    el("div", { class: "card-cta" }, [t("card.historic.cta")]),
  ]);
  grid.appendChild(histCard);

  // CARD 4 : Défi de la semaine
  const wpct = Math.round((wpCur / ch.target) * 100);
  const weeklyCard = el("button", { class: "dash-card dash-weekly", onclick: () => showWeeklyModal(root) }, [
    el("div", { class: "card-icon" }, ["📅"]),
    el("div", { class: "card-title" }, [t("card.weekly.title")]),
    el("div", { class: "card-body" }, [t("card.weekly.summary", { label: ch.label, cur: wpCur, target: ch.target })]),
    el("div", { class: "weekly-mini-bar" }, [el("div", { class: "weekly-mini-fill", style: { width: `${wpct}%` } })]),
    el("div", { class: "card-cta" }, [t("card.weekly.cta")]),
  ]);
  grid.appendChild(weeklyCard);

  // CARD 4 bis : Quêtes hebdomadaires
  const quests = getQuests();
  const completedCount = quests.completed.length;
  const questsCard = el("button", { class: "dash-card dash-quests", onclick: () => showQuestsModal(root) }, [
    el("div", { class: "card-icon" }, ["🎯"]),
    el("div", { class: "card-title" }, [t("quests.title")]),
    el("div", { class: "card-body" }, [`${completedCount} / 3`]),
    el("div", { class: "weekly-mini-bar" }, [el("div", { class: "weekly-mini-fill", style: { width: `${(completedCount / 3) * 100}%` } })]),
    el("div", { class: "card-cta" }, [t("card.weekly.cta")]),
  ]);
  grid.appendChild(questsCard);

  // CARD : Saga en cours
  const saga = SAGAS[0];
  const sagaProgress = getSagaProgress(saga.id);
  const sagaCard = el("button", { class: "dash-card dash-saga", onclick: () => showSagaModal(root) }, [
    el("div", { class: "card-icon" }, ["🎬"]),
    el("div", { class: "card-title" }, [saga.title]),
    el("div", { class: "card-body" }, [`Acte ${Math.min(sagaProgress.progress + 1, saga.chapters.length)} / ${saga.chapters.length}`]),
    el("div", { class: "weekly-mini-bar" }, [el("div", { class: "weekly-mini-fill", style: { width: `${(sagaProgress.progress / saga.chapters.length) * 100}%` } })]),
    el("div", { class: "card-cta" }, [t("saga.cta")]),
  ]);
  grid.appendChild(sagaCard);

  // CARD : Loot box quotidien
  if (canClaimLoot()) {
    const lootCard = el("button", { class: "dash-card dash-loot pulse-glow", onclick: () => showLootModal(root) }, [
      el("div", { class: "card-icon" }, ["🎁"]),
      el("div", { class: "card-title" }, [t("loot.title")]),
      el("div", { class: "card-body" }, [t("loot.body")]),
      el("div", { class: "card-cta" }, [t("loot.cta")]),
    ]);
    grid.appendChild(lootCard);
  }

  // CARD 5 : Devine la peine (mode mini-jeu)
  const guessCard = el("button", { class: "dash-card dash-guess", onclick: () => showGuessSentenceModal(root) }, [
    el("div", { class: "card-icon" }, ["⚖"]),
    el("div", { class: "card-title" }, [t("guess.title")]),
    el("div", { class: "card-body" }, [t("guess.body")]),
    el("div", { class: "card-cta" }, [t("guess.cta")]),
  ]);
  grid.appendChild(guessCard);

  // CARD 6 : Catégories
  const catCard = el("div", { class: "dash-card dash-categories" }, [
    el("div", { class: "card-icon" }, ["🎭"]),
    el("div", { class: "card-title" }, [t("card.categories.title")]),
    el("div", { class: "muted" }, [t("card.categories.help")]),
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

  // Banner de saison thématique active
  const season = activeSeason();
  if (season) {
    container.appendChild(el("div", { class: "season-banner" }, [
      el("span", { class: "season-emoji" }, [season.emoji]),
      el("span", { class: "season-title" }, [season.title[getLang()] || season.title.fr]),
    ]));
  }

  // Tip rotatif
  container.appendChild(el("div", { class: "tip-bar" }, [tipOfTheSession(getLang())]));

  // Citation rotative en pied de hero
  const q = quoteOfTheSession();
  if (q) {
    container.appendChild(el("blockquote", { class: "session-quote" }, [
      el("div", { class: "quote-text" }, [`« ${q.quote} »`]),
      el("div", { class: "quote-author muted" }, [`— ${q.author}`]),
    ]));
  }

  // Calendrier historique : "Aujourd'hui dans l'histoire"
  const histDay = historicTodaysEntry();
  if (histDay) {
    container.appendChild(el("div", { class: "history-today" }, [
      el("div", { class: "history-today-label" }, [t("history_today.label")]),
      el("div", { class: "history-today-date" }, [`${histDay.year}`]),
      el("div", { class: "history-today-title" }, [histDay.title]),
      el("div", { class: "history-today-body muted" }, [histDay.body]),
    ]));
  }

  // No API key warning
  if (!settings.apiKey) {
    container.appendChild(el("div", { class: "dash-warning" }, [
      el("strong", {}, ["ℹ " + t("nav.settings")]),
      el("p", {}, [t("app.no_key_msg")]),
      el("button", { class: "btn-secondary", onclick: () => navigate("settings") }, ["⚙ " + t("nav.settings")]),
    ]));
  }
  if (getLang() === "en") {
    container.appendChild(el("p", { class: "muted", style: { textAlign: "center", marginTop: "8px", fontSize: "0.78rem" } }, [t("app.legal_notice")]));
  }
}

// Modal "Chapitre narratif"
function showChapterModal() {
  const ch = currentChapter();
  const overlay = el("div", { class: "modal-overlay", onclick: e => { if (e.target.classList.contains("modal-overlay")) close(); } });
  const modal = el("div", { class: "modal modal-chapter" });
  modal.appendChild(el("div", { class: "chapter-num" }, [t("narrative.title", { n: ch.id })]));
  modal.appendChild(el("h2", { class: "chapter-title" }, [ch.title]));
  modal.appendChild(el("p", { class: "chapter-hook" }, [ch.hook]));
  const btn = el("button", { class: "btn-primary", onclick: () => close() }, [t("narrative.dismiss")]);
  modal.appendChild(btn);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  function close() { markChapterSeen(); overlay.remove(); }
}

// Modal "Rebondissement IA" — appelé pendant l'audience quand l'IA injecte un twist
function showTwistModal(twist, caseData, container) {
  vibrate(HAPTIC.milestone);
  const overlay = el("div", { class: "modal-overlay twist-overlay", onclick: e => { if (e.target.classList.contains("modal-overlay")) close(); } });
  const modal = el("div", { class: "modal modal-twist" });
  modal.appendChild(el("div", { class: "twist-flash" }, ["⚡"]));
  modal.appendChild(el("div", { class: "twist-tag" }, [t(`twist.type.${twist.type}`) || t("twist.generic")]));
  modal.appendChild(el("h2", { class: "twist-title" }, [twist.title]));
  modal.appendChild(el("p", { class: "twist-narrative" }, [twist.narrative]));
  if (twist.type === "evidence" && twist.evidenceLabel) {
    modal.appendChild(el("div", { class: "twist-evidence-hint muted" }, [
      "📎 " + t("twist.new_evidence_added") + " : " + twist.evidenceLabel,
    ]));
  }
  modal.appendChild(el("button", { class: "btn-primary", onclick: () => close() }, [t("twist.continue")]));
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  function close() {
    overlay.remove();
    // Refresh evidence section if a new piece was added
    if (twist.type === "evidence") {
      const evSection = container.querySelector(".evidence-section");
      if (evSection) {
        // Trigger a re-render of the evidence section by re-adding the new card
        const grid = evSection.querySelector(".evidence-grid");
        const newPiece = caseData.evidence[caseData.evidence.length - 1];
        if (grid && newPiece && newPiece.isTwist) {
          const card = el("button", { class: "evidence-card evidence-twist", onclick: () => openEvidenceModal(newPiece, card) }, [
            el("div", { class: "ev-icon" }, ["⚡"]),
            el("div", { class: "ev-label" }, [newPiece.label]),
          ]);
          grid.appendChild(card);
        }
      }
    }
  }
}

// Modal "Saga"
function showSagaModal(root) {
  const saga = SAGAS[0];
  const progress = getSagaProgress(saga.id);
  const overlay = el("div", { class: "modal-overlay", onclick: e => { if (e.target.classList.contains("modal-overlay")) overlay.remove(); } });
  const modal = el("div", { class: "modal modal-large modal-saga" });
  modal.appendChild(el("h2", {}, ["🎬 " + saga.title]));
  modal.appendChild(el("p", { class: "muted" }, [saga.desc]));
  const list = el("div", { class: "saga-acts" });
  saga.chapters.forEach((ch, idx) => {
    const done = idx < progress.progress;
    const current = idx === progress.progress;
    const locked = idx > progress.progress;
    const act = el("div", { class: `saga-act ${done ? "done" : ""} ${current ? "current" : ""} ${locked ? "locked" : ""}` }, [
      el("div", { class: "saga-act-num" }, [`${idx + 1}`]),
      el("div", { class: "saga-act-info" }, [
        el("div", { class: "saga-act-title" }, [ch.title]),
        el("div", { class: "saga-act-desc muted" }, [ch.context.slice(0, 120) + "..."]),
      ]),
      done ? el("span", { class: "saga-act-status" }, ["✓"])
           : current ? el("button", { class: "btn-primary", onclick: () => {
               window._leprocesFreeCase = { ...ch, kind: "saga", sagaId: saga.id, sagaChapterIdx: idx, caseNumber: `SAGA-${idx + 1}` };
               overlay.remove();
               renderTribunal(root);
             }}, [t("saga.play")])
           : el("span", { class: "saga-act-status muted" }, ["🔒"]),
    ]);
    list.appendChild(act);
  });
  modal.appendChild(list);
  modal.appendChild(el("button", { class: "btn-secondary", onclick: () => overlay.remove() }, [t("btn.close")]));
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

// Modal "Loot box"
function showLootModal(root) {
  const result = claimLoot();
  if (!result) return;
  vibrate(HAPTIC.success);
  const overlay = el("div", { class: "modal-overlay loot-overlay", onclick: () => overlay.remove() });
  const modal = el("div", { class: "modal modal-loot" });
  modal.appendChild(el("div", { class: "loot-emoji" }, ["🎁"]));
  modal.appendChild(el("h2", {}, [t("loot.opened")]));
  modal.appendChild(el("p", { class: "loot-result" }, [result.label]));
  if (result.entry) modal.appendChild(el("div", { class: "muted" }, [result.entry.body.slice(0, 120) + "..."]));
  if (result.quote) modal.appendChild(el("div", { class: "muted" }, [`— ${result.quote.author}`]));
  modal.appendChild(el("button", { class: "btn-primary", onclick: () => { overlay.remove(); renderTribunal(root); } }, [t("btn.close")]));
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

// Modal "Devine la peine"
function showGuessSentenceModal(root) {
  const c = pickRandomGuessCase();
  const overlay = el("div", { class: "modal-overlay", onclick: e => { if (e.target.classList.contains("modal-overlay")) overlay.remove(); } });
  const modal = el("div", { class: "modal modal-large modal-guess" });
  modal.appendChild(el("h2", {}, ["⚖ " + t("guess.title")]));
  modal.appendChild(el("p", { class: "muted" }, [t("guess.intro")]));
  modal.appendChild(el("h3", {}, [c.title]));
  modal.appendChild(el("p", { class: "guess-desc" }, [c.desc]));
  const optsDiv = el("div", { class: "guess-options" });
  let answered = false;
  c.options.forEach((opt, i) => {
    const btn = el("button", {
      class: "btn-secondary guess-opt",
      onclick: () => {
        if (answered) return;
        answered = true;
        const correct = opt.correctIdx;
        btn.classList.add(correct ? "correct" : "wrong");
        c.options.forEach((o, j) => {
          const optBtn = optsDiv.children[j];
          if (o.correctIdx) optBtn.classList.add("correct");
        });
        markGuessSeen(c.id);
        const profile = Storage.getProfile();
        if (correct) {
          Storage.saveProfile({ totalXp: (profile.totalXp || 0) + 15, guessRight: (profile.guessRight || 0) + 1 });
          vibrate(HAPTIC.success);
          toast(t("guess.correct"), "success", 4000);
        } else {
          vibrate(HAPTIC.error);
          toast(t("guess.wrong"), "info", 4000);
        }
        // Show explanation
        modal.appendChild(el("div", { class: "guess-explanation" }, [el("strong", {}, ["📖 "]), c.explanation]));
        modal.appendChild(el("button", { class: "btn-primary", onclick: () => overlay.remove() }, [t("btn.close")]));
      },
    }, [opt.label]);
    optsDiv.appendChild(btn);
  });
  modal.appendChild(optsDiv);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

// Modal "12 jurés" — délibération dramatisée
function showJuryModal(caseData) {
  const jury = buildJury(caseData);
  const votes = tally(jury);
  const overlay = el("div", { class: "modal-overlay", onclick: e => { if (e.target.classList.contains("modal-overlay")) overlay.remove(); } });
  const modal = el("div", { class: "modal modal-large modal-jury" });
  modal.appendChild(el("h2", {}, ["👥 " + t("jury.title")]));
  modal.appendChild(el("p", { class: "muted" }, [t("jury.intro")]));

  // Tally bar visible
  const tallyBox = el("div", { class: "jury-tally" }, [
    el("span", { class: "jury-tally-guilty" }, [`⚖ ${votes.guilty}`]),
    el("span", { class: "jury-tally-innocent" }, [`🕊 ${votes.innocent}`]),
    el("span", { class: "jury-tally-undecided" }, [`🤔 ${votes.undecided}`]),
  ]);
  modal.appendChild(tallyBox);

  // Grid of 12 jurors with their statements
  const grid = el("div", { class: "jury-grid" });
  jury.forEach((j, idx) => {
    const card = el("div", { class: `juror-card juror-${j.stance}` , style: { animationDelay: `${idx * 80}ms` } }, [
      el("div", { class: "juror-emoji" }, [j.emoji]),
      el("div", { class: "juror-name" }, [j.name]),
      el("div", { class: "juror-style muted" }, [j.style]),
      el("div", { class: "juror-line" }, [`« ${j.statement} »`]),
      el("div", { class: `juror-vote stance-${j.stance}` }, [t(`jury.stance.${j.stance}`)]),
    ]);
    grid.appendChild(card);
  });
  modal.appendChild(grid);

  modal.appendChild(el("button", { class: "btn-primary", onclick: () => overlay.remove() }, [t("btn.close")]));
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  vibrate(HAPTIC.click);
}

// Modal "Quêtes hebdomadaires"
function showQuestsModal(root) {
  const quests = getQuests();
  const overlay = el("div", { class: "modal-overlay", onclick: e => { if (e.target.classList.contains("modal-overlay")) overlay.remove(); } });
  const modal = el("div", { class: "modal modal-large" });
  modal.appendChild(el("h2", {}, [t("quests.title")]));
  modal.appendChild(el("p", { class: "muted" }, [t("quests.intro")]));
  const list = el("div", { class: "quest-list" });
  for (const q of quests.defs) {
    const cur = q.source === "streak" ? Math.min(q.target, quests.progress[q.id] || 0) : (quests.progress[q.id] || 0);
    const done = quests.completed.includes(q.id);
    const pct = Math.min(100, (cur / q.target) * 100);
    list.appendChild(el("div", { class: `quest-item ${done ? "done" : ""}` }, [
      el("div", { class: "quest-desc" }, [describeQuest(q)]),
      el("div", { class: "quest-progress mono" }, [done ? t("quests.completed") : t("quests.progress", { cur, target: q.target })]),
      el("div", { class: "weekly-mini-bar" }, [el("div", { class: "weekly-mini-fill", style: { width: `${pct}%` } })]),
      el("div", { class: "muted", style: { fontSize: "0.78rem" } }, [`+${rewardFor(q)} XP`]),
    ]));
  }
  modal.appendChild(list);
  modal.appendChild(el("button", { class: "btn-secondary", onclick: () => overlay.remove() }, [t("btn.close")]));
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

// Modal "Procès historiques" — accessible depuis le dashboard
function showHistoricModal(root) {
  const profile = Storage.getProfile();
  const judged = profile.historicJudged || [];
  const overlay = el("div", { class: "modal-overlay", onclick: e => { if (e.target.classList.contains("modal-overlay")) overlay.remove(); } });
  const modal = el("div", { class: "modal modal-large modal-historic" });
  modal.appendChild(el("h2", {}, [`📜 ${t("card.historic.title")} (${judged.length} / 40)`]));
  modal.appendChild(el("p", { class: "muted" }, [t("app.legal_notice")]));
  const list = el("div", { class: "history-list" });
  listHistoric().forEach(c => {
    const done = judged.includes(c.id);
    const dot = "●".repeat(c.difficulty) + "○".repeat(5 - c.difficulty);
    list.appendChild(el("div", { class: `history-card ${done ? "done" : ""}` }, [
      el("div", { class: "history-date mono" }, [c.era]),
      el("div", { class: "history-title" }, [c.title]),
      el("div", { class: "history-meta" }, [
        el("span", {}, [`${CATEGORY_ICONS[c.category] || ""} ${CATEGORY_LABELS[c.category] || c.category}`]),
        el("span", {}, [`Difficulté ${dot}`]),
        done ? el("span", { class: "verdict-tag" }, ["✓ Jugé"]) : null,
      ]),
      el("button", { class: "btn-primary", onclick: () => {
        window._leprocesHistoricCase = getHistoric(c.id);
        overlay.remove();
        renderTribunal(root);
      }}, [done ? t("btn.reread") : t("btn.judge")]),
    ]));
  });
  modal.appendChild(list);
  modal.appendChild(el("button", { class: "btn-secondary", onclick: () => overlay.remove() }, [t("btn.close")]));
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

// Modal "Défi de la semaine" — détails + bouton de lancement
function showWeeklyModal(root) {
  const ch = currentChallenge();
  const wp = weeklyGet();
  const cur = wp.week === ch.week ? wp.completed : 0;
  const pct = Math.round((cur / ch.target) * 100);
  const overlay = el("div", { class: "modal-overlay", onclick: e => { if (e.target.classList.contains("modal-overlay")) overlay.remove(); } });
  const modal = el("div", { class: "modal modal-weekly" });
  modal.appendChild(el("h2", {}, [`📅 ${ch.label}`]));
  modal.appendChild(el("div", { class: "muted mono" }, [`Semaine ISO ${ch.week}`]));
  modal.appendChild(el("p", {}, [ch.description]));
  modal.appendChild(el("div", { class: "xp-bar weekly-bar-large" }, [
    el("div", { class: "xp-bar-fill", style: { width: `${pct}%` } }),
    el("div", { class: "xp-bar-label" }, [`${cur} / ${ch.target} verdicts`]),
  ]));
  if (cur >= ch.target) {
    modal.appendChild(el("div", { class: "weekly-done" }, ["✅ Défi accompli — bravo Maître."]));
  } else {
    modal.appendChild(el("button", { class: "btn-primary btn-big", onclick: async () => {
      overlay.remove();
      toast(`⚖ Génération d'une audience ${CATEGORY_LABELS[ch.category]}...`, "info", 1500);
      try {
        window._leprocesFreeCase = await generateFreeCase({ category: ch.category });
        renderTribunal(root);
      } catch (e) { toast(e.message || "Erreur", "error", 4000); }
    }}, [`⚖ Tenir une audience ${CATEGORY_LABELS[ch.category]}`]));
  }
  modal.appendChild(el("button", { class: "btn-secondary", onclick: () => overlay.remove() }, ["FERMER"]));
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
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
  }}, [t("btn.back")]));

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
  container.appendChild(el("button", { class: "btn-back", onclick: () => renderTribunal(root) }, [t("btn.back")]));
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
      ctx.kind === "free" ? t("case.free") :
      ctx.kind === "historic" ? `${t("case.historic")}${caseData.era ? " — " + caseData.era : ""}` :
      formatDate(today).toUpperCase()
    ]),
    el("div", { class: "case-number" }, [`${t("case.dossier")} ${caseData.caseNumber}`]),
    el("hr", { class: "rule-double" }),
    el("h1", { class: "case-title" }, [caseData.title]),
    el("hr", { class: "rule-double" }),
    el("div", { class: "case-meta" }, [
      el("span", { class: "case-meta-item" }, [`${CATEGORY_ICONS[caseData.category] || ""} ${t(`cat.${caseData.category}`) || caseData.category}`]),
      el("span", { class: "case-meta-item" }, [`${t("case.difficulty")} ${difficultyDots(caseData.difficulty || 3)}`]),
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
  if (caseData.codexCitation) flavors.push(`📖 ${t("flavor.codex_cited")} : ${caseData.codexCitation.label} — ${caseData.codexCitation.body.slice(0, 120)}...`);
  if (flavors.length) {
    const fl = el("div", { class: "flavor-section" });
    flavors.forEach(f => fl.appendChild(el("div", { class: "flavor-line" }, [f])));
    container.appendChild(fl);
  }

  // Affichage des plaidoiries — avec niveau d'avocat visible
  const speechWrap = el("div", { class: "speech-stage hidden" });
  const proseHeader = el("div", { class: "speech-header" }, [
    el("h3", { class: "speech-title" }, [`${t("speech.prosecution")}  ${"★".repeat(caseData.prosecutionQuality || 3)}${"☆".repeat(5 - (caseData.prosecutionQuality || 3))}`]),
    ttsSupported() ? el("button", { class: "btn-icon", title: t("speech.tts_listen"),
      onclick: () => listenSpeeches(caseData) }, ["🔊"]) : null,
  ]);
  const proseText = el("div", { class: "speech-text" });
  const defHeader = el("div", { class: "speech-header" }, [
    el("h3", { class: "speech-title" }, [`${t("speech.defense")}  ${"★".repeat(caseData.defenseQuality || 3)}${"☆".repeat(5 - (caseData.defenseQuality || 3))}`]),
  ]);
  const defText = el("div", { class: "speech-text" });
  speechWrap.append(proseHeader, proseText, defHeader, defText);

  const startBtn = el("button", { class: "btn-primary btn-big", onclick: () => {
    primeAudio(); // user gesture → autorise la lecture future
    startWhispers(); // 🔉 ambiance de tribunal pendant la lecture
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
  }}, [t("speech.open_hearing")]);
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

      // 🎬 Audience IA : possibilité d'un rebondissement adaptatif
      try {
        const twist = await maybeTwist(caseData, qaState);
        if (twist) showTwistModal(twist, caseData, container);
      } catch {} // silence — twist optionnel
    } catch (e) {
      row.querySelector(".qa-answer").textContent = `⚠ ${e.message}`;
      toast(e.message, "error");
    }
    askBtn.disabled = false;
    askBtn.textContent = t("witness.ask");
  });
  qaWrap.appendChild(el("div", { class: "input-row" }, [qaInput, askBtn]));
  container.appendChild(qaWrap);

  // Verdict block
  const verdictWrap = el("section", { class: "verdict-section" });
  verdictWrap.appendChild(el("h3", { class: "section-subtitle" }, [t("verdict.title")]));
  let chosen = null;
  const guiltyBtn = el("button", { class: "verdict-btn verdict-guilty", onclick: () => { chosen = "guilty"; updateBtns(); } }, [t("verdict.guilty")]);
  const innocentBtn = el("button", { class: "verdict-btn verdict-innocent", onclick: () => { chosen = "innocent"; updateBtns(); } }, [t("verdict.innocent")]);
  function updateBtns() {
    guiltyBtn.classList.toggle("selected", chosen === "guilty");
    innocentBtn.classList.toggle("selected", chosen === "innocent");
  }
  verdictWrap.appendChild(el("div", { class: "verdict-row" }, [guiltyBtn, innocentBtn]));

  const sevLabel = el("div", { class: "slider-label" }, [`${t("verdict.severity")} : ${t("verdict.severity_3")} (3)`]);
  const slider = el("input", { type: "range", min: "1", max: "5", value: "3", class: "slider" });
  slider.addEventListener("input", e => {
    const v = +e.target.value;
    sevLabel.textContent = `${t("verdict.severity")} : ${t(`verdict.severity_${v}`)} (${v})`;
  });
  verdictWrap.append(sevLabel, slider);

  // Bouton "Consulter le jury" — affiche les 12 jurés et leurs avis avant le vote
  verdictWrap.appendChild(el("button", {
    class: "btn-secondary jury-toggle",
    onclick: () => showJuryModal(caseData),
  }, ["👥 " + t("jury.consult")]));

  const argInput = el("textarea", { class: "text-input textarea", maxlength: "500", placeholder: t("verdict.argument_placeholder") });
  verdictWrap.appendChild(argInput);
  const submitBtn = el("button", { class: "btn-primary btn-big hammer-btn", onclick: async () => {
    if (!chosen) return toast(t("verdict.choose_first"), "error");
    submitBtn.disabled = true;
    submitBtn.classList.add("hammering");
    stopWhispers(); // silence dans la salle
    playHammer(); // 🔨 son du marteau au prononcé du verdict
    const argument = argInput.value.trim();
    const severity = +slider.value;
    const verdictRec = await submitVerdict(caseData, today, chosen, severity, argument, qaState.length, ctx);
    setTimeout(() => {
      // Reset transient mode + show recap inline
      if (typeof window !== "undefined") { window._leprocesFreeCase = null; window._leprocesHistoricCase = null; }
      clear(container);
      container.appendChild(el("button", { class: "btn-back", onclick: () => renderTribunal(root) }, [t("btn.back")]));
      renderVerdictRecap(container, caseData, verdictRec, root, ctx.kind || "daily");
    }, 1100);
  }}, [t("verdict.submit")]);
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
    totalVerdicts: (profile.totalVerdicts || 0) + 1,
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

  // Saga progression
  if (caseData.sagaId != null && caseData.sagaChapterIdx != null) {
    recordSagaVerdict(caseData.sagaId, caseData.sagaChapterIdx, { verdict, severity, score: evaluation.score });
  }

  recordOutcome(caseData.defendant?.id, today, caseData.category, verdict, caseData.title);
  recordVerdictForChallenge(caseData.category);
  const newCodexIds = unlockForCategory(caseData.category);

  // ===== Quests =====
  const allEvidenceExamined = (caseData.evidence || []).length > 0 && (caseData.evidence || []).every(e => e.examined);
  const askedWitness = questionsCount > 0;
  const completedQuests = recordVerdictForQuests({
    category: caseData.category,
    hasArgument: argument.length >= 60,
    allEvidenceExamined,
    askedWitness,
    alignedWithTruth: evaluation.aligned,
    streak: newStreak,
  });
  // Award XP bonus for each completed quest
  for (const q of completedQuests) {
    const bonusXp = claimReward(q.id);
    if (bonusXp > 0) {
      Storage.saveProfile({ totalXp: (Storage.getProfile().totalXp || 0) + bonusXp });
      setTimeout(() => toast(t("quests.reward", { xp: bonusXp }) + " — " + describeQuest(q), "success", 5000), 600);
    }
  }
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

  // Streak milestone reward
  const milestones = [7, 30, 100, 365];
  let streakMilestone = null;
  for (const m of milestones) {
    if ((profile.streak || 0) < m && newStreak >= m) { streakMilestone = m; break; }
  }
  if (streakMilestone) {
    const bonus = streakMilestone * 5;
    Storage.saveProfile({ totalXp: (Storage.getProfile().totalXp || 0) + bonus });
    setTimeout(() => toast(t(`streak.reward.${streakMilestone}`) + ` (+${bonus} XP)`, "success", 6000), 3500);
  }

  // 🎉 Confettis si verdict exemplaire (score ≥ 85 ET aligné)
  if (evaluation.aligned && evaluation.score >= 85) {
    setTimeout(() => fireConfetti({ count: 100 }), 200);
    vibrate(HAPTIC.milestone);
  } else if (evaluation.aligned) {
    vibrate(HAPTIC.success);
  } else {
    vibrate(HAPTIC.verdict);
  }

  toast(t("verdict.gained", { xp, label: t(evaluation.label) || evaluation.label }), evaluation.aligned ? "success" : "info", 4000);
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
  truthBox.appendChild(el("div", { class: "truth-title" }, [t("truth.title")]));
  truthBox.appendChild(el("div", { class: "truth-line" }, [
    `${caseData.truth === "guilty" ? t("truth.line_guilty") : t("truth.line_innocent")} (${t("truth.clarity")} : ${"●".repeat(caseData.truthClarity || 3)}${"○".repeat(5 - (caseData.truthClarity || 3))}).`,
  ]));
  truthBox.appendChild(el("div", { class: "truth-eval" }, [
    `${evaluation.aligned ? "🎯" : "🤔"} ${t(evaluation.label) || evaluation.label} — ${t("truth.score")} : ${evaluation.score}/100`,
  ]));
  truthBox.appendChild(el("div", { class: "truth-lawyers" }, [
    el("div", {}, [`${t("truth.lawyer_p")} : ${"★".repeat(caseData.prosecutionQuality || 3)}${"☆".repeat(5 - (caseData.prosecutionQuality || 3))}`]),
    el("div", {}, [`${t("truth.lawyer_d")}   : ${"★".repeat(caseData.defenseQuality || 3)}${"☆".repeat(5 - (caseData.defenseQuality || 3))}`]),
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
        toast(t("toast.verdict_shared"), "success");
      } catch { toast(t("toast.share_failed"), "error"); }
    }}, [t("btn.share")]),
    el("button", { class: "btn-secondary", onclick: async () => {
      const result = await shareEmojiVerdict(caseData, verdict);
      Storage.saveProfile({ shared: true });
      if (result === "copied") toast(t("share.copied"), "success");
      else if (result === "shared") toast(t("toast.verdict_shared"), "success");
      else toast(t("toast.share_failed"), "error");
    }}, ["📋 Emojis"]),
    el("button", { class: "btn-secondary", onclick: () => navigate("history") }, [t("btn.archives")]),
    el("button", { class: "btn-secondary", onclick: () => startFreeAudience(root) }, [t("btn.free_audience")]),
    el("button", { class: "btn-secondary", onclick: () => renderTribunal(root) }, [t("btn.dashboard")]),
    el("button", { class: "btn-secondary", onclick: async () => {
      const link = buildChallengeLink(caseData, verdict);
      if (navigator.share) {
        try { await navigator.share({ title: t("challenge.share.title"), text: t("challenge.share.text"), url: link }); return; } catch {}
      }
      try { await navigator.clipboard.writeText(link); toast(t("challenge.copied"), "success"); }
      catch { toast(link, "info", 6000); }
    }}, ["⚔ " + t("challenge.btn")]),
  ]);
  recap.appendChild(actions);

  container.appendChild(recap);
}
