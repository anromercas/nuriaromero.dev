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
