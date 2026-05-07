# CCGS pour Le Procès — guide d'utilisation

Le framework [Claude Code Game Studios](https://github.com/Donchitos/Claude-Code-Game-Studios) est installé en **version curée** : seuls les modules pertinents pour une app web/mobile vanilla-JS sont gardés. Les modules moteur (Godot/Unity/Unreal), art-bible, balance, animations, etc. ont été exclus.

## Ce qui a été installé

| Composant | Quantité | Emplacement |
|---|---|---|
| Agents | **17** | [.claude/agents/](.claude/agents/) |
| Skills (slash commands) | **49** | [.claude/skills/](.claude/skills/) |
| Hooks (validation auto) | **11** | [.claude/hooks/](.claude/hooks/) |
| Rules (standards par dossier) | **4** | [.claude/rules/](.claude/rules/) |
| Settings + statusline | — | [.claude/settings.json](.claude/settings.json), [.claude/statusline.sh](.claude/statusline.sh) |
| Templates docs | 39 | [.claude/docs/templates/](.claude/docs/templates/) |

### Agents conservés (17)

**Direction (Tier 1)** : `creative-director`, `technical-director`, `producer`
**Leads (Tier 2)** : `lead-programmer`, `game-designer`, `narrative-director`, `qa-lead`, `release-manager`
**Spécialistes (Tier 3)** : `gameplay-programmer`, `ui-programmer`, `ux-designer`, `systems-designer`, `writer`, `qa-tester`, `devops-engineer`, `security-engineer`, `performance-analyst`

### Agents NON installés (et pourquoi)
- `godot-*`, `unity-*`, `ue-*` — pas de moteur de jeu, on est en Capacitor + vanilla JS
- `art-director`, `technical-artist`, `sound-designer`, `audio-director` — pas d'assets art/audio
- `level-designer`, `world-builder` — pas de monde/niveaux à designer
- `ai-programmer`, `network-programmer`, `tools-programmer`, `engine-programmer` — pas d'IA gameplay, pas de réseau, pas de pipeline
- `economy-designer`, `live-ops-designer`, `analytics-engineer`, `community-manager` — Phase 2 (post-launch ops)
- `accessibility-specialist`, `localization-lead` — peuvent être réinstallés depuis [Claude-Code-Game-Studios-main/.claude/agents/](Claude-Code-Game-Studios-main/.claude/agents/) si tu veux pousser ces axes

### Skills NON installés
- `art-bible`, `asset-spec`, `asset-audit` — pas d'assets art
- `balance-check` — pas d'équilibrage de jeu numérique
- `map-systems` — surdimensionné pour 12 fichiers JS
- `setup-engine` — Capacitor n'est pas un moteur de jeu CCGS
- `playtest-report`, `soak-test` — peuvent être ajoutés plus tard
- `team-*` (combat, audio, level, polish, etc.) — orchestrent des équipes qu'on n'a pas

---

## Comment l'utiliser

### 1. Lancer Claude Code dans le projet

```bash
cd /Users/dreano/Downloads/proces
claude
```

Le hook `session-start.sh` s'exécute automatiquement et affiche la branche git + les commits récents.

### 2. Découvrir les commandes

Tape `/` dans Claude Code → liste de toutes les skills installées.
Pour de l'aide ciblée : `/help`.

### 3. Cas d'usage typiques pour Le Procès

| Tu veux… | Skill recommandée |
|---|---|
| Faire le point sur l'état du projet | `/project-stage-detect` |
| Brainstormer une nouvelle fonctionnalité (Phase 2 : leaderboard, etc.) | `/brainstorm` |
| Spécifier une fonctionnalité précise (ex : système d'arguments motivés) | `/quick-design` ou `/design-system` |
| Documenter une décision technique (choix Supabase vs PocketBase) | `/architecture-decision` |
| Découper une fonctionnalité en stories implémentables | `/create-stories` |
| Faire reviewer un fichier que tu viens d'écrire | `/code-review www/js/case-engine.js` |
| Vérifier qu'une story est prête à coder | `/story-readiness` |
| Implémenter une story (avec test) | `/dev-story` |
| Marquer une story terminée | `/story-done` |
| Reporter un bug | `/bug-report` |
| Trier le backlog de bugs | `/bug-triage` |
| Plan QA pour un sprint | `/qa-plan` |
| Audit sécurité avant release | `/security-audit` |
| Audit perf | `/perf-profile` |
| Vérifier le scope (creep ?) | `/scope-check` |
| Préparer une release | `/release-checklist` |
| Générer un changelog | `/changelog` |
| Poster les patch notes | `/patch-notes` |
| Hotfix urgent | `/hotfix` |
| Auditer la dette technique | `/tech-debt` |
| Rétro de fin de sprint | `/retrospective` |

### 4. Hooks automatiques (rien à faire — ils tournent seuls)

- **`session-start.sh`** : branche + 5 derniers commits au démarrage
- **`detect-gaps.sh`** : suggère `/start` si projet vide / docs design manquants
- **`validate-commit.sh`** : avant `git commit`, refuse les magic numbers, JSON invalide, TODO mal formattés
- **`validate-push.sh`** : avertit avant push sur main/master
- **`pre/post-compact.sh`** : sauvegarde l'état avant compaction de contexte
- **`session-stop.sh`** : archive `production/session-state/active.md` à la fermeture

> Tous les hooks **exit 0 silencieusement** quand non pertinents (ex : `validate-assets.sh` ne s'active que sur `assets/**`, qui n'existe pas ici). C'est normal, pas un bug.

### 5. Workflow recommandé pour la suite du projet

**Si tu pars sur Phase 2 (leaderboard, push, monétisation)** :

```
1. /brainstorm                    → définir précisément quel ajout en premier
2. /architecture-decision         → ADR pour Supabase vs alternative
3. /design-system                 → GDD du système leaderboard
4. /create-epics                  → un epic = un module
5. /create-stories                → découper en stories
6. /story-readiness               → vérifier que c'est prêt à coder
7. /dev-story                     → implémenter (boucle TDD)
8. /code-review                   → reviewer
9. /story-done                    → fermer la story
10. /smoke-check                  → vérif avant QA
11. /qa-plan + /regression-suite  → QA passe
12. /release-checklist            → release
13. /changelog + /patch-notes     → communication
```

**Si tu veux juste maintenir Le Procès** : `/code-review`, `/security-audit`, `/perf-profile`, `/tech-debt`, `/bug-report` couvrent 90 % des besoins.

---

## Quoi en faire après ?

### Option A — Tu push juste l'app actuelle
Tu peux ignorer CCGS. Tout est déjà fonctionnel. CCGS te servira la prochaine fois que tu reviens développer.

### Option B — Tu ajoutes des features (Phase 2)
Démarre par `/brainstorm` pour cadrer la fonctionnalité, puis suis le workflow ci-dessus. Les agents te poseront des questions et te proposeront des options — tu décides.

### Option C — Tu donnes le projet à quelqu'un d'autre
Lance `/onboard` : ça génère un document d'onboarding contextualisé pour le nouveau venu (architecture, conventions, état actuel).

### Option D — Tu jettes CCGS
Si trop d'agents ce n'est pas ton truc, supprime simplement le dossier `.claude/` (et le dossier `Claude-Code-Game-Studios-main/` qui était la source). L'app continue de fonctionner — CCGS est purement un outil de développement, **pas** une dépendance runtime.

```bash
rm -rf .claude Claude-Code-Game-Studios-main CCGS-USAGE.md CLAUDE.md
```

---

## Limitations connues pour Le Procès

1. **Engine reference** : `.claude/docs/` contient des références Godot/Unity/Unreal — ignorables. Ne supprime pas, certains skills les cherchent en lecture (échec silencieux).
2. **Rules** : seules `ui-code.md`, `test-standards.md`, `design-docs.md`, `data-files.md` ont été gardées. Elles s'appliquent par chemin (path-scoped) — pour Le Procès tu peux personnaliser ces patterns (ex : remplacer `src/ui/**` par `www/js/ui-*.js`) en éditant le frontmatter de chaque rule.
3. **Settings** : `.claude/settings.json` contient des permissions auto-allow / auto-deny héritées de CCGS. Vérifie-les avant la première session : `cat .claude/settings.json`.
4. **statusline** : affiche stage du projet + epic courant ; pour un projet sans `production/session-state/active.md`, l'affichage sera minimal — c'est OK.

---

## Ressources

- Doc Claude Code officielle : https://docs.anthropic.com/en/docs/claude-code
- Repo CCGS source : https://github.com/Donchitos/Claude-Code-Game-Studios
- README CCGS complet : [Claude-Code-Game-Studios-main/README.md](Claude-Code-Game-Studios-main/README.md)

⚖ *Bonne continuation sur Le Procès.*
