import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";

const { pageSources, getPageDateModified } =
  await import("../src/data/page-freshness.ts");

const walk = async (dir) => {
  const out = [];
  for (const entry of await readdir(new URL(`../${dir}`, import.meta.url), {
    withFileTypes: true,
  })) {
    const rel = `${dir}/${entry.name}`;
    if (entry.isDirectory()) out.push(...(await walk(rel)));
    else if (entry.name.endsWith(".astro")) out.push(rel);
  }
  return out;
};

const routeOf = (file) => {
  const rel = file
    .replace(/^src\/pages\//, "")
    .replace(/\.astro$/, "")
    .replace(/(^|\/)index$/, "");
  return rel ? `/${rel}/` : "/";
};

test("Unregistered page: every indexable route declares its sources", async () => {
  const files = (await walk("src/pages")).filter(
    (f) => f !== "src/pages/404.astro" && f !== "src/pages/blog/[slug].astro",
  );
  for (const file of files) {
    const route = routeOf(file);
    assert.ok(pageSources[route], `route ${route} has no pageSources entry`);
  }
});

test("every listed source exists", () => {
  for (const [route, sources] of Object.entries(pageSources)) {
    assert.ok(sources.length > 0, `${route} lists no sources`);
    for (const source of sources) {
      assert.ok(
        existsSync(new URL(`../${source}`, import.meta.url)),
        `${route}: missing source ${source}`,
      );
    }
  }
});

test("pathname is normalized to a trailing slash", () => {
  assert.equal(
    getPageDateModified("/diseno-web-sevilla"),
    getPageDateModified("/diseno-web-sevilla/"),
  );
  assert.equal(getPageDateModified("/no-such-route/"), undefined);
});

const source = (path) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("webPageSchema returns the WebPage freshness node", async () => {
  const { webPageSchema } = await import("../src/lib/schema.ts");
  assert.deepEqual(
    webPageSchema({
      url: "https://nuriaromero.dev/seo-local-sevilla/",
      name: "SEO local en Sevilla",
      dateModified: "2026-11-10T09:30:00+01:00",
    }),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": "https://nuriaromero.dev/seo-local-sevilla/#webpage",
      url: "https://nuriaromero.dev/seo-local-sevilla/",
      name: "SEO local en Sevilla",
      dateModified: "2026-11-10T09:30:00+01:00",
      isPartOf: { "@id": "https://nuriaromero.dev/#website" },
      about: { "@id": "https://nuriaromero.dev/#business" },
      inLanguage: "es",
    },
  );
});

test("Layout appends webPageSchema only with a date and not noindex", async () => {
  const layout = await source("src/layouts/Layout.astro");
  assert.match(layout, /webPageSchema/);
  assert.match(layout, /getPageDateModified\(Astro\.url\.pathname\)/);
  assert.match(layout, /!noindex\s*&&\s*dateModified/);
});

test("check-seo-16 ignores the build-derived WebPage entity", async () => {
  const check = await source("scripts/check-seo-16.mjs");
  assert.match(check, /"WebPage"/);
});
