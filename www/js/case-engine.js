// Case engine: daily case generation, cache, witness Q&A, special cases, evidence,
// underlying truth + lawyer quality + scoring of judge alignment.

import { Storage } from "./storage.js";
import { callAI } from "./ai-client.js";
import { getTodayDateStr, dayOfYear, caseNumber } from "./format.js";
import { maxAllowedDifficulty } from "./career.js";
import { reputationFlavor } from "./reputation.js";
import { citeForCategory } from "./jurisprudence.js";
import { pickOrCreateDefendant, flavorForReturning } from "./parties.js";
import { FALLBACK_POOL, pickFallbackCase } from "./fallback-pool.js";

export const CATEGORIES = [
  "penal", "civil", "famille", "travail", "consommation",
  "voisinage", "routier", "numerique", "environnement", "propriete_intellectuelle",
  "ubuesque",
];

export const CATEGORY_LABELS = {
  penal: "Pénal",
  civil: "Civil",
  famille: "Famille",
  travail: "Travail",
  consommation: "Consommation",
  voisinage: "Voisinage",
  routier: "Routier",
  numerique: "Numérique",
  environnement: "Environnement",
  propriete_intellectuelle: "Propriété intellectuelle",
  ubuesque: "Ubuesque",
};

export const CATEGORY_ICONS = {
  penal: "⚔", civil: "📄", famille: "👨‍👩‍👧", travail: "💼", consommation: "🛒",
  voisinage: "🏘", routier: "🚗", numerique: "💾", environnement: "🌿",
  propriete_intellectuelle: "©", ubuesque: "🎭",
};

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h) + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function getDailyCategoryFromDate(dateStr) {
  return CATEGORIES[hashStr(dateStr) % CATEGORIES.length];
}


export function getFallbackCase(category, seed = "") {
  return pickFallbackCase(category, seed);
}

// Enrich any case (fallback or AI) with hidden truth, lawyer qualities, evidence weights.
export function enrichCase(baseCase) {
  const seed = `${baseCase.title || ""}::${baseCase.category || ""}`;
  const h = hashStr(seed);
  const truth = (h % 2 === 0) ? "guilty" : "innocent";
  // Clarity of truth (1 = très ambigu, 5 = limpide). Most cases medium (2-4).
  const truthClarity = ((h >> 4) % 4) + 2;
  const prosecutionQuality = ((h >> 8) % 4) + 1;   // 1..4
  const defenseQuality     = ((h >> 12) % 4) + 1;  // 1..4
  return {
    ...baseCase,
    truth,
    truthClarity,
    prosecutionQuality,
    defenseQuality,
  };
}

// Compute an evaluation of the user's verdict against the underlying truth.
// Returns { aligned, score (0-100), label, bonusXp }.
export function evaluateVerdict(caseData, userVerdict, userSeverity) {
  const aligned = caseData.truth === userVerdict;
  // Score combines : alignment (60 pts), severity reasonableness (20 pts), arg/quality factor (20 pts)
  let score = 0;
  if (aligned) score += 60;
  // Severity heuristic: guilty + high severity if truth-clarity is high; non-coupable + low severity is fine
  const idealSev = caseData.truth === "guilty"
    ? Math.min(5, Math.round(2 + caseData.truthClarity * 0.6))
    : 1;
  const sevDiff = Math.abs(userSeverity - idealSev);
  score += Math.max(0, 20 - sevDiff * 6);
  // Lawyer quality bonus: if user followed the better lawyer, fair; otherwise insightful
  const followedProsec = userVerdict === "guilty";
  const lawyerStrength = followedProsec ? caseData.prosecutionQuality : caseData.defenseQuality;
  score += Math.min(20, lawyerStrength * 4);
  score = Math.max(0, Math.min(100, Math.round(score)));
  // Async i18n via dynamic require pattern: importer is sync at top to avoid circular issues; we just use t() if available.
  let label;
  // Fallback labels are FR; will be replaced by t() at display time
  if (aligned && score >= 85) label = "truth.label.exemplary";
  else if (aligned && score >= 65) label = "truth.label.good";
  else if (aligned) label = "truth.label.ok";
  else if (score >= 50) label = "truth.label.defendable";
  else label = "truth.label.off";
  const bonusXp = aligned ? 10 + Math.floor(score / 20) : 0;
  return { aligned, score, label, bonusXp };
}

