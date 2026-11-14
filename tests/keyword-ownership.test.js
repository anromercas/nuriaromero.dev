import test from "node:test";
import assert from "node:assert/strict";

const intents = await import(
  new URL("../src/data/seo-intents.ts", import.meta.url)
);
const { keywordOwners = [], intentMatrix, serviceRoutes } = intents;

const normalise = (keyword) =>
  keyword
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ")
    .trim();

test("keywordOwners records the four local head terms", () => {
  const owners = Object.fromEntries(
    keywordOwners.map(({ keyword, url }) => [keyword, url]),
  );

  assert.deepEqual(owners, {
    "consultor seo sevilla": "/",
    "seo local sevilla": "/seo-local-sevilla/",
    "agencia seo sevilla": "/seo-local-sevilla/",
    "posicionamiento web sevilla": "/seo-local-sevilla/",
  });
});

test("no head term has two owners", () => {
  const seen = new Map();
  for (const { keyword, url } of keywordOwners) {
    const key = normalise(keyword);
    assert.ok(
      !seen.has(key),
      `"${keyword}" is owned twice: ${seen.get(key)} and ${url}`,
    );
    seen.set(key, url);
  }
});

test("every owner is a real page in trailing-slash form", () => {
  const known = new Set([
    "/",
    ...intentMatrix.map((row) => row.url),
    ...serviceRoutes,
  ]);
  assert.ok(keywordOwners.length > 0, "keywordOwners is empty");
  for (const { keyword, url } of keywordOwners) {
    assert.ok(url.endsWith("/"), `${keyword}: ${url} lacks the trailing slash`);
    assert.ok(known.has(url), `${keyword}: ${url} is not a known route`);
  }
});
