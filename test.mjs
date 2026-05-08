// Tests for The Judge — runs under `node test.mjs`.
// Uses node:test (built-in) and node:assert.
// All modules must be Node-importable (no DOM required).

import { test } from "node:test";
import assert from "node:assert/strict";

// Force French for date/format tests (default lang)
import { setLang } from "./www/js/i18n.js";
setLang("fr");

// === format.js ===
import {
  formatTokens, formatCost, formatDate, formatRelativeDate,
  getTodayDateStr, dayOfYear, caseNumber,
} from "./www/js/format.js";

test("format: formatTokens scales correctly", () => {
  assert.equal(formatTokens(0), "0");
  assert.equal(formatTokens(500), "500");
  assert.equal(formatTokens(1234), "1.23k");
  assert.equal(formatTokens(1234567), "1.23M");
});

test("format: formatCost handles edges", () => {
  assert.equal(formatCost(0), "0$");
  assert.equal(formatCost(0.00001), "< 0.01$");
  assert.equal(formatCost(0.5), "0.5000$");
  assert.equal(formatCost(1.2345), "1.23$");
  assert.equal(formatCost(123.4), "123$");
});

test("format: formatDate French", () => {
  assert.equal(formatDate("2026-05-06"), "Mercredi 6 mai 2026");
});

test("format: formatRelativeDate cases", () => {
  assert.equal(formatRelativeDate("2026-05-06", "2026-05-06"), "Aujourd'hui");
  assert.equal(formatRelativeDate("2026-05-05", "2026-05-06"), "Hier");
  assert.equal(formatRelativeDate("2026-05-04", "2026-05-06"), "Avant-hier");
  assert.equal(formatRelativeDate("2026-05-01", "2026-05-06"), "Il y a 5 jours");
});

test("format: dayOfYear and caseNumber", () => {
  assert.equal(dayOfYear("2026-01-01"), 1);
  assert.equal(dayOfYear("2026-12-31"), 365);
  assert.equal(caseNumber("2026-05-06"), "2026-126");
});

// === storage.js ===
import { Storage, levelFromXp, computeStreak } from "./www/js/storage.js";

test("storage: settings roundtrip", () => {
  Storage._resetAll();
  Storage.saveSettings({ provider: "groq", model: "llama-3.1-8b-instant", apiKey: "abc" });
  const s = Storage.getSettings();
  assert.equal(s.provider, "groq");
  assert.equal(s.apiKey, "abc");
  assert.equal(s.theme, "dark");
});

test("storage: profile defaults and merge", () => {
  Storage._resetAll();
  const p = Storage.getProfile();
  assert.equal(p.totalXp, 0);
  assert.equal(p.streak, 0);
  Storage.saveProfile({ totalXp: 50 });
  assert.equal(Storage.getProfile().totalXp, 50);
});

test("storage: levelFromXp tiers", () => {
  assert.equal(levelFromXp(0).label, "Stagiaire");
  assert.equal(levelFromXp(50).label, "Greffier");
  assert.equal(levelFromXp(200).label, "Juge de paix");
  assert.equal(levelFromXp(500).label, "Juge");
  assert.equal(levelFromXp(1000).label, "Procureur Général");
  assert.equal(levelFromXp(2000).label, "Cour Suprême");
  assert.equal(levelFromXp(2500).label, "Légendaire 1");
  assert.equal(levelFromXp(3000).label, "Légendaire 2");
});

test("storage: streak increments, resets, holds", () => {
  // joue aujourd'hui pour la première fois
  assert.equal(computeStreak(null, "2026-05-06", 0), 1);
  // joue hier puis aujourd'hui
  assert.equal(computeStreak("2026-05-05", "2026-05-06", 5), 6);
  // saute un jour
  assert.equal(computeStreak("2026-05-04", "2026-05-06", 5), 1);
  // même jour deux fois
  assert.equal(computeStreak("2026-05-06", "2026-05-06", 5), 5);
});

