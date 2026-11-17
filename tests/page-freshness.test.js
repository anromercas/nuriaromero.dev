import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readdir } from "node:fs/promises";

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
