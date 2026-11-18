import test from "node:test";
import assert from "node:assert/strict";
import { normaliseTerm } from "../scripts/lib/keyword-ownership.mjs";
import {
  isDirectAnswer,
  plainText,
  readPost,
  sections,
  sentences,
} from "./helpers/post-sections.js";

const SLUG = "como-aparecer-en-google-maps-negocio-sevilla";
const POST_PATH = `/blog/${SLUG}/`;
const HUB = "/seo-local-sevilla/";

const { internalLinksBySource } = await import(
  new URL("../src/data/internal-links.ts", import.meta.url)
);
const { reciprocalLinks } = await import(
  new URL("../src/data/seo-intents.ts", import.meta.url)
);

const { data, body } = readPost(SLUG);

test("the title works the registered term", () => {
  assert.ok(normaliseTerm(data.title).includes("como aparecer en google maps"));
});

test("description fits 160 characters and carries the intent signals", () => {
  assert.ok(
    data.description.length <= 160,
    `description has ${data.description.length} characters`,
  );
  assert.ok(data.description.includes("Google Maps"));
  assert.ok(data.description.includes("Perfil de Empresa"));
});

test("every H2 section opens with a direct answer", () => {
  const failing = sections(body)
    .filter((section) => !isDirectAnswer(section))
    .map((section) => section.heading);
  assert.deepEqual(failing, []);
});

test("content signal headings stay", () => {
  const headings = sections(body).map((section) => section.heading);
  assert.ok(headings.includes("¿Cómo conecto la ficha con mi página web?"));
  assert.ok(headings.includes("¿Prefieres que te lo deje montado?"));
});

test("the body links to the hub with the trailing slash", () => {
  assert.match(body, /\]\(\/seo-local-sevilla\/\)/);
});

test("the hub pair and its anchors stay registered", () => {
  const pair = reciprocalLinks.find(
    (p) => p.source === POST_PATH && p.target === HUB,
  );
  assert.ok(pair, "reciprocal pair post -> hub missing");
  const rows = internalLinksBySource[POST_PATH];
  assert.ok(
    rows.some((row) => row.path === HUB && row.anchor === pair.sourceAnchor),
    "post row to the hub missing or with another anchor",
  );
  assert.ok(
    internalLinksBySource[HUB].some(
      (row) => row.path === POST_PATH && row.anchor === pair.targetAnchor,
    ),
    "hub row to the post missing or with another anchor",
  );
});

test("guarantees appear only in negative form", () => {
  const offenders = sentences(plainText(body)).filter(
    (sentence) =>
      /garantiz/i.test(sentence) &&
      !/\b(no|ninguna|ningún|nadie|sin)\b/i.test(sentence),
  );
  assert.deepEqual(offenders, []);
});

test("the update date is set and coherent", () => {
  assert.ok(data.updatedDate, "updatedDate is missing");
  assert.ok(data.updatedDate >= data.pubDate, "updatedDate before pubDate");
  assert.ok(
    data.updatedDate <= new Date().toISOString().slice(0, 10),
    "updatedDate in the future",
  );
});
