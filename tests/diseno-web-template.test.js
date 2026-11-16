import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

const disenoWebBlock = () => {
  const source = read("src/data/services.ts");
  const start = source.indexOf("export const disenoWeb");
  const end = source.indexOf("export const ", start + 10);
  return source.slice(start, end === -1 ? undefined : end);
};

test("types.ts declares one-time billing and FAQ links", () => {
  const types = read("src/data/types.ts");
  assert.match(types, /tierBilling\?:\s*"monthly"\s*\|\s*"one-time"/);
  assert.match(
    types,
    /faqs:\s*\{[^}]*links\?:\s*\{\s*label:\s*string;\s*href:\s*string\s*\}\[\]/s,
  );
});

test("serviceSchema has a one-time branch without a monthly unit price", () => {
  const schema = read("src/lib/schema.ts");
  assert.match(schema, /billing\?:\s*"monthly"\s*\|\s*"one-time"/);
  assert.match(schema, /billing\s*===\s*"one-time"/);
  const start = schema.indexOf('service.billing === "one-time"');
  assert.ok(start > -1, "one-time branch present");
  const branch = schema.slice(start, schema.indexOf(": {", start));
  assert.doesNotMatch(branch, /UnitPriceSpecification|priceSpecification/);
  assert.match(schema, /unitText:\s*"MON"/, "monthly branch stays");
});

test("ServiceLayout passes billing with the tiers", () => {
  const layout = read("src/layouts/ServiceLayout.astro");
  assert.match(layout, /billing:\s*page\.tierBilling/);
});

test("disenoWeb opts in to one-time tier offers", () => {
  const block = disenoWebBlock();
  assert.match(block, /offersFromTiers:\s*true/);
  assert.match(block, /tierBilling:\s*"one-time"/);
});

test("check-seo-02 asserts the one-time offers of /diseno-web-sevilla/", () => {
  const check = read("scripts/check-seo-02.mjs");
  assert.match(check, /one-time/);
  assert.match(check, /Landing de una página/);
  assert.match(check, /Web completa \(hasta 5 páginas\)/);
});

// --- Page illustrations (task 1.2) ------------------------------------------

const webMockPath = "src/components/diseno-web/WebMock.astro";
const webTileArtPath = "src/components/diseno-web/WebTileArt.astro";
const svgTags = (source) => source.match(/<svg\b[^>]*>/g) ?? [];

for (const path of [webMockPath, webTileArtPath]) {
  test(`${path} draws single-stroke accessible SVGs`, () => {
    assert.ok(existsSync(new URL(path, root)), `${path} exists`);
    const source = read(path);
    const tags = svgTags(source);
    assert.ok(tags.length > 0, "has at least one svg");
    for (const tag of tags) {
      assert.match(tag, /aria-hidden="true"/, `aria-hidden in ${tag}`);
      assert.match(tag, /focusable="false"/, `focusable=false in ${tag}`);
      assert.match(tag, /stroke-width="1\.5"/, `1.5 stroke in ${tag}`);
      assert.match(tag, /stroke-linecap="round"/, `round caps in ${tag}`);
      assert.match(tag, /stroke-linejoin="round"/, `round joins in ${tag}`);
    }
    const fills = [...source.matchAll(/\sfill="([^"]*)"/g)].map((m) => m[1]);
    for (const fill of fills) {
      assert.ok(
        fill === "none" || fill === "currentColor",
        `no filled icons, found fill="${fill}"`,
      );
    }
    const cssFills = [...source.matchAll(/fill:\s*([^;}]+)/g)].map((m) =>
      m[1].trim(),
    );
    for (const fill of cssFills) {
      assert.ok(
        ["var(--card-surface)", "var(--text-secondary)"].includes(fill),
        `only the phone screen ground and SVG text, found `,
      );
    }
  });
}

test("WebMock is an honest illustrative figure with a reduced-motion guard", () => {
  const source = read(webMockPath);
  assert.match(
    source,
    /<figure\b[^>]*aria-label="Web de ejemplo de un negocio, en ordenador y en móvil"/,
  );
  assert.match(source, /<figcaption>Ejemplo ilustrativo<\/figcaption>/);
  assert.match(source, /animate\?:\s*boolean/);
  assert.match(source, /animate\s*=\s*true/);
  assert.match(source, /@media \(prefers-reduced-motion: no-preference\)/);
  assert.match(source, /@supports \(animation-timeline: scroll\(\)\)/);
  assert.ok(source.includes("tunegocio.es"), "address pill text");
  const markup = source.replace(/<style[\s\S]*<\/style>/, "");
  assert.doesNotMatch(source, /yellow|estrella|polygon/i);
  assert.doesNotMatch(markup, /\d\s?%/, "no fake metrics in the drawing");
  assert.equal(svgTags(source).length, 1, "one single-viewBox SVG");
});

test("WebMock never fades text below full opacity", () => {
  const source = read(webMockPath);
  const style = source.match(/<style[^>]*>([\s\S]*)<\/style>/)?.[1] ?? "";
  const fading = [
    ...style.matchAll(/@keyframes\s+([\w-]+)\s*\{([\s\S]*?\})\s*\}/g),
  ]
    .filter((k) => /opacity\s*:/.test(k[2]))
    .map((k) => k[1]);
  for (const name of fading) {
    const users = [...style.matchAll(/([^{}]+)\{([^{}]*)\}/g)].filter(
      (rule) =>
        new RegExp(`animation\\s*:[^;]*\\b${name}\\b`).test(rule[2]) &&
        !rule[1].includes("@keyframes"),
    );
    for (const [, selector] of users) {
      assert.match(
        selector.trim(),
        /\.phone\s*$/,
        `${name} only fades the text-free phone, got "${selector.trim()}"`,
      );
    }
  }
  const phone =
    source.match(/<g class="phone"[\s\S]*?<\/g>\s*<\/svg>/)?.[0] ?? "";
  assert.ok(phone.length > 0, "phone group found");
  assert.doesNotMatch(phone, /<text\b/, "no text inside the phone group");
});

test("WebTileArt offers one drawing per kind and no panel", () => {
  const source = read(webTileArtPath);
  const union = source.match(/kind:([\s\S]*?);\s*\}/)?.[1] ?? "";
  for (const kind of [
    "movil",
    "seo-local",
    "contacto",
    "google",
    "dominio",
    "soporte",
  ]) {
    assert.ok(union.includes(`"${kind}"`), `kind ${kind} in the union`);
    assert.ok(
      source.includes(`kind === "${kind}"`),
      `drawing for kind ${kind}`,
    );
  }
  assert.doesNotMatch(union, /panel/i, "no panel kind (owner fact H2)");
  assert.doesNotMatch(source, /panel/i);
  for (const cls of ["signal", "soft", "label"]) {
    assert.match(
      source,
      new RegExp(`class="[^"]*\\b${cls}\\b`),
      `uses .${cls}`,
    );
  }
  assert.ok(source.includes("tunegocio.es"), "dominio address pill text");
  assert.ok(source.includes("Sevilla"), "seo-local pin label");
});
