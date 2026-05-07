// Interactive onboarding for first-time users.
// Three-step modal + level selection. Sets settings.onboarded once dismissed.

import { Storage } from "./storage.js";
import { t } from "./i18n.js";

export function shouldShowOnboarding() {
  return !Storage.getSettings().onboarded;
}

export function markOnboarded() {
  Storage.saveSettings({ onboarded: true });
}

export function showOnboarding({ onComplete } = {}) {
  if (typeof document === "undefined") return;
  const overlay = document.createElement("div");
  overlay.className = "onb-overlay";

  let step = 0;
  const steps = [
    { key: "1", emoji: "⚖", chosenMode: null },
    { key: "2", emoji: "📖", chosenMode: null },
    { key: "3", emoji: "🏛", chosenMode: null },
    { key: "4", emoji: "🎯", needsMode: true },
  ];
  let chosenMode = "standard";

  const card = document.createElement("div");
  card.className = "onb-card";
  overlay.appendChild(card);

  function render() {
    card.innerHTML = "";
    const s = steps[step];

    const dots = document.createElement("div");
    dots.className = "onb-dots";
    steps.forEach((_, i) => {
      const d = document.createElement("span");
      d.className = "onb-dot" + (i === step ? " active" : i < step ? " done" : "");
      dots.appendChild(d);
    });
    card.appendChild(dots);

    const emoji = document.createElement("div");
    emoji.className = "onb-emoji";
    emoji.textContent = s.emoji;
    card.appendChild(emoji);

    const title = document.createElement("h2");
    title.className = "onb-title";
    title.textContent = t(`onb.step.${s.key}.title`);
    card.appendChild(title);

    const body = document.createElement("p");
    body.className = "onb-body";
    body.textContent = t(`onb.step.${s.key}.body`);
    card.appendChild(body);

    if (s.needsMode) {
      const grid = document.createElement("div");
      grid.className = "onb-mode-grid";
      ["novice", "standard", "expert"].forEach(m => {
        const btn = document.createElement("button");
        btn.className = "onb-mode-btn" + (chosenMode === m ? " selected" : "");
        const h = document.createElement("div");
        h.className = "onb-mode-name";
        h.textContent = t(`mode.${m}`);
        const d = document.createElement("div");
        d.className = "onb-mode-desc";
        d.textContent = t(`mode.${m}.desc`);
        btn.append(h, d);
        btn.onclick = () => { chosenMode = m; render(); };
        grid.appendChild(btn);
      });
      card.appendChild(grid);
    }

    const actions = document.createElement("div");
    actions.className = "onb-actions";
    const skip = document.createElement("button");
    skip.className = "btn-secondary";
    skip.textContent = t("onb.skip");
    skip.onclick = () => finish();
    actions.appendChild(skip);

    const next = document.createElement("button");
    next.className = "btn-primary";
    next.textContent = step < steps.length - 1 ? t("onb.next") : t("onb.start");
    next.onclick = () => {
      if (step < steps.length - 1) { step++; render(); }
      else { finish(); }
    };
    actions.appendChild(next);
    card.appendChild(actions);
  }

  function finish() {
    Storage.saveSettings({ mode: chosenMode, onboarded: true });
    overlay.classList.add("onb-fade-out");
    setTimeout(() => {
      overlay.remove();
      if (onComplete) onComplete();
    }, 220);
  }

  document.body.appendChild(overlay);
  render();
}
