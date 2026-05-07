# ⚖ Le Procès

Jeu mobile **standalone** où vous êtes juge dans un tribunal réaliste (10 catégories juridiques : pénal, civil, famille, travail, consommation, voisinage, routier, numérique, environnement, propriété intellectuelle). Chaque jour, l'IA génère un nouveau cas inspiré du droit français. **100 % local** — aucun backend, aucune authentification, aucune télémétrie.

> Stack : Capacitor 8 + JS vanilla pur (pas de framework). Données : `localStorage` + `IndexedDB`. Connexion externe : **uniquement** vers le provider IA que vous avez choisi (votre clé, votre compte).

---

## Lancement rapide (test web)

```bash
npm install   # facultatif, juste pour Capacitor CLI
npm run serve # ou : npx serve www/
```

Ouvrez http://localhost:3000 — l'app fonctionne immédiatement, même sans clé API (cas de secours hors-ligne).

## Tests

```bash
node test.mjs       # 36 tests — couvre format, storage, ai-client, case-engine
```

## Build APK Android

```bash
npm install
npx cap add android
npx cap sync android
cd android && JAVA_HOME=/opt/homebrew/opt/openjdk@21 ./gradlew bundleRelease
```

Le bundle se trouve dans `android/app/build/outputs/bundle/release/`.

---

## Configuration IA — 3 clés gratuites recommandées

À l'ouverture de l'app, allez dans **Paramètres** et choisissez l'un des trois :

| Provider | Modèle | Coût | Comment obtenir la clé |
|---|---|---|---|
| **Groq** | Llama 3.3 70B (Versatile) | Quasi-gratuit (~0.08$/100 msgs, free-tier généreux) | https://console.groq.com/keys |
| **OpenRouter** | Gemini 2.0 Flash (FREE) | **0$** | https://openrouter.ai/keys |
| **OpenRouter** | Llama 3.3 70B Instruct (FREE) | **0$** | https://openrouter.ai/keys |

Aucune carte bancaire requise pour Groq ni pour les modèles `:free` d'OpenRouter.

---

## Architecture des données (où va quoi)

| Endroit | Données |
|---|---|
| `localStorage["leproces_settings"]` | provider, model, apiKey, theme |
| `localStorage["leproces_profile"]` | username, avatar, XP, niveau, streak, stats verdict |
| `localStorage["leproces_achievements"]` | liste des succès débloqués |
| `localStorage["leproces_costs"]` | totaux tokens/coût, historique des 200 derniers appels |
| `IndexedDB "leproces_db"."cases"` | cas du jour cachés (clé = date YYYY-MM-DD) |
| `IndexedDB "leproces_db"."verdicts"` | verdicts rendus (clé = date YYYY-MM-DD) |

> **Sécurité** : la clé API est stockée en clair dans `localStorage`. Acceptable pour une app device-local sans synchro cloud, mais ne réutilisez pas une clé partagée. Vous pouvez l'effacer via *Paramètres → Effacer toutes les données*.

## Structure du projet

```
leproces/
├── package.json · capacitor.config.json · test.mjs · README.md
└── www/
    ├── index.html
    ├── icons/icon-1024.svg
    ├── css/styles.css
    └── js/
        ├── app.js          # bootstrap, routing 5 panels, toast
        ├── format.js       # tokens, coûts, dates FR
        ├── storage.js      # localStorage + IndexedDB
        ├── ai-client.js    # 5 providers, 16 modèles, callAI() unifié
        ├── case-engine.js  # cas du jour, fallbacks, témoins, XP, succès
        ├── ui-settings.js  # flow 5 étapes config IA + perso
        ├── ui-tribunal.js  # plaidoiries, Q&R, verdict, recap
        ├── ui-profile.js   # stats, barre XP, succès
        ├── ui-history.js   # 30 derniers cas
        └── ui-costs.js     # terminal-style consommation
```

## Décisions techniques

- **Pas de bundler** : ES modules natifs via `<script type="module">`. `npx serve www/` suffit pour développer.
- **Tests Node-only** : tous les modules JS sont importables sans DOM. `storage.js` détecte l'environnement et utilise un store en mémoire pour les tests.
- **Cas du jour déterministe** : la catégorie est dérivée d'un hash de la date (même catégorie pour tous les appareils le même jour).
- **Cache cas** : invalidé naturellement à minuit (clé = date locale).
- **Hors-ligne / sans clé** : 10 cas de secours codés en dur (un par catégorie) garantissent un gameplay même sans IA.
- **Compteur de tokens précis** : on utilise les valeurs `usage` de la réponse API, pas une estimation.

