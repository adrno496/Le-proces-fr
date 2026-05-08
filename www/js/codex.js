// Legal codex: collection of articles & legal terms unlocked through play.

import { Storage } from "./storage.js";

// Map from codex id → Légifrance URL when the article exists publicly.
// Format URL: https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI...
// We provide a search URL when we don't know the exact LEGIARTI id (still works).
const LEGIFRANCE_BASE = "https://www.legifrance.gouv.fr/search/all?searchField=ALL&query=";
function legifranceFor(id) {
  // Map common ids → search query
  const map = {
    "cp-311-1":   "Article 311-1 Code pénal",
    "cp-122-7":   "Article 122-7 Code pénal",
    "cp-121-3":   "Article 121-3 Code pénal",
    "cp-122-5":   "Article 122-5 Code pénal",
    "cp-222-13":  "Article 222-13 Code pénal",
    "cp-321-1":   "Article 321-1 Code pénal",
    "cp-433-5":   "Article 433-5 Code pénal",
    "cp-441-1":   "Article 441-1 Code pénal",
    "cp-223-6":   "Article 223-6 Code pénal",
    "cp-313-1":   "Article 313-1 Code pénal",
    "cp-226-4-1": "Article 226-4-1 Code pénal",
    "cc-1240":    "Article 1240 Code civil",
    "cc-1242":    "Article 1242 Code civil",
    "cc-1103":    "Article 1103 Code civil",
    "cc-1112-1":  "Article 1112-1 Code civil",
    "cc-1641":    "Article 1641 Code civil",
    "cc-1359":    "Article 1359 Code civil",
    "cc-815":     "Article 815 Code civil",
    "cc-832":     "Article 832 Code civil",
    "cc-1247":    "Article 1247 Code civil",
    "cc-373-2-11": "Article 373-2-11 Code civil",
    "cc-371-2":   "Article 371-2 Code civil",
    "cc-360":     "Article 360 Code civil",
    "cc-361":     "Article 361 Code civil",
    "cc-901":     "Article 901 Code civil",
    "cc-909":     "Article 909 Code civil",
    "ct-l1121-1": "Article L1121-1 Code travail",
    "ct-l1232-1": "Article L1232-1 Code travail",
    "ct-l1152-1": "Article L1152-1 Code travail",
    "ct-l1226-2": "Article L1226-2 Code travail",
    "ct-l1237-11":"Article L1237-11 Code travail",
    "ccons-l217-7":  "Article L217-7 Code consommation",
    "ccons-l212-1":  "Article L212-1 Code consommation",
    "ccons-l221-18": "Article L221-18 Code consommation",
    "ccons-l216-1":  "Article L216-1 Code consommation",
    "ccons-l341-1":  "Article L341-1 Code consommation",
    "ccons-l113-8":  "Article L113-8 Code construction habitation",
    "cr-r415-5":  "Article R415-5 Code route",
    "cr-r415-7":  "Article R415-7 Code route",
    "cr-l231-1":  "Article L231-1 Code route",
    "cr-l235-1":  "Article L235-1 Code route",
    "cr-l324-2":  "Article L324-2 Code route",
    "cenv-l216-6": "Article L216-6 Code environnement",
    "cenv-l411-1": "Article L411-1 Code environnement",
    "cpi-l335-3": "Article L335-3 Code propriété intellectuelle",
    "cpi-l112-1": "Article L112-1 Code propriété intellectuelle",
    "cpi-l122-5": "Article L122-5 Code propriété intellectuelle",
    "cpi-l713-2": "Article L713-2 Code propriété intellectuelle",
    "cmf-l133-19": "Article L133-19 Code monétaire financier",
    "loi-1989-6": "Article 6 loi 6 juillet 1989",
    "loi-2021-29": "Loi 29 janvier 2021 patrimoine sensoriel",
    "rgpd-6":     "Article 6 RGPD règlement 2016/679",
    "rgpd-7":     "Article 7 RGPD règlement 2016/679",
    "lcen-6":     "Article 6 loi confiance économie numérique",
  };
  if (map[id]) return LEGIFRANCE_BASE + encodeURIComponent(map[id]);
  return null;
}

