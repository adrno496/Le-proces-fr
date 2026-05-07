// Profile panel — career, reputation, cabinet, codex, jurisprudence, achievements.

import { el, clear, navigate, toast } from "./app.js";
import { Storage, levelFromXp } from "./storage.js";
import { ACHIEVEMENTS, CATEGORY_LABELS } from "./case-engine.js";
import { CABINET_ITEMS, getCabinet, progress as cabinetProgress } from "./cabinet.js";
import { computeHeatmap } from "./heatmap.js";
import { CODEX_ENTRIES, getCodex, progress as codexProgress, isUnlocked, explainMore, searchCodex, legifranceUrl } from "./codex.js";
import { t } from "./i18n.js";
import { computeReputation } from "./reputation.js";
import { getCurrentTier, getNextTier, tierProgress, CAREER_TIERS } from "./career.js";
import { getPrecedents } from "./jurisprudence.js";
import { getRoster } from "./parties.js";

const AVATARS = ["👨‍⚖", "👩‍⚖", "🧑‍⚖", "🦉", "🦅", "🐈‍⬛", "🐺", "🦊", "🦁", "🐉", "🌟", "📚", "⚖", "🏛", "🔨", "🕊"];

let activeTab = "stats";

export function renderProfile(root) {
  clear(root);
  const profile = Storage.getProfile();
  const achievements = Storage.getAchievements();
  const lvl = levelFromXp(profile.totalXp);
  const tier = getCurrentTier(profile);
  const tierProg = tierProgress(profile);
  const reputation = computeReputation(profile);

  const container = el("div", { class: "panel panel-profile" });
  container.appendChild(el("div", { class: "panel-title-with-logo" }, [
    el("img", { src: "icons/logo.png", alt: "", class: "title-logo" }),
    el("h1", { class: "panel-title" }, [t("panel.profile")]),
  ]));

  // ===== Header =====
  container.appendChild(el("div", { class: "profile-header" }, [
    el("div", { class: "profile-avatar" }, [AVATARS[profile.avatarId] || "👨‍⚖"]),
    el("div", { class: "profile-identity" }, [
      el("div", { class: "profile-name" }, [t("profile.master", { name: profile.username })]),
      el("div", { class: "profile-level" }, [`${tier.icon} ${tier.name}`]),
      el("div", { class: "reputation-tag" }, [`${reputation.icon} ${reputation.label}`]),
      el("div", { class: "xp-bar" }, [
        el("div", { class: "xp-bar-fill", style: { width: `${tierProg.pct}%` } }),
        el("div", { class: "xp-bar-label" }, [
          tierProg.next
            ? `${profile.totalVerdicts || 0} / ${tierProg.next.minVerdicts} verdicts → ${tierProg.next.name}`
            : `Sommet atteint — ${profile.totalVerdicts} verdicts`,
        ]),
      ]),
    ]),
  ]));

  // ===== Tabs =====
  const tabs = el("div", { class: "tabs-row" });
  const TABS = [
    { id: "stats",          label: t("profile.tab.stats") },
    { id: "career",         label: t("profile.tab.career") },
    { id: "reputation",     label: t("profile.tab.reputation") },
    { id: "cabinet",        label: t("profile.tab.cabinet") },
    { id: "codex",          label: t("profile.tab.codex") },
    { id: "jurisprudence",  label: t("profile.tab.jurisprudence") },
    { id: "parties",        label: t("profile.tab.parties") },
    { id: "achievements",   label: t("profile.tab.achievements") },
  ];
  TABS.forEach(t => tabs.appendChild(el("button", {
    class: `tab-btn ${activeTab === t.id ? "active" : ""}`,
    onclick: () => { activeTab = t.id; container.querySelector(".tab-content")?.remove(); container.appendChild(renderTabContent(profile, achievements, lvl, tier, reputation)); container.querySelectorAll(".tab-btn").forEach(b => b.classList.toggle("active", b.dataset.id === t.id)); },
    "data-id": t.id,
  }, [t.label])));
  container.appendChild(tabs);
  container.appendChild(renderTabContent(profile, achievements, lvl, tier, reputation));

  root.appendChild(container);
}

function renderTabContent(profile, achievements, lvl, tier, reputation) {
  const wrap = el("div", { class: "tab-content" });
  switch (activeTab) {
    case "stats":         return renderStats(wrap, profile, lvl);
    case "career":        return renderCareer(wrap, profile, tier);
    case "reputation":    return renderReputation(wrap, reputation);
    case "cabinet":       return renderCabinet(wrap, profile);
    case "codex":         return renderCodex(wrap);
    case "jurisprudence": return renderJurisprudence(wrap);
    case "parties":       return renderParties(wrap);
    case "achievements":  return renderAchievements(wrap, achievements);
    default:              return renderStats(wrap, profile, lvl);
  }
}

