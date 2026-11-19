import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const { keywordOwners } = await import(
  new URL("../src/data/seo-intents.ts", import.meta.url)
);
const doc = await readFile(
  new URL("../docs/seo-audit/measurement-seo.md", import.meta.url),
  "utf8",
);

function iterationSection() {
  const start = doc.search(/^## Revisión de iteración\s*$/m);
  if (start === -1) return null;
  const rest = doc.slice(start + 1);
  const next = rest.search(/^## /m);
  return next === -1 ? rest : rest.slice(0, next);
}

test("the measurement document has a Revisión de iteración section", () => {
  assert.ok(iterationSection(), "falta la sección ## Revisión de iteración");
});

test("the section names every owner page URL in backticks and the required sources", () => {
  const section = iterationSection();
  assert.ok(section, "falta la sección");
  for (const url of new Set(keywordOwners.map((o) => o.url))) {
    assert.ok(section.includes(`\`${url}\``), `falta ${url}`);
  }
  for (const source of [
    "seo/ranks/history.jsonl",
    "contact_click",
    "contact_method=booking",
  ]) {
    assert.ok(section.includes(source), `falta ${source}`);
  }
});

test("the section states cadence, template fields, decision vocabulary and the control step", () => {
  const section = iterationSection();
  assert.ok(section, "falta la sección");
  const lower = section.toLowerCase();
  for (const word of ["mantener", "ajustar", "escalar", "28 días"]) {
    assert.ok(lower.includes(word), `falta ${word}`);
  }
  for (const name of ["seo.rankTracking.keywords", "keywordOwners"]) {
    assert.ok(section.includes(name), `falta ${name}`);
  }
  assert.match(section, /```text[\s\S]*?```/);
});
