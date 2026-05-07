// Activity heatmap — 12 last weeks × 7 days, like GitHub.

import { Storage } from "./storage.js";

function dateOnly(d) {
  const dt = new Date(d);
  dt.setHours(0, 0, 0, 0);
  return dt;
}

function dayKey(d) {
  return d.toISOString().slice(0, 10);
}

// Returns { cells: [{ key, count, level (0..4) }], totalDays }
export async function computeHeatmap() {
  const verdicts = await Storage.getAllVerdicts();
  // Index verdicts by date — including free / historic verdicts is debatable;
  // here we count any saved daily verdict in IDB. Free hearings are not in IDB.
  // We approximate: also count totalVerdicts contributions via the daily verdicts.
  const counts = new Map();
  verdicts.forEach(v => counts.set(v.date, (counts.get(v.date) || 0) + 1));

  // 12 weeks × 7 days, ending today
  const today = dateOnly(new Date());
  const totalDays = 12 * 7;
  const cells = [];
  let max = 0;
  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const k = dayKey(d);
    const c = counts.get(k) || 0;
    if (c > max) max = c;
    cells.push({ key: k, date: d, count: c });
  }
  // Compute levels 0..4 based on max
  cells.forEach(cell => {
    if (cell.count === 0) cell.level = 0;
    else if (max <= 1) cell.level = 4;
    else if (cell.count >= max) cell.level = 4;
    else if (cell.count >= max * 0.66) cell.level = 3;
    else if (cell.count >= max * 0.33) cell.level = 2;
    else cell.level = 1;
  });
  return { cells, totalDays, max };
}