function renderStats(wrap, profile, lvl) {
  const total = profile.totalVerdicts || 0;
  const guiltyRate = total > 0 ? Math.round((profile.guiltyCount / total) * 100) : 0;
  const avgDifficulty = total > 0 ? (profile.difficultySum / total).toFixed(1) : "0.0";
  const avgJudgmentScore = total > 0 ? Math.round((profile.judgmentScoreSum || 0) / total) : 0;
  const alignmentRate = total > 0 ? Math.round(((profile.alignedVerdicts || 0) / total) * 100) : 0;
  let topCategory = "—", topCount = 0;
  for (const [c, n] of Object.entries(profile.categoryCounts || {})) {
    if (n > topCount) { topCount = n; topCategory = CATEGORY_LABELS[c] || c; }
  }
  const cabP = cabinetProgress();
  const codP = codexProgress();
  const achs = Storage.getAchievements().length;

  let topCategoryLabel = "—";
  if (topCount > 0) topCategoryLabel = t(`cat.${topCategory.toLowerCase()}`) || topCategory;
  // re-derive topCategory key for translation
  let topCatKey = "—", topCatCount = 0;
  for (const [c, n] of Object.entries(profile.categoryCounts || {})) {
    if (n > topCatCount) { topCatCount = n; topCatKey = c; }
  }
  const topCatTranslated = topCatCount > 0 ? t(`cat.${topCatKey}`) : "—";

  const grid = el("div", { class: "stats-grid" });
  const rows = [
    [t("profile.stat.streak_current"),  `${profile.streak || 0}`],
    [t("profile.stat.streak_best"),     `${profile.longestStreak || 0}`],
    [t("profile.stat.total_verdicts"),  String(total)],
    [t("profile.stat.total_xp"),        String(profile.totalXp || 0)],
    [t("profile.stat.judgment_score"),  `${avgJudgmentScore} / 100`],
    [t("profile.stat.alignment"),       `${alignmentRate} %`],
    [t("profile.stat.guilty_rate"),     `${guiltyRate} %`],
    [t("profile.stat.arguments"),       String(profile.argumentsWritten || 0)],
    [t("profile.stat.questions"),       String(profile.questionsAsked || 0)],
    [t("profile.stat.fav_category"),    `${topCatTranslated}${topCatCount ? ` (${topCatCount})` : ""}`],
    [t("profile.stat.avg_difficulty"),  `${avgDifficulty} / 5`],
    [t("profile.stat.precedents"),      String(profile.precedentsCreated || 0)],
    [t("profile.stat.free_audiences"),  String(profile.freeAudiencesCount || 0)],
    [t("profile.stat.historic"),        `${(profile.historicJudged || []).length} / 40`],
    [t("profile.stat.cabinet"),         `${cabP.unlocked} / ${cabP.total} (${cabP.pct} %)`],
    [t("profile.stat.codex"),           `${codP.unlocked} / ${codP.total} (${codP.pct} %)`],
    [t("profile.stat.achievements"),    `${achs} / ${ACHIEVEMENTS.length}`],
    [t("profile.stat.shared"),          profile.shared ? "✓" : "—"],
    [t("profile.stat.tts"),             profile.ttsListened ? "✓" : "—"],
  ];
  for (const [k, v] of rows) {
    grid.appendChild(el("div", { class: "stat-row" }, [
      el("span", { class: "stat-key" }, [k]),
      el("span", { class: "stat-val mono" }, [v]),
    ]));
  }
  wrap.appendChild(grid);

  // Heatmap d'activité (12 dernières semaines)
  wrap.appendChild(el("h3", { class: "section-title", style: { marginTop: "20px" } }, [t("heatmap.title")]));
  const hm = el("div", { class: "heatmap-wrap" });
  wrap.appendChild(hm);
  computeHeatmap().then(({ cells }) => {
    // Layout: 12 columns × 7 rows. Cells arrived row-major (oldest first).
    const grid = el("div", { class: "heatmap-grid" });
    cells.forEach(c => {
      const cell = el("div", { class: `heatmap-cell heatmap-l${c.level}`, title: `${c.key} — ${t("heatmap.day", { n: c.count })}` });
      grid.appendChild(cell);
    });
    hm.appendChild(grid);
  });

  return wrap;
}

