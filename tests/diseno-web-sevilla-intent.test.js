import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { normaliseTerm } from "../scripts/lib/keyword-ownership.mjs";

const source = (path) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8");

const worksPhrase = (text, term) =>
  normaliseTerm(text).includes(normaliseTerm(term));
const carriesVariant = (text) =>
  /\bdisenadora? web\b/.test(normaliseTerm(text)) &&
  normaliseTerm(text).includes("sevilla");

const string = (src, pattern, label) => {
  const m = src.match(pattern);
  assert.ok(m, `no se encontró ${label}`);
  return m[1];
};

// Slice of services.ts that belongs to `export const disenoWeb` (up to the next export).
async function disenoWebBlock() {
  const src = await source("src/data/services.ts");
  const start = src.indexOf("export const disenoWeb");
  assert.ok(start >= 0, "no se encontró disenoWeb en services.ts");
  const next = src.indexOf("\nexport const", start + 1);
  return src.slice(start, next === -1 ? undefined : next);
}

async function copy() {
  const block = await disenoWebBlock();
  const title = string(
    block,
    /seo:\s*\{\s*title:\s*"((?:\\.|[^"\\])*)"/,
    "seo.title",
  );
  const h1 = string(block, /hero:\s*\{\s*h1:\s*"((?:\\.|[^"\\])*)"/, "hero.h1");
  const titlesBlock = string(
    block,
    /sectionTitles:\s*\{([\s\S]*?)\n\s*\},/,
    "sectionTitles",
  );
  const sectionTitles = [
    ...titlesBlock.matchAll(/(\w+):\s*"((?:\\.|[^"\\])*)"/g),
  ].map((m) => ({
    key: m[1],
    text: m[2],
  }));
  return { block, title, h1, sectionTitles };
}

test('disenoWeb title works "diseño web sevilla", carries the variant, keeps the price and fits 65 chars', async () => {
  const { title } = await copy();
  assert.ok(
    worksPhrase(title, "diseño web sevilla"),
    `title sin "diseño web sevilla": ${title}`,
  );
  assert.ok(
    carriesVariant(title),
    `title sin variante "diseñadora web" + Sevilla: ${title}`,
  );
  assert.ok(
    title.includes("desde 149 €"),
    `title debe conservar "desde 149 €": ${title}`,
  );
  assert.ok(
    title.length <= 65,
    `title mide ${title.length} caracteres (límite 65)`,
  );
});

test('disenoWeb H1 works "diseño web sevilla"', async () => {
  const { h1 } = await copy();
  assert.ok(
    worksPhrase(h1, "diseño web sevilla"),
    `H1 sin "diseño web sevilla": ${h1}`,
  );
});

test("exactly one disenoWeb section title (benefits) carries the variant", async () => {
  const { sectionTitles } = await copy();
  const carrying = sectionTitles.filter((s) => carriesVariant(s.text));
  assert.equal(
    carrying.length,
    1,
    `H2 con variante: ${carrying.map((s) => s.key).join(", ") || "ninguno"}`,
  );
  assert.equal(carrying[0].key, "benefits");
  assert.equal(
    carrying[0].text,
    "Diseñadora web en Sevilla que programa tu página, sin plantillas",
  );
});

test("seo-intents registry row follows the new copy", async () => {
  const { title, h1, sectionTitles } = await copy();
  const intents = await source("src/data/seo-intents.ts");
  const start = intents.indexOf('url: "/diseno-web-sevilla/"');
  assert.ok(start >= 0);
  const row = intents.slice(start, intents.indexOf("\n  },", start));
  const titleSignal = string(row, /titleSignal:\s*"([^"]+)"/, "titleSignal");
  const h1Signal = string(row, /h1Signal:\s*"([^"]+)"/, "h1Signal");
  assert.equal(titleSignal, "Diseño web Sevilla");
  assert.equal(h1Signal, "Diseño web Sevilla para negocios");
  assert.ok(title.includes(titleSignal));
  assert.ok(h1.includes(h1Signal));
  const benefits = sectionTitles.find((s) => s.key === "benefits").text;
  assert.ok(
    row.includes(`"${benefits}"`),
    "contentSignals debe incluir el H2 de beneficios",
  );
  assert.ok(row.includes("Así es el proceso de crear tu página web"));
  assert.ok(row.includes("Preguntas frecuentes sobre diseño web en Sevilla"));
});

test("software intent is not targeted by title, H1 or section titles of the page", async () => {
  const { title, h1, sectionTitles } = await copy();
  for (const text of [title, h1, ...sectionTitles.map((s) => s.text)]) {
    assert.ok(
      !worksPhrase(text, "aplicaciones web a medida"),
      `trabaja "aplicaciones web a medida": ${text}`,
    );
    assert.ok(
      !worksPhrase(text, "software a medida"),
      `trabaja "software a medida": ${text}`,
    );
  }
});

test("internal links keep the software and portfolio rows of /diseno-web-sevilla/", async () => {
  const links = await source("src/data/internal-links.ts");
  const start = links.indexOf('"/diseno-web-sevilla/": [');
  assert.ok(start >= 0, "no se encontró la fila de /diseno-web-sevilla/");
  const row = links.slice(start, links.indexOf("\n  ],", start));
  assert.match(row, /path: "\/desarrollo-software-medida\/"/);
  assert.match(row, /path: "\/portfolio\/"/);
});

test("prices stay untouched: title 149 € and llms.txt line keeps 149 € and 399 €", async () => {
  const llms = await source("public/llms.txt");
  const line = llms
    .split("\n")
    .find((l) => l.includes("https://nuriaromero.dev/diseno-web-sevilla/"));
  assert.ok(line, "llms.txt sin la línea de /diseno-web-sevilla/");
  assert.ok(line.includes("149 €") && line.includes("399 €"));
  const { title } = await copy();
  assert.ok(title.includes("desde 149 €"));
});
