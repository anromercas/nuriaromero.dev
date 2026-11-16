import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

const { STORE_FROM, storeOptions, storeTiers } = await import(
  new URL("../src/data/store-offer.ts", import.meta.url)
);

// --- Task 1.1: store options as plans and shared plan layout (NRD-201) ------

test("every store option has bestFor, tradeOff and panel without digits", () => {
  assert.equal(storeOptions.length, 3);
  for (const o of storeOptions) {
    for (const key of ["bestFor", "tradeOff", "panel"]) {
      assert.ok(
        typeof o[key] === "string" && o[key].trim().length > 0,
        `${o.id}.${key}`,
      );
      assert.doesNotMatch(o[key], /\d/, `${o.id}.${key} has no digit`);
      assert.doesNotMatch(o[key], /€/, `${o.id}.${key} has no euro literal`);
    }
  }
});

test("storeTiers: one tier per option at the shared price, no recommendation", () => {
  assert.equal(storeTiers.length, storeOptions.length);
  storeTiers.forEach((tier, i) => {
    const o = storeOptions[i];
    assert.equal(tier.name, o.name);
    assert.equal(tier.from, STORE_FROM);
    assert.deepEqual(tier.includes, [o.panel]);
    assert.equal(tier.note, o.recurringCost);
    assert.ok(!tier.recommended, "no recommended tier");
    assert.equal("example" in tier, false, "example is not on a card");
  });
});

test("SeoLocalPlans gains additive one-plan and three-plan rules", () => {
  const css = read("src/components/seo-local/SeoLocalPlans.astro");
  assert.match(css, /\.plan-list:has\(> \.plan:only-child\)/);
  assert.match(css, /\.plan-list:has\(> \.plan:nth-child\(3\):last-child\)/);
  const only = css.match(
    /\.plan-list:has\(> \.plan:only-child\)\s*\{([^}]*)\}/,
  );
  assert.ok(only, "only-child rule block");
  assert.match(only[1], /grid-template-columns:\s*minmax\(0,\s*1fr\)/);
  assert.match(only[1], /max-width:\s*36rem/);
  assert.match(only[1], /margin-inline:\s*0/);
  const three = css.match(
    /@media \(min-width: 1024px\)\s*\{[^@]*?nth-child\(3\):last-child\)\s*\{([^}]*)\}/s,
  );
  assert.ok(three, "three-plan rule from 1024px");
  assert.match(
    three[1],
    /grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/,
  );
  assert.match(three[1], /max-width:\s*none/);
});

test("SeoLocalPlans markup equals the baseline (style-only change)", () => {
  const source = read("src/components/seo-local/SeoLocalPlans.astro");
  const markup = source
    .slice(0, source.indexOf("<style>"))
    .replace(/\s(class|class:list)=(\{[^}]*\}|"[^"]*")/g, "")
    .replace(/\s+/g, " ")
    .trim();
  assert.equal(
    markup,
    read("tests/fixtures/seo-local-plans.markup.txt").trim(),
  );
});

// --- Task 1.2: page illustrations and scope component (NRD-202) -------------

const mockPath = "src/components/tienda-online/StoreMock.astro";
const artPath = "src/components/tienda-online/StoreTileArt.astro";
const scopePath = "src/components/tienda-online/StoreScope.astro";
const svgTags = (source) => source.match(/<svg\b[^>]*>/g) ?? [];
const markupOf = (source) =>
  source.replace(/<style[\s\S]*<\/style>/, "").replace(/^---[\s\S]*?---/, "");

for (const path of [mockPath, artPath]) {
  test(`${path} draws single-stroke accessible SVGs without text`, () => {
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
      assert.ok(fill === "none", `no filled icons, found fill="${fill}"`);
    }
    for (const [, fill] of source.matchAll(/fill:\s*([^;}]+)/g)) {
      assert.equal(fill.trim(), "var(--card-surface)", "only the card ground");
    }
    const markup = markupOf(source);
    assert.doesNotMatch(markup, /<text\b/, "no SVG text, so no digits either");
    assert.doesNotMatch(markup, /€|\d\s?%/, "no price or metric in a drawing");
    assert.doesNotMatch(source, /yellow|woocommerce|shopify/i);
  });
}

