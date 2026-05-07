// History panel : ARCHIVES uniquement (10 dernières audiences).
// Procès historiques + défi de la semaine ont été déplacés dans le Tribunal Dashboard.

import { el, clear, navigate, toast } from "./app.js";
import { Storage } from "./storage.js";
import { formatRelativeDate } from "./format.js";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "./case-engine.js";
import { t } from "./i18n.js";

export async function renderHistory(root) {
  clear(root);
  const container = el("div", { class: "panel panel-history" });
  container.appendChild(el("h1", { class: "panel-title" }, [t("panel.archives")]));
  root.appendChild(container);

  const allRows = await Storage.getHistory();
  const rows = allRows.slice(0, 10);

  if (!rows.length) {
    container.appendChild(el("div", { class: "empty-state" }, [
      el("div", { class: "empty-symbol" }, ["📜"]),
      el("p", {}, [t("history.empty")]),
      el("button", { class: "btn-primary", onclick: () => navigate("tribunal") }, [t("history.empty_cta")]),
    ]));
    return;
  }

  container.appendChild(el("p", { class: "muted" }, [
    t("history.recent", { n: rows.length, s: rows.length > 1 ? "s" : "" }),
  ]));

  const list = el("div", { class: "history-list" });
  for (const row of rows) {
    const sev = row.verdict.severity;
    const sevLabel = sev > 0 ? t(`history.severity_label.${sev}`) : "";
    const verdictLabel = row.verdict.verdict === "guilty"
      ? `❌ ${t("card.daily.guilty")} · ${sevLabel}`
      : `✅ ${t("card.daily.innocent")} · ${sevLabel}`;
    const evalLabel = row.verdict.evaluation
      ? `${row.verdict.evaluation.aligned ? "🎯" : "🤔"} ${t(row.verdict.evaluation.label) || row.verdict.evaluation.label} (${row.verdict.evaluation.score}/100)`
      : null;
    const card = el("div", { class: "history-card" }, [
      el("div", { class: "history-date mono" }, [formatRelativeDate(row.date)]),
      el("div", { class: "history-title" }, [row.case.title]),
      el("div", { class: "history-meta" }, [
        el("span", {}, [`${CATEGORY_ICONS[row.case.category] || ""} ${t(`cat.${row.case.category}`) || row.case.category}`]),
        el("span", { class: "verdict-tag" }, [verdictLabel]),
      ]),
      evalLabel ? el("div", { class: "history-eval" }, [evalLabel]) : null,
      row.verdict.argument ? el("div", { class: "history-arg" }, [`« ${row.verdict.argument} »`]) : null,
      el("div", { class: "actions-row" }, [
        el("button", { class: "btn-secondary", onclick: () => showFullCase(container, row) }, [t("btn.review_dossier")]),
      ]),
    ]);
    list.appendChild(card);
  }
  container.appendChild(list);

  if (allRows.length > 10) {
    const n = allRows.length - 10;
    container.appendChild(el("p", { class: "muted", style: { textAlign: "center", marginTop: "12px" } }, [
      t("history.older", { n, s: n > 1 ? "s" : "" }),
    ]));
  }
}

function showFullCase(container, row) {
  const overlay = el("div", { class: "modal-overlay", onclick: e => { if (e.target.classList.contains("modal-overlay")) overlay.remove(); } });
  const modal = el("div", { class: "modal modal-large" });
  modal.appendChild(el("h2", {}, [row.case.title]));
  modal.appendChild(el("div", { class: "muted mono" }, [`${row.date} · ${t(`cat.${row.case.category}`) || row.case.category}`]));
  modal.appendChild(el("hr"));
  modal.appendChild(el("h3", {}, [t("speech.prosecution")]));
  modal.appendChild(el("p", { class: "speech-text" }, [row.case.prosecutionSpeech]));
  modal.appendChild(el("h3", {}, [t("speech.defense")]));
  modal.appendChild(el("p", { class: "speech-text" }, [row.case.defenseSpeech]));
  modal.appendChild(el("hr"));
  modal.appendChild(el("h3", {}, [t("history.your_verdict")]));
  modal.appendChild(el("p", {}, [`${row.verdict.verdict === "guilty" ? `❌ ${t("card.daily.guilty")}` : `✅ ${t("card.daily.innocent")}`} · ${t("verdict.severity").toLowerCase()} ${row.verdict.severity}/5 · ${row.verdict.xpGained} XP`]));
  if (row.verdict.evaluation) {
    modal.appendChild(el("p", { class: "muted" }, [
      t("history.truth_was", { truth: row.verdict.truth === "guilty" ? t("card.daily.guilty") : t("card.daily.innocent"), s: row.verdict.evaluation.score }),
    ]));
  }
  if (row.verdict.argument) modal.appendChild(el("blockquote", {}, [row.verdict.argument]));
  modal.appendChild(el("button", { class: "btn-primary", onclick: () => overlay.remove() }, [t("btn.close")]));
  overlay.appendChild(modal);
  container.appendChild(overlay);
}
