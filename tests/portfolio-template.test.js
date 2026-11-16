import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");
const page = read("src/pages/portfolio.astro");
const links = read("src/data/internal-links.ts");
const templatePages = read("scripts/lib/template-pages.mjs");

test("/portfolio/ renders on the template ground", () => {
  assert.match(page, /<main class="template-ground/);
  assert.match(page, /import Layout from "@\/layouts\/Layout\.astro"/);
});

test("/portfolio/ composes the template sections in order", () => {
  const order = [
    "<Breadcrumbs",
    "<SeoLocalHero",
    "<RealProof",
    "<SeoLocalRelated",
    "<SeoLocalClosing",
  ];
  let last = -1;
  for (const tag of order) {
    const at = page.indexOf(tag);
    assert.ok(at > last, `${tag} appears after the previous section`);
    last = at;
  }
});

test("/portfolio/ drops the legacy blocks and the sections it does not carry", () => {
  for (const banned of [
    "CTASection",
    "CodeIcon",
    "<Projects",
    "text-gray-",
    "SeoLocalFaq",
    "ProofStrip",
    "SeoLocalPlans",
    "SeoLocalNap",
  ]) {
    assert.ok(!page.includes(banned), `page has no ${banned}`);
  }
});

test("/portfolio/ uses the ink project cards and only published projects", () => {
  assert.match(page, /projects=\{\["arkady", "adfsevilla"\]\}/);
  assert.match(page, /projectsVariant="ink"/);
});

test("/portfolio/ emits BreadcrumbList only", () => {
  assert.match(page, /schema=\{breadcrumbSchema\(breadcrumbs\)\}/);
  assert.doesNotMatch(page, /faqSchema|serviceSchema|personSchema/);
});

test("/portfolio/ related links come from its own entry", () => {
  assert.match(page, /links=\{internalLinksBySource\["\/portfolio\/"\]/);
  const start = links.indexOf('"/portfolio/": [');
  assert.ok(start > -1, "internal links entry exists");
  const block = links.slice(start, links.indexOf("],", start));
  const paths = [...block.matchAll(/path: "([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(paths, [
    "/diseno-web-sevilla/",
    "/tienda-online-sevilla/",
    "/desarrollo-software-medida/",
    "/contacto/",
  ]);
  const kinds = [...block.matchAll(/kind: "([^"]+)"/g)].map((m) => m[1]);
  assert.equal(kinds.at(-1), "conversion", "conversion row is last");
});

test("/portfolio/ is registered as a template page without Service", () => {
  assert.match(
    templatePages,
    /route:\s*"\/portfolio\/",\s*words:\s*\[100,\s*250\],\s*service:\s*false/,
  );
});