// Curated set of legal entries (articles + notions) — pedagogical companion to the cases.
export const CODEX_ENTRIES = [
  // ===== Pénal =====
  { id: "cp-311-1",   code: "Pénal", label: "Article 311-1 (Vol)",                  body: "Le vol est la soustraction frauduleuse de la chose d'autrui. La frauduleuse signifie ici contre la volonté du légitime propriétaire." },
  { id: "cp-122-7",   code: "Pénal", label: "Article 122-7 (État de nécessité)",    body: "N'est pas pénalement responsable la personne qui, face à un danger actuel ou imminent qui menace elle-même, autrui ou un bien, accomplit un acte nécessaire à la sauvegarde, sauf disproportion entre les moyens employés et la gravité de la menace." },
  { id: "cp-121-3",   code: "Pénal", label: "Article 121-3 (Élément moral)",        body: "Il n'y a point de crime ou de délit sans intention de le commettre. Toutefois, il y a délit en cas d'imprudence, de négligence ou de manquement à une obligation de prudence ou de sécurité prévue par la loi." },
  { id: "cp-122-5",   code: "Pénal", label: "Article 122-5 (Légitime défense)",     body: "N'est pas pénalement responsable la personne qui, devant une atteinte injustifiée envers elle-même ou autrui, accomplit un acte commandé par la nécessité de la légitime défense, sauf disproportion entre les moyens et l'atteinte." },
  { id: "cp-222-13",  code: "Pénal", label: "Article 222-13 (Violences avec ITT)",  body: "Les violences ayant entraîné une incapacité de travail inférieure ou égale à 8 jours, ou aucune incapacité, sont punies de 3 ans d'emprisonnement et 45 000 € d'amende lorsqu'elles sont commises avec circonstances aggravantes." },
  { id: "cp-321-1",   code: "Pénal", label: "Article 321-1 (Recel)",                body: "Le recel est le fait de dissimuler, de détenir ou de transmettre une chose, ou de faire office d'intermédiaire afin de la transmettre, en sachant qu'elle provient d'un crime ou d'un délit." },
  { id: "cp-433-5",   code: "Pénal", label: "Article 433-5 (Outrage)",              body: "Constituent un outrage les paroles, gestes ou menaces, écrits ou images de toute nature non rendus publics, adressés à une personne chargée d'une mission de service public, dans l'exercice de ses fonctions." },
  { id: "cp-441-1",   code: "Pénal", label: "Article 441-1 (Faux et usage)",        body: "Constitue un faux toute altération frauduleuse de la vérité, de nature à causer un préjudice et accomplie par quelque moyen que ce soit, dans un écrit ou tout autre support d'expression de la pensée." },
  { id: "cp-223-6",   code: "Pénal", label: "Article 223-6 (Non-assistance)",       body: "Quiconque pouvant empêcher par son action immédiate, sans risque pour lui ou pour les tiers, soit un crime, soit un délit contre l'intégrité corporelle de la personne s'abstient volontairement de le faire est puni." },
  { id: "cp-313-1",   code: "Pénal", label: "Article 313-1 (Escroquerie)",          body: "L'escroquerie est le fait, soit par l'usage d'un faux nom ou d'une fausse qualité, soit par l'abus d'une qualité vraie, soit par l'emploi de manœuvres frauduleuses, de tromper une personne." },
  // ===== Civil =====
  { id: "cc-1240",    code: "Civil", label: "Article 1240 (Responsabilité civile)", body: "Tout fait quelconque de l'homme, qui cause à autrui un dommage, oblige celui par la faute duquel il est arrivé à le réparer. Trois conditions : faute, dommage, lien de causalité." },
  { id: "cc-1242",    code: "Civil", label: "Article 1242 (Fait des choses)",       body: "On est responsable non seulement du dommage que l'on cause par son propre fait, mais encore de celui qui est causé par le fait des personnes dont on doit répondre, ou des choses que l'on a sous sa garde." },
  { id: "cc-1103",    code: "Civil", label: "Article 1103 (Force obligatoire)",     body: "Les contrats légalement formés tiennent lieu de loi à ceux qui les ont faits. Pacta sunt servanda — pierre angulaire du droit des contrats." },
  { id: "cc-1112-1",  code: "Civil", label: "Article 1112-1 (Information précontractuelle)", body: "Celle des parties qui connaît une information dont l'importance est déterminante pour le consentement de l'autre doit l'en informer dès lors que cette dernière, légitimement, ignore cette information." },
  { id: "cc-1641",    code: "Civil", label: "Article 1641 (Vice caché)",            body: "Le vendeur est tenu de la garantie à raison des défauts cachés de la chose vendue qui la rendent impropre à l'usage auquel on la destine, ou qui diminuent tellement cet usage que l'acheteur ne l'aurait pas acquise." },
  { id: "cc-1359",    code: "Civil", label: "Article 1359 (Preuve écrite >1500€)",  body: "L'acte juridique portant sur une somme excédant un montant fixé par décret (1 500 €) doit être prouvé par écrit sous signature privée ou authentique." },
  { id: "cc-815",     code: "Civil", label: "Article 815 (Sortie d'indivision)",    body: "Nul ne peut être contraint à demeurer dans l'indivision et le partage peut toujours être provoqué, à moins qu'il n'y ait été sursis par jugement ou convention." },
  { id: "cc-832",     code: "Civil", label: "Article 832 (Attribution préférentielle)", body: "Le conjoint survivant ou tout héritier copropriétaire peut demander l'attribution préférentielle, par voie de partage, de toute entreprise, ou de toute exploitation à laquelle il participe ou aura participé effectivement." },
  // ===== Famille =====
  { id: "cc-373-2-11", code: "Famille", label: "Article 373-2-11 (Intérêt de l'enfant)", body: "Lorsqu'il se prononce sur les modalités d'exercice de l'autorité parentale, le juge prend en considération : la pratique suivie, les sentiments exprimés par l'enfant, l'aptitude de chacun à respecter les droits de l'autre, et tout élément utile." },
  { id: "cc-371-2",    code: "Famille", label: "Article 371-2 (Contribution parentale)", body: "Chacun des parents contribue à l'entretien et à l'éducation des enfants à proportion de ses ressources, de celles de l'autre parent, ainsi que des besoins de l'enfant." },
  { id: "cc-360",      code: "Famille", label: "Article 360 (Adoption simple)",       body: "L'adoption simple est permise, quel que soit l'âge de l'adopté, s'il y a juste motif et notamment en cas d'adoption de l'enfant du conjoint." },
  { id: "cc-361",      code: "Famille", label: "Article 361 (Consentement adopté)",   body: "Si l'adopté est âgé de plus de treize ans, son consentement personnel à l'adoption simple est nécessaire." },
  { id: "cc-901",      code: "Famille", label: "Article 901 (Saine raison)",          body: "Pour faire une libéralité, il faut être sain d'esprit. La libéralité est nulle lorsque le consentement a été vicié par l'erreur, le dol ou la violence." },
  { id: "cc-909",      code: "Famille", label: "Article 909 (Captation médicale)",    body: "Les membres des professions médicales ne peuvent profiter des dispositions à leur faveur faites par leur patient pendant la maladie dont il est mort, hors quelques exceptions." },
  // ===== Travail =====
  { id: "ct-l1121-1", code: "Travail", label: "Article L1121-1 (Liberté individuelle)", body: "Nul ne peut apporter aux droits des personnes et aux libertés individuelles et collectives de restrictions qui ne seraient pas justifiées par la nature de la tâche à accomplir ni proportionnées au but recherché." },
  { id: "ct-l1232-1", code: "Travail", label: "Article L1232-1 (Cause réelle et sérieuse)", body: "Tout licenciement pour motif personnel doit être justifié par une cause réelle et sérieuse. Cette cause repose sur des faits objectifs, vérifiables et imputables au salarié." },
  { id: "ct-l1152-1", code: "Travail", label: "Article L1152-1 (Harcèlement moral)",  body: "Aucun salarié ne doit subir les agissements répétés de harcèlement moral qui ont pour objet ou pour effet une dégradation de ses conditions de travail susceptible de porter atteinte à ses droits, sa dignité, sa santé." },
  { id: "ct-l1226-2", code: "Travail", label: "Article L1226-2 (Reclassement)",       body: "Lorsque le salarié déclaré inapte par le médecin du travail est reconnu tel à la suite d'un accident ou d'une maladie non professionnels, l'employeur doit lui proposer un autre emploi approprié à ses capacités." },
  { id: "ct-l1237-11", code: "Travail", label: "Article L1237-11 (Rupture conventionnelle)", body: "L'employeur et le salarié peuvent convenir des conditions de la rupture du contrat de travail qui les lie. Elle résulte d'une convention signée par les parties au contrat." },
  // ===== Consommation =====
  { id: "ccons-l217-7", code: "Conso.", label: "Article L217-7 (Présomption antériorité)", body: "Les défauts de conformité qui apparaissent dans un délai de vingt-quatre mois à partir de la délivrance du bien sont présumés exister au moment de la délivrance, sauf preuve contraire." },
  { id: "ccons-l212-1", code: "Conso.", label: "Article L212-1 (Clauses abusives)",   body: "Sont abusives les clauses qui ont pour objet ou pour effet de créer, au détriment du non-professionnel ou du consommateur, un déséquilibre significatif entre les droits et obligations des parties." },
  { id: "ccons-l221-18", code: "Conso.", label: "Article L221-18 (Rétractation)",     body: "Le consommateur dispose d'un délai de quatorze jours pour exercer son droit de rétractation d'un contrat conclu à distance, à la suite d'un démarchage téléphonique ou hors établissement." },
  { id: "ccons-l216-1", code: "Conso.", label: "Article L216-1 (Délai de livraison)", body: "Le professionnel livre le bien ou fournit le service à la date ou dans le délai indiqué au consommateur, ou à défaut, sans retard injustifié et au plus tard 30 jours après la conclusion du contrat." },
  { id: "ccons-l341-1", code: "Conso.", label: "Article L341-1 (Sanction TAEG)",      body: "En cas d'absence d'indication ou d'indication erronée du TAEG dans une offre de prêt, le prêteur peut être déchu du droit aux intérêts en totalité ou dans la proportion fixée par le juge." },
  // ===== RGPD / Numérique =====
  { id: "rgpd-6",     code: "RGPD",     label: "Article 6 RGPD (Licéité)",            body: "Le traitement n'est licite que si l'une des bases existe : consentement, exécution d'un contrat, obligation légale, intérêts vitaux, mission d'intérêt public, intérêts légitimes du responsable de traitement." },
  { id: "rgpd-7",     code: "RGPD",     label: "Article 7 RGPD (Consentement)",       body: "Lorsque le traitement repose sur le consentement, le responsable doit être en mesure de démontrer que la personne a donné son consentement libre, spécifique, éclairé et univoque." },
  { id: "cp-226-4-1", code: "Numérique", label: "Article 226-4-1 (Usurpation identité)", body: "Le fait d'usurper l'identité d'un tiers ou de faire usage d'une ou plusieurs données permettant de l'identifier en vue de troubler sa tranquillité ou celle d'autrui est puni d'un an et 15 000 € d'amende." },
  { id: "cmf-l133-19", code: "Bancaire", label: "Article L133-19 (Phishing & banque)",  body: "En cas d'opération non autorisée, l'utilisateur est remboursé immédiatement par sa banque, sauf si elle prouve la fraude ou la négligence grave de l'utilisateur. La preuve incombe à la banque." },
  { id: "lcen-6",     code: "Numérique", label: "Loi LCEN art. 6 (Hébergeurs)",        body: "Les hébergeurs ne sont pas soumis à une obligation générale de surveillance des informations qu'ils transmettent ou stockent, mais doivent retirer promptement les contenus manifestement illicites notifiés." },
  // ===== Routier =====
  { id: "cr-r415-5",  code: "Routier", label: "Article R415-5 (Priorité à droite)",  body: "Tout conducteur abordant une intersection doit céder le passage aux véhicules venant de sa droite. Cette règle ne s'applique pas si une signalisation contraire est mise en place." },
  { id: "cr-r415-7",  code: "Routier", label: "Article R415-7 (Feu défaillant)",     body: "Lorsqu'un feu de signalisation est en panne ou clignotant, les règles de priorité ordinaires (priorité à droite) s'appliquent à nouveau, sauf signalisation au sol." },
  { id: "cr-l231-1",  code: "Routier", label: "Article L231-1 (Délit de fuite)",     body: "Le fait pour tout conducteur d'un véhicule qui, sachant qu'il vient de causer ou d'occasionner un accident, ne s'arrête pas et tente d'échapper à la responsabilité, est puni de 3 ans d'emprisonnement." },
  { id: "cr-l235-1",  code: "Routier", label: "Article L235-1 (Stupéfiants)",        body: "Toute personne qui conduit un véhicule alors qu'il résulte d'une analyse qu'elle a fait usage de stupéfiants est punie de 2 ans d'emprisonnement et 4 500 € d'amende." },
  { id: "cr-l324-2",  code: "Routier", label: "Article L324-2 (Sans assurance)",     body: "Le fait de conduire sans être couvert par une assurance garantissant la responsabilité civile est puni de 3 750 € d'amende, suspension de permis et confiscation possibles." },
  // ===== Environnement / Logement / Voisinage =====
  { id: "loi-1989-6", code: "Logement", label: "Loi 6 juillet 1989, art. 6 (Décence)", body: "Le bailleur est tenu de remettre au locataire un logement décent ne laissant pas apparaître de risques manifestes pouvant porter atteinte à la sécurité physique ou à la santé." },
  { id: "ccons-l113-8", code: "Voisinage", label: "Article L113-8 CCH (Pré-occupation)", body: "Les nuisances dues à des activités préexistantes, conformes à la réglementation en vigueur, ne peuvent donner lieu à indemnité au profit de personnes installées postérieurement." },
  { id: "loi-2021-29", code: "Patrimoine", label: "Loi 29 janv. 2021 (Sons des campagnes)", body: "Les sons et odeurs caractéristiques des espaces naturels et ruraux constituent le patrimoine sensoriel commun de la Nation, opposable à toute action en trouble anormal de voisinage." },
  { id: "cenv-l216-6", code: "Environnement", label: "Article L216-6 (Pollution eaux)", body: "Le fait de jeter, déverser ou laisser s'écouler dans les eaux toute substance dont l'action ou les réactions ont entraîné des effets nuisibles est puni de 2 ans d'emprisonnement et 75 000 € d'amende." },
  { id: "cenv-l411-1", code: "Environnement", label: "Article L411-1 (Espèces protégées)", body: "Sont interdites la destruction d'animaux d'espèces protégées, la perturbation intentionnelle, ainsi que la destruction, l'altération ou la dégradation de leurs habitats." },
  { id: "cc-1247",    code: "Environnement", label: "Article 1247 (Préjudice écologique)", body: "Est réparable le préjudice écologique consistant en une atteinte non négligeable aux éléments ou aux fonctions des écosystèmes ou aux bénéfices collectifs tirés par l'homme de l'environnement." },
  // ===== Propriété intellectuelle =====
  { id: "cpi-l335-3", code: "Prop. intel.", label: "Article L335-3 CPI (Contrefaçon)",   body: "Est délit de contrefaçon toute reproduction, représentation ou diffusion, par quelque moyen que ce soit, d'une œuvre de l'esprit en violation des droits de l'auteur." },
  { id: "cpi-l112-1", code: "Prop. intel.", label: "Article L112-1 CPI (Originalité)",   body: "Sont protégées les œuvres de l'esprit, quels qu'en soient le genre, la forme d'expression, le mérite ou la destination — à condition qu'elles présentent une originalité, empreinte de la personnalité de l'auteur." },
  { id: "cpi-l122-5", code: "Prop. intel.", label: "Article L122-5 CPI (Exceptions)",    body: "L'auteur ne peut interdire les copies ou reproductions strictement réservées à l'usage privé, ni les courtes citations justifiées par le caractère critique, polémique, pédagogique, scientifique ou d'information." },
  { id: "cpi-l713-2", code: "Prop. intel.", label: "Article L713-2 CPI (Marque)",        body: "L'usage d'une marque déposée par un tiers est interdit sans l'autorisation du titulaire, sauf usage purement descriptif ou exceptions de référencement loyales." },
  // ===== Procédure et notions transverses =====
  { id: "concept-doute",      code: "Notion", label: "Doute raisonnable",            body: "Tout doute raisonnable doit profiter à l'accusé. C'est un principe-clef du procès pénal moderne, expression de la présomption d'innocence." },
  { id: "concept-charge",     code: "Notion", label: "Charge de la preuve",          body: "C'est à celui qui invoque un fait de le prouver (« actori incumbit probatio »). En droit pénal, l'accusation supporte intégralement cette charge." },
  { id: "concept-prop",       code: "Notion", label: "Proportionnalité",             body: "Toute restriction de droit doit être strictement proportionnée à l'objectif légitime poursuivi. Test classique : nécessité, adéquation, proportionnalité au sens strict." },
  { id: "concept-equite",     code: "Notion", label: "Équité",                       body: "Au-delà du droit strict, le juge tempère parfois la rigueur de la loi pour préserver le sens de la justice. Pratique encadrée — le juge n'est pas législateur." },
  { id: "concept-contradictoire", code: "Notion", label: "Principe du contradictoire", body: "Aucune partie ne peut être jugée sans avoir été mise à même de discuter les éléments retenus contre elle. Pilier de l'État de droit (article 6 CESDH)." },
  { id: "concept-impartialite",   code: "Notion", label: "Impartialité du juge",      body: "Le juge ne doit avoir aucun intérêt dans la cause et apparaître objectivement neutre — impartialité subjective et objective (CEDH)." },
  { id: "concept-fumus",      code: "Notion", label: "Fumus boni juris",             body: "« L'apparence du bon droit ». Standard de preuve allégé pour des mesures provisoires (référé) — il suffit qu'une demande paraisse plausible." },
  { id: "concept-aliquid",    code: "Notion", label: "Adage : nemo auditur",         body: "« Nul ne peut se prévaloir de sa propre turpitude. » L'auteur d'une faute ne peut en tirer un avantage juridique." },
  { id: "concept-resjudicata", code: "Notion", label: "Autorité de la chose jugée",  body: "Une décision définitive ne peut être rejugée — protection de la sécurité juridique. Trois identités requises : objet, cause, parties." },
  { id: "concept-prescr",     code: "Notion", label: "Prescription",                 body: "Délai au-delà duquel une action ne peut plus être intentée. Variable : 30 ans (acquisitive immobilière), 5 ans (civile commune), 10 ans (crime), 20 ans (crime contre humanité — imprescriptible en France)." },
  { id: "concept-resjudicata2", code: "Notion", label: "Lex specialis",              body: "« La loi spéciale déroge à la loi générale ». Quand deux normes s'opposent, la plus précise s'applique en priorité." },
  { id: "concept-non-bis",    code: "Notion", label: "Non bis in idem",              body: "Nul ne peut être poursuivi ou puni deux fois pour le même fait (article 4 du Protocole 7 CESDH). Principe fondamental du droit pénal." },
  // ===== Histoire du droit =====
  { id: "hist-codecivil", code: "Histoire", label: "Code civil 1804 (Napoléon)",     body: "Le Code civil de 1804 a unifié le droit privé français autour de la liberté contractuelle, la propriété individuelle, et la famille — base de tous les codes civils modernes du monde." },
  { id: "hist-cesdh",     code: "Histoire", label: "CESDH (1950)",                    body: "Convention européenne des droits de l'Homme, signée 1950 — accès au juge, procès équitable, vie privée, liberté d'expression. Cour à Strasbourg." },
  { id: "hist-1789",      code: "Histoire", label: "Déclaration des droits 1789",     body: "« Les hommes naissent et demeurent libres et égaux en droits. » 17 articles — fondement constitutionnel français à valeur normative depuis 1971." },
  { id: "hist-leonetti",  code: "Histoire", label: "Loi Leonetti (2005)",             body: "Loi sur la fin de vie — interdit l'obstination déraisonnable, autorise l'arrêt des soins, encadre la sédation profonde. Modifiée en 2016 (Claeys-Leonetti)." },
  { id: "hist-1881",      code: "Histoire", label: "Loi 1881 (presse)",               body: "Loi sur la liberté de la presse — fonde le régime de la diffamation, de l'injure, de la provocation. Procédure spéciale exigeante (citation précise, prescription 3 mois)." },
  { id: "hist-1980",      code: "Histoire", label: "Loi du 23 décembre 1980 (viol)",  body: "Loi qui requalifie le viol en crime (cour d'assises) et étend la définition pour intégrer toute pénétration de toute nature, sur autrui ou sur soi-même." },
  // ====== Étoffement vers 200 entrées ======
  // Pénal supplémentaire
  { id: "cp-132-72",  code: "Pénal", label: "Article 132-72 (Préméditation)", body: "La préméditation est le dessein formé avant l'action de commettre un crime ou un délit déterminé." },
  { id: "cp-225-1",   code: "Pénal", label: "Article 225-1 (Discrimination)", body: "Constitue une discrimination toute distinction opérée entre les personnes physiques sur le fondement de leur origine, sexe, situation de famille, état de santé, religion, etc." },
  { id: "cp-227-1",   code: "Pénal", label: "Article 227-1 (Délaissement de mineur)", body: "Le délaissement d'un mineur de quinze ans est puni de sept ans d'emprisonnement et 100 000 euros d'amende." },
  { id: "cp-322-1",   code: "Pénal", label: "Article 322-1 (Destruction de biens)", body: "La destruction, dégradation ou détérioration d'un bien appartenant à autrui est punie de 30 000 euros d'amende et deux ans d'emprisonnement." },
  { id: "cp-432-11",  code: "Pénal", label: "Article 432-11 (Corruption passive)", body: "Le fait, par une personne dépositaire de l'autorité publique, de solliciter ou agréer des dons est puni de dix ans et d'une amende d'un million d'euros." },
  { id: "cp-433-2",   code: "Pénal", label: "Article 433-2 (Corruption active)", body: "Le fait, par une personne, de proposer ou de céder à toute sollicitation est puni de dix ans d'emprisonnement et d'une amende d'un million d'euros." },
  { id: "cp-222-22",  code: "Pénal", label: "Article 222-22 (Agression sexuelle)", body: "Constitue une agression sexuelle toute atteinte sexuelle commise avec violence, contrainte, menace ou surprise." },
  { id: "cp-223-1",   code: "Pénal", label: "Article 223-1 (Mise en danger)", body: "Le fait d'exposer directement autrui à un risque immédiat de mort ou de blessures par la violation manifestement délibérée d'une obligation est puni d'un an et 15 000 euros." },
  { id: "cp-323-1",   code: "Pénal", label: "Article 323-1 (Cybercriminalité)", body: "Le fait d'accéder ou de se maintenir frauduleusement dans un système de traitement automatisé de données est puni de trois ans et 100 000 euros." },
  { id: "cp-450-1",   code: "Pénal", label: "Article 450-1 (Association de malfaiteurs)", body: "Constitue une association de malfaiteurs tout groupement formé en vue de la préparation d'un ou plusieurs crimes." },

  // Civil supplémentaire
  { id: "cc-9",       code: "Civil", label: "Article 9 (Vie privée)", body: "Chacun a droit au respect de sa vie privée. Les juges peuvent prescrire toutes mesures pour empêcher ou faire cesser une atteinte." },
  { id: "cc-1101",    code: "Civil", label: "Article 1101 (Définition contrat)", body: "Le contrat est un accord de volontés entre deux ou plusieurs personnes destiné à créer, modifier, transmettre ou éteindre des obligations." },
  { id: "cc-1109",    code: "Civil", label: "Article 1109 (Vices du consentement)", body: "Il n'y a point de consentement valable si le consentement n'a été donné que par erreur, ou s'il a été extorqué par violence ou surpris par dol." },
  { id: "cc-1131",    code: "Civil", label: "Article 1131 (Cause illicite)", body: "L'obligation sans cause, ou sur une fausse cause, ou sur une cause illicite, ne peut avoir aucun effet." },
  { id: "cc-1217",    code: "Civil", label: "Article 1217 (Inexécution contractuelle)", body: "La partie envers laquelle l'engagement n'a pas été exécuté peut refuser ou suspendre son obligation, demander l'exécution forcée, obtenir réduction du prix, résoudre le contrat." },
  { id: "cc-2224",    code: "Civil", label: "Article 2224 (Prescription)", body: "Les actions personnelles ou mobilières se prescrivent par cinq ans à compter du jour où le titulaire a connu les faits." },
  { id: "cc-2232",    code: "Civil", label: "Article 2232 (Délai butoir)", body: "Le report du point de départ, la suspension ou l'interruption de la prescription ne peut avoir pour effet de porter le délai de la prescription extinctive au-delà de vingt ans." },
  { id: "cc-1304",    code: "Civil", label: "Article 1304 (Conditions)", body: "L'obligation est conditionnelle lorsqu'elle dépend d'un événement futur et incertain." },
  { id: "cc-1641",    code: "Civil", label: "Article 1641 bis (Garantie biens d'occasion)", body: "Le vendeur est tenu de la garantie à raison des défauts cachés y compris pour les biens d'occasion sauf clause expresse." },

  // Famille supplémentaire
  { id: "cc-371-1",   code: "Famille", label: "Article 371-1 (Autorité parentale)", body: "L'autorité parentale est un ensemble de droits et de devoirs ayant pour finalité l'intérêt de l'enfant. Elle appartient aux parents jusqu'à la majorité." },
  { id: "cc-388-1",   code: "Famille", label: "Article 388-1 (Audition de l'enfant)", body: "Dans toute procédure le concernant, le mineur capable de discernement peut être entendu par le juge." },
  { id: "cc-228",     code: "Famille", label: "Article 228 (Devoirs du mariage)", body: "Les époux se doivent mutuellement respect, fidélité, secours, assistance." },
  { id: "cc-203",     code: "Famille", label: "Article 203 (Obligation alimentaire)", body: "Les époux contractent ensemble l'obligation de nourrir, entretenir et élever leurs enfants." },
  { id: "cc-271",     code: "Famille", label: "Article 271 (Critères prestation compensatoire)", body: "Le juge prend en considération la durée du mariage, l'âge et l'état de santé des époux, la qualification professionnelle." },

  // Travail supplémentaire
  { id: "ct-l3121-1", code: "Travail", label: "Article L3121-1 (Durée du travail)", body: "La durée du travail effectif est le temps pendant lequel le salarié est à la disposition de l'employeur et se conforme à ses directives." },
  { id: "ct-l3121-27", code: "Travail", label: "Article L3121-27 (Durée légale)", body: "La durée légale de travail effectif des salariés à temps complet est fixée à trente-cinq heures par semaine." },
  { id: "ct-l1235-3", code: "Travail", label: "Article L1235-3 (Barème Macron)", body: "Le juge accorde au salarié une indemnité, à la charge de l'employeur, dont le montant est compris entre des montants minimaux et maximaux fixés selon l'ancienneté." },
  { id: "ct-l3221-2", code: "Travail", label: "Article L3221-2 (Égalité salariale)", body: "Tout employeur assure, pour un même travail ou pour un travail de valeur égale, l'égalité de rémunération entre les femmes et les hommes." },
  { id: "ct-l1153-1", code: "Travail", label: "Article L1153-1 (Harcèlement sexuel)", body: "Aucun salarié ne doit subir des faits de harcèlement sexuel, propos ou comportements à connotation sexuelle non désirés." },
  { id: "ct-l1233-3", code: "Travail", label: "Article L1233-3 (Licenciement économique)", body: "Constitue un licenciement pour motif économique le licenciement effectué par un employeur pour des motifs non inhérents à la personne du salarié." },
  { id: "ct-l4121-1", code: "Travail", label: "Article L4121-1 (Sécurité au travail)", body: "L'employeur prend les mesures nécessaires pour assurer la sécurité et protéger la santé physique et mentale des travailleurs." },

  // Conso supplémentaire
  { id: "ccons-l312-1", code: "Conso.", label: "Article L312-1 (Crédit affecté)", body: "Le crédit consenti pour financer un bien ou service spécifique est lié à l'opération principale : l'annulation de l'une entraîne celle de l'autre." },
  { id: "ccons-l132-1", code: "Conso.", label: "Article L132-1 (Sanction clauses abusives)", body: "Les clauses abusives sont réputées non écrites." },
  { id: "ccons-l111-1", code: "Conso.", label: "Article L111-1 (Information précontractuelle)", body: "Avant la conclusion d'un contrat, le professionnel communique au consommateur les caractéristiques essentielles du bien ou du service." },
  { id: "ccons-l622-3", code: "Conso.", label: "Article L622-3 (Surendettement)", body: "Le débiteur surendetté peut bénéficier d'une procédure de rétablissement personnel s'il est dans une situation irrémédiablement compromise." },
  { id: "ccons-l242-1", code: "Conso.", label: "Article L242-1 (Garantie commerciale)", body: "La garantie commerciale s'entend de tout engagement contractuel d'un professionnel à l'égard du consommateur." },

  // Numérique supplémentaire
  { id: "rgpd-17",    code: "RGPD", label: "Article 17 (Droit à l'oubli)", body: "La personne concernée a le droit d'obtenir l'effacement de données la concernant lorsque ces données ne sont plus nécessaires." },
  { id: "rgpd-32",    code: "RGPD", label: "Article 32 (Sécurité du traitement)", body: "Le responsable de traitement met en œuvre les mesures techniques et organisationnelles appropriées afin de garantir un niveau de sécurité adapté au risque." },
  { id: "rgpd-33",    code: "RGPD", label: "Article 33 (Notification de violation)", body: "En cas de violation de données, le responsable du traitement la notifie à l'autorité de contrôle dans les meilleurs délais et au plus tard 72 heures." },
  { id: "rgpd-83",    code: "RGPD", label: "Article 83 (Sanctions)", body: "Les violations du règlement font l'objet d'amendes administratives pouvant s'élever jusqu'à 20 millions d'euros ou 4 % du chiffre d'affaires annuel." },
  { id: "lcen-9",     code: "Numérique", label: "LCEN art. 9 (Identification des éditeurs)", body: "Les éditeurs de services en ligne mettent à disposition des informations permettant leur identification." },
  { id: "rgpd-35",    code: "RGPD", label: "Article 35 (Analyse d'impact)", body: "Lorsqu'un traitement est susceptible d'engendrer un risque élevé, le responsable doit effectuer une analyse d'impact relative à la protection des données." },

  // Routier supplémentaire
  { id: "cr-l234-1",  code: "Routier", label: "Article L234-1 (Conduite en état d'ivresse)", body: "Le fait de conduire un véhicule sous l'empire d'un état alcoolique caractérisé est puni de deux ans d'emprisonnement et 4 500 euros d'amende." },
  { id: "cr-l324-2",  code: "Routier", label: "Article L324-2 (Défaut d'assurance)", body: "Le fait de conduire un véhicule sans être couvert par une assurance est puni de 3 750 euros d'amende et de la suspension du permis." },
  { id: "cr-r412-6",  code: "Routier", label: "Article R412-6 (Téléphone au volant)", body: "L'usage d'un téléphone tenu en main par le conducteur est interdit. Sanction : 135 € + retrait de 3 points." },
  { id: "cr-r413-14", code: "Routier", label: "Article R413-14 (Excès de vitesse)", body: "Le dépassement de la vitesse maximale autorisée constitue une contravention dont la classe varie selon le dépassement." },

  // Environnement supplémentaire
  { id: "cenv-l512-1", code: "Environnement", label: "Article L512-1 (ICPE)", body: "Les installations classées pour la protection de l'environnement sont soumises à autorisation préalable selon leur dangerosité." },
  { id: "cenv-l341-1", code: "Environnement", label: "Article L341-1 (Sites classés)", body: "Le classement des sites consiste en l'inscription sur une liste, en raison du caractère artistique, historique, scientifique ou pittoresque." },
  { id: "cenv-l229-5", code: "Environnement", label: "Article L229-5 (Quotas carbone)", body: "Les exploitants soumis au système d'échange de quotas remettent un nombre de quotas correspondant à leurs émissions." },

  // Propriété intellectuelle supplémentaire
  { id: "cpi-l111-1", code: "Prop. intel.", label: "Article L111-1 (Droit d'auteur)", body: "L'auteur d'une œuvre de l'esprit jouit, du seul fait de sa création, d'un droit de propriété incorporelle exclusif et opposable à tous." },
  { id: "cpi-l132-1", code: "Prop. intel.", label: "Article L132-1 (Cession de droits)", body: "Le contrat d'édition est celui par lequel l'auteur d'une œuvre de l'esprit cède à des conditions déterminées le droit de la fabriquer ou faire fabriquer." },
  { id: "cpi-l611-10", code: "Prop. intel.", label: "Article L611-10 (Brevetabilité)", body: "Sont brevetables les inventions nouvelles impliquant une activité inventive et susceptibles d'application industrielle." },

  // Procédure pénale
  { id: "cpp-1",      code: "Procédure", label: "Article 1 CPP (Action publique)", body: "L'action publique pour l'application des peines est mise en mouvement et exercée par les magistrats ou par les fonctionnaires auxquels elle est confiée." },
  { id: "cpp-preliminaire", code: "Procédure", label: "Article préliminaire CPP", body: "La procédure pénale doit être équitable et contradictoire et préserver l'équilibre des droits des parties." },
  { id: "cpp-138",    code: "Procédure", label: "Article 138 CPP (Contrôle judiciaire)", body: "Le contrôle judiciaire peut être ordonné si la personne mise en examen encourt une peine d'emprisonnement." },
  { id: "cpp-144",    code: "Procédure", label: "Article 144 CPP (Détention provisoire)", body: "La détention provisoire ne peut être ordonnée que pour conserver les preuves, empêcher pression sur témoins ou renouvellement de l'infraction." },

  // Procédure civile
  { id: "cpc-15",     code: "Procédure", label: "Article 15 CPC (Contradictoire)", body: "Les parties doivent se faire connaître mutuellement en temps utile les moyens de fait et de droit sur lesquels elles fondent leurs prétentions." },
  { id: "cpc-9",      code: "Procédure", label: "Article 9 CPC (Charge de la preuve)", body: "Il incombe à chaque partie de prouver conformément à la loi les faits nécessaires au succès de sa prétention." },
  { id: "cpc-700",    code: "Procédure", label: "Article 700 CPC (Frais irrépétibles)", body: "Le juge condamne la partie tenue aux dépens à payer à l'autre partie une somme qu'il détermine, au titre des frais exposés non compris dans les dépens." },

  // Constitutionnel
  { id: "constit-66", code: "Constitutionnel", label: "Article 66 Constitution", body: "Nul ne peut être arbitrairement détenu. L'autorité judiciaire, gardienne de la liberté individuelle, assure le respect de ce principe." },
  { id: "ddhc-2",     code: "Constitutionnel", label: "Article 2 DDHC (Droits naturels)", body: "Le but de toute association politique est la conservation des droits naturels et imprescriptibles de l'homme." },
  { id: "ddhc-7",     code: "Constitutionnel", label: "Article 7 DDHC (Légalité des peines)", body: "Nul homme ne peut être accusé, arrêté ni détenu que dans les cas déterminés par la loi." },
  { id: "ddhc-8",     code: "Constitutionnel", label: "Article 8 DDHC (Nécessité des peines)", body: "La loi ne doit établir que des peines strictement et évidemment nécessaires." },
  { id: "ddhc-9",     code: "Constitutionnel", label: "Article 9 DDHC (Présomption innocence)", body: "Tout homme étant présumé innocent jusqu'à ce qu'il ait été déclaré coupable." },
  { id: "ddhc-11",    code: "Constitutionnel", label: "Article 11 DDHC (Liberté d'expression)", body: "La libre communication des pensées et des opinions est un des droits les plus précieux de l'Homme." },

  // Droits humains internationaux
  { id: "cesdh-3",    code: "CESDH", label: "Article 3 CESDH (Interdiction torture)", body: "Nul ne peut être soumis à la torture ni à des peines ou traitements inhumains ou dégradants." },
  { id: "cesdh-5",    code: "CESDH", label: "Article 5 CESDH (Droit à la liberté)", body: "Toute personne a droit à la liberté et à la sûreté." },
  { id: "cesdh-6",    code: "CESDH", label: "Article 6 CESDH (Procès équitable)", body: "Toute personne a droit à ce que sa cause soit entendue équitablement, publiquement et dans un délai raisonnable." },
  { id: "cesdh-8",    code: "CESDH", label: "Article 8 CESDH (Vie privée)", body: "Toute personne a droit au respect de sa vie privée et familiale, de son domicile et de sa correspondance." },
  { id: "cesdh-10",   code: "CESDH", label: "Article 10 CESDH (Liberté d'expression)", body: "Toute personne a droit à la liberté d'expression. Ce droit comprend la liberté d'opinion et la liberté de recevoir ou communiquer des informations." },
  { id: "cesdh-14",   code: "CESDH", label: "Article 14 CESDH (Non-discrimination)", body: "La jouissance des droits doit être assurée, sans distinction aucune, fondée notamment sur le sexe, la race, la couleur, la langue, la religion." },

  // Droit des affaires
  { id: "ccom-l225-1", code: "Affaires", label: "Article L225-1 (SA)", body: "La société anonyme est la société dont le capital est divisé en actions et qui est constituée entre des associés qui ne supportent les pertes qu'à concurrence de leurs apports." },
  { id: "ccom-l223-1", code: "Affaires", label: "Article L223-1 (SARL)", body: "La société à responsabilité limitée est instituée par une ou plusieurs personnes qui ne supportent les pertes qu'à concurrence de leurs apports." },
  { id: "ccom-l631-1", code: "Affaires", label: "Article L631-1 (Redressement judiciaire)", body: "La procédure de redressement judiciaire est ouverte à tout débiteur en cessation de paiements." },
  { id: "ccom-l442-1", code: "Affaires", label: "Article L442-1 (Pratiques restrictives)", body: "Engage la responsabilité de son auteur le fait, dans le cadre de la négociation commerciale, d'obtenir un avantage manifestement disproportionné." },

  // Notions complémentaires (procédure et concepts)
  { id: "concept-saisine", code: "Notion", label: "Saisine", body: "Acte par lequel un juge est saisi d'une affaire, c'est-à-dire investi du pouvoir de la juger." },
  { id: "concept-jugement", code: "Notion", label: "Jugement", body: "Décision rendue par une juridiction de premier degré (par opposition à arrêt rendu en appel ou Cassation)." },
  { id: "concept-arret",   code: "Notion", label: "Arrêt", body: "Décision rendue par une juridiction supérieure (cour d'appel, Cour de cassation, Conseil d'État)." },
  { id: "concept-pourvoi", code: "Notion", label: "Pourvoi en cassation", body: "Recours dirigé contre une décision rendue en dernier ressort, devant la Cour de cassation, pour erreur de droit." },
  { id: "concept-appel",   code: "Notion", label: "Appel", body: "Recours formé contre une décision de première instance pour la faire rejuger par une juridiction supérieure." },
  { id: "concept-cassation", code: "Notion", label: "Cassation", body: "Annulation d'une décision pour mauvaise application du droit, par la Cour de cassation." },
  { id: "concept-revision", code: "Notion", label: "Révision", body: "Procédure exceptionnelle qui permet de rejuger une affaire pénale après condamnation définitive si un fait nouveau survient." },
  { id: "concept-amnistie", code: "Notion", label: "Amnistie", body: "Acte législatif qui efface une condamnation et interdit toute poursuite ultérieure pour les faits visés." },
  { id: "concept-grace",   code: "Notion", label: "Grâce", body: "Mesure individuelle par laquelle le chef de l'État dispense d'exécuter tout ou partie d'une peine." },
  { id: "concept-clemence", code: "Notion", label: "Clémence", body: "Esprit de modération du juge ou du législateur qui adoucit une sanction face à des circonstances atténuantes." },
  { id: "concept-recours", code: "Notion", label: "Recours", body: "Action en justice visant à contester une décision (recours administratif, juridictionnel, gracieux)." },
  { id: "concept-recevabilite", code: "Notion", label: "Recevabilité", body: "Caractère d'une demande en justice qui remplit les conditions de forme exigées pour être examinée au fond." },
  { id: "concept-fond",   code: "Notion", label: "Fond du droit", body: "Examen de la substance d'une demande, par opposition à son examen formel (recevabilité)." },
  { id: "concept-litige", code: "Notion", label: "Litige", body: "Différend entre deux ou plusieurs personnes qui peut donner lieu à un procès." },
  { id: "concept-debouter", code: "Notion", label: "Débouter", body: "Rejeter la demande d'une partie au procès, pour défaut de fondement." },
  { id: "concept-condamner", code: "Notion", label: "Condamner", body: "Prononcer une sanction contre une partie reconnue coupable ou responsable." },
  { id: "concept-relaxer", code: "Notion", label: "Relaxer", body: "Décision du tribunal correctionnel qui déclare un prévenu non coupable." },
  { id: "concept-acquit", code: "Notion", label: "Acquitter", body: "Idem, en cour d'assises (pour un crime). Synonyme : acquittement." },
  { id: "concept-conciliation", code: "Notion", label: "Conciliation", body: "Procédure amiable où un tiers (conciliateur) aide à trouver un accord, évitant le procès." },
  { id: "concept-mediation", code: "Notion", label: "Médiation", body: "Procédure par laquelle un tiers aide les parties à négocier une solution acceptable." },
  { id: "concept-arbitrage", code: "Notion", label: "Arbitrage", body: "Procédure où les parties soumettent leur litige à un tiers (arbitre) qui rend une décision exécutoire." },
  { id: "concept-tribunal", code: "Notion", label: "Tribunal", body: "Juridiction de première instance qui juge les affaires civiles ou pénales selon sa compétence." },
  { id: "concept-cour",   code: "Notion", label: "Cour", body: "Juridiction supérieure (cour d'appel, cour d'assises, Cour de cassation, Cour des comptes)." },
  { id: "concept-juge",   code: "Notion", label: "Juge", body: "Magistrat chargé de dire le droit et de trancher les litiges." },
  { id: "concept-procureur", code: "Notion", label: "Procureur", body: "Magistrat du parquet qui représente la société et requiert l'application de la loi." },
  { id: "concept-avocat", code: "Notion", label: "Avocat", body: "Auxiliaire de justice qui conseille les parties et plaide leur cause devant les juridictions." },
  { id: "concept-prejudice-moral", code: "Notion", label: "Préjudice moral", body: "Souffrance psychologique ou atteinte à la réputation, indemnisable par dommages-intérêts." },
  { id: "concept-bonfoi", code: "Notion", label: "Bonne foi (présomption)", body: "Présomption de l'article 2274 du Code civil : la bonne foi est toujours présumée." },
  { id: "concept-mauvaisefoi", code: "Notion", label: "Mauvaise foi", body: "État de celui qui agit avec connaissance de l'illicéité ou avec intention de nuire." },
  { id: "concept-causalite", code: "Notion", label: "Lien de causalité", body: "Relation directe et certaine entre un fait et un dommage, condition de la responsabilité civile." },
  { id: "concept-imputation", code: "Notion", label: "Imputabilité", body: "Capacité d'une personne à être tenue pour responsable d'un acte (notamment en raison de sa lucidité)." },
  { id: "concept-grief", code: "Notion", label: "Grief", body: "Argument soulevé contre une décision, sur le fond ou sur la forme." },
  { id: "concept-debat", code: "Notion", label: "Débat contradictoire", body: "Phase orale du procès où les parties échangent leurs arguments en présence du juge." },

  // Procédures spéciales
  { id: "proc-comparution", code: "Procédure", label: "Comparution immédiate", body: "Procédure rapide qui permet de juger une personne immédiatement après sa garde à vue." },
  { id: "proc-flagrance", code: "Procédure", label: "Flagrance", body: "Constatation d'une infraction au moment où elle se commet ou immédiatement après." },
  { id: "proc-plaisant", code: "Procédure", label: "Plaider coupable (CRPC)", body: "Comparution sur reconnaissance préalable de culpabilité — procédure simplifiée pour délits." },
  { id: "proc-instruction", code: "Procédure", label: "Instruction", body: "Phase d'enquête menée par un juge d'instruction pour rassembler les preuves d'un crime ou délit complexe." },
  { id: "proc-garde", code: "Procédure", label: "Garde à vue", body: "Mesure de privation de liberté d'une personne soupçonnée pendant une enquête (24h, prolongeable)." },

  // Histoire du droit étoffée
  { id: "hist-coderom", code: "Histoire", label: "Code de Justinien (529)", body: "Compilation du droit romain qui inspire encore tous les codes civils continentaux." },
  { id: "hist-magna",  code: "Histoire", label: "Magna Carta (1215)", body: "Charte arrachée au roi d'Angleterre — première limitation du pouvoir royal et des droits des sujets." },
  { id: "hist-1215",   code: "Histoire", label: "Habeas Corpus (1679)", body: "Loi anglaise garantissant qu'aucune personne ne peut être détenue sans cause légale." },
  { id: "hist-tribCC", code: "Histoire", label: "Conseil constitutionnel (1958)", body: "Création de la juridiction qui contrôle la conformité des lois à la Constitution française." },
  { id: "hist-CEDH",   code: "Histoire", label: "CEDH (1959)", body: "Création de la Cour européenne des droits de l'homme à Strasbourg." },
  { id: "hist-Roe",    code: "Histoire", label: "Roe v. Wade (1973)", body: "Décision de la Cour suprême américaine reconnaissant un droit constitutionnel à l'avortement (renversée en 2022)." },
  { id: "hist-Brown",  code: "Histoire", label: "Brown v. Board (1954)", body: "Cour suprême américaine déclare anticonstitutionnelle la ségrégation scolaire." },
  { id: "hist-veil",   code: "Histoire", label: "Loi Veil (1975)", body: "Légalisation de l'IVG en France, présentée par Simone Veil — débat civilisationnel majeur." },
  { id: "hist-pacs",   code: "Histoire", label: "PACS (1999)", body: "Création du Pacte civil de solidarité — étape vers la reconnaissance des couples homosexuels." },
  { id: "hist-mariage_pour_tous", code: "Histoire", label: "Mariage pour tous (2013)", body: "Loi Taubira ouvrant le mariage aux couples de même sexe en France." },

  // Maximes et adages classiques
  { id: "adage-nullum", code: "Adage", label: "Nullum crimen sine lege", body: "Pas de crime sans loi — la loi pénale doit être préexistante au fait reproché." },
  { id: "adage-actori", code: "Adage", label: "Actori incumbit probatio", body: "À celui qui agit incombe la preuve — c'est le demandeur qui doit prouver." },
  { id: "adage-resipsa", code: "Adage", label: "Res ipsa loquitur", body: "La chose parle d'elle-même — la preuve résulte des faits eux-mêmes (common law)." },
  { id: "adage-lexposterior", code: "Adage", label: "Lex posterior derogat priori", body: "La loi postérieure déroge à la loi antérieure." },
  { id: "adage-inclaris", code: "Adage", label: "In claris non fit interpretatio", body: "Ce qui est clair ne s'interprète pas — règle d'interprétation des textes clairs." },
  { id: "adage-ubilex", code: "Adage", label: "Ubi lex non distinguit", body: "Là où la loi ne distingue pas, on ne doit pas distinguer." },
  { id: "adage-nemoauditur", code: "Adage", label: "Nemo auditur propriam turpitudinem allegans", body: "Nul ne peut se prévaloir de sa propre turpitude (déjà mentionné, mais maxime universelle)." },
  { id: "adage-pacta", code: "Adage", label: "Pacta sunt servanda", body: "Les conventions doivent être tenues — pierre angulaire du droit des contrats." },
  { id: "adage-audi", code: "Adage", label: "Audi alteram partem", body: "Entendre l'autre partie — fondement du contradictoire." },
  { id: "adage-falsus", code: "Adage", label: "Falsus in uno, falsus in omnibus", body: "Faux en une chose, faux en toutes — un témoin pris en mensonge perd toute crédibilité." },

  // Branches spécialisées
  { id: "esp-droit_fiscal", code: "Branche", label: "Droit fiscal", body: "Branche du droit régissant les impôts, taxes et contributions perçus par l'État et les collectivités." },
  { id: "esp-droit_admin", code: "Branche", label: "Droit administratif", body: "Branche régissant l'organisation et le fonctionnement de l'administration et ses rapports avec les particuliers." },
  { id: "esp-droit_inter", code: "Branche", label: "Droit international", body: "Ensemble des règles régissant les relations entre États et organisations internationales." },
  { id: "esp-droit_eur", code: "Branche", label: "Droit de l'Union européenne", body: "Corpus juridique propre à l'UE, composé du droit primaire (traités) et dérivé (règlements, directives)." },
  { id: "esp-droit_social", code: "Branche", label: "Droit social", body: "Englobe le droit du travail et le droit de la sécurité sociale." },
  { id: "esp-droit_const", code: "Branche", label: "Droit constitutionnel", body: "Branche régissant l'organisation des pouvoirs publics et garantissant les droits fondamentaux." },

  // ====== Étoffement vers 300 entrées — articles cités dans le pool 300 + procès historiques ======
  // Pénal supplémentaire
  { id: "cp-226-1",   code: "Pénal", label: "Article 226-1 (Atteinte vie privée)", body: "Est puni d'un an et 45 000 € le fait de porter atteinte à l'intimité de la vie privée d'autrui en captant ou diffusant, sans consentement, l'image d'une personne dans un lieu privé." },
  { id: "cp-222-33-2-2", code: "Pénal", label: "Article 222-33-2-2 (Cyberharcèlement)", body: "Le harcèlement par moyens numériques (publications, messages répétés portant atteinte aux conditions de vie de la victime) est puni de 2 à 3 ans selon les circonstances aggravantes." },
  { id: "cp-434-10", code: "Pénal", label: "Article 434-10 (Délit de fuite)", body: "Le fait pour un conducteur, sachant qu'il vient de causer un accident, de ne pas s'arrêter et tenter d'échapper à la responsabilité, est puni de 3 ans et 75 000 €." },
  { id: "cp-322-2",  code: "Pénal", label: "Article 322-2 (Dégradation aggravée)", body: "La dégradation d'un bien classé monument historique ou patrimoine est punie de 7 500 € à 7 ans selon la gravité et les circonstances." },
  { id: "cp-432-12", code: "Pénal", label: "Article 432-12 (Prise illégale d'intérêts)", body: "Le fait par une personne dépositaire de l'autorité publique de prendre un intérêt dans une entreprise dont elle a la surveillance est puni de 5 ans." },
  { id: "cp-313-3",  code: "Pénal", label: "Article 313-3 (Abus de faiblesse)", body: "L'abus frauduleux de l'état d'ignorance ou de la situation de faiblesse d'une personne particulièrement vulnérable est puni de 3 ans." },

  // Civil supplémentaire — voisinage et propriété
  { id: "cc-544",    code: "Civil", label: "Article 544 (Droit de propriété)", body: "La propriété est le droit de jouir et disposer des choses de la manière la plus absolue, pourvu qu'on n'en fasse pas un usage prohibé par les lois." },
  { id: "cc-651",    code: "Civil", label: "Article 651 (Servitude légale)", body: "La loi assujettit les propriétaires à différentes obligations l'un à l'égard de l'autre, indépendamment de toute convention." },
  { id: "cc-671",    code: "Civil", label: "Article 671 (Distance plantations)", body: "Il n'est permis d'avoir des arbres haute tige qu'à 2 m de la limite séparative, et 50 cm pour les autres plantations." },
  { id: "cc-673",    code: "Civil", label: "Article 673 (Élagage forcé)", body: "Celui sur la propriété duquel avancent les branches des arbres du voisin peut contraindre celui-ci à les couper. Les fruits tombés naturellement lui appartiennent." },
  { id: "cc-691",    code: "Civil", label: "Article 691 (Servitudes continues)", body: "Les servitudes continues non apparentes et les servitudes discontinues, apparentes ou non, ne peuvent s'établir que par titres, non par possession." },
  { id: "cc-706",    code: "Civil", label: "Article 706 (Extinction servitude)", body: "La servitude est éteinte par le non-usage pendant trente ans." },
  { id: "cc-1137",   code: "Civil", label: "Article 1137 (Dol)", body: "Le dol est le fait pour un contractant d'obtenir le consentement de l'autre par des manœuvres ou des mensonges. Constitue également un dol la dissimulation intentionnelle." },
  { id: "cc-trouble_voisinage", code: "Civil", label: "Trouble anormal de voisinage", body: "Création prétorienne (jurisprudence constante depuis 1844) : nul ne doit causer à autrui un trouble anormal de voisinage. Critères : anormalité, durée, caractère continu." },

  // Famille supplémentaire
  { id: "cc-373-2", code: "Famille", label: "Article 373-2 (Autorité parentale conjointe)", body: "La séparation des parents est sans incidence sur les règles de dévolution de l'exercice de l'autorité parentale. Chaque parent doit maintenir des relations personnelles avec l'enfant et respecter les liens de l'autre." },
  { id: "cc-371-4", code: "Famille", label: "Article 371-4 (Liens grands-parents)", body: "L'enfant a le droit d'entretenir des relations personnelles avec ses ascendants. Seul l'intérêt de l'enfant peut faire obstacle à l'exercice de ce droit." },
  { id: "cc-389-3", code: "Famille", label: "Article 389-3 (Administration légale)", body: "L'administrateur légal représente le mineur dans tous les actes civils, sauf les cas dans lesquels la loi ou l'usage autorise les mineurs à agir eux-mêmes." },
  { id: "cc-413-2", code: "Famille", label: "Article 413-2 (Émancipation)", body: "Le mineur, même non marié, pourra être émancipé lorsqu'il aura atteint l'âge de seize ans révolus. Émancipation prononcée par le juge des tutelles à la demande des parents." },

  // Travail supplémentaire — articles cités
  { id: "ct-l1132-1", code: "Travail", label: "Article L1132-1 (Discrimination)", body: "Aucune personne ne peut être écartée d'une procédure de recrutement ou de l'accès à un stage en raison de son origine, sexe, mœurs, orientation, identité de genre, âge, situation de famille, grossesse, etc." },
  { id: "ct-l1221-6", code: "Travail", label: "Article L1221-6 (Information loyale)", body: "Les informations demandées au candidat à un emploi ne peuvent avoir comme finalité que d'apprécier sa capacité à occuper l'emploi proposé. Question sur projets familiaux interdite." },
  { id: "ct-l1222-4", code: "Travail", label: "Article L1222-4 (Information préalable contrôle)", body: "Aucune information concernant personnellement un salarié ne peut être collectée par un dispositif qui n'a pas été porté préalablement à sa connaissance." },
  { id: "ct-l3171-4", code: "Travail", label: "Article L3171-4 (Preuve heures)", body: "En cas de litige sur la durée du travail, l'employeur doit fournir au juge les éléments de nature à justifier les horaires effectivement réalisés par le salarié." },
  { id: "ct-l5213-6", code: "Travail", label: "Article L5213-6 (Aménagement handicap)", body: "L'employeur prend les mesures appropriées pour permettre au travailleur handicapé d'accéder à un emploi correspondant à sa qualification, sauf si ces mesures impliquent une charge disproportionnée." },
  { id: "ct-l1237-13", code: "Travail", label: "Article L1237-13 (Indemnité rupture conventionnelle)", body: "La rupture conventionnelle prévoit une indemnité spécifique au moins égale à l'indemnité de licenciement. Délai de rétractation 15 jours. Homologation administrative." },
  { id: "css-l461-1", code: "Travail", label: "Article L461-1 SS (Maladie pro hors tableau)", body: "Une maladie peut être reconnue d'origine professionnelle hors tableau si IPP ≥ 25 % et lien direct et essentiel avec le travail établi par le CRRMP." },

  // Consommation supplémentaire
  { id: "ccons-l213-1", code: "Conso.", label: "Article L213-1 (Tromperie)", body: "Est puni d'un emprisonnement de 2 ans et 300 000 € quiconque trompe le contractant sur la nature, l'origine, les qualités substantielles d'une marchandise." },
  { id: "ccons-l215-1", code: "Conso.", label: "Article L215-1 (Reconduction tacite)", body: "Pour les contrats de prestation de services à reconduction tacite, le professionnel doit informer le consommateur de la possibilité de ne pas reconduire au plus tôt 3 mois et au plus tard 1 mois avant le terme." },
  { id: "ccons-l217-3", code: "Conso.", label: "Article L217-3 (Garantie biens reconditionnés)", body: "La garantie légale de conformité s'applique aux biens reconditionnés et aux biens d'occasion vendus par un professionnel — durée minimum 12 mois pour reconditionné, 24 mois pour neuf." },
  { id: "ccons-l223-1", code: "Conso.", label: "Article L223-1 (Bloctel)", body: "Tout consommateur peut s'inscrire gratuitement sur Bloctel pour s'opposer à être démarché par téléphone. Démarchage des inscrits = sanction administrative." },
  { id: "ccons-l121-4", code: "Conso.", label: "Article L121-4 (Pratiques trompeuses)", body: "Est trompeuse la pratique commerciale fondée sur des allégations fausses ou de nature à induire en erreur le consommateur sur les caractéristiques du bien, son prix, sa disponibilité, ou les qualités du professionnel." },
  { id: "cmf-l312-1-3", code: "Bancaire", label: "Article L312-1-3 CMF (Frais clients fragiles)", body: "Les frais d'incidents bancaires des clients en situation de fragilité financière sont plafonnés à 25 € par mois (clients) ou 20 € par mois (offre spécifique)." },

  // Numérique / RGPD supplémentaire
  { id: "loi-2024-deepfake", code: "Numérique", label: "Loi du 21 mai 2024 (Deepfakes intimes)", body: "La diffusion d'un contenu visuel ou sonore généré par traitement algorithmique reproduisant à caractère sexuel l'image d'une personne sans son consentement est punie de 2 ans et 60 000 € (3 ans et 75 000 € si en ligne)." },
  { id: "lil-82",     code: "Numérique", label: "Article 82 LIL (Cookies)", body: "Tout abonné ou utilisateur d'un service de communication électronique doit être informé et donner son consentement préalable à toute action visant à stocker ou accéder à des informations dans son équipement, sauf exception fonctionnelle." },
  { id: "loi-1881-29", code: "Presse", label: "Loi 1881 (Diffamation)", body: "Toute allégation ou imputation d'un fait qui porte atteinte à l'honneur ou à la considération d'une personne est une diffamation. Procédure spéciale : prescription 3 mois, citation précise obligatoire." },

  // Routier supplémentaire
  { id: "cr-r412-6-1", code: "Routier", label: "Article R412-6-1 (Téléphone tenu en main)", body: "L'usage d'un téléphone tenu en main par le conducteur d'un véhicule en circulation est interdit. Sanction : 135 € + retrait de 3 points." },
  { id: "cr-r412-7",  code: "Routier", label: "Article R412-7 (Couloirs réservés)", body: "Les conducteurs doivent emprunter les voies appropriées et respecter les voies réservées (bus, taxis, vélos). Infraction = 135 €." },
  { id: "cr-r415-11", code: "Routier", label: "Article R415-11 (Priorité piéton)", body: "Le conducteur est tenu de céder le passage au piéton engagé régulièrement dans la traversée d'une chaussée ou manifestant clairement l'intention de le faire. Sanction : 135 € + 6 points." },
  { id: "cr-r417-10", code: "Routier", label: "Article R417-10 (Stationnement gênant)", body: "Tout stationnement gênant ou abusif sur la voie publique est puni d'une amende de 4ᵉ classe (135 €). Stationnement très gênant : 5ᵉ classe (135 €)." },
  { id: "cr-r417-11", code: "Routier", label: "Article R417-11 (Place handicapé)", body: "Le stationnement sur une place réservée aux personnes handicapées sans titre est puni d'une amende forfaitaire de 135 €, mise en fourrière possible." },

  // Environnement supplémentaire
  { id: "cenv-l216-6-spr", code: "Environnement", label: "Article L216-6 (Pollution eaux — détaillé)", body: "Le déversement, l'écoulement, le rejet de substances polluantes dans les eaux superficielles ou souterraines est puni de 2 ans et 75 000 €. Aggravation possible si destruction d'espèces aquatiques." },
  { id: "cenv-l218-22", code: "Environnement", label: "Article L218-22 (Pollution maritime)", body: "Toute infraction aux conventions internationales sur la pollution maritime (MARPOL) est punie de peines proportionnées à la gravité — jusqu'à 1 an et 50 000 € pour navire, plus en cas de marée noire." },
  { id: "cenv-l541-3", code: "Environnement", label: "Article L541-3 (Décharges sauvages)", body: "Le préfet peut mettre en demeure le détenteur ou le propriétaire du terrain où sont entreposés des déchets de procéder à leur élimination. Astreinte journalière possible." },
  { id: "cenv-l541-46", code: "Environnement", label: "Article L541-46 (Sanctions déchets)", body: "Le dépôt sauvage de déchets est puni jusqu'à 75 000 € et 2 ans de prison. Aggravations possibles selon la quantité, la dangerosité, la zone protégée." },
  { id: "cenv-charte-5", code: "Environnement", label: "Charte environnement art. 5 (Précaution)", body: "Lorsque la réalisation d'un dommage, bien qu'incertaine en l'état des connaissances, pourrait affecter de manière grave et irréversible l'environnement, les autorités publiques veillent à l'application de mesures provisoires et proportionnées." },
  { id: "loi-2019-pesticides", code: "Environnement", label: "Arrêté 27 déc. 2019 (Pesticides)", body: "L'utilisation de produits phytosanitaires est interdite à proximité des habitations : 5 m minimum (10 m pour produits classés CMR1). Distances réduites possibles avec engagement charte." },
  { id: "loi-natura2000", code: "Environnement", label: "Sites Natura 2000", body: "Les sites Natura 2000 font l'objet de protections spéciales. Tout projet susceptible d'affecter le site doit faire l'objet d'une évaluation des incidences, sous peine d'annulation des autorisations." },
  { id: "code-urb-l130-1", code: "Environnement", label: "Article L130-1 Code urbanisme (EBC)", body: "Les espaces boisés classés (EBC) interdisent tout changement d'affectation ou tout mode d'occupation du sol de nature à compromettre la conservation des boisements. Abattage soumis à déclaration ou autorisation." },

  // Propriété intellectuelle supplémentaire
  { id: "cpi-l111-1-bis", code: "Prop. intel.", label: "Article L111-1 CPI (création originale)", body: "La protection naît de la seule création — pas besoin de dépôt. La preuve d'antériorité (enveloppe Soleau, dépôt SACD) sert à établir la date de création." },
  { id: "cpi-l122-4", code: "Prop. intel.", label: "Article L122-4 CPI (Reproduction interdite)", body: "Toute représentation ou reproduction intégrale ou partielle, faite sans le consentement de l'auteur ou de ses ayants droit, est illicite. Constitue une contrefaçon." },
  { id: "cpi-l713-3", code: "Prop. intel.", label: "Article L713-3 CPI (Risque confusion)", body: "Sont interdits, sauf autorisation du propriétaire, l'usage d'un signe identique pour des produits ou services identiques, et l'usage d'un signe similaire si risque de confusion dans l'esprit du public." },
  { id: "cpi-l713-5", code: "Prop. intel.", label: "Article L713-5 CPI (Marques renommées)", body: "L'usage d'une marque jouissant d'une renommée pour des produits non similaires engage la responsabilité civile de son auteur s'il en tire un profit indu ou cause un préjudice à la marque." },
  { id: "cpi-l716-1", code: "Prop. intel.", label: "Article L716-1 CPI (Action contrefaçon)", body: "L'atteinte aux droits du propriétaire d'une marque constitue une contrefaçon engageant la responsabilité civile de son auteur. Sanction pénale : 3 ans + 300 000 €." },
  { id: "cpi-fairuse",  code: "Prop. intel.", label: "Notion : Fair Use", body: "Doctrine américaine permettant l'usage limité de matériel protégé sans autorisation : 4 critères (but, nature, quantité, effet sur le marché). Pas d'équivalent français strict — exceptions limitatives." },

  // Loi RGPD/numérique étoffée
  { id: "rgpd-shrems2", code: "RGPD", label: "Arrêt Schrems II (CJUE 2020)", body: "Invalide le Privacy Shield UE-USA. Tout transfert de données vers les USA exige des garanties supplémentaires (clauses types + analyse de risque). Catalyseur du Data Privacy Framework 2023." },
  { id: "loi-dsa",      code: "Numérique", label: "DSA — Digital Services Act (2022)", body: "Règlement européen imposant aux plateformes des obligations renforcées : modération transparente, signalement rapide des contenus illicites, protection des mineurs, audit. Sanction jusqu'à 6 % du CA mondial." },
  { id: "loi-dma",      code: "Numérique", label: "DMA — Digital Markets Act (2022)", body: "Règlement ciblant les « contrôleurs d'accès » (gatekeepers) : interdictions d'auto-favoritisme, obligation d'interopérabilité, libre choix des moteurs/navigateurs. Sanction jusqu'à 10 % du CA mondial." },
  { id: "loi-aiact",    code: "Numérique", label: "AI Act (2024)", body: "Règlement européen sur l'IA. Approche par risques : systèmes interdits (scoring social), haut risque (encadrés), risque limité (transparence). Sanctions jusqu'à 7 % du CA mondial." },
  { id: "lcen-6-2",     code: "Numérique", label: "LCEN art. 6-II (Identification utilisateurs)", body: "Les hébergeurs et FAI doivent conserver les données d'identification des contributeurs et les communiquer sur demande judiciaire (durée : 1 an)." },

  // Procédure étoffée
  { id: "cpp-revision-485", code: "Procédure", label: "Article 622 CPP (Révision pénale)", body: "La révision d'une décision pénale définitive est recevable lorsqu'un fait nouveau ou un élément inconnu de la juridiction au jour du procès est susceptible d'établir l'innocence du condamné." },
  { id: "cpp-cppcomparu", code: "Procédure", label: "Article 393 CPP (Convocation immédiate)", body: "Le procureur peut, après garde à vue, faire comparaître l'auteur d'un délit immédiatement devant le tribunal correctionnel. Procédure rapide mais cadrée." },
  { id: "cpp-coopetition", code: "Procédure", label: "Coopération internationale pénale", body: "Les conventions d'extradition (européennes, bilatérales) régissent la remise d'auteurs présumés à un État requérant. Conditions : double incrimination, principe de spécialité, garanties procédurales." },

  // Constitutionnel et droits fondamentaux
  { id: "constit-1",    code: "Constitutionnel", label: "Article 1 Constitution (République indivisible)", body: "La France est une République indivisible, laïque, démocratique et sociale. Elle assure l'égalité devant la loi sans distinction d'origine, de race ou de religion." },
  { id: "constit-34",   code: "Constitutionnel", label: "Article 34 (Domaine de la loi)", body: "La loi fixe les règles concernant les droits civiques, les libertés publiques, le statut des personnes, les crimes et délits, leur procédure, et les peines." },
  { id: "ddhc-16",      code: "Constitutionnel", label: "Article 16 DDHC (Séparation des pouvoirs)", body: "Toute Société dans laquelle la garantie des Droits n'est pas assurée, ni la séparation des Pouvoirs déterminée, n'a point de Constitution." },

  // CESDH étoffée
  { id: "cesdh-7",     code: "CESDH", label: "Article 7 CESDH (Légalité des peines)", body: "Nul ne peut être condamné pour une action ou omission qui ne constituait pas une infraction au moment où elle a été commise (nullum crimen sine lege)." },
  { id: "cesdh-13",    code: "CESDH", label: "Article 13 CESDH (Recours effectif)", body: "Toute personne dont les droits reconnus dans la Convention ont été violés a droit à l'octroi d'un recours effectif devant une instance nationale." },
  { id: "cesdh-prot7-4", code: "CESDH", label: "Article 4 Protocole 7 (Non bis in idem)", body: "Nul ne peut être poursuivi ou puni pénalement par les juridictions du même État pour une infraction pour laquelle il a déjà été acquitté ou condamné par un jugement définitif." },

  // Affaires étoffé
  { id: "ccom-l420-1", code: "Affaires", label: "Article L420-1 (Ententes)", body: "Sont prohibées les actions concertées, conventions, ententes, expresses ou tacites, lorsqu'elles ont pour objet ou peuvent avoir pour effet d'empêcher, restreindre ou fausser le jeu de la concurrence sur un marché." },
  { id: "ccom-l420-2", code: "Affaires", label: "Article L420-2 (Abus de position dominante)", body: "Est prohibée l'exploitation abusive par une entreprise d'une position dominante sur le marché intérieur ou une partie substantielle de celui-ci." },
  { id: "tfue-101",    code: "Affaires", label: "Article 101 TFUE (Ententes UE)", body: "Sont incompatibles avec le marché intérieur tous accords entre entreprises ayant pour objet ou pour effet d'empêcher, de restreindre ou de fausser le jeu de la concurrence." },
  { id: "tfue-102",    code: "Affaires", label: "Article 102 TFUE (Abus position dominante UE)", body: "Est incompatible avec le marché intérieur l'exploitation abusive par une ou plusieurs entreprises d'une position dominante." },
  { id: "loi-sapin2", code: "Affaires", label: "Loi Sapin 2 (2016)", body: "Loi sur la transparence, la lutte contre la corruption et la modernisation économique. Crée l'AFA (Agence française anticorruption). Obligation d'inéligibilité auto pour élus condamnés pour corruption." },
  { id: "loi-vigilance", code: "Affaires", label: "Loi vigilance (2017)", body: "Loi imposant aux grandes entreprises d'établir un plan de vigilance identifiant les risques d'atteintes graves aux droits humains et à l'environnement causées par leurs activités, filiales et sous-traitants." },

  // Notions complémentaires utiles aux 300 cas
  { id: "notion-emprise", code: "Notion", label: "Emprise (violences conjugales)", body: "Ascendant psychologique exercé par un partenaire sur l'autre, paralysant la volonté. Reconnue par la Cass. crim. 2006 pour la légitime défense différée. Évolution majeure en droit pénal des violences." },
  { id: "notion-presomption", code: "Notion", label: "Présomption d'innocence", body: "Toute personne suspectée ou poursuivie est présumée innocente tant que sa culpabilité n'a pas été établie. Article 9-1 du Code civil et 9 DDHC. Dimension pénale et civile (réputation)." },
  { id: "notion-ert", code: "Notion", label: "ERT — Enrichissement sans cause", body: "Théorie civile (article 1303 CC) : celui qui s'enrichit aux dépens d'autrui sans cause légale doit indemniser. Action subsidiaire — uniquement si pas d'autre fondement." },
  { id: "notion-mauvais-foi", code: "Notion", label: "Bonne foi (article 1104)", body: "Les contrats doivent être négociés, formés et exécutés de bonne foi. Disposition d'ordre public — toute clause contraire est nulle. Pierre angulaire du droit moderne des contrats." },
  { id: "notion-force-majeure", code: "Notion", label: "Force majeure (1218 CC)", body: "Événement extérieur, imprévisible et irrésistible empêchant l'exécution d'une obligation, et exonérant le débiteur. Trois critères cumulatifs strictement appliqués par la jurisprudence." },
  { id: "notion-intuitupersonae", code: "Notion", label: "Intuitu personae", body: "Considération de la personne du contractant — certains contrats dépendent de l'identité de la partie (mandat, prestation artistique). La cession ou substitution est interdite sans accord." },
  { id: "notion-discernement", code: "Notion", label: "Discernement (article 122-1 CP)", body: "N'est pas pénalement responsable la personne qui était atteinte d'un trouble psychique ayant aboli son discernement. Atténuation possible si le trouble a altéré (sans abolir) le discernement." },
  { id: "notion-faute-lourde", code: "Notion", label: "Faute lourde", body: "Faute d'une particulière gravité dénotant l'incompétence ou l'incurie de son auteur. Différente de la faute simple — entraîne en droit du travail la perte d'indemnités, en droit civil l'écart des clauses limitatives." },
  { id: "notion-individualisation", code: "Notion", label: "Individualisation des peines", body: "Principe constitutionnel (Conseil constit. 2007) : la peine doit être adaptée à la personnalité de l'auteur et aux circonstances de l'infraction. Limite l'automaticité des peines plancher." },
  { id: "notion-vigilance", code: "Notion", label: "Devoir de vigilance", body: "Obligation pour grandes entreprises (loi 2017) d'identifier et prévenir les atteintes graves aux droits humains, à la santé et à l'environnement dans leur chaîne d'approvisionnement. Sanctions civiles." },

  // Maximes et adages étoffés
  { id: "adage-error", code: "Adage", label: "Errare humanum est, perseverare diabolicum", body: "Il est humain de se tromper, mais persévérer dans l'erreur est diabolique. Justification de la révision des erreurs judiciaires." },
  { id: "adage-summa", code: "Adage", label: "Summum jus, summa injuria", body: "L'application stricte du droit peut produire l'injustice ultime. Principe inspirant l'équité comme correctif." },
  { id: "adage-iuranovit", code: "Adage", label: "Iura novit curia", body: "Le tribunal connaît le droit — les parties doivent invoquer les faits, le juge applique le droit pertinent, même non invoqué expressément." },
  { id: "adage-deminimis", code: "Adage", label: "De minimis non curat praetor", body: "Le préteur ne s'occupe pas des bagatelles — la justice n'a pas à connaître des affaires trop minimes pour mériter sa saisine." },
  { id: "adage-fraus", code: "Adage", label: "Fraus omnia corrumpit", body: "La fraude corrompt tout. Aucun acte juridique frauduleux ne peut produire d'effets — la fraude écarte toutes les protections normalement accordées." },

  // Histoire du droit étoffée
  { id: "hist-beccaria", code: "Histoire", label: "Beccaria (1764)", body: "« Des délits et des peines » fonde le droit pénal moderne : légalité, proportionnalité, abolition de la torture. Influence majeure sur les codes pénaux français et européens." },
  { id: "hist-1958",    code: "Histoire", label: "Constitution 1958 (Ve République)", body: "Constitution rédigée sous De Gaulle, pose les bases d'un exécutif fort. Modifications majeures : 1962 (suffrage universel direct), 2000 (quinquennat), 2008 (modernisation institutions)." },
  { id: "hist-tpie",    code: "Histoire", label: "TPIY / TPIR (1993-1994)", body: "Tribunaux pénaux internationaux pour l'ex-Yougoslavie et le Rwanda. Précédents avant CPI. Premier procès d'un chef d'État ex (Milošević) et premiers verdicts pour génocide post-Nuremberg." },
  { id: "hist-cpi",     code: "Histoire", label: "Cour pénale internationale (2002)", body: "Statut de Rome instituant la CPI. Compétence : crimes de guerre, crimes contre l'humanité, génocide, agression. Subsidiaire — n'agit qu'en cas de défaillance des juridictions nationales." },
  { id: "hist-rgpd-2018", code: "Histoire", label: "Règlement RGPD (2018)", body: "Règlement européen 2016/679 entré en vigueur en mai 2018. Refonte massive du droit des données personnelles : consentement, droits des personnes, sanctions jusqu'à 4 % du CA mondial." },

  // Notions transverses pour catégories grand public (animaux, voisinage, etc.)
  { id: "notion-bien-etre-animal", code: "Notion", label: "Bien-être animal (L214-3 Code rural)", body: "Tout animal étant un être sensible doit être placé par son propriétaire dans des conditions compatibles avec les impératifs biologiques de son espèce. Mauvais traitements punis (L215-11)." },
  { id: "notion-jouissance-paisible", code: "Notion", label: "Jouissance paisible des lieux", body: "Le bailleur doit assurer au locataire la jouissance paisible des lieux loués (article 6 loi 1989). Inclut protection contre troubles de voisinage et obligations de maintenance." },
  { id: "notion-decence", code: "Notion", label: "Logement décent", body: "Décret 2002-120 fixe les critères : superficie minimale, équipements (chauffage, eau, électricité), absence d'humidité grave. Locataire peut exiger remise en état." },
  { id: "notion-saisie", code: "Notion", label: "Saisie immobilière", body: "Procédure d'exécution forcée permettant la vente d'un bien immobilier pour rembourser un créancier. Encadrée par le Code des procédures civiles d'exécution. Délais et publications obligatoires." },
];

