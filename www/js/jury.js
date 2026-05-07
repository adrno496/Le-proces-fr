// Twelve Angry Men — generates 12 distinct juror personae and their stances on a case.
// All local : personae are pre-defined archetypes. Their lean depends on case truth + their bias.

import { t } from "./i18n.js";

// 12 juror archetypes — each has a name placeholder, an emoji avatar, a persona, and a bias model.
// bias.guilty : tendency to lean guilty in ambiguous cases (-1.0 = always innocent, +1.0 = always guilty)
// bias.severity : if guilty, what severity bias (-2 lighter, +2 harsher)
// reactivity : how much the case truth influences them vs their dogma (0..1)
const JUROR_TEMPLATES = [
  { id: 1,  emoji: "👵", nameKey: "jury.j1.name",  styleKey: "jury.j1.style",  bias: { guilty:  0.30, severity:  0.5 }, reactivity: 0.7 },
  { id: 2,  emoji: "🧓", nameKey: "jury.j2.name",  styleKey: "jury.j2.style",  bias: { guilty:  0.50, severity:  1.0 }, reactivity: 0.5 },
  { id: 3,  emoji: "👨‍⚖", nameKey: "jury.j3.name",  styleKey: "jury.j3.style",  bias: { guilty:  0.10, severity:  0.0 }, reactivity: 0.9 },
  { id: 4,  emoji: "👩‍🎓", nameKey: "jury.j4.name",  styleKey: "jury.j4.style",  bias: { guilty: -0.30, severity: -1.0 }, reactivity: 0.8 },
  { id: 5,  emoji: "👨‍🔧", nameKey: "jury.j5.name",  styleKey: "jury.j5.style",  bias: { guilty:  0.15, severity:  0.5 }, reactivity: 0.6 },
  { id: 6,  emoji: "👩‍⚕", nameKey: "jury.j6.name",  styleKey: "jury.j6.style",  bias: { guilty:  0.00, severity: -0.5 }, reactivity: 0.7 },
  { id: 7,  emoji: "👨‍💼", nameKey: "jury.j7.name",  styleKey: "jury.j7.style",  bias: { guilty:  0.20, severity:  0.0 }, reactivity: 0.5 },
  { id: 8,  emoji: "👩‍🏫", nameKey: "jury.j8.name",  styleKey: "jury.j8.style",  bias: { guilty: -0.20, severity: -0.5 }, reactivity: 0.8 },
  { id: 9,  emoji: "🧑‍🎨", nameKey: "jury.j9.name",  styleKey: "jury.j9.style",  bias: { guilty: -0.40, severity: -1.0 }, reactivity: 0.6 },
  { id: 10, emoji: "👨‍🌾", nameKey: "jury.j10.name", styleKey: "jury.j10.style", bias: { guilty:  0.10, severity:  0.5 }, reactivity: 0.4 },
  { id: 11, emoji: "🧑‍🚀", nameKey: "jury.j11.name", styleKey: "jury.j11.style", bias: { guilty:  0.00, severity:  0.0 }, reactivity: 1.0 },
  { id: 12, emoji: "🧓", nameKey: "jury.j12.name",  styleKey: "jury.j12.style", bias: { guilty:  0.40, severity:  1.5 }, reactivity: 0.3 },
];

// Single-line statements per juror archetype. Up to 4 variants per stance (guilty/innocent/undecided).
// We use t(`jury.j{id}.line.{stance}.{i}`) to localize.
const STATEMENT_VARIANTS = [
  "guilty.0", "guilty.1", "innocent.0", "innocent.1", "undecided.0",
];

// Compute each juror's vote based on case truth + bias.
// truthScore = +1 (guilty) / -1 (innocent) / 0 (totally ambiguous)
// truthClarity 1..5 (5 = obvious)
function decideStance(juror, caseData) {
  const truthScore = caseData.truth === "guilty" ? +1 : -1;
  const clarity = (caseData.truthClarity || 3) / 5; // 0..1
  const bias = juror.bias.guilty;
  // weighted: reactivity × clarity × truthScore + (1 - reactivity*clarity) × bias
  const w = juror.reactivity * clarity;
  const lean = w * truthScore + (1 - w) * bias;
  if (lean > 0.15) return "guilty";
  if (lean < -0.15) return "innocent";
  return "undecided";
}

function pickStatement(juror, stance) {
  // 2 variants per stance to add variety
  const idx = (juror.id + stance.charCodeAt(0)) % 2;
  return t(`jury.j${juror.id}.line.${stance}.${idx}`);
}

export function buildJury(caseData) {
  return JUROR_TEMPLATES.map(j => {
    const stance = decideStance(j, caseData);
    return {
      id: j.id,
      emoji: j.emoji,
      name: t(j.nameKey),
      style: t(j.styleKey),
      stance,
      statement: pickStatement(j, stance),
      severityBias: j.bias.severity,
    };
  });
}

// Tally jury votes (without judge's vote).
export function tally(jury) {
  const votes = { guilty: 0, innocent: 0, undecided: 0 };
  jury.forEach(j => votes[j.stance]++);
  return votes;
}

export function juryVerdict(jury) {
  const v = tally(jury);
  if (v.guilty > v.innocent) return "guilty";
  if (v.innocent > v.guilty) return "innocent";
  return "undecided";
}
