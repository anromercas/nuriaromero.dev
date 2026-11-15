import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = (path) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("breadcrumb urls of portfolio, recursos, sobre-mi and contacto end in a trailing slash", async () => {
  for (const page of ["portfolio", "recursos", "sobre-mi", "contacto"]) {
    const text = await source(`src/pages/${page}.astro`);
    const urls = [
      ...text.matchAll(/\{\s*name:\s*"[^"]*",\s*url:\s*"([^"]*)"\s*\}/g),
    ].map((m) => m[1]);
    assert.ok(urls.length > 0, `${page}: no breadcrumb url found`);
    for (const url of urls)
      assert.match(
        url,
        /\/$/,
        `${page}: breadcrumb url "${url}" omits trailing slash`,
      );
  }
});

test("legal pages pass a slug with a trailing slash to LegalLayout", async () => {
  for (const page of ["aviso-legal", "privacidad", "cookies"]) {
    const text = await source(`src/pages/${page}.astro`);
    const slug = text.match(/\bslug="([^"]*)"/)?.[1];
    assert.ok(slug, `${page}: slug prop not found`);
    assert.match(slug, /\/$/, `${page}: slug "${slug}" omits trailing slash`);
  }
});
