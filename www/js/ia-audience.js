// AI-driven adaptive audience.
// Periodically injects "rebondissements" (plot twists) during witness Q&A.
// Requires an API key configured (otherwise no-op).

import { Storage } from "./storage.js";
import { callAI } from "./ai-client.js";
import { getLang } from "./i18n.js";

// Probability tuning
const TWIST_BASE_PROB = 0.18;     // 18% per witness question after the first
const TWIST_MIN_QUESTIONS = 2;    // No twist before 2 questions asked

const TWIST_TYPES = ["evidence", "witness_retraction", "surprise_witness", "revelation", "contradiction"];

function buildTwistPrompt(lang) {
  if (lang === "en") {
    return `You are a courtroom drama writer adding a plot twist to an ongoing trial.

You receive : (1) the case context, (2) the questions already asked to witnesses.

Generate a SINGLE plot twist that fits and surprises. The twist must :
- Be plausible given the case
- Reveal something new (a hidden piece of evidence, a witness retraction, a surprise witness, an unexpected fact, a contradiction)
- Be 80-120 words
- Not break the realism of the case
- Either lean toward guilty (weight +1 to +2) or innocent (weight -1 to -2) or be neutral (0)

REPLY ONLY IN VALID JSON (no markdown):
{
  "type": "evidence|witness_retraction|surprise_witness|revelation|contradiction",
  "title": "Short headline (5-10 words)",
  "narrative": "What happens, in narrative tone (80-120 words). Set the scene.",
  "shift": -2 to +2,
  "evidenceLabel": "If type=evidence : short label of the new evidence (else empty string)"
}`;
  }
  return `Tu es scénariste de drame judiciaire et tu ajoutes un rebondissement à un procès en cours.

Tu reçois : (1) le contexte du cas, (2) les questions déjà posées aux témoins.

Génère UN SEUL rebondissement qui surprend et s'adapte. Il doit :
- Être plausible dans le contexte
- Révéler quelque chose de nouveau (une pièce cachée, une rétractation de témoin, un témoin-surprise, un fait inattendu, une contradiction)
- Faire 80-120 mots
- Ne pas casser le réalisme
- Soit pencher vers la culpabilité (poids +1 à +2), soit vers l'innocence (poids -1 à -2), soit être neutre (0)

RÉPONDS UNIQUEMENT EN JSON VALIDE (pas de markdown) :
{
  "type": "evidence|witness_retraction|surprise_witness|revelation|contradiction",
  "title": "Titre court (5-10 mots)",
  "narrative": "Ce qui se passe, registre récit (80-120 mots). Plante la scène.",
  "shift": -2 à +2,
  "evidenceLabel": "Si type=evidence : label court de la nouvelle pièce (sinon chaîne vide)"
}`;
}

function parseTwistJSON(content) {
  let raw = (content || "").trim();
  raw = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start !== -1 && end !== -1) raw = raw.slice(start, end + 1);
  try {
    const parsed = JSON.parse(raw);
    if (!parsed.title || !parsed.narrative) return null;
    return {
      type: TWIST_TYPES.includes(parsed.type) ? parsed.type : "revelation",
      title: String(parsed.title).slice(0, 100),
      narrative: String(parsed.narrative).slice(0, 800),
      shift: Math.max(-2, Math.min(2, Number(parsed.shift) || 0)),
      evidenceLabel: String(parsed.evidenceLabel || "").slice(0, 80),
    };
  } catch {
    return null;
  }
}

// Decides whether to attempt a twist after the user has asked a witness question.
// Probability rises with the number of questions asked (more engagement → more drama).
export function shouldAttemptTwist({ questionsAsked, twistsSoFar }) {
  if (!Storage.getSettings().apiKey) return false;
  if (questionsAsked < TWIST_MIN_QUESTIONS) return false;
  if (twistsSoFar >= 2) return false; // max 2 twists per case
  const prob = TWIST_BASE_PROB + (questionsAsked - TWIST_MIN_QUESTIONS) * 0.04;
  return Math.random() < prob;
}

// Generates a plot twist tailored to the case + Q&A history.
export async function generateTwist(caseData, qaHistory) {
  const lang = getLang();
  const systemPrompt = buildTwistPrompt(lang);
  const qaText = qaHistory.length
    ? qaHistory.map((qa, i) => `Q${i + 1}: ${qa.question}\nR${i + 1}: ${qa.answer}`).join("\n\n")
    : (lang === "en" ? "(no questions yet)" : "(aucune question)");
  const userMsg = lang === "en"
    ? `Case: ${caseData.title}\nContext: ${caseData.context}\nProsecution: ${caseData.prosecutionSpeech.slice(0, 300)}\nDefense: ${caseData.defenseSpeech.slice(0, 300)}\nQuestions asked so far:\n${qaText}\nGenerate a plot twist now.`
    : `Cas : ${caseData.title}\nContexte : ${caseData.context}\nAccusation : ${caseData.prosecutionSpeech.slice(0, 300)}\nDéfense : ${caseData.defenseSpeech.slice(0, 300)}\nQuestions déjà posées :\n${qaText}\nGénère un rebondissement maintenant.`;

  try {
    const { content } = await callAI([{ role: "user", content: userMsg }], { systemPrompt, maxTokens: 400 });
    return parseTwistJSON(content);
  } catch (e) {
    console.warn("[ia-audience] twist failed:", e.message);
    return null;
  }
}

// Apply a twist to the live case data — adds evidence, modifies witness availability, etc.
// Returns the updated caseData (mutated in place).
export function applyTwist(caseData, twist) {
  caseData._twists = caseData._twists || [];
  caseData._twists.push(twist);

  if (twist.type === "evidence" && twist.evidenceLabel) {
    caseData.evidence = caseData.evidence || [];
    caseData.evidence.push({
      id: `twist-ev-${caseData._twists.length}`,
      label: twist.evidenceLabel,
      body: twist.narrative,
      slant: twist.shift > 0 ? "guilty" : twist.shift < 0 ? "innocent" : "neutral",
      weight: twist.shift,
      examined: false,
      isTwist: true,
    });
  }
  // For other types, the narrative is just dramatized; no structural change to evidence/witnesses required for MVP
  return caseData;
}

// Convenience : may attempt and return either null (skipped) or a twist applied to the case.
export async function maybeTwist(caseData, qaHistory) {
  if (!shouldAttemptTwist({ questionsAsked: qaHistory.length, twistsSoFar: (caseData._twists || []).length })) return null;
  const twist = await generateTwist(caseData, qaHistory);
  if (!twist) return null;
  applyTwist(caseData, twist);
  return twist;
}
