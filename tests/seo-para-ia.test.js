import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

// --- Task 1.1: Service JSON-LD without an own offer (NRD-249) -----------------

test("serviceSchema accepts a missing price and spreads offers last only when present", () => {
  const source = read("src/lib/schema.ts");
  assert.match(source, /price\?: string/);
  assert.match(source, /\.\.\.\(offers \? \{ offers \} : \{\}\)/);
  assert.doesNotMatch(source, /\n\s+price: string\n/);
});

test("ServicePageData declares the ownOffer opt-out", () => {
  assert.match(read("src/data/types.ts"), /ownOffer\?: boolean/);
});

test("ServiceLayout passes no price when ownOffer is false", () => {
  assert.match(
    read("src/layouts/ServiceLayout.astro"),
    /price: page\.ownOffer === false \? undefined : page\.pricing\.from/,
  );
});

test("pricingTier is exported and tierFrom delegates to it", async () => {
  const source = read("src/data/services.ts");
  assert.match(source, /export function pricingTier\(/);
  assert.match(source, /return pricingTier\(service, tierName\)\.from/);
  const { seoLocal, pricingTier, tierFrom } = await import(
    new URL("src/data/services.ts", root).href
  );
  assert.equal(tierFrom(seoLocal, "Local Pro"), "500 €/mes + IVA");
  assert.equal(pricingTier(seoLocal, "Local Pro").from, "500 €/mes + IVA");
  assert.throws(() => pricingTier(seoLocal, "Nope"), /not found/);
});
