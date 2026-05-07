// Personal jurisprudence: top verdicts become "precedents" cited in future cases.

import { Storage } from "./storage.js";

const KEY = "jurisprudence";

export function getPrecedents() {
  return Storage.getKey(KEY, { list: [] }).list;
}

// Auto-promote a verdict to precedent if : argument ≥ 80 chars OR streak ≥ 7 OR difficulty ≥ 4.
export function maybePromote(verdict, caseData, streak) {
  const argLen = (verdict.argument || "").length;
  const eligible = argLen >= 80 || streak >= 7 || (caseData.difficulty || 3) >= 4;
  if (!eligible) return null;
  const data = Storage.getKey(KEY, { list: [] });
  const entry = {
    id: `${caseData.date}-${caseData.category}`,
    title: caseData.title,
    category: caseData.category,
    verdict: verdict.verdict,
    severity: verdict.severity,
    argument: (verdict.argument || "").slice(0, 240),
    date: caseData.date,
    citations: 0,
  };
  // dedupe
  if (data.list.find(p => p.id === entry.id)) return null;
  data.list.unshift(entry);
  if (data.list.length > 30) data.list = data.list.slice(0, 30);
  Storage.setKey(KEY, data);
  return entry;
}

// Find a precedent of the same category to cite in a new case.
export function citeForCategory(category) {
  const list = getPrecedents().filter(p => p.category === category);
  if (!list.length) return null;
  // weight: prefer recent and rarely cited
  const sorted = [...list].sort((a, b) => (a.citations - b.citations) || (b.date.localeCompare(a.date)));
  const chosen = sorted[0];
  // increment citation count
  const data = Storage.getKey(KEY, { list: [] });
  const idx = data.list.findIndex(p => p.id === chosen.id);
  if (idx >= 0) { data.list[idx].citations += 1; Storage.setKey(KEY, data); }
  return chosen;
}

export function clearPrecedents() {
  Storage.setKey(KEY, { list: [] });
}