async function buildSystemPrompt(category) {
  const { getLang } = await import("./i18n.js");
  const lang = getLang();
  if (lang === "en") {
    return `You are a legal-fiction writer for a realistic court mobile game.
Generate a plausible court case in the category: ${category}.

STRICT RULES:
- Serious, professional courtroom tone. Precise but accessible legal vocabulary.
- Realistic and plausible facts. No absurdity, no surrealism, no fantasy.
- Anonymous: initials or fictional names (Mr. D., Ms. L.). No real persons, brands, or identifiable famous cases.
- No graphic violence, sexual content, child victims, partisan politics.
- The verdict must be ambiguous: both sides have solid legal or factual arguments.
- Cite 1-2 statutes or principles (US/UK common law, GDPR, contract law, criminal code…) when relevant, without inventing.
- Difficulty = legal complexity (1 = obvious, 5 = serious doctrinal knot).

RESPOND IN VALID JSON ONLY (no markdown, no backticks):
{
  "title": "Case title, 5-12 words, descriptive",
  "context": "Facts of the case, 1-2 factual sentences (~40 words)",
  "prosecutionSpeech": "Prosecution/plaintiff pleading, 120-150 words, firm tone with legal grounds",
  "defenseSpeech": "Defense/defendant pleading, 120-150 words, measured tone with legal grounds",
  "category": "${category}",
  "difficulty": 3
}`;
  }
  return `Tu es scénariste juridique pour un jeu mobile de procès réalistes.
Génère un cas de tribunal plausible inspiré du droit français, dans la catégorie : ${category}.

RÈGLES STRICTES :
- Ton sérieux et professionnel, registre prétoire. Vocabulaire juridique précis mais compréhensible.
- Faits réalistes et plausibles : pas d'absurde, pas de surréalisme, pas de fantaisie.
- Anonyme : initiales ou noms fictifs (M. D., Mme L.). Aucune personne réelle, aucune marque, aucune affaire célèbre identifiable.
- Pas de violence graphique, pas de contenu sexuel, pas d'enfants victimes, pas de politique partisane.
- Le verdict doit être ambigu : les deux parties ont des arguments solides, juridiques ou factuels.
- Citer 1-2 articles de loi ou principes (Code civil, Code pénal, RGPD, Code du travail, Code de la route…) quand c'est pertinent, sans en inventer.
- Difficulté = complexité juridique du cas (1 = évident, 5 = nœud doctrinal sérieux).

RÉPONDS UNIQUEMENT EN JSON VALIDE (pas de markdown, pas de backticks) :
{
  "title": "Titre du procès, 5-12 mots, descriptif",
  "context": "Faits de l'affaire, 1-2 phrases factuelles (~40 mots)",
  "prosecutionSpeech": "Réquisitoire de l'accusation, 120-150 mots, ton ferme et motivé en droit",
  "defenseSpeech": "Plaidoirie de la défense, 120-150 mots, ton mesuré et motivé en droit",
  "category": "${category}",
  "difficulty": 3
}`;
}

export function parseCaseJSON(content, category) {
  let raw = (content || "").trim();
  // strip ```json ... ``` if present
  raw = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
  // attempt to extract first {...} block
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start !== -1 && end !== -1) raw = raw.slice(start, end + 1);
  try {
    const parsed = JSON.parse(raw);
    if (!parsed.title || !parsed.prosecutionSpeech || !parsed.defenseSpeech) throw new Error("missing fields");
    return {
      title: String(parsed.title),
      context: String(parsed.context || ""),
      prosecutionSpeech: String(parsed.prosecutionSpeech),
      defenseSpeech: String(parsed.defenseSpeech),
      category: parsed.category || category,
      difficulty: Number(parsed.difficulty) || 3,
    };
  } catch {
    return null;
  }
}

async function generateCase(category, dateStr) {
  const systemPrompt = await buildSystemPrompt(category);
  try {
    const { content } = await callAI(
      [{ role: "user", content: `Date du procès : ${dateStr}. Catégorie : ${category}. Génère le cas.` }],
      { systemPrompt, maxTokens: 1200 },
    );
    const parsed = parseCaseJSON(content, category);
    if (parsed) return parsed;
    return getFallbackCase(category);
  } catch (e) {
    console.warn("[case-engine] generation failed, using fallback:", e.message);
    return getFallbackCase(category);
  }
}

// Special case markers: rare events that trigger XP multipliers / unique flavour
export const SPECIAL_TYPES = {
  none: { id: "none", label: "", multiplier: 1 },
  cause_celebre: { id: "cause_celebre", label: "🎭 Cause célèbre", multiplier: 2, desc: "La salle est comble. La presse est là. Vos décisions feront jurisprudence." },
  affaire_sensible: { id: "affaire_sensible", label: "🔥 Affaire sensible", multiplier: 1.8, desc: "Pression médiatique. Chaque mot pèsera." },
  audience_solennelle: { id: "audience_solennelle", label: "🏛 Audience solennelle", multiplier: 1.5, desc: "Cinq juges en robe rouge. La gravité est palpable." },
  expert_present: { id: "expert_present", label: "🔬 Expert présent", multiplier: 1.3, desc: "Un expert judiciaire viendra éclairer le tribunal." },
};

