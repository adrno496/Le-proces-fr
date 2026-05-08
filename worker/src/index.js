// Le Procès — Cloudflare Worker proxy.
// Proxies chat completions to Groq with a per-device daily quota.
// Client uses POST /v1/chat/completions with header X-Device-Id.

const ALLOWED_MODELS = new Set([
  "llama-3.1-8b-instant",
  "llama-3.3-70b-versatile",
]);

const DEFAULT_MODEL = "llama-3.1-8b-instant";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MAX_BODY_BYTES = 64 * 1024;

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Device-Id",
    "Access-Control-Max-Age": "86400",
  };
}

function jsonResponse(status, body, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}

function todayUTC() {
  return new Date().toISOString().slice(0, 10);
}

function tomorrowUTCISO() {
  const t = new Date();
  t.setUTCDate(t.getUTCDate() + 1);
  t.setUTCHours(0, 0, 0, 0);
  return t.toISOString();
}

function isValidDeviceId(id) {
  if (typeof id !== "string") return false;
  if (id.length < 8 || id.length > 64) return false;
  return /^[a-zA-Z0-9-]+$/.test(id);
}

async function checkAndIncrement(env, deviceId, quota) {
  const key = `q:${deviceId}:${todayUTC()}`;
  const current = parseInt(await env.QUOTA.get(key) || "0", 10);
  if (current >= quota) {
    return { allowed: false, used: current, quota };
  }
  // 26h TTL — covers timezones drifting around midnight UTC.
  await env.QUOTA.put(key, String(current + 1), { expirationTtl: 60 * 60 * 26 });
  return { allowed: true, used: current + 1, quota };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "*";

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    const url = new URL(request.url);
    if (url.pathname !== "/v1/chat/completions") {
      return jsonResponse(404, { error: { code: "not_found", message: "Use POST /v1/chat/completions" } }, origin);
    }
    if (request.method !== "POST") {
      return jsonResponse(405, { error: { code: "method_not_allowed", message: "POST only" } }, origin);
    }

    const deviceId = request.headers.get("X-Device-Id");
    if (!isValidDeviceId(deviceId)) {
      return jsonResponse(400, { error: { code: "invalid_device_id", message: "Missing or malformed X-Device-Id header" } }, origin);
    }

    const contentLength = parseInt(request.headers.get("Content-Length") || "0", 10);
    if (contentLength > MAX_BODY_BYTES) {
      return jsonResponse(413, { error: { code: "payload_too_large", message: `Body exceeds ${MAX_BODY_BYTES} bytes` } }, origin);
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return jsonResponse(400, { error: { code: "invalid_json", message: "Body must be JSON" } }, origin);
    }

    const model = payload.model || DEFAULT_MODEL;
    if (!ALLOWED_MODELS.has(model)) {
      return jsonResponse(400, { error: { code: "model_not_allowed", message: `Allowed: ${[...ALLOWED_MODELS].join(", ")}` } }, origin);
    }
    if (!Array.isArray(payload.messages) || payload.messages.length === 0) {
      return jsonResponse(400, { error: { code: "invalid_messages", message: "messages must be a non-empty array" } }, origin);
    }

    const quota = parseInt(env.DAILY_QUOTA || "30", 10);
    const check = await checkAndIncrement(env, deviceId, quota);
    if (!check.allowed) {
      return jsonResponse(429, {
        error: {
          code: "quota_exceeded",
          message: `Quota gratuit atteint (${quota}/jour). Réessaie demain ou ajoute ta clé API dans Réglages.`,
          quota,
          used: check.used,
          reset: tomorrowUTCISO(),
        },
      }, origin);
    }

    const groqBody = {
      model,
      messages: payload.messages,
      max_tokens: Math.min(payload.max_tokens || 1000, 2000),
    };

    let groqRes;
    try {
      groqRes = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${env.GROQ_API_KEY}`,
        },
        body: JSON.stringify(groqBody),
      });
    } catch {
      return jsonResponse(502, { error: { code: "upstream_unreachable", message: "Groq is unreachable" } }, origin);
    }

    const text = await groqRes.text();
    return new Response(text, {
      status: groqRes.status,
      headers: {
        "Content-Type": groqRes.headers.get("Content-Type") || "application/json",
        "X-Quota-Remaining": String(quota - check.used),
        "X-Quota-Limit": String(quota),
        ...corsHeaders(origin),
      },
    });
  },
};
