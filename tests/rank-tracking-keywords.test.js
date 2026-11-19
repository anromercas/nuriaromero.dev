import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { untrackedOwners } from "../scripts/lib/keyword-ownership.mjs";

const config = JSON.parse(
  await readFile(new URL("../.claude/harness.json", import.meta.url), "utf8"),
);
const { keywords, maxCallsPerRun } = config.seo.rankTracking;
const find = (keyword) => keywords.find((k) => k.keyword === keyword);

test('"diseño tienda online sevilla" is tracked for the shop page in group Diseño web', () => {
  const row = find("diseño tienda online sevilla");
  assert.ok(row, "keyword no encontrada");
  assert.equal(row.page, "/tienda-online-sevilla/");
  assert.equal(row.group, "Diseño web");
});

test('"tienda online sevilla" is only a navigational reference', () => {
  const row = find("tienda online sevilla");
  assert.ok(row, "keyword no encontrada");
  assert.equal(row.group, "Referencia (navegacional)");
});

test('"posicionamiento en ia" and "seo para ia" are tracked for /seo-para-ia/ in group GEO / IA', () => {
  for (const keyword of ["posicionamiento en ia", "seo para ia"]) {
    const row = find(keyword);
    assert.ok(row, `${keyword} no encontrada`);
    assert.equal(row.page, "/seo-para-ia/");
    assert.equal(row.group, "GEO / IA");
  }
});

test("untrackedOwners returns nothing when the owner term is tracked for its page", () => {
  assert.deepEqual(
    untrackedOwners(
      [{ keyword: "a", url: "/x/" }],
      [{ keyword: "a", page: "/x/" }],
    ),
    [],
  );
});

test("untrackedOwners reports an owner term absent from the tracked rows", () => {
  assert.deepEqual(untrackedOwners([{ keyword: "a", url: "/x/" }], []), [
    { keyword: "a", url: "/x/", trackedPage: null },
  ]);
});

test("untrackedOwners reports an owner term tracked for another page", () => {
  assert.deepEqual(
    untrackedOwners(
      [{ keyword: "a", url: "/x/" }],
      [{ keyword: "a", page: "/y/" }],
    ),
    [{ keyword: "a", url: "/x/", trackedPage: "/y/" }],
  );
});

test("every keywordOwners term is tracked for its owner page", async () => {
  const { keywordOwners } = await import(
    new URL("../src/data/seo-intents.ts", import.meta.url)
  );
  assert.ok(keywordOwners.length > 0);
  assert.deepEqual(untrackedOwners(keywordOwners, keywords), []);
});

test("keywords are unique and within maxCallsPerRun", () => {
  const names = keywords.map((k) => k.keyword);
  assert.equal(new Set(names).size, names.length);
  assert.ok(
    names.length <= maxCallsPerRun,
    `${names.length} > ${maxCallsPerRun}`,
  );
});
