// Weekly quests — 3 per ISO week, deterministic. Reward: bonus XP.

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

// Quest definitions. Each one has an id, a label key, a target, and a counter source.
const QUEST_BANK = [
  { id: "cat3",    keyTpl: "quests.q1", target: 3, source: "category" },     // Juger 3 cas dans cat X
  { id: "arg2",    keyTpl: "quests.q2", target: 2, source: "arguments" },    // Argumenter 2 verdicts
  { id: "ev3",     keyTpl: "quests.q3", target: 3, source: "evidence" },     // Pièces de 3 audiences
  { id: "wit2",    keyTpl: "quests.q4", target: 2, source: "witnesses" },    // Témoin de 2 audiences
  { id: "align3",  keyTpl: "quests.q5", target: 3, source: "alignment" },    // 3 verdicts alignés
  { id: "streak3", keyTpl: "quests.q6", target: 3, source: "streak" },       // Streak de 3 jours
];

// Pick 3 quests for the week deterministically.
function questsForWeek(week) {
  const seed = hash(week);
  const pool = [...QUEST_BANK];
  const picks = [];
  for (let i = 0; i < 3 && pool.length; i++) {
    const idx = (seed >> (i * 4)) % pool.length;
    picks.push(pool.splice(idx, 1)[0]);
  }
  // Choose a category for the cat3 quest (deterministic by week)
  picks.forEach(q => {
    if (q.source === "category") {
      q.cat = CATEGORIES[seed % CATEGORIES.length];
    }
  });
  return picks;
}

// Returns the live state of this week's quests (with progress).
export function getQuests() {
  const week = isoWeekKey();
  const stored = Storage.getKey("quests", { week: null, progress: {}, completed: [], rewardsClaimed: {} });
  if (stored.week !== week) {
    return { week, progress: {}, completed: [], rewardsClaimed: {}, defs: questsForWeek(week) };
  }
  return { ...stored, defs: questsForWeek(week) };
}

function persist(s) {
  const { defs, ...rest } = s;
  Storage.setKey("quests", rest);
}

// Called after each verdict — receives a snapshot of what happened.
export function recordVerdictForQuests({ category, hasArgument, allEvidenceExamined, askedWitness, alignedWithTruth, streak }) {
  const s = getQuests();
  const reward = []; // ids des quêtes nouvellement complétées
  for (const q of s.defs) {
    if (s.completed.includes(q.id)) continue;
    let inc = 0;
    if (q.source === "category" && category === q.cat) inc = 1;
    if (q.source === "arguments" && hasArgument) inc = 1;
    if (q.source === "evidence" && allEvidenceExamined) inc = 1;
    if (q.source === "witnesses" && askedWitness) inc = 1;
    if (q.source === "alignment" && alignedWithTruth) inc = 1;
    if (q.source === "streak") s.progress[q.id] = streak; // copie directe
    else if (inc) s.progress[q.id] = (s.progress[q.id] || 0) + inc;

    if ((s.progress[q.id] || 0) >= q.target && !s.completed.includes(q.id)) {
      s.completed.push(q.id);
      reward.push(q);
    }
  }
  persist(s);
  return reward;
}

export function describeQuest(q) {
  const vars = { n: q.target, cat: q.cat ? t(`cat.${q.cat}`) : "" };
  return t(q.keyTpl, vars);
}

export function rewardFor(q) {
  // Bonus XP : 25 par quête × multiplicateur cible
  return 25 + q.target * 5;
}

// To be called when a reward toast is shown — marks reward as claimed and returns XP gain.
export function claimReward(questId) {
  const s = getQuests();
  if (s.rewardsClaimed[questId]) return 0;
  const q = s.defs.find(x => x.id === questId);
  if (!q) return 0;
  s.rewardsClaimed[questId] = true;
  persist(s);
  return rewardFor(q);
}
