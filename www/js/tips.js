// Rotating tips — short conseil shown on dashboard.

export const TIPS = [
  { fr: "💡 Tap-and-hold sur un mot juridique dans une plaidoirie pour voir sa définition.", en: "💡 Tap-and-hold a legal term in a pleading to see its definition." },
  { fr: "💡 Argumentez vos verdicts (≥ 80 caractères) pour créer des précédents personnels.", en: "💡 Argue your verdicts (≥80 chars) to create personal precedents." },
  { fr: "💡 Le mode Expert offre les plaidoiries les plus complètes — testez-le dans Réglages.", en: "💡 Expert mode offers the deepest pleadings — try it in Settings." },
  { fr: "💡 La streak vous donne un bonus XP qui grandit chaque jour (jusqu'à +50 XP).", en: "💡 Your streak grants growing XP bonus (up to +50 XP)." },
  { fr: "💡 Vous pouvez consulter les 12 jurés avant de voter pour vous faire un avis.", en: "💡 Consult the 12 jurors before voting to inform your view." },
  { fr: "💡 Le défi de la semaine donne ×2 XP sur les verdicts de sa catégorie.", en: "💡 The weekly challenge grants ×2 XP on its category." },
  { fr: "💡 Les audiences libres permettent de jouer à volonté entre les cas du jour.", en: "💡 Free hearings let you play unlimited cases between dailies." },
  { fr: "💡 Activez les notifications pour recevoir un rappel quotidien à l'heure choisie.", en: "💡 Turn on notifications for a daily reminder at your chosen time." },
  { fr: "💡 Le mode Néophyte adapte le langage : zéro jargon, juste des récits.", en: "💡 Beginner mode strips legal jargon for plain storytelling." },
  { fr: "💡 Cliquez sur une entrée du codex pour demander à l'IA de l'expliquer.", en: "💡 Click a codex entry to ask the AI for an explanation." },
  { fr: "💡 Le partage en émojis ne révèle pas le verdict — sans spoiler.", en: "💡 Emoji share doesn't reveal the verdict — no spoilers." },
  { fr: "💡 Examinez TOUTES les pièces avant de voter pour activer un succès caché.", en: "💡 Examine ALL evidence before voting to unlock a hidden achievement." },
  { fr: "💡 Le palier de carrière 'Magistrat à la Cassation' débloque tous les modes.", en: "💡 The 'Supreme Magistrate' career tier unlocks all modes." },
  { fr: "💡 Devine la peine est un mini-jeu accessible à 100 % aux non-juristes.", en: "💡 'Guess the sentence' is a mini-game open to non-lawyers." },
  { fr: "💡 Vos données restent chez vous — aucune télémétrie, aucun compte requis.", en: "💡 Your data stays on your device — no telemetry, no account." },
];

export function tipOfTheSession(lang = "fr") {
  const t = TIPS[Math.floor(Math.random() * TIPS.length)];
  return t[lang] || t.fr;
}