## Contribuer un cas de secours

Ajoutez une entrée dans `FALLBACKS` dans [`www/js/case-engine.js`](www/js/case-engine.js) avec : `title`, `context`, `prosecutionSpeech` (~120-150 mots), `defenseSpeech` (~120-150 mots), `difficulty` (1-5).

## Features livrées (toutes en local, sans backend)

### 🎮 Modes de jeu
- **Audience du jour** : 1 cas/jour, déterministe (même catégorie pour tous le même jour)
- **Audiences libres** : génération à la demande (rate-limit 10/j pour éviter la conso IA)
- **Procès historiques** : 10 grandes affaires anonymisées rejouables (Calas, Dreyfus, Outreau, Erika, Perruche…)
- **Défi hebdomadaire** : chaque semaine ISO a une catégorie thématique (× 2 XP sur les verdicts de la catégorie)

### 🎲 Variabilité (variable rewards)
- **Cas spéciaux rares** : Cause célèbre (× 2 XP), Affaire sensible (× 1.8), Audience solennelle (× 1.5), Expert présent (× 1.3)
- **Récompenses cabinet** : 35 % de chance par verdict de récupérer un objet du cabinet (30 collectibles, 4 raretés)
- **Codex juridique** : 20 articles & notions débloqués progressivement par catégorie
- **Promotion automatique** au tier supérieur tous les X verdicts

### 🏛 Profondeur narrative
- **Career mode 6 paliers** : Stagiaire → Greffier → Juge de proximité → Juge correctionnel → Conseiller → Magistrat à la Cassation. Chaque tier débloque un cap de difficulté + perks.
- **Réputation dynamique** : Sévère / Clément / Équilibré / Investigateur / Rigoureux / Indulgent — combinaisons donnent des labels (« Procureur de fer », « Avocat de cœur »…)
- **Trame narrative annuelle** : 12 chapitres mensuels (« Premiers pas au tribunal » → « Bilan et résolution »)
- **Récidivistes** : 25 % de chance qu'une partie déjà condamnée/relaxée revienne, avec mémoire de tes verdicts
- **Jurisprudence personnelle** : tes verdicts argumentés (≥80 chars) ou lors de streaks ≥ 7 deviennent des précédents cités dans tes futurs cas

### 🔍 Mécaniques de gameplay
- **Pièces à conviction** : 2-4 pièces par cas, à examiner avant verdict (+ achievement)
- **Témoins multiples** : 2-4 témoins par cas, chacun avec un style (technique, émotif, factuel…)
- **Quiz post-verdict** : 1 question juridique de la catégorie (+5 XP si juste, +ref article)
- **Mode expert** : plaidoiries plus longues, vocabulaire technique
- **Devise du juge** affichée avant chaque audience

### 🎨 Personnalisation
- **8 thèmes visuels** : Nuit profonde, Salle d'audience, Versailles, Forum romain, Cyberpunk, Boréale, Scriptorium, Old Bailey
- **16 avatars** (vs 8 avant)
- **Cabinet collectible** : 30 objets visibles dans le profil (robes, marteaux, livres, médailles…)
- **Devise personnalisable** (1 phrase qui apparaît avant chaque verdict)

### 🔔 Engagement
- **Notifications quotidiennes** : Capacitor Local Notifications (mobile) ou Web Notifications API (web). Heure paramétrable.
- **TTS plaidoiries** : Web Speech API native, 2 voix distinctes (accusation/défense)
- **Partage du verdict** : génération PNG via Canvas, partage natif via Web Share API ou téléchargement
- **42 succès** : 12 visibles + 30 cachés (curiosité, exploration)
- **Animation marteau** au prononcé du verdict, **animation tampon** sur la décision

### 📊 Profil enrichi
8 onglets : Stats / Carrière / Réputation / Cabinet / Codex / Jurisprudence / Parties / Succès

## Roadmap — Phase 2 (nécessite backend)

Seuls ces éléments demandent un serveur (Supabase ou équivalent) :

- 🌍 **Leaderboard mondial** par catégorie
- 📊 **Stats communauté** (« 32 % du monde a voté coupable »)
- 👥 **Tribunal de copains** / procès partagé asynchrone
- 🏆 **Saisons compétitives** avec récompenses cosmétiques
- 💎 **Monétisation** (RevenueCat) — non prévue actuellement

---

⚖ *Construit en local, sans télémétrie, sans abonnement obligatoire.*
