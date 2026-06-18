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

self.addEventListener("install", handleInstall);
self.addEventListener("activate", handleActivate);
self.addEventListener("fetch", handleFetch);

/**
 * Cache the application shell during service worker installation.
 * @param {Event} event
 * @returns {void}
 */
function handleInstall(event) {
  const installEvent = /** @type {ExtendableEvent} */ (event);

  installEvent.waitUntil(
    caches.open(CACHE_NAME).then(cacheAppShell),
  );
}

/**
 * Delete old caches when this service worker activates.
 * @param {Event} event
 * @returns {void}
 */
function handleActivate(event) {
  const activateEvent = /** @type {ExtendableEvent} */ (event);

  activateEvent.waitUntil(
    caches.keys().then(deleteOldCaches),
  );
}

/**
 * Serve cached app assets, falling back to the network.
 * @param {Event} event
 * @returns {void}
 */
function handleFetch(event) {
  const fetchEvent = /** @type {FetchEvent} */ (event);

  if (fetchEvent.request.method !== "GET") {
    return;
  }

  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then((cached) => cached ?? fetch(fetchEvent.request)),
  );
}

/**
 * Add the application shell to the current cache.
 * @param {Cache} cache
 */
function cacheAppShell(cache) {
  return cache.addAll(APP_SHELL);
}

/**
 * Delete cache entries that do not match the current cache name.
 */
function deleteOldCaches(names) {
  return Promise.all(
    names.filter(isOldCacheName).map(deleteCache),
  );
}

/**
 * Check whether a cache name is from an older app version.
 * @param {string} name
 * @returns {boolean}
 */
function isOldCacheName(name) {
  return name !== CACHE_NAME;
}

/**
 * Delete one cache by name.
 * @param {string} name
 */
function deleteCache(name) {
  return caches.delete(name);
}
