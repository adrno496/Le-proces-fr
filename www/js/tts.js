// Text-to-Speech wrapper for plaidoiries — uses Web Speech API natif (no backend).

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

export function bestFrenchVoices() {
  const fr = frenchVoices();
  if (!fr.length) return { prosecution: null, defense: null };
  // Prefer male/female contrast — heuristic via name
  const female = fr.find(v => /female|woman|amélie|julie|sara|virginie/i.test(v.name)) || fr[0];
  const male = fr.find(v => /male|man|thomas|nicolas|paul/i.test(v.name) && v !== female) || fr[fr.length - 1] || fr[0];
  return { prosecution: female, defense: male };
}

export function speak(text, { voice, rate = 0.95, pitch = 1.0, onEnd } = {}) {
  if (!isSupported()) return null;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "fr-FR";
  u.rate = rate;
  u.pitch = pitch;
  // Volume from settings
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
}

export function pauseResume() {
  if (!isSupported()) return;
  if (window.speechSynthesis.paused) window.speechSynthesis.resume();
  else window.speechSynthesis.pause();
}

// "Read sequence": prosecution then defense, with distinct voices.
export function readPlaidoiries(prose, defense, callbacks = {}) {
  if (!isSupported()) return;
  const { prosecution, defense: defVoice } = bestFrenchVoices();
  stop();
  callbacks.onStart && callbacks.onStart("prosecution");
  speak(prose, {
    voice: prosecution,
    pitch: 1.05,
    onEnd: () => {
      callbacks.onStart && callbacks.onStart("defense");
      speak(defense, {
        voice: defVoice,
        pitch: 0.95,
        onEnd: () => callbacks.onComplete && callbacks.onComplete(),
      });
    },
  });
}
