// Settings panel: provider/model picker, API key, theme, motto, notifications, expert mode.

import { el, clear, toast, navigate } from "./app.js";
import { Storage } from "./storage.js";
import { PROVIDERS, estimateCostFor100Messages, testApiKey } from "./ai-client.js";
import { THEMES, applyTheme } from "./themes.js";
import { isSupported as ttsSupported, frenchVoices } from "./tts.js";
import { requestPermission, scheduleDaily, cancel as cancelNotifs } from "./notifications.js";
import { t, setLang, getLang, LANGS, LANG_LABELS } from "./i18n.js";
import { renderBottomNav, refreshHardRefreshButton } from "./app.js";

const AVATARS = ["👨‍⚖", "👩‍⚖", "🧑‍⚖", "🦉", "🦅", "🐈‍⬛", "🐺", "🦊", "🦁", "🐉", "🌟", "📚", "⚖", "🏛", "🔨", "🕊"];

function speedBadge(speed) {
  const map = { "ultra-rapide": "⚡", "rapide": "🚀", "moyen": "⏱", "lent": "🐢" };
  return map[speed] || "⏱";
}
function qualityBadge(q) {
  const map = { "bon": "⭐", "très bon": "⭐⭐", "excellent": "⭐⭐⭐", "exceptionnel": "⭐⭐⭐⭐" };
  return map[q] || "⭐";
}

