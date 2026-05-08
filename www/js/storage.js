// Storage layer: localStorage + IndexedDB. Browser-only persistence; Node fallback uses an in-memory store for tests.

const IS_BROWSER = typeof window !== "undefined" && typeof localStorage !== "undefined";
const memStore = new Map();
const memDb = { cases: new Map(), verdicts: new Map() };

const KEYS = {
  settings: "leproces_settings",
  profile: "leproces_profile",
  achievements: "leproces_achievements",
  costs: "leproces_costs",
  codex: "leproces_codex",
  cabinet: "leproces_cabinet",
  jurisprudence: "leproces_jurisprudence",
  parties: "leproces_parties",
  career: "leproces_career",
  weekly: "leproces_weekly",
  narrative: "leproces_narrative",
  notifs: "leproces_notifs",
  quests: "leproces_quests",
  summary_seen: "leproces_summary_seen",
  narrative_seen: "leproces_narrative_seen",
};

function lsGet(key) {
  if (IS_BROWSER) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; }
    catch { return null; }
  }
  return memStore.has(key) ? JSON.parse(memStore.get(key)) : null;
}

function lsSet(key, value) {
  const s = JSON.stringify(value);
  if (IS_BROWSER) {
    try { localStorage.setItem(key, s); return true; }
    catch { return false; }
  }
  memStore.set(key, s);
  return true;
}

const DEFAULT_SETTINGS = {
  provider: null,
  model: null,
  apiKey: "",
  theme: "dark",
  motto: "",
  ttsEnabled: false,
  ttsVoice: null,
  ttsEngine: "premium",
  notifsEnabled: false,
  notifHour: 18,
  notifMinute: 0,
  expertMode: false,
  freeAudienceLimit: 10,
  language: null,
  onboarded: false,
  mode: "standard", // "novice" | "standard" | "expert"
  volume: { ambient: 0.25, gavel: 0.85, tts: 1.0, master: 1.0 },
  reduceMotion: false,
  highContrast: false,
};

const DEFAULT_PROFILE = {
  username: "Votre Honneur",
  avatarId: 0,
  totalXp: 0,
  level: 0,
  streak: 0,
  longestStreak: 0,
  totalVerdicts: 0,
  consensusCount: 0,
  guiltyCount: 0,
  innocentCount: 0,
  argumentsWritten: 0,
  questionsAsked: 0,
  lastVerdictDate: null,
  categoryCounts: {},
  difficultySum: 0,
  guiltyStreakCurrent: 0,
  innocentStreakCurrent: 0,
  guiltyStreakBest: 0,
  innocentStreakBest: 0,
  createdAt: null,
};

const DEFAULT_COSTS = {
  totalTokensIn: 0,
  totalTokensOut: 0,
  totalCost: 0,
  sessionTokensIn: 0,
  sessionTokensOut: 0,
  sessionCost: 0,
  history: [],
  sessionsCount: 0,
};

// IndexedDB helpers
let _db = null;
function openDb() {
  return new Promise((resolve, reject) => {
    if (!IS_BROWSER || typeof indexedDB === "undefined") {
      resolve(null);
      return;
    }
    const req = indexedDB.open("leproces_db", 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("cases")) db.createObjectStore("cases", { keyPath: "date" });
      if (!db.objectStoreNames.contains("verdicts")) db.createObjectStore("verdicts", { keyPath: "date" });
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = (e) => reject(e.target.error);
  });
}

function idbGet(store, key) {
  return new Promise((resolve) => {
    if (!_db) {
      resolve(memDb[store].get(key) || null);
      return;
    }
    const tx = _db.transaction(store, "readonly");
    const req = tx.objectStore(store).get(key);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => resolve(null);
  });
}

function idbPut(store, value) {
  return new Promise((resolve) => {
    if (!_db) {
      memDb[store].set(value.date, value);
      resolve(true);
      return;
    }
    const tx = _db.transaction(store, "readwrite");
    tx.objectStore(store).put(value);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => resolve(false);
  });
}

function idbAll(store) {
  return new Promise((resolve) => {
    if (!_db) {
      resolve(Array.from(memDb[store].values()));
      return;
    }
    const tx = _db.transaction(store, "readonly");
    const req = tx.objectStore(store).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => resolve([]);
  });
}

function idbClear(store) {
  return new Promise((resolve) => {
    if (!_db) {
      memDb[store].clear();
      resolve(true);
      return;
    }
    const tx = _db.transaction(store, "readwrite");
    tx.objectStore(store).clear();
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => resolve(false);
  });
}

// Level calculation
const LEVELS = [
  { min: 0,    label: "Stagiaire",          icon: "📋" },
  { min: 50,   label: "Greffier",           icon: "📜" },
  { min: 200,  label: "Juge de paix",       icon: "⚖" },
  { min: 500,  label: "Juge",               icon: "🔨" },
  { min: 1000, label: "Procureur Général",  icon: "📁" },
  { min: 2000, label: "Cour Suprême",       icon: "👑" },
];

