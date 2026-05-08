// Floating glossary — tap-and-hold or click on legal terms to see definitions.

// 60+ key legal terms with short definitions.
export const GLOSSARY = {
  // Procédure
  "audience":         "Séance publique du tribunal où sont jugées les affaires.",
  "plaidoirie":       "Discours par lequel un avocat défend les intérêts de son client.",
  "réquisitoire":     "Discours par lequel le procureur requiert l'application de la loi (peine).",
  "verdict":          "Décision rendue par le juge ou le jury, déclarant un accusé coupable ou non.",
  "prévenu":          "Personne poursuivie devant un tribunal correctionnel.",
  "accusé":           "Personne poursuivie devant la cour d'assises pour un crime.",
  "demandeur":        "Partie qui engage l'action en justice (au civil).",
  "défendeur":        "Partie contre laquelle l'action est engagée (au civil).",
  "magistrat":        "Membre de la magistrature : juge ou procureur.",
  "greffier":         "Officier public qui assiste le juge et tient les registres.",
  "huissier":         "Officier ministériel chargé de signifier les actes judiciaires.",

  // Notions
  "présomption d'innocence": "Toute personne suspecte est présumée innocente jusqu'à preuve du contraire.",
  "doute raisonnable": "Tout doute sérieux profite à l'accusé : il n'est pas condamné.",
  "charge de la preuve": "C'est à celui qui invoque un fait de le prouver.",
  "contradictoire":   "Principe fondamental : aucune partie ne peut être jugée sans avoir été entendue.",
  "proportionnalité": "La sanction ne doit pas être excessive par rapport à la faute.",
  "imprescriptible":  "Crimes contre l'humanité notamment : ne se prescrivent jamais.",
  "récidive":         "Commettre une nouvelle infraction après avoir déjà été condamné.",
  "bonne foi":        "Présomption qu'on agit honnêtement, sans intention frauduleuse.",
  "dol":              "Tromperie volontaire qui vicie le consentement.",

  // Sanctions
  "sursis":           "Peine prononcée mais dont l'exécution est suspendue sous condition.",
  "ferme":            "Peine de prison à exécution effective (par opposition au sursis).",
  "amende":           "Sanction financière prononcée par un tribunal.",
  "TIG":              "Travaux d'intérêt général : peine alternative non privative de liberté.",
  "réclusion":        "Peine de privation de liberté criminelle (cour d'assises).",
  "détention":        "Privation de liberté provisoire ou définitive.",
  "relaxe":           "Décision par laquelle le tribunal correctionnel déclare le prévenu non coupable.",
  "acquittement":     "Idem en cour d'assises (pour un crime).",
  "non-lieu":         "Décision du juge d'instruction de ne pas poursuivre.",

  // Codes & textes
  "code civil":       "Le grand code du droit privé français (1804).",
  "code pénal":       "Code des infractions et des peines.",
  "code du travail":  "Code régissant la relation employeur-salarié.",
  "RGPD":             "Règlement Général sur la Protection des Données (UE, 2018).",
  "CESDH":            "Convention européenne des droits de l'homme.",
  "jurisprudence":    "Ensemble des décisions de justice qui constituent une source du droit.",
  "doctrine":         "Ensemble des analyses et commentaires des juristes universitaires.",

  // Civil
  "préjudice":        "Dommage subi pour lequel on demande réparation.",
  "dommages-intérêts": "Somme d'argent versée pour réparer un préjudice.",
  "responsabilité civile": "Obligation de réparer un dommage causé à autrui.",
  "vice caché":       "Défaut grave d'un bien vendu, non visible à l'achat.",
  "garantie de conformité": "Protection du consommateur sur 24 mois pour les produits défectueux.",
  "indemnité":        "Somme versée pour compenser une perte.",
  "prestation compensatoire": "Capital ou rente versé en cas de divorce pour compenser une disparité.",
  "indivision":       "Situation où plusieurs personnes possèdent un bien ensemble.",

  // Travail
  "licenciement":     "Rupture du contrat de travail à l'initiative de l'employeur.",
  "rupture conventionnelle": "Rupture du contrat de travail amiable, indemnisée.",
  "préavis":          "Période entre la notification du licenciement et son effet.",
  "harcèlement moral": "Agissements répétés dégradant les conditions de travail.",
  "période d'essai":  "Phase de début de contrat où chacun peut rompre librement.",
  "CDI / CDD":        "Contrat à durée indéterminée / déterminée.",
  "prud'hommes":      "Conseil paritaire qui juge les litiges du travail.",

  // Famille
  "autorité parentale": "Ensemble des droits et devoirs des parents envers leurs enfants.",
  "garde alternée":   "Mode de résidence de l'enfant alterné entre les deux parents.",
  "pension alimentaire": "Somme versée par un parent à l'autre pour l'enfant.",
  "tutelle":          "Mesure de protection d'un mineur ou majeur vulnérable.",

  // Pénal
  "vol":              "Soustraction frauduleuse de la chose d'autrui (art. 311-1 CP).",
  "escroquerie":      "Tromperie par fausse qualité ou manœuvre frauduleuse.",
  "recel":            "Détention d'un bien obtenu par crime ou délit.",
  "complicité":       "Participation à une infraction commise par un autre.",
  "légitime défense": "Acte commis pour se défendre face à une atteinte injustifiée.",
  "état de nécessité": "Acte commis pour éviter un danger imminent (art. 122-7 CP).",
  "préméditation":    "Décision réfléchie à l'avance de commettre une infraction.",
  "outrage":          "Insulte à un agent public dans l'exercice de ses fonctions.",

  // Routier
  "alcoolémie":       "Taux d'alcool dans le sang.",
  "récupération de points": "Reconstitution progressive du capital de 12 points du permis.",
  "délit de fuite":   "Quitter les lieux d'un accident sans s'identifier.",

  // Numérique
  "consentement":     "Sous RGPD : libre, spécifique, éclairé, univoque.",
  "DPO":              "Data Protection Officer — délégué à la protection des données.",
  "CNIL":             "Commission Nationale de l'Informatique et des Libertés.",
};

