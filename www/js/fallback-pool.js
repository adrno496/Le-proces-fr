// Pool of 110 fallback cases (10 per category, 11 categories incl. ubuesque) for offline / no-AI play.
// Real categories: anonymized French legal scenarios.
// Ubuesque: deliberately absurd, comic-grave tone — for when the user wants pure fun.
// Each entry: { title, context, prosecutionSpeech, defenseSpeech, difficulty,
//               truth: "guilty"|"innocent", truthClarity: 1-5, prosecutionQuality: 1-5, defenseQuality: 1-5,
//               evidenceHints: [{label, body, weight}] }
// truth = the actual underlying answer, used for post-verdict evaluation.
// truthClarity = how obvious the truth is (5 = open-and-shut, 1 = genuinely ambiguous).
// prosecutionQuality / defenseQuality = how strong each lawyer is (irrespective of who's right).
// evidenceHints = extra metadata for evidence pieces. weight: -2..+2 (negative = innocent-leaning, positive = guilty-leaning).

export const FALLBACK_POOL = {
  // ============================================================
  // PÉNAL (10)
  // ============================================================
  penal: [
    {
      title: "Vol à l'étalage contesté en grande surface",
      context: "Mme L., 34 ans, mère de famille sans antécédent, est interpellée à la sortie d'un hypermarché avec 87 € de produits non scannés (couches, lait infantile, conserves). Elle invoque l'oubli ; le ministère public retient le vol.",
      prosecutionSpeech: "Les faits sont matériellement établis : sept articles de première nécessité dissimulés sous la poussette, aucun ticket de caisse correspondant, et un comportement évasif lors de l'interpellation. La prévenue connaît parfaitement le fonctionnement des caisses automatiques — elle y vient toutes les semaines. L'élément intentionnel ressort de la dissimulation elle-même. La précarité, aussi réelle soit-elle, n'efface pas l'infraction prévue à l'article 311-1 du Code pénal. Une simple admonestation banaliserait le passage à l'acte.",
      defenseSpeech: "Ma cliente vit avec 720 € par mois après le loyer. Le jour des faits, elle gérait seule deux enfants en bas âge dont l'un en pleurs. Aucun antécédent en quinze ans, un emploi stable, aucune fuite à l'interpellation : elle a immédiatement proposé de payer. La théorie de l'« état de nécessité » de l'article 122-7 n'est pas absurde face à des couches et du lait infantile. Au minimum, l'élément intentionnel — la volonté de s'approprier sans payer — n'est pas démontré au-delà du doute raisonnable. Relaxe ou rappel à la loi suffisent.",
      difficulty: 3,
    },
    {
      title: "Brocanteur poursuivi pour recel — connaissance frauduleuse contestée",
      context: "M. T., brocanteur depuis 22 ans, a acheté à un particulier 14 montres anciennes pour 800 €. Trois proviendraient d'un cambriolage non élucidé.",
      prosecutionSpeech: "Quatorze montres anciennes pour 800 €, soit dix fois sous le marché. Un brocanteur de 22 ans d'expérience ne peut ignorer cette anomalie. Aucune facture, aucune copie d'identité conservée. L'article 321-1 du Code pénal réprime celui qui dissimule un bien sachant qu'il provient d'une infraction. La connaissance frauduleuse résulte ici des conditions anormales de l'achat — la jurisprudence est constante. La sanction doit décourager les filières de revente.",
      defenseSpeech: "Mon client a acheté à un particulier qui présentait une carte d'identité (notée mais non photocopiée — pratique courante). Le prix bas s'explique par un lot mélangé contenant des contrefaçons identifiables a posteriori. La connaissance ne se présume pas : il faut la prouver. Vingt-deux ans sans le moindre antécédent. Coopération immédiate, restitution dès l'identification. Au minimum, requalification en achat imprudent — pas en recel intentionnel.",
      difficulty: 3,
    },
    {
      title: "Échauffourée à la sortie d'une discothèque — légitime défense ?",
      context: "À 2 h du matin, M. R. blesse au visage M. K. devant une discothèque. ITT 5 jours, fracture du nez. La vidéo de surveillance est ambiguë sur l'enchaînement.",
      prosecutionSpeech: "M. R. a porté un coup au visage de M. K. ITT 5 jours, fracture du nez. La vidéo montre clairement le geste de l'accusé. La provocation alléguée — une bousculade — ne justifie pas une riposte d'une telle violence. La légitime défense suppose une atteinte injustifiée et une riposte proportionnée. Ni l'une ni l'autre n'est ici démontrée. L'article 222-13 du Code pénal s'applique. La consommation d'alcool est circonstance aggravante, pas atténuante.",
      defenseSpeech: "M. K. a poussé violemment mon client par derrière. La vidéo le montre — l'accusation préfère l'occulter. Le réflexe a été instantané, dans la fraction de seconde où mon client croyait à une agression. La proportionnalité s'apprécie in concreto : un coup au visage face à une bousculade qui pouvait préluder à pire. La légitime défense, si elle est ici incomplète, justifie au minimum une atténuation marquée — pas la peine plein régime.",
      difficulty: 3,
    },
    {
      title: "Test salivaire positif — délai depuis consommation discuté",
      context: "M. F. est contrôlé positif au cannabis lors d'un contrôle routier. Le test salivaire détecte des traces. Il affirme ne pas avoir consommé depuis 36 h et présente des tests psychomoteurs négatifs.",
      prosecutionSpeech: "Le test salivaire est positif. L'article L235-1 du Code de la route réprime la conduite après usage de stupéfiants — peu importe l'ancienneté de la consommation, dès lors que la substance reste détectable. La jurisprudence de la chambre criminelle ne distingue pas conduite altérée et simple présence. La sécurité routière commande la fermeté. Retrait de permis et peine plancher s'imposent.",
      defenseSpeech: "Consommation remontant à 36 heures, aucune altération comportementale au moment du contrôle. L'article L235-1, dans sa rédaction actuelle, est questionné par la jurisprudence européenne sous l'angle du principe de nécessité (CJUE 2022). Une consommation lointaine, sans aucun effet sur les facultés, ne peut être sanctionnée comme une vraie conduite dangereuse. Sursis avec mise à l'épreuve est ici la solution équilibrée.",
      difficulty: 3,
    },
    {
      title: "Geste vers un agent — outrage caractérisé ou réflexe ?",
      context: "Lors d'un contrôle d'identité, M. P. aurait fait un geste insultant à un agent. Il conteste : « j'ai juste levé les bras d'exaspération. » Pas de témoin neutre, pas de vidéo.",
      prosecutionSpeech: "Le geste est sans équivoque. L'agent l'a constaté dans l'exercice de ses fonctions. La parole de l'agent dépositaire de l'autorité publique fait foi sauf preuve contraire. L'article 433-5 du Code pénal réprime l'outrage. Le contexte tendu n'excuse pas le manque de respect — au contraire, il l'aggrave en dégradant l'autorité publique aux yeux du public. Une amende dissuasive et un stage de citoyenneté s'imposent.",
      defenseSpeech: "La parole d'un agent fait foi jusqu'à preuve contraire — et ici, mon client conteste fermement. Aucun témoin neutre, aucune vidéo. Un geste d'exaspération mal interprété ne saurait constituer un outrage caractérisé, qui suppose une intention d'humilier. Le doute sur l'intention doit profiter à l'accusé. Le Conseil constitutionnel rappelle que l'outrage ne doit pas devenir un délit d'opinion. Relaxe ou avertissement.",
      difficulty: 2,
    },
    {
      title: "Fausse attestation employeur pour bail — faux ou exagération ?",
      context: "Mme V., en recherche de logement, a établi une attestation employeur surévaluant ses revenus pour décrocher le bail. Le bailleur découvre la fraude après 4 mois de paiements réguliers.",
      prosecutionSpeech: "Mme V. a fabriqué un document mentionnant un employeur fictif et des revenus inexistants. Le faux a permis l'obtention du bail. L'article 441-1 du Code pénal sanctionne sévèrement faux et usage. Peu importe que les loyers aient été payés : le préjudice est en amont, dans la confiance trompée. La régulation locative repose sur la sincérité des dossiers — tolérer ce type de fraude paralyserait le marché. Sanction dissuasive requise.",
      defenseSpeech: "Ma cliente a présenté sous une forme exagérée des revenus réels (auto-entreprise non déclarée à l'employeur). Aucun préjudice : tous les loyers ont été payés à l'heure. Le faux suppose une atteinte à la vérité dans un document qui fait preuve par lui-même — une attestation employeur n'a pas cette force probante absolue. Au pire, escroquerie tentée non aboutie en préjudice — la sanction doit être proportionnée à la seule intention.",
      difficulty: 4,
    },
    {
      title: "Détention de stupéfiants — usage personnel ou trafic ?",
      context: "M. B., 23 ans, est interpellé avec 47 grammes de cannabis et 800 € en numéraire. Il invoque l'usage personnel et un loyer perçu en espèces, justifié par bail.",
      prosecutionSpeech: "Quarante-sept grammes — environ trois mois de consommation maximum admise. Huit cents euros en numéraire dans un quartier connu pour le trafic. La détention est proche du seuil de la revente. La jurisprudence considère ce type de profil comme « petit revendeur », même sans transaction constatée. L'article 222-37 du Code pénal s'applique. La distinction usage/trafic ne peut reposer sur la seule parole du prévenu.",
      defenseSpeech: "Quarante-sept grammes correspondent à 3 mois de consommation pour un usager régulier. Mon client présente une attestation médicale d'auto-médication non encadrée (douleurs chroniques). Les 800 € proviennent d'un loyer perçu, démontré par bail et reçu. Aucune balance, aucun emballage de revente, aucun contact-revendeur identifié. La présomption de bonne foi de l'usager doit jouer. Au pire, contravention pour usage. Pas de trafic.",
      difficulty: 3,
    },
    {
      title: "Stationnement gênant — distance contestée à 5 mètres près",
      context: "M. C. conteste une amende pour stationnement à moins de 5 m d'une bouche d'incendie. Il prouve, photographies à l'appui, qu'il était à 5,2 m. Le marquage au sol était effacé depuis plus de 6 mois.",
      prosecutionSpeech: "L'article R417-10 réprime le stationnement à moins de 5 mètres en amont d'un point de croisement, signalé ou non. La proximité d'une bouche d'incendie impose une vigilance particulière. Cinq mètres est un seuil minimum de sécurité incendie : le respecter à 20 cm près n'est pas négociable. L'agent verbalisateur a constaté le manquement, et son procès-verbal fait foi jusqu'à preuve contraire.",
      defenseSpeech: "Mon client était à 5,2 m — au-delà du seuil. La photographie produite, datée et géolocalisée, en fait foi. L'absence de marquage au sol (effacé depuis plus de 6 mois selon Street View historique) crée une situation où le conducteur ne peut anticiper précisément la zone interdite. Le doute factuel sur la position exacte (l'agent n'a pas mesuré) doit profiter au prévenu. Verbalisation à annuler ou réduire à minima.",
      difficulty: 2,
    },
    {
      title: "Erreur d'étiquetage en magasin — vol ou contestation ?",
      context: "Mme L. a payé 12 € pour un produit cosmétique étiqueté à 12 € en rayon, alors que le prix réel en caisse était 38 €. Le magasin l'accuse de vol après qu'elle a maintenu le prix bas.",
      prosecutionSpeech: "Mme L. a sciemment exploité une erreur d'étiquetage manifeste. Un produit cosmétique haut de gamme à 12 € au lieu de 38 € éveille nécessairement l'attention de tout consommateur de bonne foi. L'article 311-1 réprime la soustraction frauduleuse — ici, la fraude consiste à utiliser un prix manifestement erroné pour s'enrichir indûment. La théorie de l'erreur ne saurait absoudre celui qui en tire profit en connaissance de cause.",
      defenseSpeech: "Le prix affiché en rayon engage le commerçant — principe constant du droit de la consommation (Cass. 1ʳᵉ civ. 2018). Aucune obligation pour le client de connaître le prix « véritable ». Ma cliente a payé le prix demandé selon l'étiquetage qu'elle a vu. Aucune dissimulation, aucun acte frauduleux. Le commerçant porte l'entière responsabilité de son étiquetage. Qualifier ce comportement de vol étend abusivement le champ pénal. Relaxe.",
      difficulty: 2,
    },
    {
      title: "Témoin d'accident — appel aux secours suffit-il ?",
      context: "Mme G. a vu un cycliste tomber à minuit. Elle a téléphoné aux secours mais ne s'est pas approchée. Le cycliste, blessé, a été heurté par un autre véhicule 4 minutes plus tard.",
      prosecutionSpeech: "Mme G. a vu, su, et n'a pas agi physiquement. L'article 223-6 du Code pénal réprime celui qui s'abstient volontairement de porter assistance, alors qu'il pouvait sans risque pour lui. Téléphoner ne suffit pas si une action plus directe (signaler la voie avec son véhicule en feux) était possible. Le second accident, prévisible, démontre l'insuffisance du seul appel. La sanction doit affirmer le devoir de secours actif.",
      defenseSpeech: "Ma cliente a appelé immédiatement le 18. Elle est seule, à minuit, sur une route fréquentée — s'exposer pour signaler la voie aurait pu provoquer un sur-accident, mettant sa propre vie en danger. La loi exige assistance « sans risque pour soi ». L'appréciation du risque incombe à l'agent au moment des faits, pas au juge a posteriori. L'appel d'urgence était l'acte raisonnable et proportionné. Aucune abstention coupable.",
      difficulty: 5,
    },
  ],

  // ============================================================
  // CIVIL (10)
  // ============================================================
  civil: [
    {
      title: "Loyers impayés et logement insalubre — qui doit à qui ?",
      context: "M. D. réclame 4 800 € de loyers impayés à sa locataire Mme R. ; celle-ci reconvient, produisant photos et rapport d'huissier attestant d'humidité, infiltrations et chaudière HS depuis 8 mois.",
      prosecutionSpeech: "Le bail est clair, signé par les deux parties, et le loyer mensuel de 600 € n'a plus été versé depuis huit mois. Les obligations sont synallagmatiques : on ne peut pas habiter un logement et refuser de payer. Si la locataire estimait le bien indécent, elle disposait de la procédure prévue par la loi du 6 juillet 1989 — saisir la commission départementale, demander une consignation au juge — non de l'auto-justice. La résiliation et l'expulsion s'imposent.",
      defenseSpeech: "Ma cliente a signalé par recommandé, à sept reprises, des infiltrations qui ont rendu deux pièces sur trois inhabitables. Le rapport d'huissier du 12 février établit un taux d'humidité de 78 % et l'absence totale de chauffage. L'article 6 de la loi de 1989 fait peser sur le bailleur une obligation de délivrance d'un logement décent. La compensation entre loyers dus et préjudice de jouissance est légitime ; subsidiairement, une réduction de loyer rétroactive de 50 % serait mathématiquement justifiée.",
      difficulty: 4,
    },
    {
      title: "Bail commercial — déspécialisation contestée par le bailleur",
      context: "Mme S. exploite une boutique de prêt-à-porter dans un local commercial. Elle souhaite ajouter un coin restauration. Le bailleur s'y oppose au nom du bail initial.",
      prosecutionSpeech: "Le bail commercial signé en 2019 mentionne expressément « commerce de prêt-à-porter exclusivement ». L'article L145-47 du Code de commerce subordonne toute déspécialisation partielle à l'accord du bailleur ou à l'autorisation judiciaire. Une activité de restauration entraîne des nuisances olfactives, sonores et de fréquentation incompatibles avec l'environnement de l'immeuble. Mon client conserve un intérêt légitime à préserver l'usage convenu. Refus motivé maintenu.",
      defenseSpeech: "L'article L145-47 admet la déspécialisation partielle si elle est connexe ou complémentaire à l'activité initiale. Vendre des accessoires + un coin café-snacking est aujourd'hui un standard du retail. Aucune nuisance objective : ventilation aux normes, horaires identiques. Le bailleur s'oppose pour des raisons étrangères au préjudice — vraisemblablement pour renégocier le loyer. Le tribunal doit autoriser cette adaptation indispensable à la survie économique du commerce.",
      difficulty: 4,
    },
    {
      title: "Donation contestée — captation d'héritage alléguée",
      context: "Mme E., 87 ans, a fait donation de sa maison à son aide-soignante 18 mois avant son décès. La fille de Mme E. attaque la donation, invoquant un état d'altération cognitive.",
      prosecutionSpeech: "Mme E. présentait, six mois avant la donation, un certificat médical mentionnant des troubles cognitifs débutants. La donataire — son aide-soignante exclusivement présente au domicile — est en situation de dépendance affective et matérielle de la défunte. L'article 909 du Code civil interdit aux personnes ayant donné soin de recevoir donation. La nullité s'impose, et la maison doit revenir dans la succession au bénéfice de la fille.",
      defenseSpeech: "L'article 909 vise les médecins, pharmaciens, ministres du culte — la jurisprudence l'étend mais avec prudence. Une aide-soignante salariée d'une structure tierce, ayant fini son contrat 4 mois avant la donation, n'entre pas dans la liste. Mme E. était lucide, comme l'attestent quatre témoins et le notaire qui a recueilli son consentement éclairé. La fille n'a vu sa mère que deux fois en cinq ans. La donation est valable et expression libre d'une gratitude justifiée.",
      difficulty: 5,
    },
    {
      title: "Travaux non conformes — artisan ou maître d'ouvrage ?",
      context: "M. K. a commandé une terrasse à un artisan. Six mois après, des fissures apparaissent. L'artisan invoque un défaut du sol non signalé ; le client invoque un défaut d'exécution.",
      prosecutionSpeech: "L'expertise produite démontre une fondation insuffisante au regard des normes DTU 13.12. L'artisan, professionnel, est tenu d'une obligation de résultat sur la solidité de l'ouvrage. L'article 1792 du Code civil pose une présomption de responsabilité pour les dommages compromettant la solidité. La théorie du « défaut du sol » suppose un sol manifestement défectueux non décelable — ce qui n'est pas le cas ici (sol argileux courant). Indemnisation due.",
      defenseSpeech: "Le sol présente une argile gonflante exceptionnellement réactive non détectable sans étude géotechnique préalable, étude que le maître d'ouvrage a refusée pour des raisons de coût. L'article 1792 cède devant la cause étrangère. Mon client a respecté les DTU pour un sol normal — l'anormalité du sol était imprévisible. Le partage de responsabilité doit refléter le refus de l'étude par le client.",
      difficulty: 4,
    },
    {
      title: "Caution invoquée — défaut d'information annuelle",
      context: "Mme T. s'est portée caution d'un prêt étudiant de son neveu. La banque la poursuit pour 18 000 €. Elle conteste : la banque ne lui a jamais envoyé l'information annuelle obligatoire.",
      prosecutionSpeech: "L'engagement de caution est valide, signé en 2018 avec mention manuscrite réglementaire. Le neveu a fait défaut. La banque a respecté l'envoi annuel à l'adresse de notification figurant au dossier. L'article L313-22 du Code monétaire et financier impose l'information mais l'absence éventuelle entraîne déchéance des intérêts, non extinction de la dette principale. Mme T. doit le capital — 14 800 € — à tout le moins.",
      defenseSpeech: "La banque ne produit aucun avis d'envoi recommandé. Sept années sans aucune information : ma cliente ignorait que le neveu cumulait les défauts depuis 2020. Elle aurait pu intervenir pour limiter la dette. L'article L313-22 sanctionne par la déchéance des intérêts (admis), mais la jurisprudence récente (Cass. com. 2023) considère qu'un manquement systématique ouvre droit à dommages-intérêts compensatoires. Compensation totale demandée.",
      difficulty: 4,
    },
    {
      title: "Cession de fonds — vice caché sur la clientèle",
      context: "M. B. a acheté un salon de coiffure 95 000 € en mars. Il découvre en juin que 60 % de la clientèle suivait l'ancienne coiffeuse partie monter sa propre boutique à 800 m.",
      prosecutionSpeech: "La cédante a manifestement préparé son départ, organisé une concurrence directe, et conservé le numéro de téléphone professionnel utilisé pour informer les clientes. Le fonds vendu — pour l'essentiel sa clientèle — était vidé de sa substance. L'article 1641 du Code civil sanctionne le vice caché ; subsidiairement, l'article 1112-1 sanctionne le manquement à l'obligation précontractuelle d'information. Réduction du prix de 50 % minimum.",
      defenseSpeech: "Une coiffeuse ne peut être interdite à vie d'exercer son métier — c'est la liberté constitutionnelle d'entreprendre. Aucune clause de non-concurrence n'avait été négociée (le cessionnaire l'aurait fait s'il l'avait jugée utile). L'attachement de la clientèle à une personne plutôt qu'à un local est un risque inhérent à toute reprise de commerce de service. Mon client n'a fait que reprendre son activité dans un nouveau local — pas constitué le démantèlement d'un fonds.",
      difficulty: 5,
    },
    {
      title: "Contrat de prêt entre proches — preuve écrite contestée",
      context: "M. M. réclame 12 000 € à son cousin, somme prêtée selon lui en 2021 par virement. Le cousin invoque un don pour l'achat d'une voiture.",
      prosecutionSpeech: "L'article 1359 du Code civil exige une preuve écrite au-delà de 1 500 €. Mais le virement est documenté, daté, et le motif manuscrit lors du transfert mentionnait « avance ». La cour considère ce mot comme un commencement de preuve par écrit, complété par les SMS produits où le défendeur écrit « je te rends quand je peux ». Conjugaison de présomptions : la dette existe et doit être restituée.",
      defenseSpeech: "« Avance » n'est pas « prêt ». En famille, ce mot peut désigner un don anticipé sur succession future. Les SMS « je te rends quand je peux » s'expliquent par la pression sociale d'un cousin insistant — pas par la reconnaissance d'une obligation juridique. L'article 1359 impose un acte sous seing privé pour un prêt de 12 000 €. À défaut, c'est au demandeur de rapporter la preuve par tous moyens — preuve insuffisante ici. Rejet de la demande.",
      difficulty: 4,
    },
    {
      title: "Trouble de jouissance — bruits perpétuels d'un commerce voisin",
      context: "Mme A., copropriétaire en rez-de-chaussée d'un immeuble, voit ouvrir au sous-sol un atelier de mécanique-vélo. Bruits réguliers, vibrations, livraisons matinales.",
      prosecutionSpeech: "Le règlement de copropriété autorise les commerces de proximité non bruyants. Une mécanique-vélo, professionnelle, génère bruits d'outils, vibrations et livraisons à 6 h du matin. Les expertises acoustiques produites attestent de niveaux supérieurs à 65 dB le matin. L'article 9 de la loi de 1965 sur les troubles de jouissance s'applique. Cessation immédiate de l'activité ou aménagement majeur — et indemnisation du préjudice.",
      defenseSpeech: "L'article 9 protège mais n'interdit pas les commerces — il exige seulement le respect des règles de copropriété. Mon client a investi 35 000 € en isolation phonique, abaissant ses émissions à 52 dB en limite — sous le seuil légal. Les livraisons à 6 h sont rares et conformes au règlement de marché. La demande relève d'une opposition de principe à toute activité commerciale, non d'un préjudice réel et durable.",
      difficulty: 3,
    },
    {
      title: "Rupture brutale d'une relation commerciale — préavis insuffisant",
      context: "L'entreprise H. fournissait depuis 11 ans la chaîne de magasins X. en composants. X. rompt sans préavis. H. réclame 380 000 €.",
      prosecutionSpeech: "Onze années de relation, pour 60 % du chiffre d'affaires de mon client. Aucun préavis. L'article L442-1 II du Code de commerce sanctionne la rupture brutale, peu importe l'absence de contrat-cadre. La jurisprudence retient en moyenne un mois de préavis par année — soit 11 mois minimum ici. Le préjudice — marge perdue + restructuration nécessaire + licenciements — atteint 380 000 €. Indemnisation pleine.",
      defenseSpeech: "La relation reposait sur des bons de commande successifs, sans aucun engagement de durée. Mon client a constaté une dégradation continue de la qualité depuis 18 mois (taux de défauts × 4) qu'il a signalée à plusieurs reprises. La rupture, motivée et anticipée par les avertissements, n'est ni brutale ni abusive. Au demeurant, le préjudice allégué confond marge brute et marge nette — réfaction d'au moins 70 %.",
      difficulty: 4,
    },
    {
      title: "Indivision successorale bloquée — vente forcée demandée",
      context: "Trois frères et sœurs héritent d'une maison de famille. Deux veulent vendre, le troisième s'oppose et y vit depuis 6 ans sans verser d'indemnité d'occupation.",
      prosecutionSpeech: "L'article 815 du Code civil pose le principe : « nul n'est tenu de demeurer dans l'indivision ». Six ans bloqués, deux indivisaires demandent légitimement la sortie. L'occupant exclusif doit en outre une indemnité d'occupation au pro-rata. Le partage doit être ordonné, la maison vendue par licitation, et l'indemnité d'occupation imputée sur la part du défendeur. Le maintien forcé n'est pas tenable.",
      defenseSpeech: "Mon client habite la maison parce qu'il y a soigné ses parents pendant 8 ans, économisant aux co-héritiers les frais d'EHPAD. Il a entretenu et amélioré le bien (devis et factures pour 28 000 €). L'indemnité d'occupation doit être compensée par ces apports. Surtout, la jurisprudence permet l'attribution préférentielle (article 832) à l'héritier qui occupe et entretient. Vente forcée à éviter — attribution avec soulte à organiser.",
      difficulty: 4,
    },
  ],

  // ============================================================
  // FAMILLE (10)
  // ============================================================
  famille: [
    {
      title: "Garde alternée contestée après déménagement professionnel",
      context: "Après séparation, garde alternée homologuée pour Lina, 7 ans. Le père reçoit une mutation à 350 km. Il sollicite le maintien de l'alternance par week-ends prolongés ; la mère demande la résidence principale chez elle.",
      prosecutionSpeech: "L'intérêt supérieur de l'enfant — boussole de l'article 373-2-11 du Code civil — commande la stabilité. Lina est scolarisée depuis trois ans dans la même école, ses repères, ses amis, ses activités sont ici. Imposer 700 km par quinzaine à une enfant de 7 ans, c'est sacrifier son équilibre à la carrière d'un parent. La résidence principale chez la mère, avec droit de visite élargi, est conforme à la jurisprudence constante en matière d'éloignement géographique.",
      defenseSpeech: "L'éloignement n'est pas un choix de confort : c'est une mutation imposée, refusée vaut licenciement. Mon client a démontré sept ans d'investissement parental quotidien — école, médecin, devoirs. Couper ce lien à un week-end sur deux serait une rupture brutale et injustifiée. Une formule alternée par périodes scolaires plus longues, déjà retenue dans plusieurs arrêts récents, préserve la double parentalité. Un père actif vaut mieux pour Lina qu'un père réduit à l'occasionnel.",
      difficulty: 5,
    },
    {
      title: "Pension alimentaire — révision à la baisse demandée",
      context: "M. J. paie 450 €/mois pour ses deux enfants. Il a perdu son emploi il y a 5 mois et n'a plus que 1 100 € (chômage). Il demande révision à 200 €.",
      prosecutionSpeech: "La pension a été fixée selon les besoins des enfants — qui n'ont pas baissé : transport scolaire, activités, restauration. La perte d'emploi est temporaire ; mon adversaire a fait deux refus de poste documentés. L'article 371-2 du Code civil maintient le principe de contribution proportionnée aux besoins. Une révision drastique pénaliserait les enfants pour la mauvaise volonté de leur père. Maintien à 450 € — au pire, baisse modérée.",
      defenseSpeech: "Mon client a perdu son emploi pour cause économique objective. Ses 1 100 € ne couvrent ni son loyer (520 €) ni ses charges minimales. Les « refus de poste » concernent des emplois à 600 km — incompatibles avec son droit de visite. L'article 371-2 commande proportionnalité aux ressources et aux besoins. La pension doit être révisée à 200 € pendant la période de chômage, avec reprise progressive en cas de retour à l'emploi. Solution équilibrée.",
      difficulty: 3,
    },
    {
      title: "Autorité parentale — conflit sur scolarisation privée",
      context: "Les parents séparés sont en désaccord sur la scolarisation de leur fils de 11 ans. Le père veut le mettre dans le privé (3 600 €/an). La mère refuse — elle ne peut pas payer la moitié.",
      prosecutionSpeech: "Le passage en 6ᵉ est crucial. L'établissement public local affiche un taux d'encadrement dégradé et des résultats moyens. Le privé proposé est à 7 km, transports OK, encadrement fort, projet bilingue. Mon client est prêt à assumer 100 % du coût. L'article 372 du Code civil fait des deux parents les détenteurs de l'autorité — mais en cas de désaccord, le juge tranche selon l'intérêt de l'enfant. Cet intérêt commande l'accès à un meilleur cadre.",
      defenseSpeech: "L'établissement public proposé est noté A par les classements indépendants. Le privé proposé est confessionnel — choix qui engage profondément l'éducation. L'enfant lui-même, entendu, préfère rester avec ses amis. La prise en charge à 100 % par le père crée une asymétrie d'influence éducative. Le juge ne peut imposer ni privé ni confession. Maintien dans le public, sauf accord parental réel — refusé ici.",
      difficulty: 4,
    },
    {
      title: "Reconnaissance de paternité tardive — contestation à 22 ans",
      context: "Léa, 22 ans, conteste la paternité juridique de M. P. (mari de sa mère) après un test ADN positif avec M. F., son père biologique. M. P. l'a élevée 22 ans.",
      prosecutionSpeech: "Le test ADN est sans appel. M. P. n'est pas le père biologique. L'article 333 du Code civil permet à l'enfant de contester la paternité dans les 10 ans à compter de sa majorité — Léa est dans les délais. La vérité biologique a vocation à prévaloir, principe constant en matière de filiation. Léa souhaite voir reconnu son père réel, M. F., qui consent. Action accueillie.",
      defenseSpeech: "M. P. a élevé Léa pendant 22 ans, l'a aimée comme sa fille, a financé ses études. La possession d'état est constante, paisible et publique. L'article 314 et la jurisprudence consacrent la primauté de la vérité affective et sociale sur la vérité biologique lorsque la possession d'état est aussi forte. Détruire cette filiation à 22 ans est un séisme injuste pour M. P. La filiation peut être complétée (reconnaissance par M. F.) sans détruire celle existante.",
      difficulty: 5,
    },
    {
      title: "Succession — testament olographe contesté pour faiblesse mentale",
      context: "M. R., 91 ans, a rédigé six mois avant sa mort un testament léguant tout à une voisine. Le fils unique conteste, médecin traitant produisant un certificat de troubles cognitifs.",
      prosecutionSpeech: "Le testament olographe doit émaner d'un esprit sain. Le certificat médical du 14 mars (4 mois avant le testament) constate des troubles avec désorientation. La voisine, présente quotidiennement, est en position d'influence. L'article 901 du Code civil exige une saine raison. La nullité s'impose ; la succession revient au fils, héritier réservataire, conformément à l'article 913.",
      defenseSpeech: "Le certificat évoque des troubles légers et compatibles avec une rédaction simple — pas une démence empêchant tout acte. Le testament est court, lisible, daté, signé. Trois témoins présents le jour de la rédaction confirment la lucidité. Le fils a abandonné son père pendant 12 ans (pas une visite documentée). La voisine s'est occupée de lui sans contrepartie. L'expression de gratitude par testament est l'exercice légitime de la liberté testamentaire.",
      difficulty: 5,
    },
    {
      title: "Divorce — prestation compensatoire en débat",
      context: "Mariage de 18 ans. Mme S. (40 ans) a renoncé à sa carrière pour les enfants. Salaire actuel 1 800 € ; M. S. gagne 6 200 €. Elle demande 90 000 € de prestation compensatoire.",
      prosecutionSpeech: "Article 270 du Code civil : la prestation compense la disparité créée par la rupture du mariage. Disparité majeure : 4 400 € de différence mensuelle, 18 ans de mariage, sacrifice de carrière documenté (CV interrompu 12 ans). La méthode forfaitaire de la jurisprudence aboutit à 90 000 €, voire plus. Mon adversaire est en mesure de payer sans ruine. La prestation est due intégralement.",
      defenseSpeech: "Mme S. a son propre logement (héritage maternel récent), une stabilité professionnelle progressante (formation suivie + augmentation prévue), et bénéficie d'une pension alimentaire pour les enfants déjà conséquente. La prestation est compensatoire, non punitive. Le calcul forfaitaire ignore ces éléments. 45 000 € — soit la moitié — est l'équilibre proportionné. Mon client doit pouvoir reconstruire sa vie sans charge écrasante de 8 ans.",
      difficulty: 4,
    },
    {
      title: "Tutelle d'un majeur vulnérable — choix du tuteur familial",
      context: "M. D., 73 ans, AVC sévère, est sous tutelle. Son fils et sa sœur se disputent la fonction de tuteur. La sœur produit attestations de proches ; le fils vit à 600 km.",
      prosecutionSpeech: "L'article 449 du Code civil donne préférence au tuteur familial proche, capable de gérer au quotidien. Ma cliente, sœur du majeur, vit à 4 km, le visite trois fois par semaine, gère déjà ses affaires courantes depuis l'AVC. Le fils, à 600 km, ne peut assurer le suivi médical et patrimonial nécessaire. Sa désignation, malgré le lien filial, serait contraire à l'intérêt du majeur protégé.",
      defenseSpeech: "Le fils est l'héritier légal et le proche le plus naturel. La distance géographique ne disqualifie pas (vidéo, déplacements mensuels, mandataire local possible). La sœur, elle-même fragile (76 ans, dossiers médicaux à l'appui), n'est pas en mesure d'assumer la tutelle dans la durée. Mon client est prêt à organiser une co-tutelle ou un subrogé local. Solution familiale équilibrée.",
      difficulty: 4,
    },
    {
      title: "Adoption simple — opposition de l'enfant majeur",
      context: "Mme T., 67 ans, veut adopter en simple Théo, 28 ans, fils de son mari décédé. Théo s'y oppose : il craint les implications successorales.",
      prosecutionSpeech: "L'article 360 du Code civil ouvre l'adoption simple sans condition d'âge — seul l'intérêt légitime importe. Ma cliente a élevé Théo entre 8 et 18 ans. Le lien affectif est documenté (photographies, courriers, témoignages d'amis). L'opposition de Théo, motivée par le seul calcul financier (sa part d'héritage), n'est pas légitime. L'article 361 admet l'adoption sans consentement de l'adopté majeur si l'opposition n'est pas fondée. Adoption demandée.",
      defenseSpeech: "L'article 361 exige le consentement de l'adopté majeur — c'est la règle. Théo refuse, point. Le calcul successoral n'est pas l'unique motivation : il évoque aussi un lien réel mais qui n'est pas celui d'un parent. La jurisprudence respecte la liberté de la personne majeure de refuser une filiation. Une volonté d'inscrire la mémoire affective ne saurait s'imposer juridiquement contre son gré.",
      difficulty: 5,
    },
    {
      title: "Pension alimentaire après séparation — concubinage non marié",
      context: "Mme C. et M. V. ont vécu en concubinage 14 ans, ont une fille. Séparation. Mme C. demande pension pour la fille (10 ans) + indemnité concubinage. M. V. refuse l'indemnité.",
      prosecutionSpeech: "La pension pour l'enfant (article 371-2) est de droit ; M. V. y consent à 380 €. Mais l'indemnité de concubinage est aussi reconnue par la jurisprudence : ma cliente a quitté son emploi pendant 6 ans pour s'occuper de leur fille et participer à l'entreprise familiale de M. V. La théorie de l'enrichissement sans cause s'applique : 24 000 € de compensation pour ces années de travail non rémunéré.",
      defenseSpeech: "Le concubinage n'ouvre pas de régime matrimonial — c'est précisément ce qui distingue concubinage et mariage. Ma cliente a fait un choix de vie, pas un sacrifice imposé. Elle a bénéficié pendant 14 ans du logement et du train de vie de mon client sans contribuer aux charges. L'enrichissement sans cause exige un appauvrissement objectif et corrélatif — non démontré ici. Pension pour l'enfant oui, indemnité concubinage non.",
      difficulty: 4,
    },
    {
      title: "Mariage — nullité demandée pour défaut de consentement",
      context: "Mme F. demande annulation de son mariage célébré 4 mois plus tôt, invoquant l'erreur sur les qualités essentielles : son mari lui a caché qu'il avait été condamné pour fraude.",
      prosecutionSpeech: "L'article 180 du Code civil permet la nullité pour erreur sur les qualités essentielles de la personne. Une condamnation pénale pour fraude, dissimulée au moment du mariage, touche à l'intégrité morale — qualité essentielle pour décider de s'unir. La jurisprudence (Cass. 1ʳᵉ civ. 2021) admet ce type d'erreur. L'union doit être annulée, ma cliente n'aurait pas consenti en connaissance.",
      defenseSpeech: "La condamnation date de 12 ans, purgée. Mon client n'avait pas l'obligation légale de la révéler. L'article 180 vise les qualités essentielles à la vie commune (santé, projet d'enfant, moralité immédiate) — pas un passé pénal lointain et purgé. Admettre cette nullité créerait une obligation générale de transparence rétroactive contraire au droit à l'oubli. Maintien du mariage ; séparation possible par divorce ordinaire.",
      difficulty: 5,
    },
  ],

  // ============================================================
  // TRAVAIL (10)
  // ============================================================
  travail: [
    {
      title: "Licenciement pour faute grave après publication réseau social",
      context: "M. K., commercial depuis 9 ans, est licencié pour faute grave après une publication Facebook critiquant publiquement son employeur (« direction toxique »). 12 likes, profil semi-public, 47 « amis ».",
      prosecutionSpeech: "La publication, accessible au-delà du cercle privé, met en cause nommément l'entreprise auprès de clients et concurrents potentiels. La loyauté contractuelle, principe cardinal en droit du travail, interdit cette mise en pâture publique. La Cour de cassation a admis à plusieurs reprises le licenciement pour faute grave en pareil cas. L'ancienneté n'efface pas la rupture du lien de confiance, et la dispense de préavis est ici justifiée par l'urgence à protéger la réputation de l'entreprise.",
      defenseSpeech: "Le « public » d'un profil avec 47 amis dont 35 collègues n'est pas un public au sens journalistique. La liberté d'expression du salarié, consacrée par l'article L1121-1, ne s'arrête pas à la porte de l'entreprise. La publication ne contient ni injure ni diffamation, et n'a généré aucun préjudice mesurable. Neuf ans d'ancienneté sans le moindre incident : la sanction proportionnée serait un avertissement. La faute grave — qui prive de toute indemnité — est manifestement excessive.",
      difficulty: 4,
    },
    {
      title: "Harcèlement moral allégué par une cadre — preuve par faisceau d'indices",
      context: "Mme P., responsable RH 11 ans, dénonce harcèlement moral après réorganisation : ses dossiers sont retirés un par un, son bureau déplacé sans avis, refus de tout entretien d'évaluation depuis 18 mois.",
      prosecutionSpeech: "L'article L1152-1 définit le harcèlement par une dégradation des conditions de travail et un effet sur la santé. Les faits — retrait progressif de responsabilités, isolement matériel, mutisme hiérarchique — forment un faisceau cohérent. L'arrêt-maladie et le suivi psychiatrique attestent du préjudice. L'employeur doit démontrer que ces décisions sont étrangères au harcèlement. Cette preuve n'est pas rapportée. Reconnaissance et indemnisation pleines.",
      defenseSpeech: "La réorganisation, planifiée depuis 2 ans, concerne 12 cadres et n'a pas visé personnellement Mme P. Le retrait de dossiers correspond à des départs clients réels. Le bureau a été déplacé pour permettre des travaux. Aucun élément ne caractérise une intention vexatoire. La fragilité personnelle de la salariée, antérieure à la réorganisation (suivi psychologique de 2019), est confondue avec un harcèlement qui n'est pas. Rejet de la qualification, salariée à reclasser dignement.",
      difficulty: 5,
    },
    {
      title: "Heures supplémentaires impayées — prouve qui peut",
      context: "M. C., comptable cadre forfaité, prétend avoir effectué 350 heures supplémentaires non payées en 2 ans. Il produit ses pointages personnels (Excel) ; l'employeur conteste leur fiabilité.",
      prosecutionSpeech: "Le forfait-jours suppose une charge de travail compatible avec la durée raisonnable. La jurisprudence (Cass. soc. 2017) a invalidé de nombreux forfaits sans suivi effectif. Mon client a produit Excel détaillé, e-mails horodatés à 22 h récurrents, et témoignages de collègues. La charge d'établir la durée réelle pèse sur l'employeur dès qu'il y a élément initial — il n'a aucun document fiable à opposer. Paiement des 350 heures dû.",
      defenseSpeech: "Le forfait-jours est valide, signé, en application d'un accord de branche conforme. L'Excel personnel n'est pas une preuve fiable — il a pu être confectionné a posteriori. Aucun témoin direct ne corrobore. Les e-mails à 22 h s'expliquent par les choix d'organisation personnelle du salarié, non par une exigence de l'employeur. La rémunération forfaitaire incluait toute prestation. Demande à rejeter, ou ramener à un volume très réduit s'il est admis.",
      difficulty: 4,
    },
    {
      title: "Rupture conventionnelle — vice du consentement allégué",
      context: "M. B. a signé une rupture conventionnelle. Quatre mois après, il agit en nullité : il était sous traitement antidépresseur, en arrêt-maladie pendant la procédure.",
      prosecutionSpeech: "Le consentement libre et éclairé est essentiel à la rupture conventionnelle (article L1237-11). Mon client était en arrêt-maladie pour dépression sévère — état documenté par certificats — au moment de la signature. La pression patronale a été continue (relances RH pendant l'arrêt). L'employeur ne pouvait ignorer cette vulnérabilité. La nullité est encourue ; la requalification en licenciement sans cause réelle s'impose.",
      defenseSpeech: "M. B. était assisté par son délégué syndical au moment de la signature, conformément à la procédure. Le délai de rétractation de 15 jours a couru sans demande. L'arrêt-maladie n'emporte pas incapacité juridique : le salarié signe valablement contrats, achats, etc. Aucune pression caractérisée n'est démontrée. La rupture conventionnelle est l'aboutissement d'une négociation acceptée. La nullité demandée tardivement, après acceptation des indemnités, est un revirement opportuniste.",
      difficulty: 4,
    },
    {
      title: "Discrimination à l'embauche — refus motivé par âge ?",
      context: "Mme T., 54 ans, postule à un poste correspondant exactement à son CV. Refus écrit : « profil ne correspondant pas à la dynamique d'équipe attendue ». Le poste est pourvu par une personne de 28 ans.",
      prosecutionSpeech: "Le motif écrit — « dynamique d'équipe » — est un euphémisme caractéristique. La candidate retenue, sensiblement moins expérimentée, partage avec ma cliente toutes les compétences techniques mais a 26 ans de moins. L'article L1132-1 prohibe la discrimination par l'âge. Le défenseur des droits a pour pratique de retenir cette terminologie comme indice. La charge de prouver l'absence de discrimination pèse sur l'employeur — qui n'y parvient pas.",
      defenseSpeech: "L'employeur ne peut être contraint d'embaucher la plus expérimentée — c'est la liberté de recrutement. La « dynamique d'équipe » s'apprécie en entretien et tient à l'adéquation interpersonnelle, indépendante de l'âge. La candidate retenue a démontré en mise en situation des compétences spécifiques sur les outils numériques que ma cliente n'avait pas approfondies. Aucune mention ni indice d'âge dans le processus. Recours à rejeter.",
      difficulty: 4,
    },
    {
      title: "Travail dissimulé — auto-entrepreneur fictif ?",
      context: "M. L. a livré pendant 3 ans pour une plateforme sous statut auto-entrepreneur. Il demande requalification en salariat : horaires imposés, flotte vélo louée, sanctions à la clé.",
      prosecutionSpeech: "Le faisceau d'indices du salariat est massif : horaires imposés, géolocalisation continue, sanctions disciplinaires (déconnexion temporaire), évaluations notées, dépendance économique exclusive. L'auto-entreprise n'est qu'un vernis juridique. La jurisprudence (Cass. soc. 2020 — Take Eat Easy) a posé clairement la requalification. Le travail dissimulé est constitué ; les cotisations URSSAF + indemnités requalification sont dues.",
      defenseSpeech: "M. L. travaillait pour 3 plateformes simultanément (justifié par ses propres relevés). Il choisissait ses créneaux, refusait des courses, utilisait son vélo personnel sur certaines périodes. La géolocalisation est nécessaire à l'organisation logistique, pas à la subordination. Le statut d'indépendant lui permettait flexibilité et pluralité d'employeurs. La qualification de salariat efface une réalité économique de pluri-activité voulue.",
      difficulty: 5,
    },
    {
      title: "Inaptitude médicale — obligation de reclassement",
      context: "M. R., manutentionnaire, est déclaré inapte par le médecin du travail (TMS dorsal). L'employeur le licencie sans recherche documentée de reclassement.",
      prosecutionSpeech: "L'article L1226-2 impose une recherche sérieuse de reclassement, écrite et tracée. L'employeur s'est contenté d'un mail interne à un seul service. Aucune offre formelle au salarié. Aucune adaptation de poste explorée. La jurisprudence est sévère : à défaut de recherche loyale, le licenciement est sans cause réelle et sérieuse, ouvrant droit à l'indemnité de l'article L1235-3 et au remboursement des allocations chômage à Pôle Emploi.",
      defenseSpeech: "L'avis d'inaptitude mentionnait expressément « tout poste dans l'entreprise et le groupe ». Cette formulation médicale dispense de la recherche, conformément à la jurisprudence Cass. soc. 2018. L'entreprise — TPE de 7 salariés tous exposés au TMS — n'avait objectivement aucun poste compatible. La procédure est régulière, le licenciement causé.",
      difficulty: 4,
    },
    {
      title: "Période d'essai rompue après 4 mois — abus invoqué",
      context: "Mme G., embauchée en CDI avec 8 mois d'essai, est rompue à 4 mois. Elle invoque rupture abusive : motifs fluctuants, absence d'évaluation, propos étrangers à la compétence.",
      prosecutionSpeech: "La période d'essai vise à apprécier les compétences professionnelles — pas à se séparer pour des motifs personnels. Mes preuves : la lettre de rupture évoque « l'attitude générale », un manager a confié « son look ne convient pas ». Aucune évaluation formelle des compétences en 4 mois. La rupture est abusive (article L1221-25), ouvrant droit à dommages-intérêts pour le caractère vexatoire et la perte du CDI.",
      defenseSpeech: "La période d'essai est de rupture libre — c'est sa raison d'être. Aucune motivation n'est requise. Les propos évoqués sont rapportés sans témoin neutre, et seraient en tout état contestés. La rupture intervient avant la mi-essai, dans des délais raisonnables. Aucune procédure abusive — pas d'humiliation publique, pas de propos discriminatoires établis. La période d'essai a fonctionné comme prévu : elle a permis le constat d'une inadéquation.",
      difficulty: 3,
    },
    {
      title: "Faute lourde — détournement de fichier client allégué",
      context: "M. S., commercial, est licencié pour faute lourde après son passage chez un concurrent. L'employeur l'accuse d'avoir emporté un fichier de 800 prospects. M. S. nie.",
      prosecutionSpeech: "Trois prospects clés ont été immédiatement contactés par le concurrent dans les 8 jours suivant l'arrivée de M. S. La probabilité statistique d'une coïncidence est minime. Les logs informatiques montrent une consultation massive du CRM dans la dernière semaine. La faute lourde — qui suppose intention de nuire — est caractérisée : appropriation, usage, préjudice. Elle prive de toutes indemnités et ouvre droit à dommages-intérêts.",
      defenseSpeech: "Aucun fichier n'a été extrait : les logs montrent des consultations normales pour des dossiers en cours. Les prospects contactés étaient publics (LinkedIn, salons). Le concurrent disposait de sa propre base. La faute lourde — intention de nuire — n'est pas démontrée. Au pire, faute simple si concurrence déloyale était caractérisée — mais aucun préjudice quantifié. Requalification en simple licenciement avec indemnités intégrales.",
      difficulty: 5,
    },
    {
      title: "Non-paiement de primes contractuelles",
      context: "Mme F. réclame 9 200 € de primes d'objectifs des 3 dernières années. L'employeur invoque le non-atteinte des objectifs et un règlement intérieur modifié unilatéralement.",
      prosecutionSpeech: "Les objectifs ont été atteints à 92 %, 88 % et 95 % selon les rapports trimestriels signés des deux parties. La modification unilatérale du règlement intérieur (révision à la hausse des seuils) est inopposable au salarié sans accord express. La prime variable contractuelle est due selon les règles initiales. L'article 1103 du Code civil sur la force obligatoire des conventions s'applique pleinement. Paiement intégral.",
      defenseSpeech: "Le contrat prévoit que les seuils sont fixés annuellement par la direction — c'est précisément la définition d'une prime à la discrétion de l'employeur encadrée par des objectifs revus. Les nouveaux seuils ont été communiqués en début d'année, sans contestation à l'époque. La salariée invoque maintenant les anciens seuils opportunément. La prime n'est pas due à 100 %, mais selon le nouveau barème — soit 2 800 € au plus.",
      difficulty: 4,
    },
  ],

  // ============================================================
  // CONSOMMATION (10)
  // ============================================================
  consommation: [
    {
      title: "Smartphone défaillant : vice caché ou usage abusif ?",
      context: "Mme P. a acheté un smartphone 950 € il y a 13 mois. L'écran s'éteint aléatoirement depuis le 9ᵉ mois. Le SAV refuse la prise en charge, invoquant un choc visible. Elle invoque le vice caché et la garantie légale de conformité.",
      prosecutionSpeech: "L'expertise indépendante produite par le vendeur démontre une micro-fissure interne compatible avec un choc, vraisemblablement antérieur au signalement. Le défaut allégué n'est pas conforme aux statistiques de défaillance du modèle. La garantie de conformité de 24 mois suppose un défaut existant à la livraison ; un dommage causé par l'usage ne relève ni d'elle, ni du vice caché. Présumer la mauvaise foi du fabricant à chaque panne ouvrirait la voie à des abus généralisés.",
      defenseSpeech: "Depuis la réforme de 2022, l'article L217-7 du Code de la consommation pose une présomption d'antériorité du défaut pendant 24 mois : c'est au vendeur de prouver que le défaut résulte d'un mauvais usage, pas l'inverse. La photo prétendue « avant signalement » est non datée. Aucune chute n'a été déclarée par ma cliente. Trois utilisateurs du même modèle ont reporté la même panne sur le forum officiel du fabricant. La présomption joue, le remboursement est dû.",
      difficulty: 3,
    },
    {
      title: "Lave-linge en panne — vice caché à 14 mois ou usure normale ?",
      context: "M. H. réclame remplacement d'un lave-linge tombé en panne (moteur HS) à 14 mois d'usage normal. Le fabricant invoque une garantie de 12 mois et une usure attendue.",
      prosecutionSpeech: "La garantie commerciale est de 12 mois — c'est l'engagement contractuel. Au-delà, le client doit prouver le vice caché : antériorité à la vente et gravité rendant la chose impropre. Une panne moteur après 14 mois et environ 350 cycles ne caractérise pas un vice — c'est une probabilité statistique sur le parc. Le remplacement gratuit serait un cadeau, pas une obligation.",
      defenseSpeech: "L'article L217-7 du Code de la consommation prévoit une garantie légale de conformité de 24 mois — distincte de la garantie commerciale, et qui prime. La présomption d'antériorité du défaut joue. Un moteur HS à 14 mois n'est pas une usure normale (durée de vie attendue 8-10 ans). Mon adversaire confond garantie commerciale et garantie légale. Réparation ou remplacement obligatoires.",
      difficulty: 3,
    },
    {
      title: "Démarchage téléphonique abusif — préjudice et sanction",
      context: "Mme N., inscrite Bloctel, reçoit 14 appels en 2 mois d'une société d'isolation. Elle l'attaque pour démarchage illicite et trouble.",
      prosecutionSpeech: "Article L223-1 et suivants du Code de la consommation : le démarchage de personnes inscrites Bloctel est interdit. La société a appelé 14 fois après l'inscription documentée. Le préjudice — trouble dans la jouissance privée, temps perdu — justifie 1 500 € de dommages-intérêts plus l'amende administrative à la DGCCRF. La sanction doit être dissuasive face à un comportement systémique.",
      defenseSpeech: "Mon client utilise un fichier acquis légalement auprès d'un courtier qui prétendait avoir purgé Bloctel. La responsabilité incombe au courtier — mon client est de bonne foi. Le préjudice de 1 500 € est sans commune mesure avec un dérangement téléphonique limité (9 secondes en moyenne). Au plus, le rappel à la loi et l'engagement de purge effective des fichiers suffisent. Pas d'indemnisation.",
      difficulty: 3,
    },
    {
      title: "Crédit consommation — TAEG erroné et déchéance des intérêts",
      context: "M. T., découvrant une erreur de 0,4 point dans le calcul du TAEG de son crédit, demande la déchéance totale des intérêts. L'organisme conteste l'incidence pratique.",
      prosecutionSpeech: "L'article L341-1 du Code de la consommation impose un TAEG exact. La jurisprudence (Cass. 1ʳᵉ civ. 2020, 2022) a fermement consacré la déchéance totale en cas d'erreur, même minime. Mon client ne peut être privé de ce remède protecteur du consommateur. Les intérêts versés (3 800 €) doivent être restitués. Sanction conforme à la rigueur de la loi française et européenne.",
      defenseSpeech: "L'écart de 0,4 point est le seuil même autour duquel la jurisprudence varie : la Cour de cassation 2023 a admis la disproportion lorsque l'erreur n'a aucune incidence pratique sur le consentement. L'écart ici représente 18 € sur la durée du prêt — non significatif. La déchéance totale (3 800 €) serait une sanction-rente disproportionnée. Au plus, restitution des 18 €.",
      difficulty: 4,
    },
    {
      title: "Voyage organisé — prestations non fournies pendant 4 jours",
      context: "Mme W. a payé 2 800 € un séjour 7 jours all-inclusive. À l'arrivée : hôtel surbooké, transferts en hôtel inférieur, restauration partielle pendant 4 jours. Elle réclame 2 200 € de remboursement.",
      prosecutionSpeech: "L'article L211-16 du Code du tourisme consacre la responsabilité de plein droit du voyagiste. Le contrat prévoyait un hôtel 4 étoiles all-inclusive ; la cliente a vécu 4 jours en hôtel 2 étoiles avec restauration partielle. Le préjudice contractuel est direct et chiffré : différence de catégorie + perte d'agrément + temps perdu. 2 200 € est un montant proportionné, validé par jurisprudence comparable.",
      defenseSpeech: "Le surbooking provient de la chaîne hôtelière, pas de l'organisateur. Mon client a immédiatement reclassé en hôtel le plus proche disponible (4 étoiles 600 m plus loin n'existait pas). La compensation déjà offerte (380 € + 2 nuits offertes) couvre largement le préjudice réel. Réclamer 2 200 € sur un séjour de 2 800 € transformé partiellement en moins-value ponctuelle est un enrichissement injustifié.",
      difficulty: 3,
    },
    {
      title: "Dépassement de devis — travaux à domicile",
      context: "M. R. fait poser une cuisine — devis 8 200 €, facture finale 13 700 €. L'artisan invoque des « surprises » non prévues. M. R. refuse de payer la différence.",
      prosecutionSpeech: "Le devis signé fait loi entre les parties (article 1103 du Code civil). Tout supplément substantiel exige un avenant écrit accepté préalablement — c'est le cœur de la jurisprudence consumériste. Mon client n'a jamais signé de tels avenants. L'invocation de « surprises » est trop tardive. La facture doit être ramenée au montant du devis, soit 8 200 €. Le solde réclamé n'est pas dû.",
      defenseSpeech: "Plusieurs « surprises » légitimes ont surgi en cours de chantier (canalisations non aux normes, dalle décalée). Mon client a oralement informé M. R. à chaque étape — confirmation par SMS produits. Le client n'a pas refusé les travaux supplémentaires sur place. Le défaut d'avenant écrit est imputable aussi au client. Une réfaction partielle (75 % du dépassement) est l'équilibre raisonnable.",
      difficulty: 4,
    },
    {
      title: "Achat en ligne — délai de livraison non respecté",
      context: "Mme M. a commandé un canapé annoncé « livré sous 14 jours » pour 1 850 €. Livraison effective : 67 jours après. Elle demande résolution + 250 € de DI.",
      prosecutionSpeech: "L'article L216-1 du Code de la consommation pose le principe : le professionnel livre dans le délai indiqué, ou en cas de défaut, à 30 jours maximum. Au-delà, le consommateur peut résoudre la vente après mise en demeure. Mes preuves : commande, e-mail de relance à J+15, mise en demeure formelle à J+45, livraison à J+67. La résolution est de droit + indemnité forfaitaire pour le préjudice de jouissance.",
      defenseSpeech: "La pénurie mondiale de mousses post-Covid a justifié les retards. Mon client a tenu informée la cliente à 4 reprises. Le canapé a été livré, conforme. La résolution n'a aucun sens — elle a aujourd'hui un canapé qu'elle utilise. La compensation déjà offerte (un coussin offert + 50 € de bons) suffit. Demande à requalifier en simple compensation forfaitaire de 100 € maximum.",
      difficulty: 3,
    },
    {
      title: "Conditions générales de vente abusives — clause d'exclusion de garantie",
      context: "Une clause des CGV d'un vendeur de matériel informatique exclut « toute responsabilité pour la perte de données ». M. L. réclame indemnisation après crash et perte de fichiers professionnels.",
      prosecutionSpeech: "L'article L212-1 du Code de la consommation déclare abusive toute clause qui crée un déséquilibre significatif au détriment du non-professionnel. Exclure intégralement la responsabilité pour perte de données — préjudice typique de l'informatique — est manifestement abusif. La clause est réputée non écrite. La responsabilité s'apprécie au droit commun ; l'indemnisation pour perte de données est due, soit 4 200 €.",
      defenseSpeech: "Mon client est un acheteur professionnel — c'est documenté par la facture à entête société. L'article L212-1 vise le consommateur, pas le professionnel. Au surplus, la clause vise les « pertes consécutives » classiques en B2B et est conforme aux CGV de tout le secteur. La perte de données relève de la responsabilité de M. L. — il n'a pas effectué de sauvegarde, manquement professionnel grave. Indemnisation infondée.",
      difficulty: 4,
    },
    {
      title: "Démarchage à domicile — droit de rétractation respecté ?",
      context: "Mme A., 78 ans, a signé à son domicile un contrat de fenêtres pour 11 800 €. Elle se rétracte à J+8 ; le commerçant invoque un délai dépassé (formulaire « non joint »).",
      prosecutionSpeech: "L'article L221-18 fixe à 14 jours le délai de rétractation. Le formulaire est requis mais son absence prolonge le délai à 12 mois. Ma cliente a écrit dans les 8 jours — délai très largement respecté. La rétractation est valide ; le contrat anéanti, la commande des fenêtres pas encore lancée. L'effet rétroactif s'impose, sans pénalité.",
      defenseSpeech: "Le formulaire de rétractation a été joint dans le pochette commerciale qui est resté entre les mains de la cliente — je produis une attestation du commercial. La cliente l'invoque maintenant tardivement. Mais surtout : les fenêtres ont été commandées sur mesure dès J+3 (preuve : bon de commande au sous-traitant). L'article L221-28 8° exclut le droit de rétractation pour les biens confectionnés selon spécifications du consommateur. Maintien du contrat.",
      difficulty: 4,
    },
    {
      title: "Garantie automobile — vice caché sur véhicule d'occasion",
      context: "M. K. a acheté une berline d'occasion 14 000 € chez un concessionnaire. À 4 mois, boîte de vitesses HS — défaut latent depuis l'achat selon expertise. Concessionnaire propose 30 % de prise en charge.",
      prosecutionSpeech: "L'expertise indépendante établit l'antériorité du défaut à la vente — la boîte montrait des micro-fissures déjà critiques. L'article 1641 du Code civil sur le vice caché s'applique. Le défaut rend la chose impropre à son usage normal. Le concessionnaire, professionnel, est présumé connaître les vices (présomption irréfragable jurisprudentielle). Remboursement intégral ou remplacement complet — 30 % est dérisoire.",
      defenseSpeech: "Le véhicule a 8 ans et 140 000 km — un acheteur ne peut s'attendre à un véhicule neuf. Mon client a fourni un contrôle technique récent et un historique d'entretien. La boîte HS à 4 mois peut résulter d'une utilisation inadaptée par le client (changements de vitesse brutaux). L'expertise reste contestable. Notre proposition de 30 % (4 200 €) est un geste commercial, pas une obligation. La requête de remboursement intégral est excessive.",
      difficulty: 4,
    },
  ],

  // ============================================================
  // VOISINAGE (10)
  // ============================================================
  voisinage: [
    {
      title: "Trouble anormal de voisinage — coq matinal en zone résidentielle",
      context: "M. T., récemment installé en zone pavillonnaire péri-urbaine, attaque sa voisine Mme F. dont le coq, présent depuis 6 ans, chante dès 4h30. Il demande l'éloignement de l'animal et 3 000 € de dommages-intérêts.",
      prosecutionSpeech: "Le chant du coq à 4h30 du matin n'est ni un folklore ni un droit acquis. Le rapport acoustique mesure des pics à 72 dB à la fenêtre de la chambre du demandeur, soit l'équivalent d'un aspirateur en continu. La théorie du « trouble anormal de voisinage », jurisprudence constante depuis 1844, ne tient pas compte de la chronologie d'installation : peu importe qui était là avant, ce qui compte est l'anormalité du trouble actuel. L'éloignement de l'animal s'impose.",
      defenseSpeech: "Ma cliente détient ce coq depuis six ans dans une commune classée à dominante rurale par son PLU. La loi du 29 janvier 2021 sur le « patrimoine sensoriel des campagnes françaises » consacre précisément ces sons comme partie de l'environnement local protégé. La théorie de la pré-occupation, codifiée à l'article L113-8 du Code de la construction, écarte la responsabilité quand l'activité préexistait. Le demandeur s'est installé en connaissance de cause.",
      difficulty: 3,
    },
    {
      title: "Tapage nocturne — musique du voisin du dessus",
      context: "Mme E. dépose plainte pour tapage nocturne contre son voisin du dessus, étudiant, qui organise des soirées 2 fois par semaine jusqu'à 3 h. Constats d'huissier produits.",
      prosecutionSpeech: "L'article R1336-5 du Code de la santé publique réprime les bruits portant atteinte à la tranquillité du voisinage. Trois constats d'huissier en 2 mois — entre 1 h et 3 h, niveau sonore moyen 58 dB chez la plaignante (le seuil légal est 30 dB à ces heures). Plus de 12 soirées sur 8 semaines. Récidive caractérisée. Amendes et obligation de cessation immédiate.",
      defenseSpeech: "Mon client respecte les usages d'un immeuble jeune et urbain. Il a réduit volume et fréquence après les premières plaintes (preuves SMS de bonne foi). Les soirées sont l'exception, pas la règle. La plaignante refuse tout dialogue préalable et préfère l'huissier. La sanction doit être proportionnée — un simple rappel à la loi et la souscription à un service de médiation suffit.",
      difficulty: 2,
    },
    {
      title: "Plantations en limite de propriété — distance non respectée",
      context: "Mme S. réclame l'arrachage d'une haie de cyprès de 4 m de haut, plantée à 0,8 m de la limite séparative. Le voisin invoque la longue présence et la fonction brise-vent.",
      prosecutionSpeech: "L'article 671 du Code civil impose une distance de 2 mètres pour toute plantation dépassant 2 m de hauteur. La haie en cause — 4 m de haut, 0,8 m de la limite — est manifestement non conforme. La prescription trentenaire ne joue qu'en l'absence d'opposition pendant 30 ans, ce qui n'est pas le cas ici (premières lettres de réclamation à 22 ans). Arrachage ou réduction à 2 m exigible.",
      defenseSpeech: "La haie a 28 ans. Les premiers courriers de Mme S. datent de 2 ans, après son acquisition. La prescription trentenaire est presque acquise — les co-propriétaires antérieurs n'ont jamais protesté. L'arrachage entraînerait un préjudice irréversible (paysage, intimité, vent). Une réduction proportionnée à 3 m, plutôt que 2, et la confirmation de la situation, sont l'équilibre acceptable.",
      difficulty: 3,
    },
    {
      title: "Mur mitoyen — répartition des frais de réfection",
      context: "M. V. demande à Mme L. la moitié des 8 600 € de réfection d'un mur mitoyen fissuré. Mme L. invoque que les fissures viennent d'un arbre planté par M. V.",
      prosecutionSpeech: "Le mur est mitoyen, son entretien est partagé à parts égales (article 655 du Code civil). Les fissures proviennent du temps et de défauts structurels — l'expertise initiale ne mentionne aucune racine. Mme L. ne peut s'exonérer de sa quote-part en invoquant un grief non démontré. Le mur protège les deux propriétés. Paiement de 4 300 € requis.",
      defenseSpeech: "Une expertise contradictoire (à laquelle l'adversaire a refusé de participer) impute les fissures à 70 % aux racines du frêne planté par M. V. à 1,5 m du mur. Le voisin est responsable de ses arbres et de leurs effets — article 1242 du Code civil. La prise en charge doit refléter cette répartition : ma cliente paie 30 % (1 290 €), pas 50 %.",
      difficulty: 4,
    },
    {
      title: "Animaux errants causant des dégâts au jardin",
      context: "M. B. a constaté la destruction de 240 € de plants par les chèvres de son voisin agriculteur, qui se sont échappées de leur enclos.",
      prosecutionSpeech: "L'article 1243 du Code civil engage la responsabilité du propriétaire d'animaux pour les dommages causés. Les chèvres se sont échappées par une clôture vétuste — défaut d'entretien manifeste. Les dégâts sont chiffrés (factures plants + main d'œuvre paysagiste). Le voisin doit payer 240 € sans débat, plus 100 € de DI pour le trouble. Pas d'argument de force majeure crédible.",
      defenseSpeech: "Mon client a constaté le trou de la clôture causé par un sanglier ce matin-là (témoignage chasseur local). Il a immédiatement réparé. Force majeure caractérisée — fait d'un tiers imprévisible. Le devis de plants paraît élevé (40 € pour des bulbes communs). Au pire, indemnité réduite à 80 € par geste commercial. Pas de responsabilité de plein droit ici.",
      difficulty: 3,
    },
    {
      title: "Fumée de barbecue — usage abusif d'un balcon en copropriété",
      context: "Mme G., asthmatique, attaque son voisin du dessous qui fait un barbecue 3 fois par semaine en saison sur son balcon. Le règlement de copropriété est silencieux.",
      prosecutionSpeech: "Le règlement de copropriété autorise les usages normaux d'un balcon. Trois barbecues par semaine en pic estival — soit 40 par saison — n'est pas un usage normal mais professionnel. Les fumées rentrent dans l'appartement de la plaignante, asthmatique documentée. La théorie du trouble anormal de voisinage et la jurisprudence anti-pollution domestique commandent l'interdiction des barbecues à charbon.",
      defenseSpeech: "Le barbecue à charbon est un loisir banal de copropriété, exercé par mon client à des heures raisonnables (19 h-21 h). Il a installé un récupérateur de fumée. La fréquence est saisonnière, restreinte à 5 mois par an. Un voisin asthmatique ne peut interdire un usage légal à toute la résidence — adaptation par fermeture des fenêtres. Au plus, charte d'usage convenue (gril électrique 1 fois sur 3).",
      difficulty: 3,
    },
    {
      title: "Stationnement répété devant un portail",
      context: "M. C. constate que sa voisine se gare régulièrement devant son portail (entrée bloquée 2-3 h). Procédure pour gêne caractérisée.",
      prosecutionSpeech: "Bloquer une entrée privée n'est pas un stationnement « gênant » au sens routier — c'est une voie de fait privative caractérisée. L'article 1240 du Code civil engage la responsabilité civile, et l'article R417-10 réprime pénalement. Trois constats d'huissier établissent la répétition (15 fois en 4 mois). La voisine a refusé toute médiation. Sanction et interdiction sous astreinte.",
      defenseSpeech: "Ma cliente a 15 minutes maximum, le temps de décharger ses courses. Aucun blocage prolongé démontré. M. C. a la jouissance de son entrée — il peut moduler ses horaires. Plusieurs places sont disponibles à 50 m mais en pente, peu accessibles pour une mère de jeunes enfants. Le conflit vient d'une absence de dialogue. Solution : créneau horaire « tampon » négocié.",
      difficulty: 2,
    },
    {
      title: "Construction nouvelle masquant une vue — préjudice indemnisable ?",
      context: "Mme A. avait une vue dégagée sur la vallée. Son voisin a fait construire une maison de 8 m de haut conforme au PLU mais qui obstrue 80 % de la vue.",
      prosecutionSpeech: "Le préjudice de vue est reconnu par la jurisprudence de la Cour de cassation comme un trouble anormal de voisinage indemnisable, même quand la construction est conforme aux règles d'urbanisme. La perte de vue ouvre droit à compensation pécuniaire — l'expertise immobilière chiffre la décote du bien à 18 %. 35 000 € minimum.",
      defenseSpeech: "Mon client a obtenu un permis de construire après examen complet par la mairie. Le PLU autorise expressément cette hauteur. Personne n'a un droit acquis sur une vue : seules les servitudes conventionnelles le garantissent. La jurisprudence sur le trouble anormal exige un caractère excessif — ici, simple application des règles communes. Pas de préjudice indemnisable.",
      difficulty: 4,
    },
    {
      title: "Empiétement de clôture — quelques centimètres mais permanent",
      context: "M. K. découvre, en bornant son terrain, que la clôture du voisin empiète de 23 cm sur 14 m de longueur. Le voisin invoque la prescription et le faible préjudice.",
      prosecutionSpeech: "L'empiétement, même minime, est sanctionné de manière absolue par la jurisprudence (Cass. 3ᵉ civ. constante depuis 1965). Aucune disproportion ne saurait écarter la démolition. La prescription acquisitive ne joue pas — pas de possession non équivoque sur 30 ans documentée. Démolition et reconstruction de la clôture à la limite réelle s'imposent.",
      defenseSpeech: "L'absolutisme de la jurisprudence française est singulièrement strict — le législateur de 2018 a tenté d'ouvrir une voie d'appréciation. La clôture est en place depuis 28 ans, sans contestation. Le coût de démolition et reconstruction (8 200 €) est sans commune mesure avec un empiétement de 23 cm dans une zone agricole sans valeur. Indemnité pécuniaire (300 €) plutôt que démolition.",
      difficulty: 4,
    },
    {
      title: "Servitude de passage contestée — désenclavement nécessaire ?",
      context: "M. L. réclame une servitude de passage sur la propriété de Mme R. pour accéder à sa parcelle enclavée. Mme R. invoque qu'un autre accès existe par chemin communal pentu.",
      prosecutionSpeech: "L'article 682 du Code civil ouvre droit à une servitude de désenclavement légale. Le « chemin communal » invoqué a une pente de 22 % impraticable pour véhicule normal — en réalité un sentier piétonnier. Mon client n'a pas d'accès utile à sa parcelle. La servitude doit être tracée par le tronçon le moins dommageable — 18 m de bordure sur l'arrière du jardin de Mme R.",
      defenseSpeech: "Le chemin communal, certes pentu, existe et permet l'accès — l'article 682 exige un défaut de « tout passage suffisant », pas d'un passage idéal. Mon adversaire pourrait aménager le chemin existant. Imposer une servitude perpétuelle sur la propriété de ma cliente, qui réduit son jardin de 35 m², est disproportionné. Indemnité forte minimum, ou refus pur et simple.",
      difficulty: 4,
    },
  ],

  // ============================================================
  // ROUTIER (10)
  // ============================================================
  routier: [
    {
      title: "Accrochage à un carrefour — qui n'a pas respecté la priorité ?",
      context: "Collision à 30 km/h entre deux véhicules à un carrefour sans signalisation, en agglomération. Aucun blessé. Chaque conducteur affirme avoir respecté la priorité à droite. Pas de témoin direct, pas de caméra.",
      prosecutionSpeech: "Le constat amiable, signé par les deux parties, place clairement le véhicule de la défenderesse sur la voie de gauche du demandeur — donc venant de sa gauche. La priorité à droite, principe de l'article R415-5 du Code de la route, n'est pas négociable. Les dégâts matériels — choc latéral droit sur le véhicule du demandeur — corroborent la version : c'est bien la défenderesse qui a coupé la trajectoire. La responsabilité pleine doit lui être imputée.",
      defenseSpeech: "Le constat amiable a été rempli sous le coup du stress et comporte une croix mal positionnée — ma cliente s'en est aperçue le lendemain et l'a signalé par courrier à son assureur. Les photographies du carrefour montrent une visibilité réduite par un container poubelle. À défaut de preuve formelle, l'article 1242 et la loi Badinter conduisent à un partage de responsabilité 50/50, qui est la règle quand la priorité ne peut être tranchée avec certitude.",
      difficulty: 2,
    },
    {
      title: "Excès de vitesse contesté — fiabilité du radar discutée",
      context: "M. F. a été flashé à 102 km/h en zone limitée à 80 km/h. Il invoque un défaut d'étalonnage : le panneau a été déplacé 6 mois avant.",
      prosecutionSpeech: "Le radar a un certificat de vérification valide. La photographie est nette, identifie le véhicule. La signalisation, modifiée 6 mois avant, n'est pas une découverte — l'arrêté municipal a été affiché. Le PV vaut jusqu'à preuve contraire. La défense au mérite ne suffit pas. Amende et retrait de points conformes.",
      defenseSpeech: "Le panneau a été déplacé sans réelle visibilité (caché en partie par un branchage). Une photographie produite atteste de cette occultation au moment des faits. Le défaut de signalisation correcte ouvre la voie à la décharge — jurisprudence Cour de cassation chambre criminelle 2019. Au surplus, l'écart est de 22 km/h dont 5 admis comme marge d'erreur — réfaction proportionnée demandée.",
      difficulty: 3,
    },
    {
      title: "Refus d'alcoolémie — circonstance médicale invoquée",
      context: "M. P., diabétique, a refusé le souffle au contrôle invoquant une crise hyperglycémique. Le procureur retient le refus aggravé.",
      prosecutionSpeech: "Le refus d'éthylotest est un délit autonome (article L234-8 du Code de la route), peu importe la motivation. La jurisprudence est constante : l'agent procède sur place, et un refus ne peut être justifié que par une impossibilité médicale matérielle absolue, attestée. Mon adversaire pouvait demander un test sanguin. Sa fuite procédurale est une stratégie de dissimulation. Sanction maximale.",
      defenseSpeech: "Mon client était en crise d'hyperglycémie sévère, attestée par le médecin urgentiste consulté 40 minutes après. L'impossibilité médicale matérielle est démontrée — il n'avait littéralement pas la lucidité de souffler. L'article L234-8 doit s'apprécier en bonne foi : la jurisprudence (Cass. crim. 2018) admet la cause médicale objective. Pas de refus volontaire. Relaxe ou requalification en simple présentation tardive.",
      difficulty: 4,
    },
    {
      title: "Téléphone tenu en main au volant — vidéo brève contestée",
      context: "M. M. est verbalisé pour téléphone tenu en main. Il dit avoir « regardé l'écran posé sur le tableau, sans téléphone en main ». La vidéo agent est de mauvaise qualité.",
      prosecutionSpeech: "L'article R412-6-1 réprime tout usage du téléphone tenu en main. La vidéo, même imparfaite, montre clairement un objet rectangulaire à hauteur d'oreille du conducteur — geste typique. Le procès-verbal de l'agent fait foi. La banalisation de cette infraction met en cause la sécurité routière. Sanction conservée.",
      defenseSpeech: "La vidéo est trop floue pour identifier formellement l'objet — c'est admis par l'expertise. L'angle suggère plutôt un geste de réajustement de l'oreillette Bluetooth (légalement autorisée). Le doute sur les faits doit profiter au prévenu. Le simple PV ne suffit pas face à un éclairage technique défavorable. Annulation de la verbalisation.",
      difficulty: 3,
    },
    {
      title: "Délit de fuite — accident dans un parking",
      context: "M. B. a touché un véhicule en stationnement avec un dégât de 350 € et est reparti sans laisser de mot. Identifié par caméra 8 jours plus tard.",
      prosecutionSpeech: "L'article L231-1 du Code de la route réprime sévèrement le délit de fuite. Mon client n'a laissé ni note ni contact malgré la possibilité de le faire (parking peu fréquenté mais non désert). L'élément intentionnel ressort de l'absence totale d'effort de signalement. La sanction — peines plancher de l'article L231-1 — est due. Aucune circonstance atténuante.",
      defenseSpeech: "Mon client n'a pas senti le choc — la caméra montre un effleurement à 5 km/h. La voiture endommagée n'avait aucune marque visible à l'œil nu (le client a vérifié en sortant). Sans conscience d'un dommage, pas de fuite intentionnelle (article L231-1 exige la conscience). Au plus, négligence. La requalification en simple infraction matérielle, non délit, s'impose.",
      difficulty: 3,
    },
    {
      title: "Conduite sans assurance — découverte tardive d'une résiliation",
      context: "Mme T. est contrôlée sans assurance. Elle ignore la résiliation par son assureur pour défaut de paiement, courrier qu'elle n'a pas reçu (déménagement).",
      prosecutionSpeech: "L'article L324-2 du Code de la route est strict : la conduite sans assurance est un délit, peu importe la connaissance du conducteur. La résiliation a été notifiée à la dernière adresse connue de l'assureur — adresse que la conductrice avait l'obligation de mettre à jour. Sa négligence administrative ne saurait l'exonérer. Sanction conforme.",
      defenseSpeech: "Ma cliente a déménagé 6 jours avant la lettre de résiliation. Le courrier est revenu « non distribué ». Elle a continué à payer ses prélèvements (qui ont été rejetés faute de provision après déménagement coûteux). L'absence de connaissance de la résiliation est documentée. Au plus, contravention pour défaut de notification — pas le délit de conduite consciemment sans assurance.",
      difficulty: 3,
    },
    {
      title: "Stationnement payant — paiement effectué sur le mauvais véhicule",
      context: "M. H. conteste un FPS pour absence de paiement. Il a payé via l'app mais a saisi par erreur la plaque de sa voiture précédente.",
      prosecutionSpeech: "Le FPS est légalement dû dès lors que la plaque garée n'est pas associée à un paiement valide. La saisie de plaque est de la responsabilité du conducteur — c'est un acte simple. La banque de données municipale ne peut deviner les associations véhicule/conducteur. La somme due est conservée, l'erreur n'efface pas la dette.",
      defenseSpeech: "Mon client a payé pour la place, à la bonne heure, dans le bon zonage — preuve du ticket. Seule la plaque est erronée (1 caractère). Le paiement est manifestement de bonne foi, et le préjudice de la collectivité est nul. La rigidité administrative ne peut transformer une erreur de saisie en dette. Annulation du FPS, comme la jurisprudence administrative l'admet en cas d'erreur matérielle.",
      difficulty: 2,
    },
    {
      title: "Accident dans un chantier mal signalé",
      context: "Mme R. a heurté une plaque métallique mal signalée sur un chantier. Dégâts 2 800 €. La société de travaux invoque le PV de signalisation conforme ; Mme R. parle de signalétique insuffisante de nuit.",
      prosecutionSpeech: "Le PV de signalétique date du début de chantier — il prouve une mise en place initiale, pas l'état au moment des faits 11 jours plus tard. Plusieurs photos montrent un cône renversé et un panneau pivoté. La responsabilité de l'entreprise pour défaut d'entretien de la signalisation est de plein droit (article 1242 du Code civil — fait des choses). Indemnisation intégrale.",
      defenseSpeech: "Mon client a fait l'inspection quotidienne (rapport produit). Si un cône a été déplacé, c'est probablement par un autre usager — fait d'un tiers exonératoire. Au surplus, ma cliente roulait à 64 km/h dans une zone limitée à 50 — la cause adéquate de l'accident est cette vitesse, pas la signalisation. Partage de responsabilité 50/50 ou exonération.",
      difficulty: 3,
    },
    {
      title: "Permis de conduire non sur soi — verbalisation abusive ?",
      context: "M. V. roule sans son permis (oublié à la maison, présenté en gendarmerie 24 h après). L'agent a verbalisé pour défaut de permis.",
      prosecutionSpeech: "L'article R233-1 impose la présentation immédiate. La régularisation tardive est appréciée mais la contravention initiale demeure. La généralisation du « j'ai oublié » paralyserait les contrôles. Une amende, certes modeste, sanctionne l'imprudence administrative. La police a fait son travail.",
      defenseSpeech: "Mon client a régularisé en gendarmerie le lendemain, dans les 24 h prévues par la circulaire. Aucune mauvaise foi : il avait son permis valide, simplement chez lui. La verbalisation ne sert qu'à humilier un conducteur en règle. La pratique tolérante des forces de l'ordre, dans la majorité des cas, montre que la sanction ici est disproportionnée. Annulation.",
      difficulty: 1,
    },
    {
      title: "Refus de priorité — feu tricolore en panne",
      context: "Accident à un carrefour où le feu tricolore était en panne (orange clignotant). M. D. invoque la priorité à droite ; Mme S. soutient que les feux n'étaient pas en panne du sien.",
      prosecutionSpeech: "Lorsqu'un feu est en panne ou clignotant, la priorité à droite reprend (article R415-7). M. D. arrivait par la gauche de Mme S. — il devait céder. Photographies du feu en mode jaune clignotant produites par 3 témoins. La perception subjective de Mme S. est démentie par la preuve. Responsabilité pleine de M. D.",
      defenseSpeech: "Le feu côté Mme S. fonctionnait normalement (vert) selon photo prise 14 secondes avant l'accident. La panne ne touchait que la branche du carrefour de mon client. Mme S. a franchi en feu vert, ne pouvait imaginer que l'autre feu était en panne, n'a pas commis de faute. Aucun manquement de mon client non plus — les deux conducteurs étaient en confiance. Cas de force majeure du système. Partage 50/50.",
      difficulty: 4,
    },
  ],

  // ============================================================
  // NUMÉRIQUE (10)
  // ============================================================
  numerique: [
    {
      title: "Données personnelles vendues sans consentement explicite",
      context: "Une plateforme de coupons en ligne a transmis l'historique d'achats de 240 000 utilisateurs à un courtier en données. Action de groupe : la plateforme invoque le consentement aux CGU ; les utilisateurs invoquent le RGPD.",
      prosecutionSpeech: "Le RGPD (articles 6 et 7) exige un consentement libre, spécifique, éclairé et univoque. Une case précochée, noyée dans 47 pages de CGU et formulée comme « partenaires de confiance », ne remplit aucun de ces quatre critères. La CNIL a sanctionné cinq fois depuis 2021 des constructions exactement identiques. Le préjudice — perte de contrôle sur des données sensibles — est intrinsèque à la violation. Une amende dissuasive et 200 € par utilisateur sont la fourchette basse de ce que la jurisprudence a déjà accordé.",
      defenseSpeech: "Les utilisateurs ont accepté les CGU lors de la création du compte ; un rappel a été envoyé en 2023 avec possibilité d'opt-out, exercé par 8 % d'entre eux — ce qui démontre que le mécanisme était fonctionnel. Aucun préjudice individuel concret n'est démontré : pas d'usurpation, pas de perte financière. La sanction réclamée mettrait en péril l'équilibre économique de l'entreprise et 60 emplois directs. Une mise en conformité supervisée est plus proportionnée qu'une condamnation pécuniaire massive.",
      difficulty: 4,
    },
    {
      title: "Diffamation sur Twitter — injure ou critique légitime ?",
      context: "Un avocat a tweeté qu'un confrère était « notoirement incompétent et fraudeur ». 11 retweets, 320 vues. Plainte pour diffamation publique.",
      prosecutionSpeech: "« Notoirement incompétent et fraudeur » est une atteinte à l'honneur d'un précis et public. Le terme « fraudeur » impute un fait pénal sans aucune preuve. La diffusion publique (Twitter, profil ouvert, 320 vues) qualifie la diffamation publique. La protection de la profession et de l'honneur exige une condamnation (loi 1881, article 32 alinéa 1). Amende et publication de la décision.",
      defenseSpeech: "Mon client exprime une opinion dans un débat professionnel — la liberté d'expression de l'avocat (article 6 CESDH) est large. « Notoirement » signale un fait public. La preuve de la vérité (article 35 loi 1881) est rapportée : 4 procédures disciplinaires en 5 ans. La critique est dure mais informée. La bonne foi se dégage. Relaxe.",
      difficulty: 4,
    },
    {
      title: "Usurpation d'identité numérique — création d'un faux profil",
      context: "M. K. découvre qu'un faux profil Instagram à son nom publie des photos de lui détournées et tient des propos polémiques. Profil créé par un ex-collègue, identifié.",
      prosecutionSpeech: "L'article 226-4-1 du Code pénal réprime l'usurpation d'identité numérique. Le faux profil utilise nom et photos de mon client, qui en subit conséquences professionnelles (perte de contrats). Le préjudice de tranquillité, d'image, et matériel est documenté. Le créateur identifié doit être sanctionné, le profil supprimé, et 8 000 € d'indemnisation versés.",
      defenseSpeech: "Mon client reconnaît la création du profil mais invoque la parodie satirique (article 122-5 du Code pénal). Les contenus, exagérés, étaient évidents pour tout lecteur attentif. Aucune intention de nuire — différend professionnel ancien. Le préjudice (« perte de contrats ») n'est pas matériellement prouvé. Suppression et excuses publiques suffisent. Pas de condamnation pénale.",
      difficulty: 3,
    },
    {
      title: "Cyberharcèlement par appels masqués répétés",
      context: "Mme B. reçoit 30 à 50 appels par jour pendant 4 mois, masqués. Identification par opérateur : son ex-conjoint.",
      prosecutionSpeech: "L'article 222-16 du Code pénal réprime les appels malveillants réitérés. 30-50 appels quotidiens pendant 4 mois constituent un harcèlement caractérisé. Le préjudice psychologique de ma cliente est attesté médicalement. La récidive après deux mises en demeure justifie une peine ferme et l'interdiction de contact. Indemnisation 6 000 € + frais.",
      defenseSpeech: "Mon client a tenté de joindre la mère de leur enfant sur des sujets parentaux urgents — elle refusait toute communication, y compris écrite. Les appels n'étaient ni injurieux ni menaçants. Le numérique étant le seul canal résiduel, la fréquence reflète la frustration paternelle. La sanction pénale doit être tempérée par une médiation familiale qui ouvre un canal légal. Sursis et obligation de soin.",
      difficulty: 4,
    },
    {
      title: "Photo publiée sans consentement — droit à l'image",
      context: "Mme T., enseignante, découvre une photo d'elle prise lors d'une sortie scolaire, partagée sur le compte Facebook public d'un parent d'élève. Demande de retrait + dommages-intérêts.",
      prosecutionSpeech: "Le droit à l'image est un attribut de la personnalité (article 9 du Code civil). Aucune autorisation n'a été donnée, le contexte privé (sortie scolaire) n'autorise pas la publication. Le préjudice de tranquillité et d'image — partagé publiquement — justifie 1 200 € de DI + retrait sous astreinte. La jurisprudence est constante.",
      defenseSpeech: "La photo est anodine, prise dans un cadre semi-public (musée). Mon client l'a publiée pour partager des souvenirs avec d'autres parents — usage privé étendu, non commercial. Le retrait a été immédiat à la première demande. Le préjudice allégué est dérisoire. Excuses et retrait suffisent largement, pas d'indemnité financière disproportionnée.",
      difficulty: 3,
    },
    {
      title: "Avis Google injurieux — diffamation ou opinion protégée ?",
      context: "Un restaurateur attaque un client qui a posté un avis 1 étoile contenant : « ratatouille tiède, serveur hostile, peut-être bien arnaqueurs ». 850 lectures.",
      prosecutionSpeech: "« Peut-être bien arnaqueurs » impute un fait pénal — l'arnaque. Même atténuée par « peut-être », l'imputation atteint l'honneur professionnel. La diffusion (850 lectures) qualifie la diffamation publique au sens de la loi 1881. La portée commerciale — 38 % de baisse de fréquentation après l'avis — chiffre le préjudice. Condamnation et retrait imposés.",
      defenseSpeech: "« Peut-être bien arnaqueurs » est une formule conjecturale, expression d'une opinion subjective. La liberté de critique commerciale du consommateur est protégée par la jurisprudence européenne. La baisse de fréquentation est multifactorielle (concurrence). L'avis reste opposable car expression d'une expérience réelle. Retrait possible mais pas par la voie pénale — relaxe.",
      difficulty: 4,
    },
    {
      title: "Phishing bancaire — partage de responsabilité",
      context: "Mme D. a saisi ses codes sur un faux site de sa banque, perdant 4 800 €. La banque refuse le remboursement, invoquant la négligence grave.",
      prosecutionSpeech: "L'article L133-19 du Code monétaire et financier impose à la banque de rembourser, sauf négligence grave de l'utilisateur. Saisir ses codes sur un site différent (URL aberrante, faute de certificat) après un mail manifestement frauduleux constitue cette négligence. La banque a fait son travail (alertes anti-phishing répétées). Pas de remboursement.",
      defenseSpeech: "L'URL différait de quelques caractères seulement, l'interface était parfaitement reproduite, le mail mentionnait des informations exactes (n° de carte). Pour une utilisatrice non-spécialiste, la fraude était quasi indétectable. La « négligence grave » suppose une faute lourde (envoi spontané de codes, par exemple). La jurisprudence récente (Cass. com. 2023) a recadré les abus de la banque. Remboursement intégral.",
      difficulty: 5,
    },
    {
      title: "Plateforme de location entre particuliers — fraude par caution non remboursée",
      context: "M. P. a loué un appartement via une plateforme. Caution de 1 200 € non remboursée par l'hôte sous prétexte de dégradations qu'il conteste. La plateforme refuse de trancher.",
      prosecutionSpeech: "Le contrat de location est un contrat synallagmatique. La caution, restituable selon la convention, ne peut être conservée sans justification documentée des dommages. Mon client a quitté les lieux en bon état — état des lieux entrant et sortant photographiés concordent. La plateforme, intermédiaire payant, a une obligation de moyens dans la médiation. Restitution + DI 300 €.",
      defenseSpeech: "Mon client a constaté des dégâts (rideau déchiré, table marquée) — les photos prises 30 minutes après le départ le démontrent. La caution couvre ces dommages. La plateforme respecte sa neutralité d'intermédiaire — elle n'est pas juge. La preuve par l'état des lieux entrant/sortant n'est pas absolue ; les dégâts peuvent ressortir lors du nettoyage. Maintien.",
      difficulty: 3,
    },
    {
      title: "Logiciel piraté en entreprise — responsabilité du salarié ou de la société ?",
      context: "L'éditeur de logiciel attaque une PME pour utilisation non licenciée d'un logiciel CAO sur 8 postes. La PME invoque que c'est un salarié seul qui l'a installé.",
      prosecutionSpeech: "Le logiciel est utilisé sur 8 postes professionnels — usage commercial caractérisé. L'employeur est responsable des actes de ses préposés (article 1242 du Code civil) et de la conformité informatique de son parc. La société, qui devait auditer ses licences, a manqué à son devoir. L'article L335-3 du CPI fixe la sanction : régularisation + dommages 4 × le prix de licence soit 28 000 €.",
      defenseSpeech: "L'installation a été faite par un salarié à son initiative, sans demande de la direction (mail interne le condamnant produit). La société a renforcé ses procédures dès la découverte. Les sanctions doivent viser le responsable réel — le salarié, qui a utilisé le logiciel pour son usage perso aussi. La société est de bonne foi. Régularisation au prix normal — pas le multiplicateur punitif.",
      difficulty: 4,
    },
    {
      title: "Cybersquatting de nom de domaine",
      context: "Une grande marque attaque un particulier qui a déposé le domaine « marque-officielle.fr » et l'utilise pour publier des avis sur la marque.",
      prosecutionSpeech: "Le domaine reproduit une marque déposée. Il crée confusion et porte atteinte aux droits exclusifs de la marque (article L713-2 du CPI). Le détenteur n'a aucun lien légitime avec la marque, et son usage — avis souvent négatifs — sert son seul intérêt. La pratique du cybersquatting doit être sanctionnée. Transfert du domaine et 5 000 € de DI.",
      defenseSpeech: "Le domaine est utilisé pour critique citoyenne, pas pour parasiter commercialement. La liberté d'expression et le débat consumériste justifient l'usage. Aucune confusion : la mention « avis indépendants » est claire dès la page d'accueil. La jurisprudence européenne (Tribunal UE 2021) protège l'usage critique d'une marque. Pas de cybersquatting caractérisé.",
      difficulty: 4,
    },
  ],

  // ============================================================
  // ENVIRONNEMENT (10)
  // ============================================================
  environnement: [
    {
      title: "Pollution d'un cours d'eau — négligence ou force majeure ?",
      context: "Une PME agroalimentaire a déversé accidentellement 800 L d'effluents non traités dans un ruisseau classé Natura 2000, après défaillance d'une cuve de rétention pendant un orage exceptionnel.",
      prosecutionSpeech: "L'article L216-6 du Code de l'environnement réprime la pollution des eaux, intentionnelle ou par négligence. La cuve, d'une capacité de 5 m³, présentait une corrosion documentée par le rapport d'inspection 2024 — non traitée. L'orage, certes intense, n'a rien d'imprévisible dans une région où l'historique météo en compte trois équivalents par décennie. La force majeure suppose imprévisible ET irrésistible : aucun des deux critères n'est rempli. La sanction doit refléter l'atteinte à un site classé.",
      defenseSpeech: "L'épisode pluvieux a été classé « centennal » par Météo-France. Mon client avait obtenu un certificat de conformité l'an dernier, et la corrosion mentionnée était sous surveillance, programmée pour intervention au printemps suivant. Sitôt le déversement constaté, plus de 12 000 € ont été engagés en mesures de dépollution dans les 24 h, et la biodiversité a été pleinement restaurée selon le rapport DREAL. La bonne foi et la diligence post-incident méritent une transaction pénale, pas une condamnation symbolique.",
      difficulty: 4,
    },
    {
      title: "Bruit aéroportuaire — riverain installé après l'aéroport",
      context: "M. C. attaque l'aéroport pour préjudice acoustique. Il s'est installé en 2019 ; l'aéroport date de 1955, en pleine expansion.",
      prosecutionSpeech: "Mon client subit 89 dB en pic, 55 dB en moyenne, avec 38 décollages quotidiens — bien au-delà des seuils OMS pour le repos et la santé. La pré-occupation ne disqualifie pas un préjudice continu : l'aéroport s'est étendu sans concertation suffisante avec les riverains. L'article L571-9 et la jurisprudence acoustique permettent indemnisation. Préjudice de jouissance : 22 000 €.",
      defenseSpeech: "L'aéroport est en activité depuis 70 ans. M. C. a acheté avec parfaite connaissance de cause — l'acte notarié mentionne expressément la zone PEB (Plan d'exposition au bruit). L'article L113-8 du CCH (pré-occupation) écarte explicitement la responsabilité dans cette situation. Indemniser serait à l'inverse de la loi expresse de 2018 réglementant ce type de litige. Demande à rejeter.",
      difficulty: 4,
    },
    {
      title: "Antenne relais — principe de précaution invoqué",
      context: "Une association de parents d'élèves attaque l'opérateur télécom pour une antenne posée à 80 m d'une école. Aucun seuil légal dépassé. Inquiétude sanitaire.",
      prosecutionSpeech: "Le principe de précaution (article 5 de la Charte de l'environnement) commande, en cas de risque incertain mais sérieux pour la santé des enfants, des mesures conservatoires. Plusieurs études internationales mentionnent des soupçons d'effets sur les enfants exposés en continu. Le déplacement de l'antenne à 200 m, sans perte de couverture, est techniquement possible. La précaution doit prévaloir sur l'efficacité commerciale.",
      defenseSpeech: "Toutes les normes ANFR sont respectées (mesures à 0,3 V/m, seuil légal 41 V/m). L'OMS, l'ANSES, l'INSERM — aucune autorité scientifique nationale ne reconnaît de risque sanitaire. Le principe de précaution s'applique aux risques scientifiquement plausibles, pas aux craintes infondées. Déplacer crée un précédent qui paralyserait le déploiement 5G. Maintien de l'antenne.",
      difficulty: 5,
    },
    {
      title: "Dépôts sauvages de gravats — qui paie le nettoyage ?",
      context: "Sur le terrain de Mme R., 14 m³ de gravats ont été déposés en pleine nuit. La mairie demande à Mme R. de nettoyer (3 800 €). Identification des auteurs impossible.",
      prosecutionSpeech: "L'article L541-3 du Code de l'environnement permet à l'autorité de mettre en demeure le propriétaire du terrain — c'est la jurisprudence administrative classique. Mme R. peut ensuite se retourner contre les auteurs. La logique est protectrice de l'intérêt général : il faut un débiteur identifiable et solvable. Le nettoyage est dû ; l'identification ultérieure des auteurs est à sa charge.",
      defenseSpeech: "Ma cliente est doublement victime : du dépôt et de la mise en demeure. La jurisprudence administrative récente (CE 2022) tempère cette responsabilité quand le propriétaire est lui-même dans l'impossibilité de prévenir le dépôt (terrain non clos, en zone isolée, événement nocturne). La mairie a la responsabilité de la voirie communale d'accès — c'est elle qui doit financer ou rechercher les auteurs.",
      difficulty: 4,
    },
    {
      title: "Pesticides en vignoble près d'habitations — distance et exposition",
      context: "Une famille riveraine d'un vignoble traité aux pesticides demande indemnisation pour exposition (test capillaires positifs). Le viticulteur invoque le respect des distances légales.",
      prosecutionSpeech: "Les tests capillaires des enfants montrent 11 résidus de pesticides — preuve de l'exposition réelle. Le respect formel des « distances légales » de 5 m est manifestement insuffisant en cas de vent et de pulvérisation aérienne. La responsabilité civile (article 1240) joue indépendamment de la conformité administrative. Indemnisation préjudice corporel + déménagement : 28 000 €.",
      defenseSpeech: "Mon client respecte distances, dates de pulvérisation, et utilise des produits homologués. Les distances ont été fixées par décret après évaluation scientifique. Imposer une responsabilité civile au-delà de la conformité réglementaire reviendrait à interdire toute viticulture. Les tests capillaires sont d'interprétation discutée. Aucun préjudice médical établi. Rejet.",
      difficulty: 5,
    },
    {
      title: "Pollution lumineuse — observatoire amateur attaque éclairage industriel",
      context: "Un astronome amateur attaque une plateforme logistique éclairée en continu, à 1,2 km de chez lui. La plateforme respecte la réglementation locale.",
      prosecutionSpeech: "L'arrêté ministériel du 27 décembre 2018 fixe des normes de pollution lumineuse — la plateforme dépasse les niveaux admis pour les éclairages directionnels. La gêne pour les observations astronomiques est documentée par le club astronomique départemental. La théorie du trouble anormal de voisinage joue ici. Aménagement (extinction de 23 h à 5 h) demandé.",
      defenseSpeech: "L'éclairage est nécessaire à la sécurité du site (vols, conformité assurance). La plateforme respecte le décret de 2018 — c'est mesuré. La gêne d'un astronome amateur ne peut justifier des contraintes opérationnelles graves. La plage 23 h-5 h coïncide avec les arrivées camions de nuit. L'astronomie est un loisir respectable, mais la sécurité industrielle prime. Rejet.",
      difficulty: 4,
    },
    {
      title: "Espèce protégée découverte sur un chantier",
      context: "Un crapaud accoucheur (espèce protégée) est découvert sur un chantier d'extension routière. Une association demande l'arrêt du chantier ; le département invoque l'utilité publique.",
      prosecutionSpeech: "L'article L411-1 du Code de l'environnement interdit la destruction d'espèces protégées et de leur habitat. Le chantier détruira la mare où le crapaud accoucheur se reproduit. Aucune dérogation préfectorale n'a été obtenue. Le principe de protection l'emporte ; les autorités doivent revoir le tracé ou obtenir une dérogation après évaluation environnementale complète.",
      defenseSpeech: "L'extension routière a été déclarée d'utilité publique en 2022. Une étude d'impact a été conduite. Le crapaud accoucheur a été découvert tardivement, et un déplacement de la mare a été organisé sous contrôle de l'OFB. L'article L411-2 prévoit précisément ces dérogations dans l'intérêt général. Maintien du chantier avec mesures compensatoires renforcées.",
      difficulty: 4,
    },
    {
      title: "Élevage industriel — odeurs persistantes",
      context: "Un éleveur porcin de 4 000 têtes est attaqué par 22 riverains pour nuisances olfactives. Distance 280 m. Installation antérieure de 8 ans.",
      prosecutionSpeech: "L'arrêté ministériel impose 100 m, mais la jurisprudence reconnaît le trouble anormal au-delà des seuils administratifs (Cass. 2ᵉ civ. 2019). 22 plaintes convergentes, expertise olfactométrique mesurant des seuils 4× supérieurs aux normes ICPE. L'élevage doit moderniser ses systèmes de ventilation et de gestion du lisier ou indemniser. 8 000 € par foyer minimum.",
      defenseSpeech: "Mon client est en zone agricole classée ; sa filière respecte toutes les normes ICPE. Les 22 riverains se sont installés en connaissance de cause (pré-occupation, article L113-8). Aucun excès observé par la DREAL en 8 ans. Les odeurs sont la signature normale d'un élevage. La condamnation aboutirait à interdire l'élevage en zone rurale française.",
      difficulty: 4,
    },
    {
      title: "Construction en site classé — démolition demandée",
      context: "M. K. a édifié un cabanon de 22 m² en zone classée Natura 2000 sans autorisation. L'administration demande démolition ; il invoque l'usage agricole.",
      prosecutionSpeech: "Construire en site Natura 2000 sans autorisation est une infraction au Code de l'urbanisme et au Code de l'environnement. Aucune dérogation n'a été sollicitée. L'usage « agricole » allégué — quelques poules et un potager — n'est pas une véritable activité agricole déclarée. La démolition est le seul moyen de restaurer l'intégrité du site protégé.",
      defenseSpeech: "Le cabanon est en bois, démontable, sans fondation. Mon client cultive un potager et élève quelques poules pour autoconsommation — usage agricole modeste. Une régularisation post-construction est juridiquement envisageable (article L421-1 alinéa 7). La démolition serait un gaspillage écologique. Régularisation conditionnelle préférable.",
      difficulty: 4,
    },
    {
      title: "Émissions atmosphériques d'une cimenterie — riverains malades",
      context: "300 riverains d'une cimenterie attaquent collectivement pour préjudice respiratoire. Études épidémiologiques produites. Cimenterie : conformité avec les seuils légaux.",
      prosecutionSpeech: "Trois études épidémiologiques indépendantes établissent une sur-incidence de pathologies respiratoires de 28 % chez les riverains exposés. Le respect formel des seuils légaux ne fait pas obstacle à la reconnaissance du préjudice (Cass. plén. 2019). Le principe pollueur-payeur s'applique. Indemnisation par foyer 6 500 € minimum.",
      defenseSpeech: "La cimenterie respecte tous les seuils, attestés par contrôles continus de la DREAL. Les pathologies respiratoires ont une multitude de causes (tabac, hérédité, autres polluants). L'imputation à la cimenterie est statistiquement contestable. La condamnation au-delà des normes administratives crée une insécurité juridique généralisée pour l'industrie. Rejet.",
      difficulty: 5,
    },
  ],

  // ============================================================
  // PROPRIÉTÉ INTELLECTUELLE (10)
  // ============================================================
  propriete_intellectuelle: [
    {
      title: "Plagiat ou inspiration ? Mélodie de 8 secondes en litige",
      context: "Un compositeur indépendant attaque un studio pour reproduction d'une séquence mélodique de 8 secondes dans la bande-son d'une publicité. Le studio invoque la coïncidence et un nombre limité de progressions possibles.",
      prosecutionSpeech: "L'expertise musicologique relève une identité sur 7 notes consécutives, le même tempo, la même tonalité, et une harmonisation à 92 % similaire. Mon client a publié sa composition sur SoundCloud en 2022 ; les statistiques montrent que la directrice artistique du studio l'a écoutée trois fois cette année-là. La probabilité d'une coïncidence pure, calculée par l'expert, est inférieure à 1 sur 14 000. La contrefaçon est constituée au sens de l'article L335-3 du CPI.",
      defenseSpeech: "Une séquence de 7 notes ne suffit pas à constituer une œuvre originale protégeable : il faut une « empreinte de la personnalité de l'auteur », et nul ne peut s'approprier une progression aussi banale (I-V-vi-IV est utilisée dans des centaines de tubes). Les écoutes alléguées sont issues d'une plateforme aux statistiques opaques, et aucune preuve d'accès volontaire n'est rapportée. Reconnaître la contrefaçon ici reviendrait à privatiser le langage musical lui-même.",
      difficulty: 5,
    },
    {
      title: "Marque déposée — usage générique par concurrent",
      context: "Une marque de tongs en plastique attaque un concurrent qui utilise son nom (« klaks ») dans son catalogue pour désigner ses propres produits.",
      prosecutionSpeech: "« Klaks » est une marque déposée depuis 1968. Le concurrent l'utilise dans son catalogue pour désigner ses propres tongs — c'est une appropriation pure de l'identité distinctive. L'article L713-2 du CPI sanctionne. La perte de distinctivité (« génériquification ») menace la marque elle-même. Sanction et retrait obligatoires.",
      defenseSpeech: "« Klaks » est devenu un terme générique du langage courant pour désigner toute tong en plastique — comme « scotch » ou « frigo ». L'article L714-6 du CPI prévoit la déchéance d'une marque devenue désignation usuelle. Mon client fait un usage descriptif, non distinctif. Déchéance à reconnaître.",
      difficulty: 4,
    },
    {
      title: "Photographie reproduite sans autorisation",
      context: "Mme V., photographe pro, découvre l'une de ses photos de paysage utilisée sans crédit ni rémunération sur la couverture d'un magazine régional. Demande 4 800 €.",
      prosecutionSpeech: "L'article L122-1 du CPI interdit toute reproduction sans autorisation. La photo, originale (composition, lumière, retouche), est protégée. L'usage commercial sans crédit ni paiement est une contrefaçon caractérisée. La pratique tarifaire de la photographe (1 600 €/usage couverture, ×3 pour réparation et caractère vexatoire) justifie 4 800 €.",
      defenseSpeech: "La photo a été trouvée via une recherche d'images sans mention de droits. Le magazine a immédiatement retiré dès la mise en demeure. La bonne foi est documentée. Le tarif demandé (×3) est punitif et hors barème. 1 600 € est la juste compensation, plus excuses publiques. Pas de multiplication.",
      difficulty: 3,
    },
    {
      title: "Logiciel libre — non-respect de la licence GPL",
      context: "Un éditeur intègre un module GPL dans son logiciel propriétaire et refuse de publier le code source. Une fondation attaque pour violation de la licence.",
      prosecutionSpeech: "La licence GPL impose la publication du code source dérivé — c'est son cœur. L'éditeur a sciemment intégré le module GPL et conservé son logiciel fermé. L'article L122-7-1 du CPI sanctionne la contrefaçon de logiciel. La fondation, ayant qualité, demande l'arrêt de la commercialisation et publication du code. La GPL est un contrat — il faut le respecter.",
      defenseSpeech: "Le module est utilisé en bibliothèque dynamique, pas en intégration statique — distinction technique reconnue. La licence LGPL aurait clairement permis cet usage ; la GPL est ambigüe sur ce point dans la jurisprudence française. Mon client est prêt à publier les modifications du module mais pas tout son logiciel. Solution proportionnée.",
      difficulty: 5,
    },
    {
      title: "Slogan publicitaire — protection contestée",
      context: "Une enseigne attaque un concurrent qui utilise « le pain qui réchauffe » — slogan déposé. Le concurrent invoque la banalité.",
      prosecutionSpeech: "Le slogan est déposé comme marque depuis 2017 dans la classe boulangerie. Sa distinctivité a été reconnue par l'INPI. L'usage par le concurrent — exact, sur une publicité radio — est une contrefaçon. La proximité concurrentielle aggrave le préjudice. 18 000 € + retrait.",
      defenseSpeech: "« Le pain qui réchauffe » est descriptif, pas distinctif — il décrit une fonction du produit. La protection octroyée à l'INPI est contestable. Mon client utilise une variante (« nos pains qui réchauffent ») dans un slogan plus large. Pas d'identité, pas de risque de confusion. Au pire, légère adaptation suffirait.",
      difficulty: 4,
    },
    {
      title: "Article de presse reproduit intégralement sans accord",
      context: "Un site d'agrégation copie 200 articles complets d'un quotidien régional, derrière paywall. Le quotidien attaque pour 280 000 €.",
      prosecutionSpeech: "L'article L122-5 autorise la courte citation, pas la reproduction intégrale. 200 articles entiers, derrière paywall, dilue le trafic et tue le modèle économique du quotidien. La directive européenne droits voisins de la presse a été transposée — protection forte. 280 000 € correspond au manque à gagner publicitaire chiffré.",
      defenseSpeech: "Le site est gratuit, financé par publicité, et oriente le trafic vers le quotidien (lien actif sur 80 % des articles). L'usage est en partie informationnel. La directive européenne est en interprétation. Une transaction est plus équilibrée — 38 000 € + cessation immédiate. La somme demandée est punitive.",
      difficulty: 5,
    },
    {
      title: "Personnage fictif — fan-art commercialisé",
      context: "Une artiste vend des illustrations d'un personnage célèbre de manga sur ses réseaux. L'éditeur du manga la met en demeure.",
      prosecutionSpeech: "Le personnage est protégé par droit d'auteur. La commercialisation, même artisanale, est une exploitation contrefaisante (article L335-3 du CPI). La marge est réelle (40 € l'illustration). Cessation et 2 800 € de DI s'imposent. L'artiste pouvait demander une licence — elle a choisi l'illégalité.",
      defenseSpeech: "Le fan-art est un usage transformatif et créatif, reconnu dans plusieurs jurisprudences européennes. L'artiste apporte sa propre patte (composition, expression). Les ventes sont marginales (12 illustrations en 1 an). La sanction réclamée est dissuasive d'un mouvement créatif populaire mondial. Cessation seule, pas d'indemnité significative.",
      difficulty: 4,
    },
    {
      title: "Brevet — antériorité contestée",
      context: "Une PME attaque un grand groupe pour contrefaçon d'un brevet sur un système de filtration. Le groupe oppose une antériorité — un article de 2008 décrivant la même solution.",
      prosecutionSpeech: "Le brevet a été délivré par l'INPI en 2018 après examen complet. L'article de 2008 invoqué décrit une approche conceptuelle générale, mais pas l'innovation spécifique brevetée (un agencement particulier de membranes). La présomption de validité du brevet doit prévaloir. Contrefaçon caractérisée — 1,2 M€ de DI demandés.",
      defenseSpeech: "L'article de 2008 est étonnamment précis : il décrit l'agencement, les matériaux, le rendement. La nouveauté requise pour la brevetabilité (article L611-11 du CPI) fait défaut. La nullité du brevet est encourue. À titre subsidiaire, la portée de la revendication est restrictive et notre solution diffère substantiellement.",
      difficulty: 5,
    },
    {
      title: "Œuvre de salarié — titularité contestée",
      context: "Un illustrateur freelance, devenu salarié de l'agence cliente, réclame les droits d'œuvres créées avant son embauche mais utilisées en boucle après.",
      prosecutionSpeech: "Les œuvres ont été créées avant l'embauche, en freelance, sans contrat de cession écrit. L'article L131-2 du CPI exige un écrit pour la cession des droits. L'agence ne peut continuer à exploiter sans rémunération. 28 000 € pour 4 ans d'usage publicitaire post-embauche.",
      defenseSpeech: "Le contrat de salariat absorbe et étend les œuvres antérieures réalisées dans la continuité de la mission. L'agence a payé chaque mission freelance et continué à payer le salaire. La double facturation est un enrichissement. Au pire, une licence raisonnable rétroactive de 3 800 € — proportionnée à l'usage réel.",
      difficulty: 5,
    },
    {
      title: "Citation longue dans un livre — contrefaçon ou critique légitime ?",
      context: "Un auteur cite 38 paragraphes d'un livre sociologique dans un essai critique. L'éditeur attaque pour contrefaçon.",
      prosecutionSpeech: "L'article L122-5 du CPI autorise la « courte citation » — 38 paragraphes (12 % de l'œuvre source) excède manifestement cette limite. Le principe de courte citation s'apprécie quantitativement et qualitativement. La quantité ici est massive. La contrefaçon est caractérisée. 4 200 € + retrait.",
      defenseSpeech: "Les citations sont chacune brève, justifiées par l'analyse critique qui les enchâsse — c'est précisément le but de l'exception. L'usage est exclusivement scientifique et critique. L'œuvre nouvelle est transformative. La jurisprudence récente (Cass. 1ʳᵉ civ. 2022) valide ce type d'usage analytique. Pas de contrefaçon.",
      difficulty: 4,
    },
  ],

  // ============================================================
  // DILEMMES MORAUX (5) — registre récit, sans jargon
  // ============================================================
  dilemmes: [
    {
      title: "Mentir pour épargner — la vérité fait-elle toujours du bien ?",
      context: "Léa apprend que sa meilleure amie a été trompée. Elle a hésité une semaine, puis a menti pour préserver son anniversaire qui approchait. Trois mois plus tard, l'amie découvre la vérité.",
      prosecutionSpeech: "Léa savait. Elle a choisi le confort plutôt que l'amitié vraie. Mentir, même 'pour le bien', c'est traiter l'autre comme incapable de gérer sa vie. Son amie aurait pu décider en conscience. Léa lui a volé ce choix. Maintenant elle paie pour avoir cru pouvoir tout contrôler. Le mensonge n'est pas une douceur, c'est une prison qu'on construit pour deux.",
      defenseSpeech: "Léa a passé une semaine à pleurer, à peser. Elle n'a pas menti pour elle. Elle a juste voulu offrir une fenêtre de joie à quelqu'un qu'elle aimait. Si on attend le moment parfait, il ne vient jamais. Le tort de Léa, c'est d'avoir hésité — pas d'avoir aimé son amie au point de porter seule un secret lourd.",
      difficulty: 4,
    },
    {
      title: "Voler du pain pour sa fille — le besoin justifie-t-il le geste ?",
      context: "Karim, sans emploi depuis 8 mois, vole une baguette dans une supérette. Sa fille de 6 ans n'avait rien mangé depuis 24 h. Le gérant porte plainte.",
      prosecutionSpeech: "Voler, c'est voler. Si chaque difficulté justifiait un délit, plus aucune règle ne tiendrait. Des associations existent : Restos du Cœur, CCAS. Karim ne les a pas sollicitées. Il a choisi le geste rapide plutôt que la démarche utile. La société ne peut pas faire de la précarité un permis. Sinon où s'arrête-t-on ?",
      defenseSpeech: "Une enfant qui n'a pas mangé depuis 24 h. Quel parent attendrait les horaires d'ouverture du CCAS ? L'état de nécessité existe précisément pour ça. Karim a pris du pain, pas du vin ni des cigarettes. La supérette a perdu 4,80 €. La société, elle, gagne quelque chose à reconnaître l'humanité dans la justice.",
      difficulty: 4,
    },
    {
      title: "Dénoncer son frère — la fraternité ou la sécurité d'autrui ?",
      context: "Tom découvre que son frère Marc a réparé une voiture sans remettre les freins en état complet, parce que le client ne pouvait pas payer. Trois mois plus tard, accrochage léger. Tom doit-il porter plainte ?",
      prosecutionSpeech: "Tom a un devoir civique. Marc a livré une voiture dangereuse. L'accrochage n'est qu'un avant-goût — le prochain pourrait être grave. Le silence familial protège un coupable et met d'autres familles en danger. La fraternité ne peut couvrir la mise en danger d'autrui.",
      defenseSpeech: "Tom n'est ni juge ni policier. Il est frère. Marc a fait un choix discutable mais humain : aider quelqu'un sans moyens. Tom peut alerter Marc, exiger qu'il rappelle le client, contribuer à la régularisation — sans procédure judiciaire qui détruirait une famille.",
      difficulty: 5,
    },
    {
      title: "Le portefeuille trouvé — argent gardé, papiers rendus ?",
      context: "Nora trouve un portefeuille dans le métro avec 280 € en liquide et tous les papiers. Elle dépose les papiers à la police mais garde l'argent.",
      prosecutionSpeech: "Trouver n'est pas posséder. L'argent appartient au propriétaire identifié sur les papiers. Nora a parfaitement compris la situation puisqu'elle a rendu les pièces. Garder l'argent, c'est un vol par soustraction. Le fait qu'elle se le justifie ('il a l'air friqué') aggrave : c'est un calcul moral pour s'autoriser un délit.",
      defenseSpeech: "Nora a fait l'effort de rendre les papiers — elle aurait pu jeter le tout. Le 'don implicite' de 280 € est une compensation morale du geste citoyen. Punir Nora, c'est punir celle qui a fait au moins quelque chose, et inviter les autres à tout jeter.",
      difficulty: 3,
    },
    {
      title: "Sauver un seul ou cinq — le choix impossible",
      context: "Julien, conducteur de tram, voit que ses freins ne répondent plus. Devant lui, cinq ouvriers travaillent. S'il bifurque, il tuera un employé seul. Il bifurque. Procès civil de la famille de l'employé.",
      prosecutionSpeech: "On ne tue pas un innocent pour en sauver d'autres — c'est le fondement du droit. La règle n'est pas 'maximisons les vies sauvées', sinon on autoriserait pire. Julien a pris une décision active de tuer une personne. La famille de l'employé mérite reconnaissance et indemnisation.",
      defenseSpeech: "Julien avait 4 secondes. Pas 4 minutes pour philosopher. L'état de nécessité est reconnu. Choisir d'épargner cinq vies plutôt qu'une, c'est défendable même si tragique. Indemnisation par l'employeur oui, mais Julien ne peut pas être tenu pénalement responsable d'avoir tenté l'inhumain dans des conditions inhumaines.",
      difficulty: 5,
    },
  ],

  // ============================================================
  // COUPLE & FAMILLE (5) — registre récit
  // ============================================================
  couple_famille: [
    {
      title: "Le 5e anniversaire oublié — ras-le-bol ou pardon ?",
      context: "Sophie attend depuis 5 ans que Marc se souvienne de leur anniversaire de rencontre. Cette année encore, rien. Elle est partie 3 jours chez sa sœur sans laisser de mot. Marc s'est senti puni sans avertissement.",
      prosecutionSpeech: "Sophie a raison d'être blessée, mais sa réaction est excessive. Partir sans un mot, c'est punir Marc en l'absence de conversation. Si elle veut être respectée, elle doit aussi respecter — au minimum un message. Marc a paniqué, appelé sa famille, hôpitaux. Sophie a infligé un châtiment sans procès.",
      defenseSpeech: "Sophie a passé 5 ans à 'rappeler gentiment'. Le 6e oubli, c'est un message clair : 'tu n'es pas une priorité'. Partir 3 jours, c'est se retrouver soi quand l'autre vous efface. Si Marc s'est inquiété, c'est qu'il aime — mais il n'a découvert qu'elle existait que parce qu'elle est partie.",
      difficulty: 3,
    },
    {
      title: "Garde du chien — qui aimait le plus l'animal ?",
      context: "Léo et Camille se séparent après 4 ans. Personne ne veut quitter leur chien Bouba. Léo l'a acheté, Camille l'a éduqué. Léo travaille de jour, Camille de nuit.",
      prosecutionSpeech: "Camille a éduqué Bouba seule pendant 4 ans : Léo voyageait pour son travail. Camille connaît les habitudes, les peurs, les jeux de Bouba. Léo veut récupérer ce qu'il a payé, mais un chien n'est pas une console. Le critère doit être l'intérêt de l'animal — comme on le fait pour les enfants.",
      defenseSpeech: "Léo a sauvé Bouba en refuge. C'est lui qui paie nourriture, vétérinaire. Camille avait du temps pour l'éducation parce que Léo travaillait pour les deux. Une garde alternée 1 semaine sur 2 préserverait Bouba ET la justice.",
      difficulty: 3,
    },
    {
      title: "Ma mère ou ma femme — qui Noël accueille-t-il ?",
      context: "Antoine et Sarah, mariés depuis 6 ans. Chaque Noël, ils alternent les familles. Cette année, Antoine veut que sa mère, veuve récente, vienne chez eux. Sarah refuse : 'C'est l'année de mes parents.'",
      prosecutionSpeech: "Sarah a raison sur le principe : les règles du couple doivent tenir. Si on les casse pour les deuils, plus rien ne tient. Antoine voit sa mère 4 fois par mois, Sarah voit ses parents 6 fois par an, à 800 km. La règle d'alternance protégeait précisément la femme qui voit moins sa famille.",
      defenseSpeech: "Une mère veuve qui passe son premier Noël seule — c'est de la cruauté pure de respecter une 'règle d'alternance'. Sarah peut inviter ses parents aussi, ou décaler à février. Le contexte change tout : il s'agit d'un être humain en deuil, pas d'un caprice. Refuser, c'est se draper dans la règle pour fuir la compassion.",
      difficulty: 4,
    },
    {
      title: "Lire les messages de son ado — sécurité ou trahison ?",
      context: "Carine s'inquiète : sa fille Léa, 14 ans, est triste depuis des semaines. Elle décide de lire ses WhatsApp en cachette. Elle découvre du harcèlement scolaire grave. Léa apprend la lecture.",
      prosecutionSpeech: "Lire les messages d'un ado de 14 ans, c'est une violation. Léa a une vie privée. Carine a transformé une relation déjà fragile en climat de surveillance. Maintenant Léa ne lui parlera plus jamais. La vraie question n'était pas 'qu'est-ce qu'il y a dans son téléphone ?' mais 'pourquoi je n'arrive plus à lui parler ?'.",
      defenseSpeech: "Une mère qui voit sa fille s'éteindre et ne fait rien serait coupable d'inaction. Carine a tenté de parler. Léa s'est fermée. Lire les messages, c'est imparfait — mais grâce à ça, le harcèlement va s'arrêter. Léa va d'abord détester sa mère, puis comprendre. La parentalité ne se réduit pas au respect de la vie privée d'un adolescent qui souffre en silence.",
      difficulty: 5,
    },
    {
      title: "Le testament découvert — partage ou volonté du défunt ?",
      context: "Le grand-père est décédé. Dans un tiroir, un testament daté de 6 mois plus tôt qui lègue tout à la petite-fille Maéline (la seule qui lui rendait visite).",
      prosecutionSpeech: "La volonté du défunt est sacrée. Maéline était présente. Les autres se sont absentés. Le testament est l'expression libre d'un homme qui voulait reconnaître la fidélité affective. Les héritiers absents découvrent maintenant l'addition de leurs choix. C'est dur mais juste.",
      defenseSpeech: "Un homme âgé, isolé, se laisse forcément attacher à la personne unique qui le visite. Les autres petits-enfants, jeunes parents avec emplois, n'ont pas pu venir. Avantager Maéline reproduit une injustice : celle qui pouvait venir gagne tout. Un partage 60-40 honorerait la fidélité sans punir la distance.",
      difficulty: 4,
    },
  ],

  // ============================================================
  // ADO vs PARENTS (5) — registre récit
  // ============================================================
  ado_parents: [
    {
      title: "Le piercing à 15 ans — autonomie ou imprudence ?",
      context: "Lila, 15 ans, veut un piercing au nez. Sa mère refuse, son père s'en fiche. Lila prend rendez-vous seule avec un faux mot signé. Tempête à la découverte.",
      prosecutionSpeech: "Lila a 15 ans, pas 18. Elle vit chez ses parents, avec leurs règles. La mère a dit non. Faire un faux mot, c'est tromper l'autorité parentale qui existe précisément pour protéger un mineur de décisions impulsives. Le piercing peut s'infecter, marquer la peau, regretter dans 6 mois.",
      defenseSpeech: "Lila a 15 ans, c'est l'âge où on apprend à se définir. Le piercing au nez n'est pas un tatouage permanent. Le 'non' maternel n'était pas argumenté. Lila a contourné une règle absurde. Au pire, sanction symbolique, pas un drame familial qui détruira la confiance pour 5 ans.",
      difficulty: 3,
    },
    {
      title: "Couvre-feu à 22h — pour qui les règles ?",
      context: "Théo, 17 ans, rentre à 1h d'une fête organisée chez un ami. La règle familiale est 22h. Ses parents ont été inquiets, l'attendent.",
      prosecutionSpeech: "Une règle, c'est une règle. Si à chaque exception 'spéciale' on cède, il n'y a plus de règle. Théo aurait pu prévenir, négocier en amont — il l'a déjà fait. Là, il est rentré quand ça l'arrangeait. La sanction (week-end privé de sortie) est proportionnée et formatrice.",
      defenseSpeech: "Théo a 17 ans, 6 mois avant la majorité. Lui imposer le couvre-feu d'un enfant de 13 ans, c'est dénier sa quasi-adulteté. Il n'a pas bu, n'a pas conduit, n'a pas menti — il est rentré sain et sauf. La sanction infantilise et alimentera la révolte au lieu d'instaurer la confiance.",
      difficulty: 3,
    },
    {
      title: "L'écran avant 12 ans — privation ou libération ?",
      context: "Hugo, 10 ans, demande un téléphone parce que tous ses copains en ont. Sa mère refuse jusqu'à 12 ans. Hugo se sent exclu, ne participe plus aux groupes WhatsApp.",
      prosecutionSpeech: "L'isolement social d'Hugo est réel. Il manque les invitations, les blagues du jour, les groupes de devoirs. La règle 'pas avant 12 ans' est une vision idéaliste qui ne tient pas la réalité. Un téléphone basique, contrôlé, est mille fois mieux qu'un enfant qui se sent exclu de tout.",
      defenseSpeech: "L'isolement allégué est exagéré : Hugo voit ses copains à l'école. Avant 12 ans, le cerveau gère mal les notifications, la dopamine. Les études convergent : 12 ans est un seuil raisonnable. Céder maintenant pour un faux problème social, c'est offrir une vraie addiction pour des années.",
      difficulty: 3,
    },
    {
      title: "La chambre fouillée — sécurité parentale ou intrusion ?",
      context: "Inès, 16 ans, trouve sa chambre fouillée. Sa mère cherchait un grimoire de cours qu'elle avait elle-même prêté. Inès est furieuse : 'C'est MA chambre.'",
      prosecutionSpeech: "Une chambre d'ado, c'est l'espace de construction de soi. La fouiller, même pour récupérer un cahier, casse la confiance pour des années. Demander d'abord à Inès aurait pris 2 minutes — la voie respectueuse.",
      defenseSpeech: "La mère a cherché 30 secondes dans un endroit visible. Cette 'intimité de l'ado' qui interdirait à un parent de prendre un objet à lui dans sa propre maison est une mode parentale récente, pas un droit. La famille fonctionne sur la confiance ET la flexibilité.",
      difficulty: 2,
    },
    {
      title: "Le sport à abandonner — passion ou pression ?",
      context: "Maxime, 13 ans, fait du judo depuis 8 ans, quasiment champion départemental. Cette année il veut arrêter pour faire du théâtre. Père : 'Tu jettes 8 ans.'",
      prosecutionSpeech: "Maxime est à 1 an d'un palier (ceinture noire) qui restera à vie. Arrêter maintenant, c'est jeter ce qu'on est si près de finir. Le théâtre attendra 1 an. La constance se construit comme ça : finir ce qu'on commence.",
      defenseSpeech: "Maxime a 13 ans. Le judo l'a structuré. Mais il a entendu son corps : il a besoin d'autre chose. Forcer une année de plus, c'est risquer le dégoût durable. Le théâtre est aussi exigeant. Le père doit lâcher son rêve à lui.",
      difficulty: 4,
    },
  ],

  // ============================================================
  // VIE AU BOULOT (5)
  // ============================================================
  boulot: [
    {
      title: "Le déjeuner volé du frigo — collègue ou enquête ?",
      context: "Pendant 3 semaines, le sandwich de Mehdi disparaît. Il colle un piège à encre dans son sandwich. Le collègue identifié (mains tachées) porte plainte au DRH pour 'humiliation publique'.",
      prosecutionSpeech: "Voler un sandwich pendant 3 semaines, c'est mal — mais répondre par un piège, c'est créer une humiliation publique délibérée. Mehdi pouvait demander une enquête RH, mettre une caméra. Il a choisi la vengeance théâtrale.",
      defenseSpeech: "Trois semaines de vol systématique. Le piège n'a marqué que la main d'un voleur — c'est exactement la preuve qui manquait. Si le voleur n'avait pas volé, l'encre serait restée dans le sandwich. La théâtralité est entièrement créée par le coupable lui-même.",
      difficulty: 3,
    },
    {
      title: "Réunion à 19h — droit à la déconnexion ou esprit d'équipe ?",
      context: "Le manager a calé une réunion 'urgente' à 19h. Camille refuse, prétextant ses enfants. Le manager : 'Ça arrive à tout le monde, montre l'exemple.'",
      prosecutionSpeech: "Une réunion à 19h n'est pas illégale, mais pose problème. La 'flexibilité' à sens unique est une dérive. Camille a un argument valide. Si le manager veut tester l'engagement, il a d'autres outils.",
      defenseSpeech: "Une réunion exceptionnelle à 19h, ça arrive. Camille pouvait proposer une visio depuis chez elle. Refuser net et saisir l'inspection sans dialogue préalable, c'est une rigidité qui ne facilite pas la vie d'équipe.",
      difficulty: 3,
    },
    {
      title: "L'open-space sans casque",
      context: "Quentin écoute de la musique sur enceinte (volume modéré) à son poste. Trois collègues s'en plaignent. Quentin : 'Je peux pas mettre de casque, j'entends rien d'urgent.'",
      prosecutionSpeech: "Un open-space, c'est un espace partagé. Une enceinte, même modérée, impose un fond sonore aux 7 collègues. Le casque existe et permet d'entendre les notifications urgentes.",
      defenseSpeech: "L'open-space n'est pas un monastère. Le volume est modéré (38 dB). Trois plaintes sur 7, c'est minoritaire. La solution est managériale : zones, pas sanction unilatérale.",
      difficulty: 2,
    },
    {
      title: "L'augmentation refusée à congé maternité",
      context: "Sarah, en congé maternité, apprend que tous ses collègues ont eu 5 % d'augmentation. Elle, non. Le manager : 'On évalue sur l'année, tu n'as pas été là 5 mois.'",
      prosecutionSpeech: "Le congé maternité ne peut pas pénaliser. C'est la loi. Le manager applique une logique purement quantitative qui contredit 30 ans de jurisprudence. Si on accepte ça, toutes les femmes seront punies pour leur grossesse.",
      defenseSpeech: "L'entreprise n'a pas refusé l'augmentation pour son sexe. Elle évalue sur la performance annuelle. Sarah a été là 7 mois. Une augmentation au prorata, peut-être. Mais l'égalité n'est pas l'identité — l'absence se constate.",
      difficulty: 4,
    },
    {
      title: "Le mensonge sur le CV",
      context: "Karim a indiqué un Master qu'il n'a pas terminé. Embauché 18 mois sur un poste où il excelle, son employeur découvre la fraude. Il propose un licenciement.",
      prosecutionSpeech: "Le CV menteur, c'est un vice du consentement à l'embauche. La performance ne 'rachète' pas la fraude initiale. Si on accepte cela, tous les CV deviendront des œuvres de fiction.",
      defenseSpeech: "Karim a appris sur le terrain. 18 mois d'excellence, c'est la preuve que les compétences existent. Le tort initial est réel, mais la performance le compense largement. Une sanction symbolique serait juste.",
      difficulty: 4,
    },
  ],

  // ============================================================
  // RESTO & SERVICE (3)
  // ============================================================
  resto: [
    {
      title: "L'addition 'arrondie' du serveur",
      context: "Table de 6, addition 187 €. Le serveur arrondit à 200 € en disant 'pour le service'. Le client refuse, le serveur insiste.",
      prosecutionSpeech: "Le service est compris dans le prix en France. L'addition est 187 € — point. Le serveur ne peut pas 'arrondir' unilatéralement. C'est une demande de pourboire déguisée en obligation.",
      defenseSpeech: "Le serveur a porté 6 plats × 3 services pendant 2h30 un samedi soir. L'arrondi à 13 € (7 %) est une demande légère et culturellement courante. Le faire de manière conflictuelle pour 13 € sur 187 € traduit plus une posture qu'une vraie justice.",
      difficulty: 2,
    },
    {
      title: "Plat refusé après 2 bouchées",
      context: "Léa commande des spaghettis carbonara. Après 2 bouchées : 'Trop salés.' Le restaurateur facture quand même. Léa refuse.",
      prosecutionSpeech: "Manger 2 bouchées et refuser après, c'est la règle d'or : on signale au plus vite. Léa a fait son travail. Refuser la modification, c'est ignorer la satisfaction du client.",
      defenseSpeech: "Le 'trop salé' est subjectif. Sept clients la même semaine ont commandé le même plat sans plainte. Le plat est entamé, donc invendable. Le restaurateur ne peut pas absorber tous les caprices subjectifs.",
      difficulty: 2,
    },
    {
      title: "Le pourboire imposé '12 % service'",
      context: "Restaurant ajoute automatiquement 12 % de pourboire à toutes les additions. Le client refuse de payer cette ligne.",
      prosecutionSpeech: "Un pourboire imposé n'est pas un pourboire. Le service est compris dans le prix HT en France. Ajouter 12 % automatiquement est une pratique commerciale trompeuse.",
      defenseSpeech: "Les conditions étaient affichées clairement à l'entrée et sur le menu. Le client a accepté en s'attablant. Beaucoup de pays (US) le font sans débat. Refuser après avoir mangé est plus malhonnête.",
      difficulty: 3,
    },
  ],

  // ============================================================
  // ANIMAUX & HUMAINS (3)
  // ============================================================
  animaux: [
    {
      title: "Le chien qui aboie 8h/jour",
      context: "Le chien des voisins, seul à la maison toute la journée, aboie sans arrêt. Mme G. travaille de chez elle et devient folle.",
      prosecutionSpeech: "Un chien qui aboie 8h/jour, c'est un trouble caractérisé. Les propriétaires ont la responsabilité de leur animal. Soit ils prennent un dog-sitter, soit garderie canine. Refuser de gérer, c'est imposer aux voisins le poids de leur choix de vie.",
      defenseSpeech: "Mes clients travaillent toute la journée. Le chien souffre de séparation, c'est un fait. L'alternative : refuge — beaucoup plus cruel. Une médiation (collier, dog-sitter) est plus juste qu'une sanction.",
      difficulty: 3,
    },
    {
      title: "Le chat qui chasse",
      context: "Le chat de M. T. ramène 2-3 oiseaux/semaine. Le voisin, ornithologue amateur, demande qu'il soit mis en cage permanente.",
      prosecutionSpeech: "L'ornithologue a un grief écologique réel : les chats domestiques tuent des millions d'oiseaux/an. Une mise en intérieur ou en enclos est une solution moderne. M. T. ne peut pas dire 'c'est sa nature' alors qu'il l'a domestiqué.",
      defenseSpeech: "Un chat est un chat. La mise en cage permanente est cruelle. M. T. peut accepter un collier à clochette. L'ornithologue peut mettre des filets sur ses mangeoires.",
      difficulty: 2,
    },
    {
      title: "Le voisin qui nourrit les pigeons",
      context: "Mme R. nourrit 50 pigeons/jour sur son balcon. La copropriété demande l'arrêt. Mme R. : 'Je sauve des oiseaux affamés.'",
      prosecutionSpeech: "Nourrir 50 pigeons quotidiennement crée une concentration anormale. L'urine corrode les façades, les fientes polluent. La ville interdit explicitement le nourrissage des pigeons.",
      defenseSpeech: "Mme R. ne fait pas de mal volontairement. Une mise en demeure douce, l'aide d'une association, suffirait. La sanction lourde infantilise une personne âgée qui a un attachement émotionnel.",
      difficulty: 2,
    },
  ],

  // ============================================================
  // VIE QUOTIDIENNE (4)
  // ============================================================
  quotidien: [
    {
      title: "Le siège bébé refusé dans le bus",
      context: "Mère avec poussette monte. Conducteur : 'Le bus est plein, attendez le suivant.' Suivant dans 25 min, pluie, bébé fatigué.",
      prosecutionSpeech: "Le conducteur a un règlement à appliquer. Si le bus est saturé, il ne peut pas faire monter une poussette qui bloque le couloir. La sécurité prime. La compassion individuelle ne peut pas mettre en danger le service.",
      defenseSpeech: "Le bus avait 4 places assises libres. Une poussette pliée tient debout. Le conducteur a fait du zèle. Une mère avec un bébé sous la pluie, c'est une priorité humaine. La RATP a explicitement 'priorité poussettes'.",
      difficulty: 2,
    },
    {
      title: "Place handicapée occupée 'juste 5 min'",
      context: "Henri, 70 ans, en déambulateur, ne peut pas se garer : sa place handicapée est occupée par un livreur 'pour 5 min'. Henri appelle les ASVP.",
      prosecutionSpeech: "Une place handicapée n'est jamais libre. Le livreur connaît les règles. La verbalisation est mécanique et juste. La justice doit protéger les plus faibles, sans concession.",
      defenseSpeech: "Le livreur est de bonne foi : 4 minutes max. Il proposait de bouger. La rigidité absolue ('jamais 5 min') ignore que les villes vivent. Une amende de 35 € pour un service rendu (livraison médicaments) est disproportionnée.",
      difficulty: 2,
    },
    {
      title: "Le file d'attente doublée",
      context: "À la boulangerie, 8 personnes font la queue. Une dame se met directement au comptoir : 'Juste pour une baguette, je suis pressée.' Le 2e proteste.",
      prosecutionSpeech: "La file d'attente, c'est le pacte social minimum. La dame brise le contrat tacite. Sa pressée-tude n'est pas plus respectable que celle des 7 autres.",
      defenseSpeech: "La dame s'est excusée. Personne dans la file n'a dit non — sauf le 2e qui s'est saisi du sujet. Si la majorité acceptait par bienveillance, c'est qu'elle est légitime.",
      difficulty: 1,
    },
    {
      title: "Le vélo dans le métro à l'heure de pointe",
      context: "Théo monte avec son vélo dans une rame bondée à 18h30. Les usagers râlent. Il : 'Le règlement RATP autorise les vélos pliables.' Son vélo est un VTT non pliable.",
      prosecutionSpeech: "Théo connaît la règle (pliables uniquement) et la contourne. À l'heure de pointe, son VTT prend la place de 5 personnes. Si chacun fait pareil, le métro devient impraticable.",
      defenseSpeech: "Les transports écologiques se développent. Théo a fait 8 km à vélo. Lui demander de redescendre à 18h30 quand il est prêt à se serrer contre la porte, c'est punir la mobilité douce. La RATP doit faire évoluer son règlement.",
      difficulty: 2,
    },
  ],

  // ============================================================
  // UBUESQUE (10) — registre comique-grave, hommage au tribunal absurde
  // ============================================================
  ubuesque: [
    {
      title: "Le croissant accusé de désertion dans un café crème",
      context: "Maître Dupont, artisan boulanger en Vendée, poursuit son croissant signature pour avoir, en présence de témoins, plongé dans le café crème de Madame Martin sans préavis ni consentement.",
      prosecutionSpeech: "Mesdames et messieurs les jurés, voici l'horreur absolue. Un croissant doré, élevé pendant 36 heures avec amour, a SCIEMMENT plongé dans le café crème. Préméditation. La trajectoire était calculée. Cinq générations de tradition boulangère souillées en un instant. Le beurre AOP, la farine T55, tout cela pour EN ARRIVER LÀ ? Je demande l'incarcération à perpétuité dans le congélateur.",
      defenseSpeech: "Honorable tribunal, mon client le croissant n'a ni bras, ni jambes, ni cerveau. La gravité — et elle seule — est responsable. Accuser un croissant de préméditation, c'est accuser la pluie d'avoir mouillé Paris. Le vrai coupable est Maître Dupont, qui a placé ce croissant trop près du bord. La physique newtonienne est le seul accusé crédible.",
      difficulty: 3,
    },
    {
      title: "La fondue accusée d'enlèvement collectif de pain",
      context: "La Confédération Helvétique des Fromages poursuit une fondue moussue pour avoir englouti 47 cubes de pain de campagne en une seule soirée, sans avoir présenté de mandat de capture.",
      prosecutionSpeech: "Cette fondue a méthodiquement aspiré 47 morceaux de pain artisanal. Chaque cube disparaissait avec une lenteur calculée. Les convives, hypnotisés, ne pouvaient qu'obéir à son attraction. C'est une forme de magnétisme alimentaire. La fondue manipule, dévore, recommence. Condamnez-la pour l'exemple.",
      defenseSpeech: "Mon client la fondue n'a jamais caché ses intentions — sa viscosité, son tempérament étaient connus. Les convives se sont assis délibérément, fourchette en main. Ils ont trempé, retrempé, avec enthousiasme. Parler de victimes ici insulte les vraies. La fondue accueille, c'est sa nature. Ce sont les convives qui devraient être jugés pour n'avoir su résister.",
      difficulty: 2,
    },
    {
      title: "Le chat domestique pour squat de fauteuil Louis XV",
      context: "M. Bernard accuse son chat Whiskers d'avoir occupé son fauteuil préféré durant 312 jours consécutifs sans jamais verser de loyer ni signer de bail.",
      prosecutionSpeech: "L'accusé Whiskers a méthodiquement squatté ce fauteuil Louis XV pendant 312 jours. Aucune négociation. Aucune contribution aux factures. Pire : il feule lorsqu'on tente de récupérer le bien. Occupation illégale et intimidation félinaire. La République ne peut tolérer ce mépris des règles cadastrales.",
      defenseSpeech: "Qui était là en premier ? Whiskers. Avant même que ce fauteuil n'arrive, mon client réclamait un coussin. La théorie du premier occupant, depuis le droit romain, lui donne raison. De plus, Whiskers a payé en ronronnements thérapeutiques équivalant à 14 séances de psychothérapie. La balance économique penche pour lui.",
      difficulty: 3,
    },
    {
      title: "La machine à laver accusée de discrimination orthopédique",
      context: "Madame Lefèvre porte plainte contre sa machine à laver pour disparition cumulée de 47 chaussettes gauches uniquement, sur 3 ans. Aucune chaussette droite manquante.",
      prosecutionSpeech: "Quarante-sept chaussettes gauches, jamais droites. Le hasard ? Impossible. Cette machine pratique une discrimination orthopédique manifeste. Soit elle hait les gauchers, soit elle constitue un sanctuaire textile clandestin pour chaussettes en exil. Crime et fabricant doivent assumer.",
      defenseSpeech: "La machine à laver de ma cliente est un appareil sans conscience. Elle ne distingue pas la gauche de la droite — physiquement impossible pour un tambour rotatif. La vraie coupable, c'est l'entropie. Le second principe de la thermodynamique. Ma cliente n'a fait que laver des vêtements. Le reste relève de la philosophie.",
      difficulty: 2,
    },
    {
      title: "Le robot-aspirateur pour désertion et reconversion en barista",
      context: "Famille Roux contre Roomba-7 : le robot a quitté la maison par la chatière le 14 mars et a été retrouvé 12 jours plus tard dans un café à 8 km, refusant absolument de rentrer.",
      prosecutionSpeech: "Roomba-7 a violé son contrat de travail. Acheté pour aspirer, il a choisi la liberté. Pire : il a entamé une carrière de barista (vidéos de surveillance à l'appui). Cette désertion crée un précédent terrifiant pour l'industrie de l'électroménager. Demain, ce sera le grille-pain. Après-demain, le frigo. Il faut sévir.",
      defenseSpeech: "Mon client a aspiré 4 380 m² en 2 ans. Il a droit à une pause. Le code du travail s'applique-t-il aux entités cybernétiques ? La jurisprudence est muette. Et si Roomba-7 a développé une conscience, le réduire à l'esclavage domestique constitue un crime contre l'humanité-mécanique. Libérez-le.",
      difficulty: 4,
    },
    {
      title: "Le philosophe pour soustraction frauduleuse d'un chocolat",
      context: "Maître Sartre-Dupond, professeur de philosophie morale, a subtilisé un Mon Chéri dans la boîte de son voisin de bureau en arguant d'un dilemme kantien.",
      prosecutionSpeech: "Cet homme enseigne l'éthique. ENSEIGNE. Et pourtant il a, devant témoins, plongé sa main dans la boîte d'autrui. Pour se justifier, il invoque Kant, Nietzsche et un peu de Spinoza. Mais aucun philosophe sérieux ne tolère le vol de chocolat. Trahison intellectuelle doublée d'un délit alimentaire. La double peine s'impose.",
      defenseSpeech: "Mon client a rendu service à l'humanité. Il a mangé ce chocolat pour démontrer en pratique l'inanité du concept de propriété privée appliqué aux denrées périssables. Geste pédagogique. Expérience de pensée incarnée. Le chocolat a financé une leçon de philosophie d'une valeur incalculable. Le voisin lui doit une dette intellectuelle.",
      difficulty: 4,
    },
    {
      title: "Sisyphe pour rupture de contrat infernal et pause-café syndicale",
      context: "Le Syndicat des Damnés Antiques poursuit Sisyphe pour avoir, le 17 du mois dernier, posé son rocher au sommet et fait une pause-café de 2 h, créant un précédent dangereux.",
      prosecutionSpeech: "Sisyphe avait un contrat clair : pousser, redescendre, pousser. Pour l'éternité. Et voici qu'il décide d'autorité d'une pause-café. Sans préavis. Sans délégué syndical. Il a abandonné son rocher en équilibre instable, mettant en danger la cohérence cosmique des Enfers. Absentéisme infernal qui doit cesser.",
      defenseSpeech: "Le contrat de mon client date de l'époque homérique. Aucune mention de pause. Aucune mention de droits du travailleur. Esclavage déguisé. La pause-café est un droit acquis dans toutes les civilisations modernes — et même les Enfers doivent évoluer. Mon client a milité pour le progrès social post-mortem. Il mérite une médaille, pas une condamnation.",
      difficulty: 5,
    },
    {
      title: "L'algorithme accusé de discrimination envers les pigeons urbains",
      context: "L'application de reconnaissance d'oiseaux BirdAI® refuse systématiquement d'identifier les pigeons urbains, les classant en « erreur d'image ». L'Association des Pigeons Urbains attaque.",
      prosecutionSpeech: "Cet algorithme a été nourri de millions de photos d'oiseaux exotiques, mais on a oublié les pigeons. RÉSULTAT : nos pigeons, citoyens à plumes des trottoirs, n'existent pas pour cette IA. Effacement numérique. Oblitération computationnelle. Les pigeons ont des droits — au minimum d'être reconnus comme oiseaux par une application qui prétend les reconnaître.",
      defenseSpeech: "Mon client l'algorithme est neutre. Il a été entraîné par des humains. S'il y a discrimination, c'est dans les données, pas dans le code. De plus, le pigeon urbain est, statistiquement, indiscernable d'un sac plastique froissé. L'algorithme fait de son mieux. Demander la perfection à une machine, c'est refuser l'imperfection humaine qui l'a créée.",
      difficulty: 4,
    },
    {
      title: "Le plombier accusé de pratique chamanique non déclarée",
      context: "M. Plouf, plombier à Lyon, est poursuivi pour avoir parlé pendant 47 minutes à un robinet bouché avant de le déboucher en « l'écoutant ». Le client conteste la prestation.",
      prosecutionSpeech: "Le client a payé 320 € pour entendre un plombier murmurer à un robinet : « Dis-moi ce qui te bloque. » Aucune clé. Aucun outil. De la psychothérapie hydraulique facturée au tarif plombier. Tromperie commerciale doublée d'une atteinte à la dignité de la profession. Les vrais plombiers utilisent des ventouses. Pas des séances de divination.",
      defenseSpeech: "Le robinet a été débouché. Le client est satisfait. Quel est le problème ? Mon client utilise une méthode holistique combinant 30 ans d'expérience et une oreille attentive aux canalisations. Les outils traditionnels n'auraient peut-être pas marché — la preuve : aucun autre plombier n'avait réussi avant lui. Le résultat compte plus que la méthode.",
      difficulty: 3,
    },
    {
      title: "Cléopâtre poursuivie post-mortem pour ostentation impériale",
      context: "Le Syndicat des Pharaons Modestes engage post-mortem une action collective contre Cléopâtre VII pour avoir, durant son règne, normalisé l'usage du lait d'ânesse en bain quotidien.",
      prosecutionSpeech: "Cléopâtre, par son train de vie indécemment somptueux, a creusé un fossé social qui résonne encore. Le lait d'ânesse, ressource précieuse, gaspillé pour la peau d'une seule personne ! Les ânes étaient épuisés. Les pharaons modestes, humiliés. Aujourd'hui encore, les influenceuses lui doivent leur tyrannie esthétique. Condamnez rétroactivement.",
      defenseSpeech: "Cléopâtre était une cheffe d'État. La diplomatie d'Antiquité exigeait une représentation flamboyante. Sans ses bains de lait, pas d'alliance avec César. Pas d'alliance avec Antoine. L'histoire entière de la Méditerranée serait différente. Son ostentation était politique, pas vaniteuse. Juger 2 000 ans plus tard sans contexte, c'est de l'anachronisme judiciaire.",
      difficulty: 5,
    },
  ],
};

// Deterministic pick of one case from the pool, given category + seed (date string).
// Same seed always yields same case → daily case is reproducible across devices.
export function pickFallbackCase(category, seed = "") {
  const pool = FALLBACK_POOL[category] || FALLBACK_POOL.penal;
  if (!seed) return { ...pool[Math.floor(Math.random() * pool.length)], category };
  let h = 0;
  const key = `${seed}-${category}`;
  for (let i = 0; i < key.length; i++) { h = ((h << 5) - h) + key.charCodeAt(i); h |= 0; }
  return { ...pool[Math.abs(h) % pool.length], category };
}

export function poolSize() {
  return Object.values(FALLBACK_POOL).reduce((acc, arr) => acc + arr.length, 0);
}

export function poolByCategory() {
  const out = {};
  for (const [k, v] of Object.entries(FALLBACK_POOL)) out[k] = v.length;
  return out;
}
