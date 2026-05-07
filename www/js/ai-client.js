// Multi-provider AI client.

import { Storage } from "./storage.js";
import { getTodayDateStr } from "./format.js";

export const PROVIDERS = {
  groq: {
    name: "Groq",
    logo: "⚡",
    baseUrl: "https://api.groq.com/openai/v1",
    apiUrl: "https://console.groq.com/keys",
    apiHint: "groq.com/console · Gratuit · Sans CB",
    format: "openai",
    models: [
      { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B (Instant)", contextWindow: 128000, priceIn: 0.05, priceOut: 0.08, speed: "ultra-rapide", quality: "bon", free: true },
      { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B (Versatile)", contextWindow: 128000, priceIn: 0.59, priceOut: 0.79, speed: "rapide", quality: "excellent", free: true },
      { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B", contextWindow: 32768, priceIn: 0.24, priceOut: 0.24, speed: "rapide", quality: "très bon", free: true },
    ],
  },
  openai: {
    name: "OpenAI",
    logo: "🤖",
    baseUrl: "https://api.openai.com/v1",
    apiUrl: "https://platform.openai.com/api-keys",
    apiHint: "platform.openai.com · CB requise",
    format: "openai",
    models: [
      { id: "gpt-4o-mini", name: "GPT-4o Mini", contextWindow: 128000, priceIn: 0.15, priceOut: 0.60, speed: "rapide", quality: "très bon", free: false },
      { id: "gpt-4o", name: "GPT-4o", contextWindow: 128000, priceIn: 2.50, priceOut: 10.00, speed: "moyen", quality: "exceptionnel", free: false },
      { id: "gpt-4.1-mini", name: "GPT-4.1 Mini", contextWindow: 128000, priceIn: 0.40, priceOut: 1.60, speed: "rapide", quality: "excellent", free: false },
    ],
  },
  anthropic: {
    name: "Anthropic (Claude)",
    logo: "🧠",
    baseUrl: "https://api.anthropic.com/v1",
    apiUrl: "https://console.anthropic.com/settings/keys",
    apiHint: "console.anthropic.com · CB requise",
    format: "anthropic",
    models: [
      { id: "claude-haiku-4-5-20251001", name: "Claude Haiku 4.5", contextWindow: 200000, priceIn: 0.80, priceOut: 4.00, speed: "ultra-rapide", quality: "excellent", free: false },
      { id: "claude-sonnet-4-6", name: "Claude Sonnet 4.6", contextWindow: 200000, priceIn: 3.00, priceOut: 15.00, speed: "rapide", quality: "exceptionnel", free: false },
    ],
  },
  mistral: {
    name: "Mistral AI",
    logo: "🌪",
    baseUrl: "https://api.mistral.ai/v1",
    apiUrl: "https://console.mistral.ai/api-keys/",
    apiHint: "console.mistral.ai · CB requise",
    format: "openai",
    models: [
      { id: "mistral-small-latest", name: "Mistral Small", contextWindow: 32000, priceIn: 0.10, priceOut: 0.30, speed: "ultra-rapide", quality: "bon", free: false },
      { id: "mistral-medium-latest", name: "Mistral Medium", contextWindow: 32000, priceIn: 0.40, priceOut: 1.20, speed: "rapide", quality: "très bon", free: false },
      { id: "mistral-large-latest", name: "Mistral Large", contextWindow: 32000, priceIn: 2.00, priceOut: 6.00, speed: "moyen", quality: "exceptionnel", free: false },
    ],
  },
  openrouter: {
    name: "OpenRouter",
    logo: "🔀",
    baseUrl: "https://openrouter.ai/api/v1",
    apiUrl: "https://openrouter.ai/keys",
    apiHint: "openrouter.ai · Modèles gratuits inclus",
    format: "openai",
    models: [
      { id: "google/gemini-2.0-flash-exp:free", name: "Gemini 2.0 Flash (FREE)", contextWindow: 1000000, priceIn: 0, priceOut: 0, speed: "ultra-rapide", quality: "très bon", free: true },
      { id: "meta-llama/llama-3.3-70b-instruct:free", name: "Llama 3.3 70B (FREE)", contextWindow: 131072, priceIn: 0, priceOut: 0, speed: "rapide", quality: "excellent", free: true },
      { id: "anthropic/claude-haiku-4-5", name: "Claude Haiku 4.5", contextWindow: 200000, priceIn: 0.80, priceOut: 4.00, speed: "ultra-rapide", quality: "excellent", free: false },
      { id: "openai/gpt-4o-mini", name: "GPT-4o Mini", contextWindow: 128000, priceIn: 0.15, priceOut: 0.60, speed: "rapide", quality: "très bon", free: false },
      { id: "mistral/mistral-small", name: "Mistral Small", contextWindow: 32000, priceIn: 0.10, priceOut: 0.30, speed: "ultra-rapide", quality: "bon", free: false },
    ],
  },
};

export function getModel(providerId, modelId) {
  const p = PROVIDERS[providerId];
  if (!p) return null;
  return p.models.find(m => m.id === modelId) || null;
}

export function buildHeaders(providerId, apiKey) {
  switch (providerId) {
    case "anthropic":
      return {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      };
    case "openrouter":
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://leproces.app",
        "X-Title": "Le Procès",
      };
    default:
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      };
  }
}

export function buildRequestBody(providerId, modelId, messages, systemPrompt, maxTokens) {
  const provider = PROVIDERS[providerId];
  if (provider?.format === "anthropic") {
    return {
      url: `${provider.baseUrl}/messages`,
      body: {
        model: modelId,
        max_tokens: maxTokens,
        system: systemPrompt || undefined,
        messages: messages,
      },
    };
  }
  // OpenAI-compatible
  const msgs = systemPrompt
    ? [{ role: "system", content: systemPrompt }, ...messages]
    : messages;
  return {
    url: `${provider.baseUrl}/chat/completions`,
    body: {
      model: modelId,
      max_tokens: maxTokens,
      messages: msgs,
    },
  };
}

export function parseResponse(providerId, json) {
  const provider = PROVIDERS[providerId];
  if (provider?.format === "anthropic") {
    const content = json?.content?.[0]?.text || "";
    return {
      content,
      tokensIn: json?.usage?.input_tokens || 0,
      tokensOut: json?.usage?.output_tokens || 0,
    };
  }
  const content = json?.choices?.[0]?.message?.content || "";
  return {
    content,
    tokensIn: json?.usage?.prompt_tokens || 0,
    tokensOut: json?.usage?.completion_tokens || 0,
  };
}

export function computeCost(model, tokensIn, tokensOut) {
  if (!model) return 0;
  return (tokensIn / 1_000_000) * model.priceIn + (tokensOut / 1_000_000) * model.priceOut;
}

export function errorMessage(status) {
  if (status === 401 || status === 403) return "Clé API invalide. Vérifiez vos paramètres.";
  if (status === 429) return "Limite d'utilisation atteinte. Attendez ou changez de provider.";
  if (status >= 500) return "Erreur serveur IA. Réessayez dans quelques instants.";
  if (status === 0) return "L'IA met trop de temps à répondre. Vérifiez votre connexion.";
  return `Erreur réseau (${status}).`;
}

export async function callAI(messages, { systemPrompt, maxTokens = 1000, signal } = {}) {
  const settings = Storage.getSettings();
  if (!settings.apiKey) throw new Error("Aucune clé API configurée. Ouvrez les paramètres.");
  if (!settings.provider || !settings.model) throw new Error("Aucun modèle sélectionné.");

  const provider = PROVIDERS[settings.provider];
  const model = getModel(settings.provider, settings.model);
  if (!provider || !model) throw new Error("Provider/modèle inconnu.");

  const { url, body } = buildRequestBody(settings.provider, settings.model, messages, systemPrompt, maxTokens);
  const headers = buildHeaders(settings.provider, settings.apiKey);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);
  const linkedSignal = signal || controller.signal;

  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: linkedSignal,
    });
  } catch (e) {
    clearTimeout(timer);
    if (e.name === "AbortError") throw new Error(errorMessage(0));
    throw new Error("Connexion impossible à l'IA. Vérifiez votre réseau.");
  }
  clearTimeout(timer);

  if (!res.ok) {
    let detail = "";
    try { detail = (await res.text()).slice(0, 200); } catch {}
    const e = new Error(errorMessage(res.status));
    e.status = res.status;
    e.detail = detail;
    throw e;
  }

  const json = await res.json();
  const { content, tokensIn, tokensOut } = parseResponse(settings.provider, json);
  const cost = computeCost(model, tokensIn, tokensOut);

  Storage.addCostEntry({
    date: getTodayDateStr(),
    provider: settings.provider,
    model: model.name,
    modelId: model.id,
    tokensIn,
    tokensOut,
    cost,
  });

  return { content, tokensIn, tokensOut, cost };
}

