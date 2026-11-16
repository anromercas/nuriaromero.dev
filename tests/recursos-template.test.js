import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

const page = read("src/pages/recursos.astro");
const templatePages = read("scripts/lib/template-pages.mjs");

const resourcesBlock = () => {
  const start = page.indexOf("const resources");
  assert.ok(start > -1, "resources is declared in the page");
  return page.slice(start, page.indexOf("\n]", start) + 2);
};

// --- /recursos/ on the template (NRD-220) ------------------------------------

test("/recursos/ is registered as a template page without Service", () => {
  assert.match(
    templatePages,
    /route:\s*"\/recursos\/",\s*words:\s*\[100,\s*250\],\s*service:\s*false/,
  );
});

test("main uses the ink ground and the sections come in order", () => {
  assert.match(page, /<main class="template-ground[^"]*"/);
  const order = [
    "<Breadcrumbs",
    "<SeoLocalHero",
    "<SectionHeading",
    "<SeoLocalClosing",
  ].map((tag) => page.indexOf(tag, page.indexOf("<main")));
  assert.ok(
    order.every((i) => i > -1),
    "all template components used",
  );
  assert.deepEqual(
    [...order].sort((a, b) => a - b),
    order,
  );
  assert.match(page, /keyword="Recursos para citar y compartir"/);
});

test("legacy blocks are removed", () => {
  assert.doesNotMatch(page, /text-gray-|bg-gray-|border-gray-/);
  assert.doesNotMatch(page, /→/);
  assert.doesNotMatch(page, /<h1/);
  for (const name of [
    "SeoLocalFaq",
    "ProofStrip",
    "SeoLocalPlans",
    "ReviewBento",
  ])
    assert.doesNotMatch(page, new RegExp(name));
});

test("schema is the breadcrumb list only", () => {
  assert.match(page, /schema=\{breadcrumbSchema\(breadcrumbs\)\}/);
  assert.doesNotMatch(page, /serviceSchema|faqSchema/);
});

test("four resources keep the SEO-13 routes and the casos-exito label", () => {
  const block = resourcesBlock();
  const hrefs = [...block.matchAll(/href:\s*"([^"]+)"/g)].map((m) => m[1]);
  assert.equal(hrefs.length, 4);
  for (const href of hrefs) assert.ok(href.endsWith("/"), `${href} slash`);
  for (const href of [
    "/sobre-mi/",
    "/portfolio/",
    "/blog/",
    "/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/",
  ])
    assert.ok(hrefs.includes(href), `links to ${href}`);
  assert.match(block, /href: "\/portfolio\/",\s*label: "Ver casos de éxito"/);
});

test("row titles are h3 and the policy text is kept", () => {
  assert.match(page, /<h3[^>]*>\s*\{resource\.title\}/);
  assert.match(page, /No se compran enlaces/);
});

// --- Built page (needs dist/) ------------------------------------------------

const built = existsSync(new URL("dist/recursos/index.html", root));

test(
  "built page has one exact H1, the policy and at most 250 words",
  { skip: !built },
  async () => {
    const { mainWordCount } = await import(
      new URL("scripts/lib/page-contract.mjs", root).href
    );
    const html = read("dist/recursos/index.html");
    const h1s = html.match(/<h1[^>]*>[\s\S]*?<\/h1>/g) ?? [];
    assert.equal(h1s.length, 1);
    assert.match(h1s[0], />\s*Recursos para citar y compartir\s*</);
    assert.match(html, /No se compran enlaces/);
    assert.ok(mainWordCount(html) <= 250);
  },
);