function rollSpecial(profile) {
  const total = profile.totalVerdicts || 0;
  const r = Math.random();
  if (total >= 100 && r < 0.05) return SPECIAL_TYPES.cause_celebre;
  if (total >= 50 && r < 0.10) return SPECIAL_TYPES.affaire_sensible;
  if (total >= 20 && r < 0.15) return SPECIAL_TYPES.audience_solennelle;
  if (r < 0.20) return SPECIAL_TYPES.expert_present;
  return SPECIAL_TYPES.none;
}

// Evidence templates with descriptions + weight (-2..+2 toward guilty).
// Each entry: { label, body (full description shown in modal), weight, slant }
// slant: "guilty" | "innocent" | "neutral" — what direction this piece pushes.
const EVIDENCE_TEMPLATES = {
  penal: [
    { label: "Procès-verbal de constatation",  body: "Le PV décrit l'attitude du prévenu lors de l'interpellation : agitation, propos contradictoires, présence d'objets compatibles avec les faits.", slant: "guilty",   weight: 2 },
    { label: "Témoignage anonyme recueilli",   body: "Un témoin déclare avoir vu le prévenu à proximité de la scène, mais sa description physique diffère par plusieurs détails.",                       slant: "innocent", weight: -1 },
    { label: "Expertise psychologique",        body: "Le rapport conclut à un profil sans antécédent pathologique, des regrets exprimés et une coopération à l'enquête.",                                slant: "innocent", weight: -1 },
    { label: "Vidéosurveillance partielle",    body: "Les images ne couvrent pas l'instant des faits ; on y voit le prévenu 12 minutes avant et 4 minutes après, l'air calme.",                          slant: "neutral",  weight: 0 },
    { label: "Casier judiciaire",              body: "Le casier mentionne une condamnation passée pour des faits comparables, déjà purgée. La récidive est une circonstance aggravante.",                slant: "guilty",   weight: 1 },
  ],
  civil: [
    { label: "Contrat signé par les parties",  body: "Le contrat précise les obligations réciproques. Une clause centrale, lue attentivement, peut être interprétée dans les deux sens.",                slant: "neutral",  weight: 0 },
    { label: "Lettres recommandées (×3)",      body: "Trois mises en demeure successives sont produites. La date de la première est antérieure à la rupture des relations.",                              slant: "guilty",   weight: 2 },
    { label: "Constat d'huissier",             body: "L'huissier décrit les lieux et constate visuellement l'état d'avancement (ou de dégradation) des prestations en cause.",                            slant: "guilty",   weight: 1 },
    { label: "Témoignages écrits",             body: "Deux témoins indépendants confirment la version de la défense ; un troisième livre une version plus nuancée.",                                      slant: "innocent", weight: -1 },
    { label: "Devis et factures",              body: "Le préjudice chiffré apparaît cohérent avec les prix de marché ; aucune facture suspecte de complaisance.",                                         slant: "neutral",  weight: 0 },
  ],
  famille: [
    { label: "Convention parentale antérieure", body: "La convention initiale fixait l'équilibre entre les parents. Toute modification doit prouver un changement de circonstances.",                     slant: "neutral",  weight: 0 },
    { label: "Bulletin scolaire de l'enfant",   body: "Les résultats sont stables, la maîtresse souligne un enfant équilibré. Aucun signe de souffrance n'est rapporté.",                                  slant: "innocent", weight: -1 },
    { label: "Rapport d'enquête sociale",       body: "L'enquêteur a rendu visite aux deux parents : un cadre est jugé plus structurant pour l'enfant.",                                                    slant: "guilty",   weight: 1 },
    { label: "Attestations familiales",         body: "Plusieurs proches livrent des témoignages convergents en faveur de l'une des parties — leur partialité est probable.",                              slant: "neutral",  weight: 0 },
    { label: "Audition de l'enfant",            body: "L'enfant, entendu en chambre du conseil, exprime une préférence claire que le juge doit pondérer en fonction de son âge et discernement.",          slant: "innocent", weight: -1 },
  ],
  travail: [
    { label: "Contrat de travail signé",        body: "Le contrat est en CDI avec clauses standards. Aucune clause ne tranche directement le litige.",                                                     slant: "neutral",  weight: 0 },
    { label: "Lettre de licenciement",          body: "La lettre énonce 4 griefs précis ; deux sont datés et documentés, deux restent évasifs.",                                                            slant: "guilty",   weight: 1 },
    { label: "Bulletins de paie (12 derniers)", body: "Aucun trouble apparent dans la rémunération ; les heures sup. ne figurent pas, ce qui interroge.",                                                   slant: "innocent", weight: -1 },
    { label: "Mails internes (capture)",        body: "Un échange montre une tension réelle entre la direction et le salarié, sans qu'aucune des deux parties ne soit à l'évidence dans son tort.",         slant: "neutral",  weight: 0 },
    { label: "Compte rendu d'entretien préalable", body: "Le compte rendu, signé par le délégué syndical, soulève des doutes sur la sincérité du motif invoqué.",                                            slant: "innocent", weight: -2 },
  ],
  consommation: [
    { label: "Facture d'achat",                  body: "Date d'achat et prix sont confirmés. Le délai de garantie légale court depuis cette date.",                                                          slant: "neutral",  weight: 0 },
    { label: "Échanges avec le SAV",             body: "Les courriels du SAV reconnaissent à demi-mot l'existence d'un défaut, tout en proposant un dédommagement réduit.",                                  slant: "guilty",   weight: 2 },
    { label: "Expertise indépendante",           body: "L'expert privé attribue le défaut à la conception d'origine ; sa neutralité a été questionnée par l'autre partie.",                                  slant: "guilty",   weight: 1 },
    { label: "Photos du produit défectueux",     body: "Les photos montrent le défaut sous plusieurs angles. La date d'horodatage est cohérente avec le signalement.",                                       slant: "guilty",   weight: 1 },
    { label: "Conditions générales de vente",    body: "Une clause exclut certains défauts. Elle pourrait être réputée non écrite si jugée abusive.",                                                        slant: "neutral",  weight: 0 },
  ],
  voisinage: [
    { label: "Constat d'huissier daté",          body: "L'huissier a constaté lui-même les nuisances à des heures précises, en mesurant niveau et fréquence.",                                                slant: "guilty",   weight: 2 },
    { label: "Mesures sonométriques certifiées", body: "L'enregistrement atteint des pics supérieurs aux seuils OMS, mais la moyenne reste juste sous le seuil légal local.",                                slant: "neutral",  weight: 0 },
    { label: "Plan cadastral et bornage",        body: "Le plan vient préciser les limites séparatives. La situation est conforme — ou non — selon l'angle de lecture.",                                     slant: "neutral",  weight: 0 },
    { label: "PLU communal",                     body: "Le PLU classe la zone en mixité résidentielle/agricole — l'usage litigieux est explicitement toléré dans ce zonage.",                                slant: "innocent", weight: -2 },
    { label: "Pétition des voisins (12 sign.)",  body: "Une pétition rassemble 12 signatures. Trois signataires reconnaissent en audition n'avoir personnellement rien constaté.",                            slant: "guilty",   weight: 1 },
  ],
  routier: [
    { label: "Constat amiable signé",            body: "Le constat est signé des deux parties, mais une croix mal positionnée a été contestée le lendemain par l'une des parties.",                          slant: "neutral",  weight: 0 },
    { label: "PV de gendarmerie",                body: "Les agents notent une trace de freinage de 4,2 m attribuable à un seul véhicule, et une visibilité réduite par un container.",                       slant: "innocent", weight: -1 },
    { label: "Croquis de la collision",          body: "Le croquis officiel montre un angle de choc compatible avec deux scénarios — celui décrit par chacune des parties.",                                 slant: "neutral",  weight: 0 },
    { label: "Photographies du carrefour",       body: "Les photos prises à la même heure que les faits montrent une signalisation partiellement masquée.",                                                  slant: "innocent", weight: -1 },
    { label: "Relevé d'éthylotest",              body: "Le relevé est négatif pour les deux conducteurs. L'alcoolémie n'est donc pas une explication.",                                                       slant: "innocent", weight: -1 },
  ],
  numerique: [
    { label: "Capture d'écran des CGU",          body: "La case d'opt-in est précochée et noyée dans 47 pages — la jurisprudence CNIL invalide ce mécanisme.",                                                slant: "guilty",   weight: 2 },
    { label: "Logs serveur du dépôt de cookie",  body: "Les cookies sont déposés AVANT toute interaction de l'utilisateur — la chronologie est sans appel.",                                                  slant: "guilty",   weight: 2 },
    { label: "Politique de confidentialité",     body: "Le document est rédigé clairement, mais sa visibilité (lien en pied de page, police 8 pt) est jugée insuffisante par certaines normes.",             slant: "neutral",  weight: 0 },
    { label: "Mises à jour de l'opt-out",        body: "Un rappel de paramétrage a été envoyé en 2023 ; 8 % des utilisateurs ont exercé l'opt-out, ce qui prouve une réelle accessibilité.",                  slant: "innocent", weight: -1 },
    { label: "Rapport DPO interne",              body: "Le DPO avait alerté sur le risque juridique 6 mois avant le contentieux. Note interne produite.",                                                     slant: "guilty",   weight: 1 },
  ],
  environnement: [
    { label: "Rapport DREAL d'inspection",       body: "Le rapport, daté de 12 mois avant les faits, alertait sur la corrosion de la cuve. Aucune action correctrice depuis.",                                slant: "guilty",   weight: 2 },
    { label: "Analyses chimiques",               body: "Les prélèvements en aval révèlent des concentrations ponctuelles supérieures aux seuils admis, retour à la normale après 9 jours.",                  slant: "guilty",   weight: 1 },
    { label: "Bulletin Météo-France",            body: "L'épisode pluvieux est qualifié de centennal — argument pour la cause étrangère opposable.",                                                          slant: "innocent", weight: -2 },
    { label: "Plan de gestion ICPE",             body: "Le plan respecte la réglementation. Cependant, certaines mesures « optionnelles » n'ont pas été mises en œuvre.",                                     slant: "neutral",  weight: 0 },
    { label: "Inventaire biodiversité post-incident", body: "L'inventaire montre une récupération à 95 % à 6 mois — efforts de dépollution réels.",                                                            slant: "innocent", weight: -1 },
  ],
  propriete_intellectuelle: [
    { label: "Expertise musicologique",          body: "L'expert relève 7 notes consécutives identiques en tonalité et tempo. La probabilité d'une coïncidence est jugée faible mais possible.",            slant: "guilty",   weight: 2 },
    { label: "Statistiques de plateforme",       body: "L'œuvre antérieure a été écoutée 3 fois par la directrice artistique, selon les logs de la plateforme — sans certitude de l'identification.",        slant: "guilty",   weight: 1 },
    { label: "Comparaisons avec œuvres tierces", body: "Une dizaine de morceaux antérieurs utilisent la même progression I-V-vi-IV — il s'agit d'un pattern banal du langage musical.",                      slant: "innocent", weight: -2 },
    { label: "Dépôt INPI",                       body: "Le dépôt formel de l'œuvre antérieure est antérieur de 3 ans à l'œuvre litigieuse — l'antériorité est établie.",                                      slant: "guilty",   weight: 1 },
    { label: "Témoignage du producteur",         body: "Le producteur affirme la création autonome et présente des documents de travail datés.",                                                              slant: "innocent", weight: -1 },
  ],
  ubuesque: [
    { label: "Pièce à conviction n°1 (le truc)", body: "L'objet a été retrouvé là où on ne l'attendait pas. Sa simple présence pose question.",                                                                slant: "guilty",   weight: 1 },
    { label: "Témoignage du facteur",            body: "Le facteur passe tous les jours, et il a tout vu. Son intuition vaut un rapport d'expertise.",                                                          slant: "innocent", weight: -1 },
    { label: "Photo prise par un pigeon",        body: "Le cliché, étonnamment net pour un volatile, montre une scène équivoque.",                                                                              slant: "neutral",  weight: 0 },
    { label: "Note manuscrite anonyme",          body: "Une note retrouvée sous le paillasson : « j'ai tout fait. — Anonyme ». Possible confession ou possible canular.",                                       slant: "guilty",   weight: 1 },
    { label: "Procès-verbal d'huissier-poète",   body: "L'huissier a versifié son constat. La métaphore de l'aube glaciale n'est pas sans laisser planer un doute.",                                            slant: "neutral",  weight: 0 },
  ],
};

