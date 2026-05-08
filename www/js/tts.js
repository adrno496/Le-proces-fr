// Text-to-Speech — natif Web Speech + OpenAI TTS (premium, voix neuronales).
// Trois niveaux de qualité :
//   - "system"  : voix natives (par défaut)
//   - "premium" : sélection de la meilleure voix native disponible
//   - "openai"  : OpenAI TTS HD (nécessite clé API OpenAI configurée)

import { Storage } from "./storage.js";

let _voicesCache = null;

export function isSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function listVoices() {
  if (!isSupported()) return [];
  if (_voicesCache && _voicesCache.length) return _voicesCache;
  _voicesCache = window.speechSynthesis.getVoices();
  return _voicesCache;
}

export function frenchVoices() {
  return listVoices().filter(v => /^fr/i.test(v.lang));
}

// Score une voix : plus c'est élevé, plus elle est naturelle.
// Les voix neurales/Google/Microsoft Premium scorent haut.
// Les voix "compact" ou "espeak" (robotiques) scorent bas.
function scoreVoice(v) {
  const n = (v.name || "").toLowerCase();
  let s = 0;
  // Fortement positif
  if (/neural|premium|enhanced|natural|wavenet/i.test(n)) s += 100;
  if (/online/i.test(n)) s += 30; // souvent plus haut qualité
  if (/google/i.test(n)) s += 60; // Chrome desktop = très bonnes voix
  if (/microsoft.*neural|cortana/i.test(n)) s += 50;
  if (/apple|siri/i.test(n)) s += 40;
  if (/amélie|julie|sara|virginie|thomas|nicolas|paul|aurélie/i.test(n)) s += 30; // voix françaises connues haute qualité
  // Pénalités
  if (/compact|espeak|festival|robot/i.test(n)) s -= 50;
  if (/eloquence|rocko/i.test(n)) s -= 30;
  // Bonus localVoice (en local, plus stable et privé)
  if (v.localService) s += 10;
  // Bonus si voix par défaut explicitement
  if (v.default) s += 5;
  return s;
}

// Renvoie la meilleure voix française (premier choix : féminine, second : masculine).
export function bestFrenchVoices() {
  const fr = frenchVoices();
  if (!fr.length) return { prosecution: null, defense: null };
  const sorted = [...fr].sort((a, b) => scoreVoice(b) - scoreVoice(a));
  // Tente une diversité H/F sur les 4 meilleures
  const top = sorted.slice(0, Math.min(6, sorted.length));
  const female = top.find(v => /female|woman|amélie|julie|sara|virginie|aurélie|hortense|emma/i.test(v.name)) || top[0];
  const male   = top.find(v => /male|man|thomas|nicolas|paul|jean|antoine/i.test(v.name) && v !== female) || top[1] || top[0];
  return { prosecution: female, defense: male };
}

export function speak(text, { voice, rate = 0.95, pitch = 1.0, onEnd } = {}) {
  if (!isSupported()) return null;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = voice?.lang || "fr-FR";
  u.rate = rate;
  u.pitch = pitch;
  // Volume from settings (master × tts)
  try {
    const settings = JSON.parse(localStorage.getItem("leproces_settings") || "{}");
    const v = settings.volume || {};
    u.volume = Math.max(0, Math.min(1, (v.tts ?? 1) * (v.master ?? 1)));
  } catch { u.volume = 1; }
  if (voice) u.voice = voice;
  if (onEnd) u.onend = onEnd;
  window.speechSynthesis.speak(u);
  return u;
}

export function stop() {
  if (isSupported()) window.speechSynthesis.cancel();
  if (_currentAudio) { try { _currentAudio.pause(); _currentAudio.currentTime = 0; } catch {} _currentAudio = null; }
}

export function pauseResume() {
  if (!isSupported()) return;
  if (window.speechSynthesis.paused) window.speechSynthesis.resume();
  else window.speechSynthesis.pause();
}

// =====================================================================
// OpenAI TTS — voix neuronales premium ($0.015 / 1000 caractères)
// =====================================================================

let _currentAudio = null;

const OPENAI_VOICES_FEMALE = ["nova", "shimmer", "alloy"];
const OPENAI_VOICES_MALE   = ["onyx", "echo", "fable"];

async function speakWithOpenAI(text, voiceName) {
  const settings = Storage.getSettings();
  if (!settings.apiKey || settings.provider !== "openai") {
    throw new Error("OpenAI API key required for premium TTS");
  }
  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${settings.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "tts-1-hd", // tts-1 (rapide, $0.015/1k) ou tts-1-hd (qualité, $0.030/1k)
      input: text.slice(0, 4096),
      voice: voiceName,
      response_format: "mp3",
      speed: 0.95,
    }),
  });
  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(`OpenAI TTS error ${res.status}: ${err.slice(0, 200)}`);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  // Volume from settings
  try {
    const settings2 = JSON.parse(localStorage.getItem("leproces_settings") || "{}");
    const v = settings2.volume || {};
    audio.volume = Math.max(0, Math.min(1, (v.tts ?? 1) * (v.master ?? 1)));
  } catch { audio.volume = 1; }
  _currentAudio = audio;
  await audio.play().catch(() => {});
  return new Promise((resolve) => {
    audio.onended = () => { URL.revokeObjectURL(url); resolve(); };
    audio.onerror = () => { URL.revokeObjectURL(url); resolve(); };
  });
}

// =====================================================================
// API publique : "lis les plaidoiries" — choisit le bon moteur selon settings
// =====================================================================

export async function readPlaidoiries(prose, defense, callbacks = {}) {
  const engine = Storage.getSettings().ttsEngine || "premium";
  stop();

  if (engine === "openai" && Storage.getSettings().provider === "openai") {
    callbacks.onStart && callbacks.onStart("prosecution");
    try {
      await speakWithOpenAI(prose, OPENAI_VOICES_FEMALE[0]);
      callbacks.onStart && callbacks.onStart("defense");
      await speakWithOpenAI(defense, OPENAI_VOICES_MALE[0]);
      callbacks.onComplete && callbacks.onComplete();
    } catch (e) {
      callbacks.onError && callbacks.onError(e);
      // Fallback sur les voix natives
      readWithSystem(prose, defense, callbacks);
    }
    return;
  }
  readWithSystem(prose, defense, callbacks);
}

function readWithSystem(prose, defense, callbacks) {
  if (!isSupported()) {
    callbacks.onError && callbacks.onError(new Error("Speech synthesis not supported"));
    return;
  }
  const { prosecution, defense: defVoice } = bestFrenchVoices();
  callbacks.onStart && callbacks.onStart("prosecution");
  speak(prose, {
    voice: prosecution,
    rate: 0.92,
    pitch: 1.05,
    onEnd: () => {
      callbacks.onStart && callbacks.onStart("defense");
      speak(defense, {
        voice: defVoice,
        rate: 0.92,
        pitch: 0.95,
        onEnd: () => callbacks.onComplete && callbacks.onComplete(),
      });
    },
  });
}