test("StoreMock is an honest illustrative figure with a reduced-motion guard", () => {
  const source = read(mockPath);
  assert.match(
    source,
    /<figure[^>]*aria-label="Tienda online de ejemplo: ficha de producto y carrito"/s,
  );
  assert.match(source, /<figcaption>Ejemplo ilustrativo<\/figcaption>/);
  assert.match(source, /animate\?:\s*boolean/);
  assert.match(source, /animate\s*=\s*true/);
  assert.match(source, /@media \(prefers-reduced-motion: no-preference\)/);
  assert.match(source, /@supports \(animation-timeline: scroll\(\)\)/);
  assert.equal(svgTags(source).length, 1, "one single-viewBox SVG");
});

test("StoreMock never starts hidden at first paint", () => {
  const source = read(mockPath);
  const style = source.match(/<style[^>]*>([\s\S]*)<\/style>/)?.[1] ?? "";
  for (const [, from] of style.matchAll(/from\s*\{[^}]*opacity:\s*([\d.]+)/g)) {
    assert.ok(Number(from) >= 0.7, `keyframe starts at opacity ${from}`);
  }
  for (const [, offset] of style.matchAll(
    /from\s*\{[^}]*stroke-dashoffset:\s*([\d.]+)/g,
  )) {
    assert.fail(`a stroke starts hidden (dashoffset ${offset})`);
  }
  // Default rules (outside the reduced-motion media query) show the end state.
  const outside = style.replace(/@media[\s\S]*?\n  \}\n/g, "");
  assert.doesNotMatch(outside, /opacity:\s*0[;\s]/);
});

