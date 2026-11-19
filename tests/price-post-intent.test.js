import test from "node:test";
import assert from "node:assert/strict";
import { normaliseTerm } from "../scripts/lib/keyword-ownership.mjs";
import {
  isDirectAnswer,
  firstParagraph,
  markdownTable,
  markdownTableHead,
  plainText,
  readPost,
  sectionText,
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

const { disenoWeb } = await import(
  new URL("../src/data/services.ts", import.meta.url)
);

const { data, body } = readPost(SLUG);
const row = intentMatrix.find((r) => r.url === POST_PATH);

const tiers = disenoWeb.pricing.tiers;
const tierAmounts = new Set(tiers.map((t) => t.from.replace(/\s?€$/, "")));
const rateDate = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
}).format(new Date(data.updatedDate));
const rateYear = String(new Date(data.updatedDate).getUTCFullYear());
const SHORT_ANSWER = "Respuesta corta";

const withoutLinkUrls = (markdown) => markdown.replace(/\]\([^)]*\)/g, "]");

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

test("the opening paragraph and the short answer give my published rates", () => {
  const blocks = {
    opening: firstParagraph(body),
    "short answer lead": sections(body).find((s) => s.heading === SHORT_ANSWER)
      ?.lead,
  };
  for (const [name, text] of Object.entries(blocks)) {
    assert.ok(text, `${name} not found`);
    assert.ok(text.includes("mis tarifas"), `${name} lacks "mis tarifas"`);
    for (const tier of tiers) {
      assert.ok(text.includes(tier.from), `${name} lacks ${tier.from}`);
    }
    assert.ok(text.includes(rateDate), `${name} lacks the date "${rateDate}"`);
  }
});

test("the short answer table equals disenoWeb.pricing.tiers", () => {
  const section = sectionText(body, SHORT_ANSWER);
  const rows = markdownTable(section);
  const expected = tiers.map((t) => [
    t.name,
    `Desde ${t.from}`,
    t.includes.join("; "),
  ]);
  assert.equal(rows.length, expected.length, "one data row per tier");
  expected.forEach((cells, i) => {
    assert.deepEqual(
      rows[i],
      cells,
      `table differs from tier "${tiers[i].name}"`,
    );
  });
  const alignment = markdownTableHead(section).delimiter.map((cell) =>
    cell.endsWith(":") ? "right" : "default",
  );
  assert.deepEqual(alignment, ["default", "right", "default"]);
  const lead = section.split(/\r?\n[ \t]*\r?\n/);
  assert.ok(
    !lead[0].startsWith("|"),
    "the lead paragraph comes before the table",
  );
});

test("every euro amount and long number comes from the tiers", () => {
  const text = withoutLinkUrls(body).replace(/^\s*\d+\.\s/gm, "");
  const foreignEuros = [...text.matchAll(/(\d{1,3}(?:\.\d{3})*|\d+)\s?€/g)]
    .map((m) => m[1])
    .filter((n) => !tierAmounts.has(n));
  assert.deepEqual(foreignEuros, [], "euro amounts outside the tiers");
  assert.doesNotMatch(text, /\beuros?\b|\bEUR\b/i);
  const foreignLong = (text.match(/\d+(?:\.\d{3})*/g) ?? []).filter(
    (n) =>
      n.replace(/\./g, "").length >= 3 && !tierAmounts.has(n) && n !== rateYear,
  );
  assert.deepEqual(
    foreignLong,
    [],
    "numbers of three or more digits outside the tiers",
  );
});

test("the rate date in the text equals the update date", () => {
  assert.ok(
    plainText(body).includes(rateDate),
    `body lacks "${rateDate}" (updatedDate ${data.updatedDate})`,
  );
});

test("no sentence claims the post gives no figures", () => {
  const offenders = sentences(plainText(body)).filter(
    (s) =>
      /\bno (?:da|doy|hay)\b[^.]*\bcifras?\b/i.test(s) &&
      !s.includes("de mercado"),
  );
  assert.deepEqual(offenders, []);
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
