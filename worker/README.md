# Le Procès — Proxy IA gratuit (Cloudflare Worker)

Worker proxy entre l'app et Groq, avec rate limit par appareil.

- **0 € hébergement** (free tier Cloudflare Workers : 100 000 req/jour)
- **0 € KV** (free tier : 100 000 reads, 1 000 writes/jour)
- **Coût IA** : Groq facture ta clé. À 30 messages/jour/user → ~0,07 €/1000 messages sur Llama 3.1 8B.

## Prérequis

- Compte Cloudflare (gratuit) — https://dash.cloudflare.com
- Compte Groq (gratuit, sans CB) — https://console.groq.com/keys
- Node 18+

## Déploiement (5 étapes)

```bash
cd worker
npm install

# 1. Login Cloudflare
npx wrangler login

# 2. Créer le namespace KV pour le quota
npx wrangler kv namespace create QUOTA
# ↑ copier l'id retourné dans wrangler.toml (ligne `id = "REPLACE_WITH_KV_ID"`)

# 3. Définir la clé Groq comme secret
npx wrangler secret put GROQ_API_KEY
# ↑ coller la clé Groq (commence par `gsk_...`)

# 4. Déployer
npx wrangler deploy
# ↑ noter l'URL : https://leproces-proxy.<TON_COMPTE>.workers.dev

# 5. Coller cette URL dans www/js/ai-client.js
#    Constante FREEMIUM_PROXY_URL (en haut du fichier)
```

## Tester

```bash
# Health check (devrait renvoyer 404 "use POST /v1/chat/completions")
curl https://leproces-proxy.<TON_COMPTE>.workers.dev/

# Vraie requête
curl -X POST https://leproces-proxy.<TON_COMPTE>.workers.dev/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "X-Device-Id: test-device-12345" \
  -d '{"model":"llama-3.1-8b-instant","messages":[{"role":"user","content":"Bonjour"}]}'
```

## Configuration

Variable | Défaut | Effet
---|---|---
`DAILY_QUOTA` | `30` | Messages/jour/appareil (env var dans wrangler.toml)
`GROQ_API_KEY` | — | Secret obligatoire (`wrangler secret put`)

Modèles autorisés (whitelist en dur dans `src/index.js`) :
- `llama-3.1-8b-instant` — défaut, ultra-rapide
- `llama-3.3-70b-versatile` — meilleure qualité

## Logs en temps réel

```bash
npx wrangler tail
```

## Coûts si tu dépasses le free tier

- Workers : 0,30 $/million de requêtes au-delà de 100k/jour
- KV : 0,50 $/million reads au-delà de 100k/jour
- Groq : voir https://groq.com/pricing (Llama 3.1 8B : 0,05 $/M tokens in, 0,08 $/M out)

Pour 1000 utilisateurs actifs à 10 msg/jour → ~10k req/jour, largement dans le free tier Cloudflare. Coût Groq ≈ 22 $/mois.