// Codex entry pulled from a category-tag mapping (chaque verdict débloque potentiellement une entrée).
const TAG_TO_ENTRIES = {
  penal:        ["cp-311-1", "cp-122-7", "cp-121-3", "cp-122-5", "cp-222-13", "cp-321-1", "cp-433-5", "cp-441-1", "cp-223-6", "cp-313-1", "cp-132-72", "cp-225-1", "cp-227-1", "cp-322-1", "cp-432-11", "cp-433-2", "cp-222-22", "cp-223-1", "cp-323-1", "cp-450-1", "cp-226-1", "cp-222-33-2-2", "cp-434-10", "cp-322-2", "cp-432-12", "cp-313-3", "cpp-1", "cpp-138", "cpp-144", "cpp-revision-485", "cpp-cppcomparu", "ddhc-7", "ddhc-8", "ddhc-9", "concept-doute", "concept-charge", "concept-non-bis", "concept-contradictoire", "adage-nullum", "adage-actori", "proc-comparution", "proc-flagrance", "proc-instruction", "proc-garde", "notion-presomption", "notion-discernement", "notion-individualisation", "notion-emprise"],
  civil:        ["cc-1240", "cc-1242", "cc-1103", "cc-1112-1", "cc-1641", "cc-1359", "cc-815", "cc-832", "cc-9", "cc-1101", "cc-1109", "cc-1131", "cc-1217", "cc-2224", "cc-2232", "cc-1304", "cc-544", "cc-651", "cc-691", "cc-706", "cc-1137", "cc-trouble_voisinage", "cpc-15", "cpc-9", "cpc-700", "concept-prop", "concept-resjudicata", "concept-prescr", "adage-pacta", "adage-audi", "concept-causalite", "notion-mauvais-foi", "notion-force-majeure", "notion-ert"],
  famille:      ["cc-373-2-11", "cc-371-2", "cc-360", "cc-361", "cc-901", "cc-909", "cc-371-1", "cc-388-1", "cc-228", "cc-203", "cc-271", "cc-373-2", "cc-371-4", "cc-389-3", "cc-413-2", "concept-equite", "hist-leonetti", "hist-veil", "hist-pacs", "hist-mariage_pour_tous"],
  travail:      ["ct-l1121-1", "ct-l1232-1", "ct-l1152-1", "ct-l1226-2", "ct-l1237-11", "ct-l3121-1", "ct-l3121-27", "ct-l1235-3", "ct-l3221-2", "ct-l1153-1", "ct-l1233-3", "ct-l4121-1", "ct-l1132-1", "ct-l1221-6", "ct-l1222-4", "ct-l3171-4", "ct-l5213-6", "ct-l1237-13", "css-l461-1", "concept-prop", "esp-droit_social", "notion-vigilance", "loi-vigilance"],
  consommation: ["ccons-l217-7", "ccons-l212-1", "ccons-l221-18", "ccons-l216-1", "ccons-l341-1", "ccons-l312-1", "ccons-l132-1", "ccons-l111-1", "ccons-l622-3", "ccons-l242-1", "ccons-l213-1", "ccons-l215-1", "ccons-l217-3", "ccons-l223-1", "ccons-l121-4", "cmf-l312-1-3"],
  voisinage:    ["ccons-l113-8", "loi-2021-29", "cc-1242", "cc-671", "cc-673", "cc-691", "cc-706", "cc-trouble_voisinage", "notion-jouissance-paisible"],
  routier:      ["cr-r415-5", "cr-r415-7", "cr-l231-1", "cr-l235-1", "cr-l324-2", "cr-l234-1", "cr-r412-6", "cr-r413-14", "cr-r412-6-1", "cr-r412-7", "cr-r415-11", "cr-r417-10", "cr-r417-11", "cp-434-10"],
  numerique:    ["rgpd-6", "rgpd-7", "rgpd-17", "rgpd-32", "rgpd-33", "rgpd-83", "rgpd-35", "cp-226-4-1", "cp-323-1", "cp-222-33-2-2", "cmf-l133-19", "lcen-6", "lcen-9", "lcen-6-2", "lil-82", "loi-2024-deepfake", "loi-1881-29", "loi-dsa", "loi-dma", "loi-aiact", "rgpd-shrems2"],
  environnement: ["cenv-l216-6", "cenv-l411-1", "cc-1247", "cenv-l512-1", "cenv-l341-1", "cenv-l229-5", "cenv-l216-6-spr", "cenv-l218-22", "cenv-l541-3", "cenv-l541-46", "cenv-charte-5", "loi-2019-pesticides", "loi-natura2000", "code-urb-l130-1"],
  propriete_intellectuelle: ["cpi-l335-3", "cpi-l112-1", "cpi-l122-5", "cpi-l713-2", "cpi-l111-1", "cpi-l132-1", "cpi-l611-10", "cpi-l111-1-bis", "cpi-l122-4", "cpi-l713-3", "cpi-l713-5", "cpi-l716-1", "cpi-fairuse"],
  // Catégories grand public — citent des notions et adages
  dilemmes:        ["concept-equite", "concept-doute", "concept-charge", "adage-nullum", "ddhc-2", "cesdh-3"],
  couple_famille:  ["cc-228", "cc-203", "cc-371-1", "concept-equite", "hist-mariage_pour_tous"],
  ado_parents:     ["cc-371-1", "cc-388-1", "concept-equite"],
  boulot:          ["ct-l1121-1", "ct-l1232-1", "ct-l1152-1", "ct-l1153-1", "ct-l3221-2"],
  resto:           ["ccons-l111-1", "ccons-l212-1"],
  animaux:         ["cc-1242", "ccons-l113-8", "notion-bien-etre-animal"],
  quotidien:       ["concept-equite", "ddhc-2", "ddhc-11"],
  ubuesque:     ["concept-equite", "concept-aliquid", "concept-fumus", "adage-falsus", "adage-summa", "adage-deminimis"],
};

