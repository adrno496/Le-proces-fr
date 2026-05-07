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
];

// Codex entry pulled from a category-tag mapping (chaque verdict débloque potentiellement une entrée).
const TAG_TO_ENTRIES = {
  penal:        ["cp-311-1", "cp-122-7", "cp-121-3", "cp-122-5", "cp-222-13", "cp-321-1", "cp-433-5", "cp-441-1", "cp-223-6", "cp-313-1", "concept-doute", "concept-charge", "concept-non-bis", "concept-contradictoire"],
  civil:        ["cc-1240", "cc-1242", "cc-1103", "cc-1112-1", "cc-1641", "cc-1359", "cc-815", "cc-832", "concept-prop", "concept-resjudicata", "concept-prescr"],
  famille:      ["cc-373-2-11", "cc-371-2", "cc-360", "cc-361", "cc-901", "cc-909", "concept-equite", "hist-leonetti"],
  travail:      ["ct-l1121-1", "ct-l1232-1", "ct-l1152-1", "ct-l1226-2", "ct-l1237-11", "concept-prop"],
  consommation: ["ccons-l217-7", "ccons-l212-1", "ccons-l221-18", "ccons-l216-1", "ccons-l341-1"],
  voisinage:    ["ccons-l113-8", "loi-2021-29", "cc-1242"],
  routier:      ["cr-r415-5", "cr-r415-7", "cr-l231-1", "cr-l235-1", "cr-l324-2"],
  numerique:    ["rgpd-6", "rgpd-7", "cp-226-4-1", "cmf-l133-19", "lcen-6"],
  environnement: ["cenv-l216-6", "cenv-l411-1", "cc-1247"],
  propriete_intellectuelle: ["cpi-l335-3", "cpi-l112-1", "cpi-l122-5", "cpi-l713-2"],
  ubuesque:     ["concept-equite", "concept-aliquid", "concept-fumus"],
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
