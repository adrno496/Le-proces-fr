// Career system: 6 judicial tiers, each unlocking case complexity & visual changes.

import { Storage } from "./storage.js";

export const CAREER_TIERS = [
  { id: 0, name: "Stagiaire au tribunal", icon: "📋", minVerdicts: 0,  difficultyMax: 2, perks: ["Cas standards"] },
  { id: 1, name: "Greffier",               icon: "📜", minVerdicts: 5,  difficultyMax: 3, perks: ["Codex débloqué", "Citations rares"] },
  { id: 2, name: "Juge de proximité",      icon: "⚖",  minVerdicts: 20, difficultyMax: 3, perks: ["Audiences libres × 10/j", "Témoins multiples"] },
  { id: 3, name: "Juge correctionnel",     icon: "🔨", minVerdicts: 50, difficultyMax: 4, perks: ["Cas pénaux complexes", "Pièces à conviction"] },
  { id: 4, name: "Conseiller à la Cour",   icon: "🏛", minVerdicts: 100, difficultyMax: 5, perks: ["Procès multi-jours", "Délibérations à 3 juges"] },
  { id: 5, name: "Magistrat à la Cassation", icon: "👑", minVerdicts: 200, difficultyMax: 5, perks: ["Crée la jurisprudence", "Tous les modes"] },
];

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
  return getCurrentTier(profile).difficultyMax;
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
