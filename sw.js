const CACHE_NAME = 'pantry-tag-v1';
const ASSETS = ['./index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Network-first for everything except our own shell assets,
  // so barcode lookups and sheet writes always go live.
  const url = new URL(event.request.url);
  const isShell = ASSETS.some((a) => url.pathname.endsWith(a.replace('./', '')));
  if (!isShell) return;

  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
