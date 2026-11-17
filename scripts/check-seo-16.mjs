// NRD-163: JSON-LD and heading outline of /seo-local-sevilla/ must match the
// baseline captured from the page before the section components were
// extracted. When a later story changes the reference page on purpose,
// regenerate the fixture in the same commit:
//   pnpm build && node scripts/check-seo-16.mjs --write
import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { headingOutline, jsonLdEntities } from "./lib/page-contract.mjs";

const page = new URL("../dist/seo-local-sevilla/index.html", import.meta.url);
const fixtureUrl = new URL(
  "../tests/fixtures/seo-local-sevilla.baseline.json",
  import.meta.url,
);

const html = await readFile(page, "utf8");
const current = {
  // WebPage is build-derived freshness (NRD-242): present or absent with the
  // build's version history, so it never belongs to the baseline.
  jsonld: jsonLdEntities(html).filter((e) => e["@type"] !== "WebPage"),
  headings: headingOutline(html),
};

if (process.argv.includes("--write")) {
  await writeFile(fixtureUrl, `${JSON.stringify(current, null, 2)}\n`);
  console.log("check-seo-16: baseline written");
} else {
  const baseline = JSON.parse(await readFile(fixtureUrl, "utf8"));
  assert.deepEqual(
    current.jsonld,
    baseline.jsonld,
    "JSON-LD differs from the baseline",
  );
  assert.deepEqual(
    current.headings,
    baseline.headings,
    "Heading outline differs from the baseline",
  );
  console.log("check-seo-16: JSON-LD and headings match the baseline");
}
