// Export & import the player's full profile as JSON.
// All data is local (localStorage + IndexedDB). Export = backup, Import = restore.

import { Storage } from "./storage.js";

const KEYS_TO_EXPORT = [
  "leproces_settings", "leproces_profile", "leproces_achievements", "leproces_costs",
  "leproces_codex", "leproces_cabinet", "leproces_jurisprudence", "leproces_parties",
  "leproces_career", "leproces_weekly", "leproces_narrative", "leproces_notifs",
  "leproces_quests", "leproces_summary_seen", "leproces_narrative_seen",
];

export async function exportProfile() {
  const out = { version: 1, exportedAt: new Date().toISOString(), localStorage: {}, indexedDB: { cases: [], verdicts: [] } };
  if (typeof localStorage !== "undefined") {
    for (const k of KEYS_TO_EXPORT) {
      const v = localStorage.getItem(k);
      if (v) out.localStorage[k] = v;
    }
  }
  // IndexedDB cases + verdicts via Storage.getAllVerdicts and a manual cases dump
  try {
    const verdicts = await Storage.getAllVerdicts();
    out.indexedDB.verdicts = verdicts;
  } catch {}
  // For cases, we'd need a getAllCases — let's skip (cache, will regenerate).
  return out;
}

export async function downloadProfileJSON() {
  const data = await exportProfile();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `the-judge-profile-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function importProfile(file) {
  const text = await file.text();
  const data = JSON.parse(text);
  if (!data.localStorage) throw new Error("Invalid profile file");
  if (typeof localStorage !== "undefined") {
    for (const [k, v] of Object.entries(data.localStorage)) {
      try { localStorage.setItem(k, v); } catch {}
    }
  }
  // Re-import verdicts into IndexedDB
  if (data.indexedDB?.verdicts) {
    for (const v of data.indexedDB.verdicts) {
      try { await Storage.saveVerdict(v.date, v); } catch {}
    }
  }
  return true;
}
