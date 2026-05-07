// 8 visual themes — names/desc translated per language.

import { t } from "./i18n.js";

const THEME_DEFS = [
  { id: "dark",        attr: "" },
  { id: "light",       attr: "light" },
  { id: "versailles",  attr: "versailles" },
  { id: "rome",        attr: "rome" },
  { id: "cyber",       attr: "cyber" },
  { id: "boreal",      attr: "boreal" },
  { id: "scriptorium", attr: "scriptorium" },
  { id: "old-bailey",  attr: "bailey" },
];

function buildThemes() {
  return THEME_DEFS.map(d => ({
    id: d.id, attr: d.attr,
    name: t(`theme.${d.id}`),
    desc: t(`theme.${d.id}.desc`),
  }));
}

export const THEMES = new Proxy([], {
  get(_t, prop) {
    const list = buildThemes();
    if (prop === "length") return list.length;
    if (prop === Symbol.iterator) return list[Symbol.iterator].bind(list);
    if (typeof prop === "string" && /^\d+$/.test(prop)) return list[+prop];
    if (Array.prototype[prop]) return Array.prototype[prop].bind(list);
    return list[prop];
  },
});

export function applyTheme(themeId) {
  const found = THEMES.find(x => x.id === themeId) || THEMES[0];
  if (typeof document === "undefined") return found;
  if (found.attr) document.documentElement.setAttribute("data-theme", found.attr);
  else document.documentElement.removeAttribute("data-theme");
  return found;
}
