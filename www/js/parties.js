// Recurring parties: same fictional characters return across cases with memory.

import { Storage } from "./storage.js";

const KEY = "parties";

const FIRST_NAMES_M = ["Antoine", "Bernard", "Claude", "David", "Édouard", "Fabrice", "Gérald", "Henri", "Igor", "Jérôme", "Karim", "Louis", "Marc", "Nicolas", "Olivier", "Pierre", "Quentin", "Romain", "Stéphane", "Thomas"];
const FIRST_NAMES_F = ["Aline", "Béatrice", "Camille", "Diane", "Élodie", "Florence", "Gabrielle", "Hélène", "Inès", "Julie", "Karine", "Laura", "Marine", "Nadia", "Olga", "Pauline", "Quentine", "Régine", "Sophie", "Tatiana"];
const LAST_NAMES = ["Dupont", "Martin", "Bernard", "Dubois", "Thomas", "Robert", "Richard", "Petit", "Moreau", "Laurent", "Simon", "Michel", "Lefèvre", "Leroy", "Roux", "David", "Bertrand", "Morel", "Fournier", "Girard", "Bonnet", "Dupuis", "Lambert", "Faure", "Rousseau", "Vincent", "Muller", "Henry", "Denis", "Lemoine"];

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function generateName() {
  const isF = Math.random() < 0.5;
  const first = rand(isF ? FIRST_NAMES_F : FIRST_NAMES_M);
  const last = rand(LAST_NAMES);
  return { first, last, civility: isF ? "Mme" : "M.", initials: `${isF ? "Mme" : "M."} ${last[0]}.` };
}

export function getRoster() {
  return Storage.getKey(KEY, { list: [] }).list;
}

// Pick an existing party (recidivist) with 25 % chance if any past loser exists, else create new.
export function pickOrCreateDefendant(category) {
  const roster = getRoster();
  const losers = roster.filter(p => p.lostCases.length > 0 && p.lostCases.some(c => c.category === category));
  let recurring = false;
  if (losers.length && Math.random() < 0.25) {
    return { ...losers[Math.floor(Math.random() * losers.length)], recurring: true };
  }
  const id = `p${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const name = generateName();
  const party = { id, ...name, lostCases: [], wonCases: [], firstSeen: new Date().toISOString().slice(0, 10), recurring };
  const data = Storage.getKey(KEY, { list: [] });
  data.list.unshift(party);
  if (data.list.length > 60) data.list = data.list.slice(0, 60);
  Storage.setKey(KEY, data);
  return party;
}

export function recordOutcome(partyId, caseDate, category, verdict, title) {
  const data = Storage.getKey(KEY, { list: [] });
  const idx = data.list.findIndex(p => p.id === partyId);
  if (idx < 0) return;
  const target = verdict === "guilty" ? "lostCases" : "wonCases";
  data.list[idx][target].push({ date: caseDate, category, title });
  if (data.list[idx][target].length > 10) data.list[idx][target] = data.list[idx][target].slice(-10);
  Storage.setKey(KEY, data);
}

export function flavorForReturning(party) {
  if (!party.recurring) return "";
  const losses = party.lostCases.length;
  const wins = party.wonCases.length;
  if (losses >= 2) return `${party.civility} ${party.last} comparaît à nouveau devant vous, après ${losses} condamnations dans des affaires similaires.`;
  if (wins >= 2) return `${party.civility} ${party.last} se présente avec assurance — vous l'avez relaxé(e) ${wins} fois auparavant.`;
  return `Vous reconnaissez ${party.civility} ${party.last} : un visage déjà croisé dans cette salle.`;
}
