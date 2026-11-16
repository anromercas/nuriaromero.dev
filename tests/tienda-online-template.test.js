import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

const { STORE_FROM, storeOptions, storeTiers } = await import(
  new URL("../src/data/store-offer.ts", import.meta.url)
);

// --- Task 1.1: store options as plans and shared plan layout (NRD-201) ------

test("every store option has bestFor, tradeOff and panel without digits", () => {
  assert.equal(storeOptions.length, 3);
  for (const o of storeOptions) {
    for (const key of ["bestFor", "tradeOff", "panel"]) {
      assert.ok(
        typeof o[key] === "string" && o[key].trim().length > 0,
        `${o.id}.${key}`,
      );
      assert.doesNotMatch(o[key], /\d/, `${o.id}.${key} has no digit`);
      assert.doesNotMatch(o[key], /€/, `${o.id}.${key} has no euro literal`);
    }
  }
});

test("storeTiers: one tier per option at the shared price, no recommendation", () => {
  assert.equal(storeTiers.length, storeOptions.length);
  storeTiers.forEach((tier, i) => {
    const o = storeOptions[i];
    assert.equal(tier.name, o.name);
    assert.equal(tier.from, STORE_FROM);
    assert.deepEqual(tier.includes, [o.panel]);
    assert.equal(tier.note, o.recurringCost);
    assert.ok(!tier.recommended, "no recommended tier");
    assert.equal("example" in tier, false, "example is not on a card");
  });
});

test("SeoLocalPlans gains additive one-plan and three-plan rules", () => {
  const css = read("src/components/seo-local/SeoLocalPlans.astro");
  assert.match(css, /\.plan-list:has\(> \.plan:only-child\)/);
  assert.match(css, /\.plan-list:has\(> \.plan:nth-child\(3\):last-child\)/);
  const only = css.match(
    /\.plan-list:has\(> \.plan:only-child\)\s*\{([^}]*)\}/,
  );
  assert.ok(only, "only-child rule block");
  assert.match(only[1], /grid-template-columns:\s*minmax\(0,\s*1fr\)/);
  assert.match(only[1], /max-width:\s*36rem/);
  assert.match(only[1], /margin-inline:\s*0/);
  const three = css.match(
    /@media \(min-width: 1024px\)\s*\{[^@]*?nth-child\(3\):last-child\)\s*\{([^}]*)\}/s,
  );
  assert.ok(three, "three-plan rule from 1024px");
  assert.match(
    three[1],
    /grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/,
  );
  assert.match(three[1], /max-width:\s*none/);
});

test("SeoLocalPlans markup equals the baseline (style-only change)", () => {
  const source = read("src/components/seo-local/SeoLocalPlans.astro");
  const markup = source
    .slice(0, source.indexOf("<style>"))
    .replace(/\s(class|class:list)=(\{[^}]*\}|"[^"]*")/g, "")
    .replace(/\s+/g, " ")
    .trim();
  assert.equal(
    markup,
    read("tests/fixtures/seo-local-plans.markup.txt").trim(),
  );
});