test("storage: addCostEntry accumulates totals", () => {
  Storage._resetAll();
  Storage.addCostEntry({ date: "2026-05-06", model: "x", provider: "groq", tokensIn: 100, tokensOut: 50, cost: 0.001 });
  Storage.addCostEntry({ date: "2026-05-06", model: "x", provider: "groq", tokensIn: 200, tokensOut: 100, cost: 0.002 });
  const c = Storage.getCosts();
  assert.equal(c.totalTokensIn, 300);
  assert.equal(c.totalTokensOut, 150);
  assert.ok(Math.abs(c.totalCost - 0.003) < 1e-9);
  assert.equal(c.history.length, 2);
});

test("storage: achievements add once", () => {
  Storage._resetAll();
  assert.equal(Storage.addAchievement("first_verdict"), true);
  assert.equal(Storage.addAchievement("first_verdict"), false);
  assert.deepEqual(Storage.getAchievements(), ["first_verdict"]);
  assert.equal(Storage.hasAchievement("first_verdict"), true);
});

test("storage: case + verdict via in-memory IDB stub", async () => {
  Storage._resetAll();
  await Storage.saveCase({ date: "2026-05-06", title: "Test", category: "absurde" });
  const got = await Storage.getCachedCase("2026-05-06");
  assert.equal(got.title, "Test");
  await Storage.saveVerdict("2026-05-06", { verdict: "guilty", severity: 3 });
  const v = await Storage.getVerdict("2026-05-06");
  assert.equal(v.verdict, "guilty");
});

test("storage: getHistory joins cases+verdicts and sorts desc", async () => {
  Storage._resetAll();
  await Storage.saveCase({ date: "2026-05-04", title: "A", category: "absurde" });
  await Storage.saveCase({ date: "2026-05-06", title: "B", category: "absurde" });
  await Storage.saveCase({ date: "2026-05-05", title: "C", category: "absurde" });
  await Storage.saveVerdict("2026-05-04", { verdict: "innocent", severity: 1 });
  await Storage.saveVerdict("2026-05-06", { verdict: "guilty", severity: 3 });
  await Storage.saveVerdict("2026-05-05", { verdict: "guilty", severity: 2 });
  const h = await Storage.getHistory();
  assert.equal(h[0].date, "2026-05-06");
  assert.equal(h[1].date, "2026-05-05");
  assert.equal(h[2].date, "2026-05-04");
});

// === ai-client.js ===
import {
  PROVIDERS, getModel, buildHeaders, buildRequestBody, parseResponse, computeCost,
  estimateCostFor100Messages, errorMessage, callAI,
} from "./www/js/ai-client.js";

test("ai: PROVIDERS has 5 providers", () => {
  assert.deepEqual(Object.keys(PROVIDERS).sort(), ["anthropic", "groq", "mistral", "openai", "openrouter"]);
});

test("ai: every model has price fields", () => {
  for (const [pid, p] of Object.entries(PROVIDERS)) {
    for (const m of p.models) {
      assert.ok(typeof m.priceIn === "number", `${pid}/${m.id} priceIn`);
      assert.ok(typeof m.priceOut === "number", `${pid}/${m.id} priceOut`);
      assert.ok(m.contextWindow > 0);
    }
  }
});

test("ai: buildHeaders per provider", () => {
  const oh = buildHeaders("openai", "sk-x");
  assert.equal(oh.Authorization, "Bearer sk-x");
  const ah = buildHeaders("anthropic", "ak-x");
  assert.equal(ah["x-api-key"], "ak-x");
  assert.equal(ah["anthropic-version"], "2023-06-01");
  const orh = buildHeaders("openrouter", "or-x");
  assert.equal(orh["X-Title"], "The Judge");
  assert.equal(orh.Authorization, "Bearer or-x");
  assert.ok(orh["HTTP-Referer"]); // dynamic, just check it exists
});

test("ai: buildRequestBody differs for Anthropic vs OpenAI-compat", () => {
  const msgs = [{ role: "user", content: "hello" }];
  const oa = buildRequestBody("openai", "gpt-4o-mini", msgs, "SYS", 100);
  assert.ok(oa.url.endsWith("/chat/completions"));
  assert.equal(oa.body.messages[0].role, "system");
  assert.equal(oa.body.messages[1].content, "hello");

  const an = buildRequestBody("anthropic", "claude-haiku-4-5-20251001", msgs, "SYS", 100);
  assert.ok(an.url.endsWith("/messages"));
  assert.equal(an.body.system, "SYS");
  assert.equal(an.body.messages.length, 1, "Anthropic system NOT in messages array");
  assert.equal(an.body.messages[0].content, "hello");
});

