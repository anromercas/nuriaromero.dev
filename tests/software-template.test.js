import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

// --- Task 1.1: page illustrations (NRD-208) -----------------------------------

const mockPath = "src/components/software/AppMock.astro";
const artPath = "src/components/software/SoftwareTileArt.astro";
const svgTags = (source) => source.match(/<svg\b[^>]*>/g) ?? [];
const markupOf = (source) =>
  source.replace(/<style[\s\S]*<\/style>/, "").replace(/^---[\s\S]*?---/, "");

for (const path of [mockPath, artPath]) {
  test(`${path} draws single-stroke accessible SVGs without digits`, () => {
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
    }
    assert.doesNotMatch(markup, /€|\d\s?%/, "no price or metric in a drawing");
    assert.doesNotMatch(source, /yellow/i);
  });
}

test("SoftwareTileArt has no SVG text at all", () => {
  assert.doesNotMatch(markupOf(read(artPath)), /<text\b/);
});

test("AppMock is an honest illustrative figure with a reduced-motion guard", () => {
  const source = read(mockPath);
  assert.match(
    source,
    /<figure[^>]*aria-label="Herramienta interna de ejemplo con una lista de pedidos y su estado"/s,
  );
  assert.match(source, /<figcaption>Ejemplo ilustrativo<\/figcaption>/);
  assert.match(source, /animate\?:\s*boolean/);
  assert.match(source, /animate\s*=\s*true/);
  assert.match(source, /@media \(prefers-reduced-motion: no-preference\)/);
  assert.match(source, /@supports \(animation-timeline: scroll\(\)\)/);
  assert.equal(svgTags(source).length, 1, "one single-viewBox SVG");
  const texts = [...source.matchAll(/<text\b[^>]*>\s*([^<]*?)\s*<\/text>/g)];
  assert.deepEqual(
    texts.map((m) => m[1]),
    ["Pedidos"],
    "the only drawing text is a common noun",
  );
});

test("AppMock rests in the completed drawing at scroll 0 and without timelines", () => {
  const source = read(mockPath);
  const style = source.match(/<style[^>]*>([\s\S]*)<\/style>/)?.[1] ?? "";
  assert.doesNotMatch(style, /stroke-dashoffset/, "no stroke starts hidden");
  assert.doesNotMatch(style, /visibility:\s*hidden/);
  for (const [, from] of style.matchAll(
    /(?:from|0%)\s*\{[^}]*opacity:\s*([\d.]+)/g,
  )) {
    assert.ok(Number(from) >= 0.7, `keyframe starts at opacity ${from}`);
  }
  const outside = style.replace(/@media[\s\S]*?\n  \}\n/g, "");
  assert.doesNotMatch(outside, /animation:/);
  assert.doesNotMatch(outside, /opacity:\s*0[;\s]/);
  const first = style.match(/@keyframes[^{]+\{\s*0%\s*\{([^}]*)\}/)?.[1] ?? "";
  assert.match(
    first,
    /transform:\s*none/,
    "first keyframe is the resting pose",
  );
  const shifts = [...style.matchAll(/translateX\((-?[\d.]+)px\)/g)].map((m) =>
    Math.abs(Number(m[1])),
  );
  for (const px of shifts) assert.ok(px <= 4, `nudge of ${px}px`);
});

test("SoftwareTileArt offers one drawing per kind", () => {
  const source = read(artPath);
  const union = source.match(/kind:([\s\S]*?);\s*\}/)?.[1] ?? "";
  const kinds = ["web", "movil", "gestion", "api", "reservas", "datos"];
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
