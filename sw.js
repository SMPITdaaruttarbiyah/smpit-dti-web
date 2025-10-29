/**
 * SMPIT Daarut Tarbiyah - Service Worker
 * Offline support and performance optimization
 */

const CACHE_NAME = 'smpit-dti-v1';
const STATIC_CACHE = 'smpit-static-v1';
const DYNAMIC_CACHE = 'smpit-dynamic-v1';

const STATIC_ASSETS = [
  '/',
  '/assets/css/main.css',
  '/assets/css/components.css',
  '/assets/css/gallery.css',
  '/assets/css/performance.css',
  '/assets/js/main.js',
  '/assets/js/advanced-animations.js',
  '/assets/js/gallery.js',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
  'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css',
  'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js',
  'https://cdn.jsdelivr.net/npm/gsap@3.12.4/dist/gsap.min.js',
  'https://cdn.jsdelivr.net/npm/gsap@3.12.4/dist/ScrollTrigger.min.js'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache static assets', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip external API calls
  if (url.origin !== location.origin && !STATIC_ASSETS.includes(request.url)) {
    return;
  }
  
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          // For CSS/JS files, also fetch in background for updates
          if (request.url.includes('.css') || request.url.includes('.js')) {
            fetchAndUpdate(request);
          }
          return cachedResponse;
        }
        
        // Otherwise fetch from network
        return fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response since it can only be consumed once
            const responseToCache = response.clone();
            
            // Cache dynamic content
            if (shouldCache(request.url)) {
              caches.open(DYNAMIC_CACHE)
                .then((cache) => {
                  cache.put(request, responseToCache);
                });
            }
            
            return response;
          })
          .catch(() => {
            // If network fails, try to serve from cache
            return caches.match(request)
              .then((cachedResponse) => {
                if (cachedResponse) {
                  return cachedResponse;
                }
                
                // For HTML requests, return offline page
                if (request.headers.get('accept').includes('text/html')) {
                  return caches.match('/') || new Response('Offline', {
                    status: 503,
                    statusText: 'Service Unavailable'
                  });
                }
              });
          });
      })
  );
});

// Helper function to fetch and update cache
function fetchAndUpdate(request) {
  return fetch(request)
    .then((response) => {
      if (response && response.status === 200) {
        return caches.open(STATIC_CACHE)
          .then((cache) => {
            cache.put(request, response.clone());
            return response;
          });
      }
      return response;
    })
    .catch(() => {
      // Silently fail for background updates
    });
}

// Helper function to determine if request should be cached
function shouldCache(url) {
  // Don't cache external images or API calls
  if (url.includes('picsum.photos') || url.includes('api.')) {
    return false;
  }
  
  // Cache images, CSS, JS, and fonts
  return url.match(/\.(png|jpg|jpeg|gif|webp|svg|css|js|woff|woff2|ttf|eot)$/);
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Handle any background sync tasks here
  console.log('Service Worker: Background sync completed');
}

// Push notification handling
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Ada berita baru dari SMPIT Daarut Tarbiyah',
    icon: '/assets/images/icon-192x192.png',
    badge: '/assets/images/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Lihat Berita',
        icon: '/assets/images/checkmark.png'
      },
      {
        action: 'close',
        title: 'Tutup',
        icon: '/assets/images/xmark.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('SMPIT Daarut Tarbiyah', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/#news')
    );
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.matchAll()
        .then((clientList) => {
          for (const client of clientList) {
            if (client.url === '/' && 'focus' in client) {
              return client.focus();
            }
          }
          if (clients.openWindow) {
            return clients.openWindow('/');
          }
        })
    );
  }
});

// Cache cleanup on periodic sync
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(cleanupCache());
  }
});

function cleanupCache() {
  return caches.keys()
    .then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          return caches.open(cacheName)
            .then((cache) => {
              return cache.keys()
                .then((requests) => {
                  // Remove old entries if cache is too large
                  if (requests.length > 100) {
                    const oldRequests = requests.slice(0, 50);
                    return Promise.all(
                      oldRequests.map((request) => cache.delete(request))
                    );
                  }
                });
            });
        })
      );
    });
}

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PERFORMANCE_METRICS') {
    // Handle performance metrics from the client
    console.log('Performance metrics received:', event.data.metrics);
  }
});

console.log('Service Worker: Loaded');