test("ai: parseResponse extracts content/tokens for both formats", () => {
  const oa = parseResponse("groq", {
    choices: [{ message: { content: "hi" } }],
    usage: { prompt_tokens: 10, completion_tokens: 5 },
  });
  assert.equal(oa.content, "hi");
  assert.equal(oa.tokensIn, 10);
  assert.equal(oa.tokensOut, 5);

  const an = parseResponse("anthropic", {
    content: [{ text: "hello there" }],
    usage: { input_tokens: 12, output_tokens: 7 },
  });
  assert.equal(an.content, "hello there");
  assert.equal(an.tokensIn, 12);
  assert.equal(an.tokensOut, 7);
});

test("ai: computeCost matches priceIn/priceOut math", () => {
  const m = { priceIn: 1.0, priceOut: 2.0 };
  // 1M in, 1M out → 1 + 2 = 3$
  assert.equal(computeCost(m, 1_000_000, 1_000_000), 3);
  assert.equal(computeCost(m, 0, 0), 0);
});

test("ai: errorMessage maps statuses to French messages", () => {
  assert.match(errorMessage(401), /Clé API invalide/);
  assert.match(errorMessage(403), /Clé API invalide/);
  assert.match(errorMessage(429), /Limite/);
  assert.match(errorMessage(500), /serveur/);
  assert.match(errorMessage(0), /trop de temps/);
});

test("ai: estimateCostFor100Messages free model", () => {
  const e = estimateCostFor100Messages("openrouter", "google/gemini-2.0-flash-exp:free");
  assert.equal(e.isFree, true);
  assert.equal(e.costUSD, 0);
  assert.match(e.label, /GRATUIT/);
});

test("ai: estimateCostFor100Messages priced model", () => {
  const e = estimateCostFor100Messages("openai", "gpt-4o-mini");
  // 80k tokens in × 0.15 / 1M + 40k × 0.60 / 1M = 0.012 + 0.024 = 0.036
  assert.ok(Math.abs(e.costUSD - 0.036) < 1e-6);
  assert.equal(e.totalMessages, 100);
  assert.match(e.label, /Très bon marché|Quasi gratuit|Modéré/);
});

test("ai: getModel returns null for unknown", () => {
  assert.equal(getModel("openai", "no-such"), null);
  assert.equal(getModel("nope", "x"), null);
  assert.ok(getModel("groq", "llama-3.1-8b-instant"));
});

test("ai: callAI throws when no API key configured", async () => {
  Storage._resetAll();
  await assert.rejects(() => callAI([{ role: "user", content: "hi" }]), /clé API/i);
});

