// Mode "Devine la peine" : 10 vrais cas historiques, le joueur tente de deviner la sentence prononcée.

import { Storage } from "./storage.js";

export const GUESS_CASES = [
  {
    id: "gs-vol",
    title: "Vol simple à l'étalage récidiviste",
    desc: "Un homme déjà condamné 3 fois pour vol entre dans une supérette et dérobe pour 240 € de vin et chocolat. Il est interpellé à la sortie.",
    options: [
      { label: "Rappel à la loi", correctIdx: false },
      { label: "Amende 300 €", correctIdx: false },
      { label: "3 mois de prison ferme", correctIdx: true },
      { label: "1 an de prison ferme", correctIdx: false },
    ],
    explanation: "La récidive aggrave significativement la peine. Trois mois fermes pour vol simple à 4ᵉ récidive est la moyenne basse française.",
  },
  {
    id: "gs-permis",
    title: "Conduite sans permis, 1ʳᵉ fois",
    desc: "Une jeune femme de 22 ans est interceptée au volant. Permis jamais passé. Aucun antécédent.",
    options: [
      { label: "Avertissement", correctIdx: false },
      { label: "Amende 600 € + suspension", correctIdx: true },
      { label: "Travaux d'intérêt général", correctIdx: false },
      { label: "Incarcération 1 mois", correctIdx: false },
    ],
    explanation: "Article L221-2 du Code de la route. La 1ʳᵉ fois sans antécédent : amende 5e classe + interdiction de passer le permis pendant 1 an.",
  },
  {
    id: "gs-licenciement",
    title: "Licenciement pour faute grave abusif",
    desc: "Un cadre commercial avec 12 ans d'ancienneté est licencié pour faute grave après une dispute orale. Pas de préavis, pas d'indemnités. Il saisit les prud'hommes.",
    options: [
      { label: "Réintégration imposée", correctIdx: false },
      { label: "Indemnité 6 mois de salaire", correctIdx: true },
      { label: "Indemnité 24 mois", correctIdx: false },
      { label: "Aucune compensation", correctIdx: false },
    ],
    explanation: "Cass. soc. : 6 mois est le plancher fréquent pour 12 ans d'ancienneté en cas de faute grave non caractérisée (barème Macron actuel).",
  },
  {
    id: "gs-divorce",
    title: "Divorce — prestation compensatoire",
    desc: "Mariage 22 ans, femme au foyer ayant renoncé à sa carrière. Mari cadre supérieur. Différence revenus : 6 000 €/mois.",
    options: [
      { label: "Aucune prestation", correctIdx: false },
      { label: "30 000 € en capital", correctIdx: false },
      { label: "180 000 € en capital", correctIdx: true },
      { label: "500 000 €", correctIdx: false },
    ],
    explanation: "Méthode courante : 6000 € × 12 mois × 2.5 (durée résiduelle vie active) = 180k. Le calcul jurisprudentiel le plus utilisé.",
  },
  {
    id: "gs-vitesse",
    title: "Excès de vitesse > 50 km/h",
    desc: "Conducteur flashé à 162 km/h sur une route limitée à 90. Pas d'antécédent.",
    options: [
      { label: "Amende 135 €", correctIdx: false },
      { label: "Suspension 6 mois + 1500 € + retrait 6 points", correctIdx: true },
      { label: "Annulation permis", correctIdx: false },
      { label: "Prison ferme", correctIdx: false },
    ],
    explanation: "Délit (>50 km/h) : retrait de 6 points, suspension judiciaire jusqu'à 3 ans, amende jusqu'à 3 750 €. Standard 1ʳᵉ fois : 6 mois + 1500 €.",
  },
  {
    id: "gs-rgpd",
    title: "Violation RGPD massive (40M utilisateurs)",
    desc: "Une plateforme française a stocké en clair les mots de passe de 40 millions d'utilisateurs. Pas de fuite, mais audit CNIL.",
    options: [
      { label: "Avertissement public", correctIdx: false },
      { label: "Amende 50 000 €", correctIdx: false },
      { label: "Amende 5 millions €", correctIdx: true },
      { label: "Amende 1 milliard €", correctIdx: false },
    ],
    explanation: "Article 83 RGPD. Pour gravité élevée + nombre de personnes concernées, amende administrative dans la fourchette 4-10 M €. La CNIL utilise rarement les plafonds extrêmes.",
  },
  {
    id: "gs-injure",
    title: "Injure publique en ligne",
    desc: "Une internaute traite publiquement une journaliste de « racisme ». Tweet vu 4 000 fois. Plainte de la journaliste.",
    options: [
      { label: "Relaxe (liberté d'expression)", correctIdx: false },
      { label: "Amende 1 000 € + retrait", correctIdx: true },
      { label: "3 mois de prison", correctIdx: false },
      { label: "Inéligibilité 5 ans", correctIdx: false },
    ],
    explanation: "Loi 1881, injure publique : amende standard 1000-3000 € pour 1ʳᵉ infraction, sans circonstance aggravante.",
  },
  {
    id: "gs-pollution",
    title: "Pollution accidentelle d'un cours d'eau",
    desc: "Une PME industrielle déverse 800 L d'effluents dans un ruisseau Natura 2000 après défaillance technique. Dépollution rapide.",
    options: [
      { label: "Aucune sanction", correctIdx: false },
      { label: "12 000 € d'amende + remise en état", correctIdx: true },
      { label: "100 000 €", correctIdx: false },
      { label: "Fermeture administrative", correctIdx: false },
    ],
    explanation: "Article L216-6. Amende jusqu'à 75 000 €, mais en cas de bonne foi + dépollution rapide, transaction pénale courante autour de 10-20 k €.",
  },
  {
    id: "gs-stationnement",
    title: "Stationnement gênant aggravé",
    desc: "Camion stationné devant la sortie de secours d'un immeuble pendant 3h. Pas d'incident.",
    options: [
      { label: "Amende 35 €", correctIdx: false },
      { label: "Amende 135 € + mise en fourrière", correctIdx: true },
      { label: "Suspension permis", correctIdx: false },
      { label: "Aucune sanction", correctIdx: false },
    ],
    explanation: "R417-10 : 4ᵉ classe (135 €). Fourrière : oui dès lors que la voiture entrave la sécurité.",
  },
  {
    id: "gs-mediator",
    title: "Médicament détourné — homicide involontaire collectif",
    desc: "Laboratoire qui a continué à commercialiser un médicament malgré des alertes sanitaires. Centaines de morts indirectes établies.",
    options: [
      { label: "Pas de poursuites pénales", correctIdx: false },
      { label: "Amendes 2,7 M € + indemnisation civile", correctIdx: true },
      { label: "Fermeture définitive", correctIdx: false },
      { label: "Peines de prison ferme massives", correctIdx: false },
    ],
    explanation: "Affaire Mediator (Servier, 2021) : amende du laboratoire 2,7 M € + 180 M € de fonds d'indemnisation. Volet pénal individuel limité (négligence sans homicide intentionnel).",
  },
];

export function unseenGuessCases() {
  const seen = Storage.getKey("guess_seen", { ids: [] });
  return GUESS_CASES.filter(g => !seen.ids.includes(g.id));
}

export function markGuessSeen(id) {
  const seen = Storage.getKey("guess_seen", { ids: [] });
  if (!seen.ids.includes(id)) {
    seen.ids.push(id);
    Storage.setKey("guess_seen", seen);
  }
}

export function pickRandomGuessCase() {
  const pool = unseenGuessCases();
  if (!pool.length) {
    // All seen → reset
    Storage.setKey("guess_seen", { ids: [] });
    return GUESS_CASES[Math.floor(Math.random() * GUESS_CASES.length)];
  }
  return pool[Math.floor(Math.random() * pool.length)];
}
