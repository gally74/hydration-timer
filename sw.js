const CACHE_NAME = 'hydration-timer-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
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
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for notifications (if supported)
self.addEventListener('sync', event => {
  if (event.tag === 'drink-reminder') {
    event.waitUntil(
      // Handle background sync for drink reminders
      console.log('Background sync for drink reminder')
    );
  }
});

// Push notification handling
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'Time to stay hydrated!',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [200, 100, 200],
      tag: 'drink-reminder',
      requireInteraction: true,
      actions: [
        {
          action: 'drink',
          title: 'I Drank! 💧',
          icon: '/icon-192.png'
        },
        {
          action: 'snooze',
          title: 'Remind me later',
          icon: '/icon-192.png'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title || '💧 Hydration Reminder', options)
    );
  }
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'drink') {
    // User clicked "I Drank!" - could send data back to app
    console.log('User recorded a drink');
  } else if (event.action === 'snooze') {
    // User clicked "Remind me later" - could reschedule reminder
    console.log('User snoozed reminder');
  } else {
    // User clicked notification - open app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
