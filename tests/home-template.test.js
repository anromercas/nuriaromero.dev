import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

const heroMockPath = "src/components/home/HomeHeroMock.astro";
const tileArtPath = "src/components/home/ServiceTileArt.astro";

const svgTags = (source) => source.match(/<svg\b[^>]*>/g) ?? [];

for (const path of [heroMockPath, tileArtPath]) {
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
    assert.doesNotMatch(
      source,
      /fill:\s*(#|rgb|yellow)/i,
      "no CSS colour fills",
    );
  });
}

test("HomeHeroMock is an honest illustrative figure with a reduced-motion guard", () => {
  const source = read(heroMockPath);
  assert.match(
    source,
    /<figure\b[^>]*aria-label="Ejemplo: tu negocio en el buscador, en el mapa y en un asistente de IA"/,
  );
  assert.match(source, /<figcaption>Ejemplo ilustrativo<\/figcaption>/);
  assert.match(source, /animate\?:\s*boolean/);
  assert.match(source, /animate\s*=\s*true/);
  assert.match(source, /@media \(prefers-reduced-motion: no-preference\)/);
  assert.match(source, /@supports \(animation-timeline: scroll\(\)\)/);
  for (const text of [
    "peluquería en Triana",
    "En el buscador",
    "En el mapa",
    "En un asistente de IA",
    "Tu negocio",
  ]) {
    assert.ok(source.includes(text), `mock text "${text}"`);
  }
  assert.doesNotMatch(
    source,
    /#1\b|yellow|estrella|polygon/i,
    "no rank number, yellow or stars",
  );
});

test("ServiceTileArt offers one drawing per bento service", () => {
  const source = read(tileArtPath);
  for (const kind of [
    "seo-local",
    "diseno-web",
    "tienda-online",
    "software",
    "automatizaciones",
    "ia",
  ]) {
    assert.ok(source.includes(`"${kind}"`), `kind ${kind}`);
  }
  for (const cls of ["signal", "soft", "label"]) {
    assert.match(
      source,
      new RegExp(`class="[^"]*\\b${cls}\\b`),
      `uses .${cls}`,
    );
  }
  for (const label of [
    "correo",
    "hoja",
    "factura",
    "¿Abrís el sábado?",
    "Sí, de 10 a 14 h",
  ]) {
    assert.ok(source.includes(label), `label ${label}`);
  }
});
