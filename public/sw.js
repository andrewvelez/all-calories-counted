/// <reference lib="webworker" />
// @ts-check

const CACHE_NAME = "all-calories-counted:v1";
const APP_SHELL = [
  "/",
  "/index.html",
  "/app.js",
  "/model.js",
  "/storage.js",
  "/styles.css",
  "/manifest.webmanifest",
];

self.addEventListener("install", (event) => {
  const installEvent = /** @type {ExtendableEvent} */ (event);

  installEvent.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)),
  );
});

self.addEventListener("activate", (event) => {
  const activateEvent = /** @type {ExtendableEvent} */ (event);

  activateEvent.waitUntil(
    caches.keys().then((names) => Promise.all(
      names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)),
    )),
  );
});

self.addEventListener("fetch", (event) => {
  const fetchEvent = /** @type {FetchEvent} */ (event);

  if (fetchEvent.request.method !== "GET") {
    return;
  }

  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then((cached) => cached ?? fetch(fetchEvent.request)),
  );
});