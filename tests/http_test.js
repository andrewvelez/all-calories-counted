import { expect, test } from "bun:test";
import { contentType, publicPath, publicPathname } from "../src/http.js";

/**
 * Verify that / serves the app shell.
 * @returns {void}
 */
function testRootPathname() {
  expect(publicPathname("http://localhost:3000/")).toBe("/index.html");
}

/**
 * Verify that escaped filesystem paths are rejected.
 * @returns {void}
 */
function testPublicPathEscape() {
  const publicDir = new URL("file:///app/public/");

  expect(publicPath("/../package.json", publicDir)).toBeNull();
}

/**
 * Verify static asset MIME types.
 * @returns {void}
 */
function testContentTypes() {
  expect(contentType("/styles.css")).toBe("text/css; charset=utf-8");
  expect(contentType("/manifest.webmanifest")).toBe("application/manifest+json; charset=utf-8");
}

test("publicPathname maps root to index.html", testRootPathname);
test("publicPath rejects paths outside the public directory", testPublicPathEscape);
test("contentType returns known MIME types", testContentTypes);