function renderCareer(wrap, profile, currentTier) {
  wrap.appendChild(el("p", { class: "muted" }, ["Votre parcours dans la magistrature française."]));
  const list = el("div", { class: "career-list" });
  CAREER_TIERS.forEach(t => {
    const reached = (profile.totalVerdicts || 0) >= t.minVerdicts;
    const isCurrent = t.id === currentTier.id;
    list.appendChild(el("div", { class: `career-card ${reached ? "reached" : "locked"} ${isCurrent ? "current" : ""}` }, [
      el("div", { class: "career-icon" }, [t.icon]),
      el("div", { class: "career-info" }, [
        el("div", { class: "career-name" }, [t.name]),
        el("div", { class: "career-cond" }, [`${t.minVerdicts} verdicts requis · difficulté max ${t.difficultyMax}`]),
        el("div", { class: "career-perks muted" }, [t.perks.join(" · ")]),
      ]),
      el("div", { class: "career-status" }, [reached ? (isCurrent ? "Actuel" : "✓") : "🔒"]),
    ]));
  });
  wrap.appendChild(list);
  return wrap;
}

function renderReputation(wrap, reputation) {
  wrap.appendChild(el("div", { class: "reputation-block" }, [
    el("div", { class: "reputation-icon" }, [reputation.icon]),
    el("div", { class: "reputation-name" }, [reputation.label]),
    el("div", { class: "reputation-desc" }, [reputation.desc]),
  ]));
  if (reputation.traits.length) {
    const list = el("div", { class: "trait-list" });
    reputation.traits.forEach(t => list.appendChild(el("div", { class: "trait-card" }, [
      el("div", { class: "trait-name" }, [t.label]),
      el("div", { class: "trait-desc muted" }, [t.desc]),
    ])));
    wrap.appendChild(list);
  }
  return wrap;
}

function renderCabinet(wrap, profile) {
  const prog = cabinetProgress();
  const cabinet = getCabinet();
  wrap.appendChild(el("div", { class: "section-header" }, [
    el("h3", {}, [`🏠 Cabinet du juge`]),
    el("span", { class: "muted" }, [`${prog.unlocked} / ${prog.total} (${prog.pct} %)`]),
  ]));
  const grid = el("div", { class: "cabinet-grid" });
  CABINET_ITEMS.forEach(it => {
    const owned = cabinet.items.includes(it.id);
    grid.appendChild(el("div", { class: `cabinet-card rarity-${it.rarity} ${owned ? "owned" : "locked"}` }, [
      el("div", { class: "cab-icon" }, [owned ? it.icon : "❓"]),
      el("div", { class: "cab-name" }, [owned ? it.name : "Non débloqué"]),
      el("div", { class: "cab-rarity muted" }, [owned ? it.rarity : ""]),
      el("div", { class: "cab-desc muted" }, [owned ? it.desc : "Continuez à juger pour débloquer."]),
    ]));
  });
  wrap.appendChild(grid);
  return wrap;
}

function renderCodex(wrap) {
  const prog = codexProgress();
  wrap.appendChild(el("div", { class: "section-header" }, [
    el("h3", {}, [t("profile.codex.title")]),
    el("span", { class: "muted" }, [`${prog.unlocked} / ${prog.total} (${prog.pct} %)`]),
  ]));
  wrap.appendChild(el("p", { class: "muted" }, [t("profile.codex.intro")]));

  // Search input
  const search = el("input", {
    type: "search",
    class: "text-input codex-search-input",
    placeholder: t("codex.search"),
  });
  const list = el("div", { class: "codex-list" });
  search.addEventListener("input", e => render(e.target.value));
  wrap.appendChild(search);
  wrap.appendChild(list);

  function render(query = "") {
    while (list.firstChild) list.removeChild(list.firstChild);
    const filtered = searchCodex(query);
    if (!filtered.length) {
      list.appendChild(el("p", { class: "muted" }, [t("codex.no_results")]));
      return;
    }
    const grouped = {};
    filtered.forEach(e => { (grouped[e.code] = grouped[e.code] || []).push(e); });
    for (const [code, entries] of Object.entries(grouped)) {
      list.appendChild(el("h4", { class: "codex-section" }, [code]));
      entries.forEach(e => {
        const ok = isUnlocked(e.id);
        const card = el("div", { class: `codex-entry ${ok ? "unlocked" : "locked"}` });
        card.appendChild(el("div", { class: "codex-label" }, [ok ? e.label : t("profile.codex.locked")]));
        card.appendChild(el("div", { class: "codex-body" }, [ok ? e.body : t("profile.codex.locked_desc")]));
        if (ok) {
          const url = legifranceUrl(e.id);
          if (url) {
            card.appendChild(el("a", {
              class: "codex-legifrance-link",
              href: url, target: "_blank", rel: "noopener noreferrer",
            }, [t("codex.legifrance")]));
          }
          const moreBox = el("div", { class: "codex-more hidden" });
          const moreBtn = el("button", { class: "btn-secondary codex-more-btn", onclick: async () => {
            if (!Storage.getSettings().apiKey) {
              return toast(t("profile.codex.need_key"), "error", 4000);
            }
            moreBtn.disabled = true;
            moreBtn.textContent = t("profile.codex.consulting");
            moreBox.classList.remove("hidden");
            moreBox.textContent = "...";
            try {
              const text = await explainMore(e);
              moreBox.textContent = text;
              moreBtn.textContent = t("profile.codex.deepened");
            } catch (err) {
              moreBox.textContent = "⚠ " + (err.message || "Erreur");
              moreBtn.disabled = false;
              moreBtn.textContent = t("profile.codex.retry");
            }
          }}, [t("profile.codex.more")]);
          card.appendChild(moreBtn);
          card.appendChild(moreBox);
        }
        list.appendChild(card);
      });
    }
  }
  render("");
  return wrap;
}

