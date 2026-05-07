# Le Procès — Configuration Claude Code

App **Capacitor 8 + Vanilla JS** (pas de framework, pas de moteur de jeu).
Tribunal solo, multi-provider IA, 100 % local. Voir [README.md](README.md) pour le concept et le build.

## Stack

- **Plateforme** : Capacitor 8 (Android/iOS/web), pas de bundler — ES modules natifs
- **Langage** : JavaScript ES modules (pas de TypeScript, pas de React/Vue/Angular)
- **Storage** : `localStorage` + `IndexedDB`
- **Tests** : `node:test` (built-in), `node test.mjs`
- **IA** : multi-provider (Groq, OpenAI, Anthropic, Mistral, OpenRouter) via `www/js/ai-client.js`

## Structure du projet

```
www/
├── index.html · css/styles.css · icons/
└── js/
    ├── app.js · format.js · storage.js
    ├── ai-client.js · case-engine.js
    └── ui-{settings,tribunal,profile,history,costs}.js
test.mjs                  # 36 tests (node:test)
package.json · capacitor.config.json
```

## Coordination Rules

@.claude/docs/coordination-rules.md

## Collaboration Protocol

**User-driven collaboration, not autonomous execution.**
Chaque tâche suit : **Question → Options → Décision → Brouillon → Approbation**

- Demander avant `Write`/`Edit` : « Puis-je écrire dans [filepath] ? »
- Présenter un brouillon avant de finaliser
- Pas de commit sans instruction explicite

## Standards de code (adaptés web/mobile)

- ES modules pur, pas de framework
- Tous les fichiers JS doivent passer `node --check`
- Code Node-importable : `storage.js` détecte l'environnement DOM-vs-Node
- Pas de hardcoding : règles XP, prix providers, fallbacks → tous explicites dans des constantes nommées
- Tests avant merge : `node test.mjs` doit passer 100 %
- Mobile-first : aucun overflow horizontal sur 360px de large
- Pas de clé API ou secret commit en clair (mais celles de l'utilisateur en localStorage = OK, c'est device-local)

## Context Management

@.claude/docs/context-management.md

## Notes spécifiques à ce projet

- **Pas de moteur de jeu** : ignorer tout ce qui concerne Godot/Unity/Unreal, shaders, VFX, balance économique d'un MMO, art-bible.
- **Pas de backend** : ignorer network-programmer, security-engineer pour le multijoueur. La sécurité ici = bonnes pratiques web (XSS, validation entrées).
- **Cas du jour** : générés par l'IA depuis `case-engine.js`, avec 10 fallbacks codés en dur. Si on ajoute une catégorie, il faut un fallback.
- **Phase 2 future** : Supabase (leaderboard), Firebase/Capacitor Local Notifications (push), RevenueCat (monétisation). Hors scope actuel.
