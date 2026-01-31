// Service Worker for MRF Educational Platform
const _CACHE_NAME = "mrf-edu-v1";
const STATIC_CACHE = "mrf-static-v1";
const DYNAMIC_CACHE = "mrf-dynamic-v1";

// Assets to cache immediately
const STATIC_ASSETS = [
  "/",
  "/ar",
  "/ar/lessons",
  "/ar/quizzes",
  "/ar/dashboard",
  "/manifest.json",
  // Add critical CSS and JS files
  "/_next/static/css/app/layout.css",
  "/_next/static/chunks/webpack.js",
  "/_next/static/chunks/main.js",
  // Fonts
  "/fonts/NotoSansArabic-Regular.woff2",
  "/fonts/Cairo-Regular.woff2",
  // Icons
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /^\/api\/lessons/,
  /^\/api\/quizzes/,
  /^\/api\/progress/,
  /^\/api\/user/,
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("Service Worker: Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log("Service Worker: Static assets cached");
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("Service Worker: Failed to cache static assets", error);
      }),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log("Service Worker: Deleting old cache", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => {
        console.log("Service Worker: Activated");
        return self.clients.claim();
      }),
  );
});

// Fetch event - serve cached content when offline
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const _url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!request.url.startsWith("http")) {
    return;
  }

  // Handle different types of requests
  if (request.destination === "document") {
    // HTML pages - Network first, then cache
    event.respondWith(handlePageRequest(request));
  } else if (isAPIRequest(request)) {
    // API requests - Cache first for GET, network only for others
    event.respondWith(handleAPIRequest(request));
  } else if (request.destination === "image") {
    // Images - Cache first
    event.respondWith(handleImageRequest(request));
  } else {
    // Other assets - Cache first
    event.respondWith(handleAssetRequest(request));
  }
});

// Handle page requests (HTML)
async function handlePageRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (_error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page if available
    const offlinePage = await caches.match("/ar/offline");
    if (offlinePage) {
      return offlinePage;
    }

    // Fallback response
    return new Response(
      `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>غير متصل - منصة الأستاذ رضا الفاروق</title>
        <style>
          body { 
            font-family: 'Noto Sans Arabic', Arial, sans-serif; 
            text-align: center; 
            padding: 50px; 
            background: #f5f5f5;
            color: #333;
          }
          .offline-container {
            max-width: 400px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .offline-icon {
            font-size: 64px;
            margin-bottom: 20px;
          }
          h1 { color: #1e40af; margin-bottom: 20px; }
          p { margin-bottom: 20px; line-height: 1.6; }
          button {
            background: #1e40af;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
          }
          button:hover { background: #1d4ed8; }
        </style>
      </head>
      <body>
        <div class="offline-container">
          <div class="offline-icon">📚</div>
          <h1>غير متصل بالإنترنت</h1>
          <p>يبدو أنك غير متصل بالإنترنت حالياً. تحقق من اتصالك وحاول مرة أخرى.</p>
          <button onclick="window.location.reload()">إعادة المحاولة</button>
        </div>
      </body>
      </html>
      `,
      {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      },
    );
  }
}

// Handle API requests
async function handleAPIRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);

    // Cache successful GET responses
    if (networkResponse.ok && request.method === "GET") {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (_error) {
    // Network failed, try cache for GET requests
    if (request.method === "GET") {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
    }

    // Return error response
    return new Response(
      JSON.stringify({
        error: "Network unavailable",
        message: "لا يمكن الوصول للخدمة حالياً",
        offline: true,
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

// Handle image requests
async function handleImageRequest(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Try network
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    // Return placeholder image
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f3f4f6"/><text x="100" y="100" text-anchor="middle" dy=".3em" fill="#9ca3af">صورة غير متاحة</text></svg>',
      {
        status: 200,
        headers: { "Content-Type": "image/svg+xml" },
      },
    );
  }
}

// Handle other asset requests
async function handleAssetRequest(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Try network
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    // Return empty response for failed assets
    return new Response("", { status: 404 });
  }
}

// Check if request is for API
function isAPIRequest(request) {
  return API_CACHE_PATTERNS.some((pattern) => pattern.test(request.url));
}

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  console.log("Service Worker: Background sync triggered", event.tag);

  if (event.tag === "background-sync-progress") {
    event.waitUntil(syncProgress());
  } else if (event.tag === "background-sync-quiz-results") {
    event.waitUntil(syncQuizResults());
  }
});

