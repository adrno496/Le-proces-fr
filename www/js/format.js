// Formatters: tokens, costs, dates.

export function formatTokens(n) {
  if (n == null || isNaN(n)) return "0";
  const x = Number(n);
  if (x >= 1_000_000) return (x / 1_000_000).toFixed(2) + "M";
  if (x >= 1_000) return (x / 1_000).toFixed(2) + "k";
  return String(Math.round(x));
}

export function formatCost(usd) {
  if (usd == null || isNaN(usd)) return "0$";
  if (usd === 0) return "0$";
  if (usd < 0.01) return "< 0.01$";
  if (usd < 1) return usd.toFixed(4) + "$";
  if (usd < 100) return usd.toFixed(2) + "$";
  return Math.round(usd) + "$";
}

// Day/month labels are translated via i18n.js
import { t, getLang } from "./i18n.js";

export function formatDate(dateStr) {
  // dateStr: "YYYY-MM-DD"
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  const dayName = t(`day.${dt.getUTCDay()}`);
  const monthName = t(`month.${m - 1}`);
  // EN: "Monday May 6, 2026" — FR: "Lundi 6 mai 2026"
  if (getLang() === "en") return `${dayName} ${monthName} ${d}, ${y}`;
  return `${dayName} ${d} ${monthName} ${y}`;
}

export function getTodayDateStr(now = new Date()) {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatRelativeDate(dateStr, today = getTodayDateStr()) {
  if (dateStr === today) return t("date.today");
  const [y1, m1, d1] = dateStr.split("-").map(Number);
  const [y2, m2, d2] = today.split("-").map(Number);
  const a = Date.UTC(y1, m1 - 1, d1);
  const b = Date.UTC(y2, m2 - 1, d2);
  const diffDays = Math.round((b - a) / 86400000);
  if (diffDays === 1) return t("date.yesterday");
  if (diffDays === 2) return t("date.day_before");
  if (diffDays > 2 && diffDays <= 7) return t("date.days_ago", { n: diffDays });
  return formatDate(dateStr);
}

export function dayOfYear(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const start = Date.UTC(y, 0, 0);
  const cur = Date.UTC(y, m - 1, d);
  return Math.floor((cur - start) / 86400000);
}

export function caseNumber(dateStr) {
  const [y] = dateStr.split("-");
  const doy = String(dayOfYear(dateStr)).padStart(3, "0");
  return `${y}-${doy}`;
}
