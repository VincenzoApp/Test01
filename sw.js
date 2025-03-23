const cacheName = 'tris-game-v1';
const assets = [
    '/',
    '/index.html',
    '/sw.js',
    '/icon.png',  // Add your app icon here
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(assets);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
