// Bilingual support for The Judge (FR / EN).
// Legal content (cases, codex, historic trials) stays in French — French law specific.
// UI strings, navigation, settings, profile, etc. are fully translated.

import { Storage } from "./storage.js";

export const LANGS = ["fr", "en"];
export const LANG_LABELS = { fr: "Français", en: "English" };

const STRINGS = {
  // ===== App identity =====
  "app.name":            { fr: "The Judge", en: "The Judge" },
  "app.tagline":         { fr: "Tribunal réaliste, 100 % local", en: "Realistic court, 100% local" },
  "app.tribunal_closed": { fr: "Le tribunal est fermé", en: "Court is closed" },
  "app.no_key_msg":      { fr: "Configurez une clé API pour des cas générés par IA, ou jouez avec les fallbacks hors-ligne.", en: "Set up an API key for AI-generated cases, or play with offline fallbacks." },
  "app.legal_notice":    { fr: "L'app utilise du droit français.", en: "Cases are based on French legal scenarios." },

  // ===== Navigation =====
  "nav.tribunal": { fr: "Tribunal", en: "Court" },
  "nav.archives": { fr: "Archives", en: "Archives" },
  "nav.profile":  { fr: "Profil",   en: "Profile" },
  "nav.codex":    { fr: "Codex",    en: "Codex" },
  "nav.costs":    { fr: "Coûts IA", en: "AI Costs" },
  "nav.settings": { fr: "Réglages", en: "Settings" },

  // ===== Panel titles =====
  "panel.archives":   { fr: "📜 ARCHIVES DU TRIBUNAL", en: "📜 COURT ARCHIVES" },
  "panel.profile":    { fr: "PROFIL DU JUGE",          en: "JUDGE PROFILE" },
  "panel.costs":      { fr: "💰 CONSOMMATION IA",      en: "💰 AI USAGE" },
  "panel.settings":   { fr: "⚙ PARAMÈTRES DU TRIBUNAL", en: "⚙ COURT SETTINGS" },

  // ===== Dashboard cards =====
  "card.daily.title":     { fr: "Audience du jour",     en: "Today's hearing" },
  "card.daily.judged":    { fr: "✅ Verdict prononcé",   en: "✅ Verdict delivered" },
  "card.daily.guilty":    { fr: "Coupable",              en: "Guilty" },
  "card.daily.innocent":  { fr: "Non-coupable",          en: "Not guilty" },
  "card.daily.ai":        { fr: "Cas généré par IA",     en: "AI-generated case" },
  "card.daily.offline":   { fr: "Cas hors-ligne disponible", en: "Offline case available" },
  "card.daily.cta":       { fr: "Tenir l'audience →",    en: "Open hearing →" },
  "card.daily.review":    { fr: "Revoir →",              en: "Review →" },

  "card.free.title": { fr: "Audience libre",     en: "Free hearing" },
  "card.free.body":  { fr: "Un cas généré à la demande, dans une catégorie aléatoire.", en: "A case generated on demand in a random category." },
  "card.free.cta":   { fr: "Lancer →",           en: "Launch →" },

  "card.historic.title":  { fr: "Procès historiques", en: "Historic trials" },
  "card.historic.body":   { fr: "{judged} / 40 jugés. Calas, Dreyfus, Outreau, Pétain, Templiers, Cléopâtre...", en: "{judged} / 40 tried. Calas, Dreyfus, Outreau, Pétain, Templars, Cleopatra..." },
  "card.historic.cta":    { fr: "Choisir une affaire →", en: "Pick a case →" },

  "card.weekly.title":   { fr: "Défi de la semaine", en: "Weekly challenge" },
  "card.weekly.summary": { fr: "{label} · × 2 XP — {cur}/{target}", en: "{label} · × 2 XP — {cur}/{target}" },
  "card.weekly.cta":     { fr: "Tenir une audience →", en: "Hold a hearing →" },

  "card.categories.title": { fr: "Catégories disponibles", en: "Available categories" },
  "card.categories.help":  { fr: "Cliquez sur une catégorie pour tenir une audience libre.", en: "Click a category to hold a free hearing." },

  // ===== Case header =====
  "case.dossier":    { fr: "DOSSIER N°",         en: "FILE No." },
  "case.category":   { fr: "CATÉGORIE",          en: "CATEGORY" },
  "case.difficulty": { fr: "Difficulté",         en: "Difficulty" },
  "case.free":       { fr: "⚖ AUDIENCE LIBRE",   en: "⚖ FREE HEARING" },
  "case.historic":   { fr: "📜 PROCÈS HISTORIQUE", en: "📜 HISTORIC TRIAL" },

  // ===== Speeches / verdict =====
  "speech.prosecution":    { fr: "⚔ ACCUSATION",  en: "⚔ PROSECUTION" },
  "speech.defense":        { fr: "🛡 DÉFENSE",    en: "🛡 DEFENSE" },
  "speech.open_hearing":   { fr: "📋 OUVRIR L'AUDIENCE", en: "📋 OPEN HEARING" },
  "speech.tts_listen":     { fr: "Écouter en TTS", en: "Listen via TTS" },
  "speech.tts_now":        { fr: "🔊 Lecture en cours...", en: "🔊 Now reading..." },
  "speech.tts_prosecution":{ fr: "Lecture : accusation", en: "Reading: prosecution" },
  "speech.tts_defense":    { fr: "Lecture : défense", en: "Reading: defense" },
  "speech.tts_done":       { fr: "Lecture terminée", en: "Reading complete" },

  "evidence.title":        { fr: "📁 PIÈCES À CONVICTION ({n})", en: "📁 EVIDENCE ({n})" },
  "evidence.hint":         { fr: "💡 Cliquez sur chaque pièce pour la consulter en détail.", en: "💡 Click each piece for details." },

  "witness.title":         { fr: "👥 INTERROGER LES TÉMOINS ({n})", en: "👥 QUESTION THE WITNESSES ({n})" },
  "witness.placeholder":   { fr: "Question au {name}...", en: "Question to the {name}..." },
  "witness.ask":           { fr: "INTERROGER", en: "QUESTION" },
  "witness.thinking":      { fr: "Le témoin réfléchit...", en: "Witness is thinking..." },

  "verdict.title":     { fr: "🔨 VOTRE VERDICT", en: "🔨 YOUR VERDICT" },
  "verdict.guilty":    { fr: "⚖ COUPABLE",       en: "⚖ GUILTY" },
  "verdict.innocent":  { fr: "🕊 NON-COUPABLE",   en: "🕊 NOT GUILTY" },
  "verdict.choose_first": { fr: "Choisissez d'abord coupable ou non-coupable", en: "Choose guilty or not guilty first" },
  "verdict.severity":  { fr: "Sévérité", en: "Severity" },
  "verdict.severity_1": { fr: "Avertissement", en: "Warning" },
  "verdict.severity_2": { fr: "Légère", en: "Light" },
  "verdict.severity_3": { fr: "Modérée", en: "Moderate" },
  "verdict.severity_4": { fr: "Sévère", en: "Severe" },
  "verdict.severity_5": { fr: "Maximale", en: "Maximum" },
  "verdict.argument_placeholder": { fr: "Argumentez votre verdict (motivation = bonus XP)", en: "Argue your verdict (reasoning = XP bonus)" },
  "verdict.submit":    { fr: "🔨 PRONONCER LE VERDICT", en: "🔨 DELIVER VERDICT" },
  "verdict.gained":    { fr: "+{xp} XP · {label}", en: "+{xp} XP · {label}" },

  // ===== Truth box =====
  "truth.title":       { fr: "📖 RÉVÉLATION DU DOSSIER", en: "📖 CASE REVELATION" },
  "truth.line_guilty":   { fr: "Selon les éléments réels du dossier, le prévenu était COUPABLE",      en: "Per the actual case file, the defendant was GUILTY" },
  "truth.line_innocent": { fr: "Selon les éléments réels du dossier, le prévenu était NON-COUPABLE",  en: "Per the actual case file, the defendant was NOT GUILTY" },
  "truth.clarity":     { fr: "clarté", en: "clarity" },
  "truth.score":       { fr: "Score de jugement", en: "Judgment score" },
  "truth.lawyer_p":    { fr: "Niveau accusation", en: "Prosecution level" },
  "truth.lawyer_d":    { fr: "Niveau défense",    en: "Defense level" },
  "truth.label.exemplary": { fr: "Verdict exemplaire", en: "Exemplary verdict" },
  "truth.label.good":  { fr: "Bon jugement", en: "Sound judgment" },
  "truth.label.ok":    { fr: "Conclusion juste mais perfectible", en: "Right conclusion, room to improve" },
  "truth.label.defendable": { fr: "Choix défendable malgré la vérité contraire", en: "Defendable choice despite the truth" },
  "truth.label.off":   { fr: "Verdict éloigné des faits", en: "Verdict far from the facts" },

  // ===== Quiz =====
  "quiz.title":   { fr: "📝 QUIZ JURIDIQUE", en: "📝 LEGAL QUIZ" },
  "quiz.correct": { fr: "✓ +5 XP — {ref}", en: "✓ +5 XP — {ref}" },
  "quiz.wrong":   { fr: "✗ Bonne réponse : « {answer} » — {ref}", en: "✗ Correct answer: \"{answer}\" — {ref}" },

  // ===== Bottom nav buttons =====
  "btn.back":           { fr: "← Tableau de bord", en: "← Dashboard" },
  "btn.share":          { fr: "📤 Partager", en: "📤 Share" },
  "btn.archives":       { fr: "📜 Archives", en: "📜 Archives" },
  "btn.free_audience":  { fr: "🎲 Audience libre", en: "🎲 Free hearing" },
  "btn.dashboard":      { fr: "⚖ Tableau de bord", en: "⚖ Dashboard" },
  "btn.review_dossier": { fr: "📖 Relire le dossier", en: "📖 Review file" },
  "btn.close":          { fr: "FERMER", en: "CLOSE" },
  "btn.judge":          { fr: "⚖ JUGER", en: "⚖ TRY" },
  "btn.reread":         { fr: "📖 RELIRE", en: "📖 RE-READ" },

  // ===== Toasts =====
  "toast.verdict_shared": { fr: "Verdict partagé", en: "Verdict shared" },
  "toast.share_failed":   { fr: "Échec du partage", en: "Share failed" },
  "toast.codex_unlocked": { fr: "📖 Codex débloqué : {label}", en: "📖 Codex unlocked: {label}" },
  "toast.cabinet_reward": { fr: "🎁 Cabinet : {icon} {name} ({rarity})", en: "🎁 Chambers: {icon} {name} ({rarity})" },
  "toast.precedent":      { fr: "📚 Verdict promu au rang de précédent personnel.", en: "📚 Verdict promoted to personal precedent." },
  "toast.promotion":      { fr: "👑 PROMOTION : {icon} {name}", en: "👑 PROMOTION: {icon} {name}" },
  "toast.achievement":    { fr: "🏆 Succès : {name}", en: "🏆 Achievement: {name}" },
  "toast.generating":     { fr: "⚖ Génération de l'audience...", en: "⚖ Generating hearing..." },
  "toast.generating_cat": { fr: "⚖ Génération d'une audience {cat}...", en: "⚖ Generating a {cat} hearing..." },

  // ===== AI errors =====
  "ai.error.invalid_key": { fr: "Clé API invalide. Vérifiez vos paramètres.", en: "Invalid API key. Check your settings." },
  "ai.error.rate_limit":  { fr: "Limite d'utilisation atteinte. Attendez ou changez de provider.", en: "Rate limit reached. Wait or change provider." },
  "ai.error.server":      { fr: "Erreur serveur IA. Réessayez dans quelques instants.", en: "AI server error. Retry in a moment." },
  "ai.error.timeout":     { fr: "L'IA met trop de temps à répondre. Vérifiez votre connexion.", en: "AI is taking too long. Check your connection." },
  "ai.error.no_key":      { fr: "Aucune clé API configurée. Ouvrez les paramètres.", en: "No API key set. Open settings." },
  "ai.error.no_model":    { fr: "Aucun modèle sélectionné.", en: "No model selected." },
  "ai.error.connect":     { fr: "Connexion impossible à l'IA. Vérifiez votre réseau.", en: "Cannot reach AI. Check your network." },
  "ai.error.network":     { fr: "Erreur réseau ({status}).", en: "Network error ({status})." },
  "ai.error.openrouter_free_policy": {
    fr: "Pour les modèles GRATUITS d'OpenRouter, activez la confidentialité dans votre compte : openrouter.ai/settings/privacy → cochez « Enable training on prompts ».",
    en: "Free OpenRouter models require enabling data sharing : openrouter.ai/settings/privacy → tick \"Enable training on prompts\".",
  },
  "ai.error.openrouter_cors": {
    fr: "Connexion à OpenRouter impossible. Vérifiez votre réseau, ou que votre clé n'a pas atteint le quota free quotidien (50 req/jour).",
    en: "Cannot reach OpenRouter. Check your network, or that your key hasn't hit the daily free quota (50 req/day).",
  },

  // ===== Career tiers =====
  "career.0.name":  { fr: "Stagiaire au tribunal",       en: "Court Intern" },
  "career.1.name":  { fr: "Greffier",                    en: "Court Clerk" },
  "career.2.name":  { fr: "Juge de proximité",           en: "Local Judge" },
  "career.3.name":  { fr: "Juge correctionnel",          en: "Criminal Judge" },
  "career.4.name":  { fr: "Conseiller à la Cour",        en: "Court Counsellor" },
  "career.5.name":  { fr: "Magistrat à la Cassation",    en: "Supreme Magistrate" },

  // ===== Reputation =====
  "rep.none":        { fr: "Juge sans réputation", en: "Judge without reputation" },
  "rep.none.desc":   { fr: "Pas encore assez de verdicts pour dégager une tendance.", en: "Not enough verdicts yet to derive a trend." },
  "rep.attentive":   { fr: "Le Juge attentif", en: "The Attentive Judge" },
  "rep.iron":        { fr: "Le Procureur de fer", en: "The Iron Prosecutor" },
  "rep.heart":       { fr: "L'Avocat de cœur", en: "The Tender Advocate" },
  "rep.curious":     { fr: "Le Magistrat curieux", en: "The Curious Magistrate" },
  "rep.inflexible":  { fr: "Le Juge inflexible", en: "The Inflexible Judge" },
  "rep.benevolent":  { fr: "Le Juge bienveillant", en: "The Benevolent Judge" },
  "rep.trait.severe":     { fr: "Sévère", en: "Severe" },
  "rep.trait.lenient":    { fr: "Clément", en: "Lenient" },
  "rep.trait.balanced":   { fr: "Équilibré", en: "Balanced" },
  "rep.trait.motivated":  { fr: "Motivé", en: "Reasoned" },
  "rep.trait.investigator": { fr: "Investigateur", en: "Investigator" },
  "rep.trait.rigorous":   { fr: "Rigoureux", en: "Rigorous" },
  "rep.trait.indulgent":  { fr: "Indulgent", en: "Indulgent" },

  // ===== Categories =====
  "cat.penal":          { fr: "Pénal",                en: "Criminal" },
  "cat.civil":          { fr: "Civil",                en: "Civil" },
  "cat.famille":        { fr: "Famille",              en: "Family" },
  "cat.travail":        { fr: "Travail",              en: "Labor" },
  "cat.consommation":   { fr: "Consommation",         en: "Consumer" },
  "cat.voisinage":      { fr: "Voisinage",            en: "Neighborhood" },
  "cat.routier":        { fr: "Routier",              en: "Traffic" },
  "cat.numerique":      { fr: "Numérique",            en: "Digital" },
  "cat.environnement":  { fr: "Environnement",        en: "Environment" },
  "cat.propriete_intellectuelle": { fr: "Propriété intellectuelle", en: "Intellectual property" },
  "cat.ubuesque":       { fr: "Ubuesque",             en: "Absurd" },

  // ===== Themes =====
  "theme.dark":        { fr: "Nuit profonde",         en: "Deep night" },
  "theme.dark.desc":   { fr: "Le défaut. Sobre, dramatique.", en: "Default. Sober, dramatic." },
  "theme.light":       { fr: "Salle d'audience",      en: "Courtroom" },
  "theme.light.desc":  { fr: "Plus clair, ambiance jour.", en: "Brighter, daylight feel." },
  "theme.versailles":  { fr: "Cour de Versailles",    en: "Versailles court" },
  "theme.versailles.desc": { fr: "Or, blanc, dorures monarchiques.", en: "Gold, white, royal trim." },
  "theme.rome":        { fr: "Forum romain",          en: "Roman forum" },
  "theme.rome.desc":   { fr: "Marbre, terracotta, poussière antique.", en: "Marble, terracotta, ancient dust." },
  "theme.cyber":       { fr: "Tribunal cyberpunk",    en: "Cyberpunk court" },
  "theme.cyber.desc":  { fr: "Néon violet, métal froid.", en: "Purple neon, cold metal." },
  "theme.boreal":      { fr: "Cour boréale",          en: "Boreal court" },
  "theme.boreal.desc": { fr: "Bleus glacés, blancs lunaires.", en: "Frozen blues, lunar whites." },
  "theme.scriptorium": { fr: "Scriptorium monacal",   en: "Monastic scriptorium" },
  "theme.scriptorium.desc": { fr: "Parchemin, encre brune, manuscrits.", en: "Parchment, brown ink, manuscripts." },
  "theme.bailey":      { fr: "Old Bailey",            en: "Old Bailey" },
  "theme.bailey.desc": { fr: "Acajou anglais, cuir vert, bibliothèque.", en: "English mahogany, green leather, library." },

  // ===== Settings sections =====
  "settings.section.ai":            { fr: "INTELLIGENCE ARTIFICIELLE", en: "ARTIFICIAL INTELLIGENCE" },
  "settings.section.perso":         { fr: "PERSONNALISATION", en: "PERSONALIZATION" },
  "settings.section.audio":         { fr: "AUDIO — VOIX", en: "AUDIO — VOICE" },
  "settings.section.notifs":        { fr: "NOTIFICATIONS", en: "NOTIFICATIONS" },
  "settings.section.expert":        { fr: "MODE EXPERT", en: "EXPERT MODE" },
  "settings.section.language":      { fr: "LANGUE / LANGUAGE", en: "LANGUAGE / LANGUE" },
  "settings.section.danger":        { fr: "ZONE SENSIBLE", en: "DANGER ZONE" },
  "settings.costs.see_details":     { fr: "Voir le détail des appels IA →", en: "See AI call details →" },

  "settings.step.provider":     { fr: "1 · Choisissez votre Provider IA", en: "1 · Choose your AI provider" },
  "settings.step.api_key":      { fr: "2 · Clé API {provider}", en: "2 · API key {provider}" },
  "settings.step.model":        { fr: "3 · Choisissez le modèle", en: "3 · Pick the model" },
  "settings.step.estimate":     { fr: "💰 COÛT ESTIMÉ POUR 100 MESSAGES", en: "💰 ESTIMATED COST FOR 100 MESSAGES" },

  "settings.api_key.placeholder": { fr: "Collez votre clé API ici", en: "Paste your API key here" },
  "settings.api_key.test":      { fr: "TESTER LA CLÉ", en: "TEST KEY" },
  "settings.api_key.testing":   { fr: "Test en cours...", en: "Testing..." },
  "settings.api_key.valid":     { fr: "✓ Clé valide", en: "✓ Key valid" },
  "settings.api_key.get":       { fr: "🔗 Obtenir une clé →", en: "🔗 Get a key →" },
  "settings.api_key.openrouter_privacy": {
    fr: "Activer la confidentialité pour les modèles gratuits (obligatoire) →",
    en: "Enable data sharing for free models (required) →",
  },

  "settings.username":          { fr: "Nom du juge", en: "Judge's name" },
  "settings.username_default":  { fr: "Votre Honneur", en: "Your Honor" },
  "settings.avatar":            { fr: "Avatar", en: "Avatar" },
  "settings.motto":             { fr: "Devise du juge (optionnelle)", en: "Judge's motto (optional)" },
  "settings.motto.placeholder": { fr: "« La justice sans la force est impuissante. »", en: "\"Justice without strength is powerless.\"" },
  "settings.theme":             { fr: "Thème (8 disponibles)", en: "Theme (8 available)" },
  "settings.language":          { fr: "Langue de l'interface", en: "Interface language" },

  "settings.tts.on":            { fr: "🔊 TTS activée — désactiver", en: "🔊 TTS on — turn off" },
  "settings.tts.off":           { fr: "🔇 Activer la lecture audio des plaidoiries", en: "🔇 Turn on speech-to-text playback" },
  "settings.tts.voices":        { fr: "{n} voix française(s) détectée(s) sur ce système.", en: "{n} voice(s) detected on this system." },
  "settings.tts.no_voice":      { fr: "Aucune voix française détectée — la lecture utilisera la voix système par défaut.", en: "No matching voice — playback will use the system default." },
  "settings.tts.engine":        { fr: "Moteur de voix", en: "Voice engine" },
  "settings.tts.engine.premium":      { fr: "🎙 Premium (auto)", en: "🎙 Premium (auto)" },
  "settings.tts.engine.premium.desc": { fr: "Sélectionne la meilleure voix native disponible (Google, Microsoft Neural, Apple Siri…). Gratuit, hors-ligne.", en: "Picks the best native voice (Google, Microsoft Neural, Apple Siri…). Free, offline." },
  "settings.tts.engine.system":       { fr: "🤖 Système (basique)", en: "🤖 System (basic)" },
  "settings.tts.engine.system.desc":  { fr: "Voix par défaut du navigateur. Plus robotique mais universelle.", en: "Browser default voice. More robotic but universal." },
  "settings.tts.engine.openai":       { fr: "✨ OpenAI HD", en: "✨ OpenAI HD" },
  "settings.tts.engine.openai.desc":  { fr: "Voix neuronale ultra-naturelle. ~0,02$ par audience. Nécessite une clé OpenAI.", en: "Ultra-natural neural voice. ~$0.02 per hearing. Requires OpenAI key." },
  "settings.tts.engine.openai.required": { fr: "Sélectionnez OpenAI comme provider IA pour activer ce moteur.", en: "Select OpenAI as your AI provider to enable this engine." },

  "settings.notifs.intro":      { fr: "Recevez un rappel quotidien à l'heure de votre choix.", en: "Get a daily reminder at the time you choose." },
  "settings.notifs.hour":       { fr: "Heure :", en: "Time:" },
  "settings.notifs.activate":   { fr: "Activer le rappel quotidien", en: "Turn on daily reminder" },
  "settings.notifs.reschedule": { fr: "Reprogrammer le rappel quotidien", en: "Reschedule daily reminder" },
  "settings.notifs.deactivate": { fr: "Désactiver", en: "Turn off" },
  "settings.notifs.scheduled":  { fr: "Rappel programmé à {time}", en: "Reminder scheduled at {time}" },
  "settings.notifs.denied":     { fr: "Permission refusée", en: "Permission denied" },
  "settings.notifs.off":        { fr: "Rappel désactivé", en: "Reminder turned off" },
  "settings.notifs.unavailable":{ fr: "Notifications non disponibles sur ce navigateur", en: "Notifications not available in this browser" },

  "settings.expert.intro":      { fr: "Plaidoiries plus longues, pièces à conviction additionnelles, vocabulaire technique. Pour juristes confirmés et étudiants.", en: "Longer speeches, more evidence, technical vocabulary. For seasoned lawyers and law students." },
  "settings.expert.on":         { fr: "✓ Mode expert activé", en: "✓ Expert mode on" },
  "settings.expert.off":        { fr: "Activer le mode expert", en: "Turn on expert mode" },

  "settings.danger.btn":        { fr: "EFFACER TOUTES LES DONNÉES", en: "ERASE ALL DATA" },
  "settings.danger.confirm":    { fr: "Effacer toutes les données locales (cas, verdicts, profil) ? Cette action est irréversible.", en: "Erase all local data (cases, verdicts, profile)? This cannot be undone." },
  "settings.danger.done":       { fr: "Données effacées", en: "Data erased" },

  "settings.save":              { fr: "ENREGISTRER ET COMMENCER", en: "SAVE AND START" },
  "settings.saved":             { fr: "Paramètres enregistrés", en: "Settings saved" },
  "settings.notice_legal":      { fr: "", en: "Note: legal cases are based on real French law. UI is in English; case content stays in French." },

  // ===== Profile =====
  "profile.tab.stats":         { fr: "📊 Stats", en: "📊 Stats" },
  "profile.tab.career":        { fr: "🏛 Carrière", en: "🏛 Career" },
  "profile.tab.reputation":    { fr: "👁 Réputation", en: "👁 Reputation" },
  "profile.tab.cabinet":       { fr: "🏠 Cabinet", en: "🏠 Chambers" },
  "profile.tab.codex":         { fr: "📖 Codex", en: "📖 Codex" },
  "profile.tab.jurisprudence": { fr: "📚 Jurisprudence", en: "📚 Precedents" },
  "profile.tab.parties":       { fr: "👥 Parties", en: "👥 Parties" },
  "profile.tab.achievements":  { fr: "🏆 Succès", en: "🏆 Achievements" },

  "profile.master":            { fr: "Maître {name}", en: "Hon. {name}" },

  "profile.stat.streak_current":  { fr: "🔥 Streak actuel", en: "🔥 Current streak" },
  "profile.stat.streak_best":     { fr: "🏆 Plus long streak", en: "🏆 Longest streak" },
  "profile.stat.total_verdicts":  { fr: "📊 Total verdicts", en: "📊 Total verdicts" },
  "profile.stat.total_xp":        { fr: "⭐ XP total", en: "⭐ Total XP" },
  "profile.stat.judgment_score":  { fr: "🎯 Score moyen de jugement", en: "🎯 Avg. judgment score" },
  "profile.stat.alignment":       { fr: "📐 Alignement avec la vérité", en: "📐 Truth alignment" },
  "profile.stat.guilty_rate":     { fr: "⚖ Taux de culpabilité", en: "⚖ Guilty rate" },
  "profile.stat.arguments":       { fr: "💬 Arguments motivés", en: "💬 Reasoned arguments" },
  "profile.stat.questions":       { fr: "❓ Questions aux témoins", en: "❓ Witness questions" },
  "profile.stat.fav_category":    { fr: "🎭 Catégorie favorite", en: "🎭 Favorite category" },
  "profile.stat.avg_difficulty":  { fr: "🎯 Difficulté moyenne", en: "🎯 Avg. difficulty" },
  "profile.stat.precedents":      { fr: "📚 Précédents créés", en: "📚 Precedents created" },
  "profile.stat.free_audiences":  { fr: "🎲 Audiences libres", en: "🎲 Free hearings" },
  "profile.stat.historic":        { fr: "📜 Procès historiques", en: "📜 Historic trials" },
  "profile.stat.cabinet":         { fr: "🏠 Cabinet collecté", en: "🏠 Chambers collected" },
  "profile.stat.codex":           { fr: "📖 Codex débloqué", en: "📖 Codex unlocked" },
  "profile.stat.achievements":    { fr: "🏆 Succès débloqués", en: "🏆 Achievements unlocked" },
  "profile.stat.shared":          { fr: "📤 Verdict partagé", en: "📤 Verdict shared" },
  "profile.stat.tts":             { fr: "🔊 TTS écouté", en: "🔊 TTS listened" },

  "profile.career.intro":     { fr: "Votre parcours dans la magistrature française.", en: "Your path through the judicial career." },
  "profile.career.required":  { fr: "{n} verdicts requis · difficulté max {d}", en: "{n} verdicts required · max difficulty {d}" },
  "profile.career.current":   { fr: "Actuel", en: "Current" },

  "profile.cabinet.title":    { fr: "🏠 Cabinet du juge", en: "🏠 Judge's chambers" },
  "profile.cabinet.locked":   { fr: "Non débloqué", en: "Not unlocked" },
  "profile.cabinet.locked_desc": { fr: "Continuez à juger pour débloquer.", en: "Keep judging to unlock." },

  "profile.codex.title":      { fr: "📖 Codex juridique", en: "📖 Legal codex" },
  "profile.codex.intro":      { fr: "Articles de loi et notions débloqués au fil des verdicts. Cliquez « 📚 En savoir plus » pour demander à l'IA de l'expliquer.", en: "Legal articles and concepts unlocked as you judge. Click \"📚 Learn more\" to ask the AI for an explanation." },
  "profile.codex.locked":     { fr: "🔒 Verrouillé", en: "🔒 Locked" },
  "profile.codex.locked_desc":{ fr: "Jugez davantage de cas de ce domaine pour débloquer.", en: "Judge more cases in this area to unlock." },
  "profile.codex.more":       { fr: "📚 En savoir plus (IA)", en: "📚 Learn more (AI)" },
  "profile.codex.consulting": { fr: "⏳ Consultation de l'expert...", en: "⏳ Asking the expert..." },
  "profile.codex.deepened":   { fr: "📚 Approfondi ✓", en: "📚 Detailed ✓" },
  "profile.codex.retry":      { fr: "📚 Réessayer", en: "📚 Retry" },
  "profile.codex.need_key":   { fr: "Configurez une clé API dans les paramètres pour activer cette fonction.", en: "Set up an API key in settings to enable this." },

  "profile.precedents.title": { fr: "📚 Précédents personnels", en: "📚 Personal precedents" },
  "profile.precedents.empty": { fr: "Aucun précédent encore. Argumentez longuement vos verdicts (≥80 caractères), tenez une streak ≥ 7 jours, ou jugez des cas difficiles (≥4) pour créer vos premiers.", en: "No precedents yet. Reason your verdicts in detail (≥80 chars), keep a streak ≥7 days, or try harder cases (≥4) to create some." },
  "profile.precedents.cited": { fr: "cité", en: "cited" },

  "profile.parties.title":    { fr: "👥 Parties croisées", en: "👥 Parties seen" },
  "profile.parties.empty":    { fr: "Aucune partie répertoriée. Les visages reviendront au fil des audiences.", en: "No parties recorded yet. Faces will reappear as you judge." },
  "profile.parties.first_seen": { fr: "Première vue : {date}", en: "First seen: {date}" },
  "profile.parties.record":   { fr: "Condamné(e) : {l} fois · Relaxé(e) : {w} fois", en: "Convicted: {l} times · Acquitted: {w} times" },

  "profile.achievements.title":   { fr: "🏆 Succès ({u} / {t})", en: "🏆 Achievements ({u} / {t})" },
  "profile.achievements.hidden":  { fr: "🤫 Succès cachés ({u} / {t} découverts)", en: "🤫 Hidden achievements ({u} / {t} discovered)" },
  "profile.achievements.unknown": { fr: "???", en: "???" },
  "profile.achievements.locked_desc": { fr: "Découvrez ce succès en jouant.", en: "Discover this achievement by playing." },

  // ===== History / archives =====
  "history.recent":           { fr: "Vos {n} dernière{s} audience{s} (max 10).", en: "Your {n} most recent hearing{s} (max 10)." },
  "history.empty":            { fr: "Aucune audience archivée pour le moment.", en: "No archived hearings yet." },
  "history.empty_cta":        { fr: "⚖ AUX AUDIENCES", en: "⚖ TO HEARINGS" },
  "history.older":            { fr: "{n} audience{s} plus ancienne{s} archivée{s} en mémoire locale.", en: "{n} older hearing{s} archived locally." },
  "history.your_verdict":     { fr: "⚖ Votre verdict de l'époque", en: "⚖ Your verdict at the time" },
  "history.severity_label.0": { fr: "", en: "" },
  "history.severity_label.1": { fr: "Avertissement", en: "Warning" },
  "history.severity_label.2": { fr: "Sanction légère", en: "Light sentence" },
  "history.severity_label.3": { fr: "Sanction modérée", en: "Moderate sentence" },
  "history.severity_label.4": { fr: "Sanction sévère", en: "Severe sentence" },
  "history.severity_label.5": { fr: "Sanction maximale", en: "Maximum sentence" },
  "history.truth_was":        { fr: "Vérité du dossier : {truth} — Score {s}/100", en: "Case truth: {truth} — Score {s}/100" },

  // ===== Costs panel =====
  "costs.session":           { fr: "CETTE SESSION", en: "THIS SESSION" },
  "costs.alltime":           { fr: "TOUT TEMPS", en: "ALL TIME" },
  "costs.per100":            { fr: "PAR 100 MESSAGES (modèle actuel)", en: "PER 100 MESSAGES (current model)" },
  "costs.tokens_in":         { fr: "Tokens envoyés", en: "Tokens sent" },
  "costs.tokens_out":        { fr: "Tokens reçus", en: "Tokens received" },
  "costs.session_cost":      { fr: "Coût session", en: "Session cost" },
  "costs.provider":          { fr: "Provider utilisé", en: "Active provider" },
  "costs.total_tokens":      { fr: "Total tokens", en: "Total tokens" },
  "costs.total_cost":        { fr: "Coût total", en: "Total cost" },
  "costs.sessions":          { fr: "Sessions", en: "Sessions" },
  "costs.active_days":       { fr: "Jours actifs", en: "Active days" },
  "costs.model":             { fr: "Modèle", en: "Model" },
  "costs.estimated_cost":    { fr: "Coût estimé", en: "Estimated cost" },
  "costs.verdict":           { fr: "Verdict", en: "Verdict" },
  "costs.change_model":      { fr: "CHANGER DE MODÈLE", en: "CHANGE MODEL" },
  "costs.reset_session":     { fr: "RESET SESSION", en: "RESET SESSION" },
  "costs.compare":           { fr: "COMPARER", en: "COMPARE" },
  "costs.session_reset":     { fr: "Session réinitialisée", en: "Session reset" },
  "costs.history":           { fr: "HISTORIQUE DES APPELS (30 derniers)", en: "CALL HISTORY (last 30)" },
  "costs.col_date":          { fr: "Date", en: "Date" },
  "costs.col_model":         { fr: "Modèle", en: "Model" },
  "costs.col_cost":          { fr: "Coût", en: "Cost" },
  "costs.empty":             { fr: "— aucun appel enregistré —", en: "— no calls yet —" },
  "costs.compare.title":     { fr: "Comparatif des modèles (sur votre volume)", en: "Model comparison (your volume)" },

  // ===== Notifications =====
  "notif.daily.title":  { fr: "⚖ L'audience reprend", en: "⚖ Court is in session" },
  "notif.daily.body":   { fr: "Le tribunal vous attend pour l'affaire du jour.", en: "Court awaits you for today's case." },

  // ===== Weekly challenge =====
  "weekly.label":       { fr: "Semaine {cat}", en: "{cat} Week" },
  "weekly.description": { fr: "Tranchez 5 affaires de catégorie « {cat} » cette semaine. Bonus XP × 2 sur chaque verdict de la catégorie.", en: "Decide 5 \"{cat}\" cases this week. ×2 XP bonus on each verdict in this category." },
  "weekly.done":        { fr: "✅ Défi accompli — bravo Maître.", en: "✅ Challenge completed — well played." },
  "weekly.hold_hearing":{ fr: "⚖ Tenir une audience {cat}", en: "⚖ Hold a {cat} hearing" },

  // ===== Days / months =====
  "day.0": { fr: "Dimanche",  en: "Sunday" },
  "day.1": { fr: "Lundi",     en: "Monday" },
  "day.2": { fr: "Mardi",     en: "Tuesday" },
  "day.3": { fr: "Mercredi",  en: "Wednesday" },
  "day.4": { fr: "Jeudi",     en: "Thursday" },
  "day.5": { fr: "Vendredi",  en: "Friday" },
  "day.6": { fr: "Samedi",    en: "Saturday" },
  "month.0":  { fr: "janvier",   en: "January" },
  "month.1":  { fr: "février",   en: "February" },
  "month.2":  { fr: "mars",      en: "March" },
  "month.3":  { fr: "avril",     en: "April" },
  "month.4":  { fr: "mai",       en: "May" },
  "month.5":  { fr: "juin",      en: "June" },
  "month.6":  { fr: "juillet",   en: "July" },
  "month.7":  { fr: "août",      en: "August" },
  "month.8":  { fr: "septembre", en: "September" },
  "month.9":  { fr: "octobre",   en: "October" },
  "month.10": { fr: "novembre",  en: "November" },
  "month.11": { fr: "décembre",  en: "December" },
  "date.today":        { fr: "Aujourd'hui", en: "Today" },
  "date.yesterday":    { fr: "Hier",       en: "Yesterday" },
  "date.day_before":   { fr: "Avant-hier", en: "Day before yesterday" },
  "date.days_ago":     { fr: "Il y a {n} jours", en: "{n} days ago" },

  // ===== Misc =====
  "misc.copy":         { fr: "Coller", en: "Paste" },
  "misc.show":         { fr: "Afficher", en: "Show" },

  // ===== Hard refresh =====
  "refresh.title":     { fr: "Vider le cache et recharger", en: "Clear cache and reload" },
  "refresh.toast":     { fr: "🔄 Vidage du cache...", en: "🔄 Clearing cache..." },
  "refresh.done":      { fr: "✓ Cache vidé. Rechargement...", en: "✓ Cache cleared. Reloading..." },
  "refresh.note":      { fr: "Vos données (verdicts, profil) ne sont pas effacées.", en: "Your data (verdicts, profile) is preserved." },

  // ===== Onboarding =====
  "onb.title":         { fr: "Bienvenue à la cour", en: "Welcome to the court" },
  "onb.skip":          { fr: "Passer", en: "Skip" },
  "onb.next":          { fr: "Suivant →", en: "Next →" },
  "onb.start":         { fr: "Commencer", en: "Get started" },
  "onb.step.1.title":  { fr: "Vous êtes le juge.", en: "You are the judge." },
  "onb.step.1.body":   { fr: "Chaque jour, une nouvelle affaire vous est confiée. Lisez les plaidoiries, examinez les pièces, interrogez les témoins, puis prononcez votre verdict.", en: "Each day, a new case is presented to you. Read the pleadings, examine the evidence, question witnesses, then deliver your verdict." },
  "onb.step.2.title":  { fr: "Aucun verdict n'est mauvais.", en: "No verdict is wrong." },
  "onb.step.2.body":   { fr: "Chaque affaire a une vérité cachée. Vos décisions sont évaluées sur 100, mais un choix défendable face à une vérité contraire est respecté.", en: "Each case has a hidden truth. Your decisions are scored out of 100, but a defendable choice against the truth is still respected." },
  "onb.step.3.title":  { fr: "Une carrière, un univers.", en: "A career, a universe." },
  "onb.step.3.body":   { fr: "Verdicts → XP → carrière. Argumentez vos décisions pour créer des précédents personnels. Débloquez 72 articles de droit et 30 objets de cabinet. 100 % local, vos données restent chez vous.", en: "Verdicts → XP → career. Reason your decisions to create personal precedents. Unlock 72 legal articles and 30 chamber items. 100% local — your data stays on your device." },
  "onb.step.4.title":  { fr: "Choisissez votre niveau", en: "Pick your level" },
  "onb.step.4.body":   { fr: "Vous pouvez ajuster ce niveau à tout moment dans les Réglages.", en: "You can change this level any time in Settings." },

  // ===== Profils utilisateurs (4 niveaux) =====
  "mode.section":         { fr: "QUI ÊTES-VOUS ?", en: "WHO ARE YOU?" },
  "mode.section.intro":   { fr: "Choisissez le niveau qui vous correspond. Vous pouvez en changer à tout moment.", en: "Pick the level that fits you. You can change it any time." },

  "mode.neophyte":        { fr: "🌱 Néophyte", en: "🌱 Beginner" },
  "mode.neophyte.short":  { fr: "Aucune connaissance juridique", en: "No legal background" },
  "mode.neophyte.desc":   { fr: "Récits courts, langage du quotidien. Dilemmes moraux, scènes de vie, histoires de couple, voisinage, boulot. Le droit reste discret.", en: "Short stories, everyday language. Moral dilemmas, life scenes, couples, neighborhood, work. Law stays in the background." },

  "mode.curieux":         { fr: "🧐 Curieux", en: "🧐 Curious" },
  "mode.curieux.short":   { fr: "Quelques notions, j'aime apprendre", en: "Some knowledge, I like to learn" },
  "mode.curieux.desc":    { fr: "Cas concrets de la vie réelle (consommation, voisins, route, famille), avec quelques articles de loi expliqués simplement.", en: "Real-life cases (consumer, neighbors, traffic, family) with a few law references explained simply." },

  "mode.etudiant":        { fr: "🎓 Étudiant", en: "🎓 Law student" },
  "mode.etudiant.short":  { fr: "Étudiant en droit ou autodidacte", en: "Law student or self-taught" },
  "mode.etudiant.desc":   { fr: "Toutes les catégories juridiques, plaidoiries motivées, articles précis, codex enrichi. Prépare CRFPA, M2, examens.", en: "All legal categories, reasoned pleadings, precise articles, full codex. Prepares CRFPA, M2, exams." },

  "mode.expert":          { fr: "⚖ Expert", en: "⚖ Expert" },
  "mode.expert.short":    { fr: "Diplômé, professionnel du droit", en: "Graduate, legal professional" },
  "mode.expert.desc":     { fr: "Plaidoiries longues, vocabulaire technique précis, jurisprudence Cass. citée, cas-doctrine. Pour juristes confirmés.", en: "Long pleadings, technical vocabulary, cited case law, doctrinal nodes. For seasoned lawyers." },
  "mode.current":         { fr: "Mode actuel", en: "Current mode" },
  "mode.changed":         { fr: "Mode changé", en: "Mode changed" },
  "mode.active":          { fr: "Actif", en: "Active" },
  "mode.regen_confirm":   { fr: "Voulez-vous régénérer le cas du jour pour qu'il s'adapte à votre nouveau niveau ?", en: "Regenerate today's case to fit your new level?" },
  "mode.regen_hint":      { fr: "Le nouveau mode s'appliquera au prochain cas. Cliquez sur 🔄 pour rafraîchir tout de suite.", en: "New mode applies to the next case. Click 🔄 to refresh now." },

  // ===== Nouvelles catégories grand public =====
  "cat.dilemmes":         { fr: "Dilemmes moraux",      en: "Moral dilemmas" },
  "cat.couple_famille":   { fr: "Couple & famille",     en: "Couple & family" },
  "cat.ado_parents":      { fr: "Ado vs parents",       en: "Teen vs parents" },
  "cat.boulot":           { fr: "Vie au boulot",        en: "Office life" },
  "cat.resto":            { fr: "Resto & service",      en: "Restaurant & service" },
  "cat.animaux":          { fr: "Animaux & humains",    en: "Animals & humans" },
  "cat.quotidien":        { fr: "Vie quotidienne",      en: "Daily life" },

  // ===== Quests =====
  "quests.title":      { fr: "🎯 Quêtes hebdomadaires", en: "🎯 Weekly quests" },
  "quests.intro":      { fr: "Trois quêtes chaque semaine. Récompense × 1.5 XP à la complétion.", en: "Three quests each week. ×1.5 XP reward on completion." },
  "quests.completed":  { fr: "✅ Accomplie", en: "✅ Done" },
  "quests.progress":   { fr: "{cur} / {target}", en: "{cur} / {target}" },
  "quests.q1":         { fr: "Juger {n} affaires de catégorie {cat}", en: "Judge {n} {cat} cases" },
  "quests.q2":         { fr: "Argumenter {n} verdicts (≥ 60 caractères)", en: "Argue {n} verdicts (≥60 chars)" },
  "quests.q3":         { fr: "Examiner toutes les pièces dans {n} audiences", en: "Examine all evidence in {n} hearings" },
  "quests.q4":         { fr: "Interroger un témoin dans {n} audiences", en: "Question a witness in {n} hearings" },
  "quests.q5":         { fr: "Aligner {n} verdicts avec la vérité du dossier", en: "Align {n} verdicts with the case truth" },
  "quests.q6":         { fr: "Maintenir une streak de {n} jours", en: "Maintain a {n}-day streak" },
  "quests.reward":     { fr: "🎁 Quête accomplie : +{xp} XP bonus", en: "🎁 Quest done: +{xp} XP bonus" },

  // ===== Codex search =====
  "codex.search":      { fr: "🔍 Rechercher dans le codex...", en: "🔍 Search codex..." },
  "codex.legifrance":  { fr: "↗ Légifrance", en: "↗ Légifrance" },
  "codex.no_results":  { fr: "Aucune entrée correspondante.", en: "No matching entries." },

  // ===== Weekly summary =====
  "summary.title":     { fr: "📊 Synthèse de la semaine", en: "📊 Weekly summary" },
  "summary.verdicts":  { fr: "{n} verdicts rendus", en: "{n} verdicts delivered" },
  "summary.unlocks":   { fr: "{n} entrées de codex débloquées", en: "{n} codex entries unlocked" },
  "summary.achievements": { fr: "{n} succès débloqués", en: "{n} achievements unlocked" },
  "summary.xp":        { fr: "{n} XP gagnés", en: "{n} XP earned" },
  "summary.top_cat":   { fr: "Catégorie dominante : {cat}", en: "Top category: {cat}" },
  "summary.empty":     { fr: "Aucune activité cette semaine.", en: "No activity this week." },
  "summary.dismiss":   { fr: "Vu →", en: "Got it →" },

  // ===== Streak milestones =====
  "streak.next":       { fr: "Prochain palier : {n} jours", en: "Next milestone: {n} days" },
  "streak.reward.7":   { fr: "🔥 Streak 7 jours : objet rare offert", en: "🔥 7-day streak: rare item granted" },
  "streak.reward.30":  { fr: "🔥 Streak 30 jours : objet épique offert", en: "🔥 30-day streak: epic item granted" },
  "streak.reward.100": { fr: "🔥 Streak 100 jours : thème légendaire débloqué", en: "🔥 100-day streak: legendary theme unlocked" },
  "streak.reward.365": { fr: "🔥 Streak 365 jours : titre honorifique perpétuel", en: "🔥 365-day streak: lifetime honorary title" },

  // ===== Heatmap =====
  "heatmap.title":     { fr: "🗓 Activité (12 dernières semaines)", en: "🗓 Activity (last 12 weeks)" },
  "heatmap.empty":     { fr: "—", en: "—" },
  "heatmap.day":       { fr: "{n} verdict(s)", en: "{n} verdict(s)" },

  // ===== Volume sliders =====
  "vol.section":       { fr: "VOLUME AUDIO", en: "AUDIO VOLUME" },
  "vol.ambient":       { fr: "Ambiance tribunal", en: "Courtroom ambient" },
  "vol.gavel":         { fr: "Marteau", en: "Gavel" },
  "vol.tts":           { fr: "Voix off (TTS)", en: "TTS voice" },
  "vol.master":        { fr: "Volume général", en: "Master volume" },

  // ===== Narrative chapter =====
  "narrative.title":   { fr: "📖 Chapitre {n}", en: "📖 Chapter {n}" },
  "narrative.dismiss": { fr: "Continuer →", en: "Continue →" },

  // ===== Share verdict (Wordle-style emoji) =====
  "share.copied":      { fr: "📋 Copié dans le presse-papier", en: "📋 Copied to clipboard" },
  "share.title":       { fr: "Partager mon verdict", en: "Share my verdict" },
  "share.text.daily":  { fr: "The Judge — Verdict du jour", en: "The Judge — Today's verdict" },

  // ===== Update banner =====
  "update.available":  { fr: "Une nouvelle version est disponible.", en: "A new version is available." },
  "update.reload":     { fr: "Recharger", en: "Reload" },
  "update.later":      { fr: "Plus tard", en: "Later" },

  // ===== 12 jurés =====
  "jury.title":        { fr: "Le jury délibère", en: "The jury deliberates" },
  "jury.intro":        { fr: "12 jurés tirés au sort donnent leur avis. À vous d'écouter et trancher.", en: "12 jurors share their views. You listen and decide." },
  "jury.consult":      { fr: "Consulter le jury", en: "Consult the jury" },
  "jury.stance.guilty":   { fr: "Coupable", en: "Guilty" },
  "jury.stance.innocent": { fr: "Non-coupable", en: "Not guilty" },
  "jury.stance.undecided":{ fr: "Indécis", en: "Undecided" },
  // Personae
  "jury.j1.name":  { fr: "Mme Bernard, retraitée",       en: "Ms. Bernard, retiree" },
  "jury.j1.style": { fr: "Pragmatique, traditionnelle",   en: "Pragmatic, traditional" },
  "jury.j1.line.guilty.0":   { fr: "À mon époque, on ne tolérait pas ça. Coupable.", en: "Back in my day we didn't tolerate this. Guilty." },
  "jury.j1.line.guilty.1":   { fr: "Le bon sens dit clairement coupable.",            en: "Common sense says guilty." },
  "jury.j1.line.innocent.0": { fr: "Vu son contexte, on ne peut pas vraiment le condamner.", en: "Given the context, we can't really convict." },
  "jury.j1.line.innocent.1": { fr: "Cela reste un être humain qui a souffert.",        en: "He's a human being who has suffered." },
  "jury.j1.line.undecided.0":{ fr: "Je suis partagée, sincèrement.",                   en: "Honestly, I'm torn." },
  "jury.j1.line.undecided.1":{ fr: "Je n'ai pas tous les éléments.",                   en: "I don't have all the facts." },
  "jury.j2.name":  { fr: "M. Garnier, ancien militaire", en: "Mr. Garnier, retired soldier" },
  "jury.j2.style": { fr: "Strict, hiérarchique",         en: "Strict, hierarchical" },
  "jury.j2.line.guilty.0":   { fr: "Il faut faire respecter la loi. Coupable.",     en: "Law must be enforced. Guilty." },
  "jury.j2.line.guilty.1":   { fr: "Si on commence à excuser, c'est l'anarchie.",   en: "Excuses are the start of anarchy." },
  "jury.j2.line.innocent.0": { fr: "Les preuves manquent franchement.",             en: "Evidence is genuinely lacking." },
  "jury.j2.line.innocent.1": { fr: "Pas assez pour condamner. Relaxe.",             en: "Not enough to convict. Acquit." },
  "jury.j2.line.undecided.0":{ fr: "J'ai besoin de plus d'éléments.",               en: "I need more facts." },
  "jury.j2.line.undecided.1":{ fr: "Pas tranché.",                                  en: "Undecided." },
  "jury.j3.name":  { fr: "Maître Caron, magistrat",      en: "Mr. Caron, magistrate" },
  "jury.j3.style": { fr: "Rigoureux, analytique",        en: "Rigorous, analytical" },
  "jury.j3.line.guilty.0":   { fr: "Les éléments du dossier penchent vers la culpabilité.", en: "The case elements lean toward guilt." },
  "jury.j3.line.guilty.1":   { fr: "Coupable, mais avec circonstances atténuantes possibles.", en: "Guilty, but with possible mitigation." },
  "jury.j3.line.innocent.0": { fr: "Le doute raisonnable s'impose. Relaxe.",        en: "Reasonable doubt prevails. Acquit." },
  "jury.j3.line.innocent.1": { fr: "Pas assez pour franchir le seuil de conviction.", en: "Not enough to meet the threshold." },
  "jury.j3.line.undecided.0":{ fr: "Le dossier est techniquement délicat.",         en: "The case is technically tricky." },
  "jury.j3.line.undecided.1":{ fr: "Je veux relire les pièces avant.",              en: "I want to review the evidence first." },
  "jury.j4.name":  { fr: "Léa, étudiante",               en: "Léa, student" },
  "jury.j4.style": { fr: "Idéaliste, empathique",        en: "Idealistic, empathetic" },
  "jury.j4.line.guilty.0":   { fr: "Difficile, mais c'est la justice. Coupable.",   en: "Hard, but justice demands it. Guilty." },
  "jury.j4.line.guilty.1":   { fr: "Coupable, avec sanction adaptée.",              en: "Guilty, with adapted sentence." },
  "jury.j4.line.innocent.0": { fr: "On juge l'acte, pas la personne. Non-coupable.", en: "We judge the act, not the person. Not guilty." },
  "jury.j4.line.innocent.1": { fr: "Le contexte humain compte. Relaxe.",            en: "Human context matters. Acquit." },
  "jury.j4.line.undecided.0":{ fr: "Personne n'est tout blanc ou tout noir.",       en: "Nobody is purely good or evil." },
  "jury.j4.line.undecided.1":{ fr: "Je préfère écouter d'abord.",                   en: "I'd rather listen first." },
  "jury.j5.name":  { fr: "M. Petit, plombier",           en: "Mr. Petit, plumber" },
  "jury.j5.style": { fr: "Direct, terre-à-terre",        en: "Direct, down-to-earth" },
  "jury.j5.line.guilty.0":   { fr: "Évident. Coupable.",                            en: "Obvious. Guilty." },
  "jury.j5.line.guilty.1":   { fr: "Si t'as fait, t'assumes.",                      en: "If you did it, you face it." },
  "jury.j5.line.innocent.0": { fr: "Trop de blabla, pas assez de preuves.",         en: "Too much talk, not enough proof." },
  "jury.j5.line.innocent.1": { fr: "On juge pas sur du vent.",                      en: "We don't judge on hot air." },
  "jury.j5.line.undecided.0":{ fr: "J'attends de voir.",                            en: "I'll wait and see." },
  "jury.j5.line.undecided.1":{ fr: "Faut peser le pour et le contre.",              en: "Need to weigh both sides." },
  "jury.j6.name":  { fr: "Dr. Olivier, médecin",         en: "Dr. Olivier, physician" },
  "jury.j6.style": { fr: "Méthodique, humain",           en: "Methodical, humane" },
  "jury.j6.line.guilty.0":   { fr: "Les faits semblent établis. Coupable.",         en: "Facts seem established. Guilty." },
  "jury.j6.line.guilty.1":   { fr: "Coupable, avec recommandation thérapeutique.",  en: "Guilty, with therapy recommendation." },
  "jury.j6.line.innocent.0": { fr: "Conditions du fait inhumaines, je relaxe.",     en: "Inhuman circumstances. Acquit." },
  "jury.j6.line.innocent.1": { fr: "Le bénéfice du doute s'impose.",                en: "Benefit of the doubt." },
  "jury.j6.line.undecided.0":{ fr: "Plusieurs lectures sont possibles.",            en: "Several readings possible." },
  "jury.j6.line.undecided.1":{ fr: "Je veux comprendre le contexte.",               en: "I need to understand the context." },
  "jury.j7.name":  { fr: "Mme Roux, cadre",              en: "Ms. Roux, executive" },
  "jury.j7.style": { fr: "Pragmatique, économique",      en: "Pragmatic, economic" },
  "jury.j7.line.guilty.0":   { fr: "Le préjudice est mesurable. Coupable.",         en: "Damage is measurable. Guilty." },
  "jury.j7.line.guilty.1":   { fr: "Coupable, indemnisation juste à fixer.",        en: "Guilty, fair compensation owed." },
  "jury.j7.line.innocent.0": { fr: "Pas de préjudice établi. Relaxe.",              en: "No real harm. Acquit." },
  "jury.j7.line.innocent.1": { fr: "On ne peut pas inventer un dommage.",           en: "We can't invent damages." },
  "jury.j7.line.undecided.0":{ fr: "Le calcul du préjudice est complexe.",          en: "Damage calc is complex." },
  "jury.j7.line.undecided.1":{ fr: "À retravailler.",                               en: "Needs more work." },
  "jury.j8.name":  { fr: "Mme Lefèvre, professeur",      en: "Ms. Lefèvre, teacher" },
  "jury.j8.style": { fr: "Réfléchie, pédagogue",         en: "Thoughtful, educator" },
  "jury.j8.line.guilty.0":   { fr: "Les faits méritent réponse. Coupable.",         en: "Facts call for response. Guilty." },
  "jury.j8.line.guilty.1":   { fr: "Coupable, sanction éducative.",                 en: "Guilty, educational sanction." },
  "jury.j8.line.innocent.0": { fr: "L'occasion d'apprendre, pas de punir.",         en: "Time to teach, not punish." },
  "jury.j8.line.innocent.1": { fr: "Relaxe avec accompagnement.",                   en: "Acquit with guidance." },
  "jury.j8.line.undecided.0":{ fr: "Je médite.",                                    en: "I'm reflecting." },
  "jury.j8.line.undecided.1":{ fr: "Plusieurs voies possibles.",                    en: "Several paths possible." },
  "jury.j9.name":  { fr: "Théo, artiste",                en: "Théo, artist" },
  "jury.j9.style": { fr: "Empathique, anti-conformiste", en: "Empathetic, non-conformist" },
  "jury.j9.line.guilty.0":   { fr: "Si la société exige une réponse, OK.",          en: "If society needs an answer, fine." },
  "jury.j9.line.guilty.1":   { fr: "Mince, je dois dire coupable.",                 en: "Damn, I have to say guilty." },
  "jury.j9.line.innocent.0": { fr: "On peut comprendre. Non-coupable.",             en: "Understandable. Not guilty." },
  "jury.j9.line.innocent.1": { fr: "Le système est plus coupable que cette personne.", en: "The system is more guilty than this person." },
  "jury.j9.line.undecided.0":{ fr: "C'est compliqué...",                            en: "It's complicated..." },
  "jury.j9.line.undecided.1":{ fr: "Je ne sais pas, vraiment.",                     en: "I really don't know." },
  "jury.j10.name": { fr: "M. Vidal, agriculteur",        en: "Mr. Vidal, farmer" },
  "jury.j10.style":{ fr: "Pratique, conservateur",       en: "Practical, conservative" },
  "jury.j10.line.guilty.0":   { fr: "Coupable, point.",                             en: "Guilty, period." },
  "jury.j10.line.guilty.1":   { fr: "Faut être ferme.",                             en: "Need to be firm." },
  "jury.j10.line.innocent.0": { fr: "Bof, faut pas exagérer. Relaxe.",              en: "Meh, no need to exaggerate. Acquit." },
  "jury.j10.line.innocent.1": { fr: "On a vu pire.",                                en: "We've seen worse." },
  "jury.j10.line.undecided.0":{ fr: "Je sais pas trop.",                            en: "Not sure." },
  "jury.j10.line.undecided.1":{ fr: "Je verrai.",                                   en: "We'll see." },
  "jury.j11.name": { fr: "Sara, ingénieure",             en: "Sara, engineer" },
  "jury.j11.style":{ fr: "Logique, rationnelle",         en: "Logical, rational" },
  "jury.j11.line.guilty.0":   { fr: "Les preuves convergent. Coupable.",            en: "Evidence converges. Guilty." },
  "jury.j11.line.guilty.1":   { fr: "Statistiquement, coupable.",                   en: "Statistically, guilty." },
  "jury.j11.line.innocent.0": { fr: "Probabilité insuffisante. Relaxe.",            en: "Insufficient probability. Acquit." },
  "jury.j11.line.innocent.1": { fr: "Pas la preuve attendue.",                      en: "Not the expected proof." },
  "jury.j11.line.undecided.0":{ fr: "Données contradictoires.",                     en: "Contradicting data." },
  "jury.j11.line.undecided.1":{ fr: "À analyser plus.",                             en: "Needs more analysis." },
  "jury.j12.name": { fr: "Mme Marchal, doyenne",         en: "Mrs. Marchal, eldest" },
  "jury.j12.style":{ fr: "Sévère, expérience longue",    en: "Stern, long experience" },
  "jury.j12.line.guilty.0":   { fr: "Coupable, j'en ai vu d'autres.",               en: "Guilty, I've seen worse." },
  "jury.j12.line.guilty.1":   { fr: "Sans hésiter.",                                en: "Without hesitation." },
  "jury.j12.line.innocent.0": { fr: "Relaxe, mais avec rappel à la loi.",           en: "Acquit, with formal reminder." },
  "jury.j12.line.innocent.1": { fr: "Difficile à prouver.",                         en: "Hard to prove." },
  "jury.j12.line.undecided.0":{ fr: "Je laisse les autres parler.",                 en: "Let others speak first." },
  "jury.j12.line.undecided.1":{ fr: "Je tranche en dernier.",                       en: "I'll decide last." },

  // ===== Devine la peine =====
  "guess.title":   { fr: "Devine la peine", en: "Guess the sentence" },
  "guess.body":    { fr: "Un cas réel. Devinez la sentence prononcée.", en: "A real case. Guess the sentence delivered." },
  "guess.cta":     { fr: "Tenter →", en: "Try →" },
  "guess.intro":   { fr: "Choisissez la sentence qui a réellement été prononcée.", en: "Pick the sentence actually delivered." },
  "guess.correct": { fr: "✓ Bien vu — +15 XP", en: "✓ Well done — +15 XP" },
  "guess.wrong":   { fr: "✗ Voici la bonne réponse", en: "✗ Here's the correct one" },

  // ===== Loot box =====
  "loot.title":    { fr: "Coffre quotidien", en: "Daily chest" },
  "loot.body":     { fr: "Une récompense gratuite par jour", en: "One free reward each day" },
  "loot.cta":      { fr: "Ouvrir →", en: "Open →" },
  "loot.opened":   { fr: "Coffre ouvert !", en: "Chest opened!" },

  // ===== Today in history =====
  "history_today.label": { fr: "Aujourd'hui dans l'histoire du droit", en: "Today in legal history" },

  // ===== Challenge =====
  "challenge.btn":         { fr: "Défier un ami", en: "Challenge a friend" },
  "challenge.share.title": { fr: "Défi The Judge", en: "The Judge challenge" },
  "challenge.share.text":  { fr: "Comment aurais-tu jugé cette affaire ?", en: "How would you have judged this case?" },
  "challenge.copied":      { fr: "📋 Lien copié — partagez-le !", en: "📋 Link copied — share it!" },
  "challenge.received":    { fr: "⚔ Vous avez été défié sur cette affaire", en: "⚔ You've been challenged on this case" },
  "challenge.their_verdict": { fr: "leur verdict :", en: "their verdict:" },

  // ===== Saga =====
  "saga.cta":              { fr: "Continuer →", en: "Continue →" },
  "saga.play":             { fr: "Jouer cet acte", en: "Play this act" },

  // ===== Rebondissement IA =====
  "twist.generic":         { fr: "⚡ REBONDISSEMENT", en: "⚡ PLOT TWIST" },
  "twist.type.evidence":          { fr: "⚡ NOUVELLE PIÈCE",         en: "⚡ NEW EVIDENCE" },
  "twist.type.witness_retraction":{ fr: "⚡ RÉTRACTATION DE TÉMOIN", en: "⚡ WITNESS RETRACTION" },
  "twist.type.surprise_witness":  { fr: "⚡ TÉMOIN-SURPRISE",        en: "⚡ SURPRISE WITNESS" },
  "twist.type.revelation":        { fr: "⚡ RÉVÉLATION",             en: "⚡ REVELATION" },
  "twist.type.contradiction":     { fr: "⚡ CONTRADICTION",          en: "⚡ CONTRADICTION" },
  "twist.continue":               { fr: "Reprendre l'audience →", en: "Resume hearing →" },
  "twist.new_evidence_added":     { fr: "Pièce ajoutée au dossier", en: "Evidence added to file" },

  // ===== Citation codex en audience =====
  "flavor.codex_cited":           { fr: "L'avocat cite", en: "The lawyer cites" },
};

