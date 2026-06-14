// @ts-check

import { contentType, publicPath, publicPathname } from "./http.js";

const PORT = Number.parseInt(Bun.env.PORT ?? "3000", 10);

const server = Bun.serve({
  port: PORT,

  async fetch(request) {
    const pathname = publicPathname(request.url);
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