test("ai: callAI uses Anthropic format and records cost (mock fetch)", async () => {
  Storage._resetAll();
  Storage.saveSettings({ provider: "anthropic", model: "claude-haiku-4-5-20251001", apiKey: "ak-test" });
  let captured = null;
  const origFetch = globalThis.fetch;
  globalThis.fetch = async (url, opts) => {
    captured = { url, opts };
    return new Response(JSON.stringify({
      content: [{ text: "Bonjour" }],
      usage: { input_tokens: 5, output_tokens: 3 },
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  };
  try {
    const r = await callAI([{ role: "user", content: "hi" }], { systemPrompt: "SYS", maxTokens: 50 });
    assert.equal(r.content, "Bonjour");
    assert.equal(r.tokensIn, 5);
    assert.equal(r.tokensOut, 3);
    assert.ok(captured.url.endsWith("/messages"));
    const body = JSON.parse(captured.opts.body);
    assert.equal(body.system, "SYS"); // Anthropic-specific
    assert.ok(captured.opts.headers["x-api-key"]);
    // cost recorded
    const c = Storage.getCosts();
    assert.equal(c.history.length, 1);
  } finally { globalThis.fetch = origFetch; }
});

test("ai: callAI raises French message on 401", async () => {
  Storage._resetAll();
  Storage.saveSettings({ provider: "groq", model: "llama-3.1-8b-instant", apiKey: "bad" });
  const origFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response("unauthorized", { status: 401 });
  try {
    await assert.rejects(
      () => callAI([{ role: "user", content: "hi" }]),
      /Clé API invalide/,
    );
  } finally { globalThis.fetch = origFetch; }
});

test("ai: callAI raises French message on 429", async () => {
  Storage._resetAll();
  Storage.saveSettings({ provider: "groq", model: "llama-3.1-8b-instant", apiKey: "ok" });
  const origFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response("rate limited", { status: 429 });
  try {
    await assert.rejects(() => callAI([{ role: "user", content: "hi" }]), /Limite/);
  } finally { globalThis.fetch = origFetch; }
});

// === case-engine.js ===
import {
  CATEGORIES, getDailyCategoryFromDate, getFallbackCase, parseCaseJSON,
  computeXpGain, checkAchievements, ACHIEVEMENTS,
} from "./www/js/case-engine.js";

test("case-engine: CATEGORIES has 18 entries (8 grand public + 3 légal light + 7 légal avancé)", () => {
  assert.equal(CATEGORIES.length, 18);
  assert.ok(CATEGORIES.includes("ubuesque"));
  assert.ok(CATEGORIES.includes("dilemmes"));
  assert.ok(CATEGORIES.includes("couple_famille"));
  assert.ok(CATEGORIES.includes("penal"));
});

test("case-engine: getDailyCategoryFromDate is deterministic", () => {
  const a = getDailyCategoryFromDate("2026-05-06");
  const b = getDailyCategoryFromDate("2026-05-06");
  assert.equal(a, b);
  assert.ok(CATEGORIES.includes(a));
});

test("case-engine: getFallbackCase has all 10 categories", () => {
  for (const c of CATEGORIES) {
    const f = getFallbackCase(c);
    assert.ok(f.title && f.context && f.prosecutionSpeech && f.defenseSpeech, `fallback ${c}`);
    assert.equal(f.category, c);
  }
});

test("case-engine: parseCaseJSON handles raw JSON", () => {
  const json = JSON.stringify({
    title: "X", context: "Y",
    prosecutionSpeech: "P", defenseSpeech: "D",
    category: "absurde", difficulty: 4,
  });
  const p = parseCaseJSON(json, "absurde");
  assert.equal(p.title, "X");
  assert.equal(p.difficulty, 4);
});

test("case-engine: parseCaseJSON strips markdown fences", () => {
  const wrapped = "```json\n" + JSON.stringify({
    title: "X", context: "Y", prosecutionSpeech: "P", defenseSpeech: "D",
  }) + "\n```";
  const p = parseCaseJSON(wrapped, "absurde");
  assert.equal(p.title, "X");
});

test("case-engine: parseCaseJSON returns null on invalid", () => {
  assert.equal(parseCaseJSON("not json at all", "absurde"), null);
  assert.equal(parseCaseJSON('{"title":"X"}', "absurde"), null); // missing fields
});

test("case-engine: computeXpGain rules", () => {
  assert.equal(computeXpGain({ streak: 1, hasArgument: false }), 10 + 5);
  assert.equal(computeXpGain({ streak: 1, hasArgument: true }), 10 + 5 + 10);
  assert.equal(computeXpGain({ streak: 20, hasArgument: false }), 10 + 50); // capped
});

test("case-engine: checkAchievements unlocks based on profile", () => {
  const a1 = checkAchievements({ totalVerdicts: 1, totalXp: 0, categoryCounts: {}, longestStreak: 0 });
  assert.ok(a1.includes("first_verdict"));

  const a2 = checkAchievements({ totalVerdicts: 100, totalXp: 1000, categoryCounts: {}, longestStreak: 30, streak: 30, argumentsWritten: 10, questionsAsked: 3, guiltyStreakBest: 5, innocentStreakBest: 5 });
  assert.ok(a2.includes("verdicts_100"));
  assert.ok(a2.includes("magistrat"));
  assert.ok(a2.includes("streak_30"));
  assert.ok(a2.includes("argumenter"));
  assert.ok(a2.includes("questioner"));
  assert.ok(a2.includes("guilty_streak"));
  assert.ok(a2.includes("innocent_streak"));

  const allCats = {};
  CATEGORIES.forEach(c => { allCats[c] = 1; });
  const a3 = checkAchievements({ totalVerdicts: 10, categoryCounts: allCats, totalXp: 0, longestStreak: 0 });
  assert.ok(a3.includes("all_categories"));
});

test("case-engine: ACHIEVEMENTS list has 12 visible entries (and 30+ hidden)", () => {
  const visible = ACHIEVEMENTS.filter(a => !a.hidden);
  assert.equal(visible.length, 12);
  const hidden = ACHIEVEMENTS.filter(a => a.hidden);
  assert.ok(hidden.length >= 30, `expected >=30 hidden, got ${hidden.length}`);
});

// ===== Volume guards on user-visible corpora (avoid silent regressions) =====
test("corpus: fallback-pool has 18 categories and >=300 cases total", async () => {
  const { FALLBACK_POOL } = await import("./www/js/fallback-pool.js");
  const cats = Object.keys(FALLBACK_POOL);
  assert.equal(cats.length, 18, `expected 18 categories, got ${cats.length}`);
  const total = cats.reduce((s, k) => s + FALLBACK_POOL[k].length, 0);
  assert.ok(total >= 300, `expected >=300 fallback cases, got ${total}`);
});

test("corpus: historic cases >=100", async () => {
  const { HISTORIC_CASES } = await import("./www/js/historic-cases.js");
  assert.ok(HISTORIC_CASES.length >= 100, `expected >=100 historic, got ${HISTORIC_CASES.length}`);
  // unique ids
  const ids = HISTORIC_CASES.map(c => c.id);
  assert.equal(new Set(ids).size, ids.length, "duplicate historic ids");
});

test("corpus: guess-sentence has >=100 cases", async () => {
  const { GUESS_CASES } = await import("./www/js/guess-sentence.js");
  assert.ok(GUESS_CASES.length >= 100, `expected >=100 guess cases, got ${GUESS_CASES.length}`);
  const ids = GUESS_CASES.map(c => c.id);
  assert.equal(new Set(ids).size, ids.length, "duplicate guess ids");
  // each case has exactly 1 correct option
  for (const g of GUESS_CASES) {
    const correct = g.options.filter(o => o.correctIdx === true).length;
    assert.equal(correct, 1, `case ${g.id} should have exactly 1 correct option`);
  }
});

test("corpus: sagas have unique ids and 5 chapters each", async () => {
  const { SAGAS } = await import("./www/js/sagas.js");
  assert.ok(SAGAS.length >= 11, `expected >=11 sagas, got ${SAGAS.length}`);
  const ids = SAGAS.map(s => s.id);
  assert.equal(new Set(ids).size, ids.length, "duplicate saga ids");
  for (const s of SAGAS) {
    assert.equal(s.chapters.length, 5, `${s.id} should have 5 chapters`);
  }
});

test("corpus: codex entries have unique ids", async () => {
  const { CODEX_ENTRIES } = await import("./www/js/codex.js");
  const ids = CODEX_ENTRIES.map(e => e.id);
  assert.equal(new Set(ids).size, ids.length, "duplicate codex ids");
  assert.ok(CODEX_ENTRIES.length >= 200, `expected >=200 codex entries, got ${CODEX_ENTRIES.length}`);
});

test("glossary: decorateText detects article references", async () => {
  // Force browser-like document for the test
  if (typeof globalThis.document === "undefined") {
    const { JSDOM } = await import("jsdom").catch(() => ({ JSDOM: null }));
    if (!JSDOM) return; // skip if jsdom unavailable
    const dom = new JSDOM();
    globalThis.document = dom.window.document;
    globalThis.window = dom.window;
  }
  const { decorateText } = await import("./www/js/glossary.js");
  const frag = decorateText("Voir l'article 1240 du Code civil.", () => {});
  if (!frag) return; // jsdom-less env
  const html = (() => { const d = document.createElement("div"); d.appendChild(frag); return d.innerHTML; })();
  assert.ok(html.includes("glossary-article"), "article 1240 should be detected as clickable");
});

console.log("\n✓ All tests defined.");
