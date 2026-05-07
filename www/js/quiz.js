// Post-verdict quick quiz: 1-2 multi-choice question on the case's legal aspect.
// Adds a +5 XP bonus for correct answers, helps memorize the codex.

const QUIZ_BANK = {
  penal: [
    {
      q: "Quelle est la définition pénale du vol ?",
      options: ["L'usage frauduleux d'un bien", "La soustraction frauduleuse de la chose d'autrui", "L'appropriation par négligence", "L'achat à un prix dérisoire"],
      correct: 1,
      ref: "Article 311-1 du Code pénal",
    },
    {
      q: "L'état de nécessité est régi par quel article ?",
      options: ["121-3", "122-1", "122-7", "311-1"],
      correct: 2,
      ref: "Article 122-7 du Code pénal",
    },
  ],
  civil: [
    {
      q: "Quel principe fonde la responsabilité civile ?",
      options: ["Présomption d'innocence", "Article 1240 — tout fait causant un dommage oblige à réparation", "L'autonomie de la volonté absolue", "L'interdiction de l'enrichissement sans cause"],
      correct: 1,
      ref: "Article 1240 du Code civil",
    },
  ],
  famille: [
    {
      q: "Quel critère guide les décisions concernant l'autorité parentale ?",
      options: ["L'intérêt économique du parent", "L'intérêt supérieur de l'enfant", "L'ancienneté du mariage", "Le souhait du parent gardien"],
      correct: 1,
      ref: "Article 373-2-11 du Code civil",
    },
  ],
  travail: [
    {
      q: "Tout licenciement personnel doit être justifié par…",
      options: ["Une raison invoquée", "Une cause réelle et sérieuse", "Un avertissement préalable", "Une faute lourde"],
      correct: 1,
      ref: "Article L1232-1 du Code du travail",
    },
    {
      q: "L'article L1121-1 protège…",
      options: ["Le secret des affaires", "Les libertés individuelles du salarié", "Les jours de congé payés", "Le treizième mois"],
      correct: 1,
      ref: "Article L1121-1 du Code du travail",
    },
  ],
  consommation: [
    {
      q: "Pendant combien de mois après la délivrance le défaut est-il présumé exister à la livraison ?",
      options: ["6 mois", "12 mois", "24 mois", "36 mois"],
      correct: 2,
      ref: "Article L217-7 du Code de la consommation (depuis la réforme 2022)",
    },
  ],
  voisinage: [
    {
      q: "La théorie de la pré-occupation se fonde sur…",
      options: ["L'article 1382 ancien", "L'article L113-8 du Code de la construction et de l'habitation", "L'article R110-1 du Code de l'urbanisme", "Aucun texte précis, jurisprudence pure"],
      correct: 1,
      ref: "Article L113-8 CCH",
    },
  ],
  routier: [
    {
      q: "À une intersection sans signalisation, qui a la priorité ?",
      options: ["Le véhicule le plus rapide", "Le véhicule venant de la droite", "Le véhicule venant de la gauche", "Le véhicule prioritaire d'office"],
      correct: 1,
      ref: "Article R415-5 du Code de la route",
    },
  ],
  numerique: [
    {
      q: "Sous le RGPD, le consentement doit être…",
      options: ["Implicite et général", "Libre, spécifique, éclairé et univoque", "Donné par écrit uniquement", "Demandé une fois pour toutes"],
      correct: 1,
      ref: "Article 7 du RGPD",
    },
  ],
  environnement: [
    {
      q: "Le préjudice écologique pur est consacré dans le Code civil à l'article…",
      options: ["1240", "1242", "1247", "1252"],
      correct: 2,
      ref: "Article 1247 du Code civil",
    },
  ],
  propriete_intellectuelle: [
    {
      q: "Quelle condition cumulative est requise pour une œuvre protégeable ?",
      options: ["Être publiée à 100 exemplaires", "Présenter une originalité, empreinte de la personnalité de l'auteur", "Être déposée à l'INPI", "Avoir un éditeur reconnu"],
      correct: 1,
      ref: "Article L112-1 et jurisprudence constante",
    },
  ],
};

export function pickQuiz(category) {
  const pool = QUIZ_BANK[category] || [];
  if (!pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function score(question, chosenIndex) {
  return chosenIndex === question.correct;
}
