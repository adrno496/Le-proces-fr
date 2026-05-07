// Sound effects for the courtroom.
// One-shot playback, gracefully no-op when sound files are unavailable.

let _hammer = null;

function load() {
  if (_hammer) return _hammer;
  if (typeof Audio === "undefined") return null;
  try {
    _hammer = new Audio("sounds/marteau.mp3");
    _hammer.preload = "auto";
    _hammer.volume = 0.85;
  } catch { _hammer = null; }
  return _hammer;
}

// Play the gavel strike. Resolves when the file ends (or immediately on error).
export function playHammer() {
  const a = load();
  if (!a) return Promise.resolve();
  try {
    // Reset to start in case it was already played
    a.currentTime = 0;
    return a.play().catch(() => {}); // user-gesture requirement may reject silently
  } catch {
    return Promise.resolve();
  }
}

// Preload at first user gesture so playback works immediately when the user submits.
export function primeAudio() {
  const a = load();
  if (a) {
    try { a.load(); } catch {}
  }
}
