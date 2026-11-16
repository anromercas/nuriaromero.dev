import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  mainWordCount,
  withoutWordBudgetExcluded,
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

const quote = (attr = 'data-word-budget="exclude"') =>
  `<figure class="quote" ${attr}><blockquote><p>Una reseña muy larga de una clienta que cuenta toda su experiencia con el servicio recibido durante meses.</p></blockquote><figcaption><div class="stars" role="img" aria-label="Valoración: 5 de 5 estrellas"><svg><path d="M1 1"></path></svg></div><span class="author">Ana</span><span class="when">hace 2 meses</span><a href="https://search.google.com/local/reviews?placeid=x">Ver todas las reseñas en Google</a></figcaption></figure>`;
const mainOf = (inner) => `<html><body><main>${inner}</main></body></html>`;

test("mainWordCount is identical with and without the marked review quote", () => {
  const copy = "<h1>Titulo</h1><p>uno dos tres cuatro</p>";
  assert.equal(
    mainWordCount(mainOf(`${copy}${quote()}<p>cinco seis</p>`)),
    mainWordCount(mainOf(`${copy}<p>cinco seis</p>`)),
  );
});

test("text outside the marker is counted", () => {
  assert.equal(
    mainWordCount(mainOf(`<p>uno dos</p>${quote()}<p>tres cuatro cinco</p>`)),
    5,
  );
});

test("withoutWordBudgetExcluded handles nesting, single quotes and several markers", () => {
  const nested = `<p>a</p><figure data-word-budget="exclude"><figure>interior x y</figure>mas texto</figure><p>b</p>`;
  assert.equal(mainWordCount(mainOf(nested)), 2);
  assert.equal(mainWordCount(mainOf(quote("data-word-budget='exclude'"))), 0);
  assert.equal(
    mainWordCount(mainOf(`<p>a</p>${quote()}<p>b</p>${quote()}<p>c</p>`)),
    3,
  );
  assert.equal(
    mainWordCount(
      mainOf(`<p>a</p><img data-word-budget="exclude" alt="x"><p>b</p>`),
    ),
    2,
  );
  const open = `<p>a</p><figure data-word-budget="exclude">sin cierre</main>`;
  assert.equal(withoutWordBudgetExcluded(open), "<p>a</p>");
});

test("withoutWordBudgetExcluded returns an unmarked page unchanged", () => {
  assert.equal(withoutWordBudgetExcluded(page), page);
});
