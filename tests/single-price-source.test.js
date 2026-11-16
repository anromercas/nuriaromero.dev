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

// Prices of the service whose `slug` is `path`, read from the runtime data (so
// values built from constants are visible): `all` holds `pricing.from`,
// `pricing.initial.from` and every `pricing.tiers[].from`; `tiers` only the tiers.
const { services } = await import(
  new URL("../src/data/services.ts", import.meta.url)
);
const { STORE_FROM } = await import(
  new URL("../src/data/store-offer.ts", import.meta.url)
);

function dataPrices(path) {
  const page = services.find((s) => s.slug === path);
  if (!page) return null;
  const tiers = (page.pricing.tiers ?? [])
    .map((t) => toPrice(t.from))
    .filter(Boolean);
  const all = [page.pricing.from, page.pricing.initial?.from]
    .filter(Boolean)
    .map(toPrice)
    .filter(Boolean)
    .concat(tiers);
  return { all, tiers };
}

test("llms.txt: every ## Servicios URL maps to a service in services.ts", async () => {
  const llms = await source("public/llms.txt");
  const lines = llmsServiceLines(llms);
  assert.ok(lines.length > 0, "no se encontraron servicios en llms.txt");
  for (const { path } of lines) {
    assert.ok(
      dataPrices(path),
      `llms.txt lista ${path} pero ningún slug de services.ts coincide`,
    );
  }
});

test("llms.txt: every price listed for a service exists in its pricing in services.ts", async () => {
  const llms = await source("public/llms.txt");
  for (const { path, prices } of llmsServiceLines(llms)) {
    const data = dataPrices(path);
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
  const llms = await source("public/llms.txt");
  const lines = llmsServiceLines(llms);
  for (const path of ["/diseno-web-sevilla/", "/seo-local-sevilla/"]) {
    const line = lines.find((l) => l.path === path);
    assert.ok(line, `falta ${path} en la sección Servicios de llms.txt`);
    const data = dataPrices(path);
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

test("llms.txt: the store line follows the store offer source", async () => {
  const llms = await source("public/llms.txt");
  const line = llms
    .split("\n")
    .find((l) => l.includes("/tienda-online-sevilla/"));
  assert.ok(line, "falta la línea de la tienda en llms.txt");
  assert.ok(line.includes(`desde ${STORE_FROM}`), line);
  for (const word of [
    "panel de gestión",
    "WooCommerce",
    "Shopify",
    "a medida",
  ]) {
    assert.ok(line.includes(word), `${word}: ${line}`);
  }
  assert.doesNotMatch(line, /se presupuesta según el catálogo/);
});
