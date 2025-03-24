const CACHE_NAME = 'games-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/tris.html',
  '/cuadrado.html',
  '/manifest.json',
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.3.2/dist/confetti.browser.min.js',
  // Add any other assets like CSS, JS, or images
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