export function levelFromXp(xp) {
  let idx = 0;
  for (let i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i].min) idx = i;
  // Tiers légendaires après 2000
  if (xp >= 2000) {
    const extra = Math.floor((xp - 2000) / 500);
    return {
      index: 5 + extra,
      label: extra === 0 ? "Cour Suprême" : `Légendaire ${extra}`,
      icon: extra === 0 ? "👑" : "✨",
      currentMin: 2000 + extra * 500,
      nextMin: 2000 + (extra + 1) * 500,
    };
  }
  const lv = LEVELS[idx];
  const next = LEVELS[idx + 1];
  return {
    index: idx,
    label: lv.label,
    icon: lv.icon,
    currentMin: lv.min,
    nextMin: next ? next.min : lv.min + 500,
  };
}

// Streak update logic
export function computeStreak(lastDate, todayDate, currentStreak) {
  if (!lastDate) return 1;
  if (lastDate === todayDate) return currentStreak;
  const [y1, m1, d1] = lastDate.split("-").map(Number);
  const [y2, m2, d2] = todayDate.split("-").map(Number);
  const diff = Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000);
  if (diff === 1) return currentStreak + 1;
  return 1; // reset
}

export const Storage = {
  async init() {
    if (IS_BROWSER) {
      try { _db = await openDb(); } catch { _db = null; }
    }
  },

  // Settings
  getSettings() {
    return { ...DEFAULT_SETTINGS, ...(lsGet(KEYS.settings) || {}) };
  },
  saveSettings(settings) {
    const merged = { ...this.getSettings(), ...settings };
    return lsSet(KEYS.settings, merged);
  },

  // Profile
  getProfile() {
    const p = lsGet(KEYS.profile);
    if (!p) {
      const fresh = { ...DEFAULT_PROFILE, categoryCounts: {}, createdAt: Date.now() };
      lsSet(KEYS.profile, fresh);
      return fresh;
    }
    return { ...DEFAULT_PROFILE, categoryCounts: {}, ...p };
  },
  saveProfile(profile) {
    const merged = { ...this.getProfile(), ...profile };
    return lsSet(KEYS.profile, merged);
  },

  // Cases
  async getCachedCase(date) {
    return await idbGet("cases", date);
  },
  async saveCase(caseData) {
    return await idbPut("cases", caseData);
  },

  // Verdicts
  async getVerdict(date) {
    return await idbGet("verdicts", date);
  },
  async saveVerdict(date, verdictData) {
    return await idbPut("verdicts", { date, ...verdictData });
  },
  async getAllVerdicts() {
    return await idbAll("verdicts");
  },

  // Achievements
  getAchievements() {
    return lsGet(KEYS.achievements) || [];
  },
  hasAchievement(id) {
    return this.getAchievements().includes(id);
  },
  addAchievement(id) {
    const list = this.getAchievements();
    if (!list.includes(id)) {
      list.push(id);
      lsSet(KEYS.achievements, list);
      return true;
    }
    return false;
  },

  // History (verdicts + cases joined, sorted desc — caller may slice).
  async getHistory() {
    const verdicts = await idbAll("verdicts");
    const cases = await idbAll("cases");
    const caseMap = new Map(cases.map(c => [c.date, c]));
    return verdicts
      .map(v => ({ date: v.date, verdict: v, case: caseMap.get(v.date) || null }))
      .filter(r => r.case)
      .sort((a, b) => b.date.localeCompare(a.date));
  },

  // Costs
  getCosts() {
    const stored = lsGet(KEYS.costs) || {};
    return { ...DEFAULT_COSTS, ...stored, history: stored.history ? [...stored.history] : [] };
  },
  addCostEntry(entry) {
    // entry: {date, model, provider, tokensIn, tokensOut, cost}
    const c = this.getCosts();
    c.totalTokensIn += entry.tokensIn || 0;
    c.totalTokensOut += entry.tokensOut || 0;
    c.totalCost += entry.cost || 0;
    c.sessionTokensIn += entry.tokensIn || 0;
    c.sessionTokensOut += entry.tokensOut || 0;
    c.sessionCost += entry.cost || 0;
    c.history.unshift({ ...entry, ts: Date.now() });
    if (c.history.length > 200) c.history = c.history.slice(0, 200);
    lsSet(KEYS.costs, c);
    return c;
  },
  resetSessionCost() {
    const c = this.getCosts();
    c.sessionTokensIn = 0;
    c.sessionTokensOut = 0;
    c.sessionCost = 0;
    c.sessionsCount = (c.sessionsCount || 0) + 1;
    lsSet(KEYS.costs, c);
  },
  async clearHistory() {
    await idbClear("cases");
    await idbClear("verdicts");
    lsSet(KEYS.costs, DEFAULT_COSTS);
  },

  // Generic local-key persistence used by feature modules
  getKey(name, fallback = null) {
    return lsGet(KEYS[name] || name) || fallback;
  },
  setKey(name, value) {
    return lsSet(KEYS[name] || name, value);
  },

  // Free audience rate-limit (prevent runaway IA cost)
  freeAudiencesToday() {
    const c = this.getCosts();
    const today = (new Date()).toISOString().slice(0, 10);
    return (c.history || []).filter(h => h.date === today && h.kind === "free").length;
  },

  // Test helper
  _resetAll() {
    if (IS_BROWSER) {
      Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    } else {
      memStore.clear();
      memDb.cases.clear();
      memDb.verdicts.clear();
    }
  },
};