test("StoreTileArt offers one drawing per kind", () => {
  const source = read(artPath);
  const union = source.match(/kind:([\s\S]*?);\s*\}/)?.[1] ?? "";
  const kinds = ["catalogo", "pago", "variantes", "envios", "panel", "seo"];
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

test("StoreScope renders two headed lists and imports no data", () => {
  assert.ok(existsSync(new URL(scopePath, root)), "StoreScope exists");
  const source = read(scopePath);
  assert.doesNotMatch(source, /@\/data|\/data\//, "no data import");
  assert.match(source, /import "@\/styles\/template\.css"/);
  assert.match(source, /quotedSeparately:\s*StoreScopeItem\[\]/);
  assert.match(source, /<h3[^>]*>\s*Incluido en las tres opciones\s*<\/h3>/);
  assert.match(source, /<h3[^>]*>\s*Se presupuesta aparte\s*<\/h3>/);
  const markup = markupOf(source);
  assert.equal((markup.match(/<h3\b/g) ?? []).length, 2, "two h3");
  assert.equal((markup.match(/<ul\b/g) ?? []).length, 2, "one ul per list");
  assert.match(markup, /item\.link/);
  assert.match(markup, /href=\{item\.link\.href\}/);
  assert.match(
    source,
    /M5 12\.5l4\.5 4\.5L19 7\.5/,
    "same check path as plans",
  );
  assert.match(source, /M7 12h10/, "dash marker for quoted separately");
  assert.match(source, /--sky-signal/);
  assert.match(source, /--sky-accent/);
  assert.doesNotMatch(source, /text-gray-|bg-gray-/);
  for (const tag of svgTags(source)) {
    assert.match(tag, /aria-hidden="true"/);
    assert.match(tag, /focusable="false"/);
  }
});

// --- Task 2.1: page on the template (NRD-203) --------------------------------

const { tiendaOnline } = await import(
  new URL("../src/data/services.ts", import.meta.url)
);
const { intentMatrix } = await import(
  new URL("../src/data/seo-intents.ts", import.meta.url)
);
const pageSource = () => read("src/pages/tienda-online-sevilla.astro");

test("page uses the template variant and drops the legacy blocks", () => {
  const page = pageSource();
  assert.match(
    page,
    /<ServiceLayout\s+page=\{tiendaOnline\}\s+variant="template"/,
  );
  assert.doesNotMatch(page, /TitleSection|StoreOffer|✓/);
  assert.doesNotMatch(page, /text-gray-|bg-gray-/);
  assert.equal(
    existsSync(new URL("src/components/tienda-online/StoreOffer.astro", root)),
    false,
    "StoreOffer.astro is deleted",
  );
});

test("page composes the template components in reference slot order", () => {
  const page = pageSource();
  const order = [
    'slot="hero"',
    "<SeoLocalHero",
    '<StoreMock slot="visual"',
    "<ProofStrip",
    'slot="benefits"',
    "<ReviewBento",
    "<StoreTileArt",
    'slot="process"',
    "<SeoLocalProcess",
    'slot="before-pricing"',
    "<RealProof",
    "<SeoLocalAgencia",
    'slot="pricing"',
    "<SeoLocalPlans",
    "<StoreScope",
    'slot="faq"',
    "<SeoLocalFaq",
    'slot="related"',
    "<SeoLocalRelated",
    'slot="closing"',
    "<SeoLocalClosing",
    "<SeoLocalNap",
  ];
  let last = -1;
  for (const token of order) {
    const at = page.indexOf(token, last + 1);
    assert.ok(at > last, `${token} appears after the previous section`);
    last = at;
  }
});

test("keyword headings are bound to tiendaOnline.sectionTitles", () => {
  const page = pageSource();
  for (const key of ["benefits", "process", "pricing", "faq"]) {
    assert.match(
      page,
      new RegExp(`keyword=\\{tiendaOnline\\.sectionTitles\\?\\.${key}\\b`),
      `sectionTitles.${key}`,
    );
  }
  assert.match(page, /keyword=\{tiendaOnline\.hero\.h1\}/);
  assert.match(page, /secondaryLink=\{\{[^}]*href:\s*"#precios"/);
  assert.match(page, /projects=\{\["arkady",\s*"adfsevilla"\]\}/);
  assert.match(page, /internalLinksBySource\[tiendaOnline\.slug\]/);
});

test("comparison, plans and scope are built from the store source", () => {
  const page = pageSource();
  assert.match(page, /keyword="¿WooCommerce, Shopify o a medida\?"/);
  assert.match(
    page,
    /storeOptions\.map\(\(o\)\s*=>\s*\(\{\s*lead:\s*o\.bestFor,\s*text:\s*o\.tradeOff,?\s*\}\)\)/,
  );
  assert.match(page, /tiers=\{storeTiers\}/);
  assert.match(page, /storeOptions\.find\(\(o\)\s*=>\s*o\.id === "a-medida"\)/);
  assert.match(page, /Desde \{STORE_FROM\}/);
  assert.match(page, /includes=\{storeIncludes\}/);
  assert.match(page, /quotedSeparately=\{storeQuotedSeparately\}/);
  assert.match(page, /note=\{STORE_FINAL_PRICE_NOTE\}/);
  assert.doesNotMatch(page, /€/, "no price literal in the page");
});

test("tiendaOnline has six benefits and four steps without digits", () => {
  assert.equal(tiendaOnline.benefits.length, 6);
  assert.equal(tiendaOnline.process.length, 4);
  for (const item of [...tiendaOnline.benefits, ...tiendaOnline.process]) {
    const digits = `${item.title} ${item.text}`.match(/\d+/g) ?? [];
    for (const d of digits) assert.equal(d, "20", `unexpected figure ${d}`);
  }
  assert.deepEqual(
    tiendaOnline.process.map((s) => s.title),
    [
      "Alcance",
      "Propuesta cerrada por escrito",
      "Construcción",
      "Formación y lanzamiento",
    ],
  );
  assert.equal(
    tiendaOnline.sectionTitles.benefits,
    "Qué incluye tu tienda online en Sevilla",
  );
});

test("hero copy: display title with accent, short subtitle, no price", () => {
  const { title, titleAccent, subtitle } = tiendaOnline.hero;
  assert.ok(title.includes(titleAccent), "accent is a substring of the title");
  assert.match(subtitle, /tienda online/);
  assert.doesNotMatch(subtitle, /\d|€/);
  assert.ok(subtitle.split(/\s+/).length <= 30, "short subtitle");
  assert.ok(tiendaOnline.cta.title.length > 0);
});

test("intent row swaps the legacy signal for the comparison heading", () => {
  const row = intentMatrix.find((r) => r.url === "/tienda-online-sevilla/");
  assert.deepEqual(row.contentSignals, [
    "Así es el proceso de crear tu tienda online",
    "¿WooCommerce, Shopify o a medida?",
  ]);
  assert.equal(row.titleSignal, "Diseño de tienda online en Sevilla");
  assert.equal(row.descriptionSignal, "pasarela de pago propia");
});
