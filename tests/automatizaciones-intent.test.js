import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { normaliseTerm } from "../scripts/lib/keyword-ownership.mjs";

const source = (path) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8");

const worksProcess = (text) => {
  const t = normaliseTerm(text);
  return t.includes("automatizacion de procesos") && t.includes("sevilla");
};

const string = (src, pattern, label) => {
  const m = src.match(pattern);
  assert.ok(m, `no se encontró ${label}`);
  return m[1];
};

// Slice of services.ts that belongs to `export const automatizaciones` (up to the next export).
async function automatizacionesBlock() {
  const src = await source("src/data/services.ts");
  const start = src.indexOf("export const automatizaciones");
  assert.ok(start >= 0, "no se encontró automatizaciones en services.ts");
  const next = src.indexOf("\nexport const", start + 1);
  return src.slice(start, next === -1 ? undefined : next);
}

async function copy() {
  const block = await automatizacionesBlock();
  return {
    block,
    title: string(
      block,
      /seo:\s*\{\s*title:\s*"((?:\\.|[^"\\])*)"/,
      "seo.title",
    ),
    description: string(
      block,
      /description:\s*"((?:\\.|[^"\\])*)"/,
      "seo.description",
    ),
    h1: string(block, /hero:\s*\{\s*h1:\s*"((?:\\.|[^"\\])*)"/, "hero.h1"),
  };
}

test("title works automatización de procesos en Sevilla within 65 characters", async () => {
  const { title } = await copy();
  assert.ok(worksProcess(title), `el title no trabaja la variante: ${title}`);
  assert.ok(title.length <= 65, `title de ${title.length} caracteres`);
});

test("H1 works automatización de procesos en Sevilla", async () => {
  const { h1 } = await copy();
  assert.ok(worksProcess(h1), `el H1 no trabaja la variante: ${h1}`);
});

test("description works the variant within 160 characters and keeps años de experiencia", async () => {
  const { description } = await copy();
  assert.ok(
    worksProcess(description),
    `la description no trabaja la variante: ${description}`,
  );
  assert.ok(
    description.length <= 160,
    `description de ${description.length} caracteres`,
  );
  assert.ok(description.includes("años de experiencia"));
});

test("the published price and the llms.txt entry are untouched", async () => {
  const { block } = await copy();
  assert.match(block, /pricing:\s*\{\s*from:\s*"149 €"/);
  const llms = await source("public/llms.txt");
  const line = llms
    .split("\n")
    .find((l) => l.includes("https://nuriaromero.dev/automatizaciones/"));
  assert.ok(line, "falta la línea de automatizaciones en llms.txt");
});

test("the intentMatrix row follows the copy and no keywordOwners row exists", async () => {
  const { intentMatrix, keywordOwners = [] } = await import(
    new URL("../src/data/seo-intents.ts", import.meta.url)
  );
  const row = intentMatrix.find((r) => r.url === "/automatizaciones/");
  assert.ok(row, "falta la fila /automatizaciones/ en intentMatrix");
  for (const key of ["titleSignal", "descriptionSignal", "h1Signal"]) {
    assert.equal(row[key], "Automatización de procesos en Sevilla", key);
  }
  assert.ok(
    keywordOwners.every((o) => o.url !== "/automatizaciones/"),
    "no debe haber keywordOwners para /automatizaciones/",
  );
});
