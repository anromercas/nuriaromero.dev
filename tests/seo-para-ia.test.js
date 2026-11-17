import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

// --- Task 1.1: Service JSON-LD without an own offer (NRD-249) -----------------

test("serviceSchema accepts a missing price and spreads offers last only when present", () => {
  const source = read("src/lib/schema.ts");
  assert.match(source, /price\?: string/);
  assert.match(source, /\.\.\.\(offers \? \{ offers \} : \{\}\)/);
  assert.doesNotMatch(source, /\n\s+price: string\n/);
});

test("ServicePageData declares the ownOffer opt-out", () => {
  assert.match(read("src/data/types.ts"), /ownOffer\?: boolean/);
});

test("ServiceLayout passes no price when ownOffer is false", () => {
  assert.match(
    read("src/layouts/ServiceLayout.astro"),
    /price: page\.ownOffer === false \? undefined : page\.pricing\.from/,
  );
});

test("pricingTier is exported and tierFrom delegates to it", async () => {
  const source = read("src/data/services.ts");
  assert.match(source, /export function pricingTier\(/);
  assert.match(source, /return pricingTier\(service, tierName\)\.from/);
  const { seoLocal, pricingTier, tierFrom } = await import(
    new URL("src/data/services.ts", root).href
  );
  assert.equal(tierFrom(seoLocal, "Local Pro"), "500 €/mes + IVA");
  assert.equal(pricingTier(seoLocal, "Local Pro").from, "500 €/mes + IVA");
  assert.throws(() => pricingTier(seoLocal, "Nope"), /not found/);
});

// --- Task 2.1: page drawings (NRD-250) -----------------------------------------

const mockPath = "src/components/seo-ia/AiAnswerMock.astro";
const artPath = "src/components/seo-ia/SeoIaTileArt.astro";
const svgTags = (source) => source.match(/<svg\b[^>]*>/g) ?? [];
const markupOf = (source) =>
  source.replace(/<style[\s\S]*<\/style>/, "").replace(/^---[\s\S]*?---/, "");
const brands =
  /whatsapp|google|chatgpt|gemini|openai|claude|copilot|perplexity/i;
const styleOf = (source) =>
  source.match(/<style[^>]*>([\s\S]*)<\/style>/)?.[1] ?? "";

for (const path of [mockPath, artPath]) {
  test(`${path} draws single-stroke accessible SVGs without brands or digits`, () => {
    assert.ok(existsSync(new URL(path, root)), `${path} exists`);
    const source = read(path);
    const tags = svgTags(source);
    assert.ok(tags.length > 0, "has at least one svg");
    for (const tag of tags) {
      assert.match(tag, /aria-hidden="true"/);
      assert.match(tag, /focusable="false"/);
      assert.match(tag, /stroke-width="1\.5"/);
      assert.match(tag, /stroke-linecap="round"/);
      assert.match(tag, /stroke-linejoin="round"/);
    }
    for (const [, fill] of source.matchAll(/\sfill="([^"]*)"/g)) {
      assert.ok(fill === "none", `no filled shapes, found fill="${fill}"`);
    }
    const markup = markupOf(source);
    for (const [, text] of markup.matchAll(/<text\b[^>]*>([^<]*)<\/text>/g)) {
      assert.doesNotMatch(text, /\d/, `no digit in SVG text "${text}"`);
      assert.doesNotMatch(text, brands, `no brand in SVG text "${text}"`);
    }
    assert.doesNotMatch(markup, /€|\d\s?%/, "no price or metric in a drawing");
    assert.doesNotMatch(source, /yellow|recomendad|ranking/i);
  });
}

test("SeoIaTileArt has no SVG text at all", () => {
  assert.doesNotMatch(markupOf(read(artPath)), /<text\b/);
});

test("SeoIaTileArt offers one drawing per kind", () => {
  const source = read(artPath);
  const union = source.match(/kind:([\s\S]*?);\s*\}/)?.[1] ?? "";
  const kinds = [
    "coherencia",
    "respuestas",
    "schema",
    "rastreadores",
    "llms",
    "senales",
  ];
  assert.equal((union.match(/"[a-z]+"/g) ?? []).length, kinds.length);
  for (const kind of kinds) {
    assert.ok(union.includes(`"${kind}"`), `kind ${kind} in the union`);
    assert.ok(source.includes(`kind === "${kind}"`), `drawing for ${kind}`);
  }
  assert.equal(svgTags(source).length, kinds.length, "one svg per kind");
  for (const cls of ["signal", "soft"]) {
    assert.match(source, new RegExp(`class="[^"]*\\b${cls}\\b`));
  }
});

test("AiAnswerMock is an honest illustrative figure with a reduced-motion guard", () => {
  const source = read(mockPath);
  assert.match(
    source,
    /<figure[^>]*aria-label="Ejemplo de la información de un negocio, ordenada y con datos estructurados, que un asistente de IA usa al escribir su respuesta"/s,
  );
  assert.match(source, /<figcaption>Ejemplo ilustrativo<\/figcaption>/);
  assert.match(source, /animate\?:\s*boolean/);
  assert.match(source, /animate\s*=\s*true/);
  assert.match(source, /@media \(prefers-reduced-motion: no-preference\)/);
  assert.match(source, /@supports \(animation-timeline: scroll\(\)\)/);
  assert.equal(svgTags(source).length, 1, "one single-viewBox SVG");
  assert.match(source, /viewBox="0 0 320 220"/);
});

test("AiAnswerMock has one label sized for 11 px at 320 px", () => {
  const source = read(mockPath);
  const texts = [
    ...markupOf(source).matchAll(/<text\b[^>]*>\s*([^<]*?)\s*<\/text>/g),
  ];
  assert.equal(texts.length, 1, "at most one SVG text");
  assert.equal(texts[0][1], "Tu negocio");
  assert.match(styleOf(source), /\.label\s*\{[^}]*font-size:\s*15px/);
});

test("AiAnswerMock rests in the completed drawing at scroll 0", () => {
  const style = styleOf(read(mockPath));
  assert.doesNotMatch(style, /stroke-dashoffset/, "no stroke starts hidden");
  assert.doesNotMatch(style, /visibility:\s*hidden/);
  assert.doesNotMatch(style, /opacity:\s*0[;\s}]/);
  const outside = style.replace(/@media[\s\S]*?\n  \}\n/g, "");
  assert.doesNotMatch(outside, /animation:/);
  const first = style.match(/@keyframes[^{]+\{\s*0%\s*\{([^}]*)\}/)?.[1] ?? "";
  assert.match(
    first,
    /transform:\s*none/,
    "first keyframe is the resting pose",
  );
  const shifts = [...style.matchAll(/translate[XY]\((-?[\d.]+)px\)/g)].map(
    (m) => Math.abs(Number(m[1])),
  );
  assert.ok(shifts.length > 0);
  for (const px of shifts) assert.ok(px <= 4, `nudge of ${px}px`);
});
