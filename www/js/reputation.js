// Judge reputation: derived from verdict patterns, surfaces a "judicial profile".

import { Storage } from "./storage.js";

// Returns reputation snapshot from current profile data.
export function computeReputation(profile) {
  const total = profile.totalVerdicts || 0;
  if (total < 5) return { label: "Juge sans réputation", icon: "❓", desc: "Pas encore assez de verdicts pour dégager une tendance.", traits: [] };

  const guiltyRate = (profile.guiltyCount || 0) / total;
  const argRate = (profile.argumentsWritten || 0) / total;
  const qRate = (profile.questionsAsked || 0) / total;
  const avgSeverity = profile.severitySum ? profile.severitySum / total : 3;

  const traits = [];
  if (guiltyRate >= 0.65) traits.push({ id: "severe", label: "Sévère", desc: `${Math.round(guiltyRate * 100)} % de culpabilité` });
  else if (guiltyRate <= 0.35) traits.push({ id: "clement", label: "Clément", desc: `${Math.round((1 - guiltyRate) * 100)} % de relaxe` });
  else traits.push({ id: "equilibre", label: "Équilibré", desc: "Verdicts partagés" });

  if (argRate >= 0.5) traits.push({ id: "motive", label: "Motivé", desc: "Argumente un cas sur deux ou plus" });
  if (qRate >= 1.0) traits.push({ id: "investigateur", label: "Investigateur", desc: "Interroge en moyenne 1+ témoin par cas" });
  if (avgSeverity >= 4) traits.push({ id: "rigoureux", label: "Rigoureux", desc: "Sanctions hautes" });
  if (avgSeverity <= 2) traits.push({ id: "indulgent", label: "Indulgent", desc: "Sanctions basses" });

  // Master label = combinaison
  let label, icon;
  if (traits.find(t => t.id === "severe") && traits.find(t => t.id === "motive")) { label = "Le Procureur de fer"; icon = "🛡"; }
  else if (traits.find(t => t.id === "clement") && traits.find(t => t.id === "motive")) { label = "L'Avocat de cœur"; icon = "🕊"; }
  else if (traits.find(t => t.id === "equilibre") && traits.find(t => t.id === "investigateur")) { label = "Le Magistrat curieux"; icon = "🔎"; }
  else if (traits.find(t => t.id === "rigoureux")) { label = "Le Juge inflexible"; icon = "⚒"; }
  else if (traits.find(t => t.id === "indulgent")) { label = "Le Juge bienveillant"; icon = "🤲"; }
  else { label = "Le Juge attentif"; icon = "⚖"; }

  return { label, icon, desc: `Profil dérivé de ${total} verdicts.`, traits, stats: { guiltyRate, argRate, qRate, avgSeverity } };
}

// Used by case-engine to bias case generation toward the player's reputation
// (e.g. defendants more "audacious" before a clement judge).
export function reputationFlavor(profile) {
  const r = computeReputation(profile);
  if (!r.traits.length) return "";
  const trait = r.traits[0];
  switch (trait.id) {
    case "severe":     return "Le prévenu connaît votre réputation de sévérité ; il prépare une défense argumentée.";
    case "clement":    return "L'accusation tente d'anticiper votre tendance à la clémence en surchargeant les charges.";
    case "rigoureux":  return "Le greffe a préparé un dossier complet — vous appréciez la rigueur procédurale.";
    case "indulgent":  return "Une note du greffier rappelle votre sensibilité aux circonstances atténuantes.";
    case "investigateur": return "Plusieurs témoins ont été convoqués en prévision de vos questions.";
    case "motive":     return "Votre habitude de motiver vos décisions a généré une attente de motivation détaillée.";
    default:           return "";
  }
}
