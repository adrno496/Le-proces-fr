// Cabinet de juge: collectibles unlocked through play.

import { Storage } from "./storage.js";

export const CABINET_ITEMS = [
  // Décor
  { id: "robe-noire",      name: "Robe noire d'audience",      kind: "robe",     rarity: "commun",    icon: "🥋", desc: "La tenue de base. Sobre, intemporelle." },
  { id: "robe-rouge",      name: "Robe rouge",                 kind: "robe",     rarity: "rare",      icon: "🧥", desc: "Réservée aux audiences solennelles. Débloquée au niveau 4." },
  { id: "robe-hermine",    name: "Robe à hermine",             kind: "robe",     rarity: "épique",    icon: "👘", desc: "Symbole de la Cour de cassation." },
  { id: "marteau-bois",    name: "Marteau en bois",            kind: "marteau",  rarity: "commun",    icon: "🔨", desc: "Le marteau standard." },
  { id: "marteau-laiton",  name: "Marteau à manche laiton",    kind: "marteau",  rarity: "rare",      icon: "🪓", desc: "Brille discrètement à chaque verdict." },
  { id: "marteau-ivoire",  name: "Marteau d'ivoire",           kind: "marteau",  rarity: "épique",    icon: "🦴", desc: "Pour les sentences les plus mémorables." },
  { id: "plume-montesquieu", name: "Plume de Montesquieu",     kind: "plume",    rarity: "épique",    icon: "🪶", desc: "Inspire les motivations. +50 XP sur les arguments écrits." },
  { id: "balance-doree",   name: "Balance dorée",              kind: "balance",  rarity: "épique",    icon: "⚖", desc: "Symbole d'équilibre absolu." },
  { id: "code-civil-1804", name: "Code civil édition 1804",    kind: "livre",    rarity: "rare",      icon: "📕", desc: "L'original. Une reproduction parfaite." },
  { id: "code-penal-cuir", name: "Code pénal relié cuir",      kind: "livre",    rarity: "commun",    icon: "📘", desc: "Solide, précis, indispensable." },
  { id: "loupe-magistrat", name: "Loupe du magistrat",         kind: "outil",    rarity: "rare",      icon: "🔍", desc: "Pour examiner les pièces à conviction." },
  { id: "sceau-tribunal",  name: "Sceau du tribunal",          kind: "sceau",    rarity: "épique",    icon: "🛡", desc: "Authentifie les verdicts partagés." },
  { id: "horloge-bronze",  name: "Horloge en bronze",          kind: "decor",    rarity: "commun",    icon: "🕰", desc: "Tic-tac feutré du cabinet." },
  { id: "buste-thémis",    name: "Buste de Thémis",            kind: "decor",    rarity: "épique",    icon: "🗿", desc: "La déesse de la justice veille." },
  { id: "chaise-cuir",     name: "Chaise de cuir capitonné",   kind: "mobilier", rarity: "commun",    icon: "🪑", desc: "Le confort de la délibération." },
  { id: "lampe-banquier",  name: "Lampe de banquier verte",    kind: "mobilier", rarity: "rare",      icon: "💡", desc: "Pour les nuits longues." },
  { id: "tapis-perse",     name: "Tapis persan",               kind: "decor",    rarity: "rare",      icon: "🟫", desc: "Un peu de chaleur dans la salle." },
  { id: "globe-droit-comp", name: "Globe du droit comparé",    kind: "decor",    rarity: "épique",    icon: "🌐", desc: "Une vision mondiale du droit." },
  { id: "medaille-merite", name: "Médaille du mérite judiciaire", kind: "medaille", rarity: "épique", icon: "🎖", desc: "Décernée pour 100 verdicts." },
  { id: "diplome-cassation", name: "Diplôme honoraire Cour Cassation", kind: "diplome", rarity: "légendaire", icon: "📜", desc: "Atteignez le sommet." },
  { id: "perruque-cour",   name: "Perruque de la Cour",        kind: "tete",     rarity: "rare",      icon: "👨‍🦳", desc: "Style british, ambiance Old Bailey." },
  { id: "chapeau-tricorne", name: "Tricorne de président",     kind: "tete",     rarity: "épique",    icon: "🎩", desc: "Pour les grandes audiences solennelles." },
  { id: "boutonniere-rosette", name: "Rosette violette",       kind: "insigne",  rarity: "épique",    icon: "🟣", desc: "Officier des Palmes académiques." },
  { id: "stylo-mont-blanc", name: "Stylo Mont-Blanc",          kind: "outil",    rarity: "rare",      icon: "🖋", desc: "L'écriture du juge." },
  { id: "tampon-secret",   name: "Tampon « confidentiel »",    kind: "outil",    rarity: "commun",    icon: "🔒", desc: "Pour les pièces sensibles." },
  { id: "carafe-cristal",  name: "Carafe en cristal",          kind: "decor",    rarity: "commun",    icon: "🍶", desc: "L'eau du juge." },
  { id: "epitoge-blanc",   name: "Épitoge à fourrure blanche", kind: "robe",     rarity: "épique",    icon: "🤍", desc: "Marque des grandes juridictions." },
  { id: "mitre-magistrat", name: "Toque du magistrat",         kind: "tete",     rarity: "rare",      icon: "🎓", desc: "Symbole d'autorité." },
  { id: "fauteuil-empire", name: "Fauteuil Empire",            kind: "mobilier", rarity: "épique",    icon: "👑", desc: "Pour s'asseoir comme un Sénateur." },
  { id: "cigare-cubain",   name: "Cigare cubain (souvenir)",   kind: "decor",    rarity: "rare",      icon: "🚬", desc: "Cadeau d'un avocat reconnaissant." },
];

const RARITY_WEIGHTS = { commun: 60, rare: 30, "épique": 9, "légendaire": 1 };

export function getCabinet() {
  return Storage.getKey("cabinet", { items: ["robe-noire", "marteau-bois"] });
}

export function hasItem(id) {
  return getCabinet().items.includes(id);
}

export function addItem(id) {
  if (!CABINET_ITEMS.find(i => i.id === id)) return null;
  const c = getCabinet();
  if (c.items.includes(id)) return null;
  c.items.push(id);
  Storage.setKey("cabinet", c);
  return CABINET_ITEMS.find(i => i.id === id);
}

// Random reward at end of verdict — 35% chance of a new collectible
export function maybeReward(profile) {
  if (Math.random() > 0.35) return null;
  const cabinet = getCabinet();
  const locked = CABINET_ITEMS.filter(i => !cabinet.items.includes(i.id));
  if (!locked.length) return null;
  // weighted by rarity
  const weighted = [];
  for (const item of locked) {
    const w = RARITY_WEIGHTS[item.rarity] || 1;
    for (let i = 0; i < w; i++) weighted.push(item);
  }
  const chosen = weighted[Math.floor(Math.random() * weighted.length)];
  // Tier-gate épique/légendaire to avoid early flood
  if (chosen.rarity === "épique" && (profile.totalVerdicts || 0) < 25) return maybeReward(profile);
  if (chosen.rarity === "légendaire" && (profile.totalVerdicts || 0) < 100) return maybeReward(profile);
  addItem(chosen.id);
  return chosen;
}

export function progress() {
  const c = getCabinet();
  return { unlocked: c.items.length, total: CABINET_ITEMS.length, pct: Math.round((c.items.length / CABINET_ITEMS.length) * 100) };
}
