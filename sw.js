// Simple Service Worker for SMPIT Daarut Tarbiyah Website
const CACHE_NAME = 'smpit-dti-v1';
const urlsToCache = [
  '/',
  '/assets/css/main.css',
  '/assets/css/components.css',
  '/assets/css/gallery.css',
  '/assets/css/performance.css',
  '/assets/js/main.js',
  '/assets/js/advanced-animations.js',
  '/assets/js/gallery.js',
  '/assets/images/favicon.ico',
  '/assets/images/logo.png'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});