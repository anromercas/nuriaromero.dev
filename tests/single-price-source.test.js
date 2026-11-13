import test from "node:test";
import assert from "node:assert/strict";
import {
  source,
  localTierFrom,
  homeDescriptionTemplate,
  renderedHomeDescription,
} from "./helpers/home-description.js";

const EXPRESSION = '${tierFrom(seoLocal, "Local")}';
const EXPECTED_DESCRIPTION =
  "Consultor SEO en Sevilla para negocios locales: aparece en Google, Maps y en las respuestas de IA. SEO local desde 300 €/mes + IVA y trato directo.";

test("services.ts exports the tierFrom helper", async () => {
  const servicesSrc = await source("src/data/services.ts");
  assert.match(servicesSrc, /export function tierFrom\(/);
});

test("home description is a template built from the Local tier of seoLocal", async () => {
  const home = await source("src/pages/index.astro");
  const template = homeDescriptionTemplate(home);
  assert.ok(
    template,
    'no se encontró "const homeDescription = `...`" en index.astro',
  );
  assert.ok(
    template.includes(EXPRESSION),
    `la plantilla debe contener ${EXPRESSION}`,
  );
  assert.doesNotMatch(
    template.replace(EXPRESSION, ""),
    /€/,
    "la plantilla no debe llevar importes en € literales",
  );
  assert.match(
    home,
    /import\s*\{[^}]*\btierFrom\b[^}]*\}\s*from\s*"@\/data\/services"/,
  );
});

test("home description renders identical to the published text and stays within 160 chars", async () => {
  const description = await renderedHomeDescription();
  assert.equal(description, EXPECTED_DESCRIPTION);
  assert.ok(
    description.length <= 160,
    `la description mide ${description.length} caracteres`,
  );
});

test("home Layout receives homeDescription", async () => {
  const home = await source("src/pages/index.astro");
  assert.match(
    home,
    /<Layout\s+title="[^"]+"\s+description=\{homeDescription\}/,
  );
});

test("Local tier value is read from data (not Local Pro)", async () => {
  const servicesSrc = await source("src/data/services.ts");
  assert.equal(localTierFrom(servicesSrc), "300 €/mes + IVA");
});

// ---- llms.txt prices vs src/data/services.ts ----

const PRICE = /(\d+(?:\.\d{3})*)\s?€(\s?\/mes)?/g;
const priceKey = ({ amount, monthly }) => `${amount} €${monthly ? "/mes" : ""}`;
const toPrice = (label) => {
  const m = [...label.matchAll(PRICE)][0];
  return m ? { amount: m[1], monthly: Boolean(m[2]) } : null;
};

function servicesSection(llms) {
  const start = llms.indexOf("## Servicios");
  assert.notEqual(start, -1, 'falta la sección "## Servicios" en llms.txt');
  const rest = llms.slice(start + "## Servicios".length);
  const end = rest.search(/\n## /);
  return end === -1 ? rest : rest.slice(0, end);
}

function llmsServiceLines(llms) {
  return servicesSection(llms)
    .split("\n")
    .map((line) => ({
      line,
      path: line.match(/https:\/\/nuriaromero\.dev(\/[^)]+)/)?.[1],
    }))
    .filter((l) => l.path)
    .map(({ line, path }) => ({
      path,
      prices: [...line.matchAll(PRICE)].map((m) => ({
        amount: m[1],
        monthly: Boolean(m[2]),
      })),
    }));
}

// Prices of the service block whose top-level `slug` is `path`:
// all `from` values of `pricing` (all) and only those of `pricing.tiers` (tiers).
function dataPrices(servicesSrc, path) {
  const blocks = servicesSrc.split(/\nexport const /).slice(1);
  const block = blocks.find((b) => b.includes(`\n  slug: "${path}"`));
  if (!block) return null;
  const pricing =
    block.match(/\n {2}pricing: \{([\s\S]*?)\n {2}\},/)?.[1] ?? "";
  const froms = (text) =>
    [...text.matchAll(/from:\s*"([^"]+)"/g)]
      .map((m) => toPrice(m[1]))
      .filter(Boolean);
  const tiersText = pricing.match(/tiers:\s*\[([\s\S]*)\]/)?.[1] ?? "";
  return { all: froms(pricing), tiers: froms(tiersText) };
}

test("llms.txt: every ## Servicios URL maps to a service in services.ts", async () => {
  const [llms, servicesSrc] = await Promise.all([
    source("public/llms.txt"),
    source("src/data/services.ts"),
  ]);
  const lines = llmsServiceLines(llms);
  assert.ok(lines.length > 0, "no se encontraron servicios en llms.txt");
  for (const { path } of lines) {
    assert.ok(
      dataPrices(servicesSrc, path),
      `llms.txt lista ${path} pero ningún slug de services.ts coincide`,
    );
  }
});

test("llms.txt: every price listed for a service exists in its pricing in services.ts", async () => {
  const [llms, servicesSrc] = await Promise.all([
    source("public/llms.txt"),
    source("src/data/services.ts"),
  ]);
  for (const { path, prices } of llmsServiceLines(llms)) {
    const data = dataPrices(servicesSrc, path);
    if (!data) continue; // reported by the slug test
    const known = new Set(data.all.map(priceKey));
    for (const p of prices) {
      assert.ok(
        known.has(priceKey(p)),
        `${path}: llms.txt lista "${priceKey(p)}" que no está en services.ts (${[...known].join(", ")})`,
      );
    }
  }
});

test("llms.txt: diseño web and SEO local list all their tier prices", async () => {
  const [llms, servicesSrc] = await Promise.all([
    source("public/llms.txt"),
    source("src/data/services.ts"),
  ]);
  const lines = llmsServiceLines(llms);
  for (const path of ["/diseno-web-sevilla/", "/seo-local-sevilla/"]) {
    const line = lines.find((l) => l.path === path);
    assert.ok(line, `falta ${path} en la sección Servicios de llms.txt`);
    const data = dataPrices(servicesSrc, path);
    assert.ok(
      data && data.tiers.length > 0,
      `${path}: sin tiers en services.ts`,
    );
    const listed = new Set(line.prices.map(priceKey));
    for (const tier of data.tiers) {
      assert.ok(
        listed.has(priceKey(tier)),
        `${path}: llms.txt no lista el precio "${priceKey(tier)}" de services.ts`,
      );
    }
  }
});
