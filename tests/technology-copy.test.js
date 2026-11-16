import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = (path) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("home shows the featured cases through RealProof and names no stack against them", async () => {
  const home = await source("src/pages/index.astro");
  const cases = home.match(
    /<SectionContainer id="trabajo-real">([\s\S]*?)<\/SectionContainer>/,
  )?.[1];

  assert.ok(cases, "real proof section exists");
  assert.match(
    cases,
    /<RealProof[\s\S]*?projects=\{\["arkady", "adfsevilla"\]\}/,
  );
  assert.doesNotMatch(cases, /Wordpress, Vite y React/);
});

test("Person structured data names Astro and Next.js alongside existing expertise", async () => {
  const schema = await source("src/lib/schema.ts");
  const knowsAbout = schema.match(/knowsAbout:\s*\[([\s\S]*?)\]/)?.[1];

  assert.ok(knowsAbout, "Person knowsAbout exists");
  for (const technology of [
    "Angular",
    "React",
    "WordPress",
    "Astro",
    "Next.js",
  ]) {
    assert.match(knowsAbout, new RegExp(`"${technology.replace(".", "\\.")}"`));
  }
});
