// Thematic seasons — overlay events tied to date ranges.

const SEASONS = [
  { id: "halloween", emoji: "🎃", title: { fr: "Procès macabres", en: "Eerie trials" }, start: "10-25", end: "11-02", themeBoost: "ubuesque" },
  { id: "noel",      emoji: "🎄", title: { fr: "Tribunal de l'Avent", en: "Advent court" }, start: "12-15", end: "12-26", themeBoost: "famille" },
  { id: "rentree",   emoji: "🍂", title: { fr: "Rentrée du droit",  en: "Back to court" }, start: "09-01", end: "09-15", themeBoost: "ado_parents" },
  { id: "ete",       emoji: "☀",  title: { fr: "Été du voisinage", en: "Neighbors' summer" }, start: "07-15", end: "08-15", themeBoost: "voisinage" },
  { id: "stvalentin",emoji: "💔", title: { fr: "Procès du cœur",   en: "Heart trials" }, start: "02-10", end: "02-16", themeBoost: "couple_famille" },
];

function inRange(start, end, today = new Date()) {
  const mmdd = String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0");
  // wrap-around (Halloween case): if start > end, the range wraps year
  if (start > end) return mmdd >= start || mmdd <= end;
  return mmdd >= start && mmdd <= end;
}

export function activeSeason(today = new Date()) {
  return SEASONS.find(s => inRange(s.start, s.end, today)) || null;
}

export function seasonBoostCategory() {
  const s = activeSeason();
  return s ? s.themeBoost : null;
}