function generateEvidence(category, date) {
  const pool = EVIDENCE_TEMPLATES[category] || EVIDENCE_TEMPLATES.civil;
  const n = 2 + Math.floor(Math.random() * 3); // 2 to 4
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n).map((t, i) => ({
    id: `ev-${i + 1}`,
    label: t.label.replace("{date}", date),
    body: t.body,
    slant: t.slant,
    weight: t.weight,
    examined: false,
  }));
}

// Witness pool (procedural, locale)
const WITNESS_PROFILES = [
  { name: "expert judiciaire", style: "technique et précis" },
  { name: "voisin direct", style: "spontané et émotif" },
  { name: "proche de la victime", style: "ému, parfois confus" },
  { name: "témoin oculaire", style: "concret, factuel" },
  { name: "témoin de moralité", style: "élogieux, mesuré" },
  { name: "ancien employé", style: "rancunier mais informé" },
];

function generateWitnesses(profile, special) {
  const n = special.id === "cause_celebre" ? 4 : (Math.random() < 0.6 ? 2 : 3);
  const shuffled = [...WITNESS_PROFILES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n).map((w, i) => ({ id: `w-${i + 1}`, ...w, available: true }));
}

export async function getDailyCase({ forceRegenerate = false } = {}) {
  const today = getTodayDateStr();
  if (!forceRegenerate) {
    const cached = await Storage.getCachedCase(today);
    if (cached) return { ...cached, fromCache: true, caseNumber: caseNumber(today) };
  }
  const category = getDailyCategoryFromDate(today);
  const profile = Storage.getProfile();
  const settings = Storage.getSettings();
  // Career-gated difficulty
  const maxDiff = maxAllowedDifficulty(profile);
  const special = rollSpecial(profile);
  const baseCase = settings.apiKey
    ? await generateCase(category, today)
    : getFallbackCase(category, today);
  if (baseCase.difficulty > maxDiff) baseCase.difficulty = maxDiff;
  const enriched = enrichCase(baseCase);
  const defendant = pickOrCreateDefendant(category);
  const partyFlavor = flavorForReturning(defendant);
  const repFlavor = reputationFlavor(profile);
  const precedent = citeForCategory(category);
  const evidence = generateEvidence(category, today);
  const witnesses = generateWitnesses(profile, special);
  const full = {
    ...enriched,
    date: today,
    cachedAt: Date.now(),
    special: special.id,
    specialLabel: special.label,
    specialDesc: special.desc,
    multiplier: special.multiplier,
    defendant,
    partyFlavor,
    repFlavor,
    precedent: precedent ? { id: precedent.id, title: precedent.title, summary: (precedent.argument || "").slice(0, 160) } : null,
    evidence,
    witnesses,
  };
  await Storage.saveCase(full);
  return { ...full, fromCache: false, caseNumber: caseNumber(today) };
}

