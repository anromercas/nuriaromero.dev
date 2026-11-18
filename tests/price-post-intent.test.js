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

const SLUG = "cuanto-cuesta-una-pagina-web-en-sevilla";
const POST_PATH = `/blog/${SLUG}/`;
const HUB = "/diseno-web-sevilla/";
const TERM = "cuanto cuesta una pagina web";

const { intentMatrix, reciprocalLinks } = await import(
  new URL("../src/data/seo-intents.ts", import.meta.url)
);
const { internalLinksBySource } = await import(
  new URL("../src/data/internal-links.ts", import.meta.url)
);

const { data, body } = readPost(SLUG);
const row = intentMatrix.find((r) => r.url === POST_PATH);

// Numbers the post carried before NRD-128 (LCP threshold, percentile, years).
// While decision S-2026-11-13-1 (prices in the blog post) is open, no other
// figure may enter the post.
const ALLOWED_NUMBERS = new Set(["2", "5", "75", "10"]);

const numbersOf = (markdown) =>
  markdown
    .replace(/\]\([^)]*\)/g, "]")
    .replace(/^\s*\d+\.\s/gm, "")
    .match(/\d+/g) ?? [];

const worksTerm = (text) => {
  const normalised = normaliseTerm(text);
  return normalised.includes(TERM) && normalised.includes("sevilla");
};

test("the title and the description work the registered term", () => {
  assert.ok(worksTerm(data.title), "title does not work the term");
  assert.ok(worksTerm(data.description), "description does not work the term");
});

test("description fits 160 characters and carries the row signal", () => {
  assert.ok(row, "intentMatrix row missing");
  assert.ok(
    data.description.length <= 160,
    `description has ${data.description.length} characters`,
  );
  assert.ok(
    data.description.includes(row.descriptionSignal),
    `description does not contain "${row.descriptionSignal}"`,
  );
});

test("every H2 section opens with a direct answer", () => {
  const failing = sections(body)
    .filter((section) => !isDirectAnswer(section))
    .map((section) => section.heading);
  assert.deepEqual(failing, []);
});

test("content signal headings stay byte-exact", () => {
  const headings = sections(body).map((section) => section.heading);
  assert.ok(headings.includes("¿Qué debo revisar en una propuesta económica?"));
  assert.ok(
    headings.includes("¿Qué preguntas debo hacer antes de contratar una web?"),
  );
});

test("at most two H2 sections are added to the six existing ones", () => {
  assert.ok(sections(body).length <= 8);
});

test("the body holds no number outside today's set", () => {
  const extra = numbersOf(body).filter((n) => !ALLOWED_NUMBERS.has(n));
  assert.deepEqual(extra, []);
});

test("the body holds no euro sign or currency word", () => {
  assert.doesNotMatch(body, /€|\beuros?\b|\bEUR\b/i);
});

test("the body points to the published price page with the trailing slash", () => {
  assert.match(body, /\]\(\/diseno-web-sevilla\/\)/);
});

test("the hub pair and its anchors stay registered", () => {
  const pair = reciprocalLinks.find(
    (p) => p.source === POST_PATH && p.target === HUB,
  );
  assert.ok(pair, "reciprocal pair post -> hub missing");
  assert.ok(
    internalLinksBySource[POST_PATH].some(
      (r) => r.path === HUB && r.anchor === pair.sourceAnchor,
    ),
    "post row to the hub missing or with another anchor",
  );
  assert.ok(
    internalLinksBySource[HUB].some(
      (r) => r.path === POST_PATH && r.anchor === pair.targetAnchor,
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
