// Accessibility helpers: reduce-motion, high-contrast, vibrations, update banner.

import { Storage } from "./storage.js";

export function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  if (Storage.getSettings().reduceMotion) return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function applyReducedMotion(on) {
  if (typeof document === "undefined") return;
  document.documentElement.toggleAttribute("data-reduce-motion", !!on);
}

export function applyHighContrast(on) {
  if (typeof document === "undefined") return;
  document.documentElement.toggleAttribute("data-high-contrast", !!on);
}

// Haptic feedback wrapper. Silent no-op if unsupported.
// pattern: number (ms) | array of (vibrate, pause, vibrate, ...)
export function vibrate(pattern) {
  if (typeof navigator === "undefined" || !navigator.vibrate) return;
  if (Storage.getSettings().reduceMotion) return; // honor reduce-motion
  try { navigator.vibrate(pattern); } catch {}
}

// Common haptic patterns
export const HAPTIC = {
  click: 8,
  verdict: [40, 30, 40],
  success: [60, 40, 80],
  error: [20, 60, 20, 60, 20],
  milestone: [80, 40, 80, 40, 120],
};

// Update banner — shows when SW reports a new version available.
export function installUpdateBanner({ t, onUpdate }) {
  if (typeof window === "undefined") return;
  window.addEventListener("sw-update-available", (e) => {
    if (document.getElementById("update-banner")) return;
    const banner = document.createElement("div");
    banner.id = "update-banner";
    banner.className = "update-banner";
    banner.innerHTML = `<span>${t("update.available")}</span>`;
    const btn = document.createElement("button");
    btn.className = "btn-primary";
    btn.textContent = t("update.reload");
    btn.onclick = () => {
      if (e.detail?.sw) e.detail.sw.postMessage("SKIP_WAITING");
      window.location.reload();
    };
    banner.appendChild(btn);
    const dismiss = document.createElement("button");
    dismiss.className = "btn-secondary";
    dismiss.textContent = t("update.later");
    dismiss.onclick = () => banner.remove();
    banner.appendChild(dismiss);
    document.body.appendChild(banner);
  });
}
