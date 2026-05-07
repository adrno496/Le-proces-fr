// Career system: 6 judicial tiers. Names are translated via i18n.

import { Storage } from "./storage.js";
import { t } from "./i18n.js";

const TIER_DEFS = [
  { id: 0, icon: "📋", minVerdicts: 0,  difficultyMax: 2 },
  { id: 1, icon: "📜", minVerdicts: 5,  difficultyMax: 3 },
  { id: 2, icon: "⚖",  minVerdicts: 20, difficultyMax: 3 },
  { id: 3, icon: "🔨", minVerdicts: 50, difficultyMax: 4 },
  { id: 4, icon: "🏛", minVerdicts: 100, difficultyMax: 5 },
  { id: 5, icon: "👑", minVerdicts: 200, difficultyMax: 5 },
];

// Build tiers with current language. Re-evaluated each call so language switches are picked up.
function buildTiers() {
  return TIER_DEFS.map(d => ({
    ...d,
    name: t(`career.${d.id}.name`),
    perks: [], // perks could be translated separately if needed
  }));
}

export const CAREER_TIERS = new Proxy([], {
  get(_t, prop) {
    const tiers = buildTiers();
    if (prop === "length") return tiers.length;
    if (prop === Symbol.iterator) return tiers[Symbol.iterator].bind(tiers);
    if (typeof prop === "string" && /^\d+$/.test(prop)) return tiers[+prop];
    if (Array.prototype[prop]) return Array.prototype[prop].bind(tiers);
    return tiers[prop];
  },
});

export function getCurrentTier(profile) {
  let tier = CAREER_TIERS[0];
  for (const t of CAREER_TIERS) {
    if ((profile.totalVerdicts || 0) >= t.minVerdicts) tier = t;
  }
  return tier;
}

export function getNextTier(profile) {
  const cur = getCurrentTier(profile);
  return CAREER_TIERS.find(t => t.id === cur.id + 1) || null;
}

export function maxAllowedDifficulty(profile) {
  const careerCap = getCurrentTier(profile).difficultyMax;
  const settings = Storage.getSettings();
  // Mode Découverte écrase la difficulté à la baisse (jamais à la hausse)
  if (settings.mode === "novice") return Math.min(careerCap, 2);
  if (settings.mode === "expert") return Math.max(careerCap, 4);
  return careerCap;
}

export function tierProgress(profile) {
  const cur = getCurrentTier(profile);
  const next = getNextTier(profile);
  if (!next) return { pct: 100, current: cur, next: null, remaining: 0 };
  const total = next.minVerdicts - cur.minVerdicts;
  const done = (profile.totalVerdicts || 0) - cur.minVerdicts;
  return {
    pct: Math.max(0, Math.min(100, Math.round((done / total) * 100))),
    current: cur,
    next,
    remaining: next.minVerdicts - (profile.totalVerdicts || 0),
  };
}

// Promotion check: returns the new tier if just unlocked, or null.
export function checkPromotion(prevVerdicts, newVerdicts) {
  for (const t of CAREER_TIERS) {
    if (prevVerdicts < t.minVerdicts && newVerdicts >= t.minVerdicts) return t;
  }
  return null;
}