// Sync progress data when back online
async function syncProgress() {
  try {
    // Get stored progress data from IndexedDB
    const progressData = await getStoredProgressData();

    if (progressData && progressData.length > 0) {
      // Send to server
      const response = await fetch("/api/sync/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress: progressData }),
      });

      if (response.ok) {
        // Clear stored data after successful sync
        await clearStoredProgressData();
        console.log("Service Worker: Progress synced successfully");
      }
    }
  } catch (error) {
    console.error("Service Worker: Failed to sync progress", error);
  }
}

// Sync quiz results when back online
async function syncQuizResults() {
  try {
    // Get stored quiz results from IndexedDB
    const quizResults = await getStoredQuizResults();

    if (quizResults && quizResults.length > 0) {
      // Send to server
      const response = await fetch("/api/sync/quiz-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ results: quizResults }),
      });

      if (response.ok) {
        // Clear stored data after successful sync
        await clearStoredQuizResults();
        console.log("Service Worker: Quiz results synced successfully");
      }
    }
  } catch (error) {
    console.error("Service Worker: Failed to sync quiz results", error);
  }
}

// IndexedDB operations for service worker
const DB_NAME = "MRFEducation";
const DB_VERSION = 2;

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("progress")) {
        const store = db.createObjectStore("progress", { keyPath: "id" });
        store.createIndex("synced", "synced", { unique: false });
      }
      if (!db.objectStoreNames.contains("quizResults")) {
        const store = db.createObjectStore("quizResults", { keyPath: "id" });
        store.createIndex("synced", "synced", { unique: false });
      }
      if (!db.objectStoreNames.contains("offlineQueue")) {
        db.createObjectStore("offlineQueue", {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };
  });
}

async function getStoredProgressData() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(["progress"], "readonly");
      const store = tx.objectStore("progress");
      const index = store.index("synced");
      const request = index.getAll(IDBKeyRange.only(false));
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Failed to get stored progress:", error);
    return [];
  }
}

async function clearStoredProgressData() {
  try {
    const db = await openDB();
    const progress = await getStoredProgressData();
    const tx = db.transaction(["progress"], "readwrite");
    const store = tx.objectStore("progress");
    for (const entry of progress) {
      store.put({ ...entry, synced: true });
    }
  } catch (error) {
    console.error("Failed to clear progress data:", error);
  }
}

async function getStoredQuizResults() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(["quizResults"], "readonly");
      const store = tx.objectStore("quizResults");
      const index = store.index("synced");
      const request = index.getAll(IDBKeyRange.only(false));
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Failed to get stored quiz results:", error);
    return [];
  }
}

async function clearStoredQuizResults() {
  try {
    const db = await openDB();
    const results = await getStoredQuizResults();
    const tx = db.transaction(["quizResults"], "readwrite");
    const store = tx.objectStore("quizResults");
    for (const result of results) {
      store.put({ ...result, synced: true });
    }
  } catch (error) {
    console.error("Failed to clear quiz results:", error);
  }
}

// Push notification handling
self.addEventListener("push", (event) => {
  console.log("Service Worker: Push notification received");

  const options = {
    body: "لديك درس جديد متاح للمشاهدة!",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/badge-72x72.png",
    vibrate: [200, 100, 200],
    data: {
      url: "/ar/lessons",
    },
    actions: [
      {
        action: "view",
        title: "عرض الدرس",
        icon: "/icons/view-action.png",
      },
      {
        action: "dismiss",
        title: "تجاهل",
        icon: "/icons/dismiss-action.png",
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification("منصة الأستاذ رضا الفاروق", options),
  );
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Notification clicked");

  event.notification.close();

  if (event.action === "view") {
    event.waitUntil(clients.openWindow(event.notification.data.url || "/ar"));
  }
});
