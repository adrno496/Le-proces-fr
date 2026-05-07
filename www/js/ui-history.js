// History panel : ARCHIVES uniquement (10 dernières audiences).
// Procès historiques + défi de la semaine ont été déplacés dans le Tribunal Dashboard.

import { el, clear, navigate, toast } from "./app.js";
import { Storage } from "./storage.js";
import { formatRelativeDate } from "./format.js";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "./case-engine.js";

export async function renderHistory(root) {
  clear(root);
  const container = el("div", { class: "panel panel-history" });
  container.appendChild(el("h1", { class: "panel-title" }, ["📜 ARCHIVES DU TRIBUNAL"]));
  root.appendChild(container);

  const allRows = await Storage.getHistory();
  const rows = allRows.slice(0, 10);

  if (!rows.length) {
    container.appendChild(el("div", { class: "empty-state" }, [
      el("div", { class: "empty-symbol" }, ["📜"]),
      el("p", {}, ["Aucune audience archivée pour le moment."]),
      el("button", { class: "btn-primary", onclick: () => navigate("tribunal") }, ["⚖ AUX AUDIENCES"]),
    ]));
    return;
  }

  container.appendChild(el("p", { class: "muted" }, [
    `Vos ${rows.length} dernière${rows.length > 1 ? "s" : ""} audience${rows.length > 1 ? "s" : ""} (max 10).`,
  ]));

  const list = el("div", { class: "history-list" });
  for (const row of rows) {
    const sevLabels = ["", "Avertissement", "Sanction légère", "Sanction modérée", "Sanction sévère", "Sanction maximale"];
    const verdictLabel = row.verdict.verdict === "guilty"
      ? `❌ Coupable · ${sevLabels[row.verdict.severity] || ""}`
      : `✅ Non-coupable · ${sevLabels[row.verdict.severity] || ""}`;
    const evalLabel = row.verdict.evaluation
      ? `${row.verdict.evaluation.aligned ? "🎯" : "🤔"} ${row.verdict.evaluation.label} (${row.verdict.evaluation.score}/100)`
      : null;
    const card = el("div", { class: "history-card" }, [
      el("div", { class: "history-date mono" }, [formatRelativeDate(row.date)]),
      el("div", { class: "history-title" }, [row.case.title]),
      el("div", { class: "history-meta" }, [
        el("span", {}, [`${CATEGORY_ICONS[row.case.category] || ""} ${CATEGORY_LABELS[row.case.category] || row.case.category}`]),
        el("span", { class: "verdict-tag" }, [verdictLabel]),
      ]),
      evalLabel ? el("div", { class: "history-eval" }, [evalLabel]) : null,
      row.verdict.argument ? el("div", { class: "history-arg" }, [`« ${row.verdict.argument} »`]) : null,
      el("div", { class: "actions-row" }, [
        el("button", { class: "btn-secondary", onclick: () => showFullCase(container, row) }, ["📖 Relire le dossier"]),
      ]),
    ]);
    list.appendChild(card);
  }
  container.appendChild(list);

  if (allRows.length > 10) {
    container.appendChild(el("p", { class: "muted", style: { textAlign: "center", marginTop: "12px" } }, [
      `${allRows.length - 10} audience${allRows.length - 10 > 1 ? "s plus anciennes" : " plus ancienne"} archivée${allRows.length - 10 > 1 ? "s" : ""} en mémoire locale.`,
    ]));
  }
}

function showFullCase(container, row) {
  const overlay = el("div", { class: "modal-overlay", onclick: e => { if (e.target.classList.contains("modal-overlay")) overlay.remove(); } });
  const modal = el("div", { class: "modal modal-large" });
  modal.appendChild(el("h2", {}, [row.case.title]));
  modal.appendChild(el("div", { class: "muted mono" }, [`${row.date} · ${CATEGORY_LABELS[row.case.category] || row.case.category}`]));
  modal.appendChild(el("hr"));
  modal.appendChild(el("h3", {}, ["⚔ Accusation"]));
  modal.appendChild(el("p", { class: "speech-text" }, [row.case.prosecutionSpeech]));
  modal.appendChild(el("h3", {}, ["🛡 Défense"]));
  modal.appendChild(el("p", { class: "speech-text" }, [row.case.defenseSpeech]));
  modal.appendChild(el("hr"));
  modal.appendChild(el("h3", {}, ["⚖ Votre verdict de l'époque"]));
  modal.appendChild(el("p", {}, [`${row.verdict.verdict === "guilty" ? "❌ Coupable" : "✅ Non-coupable"} · sévérité ${row.verdict.severity}/5 · ${row.verdict.xpGained} XP`]));
  if (row.verdict.evaluation) {
    modal.appendChild(el("p", { class: "muted" }, [
      `Vérité du dossier : ${row.verdict.truth === "guilty" ? "Coupable" : "Non-coupable"} — Score ${row.verdict.evaluation.score}/100`,
    ]));
  }
  if (row.verdict.argument) modal.appendChild(el("blockquote", {}, [row.verdict.argument]));
  modal.appendChild(el("button", { class: "btn-primary", onclick: () => overlay.remove() }, ["FERMER"]));
  overlay.appendChild(modal);
  container.appendChild(overlay);
}
