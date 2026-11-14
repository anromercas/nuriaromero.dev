import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const readSource = (path) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8");

async function expectedUrl() {
  const src = await readSource("src/data/local-trust.ts");
  const placeId = src.match(/const GBP_PLACE_ID = ["']([^"']+)["']/)?.[1];
  assert.ok(placeId, "GBP_PLACE_ID found in local-trust.ts");
  return `https://search.google.com/local/writereview?placeid=${placeId}`;
}

test("review request template uses the current write-review URL in email and WhatsApp", async () => {
  const url = await expectedUrl();
  const doc = await readSource("docs/google-review-request-template.md");

  assert.ok(
    doc.split(url).length - 1 >= 2,
    "the exact URL appears at least twice",
  );

  const urls =
    doc.match(
      /https:\/\/search\.google\.com\/local\/writereview\?placeid=[^\s)>`]+/g,
    ) ?? [];
  assert.deepEqual([...new Set(urls)], [url], "no other writereview URL");
});

test("review request template has email and WhatsApp sections in Spanish", async () => {
  const doc = await readSource("docs/google-review-request-template.md");

  assert.match(doc, /^##\s+Plantilla de email/m);
  assert.match(doc, /^##\s+Plantilla de WhatsApp/m);
  assert.match(doc, /^##\s+Reglas de Google/m);
});

test("review request template offers no incentive", async () => {
  const doc = await readSource("docs/google-review-request-template.md");
  const templates = doc.split(/^##\s+Reglas de Google/m)[0];

  assert.doesNotMatch(templates, /descuento|regalo|sorteo|a cambio/i);
});
