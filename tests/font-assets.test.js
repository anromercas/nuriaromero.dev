import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { assetsInlineLimit } from "../src/lib/asset-inline-limit.mjs";

const distDir = new URL("../dist/", import.meta.url);
const astroDir = new URL("../dist/_astro/", import.meta.url);
const hasBuild =
  existsSync(new URL("index.html", distDir)) && existsSync(astroDir);

function walk(dir, ext, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const url = new URL(entry.name + (entry.isDirectory() ? "/" : ""), dir);
    if (entry.isDirectory()) walk(url, ext, out);
    else if (entry.name.endsWith(ext)) out.push(url);
  }
  return out;
}

// Data URI of a font MIME type, or any data URI inside an @font-face url().
const FONT_DATA_URI =
  /data:(font\/|application\/(x-)?font|application\/vnd\.ms-fontobject|application\/octet-stream)/i;
const FONT_FACE_DATA_URL = /@font-face\s*\{[^}]*url\(\s*["']?data:/i;

function hasFontDataUri(text) {
  return FONT_DATA_URI.test(text) || FONT_FACE_DATA_URL.test(text);
}

test("assetsInlineLimit never inlines font files", () => {
  for (const ext of ["woff2", "woff", "ttf", "otf", "eot", "WOFF2"]) {
    assert.equal(assetsInlineLimit(`/src/fonts/x.${ext}`), false, ext);
  }
});

test("assetsInlineLimit keeps the Vite default for other assets", () => {
  for (const ext of ["png", "svg"]) {
    assert.equal(assetsInlineLimit(`/src/assets/x.${ext}`), undefined, ext);
  }
});

test(
  "no built CSS or HTML inlines a font as a data URI",
  { skip: !hasBuild && "dist/ not built" },
  () => {
    const cssFiles = walk(astroDir, ".css");
    assert.ok(cssFiles.length > 0, "expected CSS files in dist/_astro");
    const files = [...cssFiles, ...walk(distDir, ".html")];
    const offenders = files
      .filter((file) => hasFontDataUri(readFileSync(file, "utf-8")))
      .map((file) => file.pathname);
    assert.deepEqual(
      offenders,
      [],
      "fonts must be emitted as files (font-src 'self')",
    );
  },
);

test("CSP keeps font-src 'self' without data:", () => {
  const headers = readFileSync(
    new URL("../public/_headers", import.meta.url),
    "utf-8",
  );
  const matches = [...headers.matchAll(/font-src([^;\n]*)/g)];
  assert.ok(matches.length > 0, "font-src directive present");
  for (const m of matches) assert.equal(m[1].trim(), "'self'");
});
