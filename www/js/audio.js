// Sound effects for the courtroom.
// One-shot gavel + ambient courtroom whispers loop. Volumes pulled from Storage settings.

let _hammer = null;
let _whispers = null;
let _whispersFadeTimer = null;

function getVolumes() {
  try {
    const { Storage } = require("./storage.js"); // CommonJS-ish guard
    return Storage.getSettings().volume || { ambient: 0.25, gavel: 0.85, tts: 1.0, master: 1.0 };
  } catch {
    return { ambient: 0.25, gavel: 0.85, tts: 1.0, master: 1.0 };
  }
}

// ESM dynamic import wrapper (avoids circular at parse time)
async function getVolumesAsync() {
  const { Storage } = await import("./storage.js");
  return Storage.getSettings().volume || { ambient: 0.25, gavel: 0.85, tts: 1.0, master: 1.0 };
}

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

async function applyVolumes() {
  const v = await getVolumesAsync();
  const master = (v.master ?? 1);
  if (_hammer) _hammer.volume = (v.gavel ?? 0.85) * master;
  if (_whispers) _whispers.volume = (_whispers.volume > 0 ? Math.min(_whispers.volume, (v.ambient ?? 0.25) * master) : _whispers.volume);
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
export async function playHammer() {
  const a = loadHammer();
  if (!a) return;
  const v = await getVolumesAsync();
  const master = (v.master ?? 1);
  a.volume = Math.max(0, Math.min(1, (v.gavel ?? 0.85) * master));
  if (a.volume === 0) return;
  try {
    a.currentTime = 0;
    return a.play().catch(() => {});
  } catch {}
}

// ===== Courtroom whispers (ambient loop) =====
export async function startWhispers({ fadeMs = 1500 } = {}) {
  const a = loadWhispers();
  if (!a) return;
  const v = await getVolumesAsync();
  const targetVolume = Math.max(0, Math.min(1, (v.ambient ?? 0.25) * (v.master ?? 1)));
  if (targetVolume === 0) return;
  if (_whispersFadeTimer) { clearInterval(_whispersFadeTimer); _whispersFadeTimer = null; }
  try {
    a.currentTime = 0;
    a.volume = 0;
    a.play().catch(() => {});
  } catch { return; }
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
