import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("internal markdown links in blog posts end in a trailing slash", () => {
  const dir = "src/content/blog/";
  const offenders = [];
  for (const name of readdirSync(new URL(`../${dir}`, import.meta.url))) {
    if (!name.endsWith(".md")) continue;
    for (const [, href] of read(dir + name).matchAll(/\]\((\/[^)\s]*)\)/g)) {
      const path = href.split("#")[0].split("?")[0];
      if (
        path.endsWith("/") ||
        /\.[a-z0-9]+$/i.test(path) ||
        href.startsWith("/#")
      )
        continue;
      offenders.push(`${name}: ${href}`);
    }
  }
  assert.deepEqual(offenders, []);
});

test("blog index and post layout build slash URLs", () => {
  const index = read("src/pages/blog/index.astro");
  const layout = read("src/layouts/BlogPostLayout.astro");
  assert.match(index, /url: "\/blog\/"/);
  assert.match(index, /href=\{`\/blog\/\$\{post\.slug\}\/`\}/);
  assert.match(layout, /url: "\/blog\/"/);
  assert.match(layout, /const url = `\/blog\/\$\{post\.slug\}\/`/);
});

test("contact form privacy link ends in a trailing slash", () => {
  assert.match(
    read("src/components/ContactForm.astro"),
    /href="\/privacidad\/"/,
  );
});

test("every internal-links path ends in a trailing slash", () => {
  const offenders = [
    ...read("src/data/internal-links.ts").matchAll(/path:\s*"([^"]+)"/g),
  ]
    .map(([, path]) => path)
    .filter((path) => !path.endsWith("/"));
  assert.deepEqual(offenders, []);
});

test("contact links in Hero, home and aviso legal end in a trailing slash", () => {
  const offenders = [
    "src/components/Hero.astro",
    "src/pages/index.astro",
    "src/pages/aviso-legal.astro",
  ].filter((file) => /href="\/contacto"/.test(read(file)));
  assert.deepEqual(offenders, []);
});