// Build a regex matching all glossary terms (case-insensitive, accents-insensitive).
let _termRegex = null;
function buildRegex() {
  if (_termRegex) return _termRegex;
  const terms = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);
  const escaped = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  _termRegex = new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");
  return _termRegex;
}

// Regex pour détecter une référence d'article : « article 311-1 », « article L1232-1 », « article R415-7 », « art. 1240 », etc.
// Capture le numéro d'article (avec lettre L/R/A/D optionnelle, chiffres, tirets, alinéas).
const ARTICLE_REGEX = /\b(?:articles?|art\.)\s+([LRAD]?\.?\s?\d+(?:[-\s]\d+)*(?:\s?bis|ter|quater)?)\b/gi;

// Cherche dans le codex une entrée correspondant à un numéro d'article.
function findCodexByArticle(articleNum) {
  const norm = articleNum.replace(/\s+/g, "").replace(/\./g, "").toUpperCase();
  // Lazy import to avoid circular deps in tests
  let entries = null;
  try {
    if (typeof window !== "undefined" && window._leprocesCodexEntries) {
      entries = window._leprocesCodexEntries;
    }
  } catch {}
  if (!entries) return null;
  return entries.find(e => {
    const id = e.id.replace(/[-_]/g, "").toUpperCase();
    const label = e.label.replace(/\s+/g, "").toUpperCase();
    return id.includes(norm) || label.includes(norm);
  }) || null;
}

// Decorate a text node : returns a fragment with <span class="glossary-term">...</span> for matched terms.
export function decorateText(text, onClick) {
  if (typeof document === "undefined") return null;
  const frag = document.createDocumentFragment();

  // 1ère passe : marquer toutes les correspondances (glossaire + articles)
  const matches = [];
  const termRegex = buildRegex();
  let m;
  termRegex.lastIndex = 0;
  while ((m = termRegex.exec(text)) !== null) {
    const term = m[0].toLowerCase();
    const def = GLOSSARY[term] || GLOSSARY[Object.keys(GLOSSARY).find(k => k.toLowerCase() === term)];
    if (def) matches.push({ start: m.index, end: m.index + m[0].length, label: m[0], def, type: "term" });
  }
  ARTICLE_REGEX.lastIndex = 0;
  while ((m = ARTICLE_REGEX.exec(text)) !== null) {
    const num = m[1];
    const codex = findCodexByArticle(num);
    const def = codex ? codex.body : `Article ${num} — référence légale (cliquez pour rechercher dans le codex).`;
    matches.push({ start: m.index, end: m.index + m[0].length, label: m[0], def, type: "article", codex });
  }
  // Trier et déduper (priorité au plus long en cas de chevauchement)
  matches.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start));
  const filtered = [];
  let lastEnd = 0;
  for (const mt of matches) {
    if (mt.start >= lastEnd) { filtered.push(mt); lastEnd = mt.end; }
  }

  let cursor = 0;
  for (const mt of filtered) {
    if (mt.start > cursor) frag.appendChild(document.createTextNode(text.slice(cursor, mt.start)));
    const span = document.createElement("span");
    span.className = mt.type === "article" ? "glossary-term glossary-article" : "glossary-term";
    span.textContent = mt.label;
    span.tabIndex = 0;
    span.setAttribute("role", "button");
    span.addEventListener("click", (e) => { e.stopPropagation(); onClick?.(mt.label, mt.def, mt); });
    span.addEventListener("keydown", (e) => { if (e.key === "Enter") onClick?.(mt.label, mt.def, mt); });
    frag.appendChild(span);
    cursor = mt.end;
  }
  if (cursor < text.length) frag.appendChild(document.createTextNode(text.slice(cursor)));
  return frag;
}

export function showGlossaryPopup(term, def) {
  if (typeof document === "undefined" || !def) return;
  const old = document.getElementById("glossary-popup");
  if (old) old.remove();
  const popup = document.createElement("div");
  popup.id = "glossary-popup";
  popup.className = "glossary-popup";
  popup.innerHTML = `<div class="gp-term">${term}</div><div class="gp-def">${def}</div>`;
  const close = document.createElement("button");
  close.className = "gp-close";
  close.textContent = "✕";
  close.onclick = () => popup.remove();
  popup.appendChild(close);
  document.body.appendChild(popup);
  setTimeout(() => popup.classList.add("show"), 10);
}