export function estimateCostFor100Messages(providerId, modelId) {
  const model = getModel(providerId, modelId);
  if (!model) return null;
  const avgIn = 800, avgOut = 400;
  const totalIn = avgIn * 100;
  const totalOut = avgOut * 100;
  const totalCost = (totalIn / 1_000_000) * model.priceIn + (totalOut / 1_000_000) * model.priceOut;
  const isFree = totalCost === 0;
  let label;
  if (isFree) label = "🎉 GRATUIT";
  else if (totalCost < 0.01) label = "🟢 Quasi gratuit";
  else if (totalCost < 0.10) label = "🟡 Très bon marché";
  else if (totalCost < 0.50) label = "🟠 Modéré";
  else label = "🔴 Coûteux";

  return {
    provider: PROVIDERS[providerId]?.name,
    model: model.name,
    totalMessages: 100,
    tokensIn: totalIn,
    tokensOut: totalOut,
    costUSD: totalCost,
    costEUR: totalCost * 0.92,
    costFormatted: totalCost === 0 ? "0$" : (totalCost < 0.01 ? "< 0.01$" : `${totalCost.toFixed(4)}$`),
    isFree,
    label,
  };
}

// Validates an API key by making a 1-token call. Returns {ok, error?}.
export async function testApiKey() {
  try {
    await callAI([{ role: "user", content: "ok" }], { maxTokens: 1 });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}