export function getCodex() {
  return Storage.getKey("codex", { unlocked: [] });
}

export function isUnlocked(id) {
  return getCodex().unlocked.includes(id);
}

export function unlock(id) {
  if (!CODEX_ENTRIES.find(e => e.id === id)) return false;
  const c = getCodex();
  if (c.unlocked.includes(id)) return false;
  c.unlocked.push(id);
  Storage.setKey("codex", c);
  return true;
}

// Returns ids newly unlocked when judging a case of a category.
export function unlockForCategory(category) {
  const ids = TAG_TO_ENTRIES[category] || [];
  const newly = [];
  for (const id of ids) {
    // 55 % chance per matching entry → progressive collection (60+ entries)
    if (!isUnlocked(id) && Math.random() < 0.55) {
      unlock(id);
      newly.push(id);
    }
  }
  return newly;
}

export function entryById(id) {
  return CODEX_ENTRIES.find(e => e.id === id);
}

export function legifranceUrl(id) {
  return legifranceFor(id);
}

// Search across label + body + code (case-insensitive, accents-insensitive)
export function searchCodex(query) {
  const q = (query || "").trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  if (!q) return CODEX_ENTRIES;
  return CODEX_ENTRIES.filter(e => {
    const hay = (e.label + " " + e.body + " " + e.code).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    return hay.includes(q);
  });
}

