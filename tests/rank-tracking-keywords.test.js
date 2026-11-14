import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

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

test("keywords are unique and within maxCallsPerRun", () => {
  const names = keywords.map((k) => k.keyword);
  assert.equal(new Set(names).size, names.length);
  assert.ok(
    names.length <= maxCallsPerRun,
    `${names.length} > ${maxCallsPerRun}`,
  );
});
