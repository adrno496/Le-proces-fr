// 8 visual themes for the tribunal interior.

export const THEMES = [
  { id: "dark",        name: "Nuit profonde",        attr: "",            desc: "Le défaut. Sobre, dramatique." },
  { id: "light",       name: "Salle d'audience",     attr: "light",       desc: "Plus clair, ambiance jour." },
  { id: "versailles",  name: "Cour de Versailles",   attr: "versailles",  desc: "Or, blanc, dorures monarchiques." },
  { id: "rome",        name: "Forum romain",         attr: "rome",        desc: "Marbre, terracotta, poussière antique." },
  { id: "cyber",       name: "Tribunal cyberpunk",   attr: "cyber",       desc: "Néon violet, métal froid." },
  { id: "boreal",      name: "Cour boréale",         attr: "boreal",      desc: "Bleus glacés, blancs lunaires." },
  { id: "scriptorium", name: "Scriptorium monacal",  attr: "scriptorium", desc: "Parchemin, encre brune, manuscrits." },
  { id: "old-bailey",  name: "Old Bailey",           attr: "bailey",      desc: "Acajou anglais, cuir vert, bibliothèque." },
];

export function applyTheme(themeId) {
  const t = THEMES.find(x => x.id === themeId) || THEMES[0];
  if (typeof document === "undefined") return t;
  if (t.attr) document.documentElement.setAttribute("data-theme", t.attr);
  else document.documentElement.removeAttribute("data-theme");
  return t;
}
