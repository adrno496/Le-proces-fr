// App bootstrap, panel routing, shared helpers (DOM, toast).

import { Storage } from "./storage.js";
import { renderTribunal } from "./ui-tribunal.js";
import { renderSettings } from "./ui-settings.js";
import { renderProfile } from "./ui-profile.js";
import { renderHistory } from "./ui-history.js";
import { renderCosts } from "./ui-costs.js";
import { applyTheme } from "./themes.js";
import { t, setLang, getLang } from "./i18n.js";
import { shouldShowOnboarding, showOnboarding } from "./onboarding.js";
import { showSummaryIfDue } from "./weekly-summary.js";

const PANELS = {
  tribunal: { id: "tribunal", labelKey: "nav.tribunal", icon: "⚖", render: renderTribunal },
  history:  { id: "history",  labelKey: "nav.archives", icon: "📜", render: renderHistory },
  profile:  { id: "profile",  labelKey: "nav.profile",  icon: "👤", render: renderProfile },
  costs:    { id: "costs",    labelKey: "nav.costs",    icon: "💰", render: renderCosts },
  settings: { id: "settings", labelKey: "nav.settings", icon: "⚙", render: renderSettings },
};

let currentPanel = "tribunal";

export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k === "html") node.innerHTML = v;
    else if (k === "style") Object.assign(node.style, v);
    else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2).toLowerCase(), v);
    else if (v === true) node.setAttribute(k, "");
    else if (v != null && v !== false) node.setAttribute(k, v);
  }
  const list = Array.isArray(children) ? children : [children];
  for (const c of list) {
    if (c == null || c === false) continue;
    if (typeof c === "string" || typeof c === "number") node.appendChild(document.createTextNode(String(c)));
    else node.appendChild(c);
  }
  return node;
}

export function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

export function toast(message, kind = "info", duration = 3000) {
  const root = document.getElementById("toast-root") || document.body;
  const t = el("div", { class: `toast toast-${kind}` }, [message]);
  root.appendChild(t);
  requestAnimationFrame(() => t.classList.add("toast-show"));
  setTimeout(() => {
    t.classList.remove("toast-show");
    setTimeout(() => t.remove(), 300);
  }, duration);
}

export function navigate(panel, opts = {}) {
  if (!PANELS[panel]) panel = "tribunal";
  // Reset transient tribunal-mode state when arriving fresh (unless explicitly preserved)
  if (panel === "tribunal" && !opts.preserveMode) {
    if (typeof window !== "undefined" && !opts.keepFree) window._leprocesFreeCase = null;
    if (typeof window !== "undefined" && !opts.keepHistoric) window._leprocesHistoricCase = null;
  }
  currentPanel = panel;
  const root = document.getElementById("panel-root");
  if (!root) return;
  clear(root);
  PANELS[panel].render(root);
  document.querySelectorAll(".bottom-nav .nav-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.panel === panel);
  });
  window.scrollTo(0, 0);
}

export function getCurrentPanel() {
  return currentPanel;
}

export function renderBottomNav() {
  const nav = document.getElementById("bottom-nav");
  if (!nav) return;
  clear(nav);
  for (const p of Object.values(PANELS)) {
    nav.appendChild(
      el("button", { class: "nav-btn", "data-panel": p.id, onclick: () => navigate(p.id) }, [
        el("span", { class: "nav-icon" }, [p.icon]),
        el("span", { class: "nav-label" }, [t(p.labelKey)]),
      ]),
    );
  }
}

// Floating "Hard refresh" button — visible on every page (top-right).
// Clears HTTP/PWA caches + Service Worker + reloads with a cache-buster.
// Does NOT touch localStorage / IndexedDB (user's game data is preserved).
function renderHardRefreshButton() {
  let btn = document.getElementById("hard-refresh-btn");
  if (btn) return;
  btn = el("button", {
    id: "hard-refresh-btn",
    class: "hard-refresh-btn",
    title: t("refresh.title"),
    "aria-label": t("refresh.title"),
    onclick: async () => {
      if (btn.disabled) return;
      btn.disabled = true;
      btn.classList.add("spinning");
      toast(t("refresh.toast") + " " + t("refresh.note"), "info", 2500);
      try {
        // Clear Cache Storage API (PWA / Service Worker caches)
        if ("caches" in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map(k => caches.delete(k)));
        }
        // Unregister all Service Workers
        if ("serviceWorker" in navigator) {
          const regs = await navigator.serviceWorker.getRegistrations();
          await Promise.all(regs.map(r => r.unregister()));
        }
      } catch (e) { console.warn("[hard-refresh] partial:", e); }
      toast(t("refresh.done"), "success", 1500);
      setTimeout(() => {
        // Bust HTTP cache by appending a versioning query param
        const url = new URL(window.location.href);
        url.searchParams.set("_v", String(Date.now()));
        window.location.replace(url.toString());
      }, 700);
    },
  }, ["🔄"]);
  document.body.appendChild(btn);
}

export function refreshHardRefreshButton() {
  const btn = document.getElementById("hard-refresh-btn");
  if (btn) {
    btn.title = t("refresh.title");
    btn.setAttribute("aria-label", t("refresh.title"));
  }
}

async function bootstrap() {
  await Storage.init();
  Storage.resetSessionCost();
  // Initialize language (auto-detect from browser if not set)
  setLang(Storage.getSettings().language || getLang());
  renderBottomNav();
  renderHardRefreshButton();
  const settings = Storage.getSettings();
  applyTheme(settings.theme || "dark");
  navigate("tribunal");
  if (shouldShowOnboarding()) {
    setTimeout(() => showOnboarding({ onComplete: () => navigate("tribunal") }), 400);
  } else {
    setTimeout(() => showSummaryIfDue().catch(() => {}), 800);
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", () => {
    bootstrap().catch(err => {
      console.error(err);
      const root = document.getElementById("panel-root");
      if (root) root.innerHTML = `<div class="error-screen"><h2>Erreur de démarrage</h2><pre>${err.message}</pre></div>`;
    });
  });
  // expose for debugging
  window.LeProces = { Storage, navigate, toast };
}
