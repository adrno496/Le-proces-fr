// Annual storyline: 12 chapters of 4 weeks. Pure local narrative around the player's career.

export const CHAPTERS = [
  { id: 1,  month: 1,  title: "Premiers pas au tribunal", hook: "Vous prenez votre première affectation. Le greffier vous explique les usages, le marteau vous semble lourd." },
  { id: 2,  month: 2,  title: "Les habitudes de la salle", hook: "Vous reconnaissez certains visages parmi les avocats. Une affaire mineure révèle un manège de petits arrangements." },
  { id: 3,  month: 3,  title: "Le dossier brûlant", hook: "Une affaire vous est confiée alors qu'elle a déjà déstabilisé deux confrères. La presse locale s'y intéresse." },
  { id: 4,  month: 4,  title: "Doutes et solitude", hook: "Vos verdicts sont commentés. Vous doutez. Le bâtonnier vous invite à boire un café — un avertissement déguisé ?" },
  { id: 5,  month: 5,  title: "Le vieux mentor", hook: "Un magistrat retraité prend contact. Il a suivi vos décisions. Il vous propose son regard sur un cas complexe." },
  { id: 6,  month: 6,  title: "Procès retentissant", hook: "Une affaire à fort retentissement médiatique vous est attribuée. La salle est pleine. Le ministère public vous observe." },
  { id: 7,  month: 7,  title: "Un secret dans le dossier", hook: "En examinant des pièces, vous découvrez un témoignage qui contredit ce que tout le monde tient pour acquis." },
  { id: 8,  month: 8,  title: "La pression", hook: "Vous recevez un courrier anonyme. Discret, presque poli. Mais ses sous-entendus ne laissent aucun doute." },
  { id: 9,  month: 9,  title: "Choisir son camp", hook: "Une décision est attendue par votre hiérarchie. Une autre, par votre conscience. Les deux divergent." },
  { id: 10, month: 10, title: "Le procès en appel", hook: "Une de vos décisions est cassée par la cour d'appel. Vous lisez l'arrêt. Il porte vos initiales en marge." },
  { id: 11, month: 11, title: "Le jugement de la presse", hook: "Une enquête journalistique reprend vos affaires. Pas de mensonge, pas de calomnie — juste des questions très précises." },
  { id: 12, month: 12, title: "Bilan et résolution", hook: "Une année entière de verdicts. Le greffier compile vos statistiques. Vous tracez la ligne de ce que vous voulez devenir." },
];

export function currentChapter(d = new Date()) {
  const month = d.getMonth() + 1;
  return CHAPTERS.find(c => c.month === month) || CHAPTERS[0];
}

export function chapterByDate(dateStr) {
  const m = parseInt(dateStr.split("-")[1], 10);
  return CHAPTERS.find(c => c.month === m) || CHAPTERS[0];
}

// Determine if the current chapter has not been seen yet.
export function shouldShowChapter() {
  if (typeof window === "undefined") return false;
  const now = new Date();
  const m = now.getMonth() + 1;
  try {
    const seen = JSON.parse(localStorage.getItem("leproces_narrative_seen") || "{}");
    return seen.month !== m;
  } catch { return true; }
}

export function markChapterSeen() {
  if (typeof localStorage === "undefined") return;
  const now = new Date();
  localStorage.setItem("leproces_narrative_seen", JSON.stringify({ month: now.getMonth() + 1 }));
}
