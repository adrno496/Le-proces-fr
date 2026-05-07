// Settings panel: provider/model picker, API key, theme, motto, notifications, expert mode.

import { el, clear, toast, navigate } from "./app.js";
import { Storage } from "./storage.js";
import { PROVIDERS, estimateCostFor100Messages, testApiKey } from "./ai-client.js";
import { THEMES, applyTheme } from "./themes.js";
import { isSupported as ttsSupported, frenchVoices } from "./tts.js";
import { requestPermission, scheduleDaily, cancel as cancelNotifs } from "./notifications.js";

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
  container.appendChild(el("h1", { class: "panel-title" }, ["⚙ PARAMÈTRES DU TRIBUNAL"]));

  // ====== Section IA ======
  const aiSection = el("section", { class: "settings-section" });
  aiSection.appendChild(el("h2", { class: "section-title" }, ["INTELLIGENCE ARTIFICIELLE"]));

  // Step 1: provider grid
  const stepProvider = el("div", { class: "step" });
  stepProvider.appendChild(el("div", { class: "step-label" }, ["1 · Choisissez votre Provider IA"]));
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
    apiKeyContainer.appendChild(el("div", { class: "step-label" }, [`2 · Clé API ${p.name}`]));
    const input = el("input", {
      type: "password",
      class: "api-key-input",
      placeholder: "Collez votre clé API ici",
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
    }, [`🔗 Obtenir une clé → ${p.apiHint}`]));

    const testBtn = el("button", { class: "btn-secondary", onclick: async () => {
      if (!apiKey) return toast("Entrez une clé d'abord", "error");
      if (!selectedModel) return toast("Choisissez un modèle d'abord", "error");
      // Save provisional settings, test, then revert if user cancels
      Storage.saveSettings({ provider: selectedProvider, model: selectedModel, apiKey });
      testBtn.disabled = true;
      testBtn.textContent = "Test en cours...";
      const res = await testApiKey();
      testBtn.disabled = false;
      testBtn.textContent = "TESTER LA CLÉ";
      if (res.ok) toast("✓ Clé valide", "success");
      else toast(res.error || "Échec du test", "error", 5000);
    }}, ["TESTER LA CLÉ"]);
    apiKeyContainer.appendChild(testBtn);
  }
  aiSection.appendChild(apiKeyContainer);

  // Step 3: model picker
  const modelContainer = el("div", { class: "step" });
  function renderModelSection() {
    clear(modelContainer);
    if (!selectedProvider) return;
    const p = PROVIDERS[selectedProvider];
    modelContainer.appendChild(el("div", { class: "step-label" }, ["3 · Choisissez le modèle"]));
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
      el("div", { class: "estimate-title" }, ["💰 COÛT ESTIMÉ POUR 100 MESSAGES"]),
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
    if (!selectedProvider) return toast("Choisissez un provider", "error");
    if (!apiKey) return toast("Entrez une clé API", "error");
    if (!selectedModel) return toast("Choisissez un modèle", "error");
    Storage.saveSettings({ provider: selectedProvider, model: selectedModel, apiKey });
    toast("Paramètres enregistrés", "success");
    setTimeout(() => navigate("tribunal"), 400);
  }}, ["ENREGISTRER ET COMMENCER"]);
  aiSection.appendChild(saveBtn);

  container.appendChild(aiSection);

  // ====== Section perso ======
  const persoSection = el("section", { class: "settings-section" });
  persoSection.appendChild(el("h2", { class: "section-title" }, ["PERSONNALISATION"]));

  // username
  const usernameRow = el("div", { class: "step" }, [
    el("div", { class: "step-label" }, ["Nom du juge"]),
  ]);
  const usernameInput = el("input", {
    type: "text", class: "text-input", maxlength: "20", value: profile.username,
    placeholder: "Votre Honneur",
  });
  usernameInput.addEventListener("change", e => {
    const v = (e.target.value || "Votre Honneur").slice(0, 20).trim() || "Votre Honneur";
    Storage.saveProfile({ username: v });
    toast("Nom enregistré", "success", 1500);
  });
  usernameRow.appendChild(usernameInput);
  persoSection.appendChild(usernameRow);

  // avatars
  const avatarRow = el("div", { class: "step" }, [el("div", { class: "step-label" }, ["Avatar"])]);
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
    el("div", { class: "step-label" }, ["Devise du juge (optionnelle)"]),
  ]);
  const mottoInput = el("input", {
    type: "text", class: "text-input", maxlength: "120", value: settings.motto || "",
    placeholder: "« La justice sans la force est impuissante. »",
  });
  mottoInput.addEventListener("change", e => {
    Storage.saveSettings({ motto: e.target.value.trim() });
    toast("Devise enregistrée", "success", 1500);
  });
  mottoRow.appendChild(mottoInput);
  persoSection.appendChild(mottoRow);

  // theme
  const themeRow = el("div", { class: "step" }, [el("div", { class: "step-label" }, ["Thème (8 disponibles)"])]);
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

  // ===== Section Audio (TTS) =====
  if (ttsSupported()) {
    const audioSec = el("section", { class: "settings-section" });
    audioSec.appendChild(el("h2", { class: "section-title" }, ["AUDIO — VOIX"]));
    const ttsToggle = el("button", {
      class: `btn-secondary ${settings.ttsEnabled ? "selected" : ""}`,
      onclick: () => {
        const v = !settings.ttsEnabled;
        Storage.saveSettings({ ttsEnabled: v });
        toast(v ? "TTS activée" : "TTS désactivée", "success", 1500);
        renderSettings(root);
      },
    }, [settings.ttsEnabled ? "🔊 TTS activée — désactiver" : "🔇 Activer la lecture audio des plaidoiries"]);
    audioSec.appendChild(ttsToggle);
    const voices = frenchVoices();
    if (voices.length) {
      audioSec.appendChild(el("div", { class: "muted" }, [`${voices.length} voix française(s) détectée(s) sur ce système.`]));
    } else {
      audioSec.appendChild(el("div", { class: "muted" }, ["Aucune voix française détectée — la lecture utilisera la voix système par défaut."]));
    }
    container.appendChild(audioSec);
  }

  // ===== Section Notifications =====
  const notifSec = el("section", { class: "settings-section" });
  notifSec.appendChild(el("h2", { class: "section-title" }, ["NOTIFICATIONS"]));
  notifSec.appendChild(el("p", { class: "muted" }, ["Recevez un rappel quotidien à l'heure de votre choix."]));
  const hourInput = el("input", { type: "number", min: "0", max: "23", value: settings.notifHour ?? 18, class: "text-input small-input" });
  const minInput = el("input", { type: "number", min: "0", max: "59", value: settings.notifMinute ?? 0, class: "text-input small-input" });
  notifSec.appendChild(el("div", { class: "input-row" }, [
    el("label", {}, ["Heure : "]), hourInput, el("span", {}, [":"]), minInput,
  ]));
  const notifBtn = el("button", {
    class: `btn-primary`,
    onclick: async () => {
      const ok = await requestPermission();
      if (!ok) return toast("Permission refusée", "error");
      const h = +hourInput.value, m = +minInput.value;
      const scheduled = await scheduleDaily(h, m);
      if (scheduled) toast(`Rappel programmé à ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`, "success", 3000);
      else toast("Notifications non disponibles sur ce navigateur", "error");
    },
  }, [settings.notifsEnabled ? "Reprogrammer le rappel quotidien" : "Activer le rappel quotidien"]);
  notifSec.appendChild(notifBtn);
  if (settings.notifsEnabled) {
    notifSec.appendChild(el("button", {
      class: "btn-secondary", onclick: async () => { await cancelNotifs(); toast("Rappel désactivé", "info"); renderSettings(root); },
    }, ["Désactiver"]));
  }
  container.appendChild(notifSec);

  // ===== Section Expert =====
  const expertSec = el("section", { class: "settings-section" });
  expertSec.appendChild(el("h2", { class: "section-title" }, ["MODE EXPERT"]));
  expertSec.appendChild(el("p", { class: "muted" }, ["Plaidoiries plus longues, pièces à conviction additionnelles, vocabulaire technique. Pour juristes confirmés et étudiants."]));
  expertSec.appendChild(el("button", {
    class: `btn-secondary ${settings.expertMode ? "selected" : ""}`,
    onclick: () => {
      const v = !settings.expertMode;
      Storage.saveSettings({ expertMode: v });
      toast(v ? "Mode expert activé" : "Mode standard", "success");
      renderSettings(root);
    },
  }, [settings.expertMode ? "✓ Mode expert activé" : "Activer le mode expert"]));
  container.appendChild(expertSec);

  // Reset section
  const dangerSection = el("section", { class: "settings-section" });
  dangerSection.appendChild(el("h2", { class: "section-title" }, ["ZONE SENSIBLE"]));
  dangerSection.appendChild(el("button", {
    class: "btn-danger",
    onclick: async () => {
      if (!confirm("Effacer toutes les données locales (cas, verdicts, profil) ? Cette action est irréversible.")) return;
      await Storage.clearHistory();
      Storage._resetAll();
      toast("Données effacées", "success");
      setTimeout(() => navigate("settings"), 500);
    },
  }, ["EFFACER TOUTES LES DONNÉES"]));
  container.appendChild(dangerSection);

  // initial sub-renders
  if (selectedProvider) {
    renderApiKeySection();
    renderModelSection();
    renderEstimate();
  }

  root.appendChild(container);
}
