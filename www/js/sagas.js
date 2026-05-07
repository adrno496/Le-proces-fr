// Multi-day sagas — sequential cases tied to a recurring character.
// Player progresses through 5 acts; each verdict influences the next.

import { Storage } from "./storage.js";

export const SAGAS = [
  {
    id: "saga-lemaire",
    title: "L'affaire Lemaire — 5 actes",
    desc: "M. Lemaire, ouvrier renvoyé pour faute grave, va revenir cinq fois devant vous. Chaque verdict influence sa trajectoire.",
    chapters: [
      {
        id: "lemaire-1",
        actNum: 1,
        title: "Acte I — Le licenciement",
        category: "travail",
        context: "M. Lemaire est licencié après 14 ans pour avoir critiqué la direction sur Facebook. 12 likes, profil semi-public.",
        prosecutionSpeech: "La loyauté contractuelle interdit cette mise en pâture publique. Cass. soc. a admis le licenciement pour faute grave en pareil cas. L'ancienneté n'efface pas la rupture du lien de confiance.",
        defenseSpeech: "Un profil avec 47 amis n'est pas un public. La liberté d'expression du salarié protège cette critique mesurée. Quatorze ans d'exemplarité méritent au minimum une procédure proportionnée.",
        truth: "innocent",
        truthClarity: 4, prosecutionQuality: 2, defenseQuality: 4, difficulty: 3,
      },
      {
        id: "lemaire-2",
        actNum: 2,
        title: "Acte II — La nouvelle entreprise",
        category: "civil",
        context: "Six mois après son licenciement, M. Lemaire crée son entreprise. Son ancien employeur l'attaque pour concurrence déloyale.",
        prosecutionSpeech: "M. Lemaire a emporté un fichier client en quittant l'entreprise. Plusieurs anciens clients se sont retournés vers lui. La concurrence déloyale est caractérisée.",
        defenseSpeech: "Aucune clause de non-concurrence n'avait été négociée à l'embauche. Mon client utilise sa propre expertise, son réseau personnel. Les clients ont fait un choix libre.",
        truth: "innocent",
        truthClarity: 3, prosecutionQuality: 3, defenseQuality: 3, difficulty: 4,
      },
      {
        id: "lemaire-3",
        actNum: 3,
        title: "Acte III — La fraude financière",
        category: "penal",
        context: "M. Lemaire est accusé d'avoir surfacturé un client public de 18 000 €. Le préfet poursuit. Mais Lemaire produit un devis signé par les deux parties.",
        prosecutionSpeech: "Le devis a été produit après la facturation. Deux témoins affirment que le contrat oral mentionnait 12 000 €. La signature postérieure est une régularisation suspecte.",
        defenseSpeech: "Le devis est daté, signé. Deux 'témoins' anonymes ne valent pas une signature. Mon client a respecté la procédure. Doute raisonnable indiscutable.",
        truth: "guilty",
        truthClarity: 2, prosecutionQuality: 4, defenseQuality: 4, difficulty: 5,
      },
      {
        id: "lemaire-4",
        actNum: 4,
        title: "Acte IV — Le retour devant vous",
        category: "famille",
        context: "Trois ans plus tard. M. Lemaire en plein divorce. Sa femme demande la garde exclusive de leurs deux enfants en invoquant son passé judiciaire.",
        prosecutionSpeech: "Le passé pénal de M. Lemaire (condamnation pour fraude en 2027) montre un profil instable. La garde exclusive protégerait les enfants.",
        defenseSpeech: "La condamnation a été purgée. Mon client paie ses pensions, voit ses enfants régulièrement. Ils l'aiment. Une garde alternée préserve leur double parentalité.",
        truth: "innocent",
        truthClarity: 4, prosecutionQuality: 2, defenseQuality: 4, difficulty: 4,
      },
      {
        id: "lemaire-5",
        actNum: 5,
        title: "Acte V — Le testament",
        category: "civil",
        context: "M. Lemaire, malade, lègue tout à une amie d'enfance retrouvée plutôt qu'à ses enfants. Ces derniers contestent.",
        prosecutionSpeech: "L'amie d'enfance est apparue dans la vie de M. Lemaire 3 mois avant son décès. C'est typique d'une captation. Réserve héréditaire des enfants viole le testament.",
        defenseSpeech: "M. Lemaire a la liberté testamentaire dans la limite de la quotité disponible. La réserve des enfants est respectée — l'amie n'a que la part libre. Volonté à honorer.",
        truth: "guilty",
        truthClarity: 3, prosecutionQuality: 4, defenseQuality: 3, difficulty: 5,
      },
    ],
  },
];

export function getSagaProgress(sagaId) {
  return Storage.getKey(`saga_${sagaId}`, { progress: 0, verdicts: [] });
}

export function recordSagaVerdict(sagaId, chapterIdx, verdict) {
  const data = getSagaProgress(sagaId);
  data.progress = Math.max(data.progress, chapterIdx + 1);
  data.verdicts[chapterIdx] = verdict;
  Storage.setKey(`saga_${sagaId}`, data);
}

export function getNextSagaChapter(sagaId) {
  const saga = SAGAS.find(s => s.id === sagaId);
  if (!saga) return null;
  const data = getSagaProgress(sagaId);
  if (data.progress >= saga.chapters.length) return null;
  return { saga, chapter: saga.chapters[data.progress], chapterIdx: data.progress };
}
