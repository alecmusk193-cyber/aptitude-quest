// Aptitude Quest service worker: caches the game for offline play.
// Only runs when the game is served over https (or localhost). It does nothing on file://.
// Bump CACHE when you ship changes so phones drop the old copy.
const CACHE = "aq-v5";
const FILES = [
  "./",
  "index.html",
  "questions.js",
  "generator.js",
  "mentalmath.js",
  "guide.js",
  "companies.js",
  "manifest.webmanifest",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/maskable-512.png",
  "icons/apple-touch-icon.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith("aq-") && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Stale-while-revalidate for game files: instant and offline-safe, refreshed in the background.
// The Agent Office files (office.html, status.js) are never cached so they always show fresh status.
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  if (/\/(office\.html|status\.js)$/.test(url.pathname)) return;
  e.respondWith(caches.open(CACHE).then(async cache => {
    const hit = await cache.match(e.request, { ignoreSearch: true });
    const net = fetch(e.request).then(res => {
      if (res.ok) cache.put(e.request, res.clone());
      return res;
    }).catch(() => hit || (e.request.mode === "navigate" ? cache.match("index.html") : undefined));
    if (hit) { e.waitUntil(net.catch(() => {})); return hit; }
    return net;
  }));
});
