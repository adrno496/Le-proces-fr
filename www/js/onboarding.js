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
    { key: "1", emoji: "⚖" },
    { key: "2", emoji: "📖" },
    { key: "3", emoji: "🏛", showFeatures: true },
    { key: "4", emoji: "📈" },
    { key: "5", emoji: "🔒" },
    { key: "6", emoji: "🎯", needsMode: true },
  ];
  let chosenMode = "etudiant";

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

    if (s.showFeatures) {
      const features = [
        { icon: "⚖", title: t("onb.feat.daily.title"), body: t("onb.feat.daily.body") },
        { icon: "🎲", title: t("onb.feat.free.title"),  body: t("onb.feat.free.body") },
        { icon: "🎬", title: t("onb.feat.saga.title"),  body: t("onb.feat.saga.body") },
        { icon: "📜", title: t("onb.feat.hist.title"),  body: t("onb.feat.hist.body") },
        { icon: "📚", title: t("onb.feat.codex.title"), body: t("onb.feat.codex.body") },
        { icon: "🎯", title: t("onb.feat.guess.title"), body: t("onb.feat.guess.body") },
      ];
      const grid = document.createElement("div");
      grid.className = "onb-feat-grid";
      features.forEach(f => {
        const item = document.createElement("div");
        item.className = "onb-feat-item";
        const ic = document.createElement("div");
        ic.className = "onb-feat-icon"; ic.textContent = f.icon;
        const tx = document.createElement("div");
        tx.className = "onb-feat-text";
        const tt = document.createElement("div");
        tt.className = "onb-feat-title"; tt.textContent = f.title;
        const bb = document.createElement("div");
        bb.className = "onb-feat-body"; bb.textContent = f.body;
        tx.append(tt, bb);
        item.append(ic, tx);
        grid.appendChild(item);
      });
      card.appendChild(grid);
    }

    if (s.needsMode) {
      const grid = document.createElement("div");
      grid.className = "onb-mode-grid";
      ["neophyte", "curieux", "etudiant", "expert"].forEach(m => {
        const btn = document.createElement("button");
        btn.className = "onb-mode-btn" + (chosenMode === m ? " selected" : "");
        const h = document.createElement("div");
        h.className = "onb-mode-name";
        h.textContent = t(`mode.${m}`);
        const sh = document.createElement("div");
        sh.className = "onb-mode-short";
        sh.textContent = t(`mode.${m}.short`);
        const d = document.createElement("div");
        d.className = "onb-mode-desc";
        d.textContent = t(`mode.${m}.desc`);
        btn.append(h, sh, d);
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
    // Marquer le chapitre du mois courant comme déjà vu — évite un modal en cascade
    try {
      const m = new Date().getMonth() + 1;
      localStorage.setItem("leproces_narrative_seen", JSON.stringify({ month: m }));
      // Idem synthèse hebdo : déjà gérée dans bootstrap (skipped si onboarding)
    } catch {}
    overlay.classList.add("onb-fade-out");
    setTimeout(() => {
      overlay.remove();
      if (onComplete) onComplete();
    }, 220);
  }

  document.body.appendChild(overlay);
  render();
}
