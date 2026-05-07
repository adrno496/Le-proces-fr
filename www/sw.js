// Service Worker for The Judge — offline-first cache + update notification.
// Bumping CACHE_NAME on each release invalidates the old cache.

const CACHE_NAME = "thejudge-v5"; // bumped: codex moved to navbar (replaces costs)
const PRECACHE = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "css/styles.css",
  "icons/logo.png",
  "icons/favicon.ico",
  "icons/favicon-32.png",
  "icons/favicon-192.png",
  "icons/favicon-512.png",
  "icons/apple-touch-icon.png",
  "sounds/marteau.mp3",
  "sounds/whispers.mp3",
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(PRECACHE).catch(err => console.warn("[sw] precache partial:", err))
    )
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  // Only cache GET requests of same origin
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // bypass external (AI APIs etc.)

  // Network-first for HTML (so updates ship instantly when online)
  if (request.mode === "navigate" || request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() => caches.match(request).then(r => r || caches.match("./index.html")))
    );
    return;
  }

  // Cache-first for everything else (CSS, JS, images, sounds)
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(request, copy));
        }
        return res;
      }).catch(() => cached);
    })
  );
});

// Allow page to trigger SKIP_WAITING when user clicks "Update"
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});