export function renderSettings(root) {
  clear(root);
  const settings = Storage.getSettings();
  const profile = Storage.getProfile();

  let selectedProvider = settings.provider;
  let selectedModel = settings.model;
  let apiKey = settings.apiKey || "";

  const container = el("div", { class: "panel panel-settings" });
  container.appendChild(el("h1", { class: "panel-title" }, [t("panel.settings")]));

  // ===== Section Langue (en haut, le plus important) =====
  const langSection = el("section", { class: "settings-section" });
  langSection.appendChild(el("h2", { class: "section-title" }, [t("settings.section.language")]));
  langSection.appendChild(el("div", { class: "step-label" }, [t("settings.language")]));
  const langGrid = el("div", { class: "theme-row" });
  for (const code of LANGS) {
    const isSel = getLang() === code;
    langGrid.appendChild(el("button", {
      class: `btn-secondary ${isSel ? "selected" : ""}`,
      onclick: () => {
        setLang(code);
        renderBottomNav();
        refreshHardRefreshButton();
        renderSettings(root);
      },
    }, [`${code === "fr" ? "🇫🇷" : "🇬🇧"} ${LANG_LABELS[code]}`]));
  }
  langSection.appendChild(langGrid);
  if (getLang() === "en") {
    langSection.appendChild(el("p", { class: "muted", style: { marginTop: "8px", fontSize: "0.85rem" } }, [t("settings.notice_legal")]));
  }
  container.appendChild(langSection);

  // ====== Section IA ======
  const aiSection = el("section", { class: "settings-section" });
  aiSection.appendChild(el("h2", { class: "section-title" }, [t("settings.section.ai")]));

  // Step 1: provider grid
  const stepProvider = el("div", { class: "step" });
  stepProvider.appendChild(el("div", { class: "step-label" }, [t("settings.step.provider")]));
  const providerGrid = el("div", { class: "provider-grid" });

  function renderProviderGrid() {
    clear(providerGrid);
    for (const [id, p] of Object.entries(PROVIDERS)) {
      const freeCount = p.models.filter(m => m.free).length;
      const isSelected = id === selectedProvider;
      const card = el("button", {
        class: `provider-card ${isSelected ? "selected" : ""}`,
        onclick: () => {
          selectedProvider = id;
          selectedModel = p.models[0]?.id || null;
          renderProviderGrid();
          renderModelSection();
          renderEstimate();
          renderApiKeySection();
        },
      }, [
        el("div", { class: "provider-logo" }, [p.logo]),
        el("div", { class: "provider-name" }, [p.name]),
        el("div", { class: "provider-meta" }, [`${p.models.length} modèle${p.models.length > 1 ? "s" : ""}`]),
        el("div", { class: "provider-meta" }, [freeCount > 0 ? `${freeCount} gratuit${freeCount > 1 ? "s" : ""} ✓` : "Payant"]),
      ]);
      providerGrid.appendChild(card);
    }
  }
  renderProviderGrid();
  stepProvider.appendChild(providerGrid);
  aiSection.appendChild(stepProvider);

  // Step 2: API key
  const apiKeyContainer = el("div", { class: "step" });
  function renderApiKeySection() {
    clear(apiKeyContainer);
    if (!selectedProvider) return;
    const p = PROVIDERS[selectedProvider];
    apiKeyContainer.appendChild(el("div", { class: "step-label" }, [t("settings.step.api_key", { provider: p.name })]));
    const input = el("input", {
      type: "password",
      class: "api-key-input",
      placeholder: t("settings.api_key.placeholder"),
      value: apiKey,
      autocomplete: "off",
      spellcheck: "false",
    });
    input.addEventListener("input", e => { apiKey = e.target.value.trim(); });
    const showBtn = el("button", {
      class: "btn-icon",
      title: "Afficher/masquer",
      onclick: () => { input.type = input.type === "password" ? "text" : "password"; },
    }, ["👁"]);
    const pasteBtn = el("button", {
      class: "btn-icon",
      title: "Coller",
      onclick: async () => {
        try {
          const v = await navigator.clipboard.readText();
          input.value = v.trim();
          apiKey = v.trim();
        } catch { toast("Impossible de lire le presse-papier", "error"); }
      },
    }, ["📋"]);
    const inputRow = el("div", { class: "input-row" }, [input, showBtn, pasteBtn]);
    apiKeyContainer.appendChild(inputRow);
    apiKeyContainer.appendChild(el("a", {
      class: "api-link",
      href: p.apiUrl, target: "_blank", rel: "noopener noreferrer",
    }, [`${t("settings.api_key.get")} ${p.apiHint}`]));
    if (selectedProvider === "openrouter") {
      apiKeyContainer.appendChild(el("a", {
        class: "api-link",
        href: "https://openrouter.ai/settings/privacy",
        target: "_blank", rel: "noopener noreferrer",
        style: { display: "block", color: "var(--gold)", fontSize: "0.85rem", marginTop: "4px" },
      }, ["⚙ " + t("settings.api_key.openrouter_privacy")]));
    }

    const testBtn = el("button", { class: "btn-secondary", onclick: async () => {
      if (!apiKey) return toast(t("settings.api_key.placeholder"), "error");
      if (!selectedModel) return toast(t("settings.step.model"), "error");
      Storage.saveSettings({ provider: selectedProvider, model: selectedModel, apiKey });
      testBtn.disabled = true;
      testBtn.textContent = t("settings.api_key.testing");
      const res = await testApiKey();
      testBtn.disabled = false;
      testBtn.textContent = t("settings.api_key.test");
      if (res.ok) toast(t("settings.api_key.valid"), "success");
      else toast(res.error || "Erreur", "error", 5000);
    }}, [t("settings.api_key.test")]);
    apiKeyContainer.appendChild(testBtn);
  }
  aiSection.appendChild(apiKeyContainer);

  // Step 3: model picker
  const modelContainer = el("div", { class: "step" });
  function renderModelSection() {
    clear(modelContainer);
    if (!selectedProvider) return;
    const p = PROVIDERS[selectedProvider];
    modelContainer.appendChild(el("div", { class: "step-label" }, [t("settings.step.model")]));
    const list = el("div", { class: "model-list" });
    for (const m of p.models) {
      const isSel = m.id === selectedModel;
      const row = el("button", {
        class: `model-row ${isSel ? "selected" : ""}`,
        onclick: () => { selectedModel = m.id; renderModelSection(); renderEstimate(); },
      }, [
        el("div", { class: "model-name" }, [m.name]),
        el("div", { class: "model-badges" }, [
          el("span", { class: "badge", title: m.speed }, [speedBadge(m.speed) + " " + m.speed]),
          el("span", { class: "badge", title: m.quality }, [qualityBadge(m.quality) + " " + m.quality]),
          m.free ? el("span", { class: "badge badge-free" }, ["FREE"]) : null,
        ]),
      ]);
      list.appendChild(row);
    }
    modelContainer.appendChild(list);
  }
  aiSection.appendChild(modelContainer);

  // Step 4: estimate
  const estimateContainer = el("div", { class: "step" });
  function renderEstimate() {
    clear(estimateContainer);
    if (!selectedProvider || !selectedModel) return;
    const est = estimateCostFor100Messages(selectedProvider, selectedModel);
    if (!est) return;
    const monthCost = est.costUSD * 0.30; // ~30 msgs/mois
    const card = el("div", { class: "estimate-card" }, [
      el("div", { class: "estimate-title" }, [t("settings.step.estimate")]),
      el("div", { class: "estimate-row" }, [el("span", {}, ["Provider"]), el("span", {}, [est.provider])]),
      el("div", { class: "estimate-row" }, [el("span", {}, ["Modèle"]), el("span", {}, [est.model])]),
      el("div", { class: "estimate-row" }, [el("span", {}, ["Tokens envoyés"]), el("span", { class: "mono" }, [`~${est.tokensIn.toLocaleString("fr-FR")}`])]),
      el("div", { class: "estimate-row" }, [el("span", {}, ["Tokens reçus"]), el("span", { class: "mono" }, [`~${est.tokensOut.toLocaleString("fr-FR")}`])]),
      el("div", { class: "estimate-row big" }, [el("span", {}, ["Coût estimé"]), el("span", { class: "mono" }, [est.costFormatted])]),
      el("div", { class: "estimate-row" }, [el("span", {}, ["En euros"]), el("span", { class: "mono" }, [`~${est.costEUR.toFixed(4)}€`])]),
      el("div", { class: "estimate-verdict" }, [est.label]),
      el("div", { class: "estimate-note" }, [`(1 mois quotidien ≈ 30 msgs → ~${(monthCost).toFixed(4)}$)`]),
    ]);
    estimateContainer.appendChild(card);
  }
  aiSection.appendChild(estimateContainer);

  // Step 5: save
  const saveBtn = el("button", { class: "btn-primary btn-big", onclick: async () => {
    if (!selectedProvider) return toast(t("settings.step.provider"), "error");
    if (!apiKey) return toast(t("settings.step.api_key", { provider: "" }), "error");
    if (!selectedModel) return toast(t("settings.step.model"), "error");
    Storage.saveSettings({ provider: selectedProvider, model: selectedModel, apiKey });
    toast(t("settings.saved"), "success");
    setTimeout(() => navigate("tribunal"), 400);
  }}, [t("settings.save")]);
  aiSection.appendChild(saveBtn);

  container.appendChild(aiSection);

  // ====== Section perso ======
  const persoSection = el("section", { class: "settings-section" });
  persoSection.appendChild(el("h2", { class: "section-title" }, [t("settings.section.perso")]));

  // username
  const usernameRow = el("div", { class: "step" }, [
    el("div", { class: "step-label" }, [t("settings.username")]),
  ]);
  const def = t("settings.username_default");
  const usernameInput = el("input", {
    type: "text", class: "text-input", maxlength: "20", value: profile.username,
    placeholder: def,
  });
  usernameInput.addEventListener("change", e => {
    const v = (e.target.value || def).slice(0, 20).trim() || def;
    Storage.saveProfile({ username: v });
    toast(t("settings.saved"), "success", 1500);
  });
  usernameRow.appendChild(usernameInput);
  persoSection.appendChild(usernameRow);

  // avatars
  const avatarRow = el("div", { class: "step" }, [el("div", { class: "step-label" }, [t("settings.avatar")])]);
  const avatarGrid = el("div", { class: "avatar-grid" });
  AVATARS.forEach((a, i) => {
    const isSel = profile.avatarId === i;
    const btn = el("button", {
      class: `avatar-btn ${isSel ? "selected" : ""}`,
      onclick: () => {
        Storage.saveProfile({ avatarId: i });
        renderSettings(root); // re-render
      },
    }, [a]);
    avatarGrid.appendChild(btn);
  });
  avatarRow.appendChild(avatarGrid);
  persoSection.appendChild(avatarRow);

  // motto
  const mottoRow = el("div", { class: "step" }, [
    el("div", { class: "step-label" }, [t("settings.motto")]),
  ]);
  const mottoInput = el("input", {
    type: "text", class: "text-input", maxlength: "120", value: settings.motto || "",
    placeholder: t("settings.motto.placeholder"),
  });
  mottoInput.addEventListener("change", e => {
    Storage.saveSettings({ motto: e.target.value.trim() });
    toast(t("settings.saved"), "success", 1500);
  });
  mottoRow.appendChild(mottoInput);
  persoSection.appendChild(mottoRow);

  // theme
  const themeRow = el("div", { class: "step" }, [el("div", { class: "step-label" }, [t("settings.theme")])]);
  const themeGrid = el("div", { class: "theme-grid" });
  for (const t of THEMES) {
    const isSel = (settings.theme || "dark") === t.id;
    themeGrid.appendChild(el("button", {
      class: `theme-card ${isSel ? "selected" : ""}`,
      onclick: () => {
        Storage.saveSettings({ theme: t.id });
        applyTheme(t.id);
        // track tested themes
        const profile = Storage.getProfile();
        const tried = Array.from(new Set([...(profile.themesTried || []), t.id]));
        Storage.saveProfile({ themesTried: tried });
        renderSettings(root);
      },
    }, [
      el("div", { class: "theme-name" }, [t.name]),
      el("div", { class: "theme-desc muted" }, [t.desc]),
    ]));
  }
  themeRow.appendChild(themeGrid);
  persoSection.appendChild(themeRow);

  container.appendChild(persoSection);

  // ===== Section Volumes audio =====
  const volSec = el("section", { class: "settings-section" });
  volSec.appendChild(el("h2", { class: "section-title" }, [t("vol.section")]));
  const vol = settings.volume || { ambient: 0.25, gavel: 0.85, tts: 1.0, master: 1.0 };
  for (const key of ["master", "ambient", "gavel", "tts"]) {
    const row = el("div", { class: "vol-row" });
    row.appendChild(el("div", { class: "vol-label" }, [t(`vol.${key}`)]));
    const valueLabel = el("span", { class: "vol-value mono" }, [`${Math.round((vol[key] ?? 0) * 100)} %`]);
    const slider = el("input", { type: "range", min: "0", max: "100", value: String(Math.round((vol[key] ?? 0) * 100)), class: "slider" });
    slider.addEventListener("input", e => {
      const v = +e.target.value / 100;
      const newVol = { ...(Storage.getSettings().volume || vol), [key]: v };
      Storage.saveSettings({ volume: newVol });
      valueLabel.textContent = `${Math.round(v * 100)} %`;
    });
    row.appendChild(slider);
    row.appendChild(valueLabel);
    volSec.appendChild(row);
  }
  container.appendChild(volSec);

  // ===== Section Audio (TTS) =====
  if (ttsSupported()) {
    const audioSec = el("section", { class: "settings-section" });
    audioSec.appendChild(el("h2", { class: "section-title" }, [t("settings.section.audio")]));
    const ttsToggle = el("button", {
      class: `btn-secondary ${settings.ttsEnabled ? "selected" : ""}`,
      onclick: () => {
        const v = !settings.ttsEnabled;
        Storage.saveSettings({ ttsEnabled: v });
        toast(t("settings.saved"), "success", 1500);
        renderSettings(root);
      },
    }, [settings.ttsEnabled ? t("settings.tts.on") : t("settings.tts.off")]);
    audioSec.appendChild(ttsToggle);

    // Choix du moteur TTS
    audioSec.appendChild(el("div", { class: "step-label", style: { marginTop: "12px" } }, [t("settings.tts.engine")]));
    const engineRow = el("div", { class: "tts-engine-row" });
    const engines = [
      { id: "premium", label: t("settings.tts.engine.premium"), desc: t("settings.tts.engine.premium.desc") },
      { id: "system",  label: t("settings.tts.engine.system"),  desc: t("settings.tts.engine.system.desc") },
      { id: "openai",  label: t("settings.tts.engine.openai"),  desc: t("settings.tts.engine.openai.desc"),
        disabled: settings.provider !== "openai" },
    ];
    const currentEngine = settings.ttsEngine || "premium";
    for (const e of engines) {
      const isSel = currentEngine === e.id;
      const btn = el("button", {
        class: `tts-engine-card ${isSel ? "selected" : ""} ${e.disabled ? "disabled" : ""}`,
        disabled: e.disabled,
        onclick: () => {
          if (e.disabled) {
            toast(t("settings.tts.engine.openai.required"), "info", 4000);
            return;
          }
          Storage.saveSettings({ ttsEngine: e.id });
          toast(t("settings.saved"), "success", 1500);
          renderSettings(root);
        },
      }, [
        el("div", { class: "tts-engine-name" }, [e.label]),
        el("div", { class: "tts-engine-desc muted" }, [e.desc]),
      ]);
      engineRow.appendChild(btn);
    }
    audioSec.appendChild(engineRow);

    const voices = frenchVoices();
    if (voices.length) {
      audioSec.appendChild(el("div", { class: "muted", style: { marginTop: "10px" } }, [t("settings.tts.voices", { n: voices.length })]));
    } else {
      audioSec.appendChild(el("div", { class: "muted", style: { marginTop: "10px" } }, [t("settings.tts.no_voice")]));
    }
    container.appendChild(audioSec);
  }

  // ===== Section Notifications =====
  const notifSec = el("section", { class: "settings-section" });
  notifSec.appendChild(el("h2", { class: "section-title" }, [t("settings.section.notifs")]));
  notifSec.appendChild(el("p", { class: "muted" }, [t("settings.notifs.intro")]));
  const hourInput = el("input", { type: "number", min: "0", max: "23", value: settings.notifHour ?? 18, class: "text-input small-input" });
  const minInput = el("input", { type: "number", min: "0", max: "59", value: settings.notifMinute ?? 0, class: "text-input small-input" });
  notifSec.appendChild(el("div", { class: "input-row" }, [
    el("label", {}, [t("settings.notifs.hour")]), hourInput, el("span", {}, [":"]), minInput,
  ]));
  const notifBtn = el("button", {
    class: `btn-primary`,
    onclick: async () => {
      const ok = await requestPermission();
      if (!ok) return toast(t("settings.notifs.denied"), "error");
      const h = +hourInput.value, m = +minInput.value;
      const scheduled = await scheduleDaily(h, m);
      if (scheduled) toast(t("settings.notifs.scheduled", { time: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}` }), "success", 3000);
      else toast(t("settings.notifs.unavailable"), "error");
    },
  }, [settings.notifsEnabled ? t("settings.notifs.reschedule") : t("settings.notifs.activate")]);
  notifSec.appendChild(notifBtn);
  if (settings.notifsEnabled) {
    notifSec.appendChild(el("button", {
      class: "btn-secondary", onclick: async () => { await cancelNotifs(); toast(t("settings.notifs.off"), "info"); renderSettings(root); },
    }, [t("settings.notifs.deactivate")]));
  }
  container.appendChild(notifSec);

  // ===== Section Expert =====
  const expertSec = el("section", { class: "settings-section" });
  // ===== Profil utilisateur (4 modes) =====
  const modeSec = el("section", { class: "settings-section" });
  modeSec.appendChild(el("h2", { class: "section-title" }, [t("mode.section")]));
  modeSec.appendChild(el("p", { class: "muted" }, [t("mode.section.intro")]));
  // Badge mode actuel
  const currentModeId = settings.mode || "etudiant";
  modeSec.appendChild(el("div", { class: "current-mode-badge" }, [
    `${t("mode.current")} : `,
    el("strong", {}, [t(`mode.${currentModeId}`)]),
  ]));
  const modeGrid = el("div", { class: "mode-grid" });
  for (const m of ["neophyte", "curieux", "etudiant", "expert"]) {
    const isSel = currentModeId === m;
    modeGrid.appendChild(el("button", {
      class: `mode-card ${isSel ? "selected" : ""}`,
      onclick: async () => {
        if (isSel) return; // déjà sélectionné, pas de re-render inutile
        Storage.saveSettings({ mode: m });
        toast(`✓ ${t("mode.changed")} : ${t(`mode.${m}`)}`, "success", 3000);
        // Proposer de régénérer le cas du jour si déjà voté ou caché
        const today = (new Date()).toISOString().slice(0, 10);
        const cached = await Storage.getCachedCase(today);
        const verdict = await Storage.getVerdict(today);
        if (cached && !verdict) {
          // Pas encore voté : on peut régénérer pour adapter au nouveau mode
          if (confirm(t("mode.regen_confirm"))) {
            await Storage.saveCase({ ...cached, _regenerate: true, date: today + "_old" });
            // En vrai on supprime le cache pour forcer la régénération
            const { Storage: S } = await import("./storage.js");
            // Pas d'API delete : on overwrite avec un objet périmé
            // → meilleure approche : flag _regenerated et getDailyCase le respecte
            // Pour MVP : l'utilisateur peut faire reload via le bouton 🔄
            toast(t("mode.regen_hint"), "info", 4500);
          }
        }
        renderSettings(root);
      },
    }, [
      el("div", { class: "mode-card-name" }, [t(`mode.${m}`)]),
      el("div", { class: "mode-card-short" }, [t(`mode.${m}.short`)]),
      el("div", { class: "mode-card-desc muted" }, [t(`mode.${m}.desc`)]),
      isSel ? el("div", { class: "mode-card-active" }, ["✓ " + t("mode.active")]) : null,
    ]));
  }
  modeSec.appendChild(modeGrid);
  container.appendChild(modeSec);

  expertSec.appendChild(el("h2", { class: "section-title" }, [t("settings.section.expert")]));
  expertSec.appendChild(el("p", { class: "muted" }, [t("settings.expert.intro")]));
  expertSec.appendChild(el("button", {
    class: `btn-secondary ${settings.expertMode ? "selected" : ""}`,
    onclick: () => {
      const v = !settings.expertMode;
      Storage.saveSettings({ expertMode: v });
      toast(t("settings.saved"), "success");
      renderSettings(root);
    },
  }, [settings.expertMode ? t("settings.expert.on") : t("settings.expert.off")]));
  container.appendChild(expertSec);

  // ===== Coûts IA (déplacé depuis la nav) =====
  if (settings.apiKey) {
    const costsSec = el("section", { class: "settings-section" });
    costsSec.appendChild(el("h2", { class: "section-title" }, [t("nav.costs")]));
    const costs = Storage.getCosts();
    costsSec.appendChild(el("div", { class: "costs-summary" }, [
      el("div", { class: "stat-row" }, [
        el("span", { class: "stat-key" }, [t("costs.total_cost")]),
        el("span", { class: "stat-val mono" }, [costs.totalCost ? costs.totalCost.toFixed(4) + " $" : "0 $"]),
      ]),
      el("div", { class: "stat-row" }, [
        el("span", { class: "stat-key" }, [t("costs.session_cost")]),
        el("span", { class: "stat-val mono" }, [costs.sessionCost ? costs.sessionCost.toFixed(4) + " $" : "0 $"]),
      ]),
      el("div", { class: "stat-row" }, [
        el("span", { class: "stat-key" }, [t("costs.total_tokens")]),
        el("span", { class: "stat-val mono" }, [String((costs.totalTokensIn || 0) + (costs.totalTokensOut || 0))]),
      ]),
    ]));
    costsSec.appendChild(el("button", {
      class: "btn-secondary",
      onclick: () => navigate("costs"),
    }, [t("settings.costs.see_details")]));
    container.appendChild(costsSec);
  }

  // Reset section
  const dangerSection = el("section", { class: "settings-section" });
  dangerSection.appendChild(el("h2", { class: "section-title" }, [t("settings.section.danger")]));
  dangerSection.appendChild(el("button", {
    class: "btn-danger",
    onclick: async () => {
      if (!confirm(t("settings.danger.confirm"))) return;
      await Storage.clearHistory();
      Storage._resetAll();
      toast(t("settings.danger.done"), "success");
      setTimeout(() => navigate("settings"), 500);
    },
  }, [t("settings.danger.btn")]));
  container.appendChild(dangerSection);

  // initial sub-renders
  if (selectedProvider) {
    renderApiKeySection();
    renderModelSection();
    renderEstimate();
  }

  root.appendChild(container);
}
