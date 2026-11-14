import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const readSource = (path) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8");

const literal = (src, key) =>
  src.match(new RegExp(`\\b${key}:\\s*"([^"]*)"`))?.[1];

test("local-trust publicAddress reads SITE.address.full instead of a literal", async () => {
  const src = await readSource("src/data/local-trust.ts");

  assert.match(src, /import \{ SITE \} from ["']\.\/site(?:\.ts)?["']/);
  assert.match(src, /publicAddress:\s*SITE\.address\.full\b/);
  assert.doesNotMatch(src, /Camino Andaluc/);
});

test("footer renders NAP and service area from data, with no literals", async () => {
  const src = await readSource("src/components/Footer.astro");

  assert.match(
    src,
    /import \{ localTrust \} from ["']@\/data\/local-trust["']/,
  );
  assert.match(src, /\{SITE\.name\}/);
  assert.match(src, /\{SITE\.address\.full\}/);
  assert.match(src, /\{localTrust\.gbp\.serviceArea\}/);
  assert.match(src, /href=\{`tel:\+\$\{SITE\.whatsapp\}`\}/);
  assert.match(src, /\{SITE\.phone\}/);

  assert.doesNotMatch(src, /área metropolitana/i);
  assert.doesNotMatch(src, /Camino Andaluc|La Rinconada|41309/);
  assert.doesNotMatch(src, /611 ?812 ?431|34611812431/);
});

test("SITE.address.full equals the parts used by localBusinessSchema", async () => {
  const site = await readSource("src/data/site.ts");
  const schema = await readSource("src/lib/schema.ts");

  const street = literal(site, "street");
  const postalCode = literal(site, "postalCode");
  const municipality = literal(site, "municipality");
  const region = literal(site, "region");
  const full = literal(site, "full");

  assert.ok(street && postalCode && municipality && region && full);
  assert.equal(full, `${street}, ${postalCode} ${municipality}, ${region}`);

  assert.match(schema, /streetAddress:\s*SITE\.address\.street/);
  assert.match(schema, /postalCode:\s*SITE\.address\.postalCode/);
  assert.match(schema, /addressLocality:\s*SITE\.address\.municipality/);
  assert.match(schema, /addressRegion:\s*SITE\.address\.region/);
});
