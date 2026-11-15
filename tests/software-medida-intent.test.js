import test from "node:test";
import assert from "node:assert/strict";
import { normaliseTerm } from "../scripts/lib/keyword-ownership.mjs";

const { desarrolloSoftware } = await import(
  new URL("../src/data/services.ts", import.meta.url)
);
const { internalLinksBySource } = await import(
  new URL("../src/data/internal-links.ts", import.meta.url)
);
const { intentMatrix, reciprocalLinks } = await import(
  new URL("../src/data/seo-intents.ts", import.meta.url)
);

const URL_PATH = "/desarrollo-software-medida/";

const worksTerm = (text) => {
  const t = normaliseTerm(text);
  return (
    t.includes("desarrollo de software") &&
    t.includes("a medida") &&
    t.includes("sevilla")
  );
};

test("title works desarrollo de software a medida sevilla and stays within 65 chars", () => {
  const { title } = desarrolloSoftware.seo;
  assert.equal(
    title,
    "Desarrollo de software a medida en Sevilla | Aplicaciones web",
  );
  assert.ok(worksTerm(title), title);
  assert.ok(title.length <= 65, `${title.length} chars`);
});

test("H1 works desarrollo de software a medida sevilla", () => {
  const { h1 } = desarrolloSoftware.hero;
  assert.ok(worksTerm(h1), h1);
});

test("description works the term, keeps años de experiencia and stays within 160 chars", () => {
  const { description } = desarrolloSoftware.seo;
  assert.ok(worksTerm(description), description);
  assert.ok(description.includes("años de experiencia"), description);
  assert.ok(description.length <= 160, `${description.length} chars`);
});

test("intentMatrix row follows the H1 and keeps the title and description signals", () => {
  const row = intentMatrix.find((r) => r.url === URL_PATH);
  assert.ok(row, "intentMatrix row exists");
  assert.ok(
    desarrolloSoftware.hero.h1.includes(row.h1Signal),
    `${row.h1Signal} in ${desarrolloSoftware.hero.h1}`,
  );
  assert.ok(worksTerm(row.h1Signal), row.h1Signal);
  assert.ok(desarrolloSoftware.seo.title.includes(row.titleSignal));
  assert.ok(desarrolloSoftware.seo.description.includes(row.descriptionSignal));
});

test("inbound links to the software page hold from design web, automatizaciones and IA", () => {
  for (const source of [
    "/diseno-web-sevilla/",
    "/automatizaciones/",
    "/inteligencia-artificial/",
  ]) {
    const links = internalLinksBySource[source] ?? [];
    assert.ok(
      links.some((l) => l.path === URL_PATH),
      `${source} links to ${URL_PATH}`,
    );
  }
});

test("reciprocal pair with /diseno-web-sevilla/ holds", () => {
  const pair = reciprocalLinks.find(
    (r) => r.source === "/diseno-web-sevilla/" && r.target === URL_PATH,
  );
  assert.ok(pair, "reciprocal pair exists");
  // Forward link: design web -> software; back link: software -> design web.
  assert.ok(
    internalLinksBySource["/diseno-web-sevilla/"].some(
      (l) => l.path === URL_PATH && l.anchor === pair.sourceAnchor,
    ),
  );
  assert.ok(
    internalLinksBySource[URL_PATH].some(
      (l) =>
        l.path === "/diseno-web-sevilla/" && l.anchor === pair.targetAnchor,
    ),
  );
});
