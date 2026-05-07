// Historic calendar — "On this day in legal history..." entries.
// Format: { day: "MM-DD", year: 1789, title, body }

export const HISTORIC_DAYS = [
  { day: "08-26", year: 1789, title: "Déclaration des Droits de l'Homme", body: "L'Assemblée nationale adopte la Déclaration des droits de l'homme et du citoyen — fondement constitutionnel français." },
  { day: "10-04", year: 1958, title: "Constitution de la Vᵉ République", body: "Adoption par référendum de la nouvelle constitution sous De Gaulle." },
  { day: "10-09", year: 1981, title: "Abolition de la peine de mort", body: "Le Parlement vote l'abolition de la peine capitale (loi Badinter)." },
  { day: "01-21", year: 1793, title: "Exécution de Louis XVI", body: "Le roi est guillotiné — exécution emblématique du basculement révolutionnaire." },
  { day: "07-13", year: 1906, title: "Réhabilitation de Dreyfus", body: "La Cour de cassation casse la condamnation de Dreyfus." },
  { day: "11-04", year: 1950, title: "Convention européenne droits homme", body: "Signature à Rome de la CESDH par 12 États fondateurs." },
  { day: "07-17", year: 1789, title: "Suppression des privilèges", body: "L'Assemblée constituante abolit les privilèges féodaux dans la nuit du 4 août." },
  { day: "03-21", year: 1804, title: "Code civil promulgué", body: "Napoléon promulgue le Code civil, modèle de tous les codes civils ultérieurs." },
  { day: "12-10", year: 1948, title: "Déclaration universelle des droits humains", body: "Adoption par l'ONU à Paris (palais de Chaillot)." },
  { day: "06-04", year: 1958, title: "Loi de Roland Lecanuet", body: "Réforme constitutionnelle préparant la Vᵉ République." },
  { day: "07-04", year: 1776, title: "Déclaration d'indépendance USA", body: "Document fondateur du droit constitutionnel américain." },
  { day: "06-15", year: 1215, title: "Magna Carta scellée", body: "Le roi Jean d'Angleterre scelle la Grande Charte — embryon du droit constitutionnel anglo-saxon." },
  { day: "05-08", year: 1945, title: "Capitulation nazie — préparation Nuremberg", body: "Reddition allemande, ouvrant la voie aux procès de Nuremberg pour crimes contre l'humanité." },
  { day: "11-20", year: 1945, title: "Ouverture des procès de Nuremberg", body: "Premier procès international contre les hauts dignitaires nazis." },
  { day: "07-23", year: 1996, title: "Affaire Pretty c. RU", body: "Décision CEDH sur le droit à l'autonomie de fin de vie." },
  { day: "01-07", year: 2015, title: "Liberté de la presse menacée", body: "Attentats Charlie Hebdo, ravivent le débat sur la liberté d'expression." },
  { day: "11-09", year: 1989, title: "Chute du mur de Berlin", body: "Fin du droit autoritaire est-allemand ; basculement vers l'État de droit." },
  { day: "03-08", year: 1857, title: "Première manifestation pour droits femmes", body: "Origine des journées internationales pour les droits des femmes." },
  { day: "06-04", year: 1989, title: "Tian'anmen", body: "Répression — débat international sur droits de l'homme." },
  { day: "12-09", year: 1948, title: "Convention contre le génocide", body: "ONU adopte la convention pour la prévention et la répression du génocide." },
];

// Today's entry (matches current MM-DD), or null.
export function todaysEntry(now = new Date()) {
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const key = `${mm}-${dd}`;
  return HISTORIC_DAYS.find(d => d.day === key) || null;
}
