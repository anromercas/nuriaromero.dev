import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  mainWordCount,
  jsonLdEntities,
  faqPageQuestions,
  visibleFaqQuestions,
  headingOutline,
  normalizedMain,
} from "../scripts/lib/page-contract.mjs";
import { templatePages } from "../scripts/lib/template-pages.mjs";
import { parsePage } from "../scripts/lib/seo-inventory.mjs";

const ld = (payload) =>
  `<script type="application/ld+json">${JSON.stringify(payload)}</script>`;

const page = `<!doctype html><html><head><title>T</title>
${ld({
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Service", "@id": "https://nuriaromero.dev/x/#service" },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "Primera?" },
        { "@type": "Question", name: "Segunda?" },
      ],
    },
  ],
})}
${ld({ "@type": "BreadcrumbList" })}
</head><body><header><h2>Fuera</h2></header>
<main class="px-4 pt-24" data-astro-cid-x>
<h1 id="a" class="kw" data-astro-cid-x>Hero &amp; más</h1>
<p>uno dos tres</p>
<h2>Seccion</h2>
<h3>Paso <em>uno</em></h3>
<details data-astro-cid-x><summary data-astro-cid-x><span class="q">Primera?</span><svg aria-hidden="true"><path d="M5 12h14"></path></svg></summary><div><p>r</p></div></details>
<details><summary>Segunda?</summary><div><p>r</p></div></details>
<a class="hero-link" href="/x/" aria-label="Ir" style="color:red" data-astro-cid-x>enlace</a>
</main><footer><details><summary>Fuera</summary></details></footer></body></html>`;

test("mainWordCount equals parsePage().mainWordCount", () => {
  assert.equal(mainWordCount(page), parsePage(page).mainWordCount);
  assert.ok(mainWordCount(page) > 5);
});

test("jsonLdEntities unwraps @graph and keeps standalone blocks, in order", () => {
  const types = jsonLdEntities(page).map((e) => e["@type"]);
  assert.deepEqual(types, ["Service", "FAQPage", "BreadcrumbList"]);
});

test("jsonLdEntities returns an empty array without ld+json", () => {
  assert.deepEqual(jsonLdEntities("<html></html>"), []);
});

test("faqPageQuestions lists FAQPage mainEntity names in order", () => {
  assert.deepEqual(faqPageQuestions(page), ["Primera?", "Segunda?"]);
  assert.deepEqual(faqPageQuestions("<html></html>"), []);
});

test("visibleFaqQuestions lists summary text inside main only, in order", () => {
  assert.deepEqual(visibleFaqQuestions(page), ["Primera?", "Segunda?"]);
});

test("headingOutline lists h1-h3 inside main with plain text", () => {
  assert.deepEqual(headingOutline(page), [
    { level: 1, text: "Hero & más" },
    { level: 2, text: "Seccion" },
    { level: 3, text: "Paso uno" },
  ]);
});

test("normalizedMain drops class and data-astro-cid-*, keeps style, href, aria-*", () => {
  const out = normalizedMain(page);
  assert.doesNotMatch(out, /\sclass=/);
  assert.doesNotMatch(out, /data-astro-cid/);
  assert.match(out, /href="\/x\/"/);
  assert.match(out, /aria-label="Ir"/);
  assert.match(out, /aria-hidden="true"/);
  assert.match(out, /style="color:red"/);
  assert.doesNotMatch(out, /Fuera/);
});

test("normalizedMain collapses whitespace and ignores the main tag attributes", () => {
  const a = normalizedMain(
    '<main class="a">\n  <p   class="x">Hola</p>\n\n</main>',
  );
  const b = normalizedMain('<main class="template-ground"><p>Hola</p></main>');
  assert.equal(a, b);
});

test("templatePages entries have routes starting and ending in / and ordered word ranges", () => {
  assert.ok(templatePages.length >= 1);
  for (const entry of templatePages) {
    assert.match(entry.route, /^\/(.*\/)?$/);
    assert.equal(typeof entry.service, "boolean");
    if (entry.words) {
      assert.equal(entry.words.length, 2);
      assert.ok(entry.words[0] < entry.words[1]);
    }
  }
  assert.ok(
    templatePages.some((e) => e.route === "/seo-local-sevilla/" && e.service),
  );
});

test("baseline fixture holds JSON-LD and headings of the reference page", () => {
  const fixture = JSON.parse(
    readFileSync(
      new URL("./fixtures/seo-local-sevilla.baseline.json", import.meta.url),
      "utf8",
    ),
  );
  assert.ok(Array.isArray(fixture.jsonld) && fixture.jsonld.length > 0);
  assert.ok(Array.isArray(fixture.headings) && fixture.headings.length > 0);
  assert.equal(fixture.headings.filter((h) => h.level === 1).length, 1);
});

test("normalizedMain ignores whitespace-only gaps but not whitespace next to text", () => {
  const a = normalizedMain("<main><p> Hola <em>a</em>. </p></main>");
  const b = normalizedMain("<main><p>Hola <em>a</em>.</p></main>");
  assert.equal(a, b);
  const c = normalizedMain("<main><p>Hola <em>a</em> .</p></main>");
  assert.notEqual(b, c);
});
