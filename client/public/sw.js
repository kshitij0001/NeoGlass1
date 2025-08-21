const CACHE_NAME = 'neet-companion-v1';
const STATIC_CACHE_NAME = 'neet-static-v1';
const DYNAMIC_CACHE_NAME = 'neet-dynamic-v1';

// Files to cache immediately - Fixed for production deployment
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/assets/index.css',
  '/assets/index.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache static assets:', error);
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
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated successfully');
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

  // Skip external API calls and chrome-extension
  if (!url.origin.includes(self.location.origin) && !url.hostname.includes('googleapis.com')) {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          console.log('Service Worker: Serving from cache:', request.url);
          return cachedResponse;
        }

        // Otherwise fetch from network
        console.log('Service Worker: Fetching from network:', request.url);
        return fetch(request)
          .then((networkResponse) => {
            // Don't cache if not successful
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Clone the response before caching
            const responseToCache = networkResponse.clone();

            // Determine which cache to use
            const cacheName = STATIC_ASSETS.includes(url.pathname) ? STATIC_CACHE_NAME : DYNAMIC_CACHE_NAME;

            caches.open(cacheName)
              .then((cache) => {
                console.log('Service Worker: Caching new resource:', request.url);
                cache.put(request, responseToCache);
              });

            return networkResponse;
          })
          .catch(() => {
            // Network failed, try to serve app shell for navigation requests
            if (request.destination === 'document') {
              console.log('Service Worker: Network failed, serving app shell');
              return caches.match('/');
            }
            
            // For other requests, return a simple offline response
            return new Response('Offline - Content not available', {
              status: 200,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Background sync for review data
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-reviews') {
    event.waitUntil(syncReviews());
  }
});

// Web notifications removed - using Android APK notifications only

// Utility function to sync reviews (placeholder)
async function syncReviews() {
  try {
    console.log('Service Worker: Syncing reviews data...');
    // This would sync with a backend if available
    // For now, just log the action
    return Promise.resolve();
  } catch (error) {
    console.error('Service Worker: Failed to sync reviews:', error);
    throw error;
  }
}

// Handle unhandled promise rejections
self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker: Unhandled promise rejection:', event.reason);
  event.preventDefault();
});

// Handle errors
self.addEventListener('error', (event) => {
  console.error('Service Worker: Error occurred:', event.error);
});

// Background sync for review data only (web notifications removed)
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-reviews') {
    event.waitUntil(syncReviews());
  }
});

console.log('Service Worker: Script loaded successfully (web notifications removed)');