let _lang = null;

export function setLang(lang) {
  if (!LANGS.includes(lang)) lang = "fr";
  _lang = lang;
  Storage.saveSettings({ language: lang });
  if (typeof document !== "undefined") document.documentElement.setAttribute("lang", lang);
}

export function getLang() {
  if (_lang) return _lang;
  const settings = Storage.getSettings();
  let l = settings.language;
  if (!l) {
    // Auto-detect from browser
    if (typeof navigator !== "undefined" && navigator.language) {
      l = navigator.language.startsWith("fr") ? "fr" : "en";
    } else {
      l = "fr";
    }
  }
  if (!LANGS.includes(l)) l = "fr";
  _lang = l;
  return l;
}

export function t(key, vars) {
  const lang = getLang();
  const entry = STRINGS[key];
  let s;
  if (!entry) s = key; // missing key — surface it
  else s = entry[lang] || entry.fr || key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replaceAll(`{${k}}`, String(v));
    }
  }
  return s;
}

// Pluralization helper (very light)
export function tn(key, n, vars = {}) {
  const v = { ...vars, n };
  // accepter la lettre "s" → s'affiche en cas de pluriel
  const s = t(key, v);
  return s.replaceAll("{s}", n > 1 ? "s" : "").replaceAll("{S}", n > 1 ? "s" : "");
}
