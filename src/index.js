const PUBLIC_DIR = new URL("../public/", import.meta.url);
const PORT = Number.parseInt(process.env.PORT ?? "3000", 10);

const MIME_TYPES = Object.freeze({
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
});

function publicPath(pathname) {
  const path = new URL(`.${pathname}`, PUBLIC_DIR);

  if (!path.href.startsWith(PUBLIC_DIR.href)) {
    return null;
  }

  return path;
}

function contentType(pathname) {
  const index = pathname.lastIndexOf(".");
  const extension = index === -1 ? "" : pathname.slice(index);

  return MIME_TYPES[extension] ?? "application/octet-stream";
}

const server = Bun.serve({
  port: PORT,

  async fetch(request) {
    const url = new URL(request.url);
    const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
    const path = publicPath(pathname);

    if (!path) {
      return new Response("Not Found", { status: 404 });
    }

    const file = Bun.file(path);

    if (!(await file.exists())) {
      return new Response("Not Found", { status: 404 });
    }

    const headers = new Headers({
      "Content-Type": contentType(pathname),
    });

    if (pathname === "/sw.js") {
      headers.set("Cache-Control", "no-cache");
    }

    return new Response(file, { headers });
  },
});

console.log(`Listening on ${server.url}`);