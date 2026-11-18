import test from "node:test";
import assert from "node:assert/strict";
import { normaliseTerm } from "../scripts/lib/keyword-ownership.mjs";

const { inteligenciaArtificial } = await import(
  new URL("../src/data/services.ts", import.meta.url)
);
const { internalLinksBySource } = await import(
  new URL("../src/data/internal-links.ts", import.meta.url)
);
const { intentMatrix, reciprocalLinks } = await import(
  new URL("../src/data/seo-intents.ts", import.meta.url)
);

const URL_PATH = "/inteligencia-artificial/";

const worksTerm = (text) => {
  const t = normaliseTerm(text);
  return ["inteligencia artificial", "empresas", "sevilla"].every((p) =>
    t.includes(p),
  );
};

test("title works inteligencia artificial para empresas sevilla and stays within 65 chars", () => {
  const { title } = inteligenciaArtificial.seo;
  assert.equal(
    title,
    "Inteligencia artificial para empresas en Sevilla | Chatbots",
  );
  assert.ok(worksTerm(title), title);
  assert.ok(title.length <= 65, `${title.length} chars`);
});

test("H1 works the term and keeps the word budget at 6 words", () => {
  const { h1 } = inteligenciaArtificial.hero;
  assert.equal(h1, "Inteligencia artificial para empresas en Sevilla");
  assert.ok(worksTerm(h1), h1);
  assert.equal(h1.split(/\s+/).length, 6);
});

test("description works the term, keeps años de experiencia and stays within 160 chars", () => {
  const { description } = inteligenciaArtificial.seo;
  assert.ok(worksTerm(description), description);
  assert.ok(description.includes("años de experiencia"), description);
  assert.ok(description.includes("chatbots que atienden clientes"));
  assert.ok(description.length <= 160, `${description.length} chars`);
});

test("intentMatrix row follows the copy", () => {
  const row = intentMatrix.find((r) => r.url === URL_PATH);
  assert.ok(row, "intentMatrix row exists");
  assert.ok(
    inteligenciaArtificial.hero.h1.includes(row.h1Signal),
    `${row.h1Signal} in ${inteligenciaArtificial.hero.h1}`,
  );
  assert.ok(worksTerm(row.h1Signal), row.h1Signal);
  assert.ok(inteligenciaArtificial.seo.title.includes(row.titleSignal));
  assert.ok(worksTerm(row.titleSignal), row.titleSignal);
  assert.ok(
    inteligenciaArtificial.seo.description.includes(row.descriptionSignal),
  );
});

test("the link to the software page holds", () => {
  const links = internalLinksBySource[URL_PATH] ?? [];
  assert.ok(
    links.some((l) => l.path === "/desarrollo-software-medida/"),
    "IA page links to /desarrollo-software-medida/",
  );
});

test("reciprocal pair with /automatizaciones/ holds", () => {
  const pair = reciprocalLinks.find(
    (r) => r.source === "/automatizaciones/" && r.target === URL_PATH,
  );
  assert.ok(pair, "reciprocal pair exists");
  assert.ok(
    internalLinksBySource["/automatizaciones/"].some(
      (l) => l.path === URL_PATH && l.anchor === pair.sourceAnchor,
    ),
  );
  assert.ok(
    internalLinksBySource[URL_PATH].some(
      (l) => l.path === "/automatizaciones/" && l.anchor === pair.targetAnchor,
    ),
  );
});
