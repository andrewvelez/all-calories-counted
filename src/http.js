// @ts-check
// Executes server-side under Bun.

export const PUBLIC_DIR = new URL("../public/", import.meta.url);

const MIME_TYPES = Object.freeze({
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
});

/**
 * Resolve a request pathname to a file URL inside the public directory.
 * @param {string} pathname
 * @param {URL} [publicDir]
 * @returns {URL | null}
 */
export function publicPath(pathname, publicDir = PUBLIC_DIR) {
  const path = new URL(`.${pathname}`, publicDir);

  if (!path.href.startsWith(publicDir.href)) {
    return null;
  }

  return path;
}

/**
 * Get the response content type for a public asset pathname.
 * @param {string} pathname
 * @returns {string}
 */
export function contentType(pathname) {
  const index = pathname.lastIndexOf(".");
  const extension = index === -1 ? "" : pathname.slice(index);

  if (Object.hasOwn(MIME_TYPES, extension)) {
    return MIME_TYPES[/** @type {keyof typeof MIME_TYPES} */ (extension)];
  }

  return "application/octet-stream";
}

/**
 * Convert a request URL to the public asset pathname to serve.
 * @param {string | URL} url
 * @returns {string}
 */
export function publicPathname(url) {
  const { pathname } = new URL(url);

  return pathname === "/" ? "/index.html" : pathname;
}