function renderJurisprudence(wrap) {
  const ps = getPrecedents();
  wrap.appendChild(el("h3", {}, ["📚 Précédents personnels"]));
  if (!ps.length) {
    wrap.appendChild(el("p", { class: "muted" }, ["Aucun précédent encore. Argumentez longuement vos verdicts (≥80 caractères), tenez une streak ≥ 7 jours, ou jugez des cas difficiles (≥4) pour créer vos premiers."]));
    return wrap;
  }
  ps.forEach(p => wrap.appendChild(el("div", { class: "precedent-card" }, [
    el("div", { class: "prec-meta" }, [`${p.date} · ${CATEGORY_LABELS[p.category] || p.category} · cité ${p.citations}×`]),
    el("div", { class: "prec-title" }, [p.title]),
    p.argument ? el("blockquote", { class: "prec-arg" }, [p.argument]) : null,
  ])));
  return wrap;
}

function renderParties(wrap) {
  const r = getRoster();
  wrap.appendChild(el("h3", {}, ["👥 Parties croisées"]));
  if (!r.length) {
    wrap.appendChild(el("p", { class: "muted" }, ["Aucune partie répertoriée. Les visages reviendront au fil des audiences."]));
    return wrap;
  }
  // Sort: récidivistes (>1 lost or won) en premier
  const sorted = [...r].sort((a, b) => (b.lostCases.length + b.wonCases.length) - (a.lostCases.length + a.wonCases.length));
  sorted.slice(0, 30).forEach(p => {
    wrap.appendChild(el("div", { class: "party-card" }, [
      el("div", { class: "party-name" }, [`${p.civility} ${p.last}, ${p.first}`]),
      el("div", { class: "muted" }, [`Première vue : ${p.firstSeen}`]),
      el("div", { class: "party-record" }, [`Condamné(e) : ${p.lostCases.length} fois · Relaxé(e) : ${p.wonCases.length} fois`]),
    ]));
  });
  return wrap;
}

function renderAchievements(wrap, achievements) {
  const visible = ACHIEVEMENTS.filter(a => !a.hidden);
  const hidden = ACHIEVEMENTS.filter(a => a.hidden);
  wrap.appendChild(el("h3", {}, [`🏆 Succès (${achievements.length} / ${ACHIEVEMENTS.length})`]));
  const grid = el("div", { class: "ach-grid" });
  visible.forEach(a => {
    const u = achievements.includes(a.id);
    grid.appendChild(el("div", { class: `ach-card ${u ? "unlocked" : "locked"}` }, [
      el("div", { class: "ach-icon" }, [u ? "✅" : "🔒"]),
      el("div", { class: "ach-label" }, [a.label]),
      el("div", { class: "ach-desc muted" }, [a.desc]),
    ]));
  });
  wrap.appendChild(grid);
  // Hidden : dépliable
  const hiddenSec = el("details", { class: "hidden-details" }, [
    el("summary", {}, [`🤫 Succès cachés (${hidden.filter(h => achievements.includes(h.id)).length} / ${hidden.length} découverts)`]),
  ]);
  const hgrid = el("div", { class: "ach-grid" });
  hidden.forEach(a => {
    const u = achievements.includes(a.id);
    hgrid.appendChild(el("div", { class: `ach-card hidden-ach ${u ? "unlocked" : "locked"}` }, [
      el("div", { class: "ach-icon" }, [u ? "✨" : "❓"]),
      el("div", { class: "ach-label" }, [u ? a.label : "???"]),
      el("div", { class: "ach-desc muted" }, [u ? a.desc : "Découvrez ce succès en jouant."]),
    ]));
  });
  hiddenSec.appendChild(hgrid);
  wrap.appendChild(hiddenSec);
  return wrap;
}