// Free audience: ad-hoc case generation outside the daily ritual (rate-limited).
export async function generateFreeCase({ category } = {}) {
  const settings = Storage.getSettings();
  const used = Storage.freeAudiencesToday();
  const limit = settings.freeAudienceLimit || 10;
  if (used >= limit) {
    const e = new Error(`Limite quotidienne atteinte (${limit} audiences libres). Reprise demain.`);
    e.code = "RATE_LIMIT";
    throw e;
  }
  const cat = category || CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
  const profile = Storage.getProfile();
  const seed = `free-${Date.now()}`;
  const baseCase = settings.apiKey
    ? await generateCase(cat, getTodayDateStr())
    : getFallbackCase(cat, seed);
  if (baseCase.difficulty > maxAllowedDifficulty(profile)) baseCase.difficulty = maxAllowedDifficulty(profile);
  const enriched = enrichCase(baseCase);
  const defendant = pickOrCreateDefendant(cat);
  const evidence = generateEvidence(cat, getTodayDateStr());
  const witnesses = generateWitnesses(profile, SPECIAL_TYPES.none);
  return {
    ...enriched,
    date: getTodayDateStr(),
    kind: "free",
    multiplier: 0.5, // free audiences give half XP (otherwise grind)
    special: "none",
    defendant,
    partyFlavor: flavorForReturning(defendant),
    evidence,
    witnesses,
    caseNumber: `LIBRE-${Date.now().toString(36).slice(-5).toUpperCase()}`,
  };
}

