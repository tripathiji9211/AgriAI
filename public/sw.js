const CACHE_NAME = "agriai-cache-v1";
const STATIC_ASSETS = [
  "/",
  "/scanner",
  "/manifest.json",
  "/3d-farmer.png",
  "/video-poster.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Don't block installation if a file fails to cache
      return Promise.allSettled(
        STATIC_ASSETS.map(url => cache.add(url).catch(e => console.warn('Cache add failed:', url)))
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Network First, fallback to cache strategy for pages
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  // Ignore API and Chrome extension requests
  if (event.request.url.includes('/api/') || event.request.url.startsWith('chrome-extension')) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          // Fallback if totally offline and not in cache
          return new Response("Offline Mode Active. No data available.", {
            headers: { "Content-Type": "text/html" }
          });
        });
      })
  );
});
