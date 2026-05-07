// Rotating legal quotes shown at app start.

export const QUOTES = [
  { quote: "Mieux vaut hasarder de sauver un coupable que de condamner un innocent.", author: "Voltaire" },
  { quote: "La justice est la première vertu des institutions sociales.", author: "John Rawls" },
  { quote: "L'inégalité naît dans le silence des honnêtes gens.", author: "Martin Luther King" },
  { quote: "Quand la loi tarde, la justice meurt.", author: "Proverbe" },
  { quote: "Toute peine doit être proportionnée au délit.", author: "Cesare Beccaria" },
  { quote: "Le doute doit profiter à l'accusé.", author: "Maxime ancienne" },
  { quote: "Nul n'est censé ignorer la loi.", author: "Adage juridique" },
  { quote: "La justice sans la force est impuissante ; la force sans la justice est tyrannique.", author: "Pascal" },
  { quote: "Il vaut mieux mille fois prévenir que de guérir.", author: "Cesare Beccaria" },
  { quote: "Le souci de la justice est la première condition pour qu'il y ait de la justice.", author: "Robert Badinter" },
  { quote: "La loi est l'expression de la volonté générale.", author: "Article 6 DDHC" },
  { quote: "Aucun homme ne peut être détenu sans cause.", author: "Habeas Corpus 1679" },
  { quote: "La liberté consiste à pouvoir faire tout ce qui ne nuit pas à autrui.", author: "Article 4 DDHC" },
  { quote: "Le juge doit être passif comme la balance.", author: "Montesquieu" },
  { quote: "Justice retardée est justice refusée.", author: "Adage anglo-saxon" },
  { quote: "La meilleure des constitutions est celle qu'on respecte.", author: "Tocqueville" },
  { quote: "Les lois sont comme les toiles d'araignée : les grosses mouches passent, les petites s'y prennent.", author: "Solon" },
  { quote: "La conscience est le meilleur juge.", author: "Sénèque" },
  { quote: "L'erreur judiciaire est le plus grand échec d'une démocratie.", author: "Robert Badinter" },
  { quote: "On reconnaît une société à la manière dont elle traite ses prisonniers.", author: "Dostoïevski" },
];

export function quoteOfTheSession() {
  // Randomized at session start, not deterministic by date — feels fresh
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}