export async function getCaseForDate(dateStr) {
  const cached = await Storage.getCachedCase(dateStr);
  if (cached) return { ...cached, caseNumber: caseNumber(dateStr) };
  return null;
}

export async function askWitness(caseData, question, previousQA = []) {
  const systemPrompt = `Tu es un témoin imaginaire dans le procès "${caseData.title}".
Contexte : ${caseData.context}
Accusation : ${caseData.prosecutionSpeech}
Défense : ${caseData.defenseSpeech}

Réponds à la question du juge en 2-3 phrases, dans le ton grave-comique du procès.
Ne donne pas de verdict. Tu es témoin, pas juge.
Reste cohérent avec les plaidoiries.`;

  const messages = [];
  previousQA.forEach(qa => {
    messages.push({ role: "user", content: qa.question });
    messages.push({ role: "assistant", content: qa.answer });
  });
  messages.push({ role: "user", content: question });

  const { content, tokensIn, tokensOut, cost } = await callAI(messages, { systemPrompt, maxTokens: 400 });
  return { answer: content, tokensIn, tokensOut, cost };
}

// XP and achievement helpers (gameplay rules)
export const XP_RULES = {
  baseVerdict: 10,
  streakBonus: (streak) => Math.min(streak * 5, 50),
  argumentBonus: 10,
};

export function computeXpGain({ streak, hasArgument }) {
  return XP_RULES.baseVerdict + XP_RULES.streakBonus(streak) + (hasArgument ? XP_RULES.argumentBonus : 0);
}

