// Codex panel — standalone view (was previously a profile tab).
// 211 legal entries with search, Légifrance link, AI "Learn more" button.

import { el, clear, toast } from "./app.js";
import { Storage } from "./storage.js";
import {
  CODEX_ENTRIES, getCodex, progress as codexProgress,
  isUnlocked, explainMore, searchCodex, legifranceUrl,
} from "./codex.js";
import { t } from "./i18n.js";

export function renderCodex(root) {
  clear(root);
  const container = el("div", { class: "panel panel-codex" });
  container.appendChild(el("div", { class: "panel-title-with-logo" }, [
    el("img", { src: "icons/logo.png", alt: "", class: "title-logo" }),
    el("h1", { class: "panel-title" }, [t("profile.codex.title")]),
  ]));

  const prog = codexProgress();
  container.appendChild(el("div", { class: "section-header" }, [
    el("span", { class: "muted" }, [`${prog.unlocked} / ${prog.total} (${prog.pct} %)`]),
    el("div", { class: "xp-bar codex-xp-bar" }, [
      el("div", { class: "xp-bar-fill", style: { width: `${prog.pct}%` } }),
    ]),
  ]));

  container.appendChild(el("p", { class: "muted" }, [t("profile.codex.intro")]));

  // Search input
  const search = el("input", {
    type: "search",
    class: "text-input codex-search-input",
    placeholder: t("codex.search"),
  });
  const list = el("div", { class: "codex-list" });
  search.addEventListener("input", e => render(e.target.value));
  container.appendChild(search);
  container.appendChild(list);

  function render(query = "") {
    while (list.firstChild) list.removeChild(list.firstChild);
    const filtered = searchCodex(query);
    if (!filtered.length) {
      list.appendChild(el("p", { class: "muted" }, [t("codex.no_results")]));
      return;
    }
    const grouped = {};
    filtered.forEach(e => { (grouped[e.code] = grouped[e.code] || []).push(e); });
    for (const [code, entries] of Object.entries(grouped)) {
      list.appendChild(el("h4", { class: "codex-section" }, [code, el("span", { class: "muted" }, [` (${entries.length})`])]));
      entries.forEach(e => {
        const ok = isUnlocked(e.id);
        const card = el("div", { class: `codex-entry ${ok ? "unlocked" : "locked"}` });
        card.appendChild(el("div", { class: "codex-label" }, [ok ? e.label : t("profile.codex.locked")]));
        card.appendChild(el("div", { class: "codex-body" }, [ok ? e.body : t("profile.codex.locked_desc")]));
        if (ok) {
          const url = legifranceUrl(e.id);
          if (url) {
            card.appendChild(el("a", {
              class: "codex-legifrance-link",
              href: url, target: "_blank", rel: "noopener noreferrer",
            }, [t("codex.legifrance")]));
          }
          const moreBox = el("div", { class: "codex-more hidden" });
          const moreBtn = el("button", { class: "btn-secondary codex-more-btn", onclick: async () => {
            if (!Storage.getSettings().apiKey) {
              return toast(t("profile.codex.need_key"), "error", 4000);
            }
            moreBtn.disabled = true;
            moreBtn.textContent = t("profile.codex.consulting");
            moreBox.classList.remove("hidden");
            moreBox.textContent = "...";
            try {
              const text = await explainMore(e);
              moreBox.textContent = text;
              moreBtn.textContent = t("profile.codex.deepened");
            } catch (err) {
              moreBox.textContent = "⚠ " + (err.message || "Erreur");
              moreBtn.disabled = false;
              moreBtn.textContent = t("profile.codex.retry");
            }
          }}, [t("profile.codex.more")]);
          card.appendChild(moreBtn);
          card.appendChild(moreBox);
        }
        list.appendChild(card);
      });
    }
  }
  render("");

  root.appendChild(container);
}
