// Daily loot box — claim once per day, gives a random reward.

import { Storage } from "./storage.js";
import { CABINET_ITEMS, addItem } from "./cabinet.js";
import { CODEX_ENTRIES, unlock as unlockCodex } from "./codex.js";
import { quoteOfTheSession, QUOTES } from "./citations.js";

const REWARDS = ["xp_small", "xp_big", "cabinet", "codex_hint", "quote", "double_xp_session"];

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function canClaim() {
  const last = Storage.getKey("lootbox_last", null);
  return !last || last !== todayKey();
}

export function claim() {
  if (!canClaim()) return null;
  const r = REWARDS[Math.floor(Math.random() * REWARDS.length)];
  let result = { type: r, label: "" };
  switch (r) {
    case "xp_small": {
      const xp = 15 + Math.floor(Math.random() * 11); // 15-25
      const profile = Storage.getProfile();
      Storage.saveProfile({ totalXp: (profile.totalXp || 0) + xp });
      result.label = `+${xp} XP`;
      result.xp = xp;
      break;
    }
    case "xp_big": {
      const xp = 50 + Math.floor(Math.random() * 31); // 50-80
      const profile = Storage.getProfile();
      Storage.saveProfile({ totalXp: (profile.totalXp || 0) + xp });
      result.label = `+${xp} XP (rare!)`;
      result.xp = xp;
      break;
    }
    case "cabinet": {
      // Pick a locked common/rare item
      const cabinet = Storage.getKey("cabinet", { items: [] });
      const locked = CABINET_ITEMS.filter(i => !cabinet.items.includes(i.id) && (i.rarity === "commun" || i.rarity === "rare"));
      if (locked.length) {
        const item = locked[Math.floor(Math.random() * locked.length)];
        addItem(item.id);
        result.label = `${item.icon} ${item.name}`;
        result.item = item;
      } else {
        // Fallback to small XP
        const profile = Storage.getProfile();
        Storage.saveProfile({ totalXp: (profile.totalXp || 0) + 20 });
        result.type = "xp_small";
        result.label = "+20 XP";
      }
      break;
    }
    case "codex_hint": {
      const all = CODEX_ENTRIES;
      const codex = Storage.getKey("codex", { unlocked: [] });
      const locked = all.filter(e => !codex.unlocked.includes(e.id));
      if (locked.length) {
        const e = locked[Math.floor(Math.random() * locked.length)];
        unlockCodex(e.id);
        result.label = `📖 ${e.label}`;
        result.entry = e;
      } else {
        const profile = Storage.getProfile();
        Storage.saveProfile({ totalXp: (profile.totalXp || 0) + 15 });
        result.type = "xp_small";
        result.label = "+15 XP";
      }
      break;
    }
    case "quote": {
      const q = quoteOfTheSession();
      result.label = `« ${q.quote} » — ${q.author}`;
      result.quote = q;
      break;
    }
    case "double_xp_session": {
      Storage.setKey("double_xp_until", { ts: Date.now() + 60 * 60 * 1000 }); // 1h
      result.label = "✨ XP × 2 pendant 1 heure !";
      break;
    }
  }
  Storage.setKey("lootbox_last", todayKey());
  return result;
}

export function isDoubleXpActive() {
  const dx = Storage.getKey("double_xp_until", null);
  return !!(dx && dx.ts > Date.now());
}