export const ACHIEVEMENTS = [
  // Visibles (12)
  { id: "first_verdict",   label: "Premier verdict",     desc: "Prononcer son premier verdict",                hidden: false },
  { id: "streak_7",        label: "Streak 7 jours",      desc: "Juger 7 jours d'affilée",                      hidden: false },
  { id: "streak_30",       label: "Streak 30 jours",     desc: "Juger 30 jours d'affilée",                     hidden: false },
  { id: "verdicts_50",     label: "Demi-centurion",      desc: "50 verdicts au total",                         hidden: false },
  { id: "verdicts_100",    label: "Centurion",           desc: "100 verdicts au total",                        hidden: false },
  { id: "all_categories",  label: "Touche-à-tout",       desc: "Voter dans les 10 catégories",                 hidden: false },
  { id: "questioner",      label: "Curieux",             desc: "Poser 3 questions sur un même cas",            hidden: false },
  { id: "guilty_streak",   label: "Sévère",              desc: "5 verdicts coupables d'affilée",               hidden: false },
  { id: "innocent_streak", label: "Clément",             desc: "5 verdicts non-coupables d'affilée",           hidden: false },
  { id: "argumenter",      label: "Plaideur",            desc: "Écrire 10 arguments motivés",                  hidden: false },
  { id: "magistrat",       label: "Magistrat",           desc: "Atteindre le niveau 5",                        hidden: false },
  { id: "supreme",         label: "Cour Suprême",        desc: "Atteindre le niveau 6",                        hidden: false },
  // Cachés (30+)
  { id: "verdicts_500",    label: "Vétéran",             desc: "500 verdicts",                                  hidden: true },
  { id: "verdicts_1000",   label: "Pilier du palais",    desc: "1000 verdicts",                                 hidden: true },
  { id: "streak_100",      label: "Inflexible",          desc: "100 jours d'affilée",                           hidden: true },
  { id: "streak_365",      label: "Une année entière",   desc: "365 jours consécutifs",                         hidden: true },
  { id: "guilty_20",       label: "Procureur masqué",    desc: "20 coupables d'affilée",                        hidden: true },
  { id: "innocent_20",     label: "Saint patron",        desc: "20 non-coupables d'affilée",                    hidden: true },
  { id: "all_difficulties", label: "Toutes les eaux",    desc: "Juger tous les niveaux de difficulté",          hidden: true },
  { id: "argumenter_50",   label: "Verbe d'or",          desc: "50 arguments motivés",                          hidden: true },
  { id: "argumenter_200",  label: "Plume de Cassation",  desc: "200 arguments écrits",                          hidden: true },
  { id: "questioner_100",  label: "Détective",           desc: "100 questions posées au total",                 hidden: true },
  { id: "midnight",        label: "Le juge de minuit",   desc: "Rendre un verdict entre 0h et 4h",              hidden: true },
  { id: "earlybird",       label: "Lève-tôt",            desc: "Rendre un verdict avant 6h",                    hidden: true },
  { id: "weekend_streak",  label: "Sans répit",          desc: "Juger 4 week-ends consécutifs",                 hidden: true },
  { id: "cause_celebre",   label: "Cause célèbre",       desc: "Trancher une cause célèbre",                    hidden: true },
  { id: "cabinet_10",      label: "Premier cabinet",     desc: "10 objets de cabinet collectés",                hidden: true },
  { id: "cabinet_25",      label: "Cabinet meublé",      desc: "25 objets",                                     hidden: true },
  { id: "cabinet_complet", label: "Cabinet complet",     desc: "Tous les objets du cabinet",                    hidden: true },
  { id: "codex_50",        label: "Bibliothécaire",      desc: "50 % du codex juridique",                       hidden: true },
  { id: "codex_full",      label: "Maître du droit",     desc: "Codex juridique complet",                       hidden: true },
  { id: "weekly_first",    label: "Premier défi",        desc: "Compléter votre 1er défi hebdomadaire",         hidden: true },
  { id: "weekly_5",        label: "Habitué des défis",   desc: "Compléter 5 défis hebdomadaires",               hidden: true },
  { id: "share_first",     label: "Premier partage",     desc: "Partager votre premier verdict",                hidden: true },
  { id: "free_audience",   label: "Insatiable",          desc: "Tenir une audience libre",                      hidden: true },
  { id: "free_audience_50", label: "Tribunal sans repos", desc: "50 audiences libres",                          hidden: true },
  { id: "expert_mode",     label: "Magistrat aguerri",   desc: "Activer le mode expert",                        hidden: true },
  { id: "tts_listened",    label: "L'oreille du juge",   desc: "Écouter une plaidoirie en TTS",                 hidden: true },
  { id: "evidence_examined", label: "Œil aigu",          desc: "Examiner toutes les pièces d'un dossier",       hidden: true },
  { id: "historic_first",  label: "Histoire revisitée",  desc: "Juger un procès historique",                    hidden: true },
  { id: "historic_all",    label: "Maître des annales",  desc: "Juger tous les procès historiques",             hidden: true },
  { id: "jurisprudence_5", label: "Jurisprudence",       desc: "5 verdicts élevés au rang de précédent",        hidden: true },
  { id: "jurisprudence_20", label: "Faiseur de droit",   desc: "20 précédents personnels",                      hidden: true },
  { id: "perfect_quiz",    label: "Mention",             desc: "10 quiz juridiques sans erreur",                hidden: true },
  { id: "speed_judge",     label: "Justice expéditive",  desc: "Verdict en moins de 30 secondes",               hidden: true },
  { id: "long_thinker",    label: "Réflexion profonde",  desc: "Verdict après 5 minutes d'audience",            hidden: true },
  { id: "ten_themes",      label: "Esthète",             desc: "Tester les 8 thèmes visuels",                   hidden: true },
];

