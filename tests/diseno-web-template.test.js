import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

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
