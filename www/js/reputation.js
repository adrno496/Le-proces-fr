// Judge reputation: derived from verdict patterns. Labels are translated.

import { t } from "./i18n.js";

export function computeReputation(profile) {
  const total = profile.totalVerdicts || 0;
  if (total < 5) return { label: t("rep.none"), icon: "❓", desc: t("rep.none.desc"), traits: [] };

  const guiltyRate = (profile.guiltyCount || 0) / total;
  const argRate = (profile.argumentsWritten || 0) / total;
  const qRate = (profile.questionsAsked || 0) / total;
  const avgSeverity = profile.severitySum ? profile.severitySum / total : 3;

  const traits = [];
  if (guiltyRate >= 0.65) traits.push({ id: "severe", label: t("rep.trait.severe"), desc: `${Math.round(guiltyRate * 100)}%` });
  else if (guiltyRate <= 0.35) traits.push({ id: "clement", label: t("rep.trait.lenient"), desc: `${Math.round((1 - guiltyRate) * 100)}%` });
  else traits.push({ id: "equilibre", label: t("rep.trait.balanced"), desc: "" });

  if (argRate >= 0.5) traits.push({ id: "motive", label: t("rep.trait.motivated"), desc: "" });
  if (qRate >= 1.0) traits.push({ id: "investigateur", label: t("rep.trait.investigator"), desc: "" });
  if (avgSeverity >= 4) traits.push({ id: "rigoureux", label: t("rep.trait.rigorous"), desc: "" });
  if (avgSeverity <= 2) traits.push({ id: "indulgent", label: t("rep.trait.indulgent"), desc: "" });

  let label, icon;
  if (traits.find(x => x.id === "severe") && traits.find(x => x.id === "motive")) { label = t("rep.iron"); icon = "🛡"; }
  else if (traits.find(x => x.id === "clement") && traits.find(x => x.id === "motive")) { label = t("rep.heart"); icon = "🕊"; }
  else if (traits.find(x => x.id === "equilibre") && traits.find(x => x.id === "investigateur")) { label = t("rep.curious"); icon = "🔎"; }
  else if (traits.find(x => x.id === "rigoureux")) { label = t("rep.inflexible"); icon = "⚒"; }
  else if (traits.find(x => x.id === "indulgent")) { label = t("rep.benevolent"); icon = "🤲"; }
  else { label = t("rep.attentive"); icon = "⚖"; }

  return { label, icon, desc: "", traits, stats: { guiltyRate, argRate, qRate, avgSeverity } };
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