export function progress() {
  const c = getCodex();
  return { unlocked: c.unlocked.length, total: CODEX_ENTRIES.length, pct: Math.round((c.unlocked.length / CODEX_ENTRIES.length) * 100) };
}

// Pioche une entrée codex débloquée, dans la catégorie du cas, à mentionner pendant l'audience.
// Retourne null si rien à citer.
export function pickEntryToCite(category) {
  const codex = getCodex();
  if (!codex.unlocked.length) return null;
  const candidates = TAG_TO_ENTRIES[category] || [];
  const unlockedInCategory = candidates.filter(id => codex.unlocked.includes(id));
  if (!unlockedInCategory.length) {
    // Sinon, pioche aléatoire parmi tout débloqué
    return null;
  }
  // Eviter de toujours mentionner la même : utiliser un compteur d'usage
  const usage = Storage.getKey("codex_cited", {});
  const sorted = [...unlockedInCategory].sort((a, b) => (usage[a] || 0) - (usage[b] || 0));
  const chosen = sorted[0];
  usage[chosen] = (usage[chosen] || 0) + 1;
  Storage.setKey("codex_cited", usage);
  return entryById(chosen);
}

// Demande IA pour approfondir une entrée du codex (libre, hors quota daily)
export async function explainMore(entry) {
  const { callAI } = await import("./ai-client.js");
  const { Storage } = await import("./storage.js");
  if (!Storage.getSettings().apiKey) {
    throw new Error("Configurer une clé API pour activer la fonction « En savoir plus » du codex.");
  }
  const systemPrompt = `Tu es professeur de droit français, pédagogique et concis.
Explique l'article ou la notion suivante en 4-6 phrases claires, avec :
- son sens juridique précis
- un exemple concret
- la jurisprudence ou loi clé associée si pertinent
- ce qu'un juge doit retenir au moment de rendre son verdict
Réponds en français, registre soutenu mais accessible. Pas de markdown.`;
  const messages = [{
    role: "user",
    content: `Entrée du codex : « ${entry.label} »\nTexte : ${entry.body}\nDis-m'en plus pour mieux comprendre dans le contexte d'un tribunal.`,
  }];
  const { content } = await callAI(messages, { systemPrompt, maxTokens: 600 });
  return content;
}
