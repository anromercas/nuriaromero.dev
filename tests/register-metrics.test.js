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
    "Fecha de captura: 2026-11-20",
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

const sourced = (heading, fuente, fecha, eol = "\n") =>
  [heading, "", fuente, fecha, "", "Hay 5 backlinks.", ""].join(eol);

test("reports metrics when Fuente has an empty value", () => {
  const md = sourced(
    "## Línea base 2026-11-14",
    "Fuente:",
    "Fecha de captura: 2026-11-14",
  );
  assert.equal(findUnsourcedMetrics(md).length, 1);
});

test("reports metrics when Fecha de captura has an empty value", () => {
  const md = sourced(
    "## Línea base 2026-11-14",
    "Fuente: DataForSEO",
    "Fecha de captura:",
  );
  assert.equal(findUnsourcedMetrics(md).length, 1);
});

test("reports metrics when the capture date is not a real calendar date", () => {
  const md = sourced(
    "## Línea base 2026-11-14",
    "Fuente: DataForSEO",
    "Fecha de captura: 2099-99-99",
  );
  assert.equal(findUnsourcedMetrics(md).length, 1);
});

test("reports metrics when the heading date is not a real calendar date", () => {
  const md = sourced(
    "## Línea base 2026-13-45",
    "Fuente: DataForSEO",
    "Fecha de captura: 2026-11-14",
  );
  assert.equal(findUnsourcedMetrics(md).length, 1);
});

test("accepts a valid sourced section with CRLF line endings", () => {
  const md = sourced(
    "## Línea base 2026-11-14",
    "Fuente: DataForSEO",
    "Fecha de captura: 2026-11-14",
    "\r\n",
  );
  assert.deepEqual(findUnsourcedMetrics(md), []);
});

test("reports an empty Fuente with CRLF line endings", () => {
  const md = sourced(
    "## Línea base 2026-11-14",
    "Fuente:",
    "Fecha de captura: 2026-11-14",
    "\r\n",
  );
  assert.equal(findUnsourcedMetrics(md).length, 1);
});

test("reports a metric in preamble text before the first heading", () => {
  const md = "Resumen: 12 backlinks.\n\n## Otra\n\nsin métricas\n";
  const found = findUnsourcedMetrics(md);
  assert.equal(found.length, 1);
  assert.equal(found[0].section, "");
});

test("the current register reports nothing", async () => {
  const markdown = await readFile(
    "docs/seo-audit/authority-backlink-register.md",
    "utf8",
  );
  assert.deepEqual(findUnsourcedMetrics(markdown), []);
});
