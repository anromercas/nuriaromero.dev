import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import {
  normaliseKeywordData,
  isQuestion,
} from "../scripts/lib/keyword-data.mjs";
import {
  PILLARS,
  PILLAR_RULES,
  classifyTopic,
} from "../scripts/lib/blog-pillars.mjs";
import { shortlistTopics } from "../scripts/lib/topic-shortlist.mjs";

const dir = new URL("./fixtures/blog-pipeline/", import.meta.url);
const path = (name) => new URL(name, dir).pathname;
const json = (name) => JSON.parse(readFileSync(path(name), "utf8"));

const normalized = () => normaliseKeywordData(json("keywords-normalized.json"));
const ads = () =>
  normaliseKeywordData(json("dataforseo-ads-volume.json"), {
    date: "2026-11-18",
  });
const labs = () => normaliseKeywordData(json("dataforseo-labs.json"));
const paa = () => normaliseKeywordData(json("dataforseo-serp-paa.json"));
const gsc = () =>
  normaliseKeywordData(json("gsc-queries.json"), { date: "2026-11-19" });

test("normalized export keeps source, date and items", () => {
  const d = normalized();
  assert.equal(d.source, "dataforseo:keyword-ideas");
  assert.equal(d.date, "2026-11-16");
  assert.equal(d.items.length, 3);
  assert.equal(d.items[2].kind, "client-question");
  assert.equal(d.items[1].question, null);
  assert.equal(d.items[0].volume, 90);
});

test("normalized export rejects items without keyword or question", () => {
  assert.throws(
    () =>
      normaliseKeywordData(
        { source: "x", date: "2026-11-16", items: [{ kind: "keyword" }] },
        { file: "a.json" },
      ),
    /a\.json/,
  );
});

test("DataForSEO Ads volume envelope", () => {
  const d = ads();
  assert.equal(d.source, "dataforseo:google_ads/search_volume/live");
  assert.equal(d.date, "2026-11-18");
  assert.deepEqual(
    d.items.map((i) => [i.kind, i.keyword, i.volume]),
    [
      ["keyword", "cuanto cuesta una tienda online", 110],
      ["keyword", "tienda online sevilla", 500],
    ],
  );
});

test("DataForSEO Ads envelope without a date throws", () => {
  assert.throws(
    () => normaliseKeywordData(json("dataforseo-ads-volume.json")),
    /date/,
  );
});

test("DataForSEO Labs envelope carries volume, difficulty and intent", () => {
  const d = labs();
  assert.equal(d.source, "dataforseo:google/keyword_suggestions/live");
  assert.equal(d.date, "2026-11-16");
  assert.deepEqual(d.items[0], {
    kind: "keyword",
    keyword: "como hago que chatgpt recomiende mi negocio",
    question: null,
    volume: 40,
    difficulty: 20,
    intent: "informational",
  });
  assert.equal(d.items.length, 3);
});

test("DataForSEO SERP envelope yields People Also Ask questions", () => {
  const d = paa();
  assert.equal(d.date, "2026-11-17");
  assert.deepEqual(d.items, [
    {
      kind: "paa",
      keyword: "que es el seo local",
      question: "¿Qué es el SEO local?",
      volume: null,
      difficulty: null,
      intent: null,
    },
  ]);
});

test("Search Console response needs the date option", () => {
  const d = gsc();
  assert.equal(d.source, "gsc");
  assert.equal(d.date, "2026-11-19");
  assert.equal(d.items[0].kind, "gsc");
  assert.equal(d.items[0].keyword, "como aparecer en google maps");
  assert.equal(d.items[0].volume, null);
  assert.equal(d.items[0].impressions, 120);
  assert.throws(
    () => normaliseKeywordData(json("gsc-queries.json"), { file: "g.json" }),
    /g\.json/,
  );
});

test("an unknown shape throws naming the file", () => {
  assert.throws(
    () => normaliseKeywordData(json("unknown-shape.json"), { file: "u.json" }),
    /unknown keyword-data shape: u\.json/,
  );
});

test("isQuestion", () => {
  for (const q of [
    "¿Qué es el SEO local?",
    "seo local?",
    "como aparecer en google maps",
    "Cuánto cuesta una web",
    "por qué mi web no sale",
    "merece la pena una tienda online",
    "es seguro vender por internet",
  ])
    assert.equal(isQuestion(q), true, q);
  for (const q of ["tienda online sevilla", "comercial", "escuela seo"])
    assert.equal(isQuestion(q), false, q);
});

test("classifyTopic follows the ordered rules", () => {
  const cases = [
    ["¿Cómo hago que ChatGPT recomiende mi negocio?", "seo", "/seo-para-ia/"],
    ["¿Qué es el SEO local?", "seo", "/seo-local-sevilla/"],
    ["¿Cuánto cuesta una tienda online?", "web", "/tienda-online-sevilla/"],
    ["¿Cómo automatizar facturas con n8n?", "servicios", "/automatizaciones/"],
    [
      "¿Qué es una aplicación web?",
      "servicios",
      "/desarrollo-software-medida/",
    ],
    ["¿Qué es un chatbot?", "ia", "/inteligencia-artificial/"],
    ["¿Cuánto cuesta una página web?", "web", "/diseno-web-sevilla/"],
  ];
  for (const [text, pillar, target] of cases)
    assert.deepEqual(classifyTopic(text), { pillar, target }, text);
  assert.equal(classifyTopic("¿Qué tiempo hace en Sevilla?"), null);
});