export function checkAchievements(profile, ctx = {}) {
  const unlocked = [];
  const v = profile.totalVerdicts || 0;
  if (v >= 1) unlocked.push("first_verdict");
  if (v >= 50) unlocked.push("verdicts_50");
  if (v >= 100) unlocked.push("verdicts_100");
  if (v >= 500) unlocked.push("verdicts_500");
  if (v >= 1000) unlocked.push("verdicts_1000");

  const s = Math.max(profile.streak || 0, profile.longestStreak || 0);
  if (s >= 7) unlocked.push("streak_7");
  if (s >= 30) unlocked.push("streak_30");
  if (s >= 100) unlocked.push("streak_100");
  if (s >= 365) unlocked.push("streak_365");

  if (profile.categoryCounts && Object.keys(profile.categoryCounts).length >= CATEGORIES.length) unlocked.push("all_categories");
  if ((profile.questionsAsked || 0) >= 3) unlocked.push("questioner");
  if ((profile.questionsAsked || 0) >= 100) unlocked.push("questioner_100");

  if ((profile.guiltyStreakBest || 0) >= 5) unlocked.push("guilty_streak");
  if ((profile.guiltyStreakBest || 0) >= 20) unlocked.push("guilty_20");
  if ((profile.innocentStreakBest || 0) >= 5) unlocked.push("innocent_streak");
  if ((profile.innocentStreakBest || 0) >= 20) unlocked.push("innocent_20");

  if ((profile.argumentsWritten || 0) >= 10) unlocked.push("argumenter");
  if ((profile.argumentsWritten || 0) >= 50) unlocked.push("argumenter_50");
  if ((profile.argumentsWritten || 0) >= 200) unlocked.push("argumenter_200");

  if ((profile.totalXp || 0) >= 1000) unlocked.push("magistrat");
  if ((profile.totalXp || 0) >= 2000) unlocked.push("supreme");

  // Difficulty diversity
  if (profile.difficultiesSeen && profile.difficultiesSeen.length >= 5) unlocked.push("all_difficulties");

  // Time-of-day
  if (ctx.hour != null) {
    if (ctx.hour < 4) unlocked.push("midnight");
    if (ctx.hour < 6) unlocked.push("earlybird");
  }
  if (ctx.weekendStreak >= 4) unlocked.push("weekend_streak");
  if (ctx.special === "cause_celebre") unlocked.push("cause_celebre");
  if (ctx.cabinetCount >= 10) unlocked.push("cabinet_10");
  if (ctx.cabinetCount >= 25) unlocked.push("cabinet_25");
  if (ctx.cabinetFull) unlocked.push("cabinet_complet");
  if (ctx.codexPct >= 50) unlocked.push("codex_50");
  if (ctx.codexPct >= 100) unlocked.push("codex_full");
  if (ctx.weeklyCompleted >= 1) unlocked.push("weekly_first");
  if (ctx.weeklyCompleted >= 5) unlocked.push("weekly_5");
  if (ctx.shared) unlocked.push("share_first");
  if (ctx.freeAudiences >= 1) unlocked.push("free_audience");
  if (ctx.freeAudiences >= 50) unlocked.push("free_audience_50");
  if (ctx.expertMode) unlocked.push("expert_mode");
  if (ctx.tts) unlocked.push("tts_listened");
  if (ctx.evidenceAllExamined) unlocked.push("evidence_examined");
  if (ctx.historicCount >= 1) unlocked.push("historic_first");
  if (ctx.historicCount >= 10) unlocked.push("historic_all");
  if ((profile.precedentsCreated || 0) >= 5) unlocked.push("jurisprudence_5");
  if ((profile.precedentsCreated || 0) >= 20) unlocked.push("jurisprudence_20");
  if ((profile.perfectQuizzes || 0) >= 10) unlocked.push("perfect_quiz");
  if (ctx.verdictMs != null && ctx.verdictMs < 30000) unlocked.push("speed_judge");
  if (ctx.verdictMs != null && ctx.verdictMs > 300000) unlocked.push("long_thinker");
  if (ctx.themesTried >= 8) unlocked.push("ten_themes");

  return unlocked;
}
