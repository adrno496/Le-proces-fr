// Weekly summary — shown the first time the user opens the dashboard each new ISO week.

import { Storage } from "./storage.js";
import { t } from "./i18n.js";
import { CATEGORY_LABELS } from "./case-engine.js";

function isoWeekKey(d = new Date()) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

// Returns {verdicts, xp, achievements, codexUnlocks, topCategory} for the previous ISO week.
export async function computePreviousWeekSummary() {
  const verdicts = await Storage.getAllVerdicts();
  const today = new Date();
  // Determine start of previous week (Monday)
  const day = today.getDay() || 7; // Mon = 1, Sun = 7
  const startThis = new Date(today);
  startThis.setHours(0, 0, 0, 0);
  startThis.setDate(startThis.getDate() - (day - 1));
  const startPrev = new Date(startThis);
  startPrev.setDate(startPrev.getDate() - 7);
  const endPrev = new Date(startThis);
  endPrev.setDate(endPrev.getDate() - 1); // dernier dimanche

  const startKey = startPrev.toISOString().slice(0, 10);
  const endKey = endPrev.toISOString().slice(0, 10);

  const inWindow = verdicts.filter(v => v.date >= startKey && v.date <= endKey);
  const xp = inWindow.reduce((acc, v) => acc + (v.xpGained || 0), 0);
  const cats = {};
  inWindow.forEach(v => { cats[v.category] = (cats[v.category] || 0) + 1; });
  let topCat = null, topCount = 0;
  for (const [c, n] of Object.entries(cats)) if (n > topCount) { topCount = n; topCat = c; }
  return {
    week: startKey,
    verdicts: inWindow.length,
    xp,
    topCategory: topCat,
    range: { start: startKey, end: endKey },
  };
}

export function shouldShowSummary() {
  const week = isoWeekKey();
  const seen = Storage.getKey("summary_seen", { week: null });
  return seen.week !== week;
}

export function markSummarySeen() {
  Storage.setKey("summary_seen", { week: isoWeekKey() });
}

export async function showSummaryIfDue() {
  if (typeof document === "undefined") return;
  if (!shouldShowSummary()) return;
  const summary = await computePreviousWeekSummary();
  if (summary.verdicts === 0) {
    markSummarySeen();
    return;
  }
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  const modal = document.createElement("div");
  modal.className = "modal modal-summary";
  modal.innerHTML = `
    <h2>${t("summary.title")}</h2>
    <p class="muted">${summary.range.start} → ${summary.range.end}</p>
    <ul class="summary-list">
      <li>${t("summary.verdicts", { n: summary.verdicts })}</li>
      <li>${t("summary.xp", { n: summary.xp })}</li>
      ${summary.topCategory ? `<li>${t("summary.top_cat", { cat: t(`cat.${summary.topCategory}`) || summary.topCategory })} (${summary.topCount || ""})</li>` : ""}
    </ul>
  `;
  const btn = document.createElement("button");
  btn.className = "btn-primary";
  btn.textContent = t("summary.dismiss");
  btn.onclick = () => { markSummarySeen(); overlay.remove(); };
  modal.appendChild(btn);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}
