import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { findUnsourcedMetrics } from "../scripts/lib/register-metrics.mjs";

test("reports a metric that sits outside a dated baseline section", () => {
  const markdown = "# Registro\n\nHay 26 dominios referentes en total.\n";
  const found = findUnsourcedMetrics(markdown);
  assert.equal(found.length, 1);
  assert.match(found[0].match, /26 dominios referentes/i);
});

test("allows metrics inside a dated section with Fuente and Fecha de captura", () => {
  const markdown = [
    "# Registro",
    "",
    "## Línea base 2026-11-20 (DataForSEO)",
    "",
    "Fuente: DataForSEO Backlinks API",
    "Fecha de captura: 2026-11-20",
    "",
    "Hay 26 dominios referentes y 120 backlinks. DR: 12",
    "",
  ].join("\n");
  assert.deepEqual(findUnsourcedMetrics(markdown), []);
});

test("reports metrics in a dated section that lacks Fuente", () => {
  const markdown = [
    "## Línea base 2026-11-20",
    "",
    "Fecha de captura: 2026-11-20",
    "",
    "Hay 26 dominios referentes.",
    "",
  ].join("\n");
  assert.equal(findUnsourcedMetrics(markdown).length, 1);
});

test("reports metrics in a dated section that lacks Fecha de captura", () => {
  const markdown = [
    "## Línea base 2026-11-20",
    "",
    "Fuente: DataForSEO",
    "",
    "Hay 5 backlinks.",
    "",
  ].join("\n");
  assert.equal(findUnsourcedMetrics(markdown).length, 1);
});

test("does not treat an undated baseline heading as sourced", () => {
  const markdown = [
    "## Línea base antes de cualquier campaña",
    "",
    "Fuente: x",
    "Fecha de captura: y",
    "",
    "DA: 30",
    "",
  ].join("\n");
  assert.equal(findUnsourcedMetrics(markdown).length, 1);
});

test("a sourced section does not leak into the next section", () => {
  const markdown = [
    "## Línea base 2026-11-20",
    "Fuente: a",
    "Fecha de captura: b",
    "3 backlinks",
    "",
    "## Otra sección",
    "7 backlinks",
    "",
  ].join("\n");
  const found = findUnsourcedMetrics(markdown);
  assert.equal(found.length, 1);
  assert.equal(found[0].section, "## Otra sección");
});

test("the current register reports nothing", async () => {
  const markdown = await readFile(
    "docs/seo-audit/authority-backlink-register.md",
    "utf8",
  );
  assert.deepEqual(findUnsourcedMetrics(markdown), []);
});
