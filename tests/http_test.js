import { expect, test } from "bun:test";
import { contentType, publicPath, publicPathname } from "../src/http.js";

test("publicPathname maps root to index.html", () => {
  expect(publicPathname("http://localhost:3000/")).toBe("/index.html");
});

test("publicPath rejects paths outside the public directory", () => {
  const publicDir = new URL("file:///app/public/");

  expect(publicPath("/../package.json", publicDir)).toBeNull();
});

test("contentType returns known MIME types", () => {
  expect(contentType("/styles.css")).toBe("text/css; charset=utf-8");
  expect(contentType("/manifest.webmanifest")).toBe("application/manifest+json; charset=utf-8");
});