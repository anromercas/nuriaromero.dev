import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

test("README exists and names the pipeline files", () => {
  const readme = read("seo/contenido/README.md");
  assert.match(readme, /tema\.md/);
  assert.match(readme, /esquema\.md/);
  assert.match(readme, /ideas\.json/);
});

test("README names every queue status", () => {
  const readme = read("seo/contenido/README.md");
  for (const status of [
    "propuesta",
    "aprobada",
    "rechazada",
    "en curso",
    "publicada",
  ]) {
    assert.ok(
      readme.includes(status),
      `status "${status}" missing from README`,
    );
  }
});

test("NRD-327 design records the storage decision", () => {
  const design = read("docs/designs/NRD-327-blog-content-pipeline.md");
  const line = design.split("\n").find((l) => l.startsWith("Storage decision"));
  assert.ok(line, "Storage decision line not found");
  assert.match(line, /seo\/contenido\//);
  assert.match(line, /NRD-345/);
});
