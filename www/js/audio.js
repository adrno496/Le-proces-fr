// Sound effects for the courtroom.
// One-shot gavel + ambient courtroom whispers loop.

let _hammer = null;
let _whispers = null;
let _whispersFadeTimer = null;

function loadHammer() {
  if (_hammer) return _hammer;
  if (typeof Audio === "undefined") return null;
  try {
    _hammer = new Audio("sounds/marteau.mp3");
    _hammer.preload = "auto";
    _hammer.volume = 0.85;
  } catch { _hammer = null; }
  return _hammer;
}

function loadWhispers() {
  if (_whispers) return _whispers;
  if (typeof Audio === "undefined") return null;
  try {
    _whispers = new Audio("sounds/whispers.mp3");
    _whispers.preload = "auto";
    _whispers.loop = true;
    _whispers.volume = 0; // start silent → fade in
  } catch { _whispers = null; }
  return _whispers;
}

// ===== Gavel =====
export function playHammer() {
  const a = loadHammer();
  if (!a) return Promise.resolve();
  try {
    a.currentTime = 0;
    return a.play().catch(() => {});
  } catch {
    return Promise.resolve();
  }
}

// ===== Courtroom whispers (ambient loop) =====
const WHISPER_TARGET_VOLUME = 0.25;

export function startWhispers({ targetVolume = WHISPER_TARGET_VOLUME, fadeMs = 1500 } = {}) {
  const a = loadWhispers();
  if (!a) return;
  if (_whispersFadeTimer) { clearInterval(_whispersFadeTimer); _whispersFadeTimer = null; }
  try {
    a.currentTime = 0;
    a.volume = 0;
    a.play().catch(() => {});
  } catch { return; }
  // Fade in
  const steps = 20;
  const stepMs = fadeMs / steps;
  let i = 0;
  _whispersFadeTimer = setInterval(() => {
    i++;
    a.volume = Math.min(targetVolume, (i / steps) * targetVolume);
    if (i >= steps) { clearInterval(_whispersFadeTimer); _whispersFadeTimer = null; }
  }, stepMs);
}

export function stopWhispers({ fadeMs = 800 } = {}) {
  if (!_whispers) return;
  if (_whispersFadeTimer) { clearInterval(_whispersFadeTimer); _whispersFadeTimer = null; }
  const start = _whispers.volume;
  const steps = 16;
  const stepMs = fadeMs / steps;
  let i = 0;
  _whispersFadeTimer = setInterval(() => {
    i++;
    if (!_whispers) { clearInterval(_whispersFadeTimer); _whispersFadeTimer = null; return; }
    _whispers.volume = Math.max(0, start * (1 - i / steps));
    if (i >= steps) {
      try { _whispers.pause(); _whispers.currentTime = 0; } catch {}
      clearInterval(_whispersFadeTimer);
      _whispersFadeTimer = null;
    }
  }, stepMs);
}

// Preload at first user gesture so playback works immediately when needed.
export function primeAudio() {
  const h = loadHammer();
  if (h) { try { h.load(); } catch {} }
  const w = loadWhispers();
  if (w) { try { w.load(); } catch {} }
}