test("classifyTopic matches whole words only", () => {
  assert.equal(classifyTopic("¿Qué es un geografo?"), null);
  assert.equal(classifyTopic("¿Qué es la ciudad?"), null);
});

test("pillar table is complete and uses known pillars", () => {
  const ids = PILLARS.map((p) => p.id);
  assert.deepEqual(ids, ["seo", "web", "ia", "servicios"]);
  assert.equal(PILLAR_RULES.length, 7);
  for (const rule of PILLAR_RULES) assert.ok(ids.includes(rule.pillar));
});

test("non-question keywords are skipped and counted", () => {
  const r = shortlistTopics([ads()]);
  assert.deepEqual(
    r.candidates.map((c) => c.key),
    ["cuanto cuesta una tienda online"],
  );
  assert.equal(r.skipped.notQuestion, 1);
});

test("duplicates across exports merge with max volume and every source", () => {
  const r = shortlistTopics([normalized(), ads()]);
  const c = r.candidates.find(
    (x) => x.key === "cuanto cuesta una tienda online",
  );
  assert.equal(c.volume, 110);
  assert.equal(c.difficulty, 30);
  assert.equal(c.intent, "commercial");
  assert.equal(c.question, "¿Cuánto cuesta una tienda online?");
  assert.deepEqual(c.sources, [
    { name: "dataforseo:keyword-ideas", date: "2026-11-16" },
    { name: "dataforseo:google_ads/search_volume/live", date: "2026-11-18" },
  ]);
  assert.equal(r.candidates.filter((x) => x.key === c.key).length, 1);
});

test("mixed exports: fields, pillars and order", () => {
  const r = shortlistTopics([normalized(), ads(), labs(), paa(), gsc()]);
  assert.deepEqual(
    r.candidates.map((c) => c.key),
    [
      "cuanto cuesta una tienda online",
      "como hago que chatgpt recomiende mi negocio",
      "como aparecer en google maps",
      "como se si mi web sale en google",
      "que es el seo local",
      "que tiempo hace en sevilla",
    ],
  );
  assert.equal(r.skipped.notQuestion, 3);
  const [shop, geo, maps, , seoLocal, weather] = r.candidates;
  assert.equal(shop.pillar, "web");
  assert.equal(shop.target, "/tienda-online-sevilla/");
  assert.equal(geo.pillar, "seo");
  assert.equal(geo.target, "/seo-para-ia/");
  assert.equal(geo.question, "¿Como hago que chatgpt recomiende mi negocio?");
  assert.equal(maps.kind, "gsc");
  assert.equal(seoLocal.kind, "paa");
  assert.deepEqual(seoLocal.sources, [
    { name: "dataforseo:google/organic/live/advanced", date: "2026-11-17" },
  ]);
  assert.equal(weather.pillar, null);
  assert.equal(weather.target, null);
  assert.equal(weather.fit, 0);
  assert.equal(weather.volume, 5000);
  for (const c of r.candidates) assert.ok(c.sources.length >= 1);
});

test("limit keeps the first candidates", () => {
  const r = shortlistTopics([normalized(), ads(), labs(), paa(), gsc()], {
    limit: 2,
  });
  assert.equal(r.candidates.length, 2);
});

const cli = (...args) =>
  spawnSync(process.execPath, ["scripts/blog-shortlist.mjs", ...args]);

test("CLI prints the markdown table and the skipped summary", () => {
  const r = cli(
    path("keywords-normalized.json"),
    path("dataforseo-ads-volume.json"),
    "--date",
    "2026-11-18",
  );
  assert.equal(r.status, 0);
  const out = r.stdout.toString();
  assert.match(
    out,
    /\| # \| Pregunta \| Palabra clave \| Volumen \| Dificultad \| Pilar \| Página destino \| Fuente \|/,
  );
  assert.match(out, /¿Cuánto cuesta una tienda online\?/);
  assert.match(out, /\| 110 \| 30 \|/);
  assert.match(out, /sin dato/);
  assert.match(out, /Sin forma de pregunta: 1/);
});

test("CLI output is byte-identical across runs", () => {
  const args = [
    path("keywords-normalized.json"),
    path("dataforseo-labs.json"),
    path("dataforseo-serp-paa.json"),
    path("gsc-queries.json"),
    "--date",
    "2026-11-19",
  ];
  const a = cli(...args);
  const b = cli(...args);
  assert.equal(a.status, 0);
  assert.equal(a.stdout.toString(), b.stdout.toString());
});

test("CLI --json prints candidates and skipped", () => {
  const r = cli(path("dataforseo-labs.json"), "--json", "--limit", "1");
  assert.equal(r.status, 0);
  const out = JSON.parse(r.stdout.toString());
  assert.equal(out.candidates.length, 1);
  assert.equal(out.skipped.notQuestion, 1);
});

test("CLI fails on an unknown shape naming the file and prints no candidates", () => {
  const r = cli(path("keywords-normalized.json"), path("unknown-shape.json"));
  assert.equal(r.status, 1);
  assert.equal(r.stdout.toString(), "");
  assert.match(r.stderr.toString(), /unknown-shape\.json/);
});

test("CLI fails on Search Console without --date and on unreadable files", () => {
  assert.equal(cli(path("gsc-queries.json")).status, 1);
  assert.equal(cli(path("missing.json")).status, 1);
  assert.equal(cli().status, 2);
});
