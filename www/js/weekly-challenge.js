// Weekly challenge: each ISO week features a specific theme + 5 cases.

import { Storage } from "./storage.js";
import { CATEGORIES, CATEGORY_LABELS } from "./case-engine.js";
import { t } from "./i18n.js";

function isoWeekKey(d = new Date()) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

function hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0; }
  return Math.abs(h);
}

export function currentChallenge() {
  const wk = isoWeekKey();
  const cat = CATEGORIES[hash(wk) % CATEGORIES.length];
  const catLabel = t(`cat.${cat}`);
  return {
    week: wk,
    category: cat,
    label: t("weekly.label", { cat: catLabel }),
    target: 5,
    description: t("weekly.description", { cat: catLabel }),
  };
}

export function getProgress() {
  return Storage.getKey("weekly", { week: null, completed: 0 });
}

// Called by tribunal after a verdict if the case category matches.
export function recordVerdictForChallenge(category) {
  const ch = currentChallenge();
  const data = Storage.getKey("weekly", { week: null, completed: 0 });
  if (data.week !== ch.week) {
    data.week = ch.week;
    data.completed = 0;
  }
  if (category === ch.category) {
    data.completed = Math.min(ch.target, data.completed + 1);
    Storage.setKey("weekly", data);
    return data.completed;
  }
  return data.completed;
}

export function isComplete() {
  const ch = currentChallenge();
  const p = getProgress();
  return p.week === ch.week && p.completed >= ch.target;
}

export function multiplierForCategory(category) {
  const ch = currentChallenge();
  return category === ch.category ? 2 : 1;
}
