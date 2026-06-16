// @ts-check

import { contentType, publicPath, publicPathname } from "./http.js";

const PORT = Number.parseInt(Bun.env.PORT ?? "3000", 10);
const IS_DEV = Bun.env.APP_ENV === "dev";
const DEV_SERVICE_WORKER = `
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.keys().then((names) => Promise.all(names.map((name) => caches.delete(name)))));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.registration.unregister());
});
`;

/**
 * Serve files from the public directory.
 * @param {Request} request
 */
async function handleRequest(request) {
  const pathname = publicPathname(request.url);
  const headers = new Headers({
    "Cache-Control": IS_DEV ? "no-store" : "public, max-age=0",
    "Content-Type": contentType(pathname),
  });

  if (IS_DEV && pathname === "/sw.js") {
    return new Response(DEV_SERVICE_WORKER, { headers });
  }

  const path = publicPath(pathname);

  if (!path) {
    return new Response("Not Found", { status: 404 });
  }

  const file = Bun.file(path);

  if (!(await file.exists())) {
    return new Response("Not Found", { status: 404 });
  }

  if (pathname === "/sw.js") {
    headers.set("Cache-Control", "no-cache");
  }

  return new Response(file, { headers });
}

const server = Bun.serve({
  port: PORT,
  fetch: handleRequest,
});

console.log(`Listening on ${server.url}`);
