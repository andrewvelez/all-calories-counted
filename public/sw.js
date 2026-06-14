const CACHE_NAME = "all-calories-counted-v1";
const APP_SHELL = [
  "/",
  "/src/index.js",
  "/public/index.html",
  "/public/main.js",
  "/public/sw.js",
  "/public/styles.css",
  "/public/manifest.webmanifest",
  "/public/icons/icon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)),
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) => names.filter((name) => name !== CACHE_NAME))
      .then((names) => Promise.all(names.map((name) => caches.delete(name))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => response ?? fetch(event.request)),
  );
});