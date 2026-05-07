// Costs panel: terminal-style consumption tracker.

import { el, clear, toast, navigate } from "./app.js";
import { Storage } from "./storage.js";
import { PROVIDERS, estimateCostFor100Messages } from "./ai-client.js";
import { formatTokens, formatCost } from "./format.js";
import { t } from "./i18n.js";

export function renderCosts(root) {
  clear(root);
  const container = el("div", { class: "panel panel-costs" });
  container.appendChild(el("h1", { class: "panel-title" }, [t("panel.costs")]));

  const settings = Storage.getSettings();
  const costs = Storage.getCosts();
  const sessionsCount = costs.sessionsCount || 0;
  const activeDays = new Set((costs.history || []).map(h => h.date)).size;

  const term = el("div", { class: "terminal" });

  const block = (title, lines) => {
    const wrap = el("div", { class: "term-block" });
    wrap.appendChild(el("div", { class: "term-title" }, [title]));
    wrap.appendChild(el("hr", { class: "term-rule" }));
    for (const [k, v] of lines) {
      wrap.appendChild(el("div", { class: "term-row" }, [
        el("span", { class: "term-key" }, [k]),
        el("span", { class: "term-val mono" }, [v]),
      ]));
    }
    return wrap;
  };

  term.appendChild(block("CETTE SESSION", [
    ["Tokens envoyés", formatTokens(costs.sessionTokensIn)],
    ["Tokens reçus", formatTokens(costs.sessionTokensOut)],
    ["Coût session", formatCost(costs.sessionCost)],
    ["Provider utilisé", settings.provider ? PROVIDERS[settings.provider]?.name : "—"],
  ]));
  term.appendChild(block("TOUT TEMPS", [
    ["Total tokens", formatTokens(costs.totalTokensIn + costs.totalTokensOut)],
    ["Coût total", formatCost(costs.totalCost)],
    ["Sessions", String(sessionsCount)],
    ["Jours actifs", String(activeDays)],
  ]));

  if (settings.provider && settings.model) {
    const est = estimateCostFor100Messages(settings.provider, settings.model);
    if (est) {
      term.appendChild(block("PAR 100 MESSAGES (modèle actuel)", [
        ["Modèle", est.model],
        ["Coût estimé", est.costFormatted],
        ["Verdict", est.label],
      ]));
    }
  }

  container.appendChild(term);

  const actions = el("div", { class: "actions-row" }, [
    el("button", { class: "btn-secondary", onclick: () => navigate("settings") }, ["CHANGER DE MODÈLE"]),
    el("button", { class: "btn-secondary", onclick: () => { Storage.resetSessionCost(); toast("Session réinitialisée", "success"); renderCosts(root); } }, ["RESET SESSION"]),
    el("button", { class: "btn-secondary", onclick: () => showComparison(container) }, ["COMPARER"]),
  ]);
  container.appendChild(actions);

  // History table
  const histSection = el("section", { class: "term-block" });
  histSection.appendChild(el("div", { class: "term-title" }, ["HISTORIQUE DES APPELS (30 derniers)"]));
  histSection.appendChild(el("hr", { class: "term-rule" }));
  const tbl = el("div", { class: "term-table" });
  tbl.appendChild(el("div", { class: "term-row term-row-head mono" }, [
    el("span", { class: "col-date" }, ["Date"]),
    el("span", { class: "col-model" }, ["Modèle"]),
    el("span", { class: "col-cost" }, ["Coût"]),
  ]));
  for (const entry of (costs.history || []).slice(0, 30)) {
    tbl.appendChild(el("div", { class: "term-row mono" }, [
      el("span", { class: "col-date" }, [entry.date]),
      el("span", { class: "col-model" }, [entry.model]),
      el("span", { class: "col-cost" }, [formatCost(entry.cost)]),
    ]));
  }
  if ((costs.history || []).length === 0) {
    tbl.appendChild(el("div", { class: "term-row mono term-empty" }, ["— aucun appel enregistré —"]));
  }
  histSection.appendChild(tbl);
  container.appendChild(histSection);

  root.appendChild(container);
}

function showComparison(container) {
  const costs = Storage.getCosts();
  const inT = costs.totalTokensIn || 80000;
  const outT = costs.totalTokensOut || 40000;

  const overlay = el("div", { class: "modal-overlay", onclick: (e) => { if (e.target.classList.contains("modal-overlay")) overlay.remove(); } });
  const modal = el("div", { class: "modal" });
  modal.appendChild(el("h3", {}, ["Comparatif des modèles (sur votre volume)"]));
  modal.appendChild(el("p", { class: "muted mono" }, [`Base : ${inT.toLocaleString()} in / ${outT.toLocaleString()} out`]));

  const list = el("div", { class: "compare-list" });
  for (const [pid, p] of Object.entries(PROVIDERS)) {
    for (const m of p.models) {
      const c = (inT / 1_000_000) * m.priceIn + (outT / 1_000_000) * m.priceOut;
      list.appendChild(el("div", { class: "compare-row" }, [
        el("span", { class: "cmp-prov" }, [`${p.logo} ${p.name}`]),
        el("span", { class: "cmp-model" }, [m.name]),
        el("span", { class: "cmp-cost mono" }, [formatCost(c)]),
      ]));
    }
  }
  modal.appendChild(list);
  modal.appendChild(el("button", { class: "btn-primary", onclick: () => overlay.remove() }, ["FERMER"]));
  overlay.appendChild(modal);
  container.appendChild(overlay);
}
