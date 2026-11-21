import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { parseOutline, lintOutline } from "../scripts/lib/outline-lint.mjs";

const dir = new URL("./fixtures/blog-pipeline/", import.meta.url);
const fixture = (name) => readFileSync(new URL(name, dir), "utf8");
const path = (name) => new URL(name, dir).pathname;

test("a complete outline passes", () => {
  assert.deepEqual(lintOutline(fixture("esquema-ok.md")), {
    ok: true,
    errors: [],
  });
});

test("parseOutline reads slug, target, status and lists", () => {
  const o = parseOutline(fixture("esquema-ok.md"));
  assert.equal(o.slug, "que-es-una-ficha-de-google");
  assert.equal(o.keyword, "que es una ficha de google");
  assert.equal(o.question, "¿Qué es una ficha de Google?");
  assert.equal(o.wordTarget, 900);
  assert.equal(o.status, "pendiente de aprobación");
  assert.equal(o.h1.length, 1);
  assert.equal(o.h2.length, 3);
  assert.equal(o.sources.length, 2);
  assert.match(o.directAnswer, /perfil gratuito/);
});

for (const [file, pattern] of [
  ["esquema-two-h1.md", /exactly one H1/],
  ["esquema-no-h1.md", /missing H1/],
  ["esquema-no-h2.md", /H2/],
  ["esquema-no-target.md", /Objetivo de palabras/],
  ["esquema-no-sources.md", /Fuentes/],
  ["esquema-no-answer.md", /Respuesta directa/],
]) {
  test(`${file} fails with its error`, () => {
    const r = lintOutline(fixture(file));
    assert.equal(r.ok, false);
    assert.ok(
      r.errors.some((e) => pattern.test(e)),
      r.errors.join("|"),
    );
  });
}

test("a # line inside a fenced block is not an H1", () => {
  const md = fixture("esquema-ok.md").replace(
    "## Palabras clave secundarias",
    "```bash\n# comentario\n```\n\n## Palabras clave secundarias",
  );
  assert.equal(lintOutline(md).ok, true);
  assert.equal(parseOutline(md).h1.length, 1);
});

test("a non-positive or non-integer word target fails", () => {
  const md = fixture("esquema-ok.md").replace(
    "Objetivo de palabras: 900",
    "Objetivo de palabras: 0",
  );
  assert.equal(lintOutline(md).ok, false);
  assert.equal(parseOutline(md).wordTarget, null);
});

test("a source without URL or repository path fails", () => {
  const md = fixture("esquema-ok.md").replace(
    /## Fuentes[\s\S]*$/,
    "## Fuentes\n\n- una web cualquiera\n",
  );
  assert.equal(lintOutline(md).ok, false);
});

test("CLI exits 0 on a valid outline", () => {
  const r = spawnSync(process.execPath, [
    "scripts/blog-outline-lint.mjs",
    path("esquema-ok.md"),
  ]);
  assert.equal(r.status, 0);
  assert.match(r.stdout.toString(), /^blog-outline-lint: OK /);
});

test("CLI exits 1 and lists every error", () => {
  const r = spawnSync(process.execPath, [
    "scripts/blog-outline-lint.mjs",
    path("esquema-no-sources.md"),
  ]);
  assert.equal(r.status, 1);
  assert.match(
    r.stderr.toString() + r.stdout.toString(),
    /blog-outline-lint: /,
  );
});

test("CLI exits 2 on usage errors", () => {
  const r = spawnSync(process.execPath, ["scripts/blog-outline-lint.mjs"]);
  assert.equal(r.status, 2);
});
