// Verdict Challenge — share a case via URL.
// Encodes a snapshot of the case in `?challenge=<base64-json>`.
// Receiving user sees the same case + opportunity to compare verdicts.

function safeEncode(obj) {
  try {
    const json = JSON.stringify(obj);
    return btoa(unescape(encodeURIComponent(json)));
  } catch { return ""; }
}

function safeDecode(str) {
  try {
    const json = decodeURIComponent(escape(atob(str)));
    return JSON.parse(json);
  } catch { return null; }
}

export function buildChallengeLink(caseData, verdict) {
  if (typeof window === "undefined") return "";
  const minimalCase = {
    title: caseData.title,
    context: caseData.context,
    prosecutionSpeech: caseData.prosecutionSpeech,
    defenseSpeech: caseData.defenseSpeech,
    category: caseData.category,
    difficulty: caseData.difficulty,
    truth: caseData.truth,
    truthClarity: caseData.truthClarity,
    prosecutionQuality: caseData.prosecutionQuality,
    defenseQuality: caseData.defenseQuality,
    challengerVerdict: verdict.verdict,
    challengerSeverity: verdict.severity,
  };
  const enc = safeEncode(minimalCase);
  const url = new URL(window.location.href);
  url.search = `?challenge=${enc}`;
  url.hash = "";
  return url.toString();
}

// Read the URL on load. Returns the decoded challenge case or null.
export function readChallengeFromURL() {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const c = params.get("challenge");
  if (!c) return null;
  const data = safeDecode(c);
  return data;
}

export function clearChallengeFromURL() {
  if (typeof window === "undefined" || !window.history) return;
  const url = new URL(window.location.href);
  url.searchParams.delete("challenge");
  window.history.replaceState({}, "", url.toString());
}
