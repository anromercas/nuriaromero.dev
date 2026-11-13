import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";

const root = new URL("../", import.meta.url);
const scripts = JSON.parse(
  readFileSync(new URL("package.json", root), "utf8"),
).scripts;
const keys = Object.keys(scripts);

const checkNumbers = readdirSync(new URL("scripts/", root))
  .map((f) => f.match(/^check-seo-(\d+)\.mjs$/)?.[1])
  .filter(Boolean)
  .sort();

test("no script uses npm", () => {
  for (const [name, value] of Object.entries(scripts)) {
    assert.ok(!value.includes("npm run"), `${name} uses npm run`);
  }
});

test("every check-seo script file has pnpm and dist scripts", () => {
  assert.ok(checkNumbers.length > 0);
  for (const nn of checkNumbers) {
    assert.equal(
      scripts[`check:seo-${nn}`],
      `pnpm build && node scripts/check-seo-${nn}.mjs`,
    );
    assert.equal(
      scripts[`check:seo-${nn}:dist`],
      `node scripts/check-seo-${nn}.mjs`,
    );
  }
});

test("check:seo scripts are ordered, each followed by its :dist", () => {
  const seo = keys.filter((k) => k.startsWith("check:seo-"));
  const expected = checkNumbers.flatMap((nn) => [
    `check:seo-${nn}`,
    `check:seo-${nn}:dist`,
  ]);
  assert.deepEqual(seo, expected);
  assert.equal(keys[keys.length - 1], "check:capilar-local");
});
