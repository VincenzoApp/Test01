const CACHE_NAME = 'juegos-emeli-v4';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/tris.html',
  '/cuadrado.html',
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.3.2/dist/confetti.browser.min.js',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/styles.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache abierto');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Borrando cache antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Ignora las solicitudes de analytics
  if (event.request.url.includes('google-analytics.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Devuelve la respuesta en cache o haz la petición
        return response || fetch(event.request)
          .then((fetchResponse) => {
            // Si es una petición de la misma origin, cachea la respuesta
            if (!event.request.url.startsWith('http') || 
                event.request.url.includes('chrome-extension')) {
              return fetchResponse;
            }
            
            const responseToCache = fetchResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return fetchResponse;
          })
          .catch(() => {
            // Si falla la petición y no hay en cache, muestra página offline
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/index.html');
            }
          });
      })
  );
});

self.addEventListener('message', (event) => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
