import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  ideaId,
  validateIdea,
  classifyIntent,
  scoreIdea,
  mergeIdeas,
  pickProposals,
  setIdeaStatus,
  serializeQueue,
  parseIdeaQueue,
} from "../scripts/lib/idea-queue.mjs";
import { normaliseKeywordData } from "../scripts/lib/keyword-data.mjs";
import { shortlistTopics } from "../scripts/lib/topic-shortlist.mjs";

const dir = new URL("./fixtures/blog-pipeline/queue/", import.meta.url);
const load = (name) => JSON.parse(readFileSync(new URL(name, dir), "utf8"));
const queue = load("queue.json");
const week1 = normaliseKeywordData(load("export-week1.json"));
const pool = shortlistTopics([week1], { limit: Infinity }).candidates;
const context = {
  date: "2026-11-23",
  owners: [{ keyword: "seo local sevilla", url: "/seo-local-sevilla/" }],
  intents: [],
  posts: [],
};
const find = (question) => pool.find((c) => c.question === question);

test("ideaId joins normalised tokens and cuts at a word boundary", () => {
  assert.equal(
    ideaId("Qué es un chatbot, clínica"),
    "que-es-un-chatbot-clinica",
  );
  const long = ideaId(
    "como automatizar la facturacion de una pequena empresa con herramientas sin codigo",
  );
  assert.ok(long.length <= 60);
  assert.ok(!long.endsWith("-"));
  assert.ok(
    "como-automatizar-la-facturacion-de-una-pequena-empresa-con-herramientas-sin-codigo".startsWith(
      long + "-",
    ),
  );
});

test("validateIdea accepts a full entry and flags a missing source.date", () => {
  assert.deepEqual(validateIdea(queue.ideas[0]), []);
  const broken = { ...queue.ideas[0], source: { name: "paa" } };
  assert.deepEqual(validateIdea(broken), ["entry source.date: required"]);
});

test("validateIdea flags bad status, pillar, volume and added", () => {
  const messages = validateIdea({
    ...queue.ideas[0],
    status: "x",
    pillar: "y",
    volume: "7",
    added: "ayer",
  });
  assert.equal(messages.length, 4);
  assert.ok(messages.some((m) => m.startsWith("entry status:")));
  assert.ok(messages.some((m) => m.startsWith("entry pillar:")));
  assert.ok(messages.some((m) => m.startsWith("entry volume:")));
  assert.ok(messages.some((m) => m.startsWith("entry added:")));
});

test("parseIdeaQueue runs validateIdea naming the entry and field", () => {
  const bad = structuredClone(queue);
  delete bad.ideas[1].source.date;
  assert.throws(
    () => parseIdeaQueue(bad),
    /idea queue: entry 1: .*source\.date/,
  );
  assert.equal(parseIdeaQueue(queue).ideas.length, 2);
});

test("classifyIntent maps export intent, then price terms, then informacional", () => {
  assert.equal(
    classifyIntent({ intent: "commercial", keyword: "x", question: "x" }),
    "comercial",
  );
  assert.equal(
    classifyIntent({ intent: "transactional", keyword: "x", question: "x" }),
    "transaccional",
  );
  assert.equal(
    classifyIntent({ intent: "navigational", keyword: "x", question: "x" }),
    "navegacional",
  );
  assert.equal(
    classifyIntent({
      intent: "informational",
      keyword: "precio",
      question: "x",
    }),
    "informacional",
  );
  assert.equal(
    classifyIntent({
      intent: null,
      keyword: "cuanto cuesta una web",
      question: "¿Cuánto cuesta una web?",
    }),
    "comercial",
  );
  assert.equal(
    classifyIntent({
      intent: null,
      keyword: "que es geo",
      question: "¿Qué es GEO?",
    }),
    "informacional",
  );
});

test("scoreIdea gives exact values", () => {
  const round = (n) => Math.round(n * 1000) / 1000;
  // paa, volume 880, difficulty 25: full citability
  assert.equal(
    scoreIdea(find("¿Cómo saber si mi web sale en Google?")),
    round(0.4 * (Math.log10(881) / 4) + 0.2 * 0.75 + 0.25 + 0.15),
  );
  // keyword, volume 90, difficulty 30: half citability
  assert.equal(
    scoreIdea(find("¿Cuánto cuesta una tienda online?")),
    round(0.4 * (Math.log10(91) / 4) + 0.2 * 0.7 + 0.25 + 0.075),
  );
  // client-question without data: volume 0, ease 0.5
  assert.equal(scoreIdea(find("¿Cómo automatizar las facturas con n8n?")), 0.5);
  // no pillar: no fit; volume capped at 1, difficulty 0
  assert.equal(
    scoreIdea({ kind: "keyword", volume: 10000, difficulty: 0, pillar: null }),
    0.675,
  );
});

test("mergeIdeas adds new pillar ideas with every field and status propuesta", () => {
  const { added, queue: merged } = mergeIdeas(queue, pool, context);
  const idea = added.find(
    (i) => i.keyword === "como saber si mi web sale en google",
  );
  assert.deepEqual(validateIdea(idea), []);
  assert.equal(idea.status, "propuesta");
  assert.equal(idea.added, "2026-11-23");
  assert.deepEqual(idea.source, { name: "week1", date: "2026-11-23" });
  assert.equal(idea.id, "como-saber-si-mi-web-sale-en-google");
  assert.equal(merged.ideas.length, queue.ideas.length + added.length);
});

test("mergeIdeas skips ideas covered by any queued status, owners and posts, and no-pillar candidates", () => {
  const { added, dropped } = mergeIdeas(queue, pool, {
    ...context,
    posts: [
      { slug: "p", title: "Cuánto cuesta una tienda online", draft: false },
    ],
  });
  const questions = added.map((i) => i.question);
  assert.ok(!questions.includes("¿Cuánto cobra un SEO al mes?")); // rechazada
  assert.ok(!questions.includes("¿Cuánto cuesta una tienda online?")); // post
  assert.ok(!questions.includes("¿Cuántos días tiene un mes?")); // no pillar
  const reasonOf = (q) =>
    dropped.find((d) => d.candidate.question === q)?.reason.kind;
  assert.equal(reasonOf("¿Cuánto cobra un SEO al mes?"), "queued-idea");
  assert.equal(reasonOf("¿Cuánto cuesta una tienda online?"), "published-post");
  assert.equal(reasonOf("¿Cuántos días tiene un mes?"), "no-pillar");
});

test("mergeIdeas blocks on a propuesta idea too and never modifies existing ideas", () => {
  const { added, queue: merged } = mergeIdeas(queue, pool, context);
  assert.ok(!added.some((i) => /chatbot/.test(i.keyword)));
  assert.deepEqual(merged.ideas.slice(0, 2), queue.ideas);
});

test("mergeIdeas suffixes colliding ids", () => {
  const candidate = { ...find("¿Cómo saber si mi web sale en Google?") };
  const seeded = {
    version: 1,
    ideas: [
      {
        ...queue.ideas[0],
        id: ideaId(candidate.keyword),
        question: "otra cosa distinta",
        keyword: "otra cosa distinta",
      },
    ],
  };
  const { added } = mergeIdeas(seeded, [candidate], context);
  assert.equal(added[0].id, `${ideaId(candidate.keyword)}-2`);
});

test("serializeQueue is byte-stable across merges and orders by status, score, id", () => {
  const a = serializeQueue(mergeIdeas(queue, pool, context).queue);
  const b = serializeQueue(
    mergeIdeas(queue, [...pool].reverse(), context).queue,
  );
  assert.equal(a, b);
  assert.ok(a.endsWith("}\n"));
  const ideas = JSON.parse(a).ideas;
  const order = ["en curso", "aprobada", "propuesta", "rechazada", "publicada"];
  for (let i = 1; i < ideas.length; i++) {
    const [p, q] = [ideas[i - 1], ideas[i]];
    const sp = order.indexOf(p.status);
    const sq = order.indexOf(q.status);
    assert.ok(sp < sq || (sp === sq && p.score >= q.score));
  }
  assert.deepEqual(Object.keys(ideas[0]), [
    "id",
    "question",
    "keyword",
    "intent",
    "volume",
    "difficulty",
    "target",
    "pillar",
    "score",
    "source",
    "status",
    "added",
  ]);
  // second merge on its own output is a no-op
  const again = serializeQueue(mergeIdeas(JSON.parse(a), pool, context).queue);
  assert.equal(again, a);
});

const mk = (id, pillar, score) => ({
  ...queue.ideas[1],
  id,
  pillar,
  score,
  status: "propuesta",
});

test("pickProposals spreads four over the pillars", () => {
  const ideas = [
    mk("a", "seo", 0.9),
    mk("b", "seo", 0.8),
    mk("c", "seo", 0.7),
    mk("d", "ia", 0.6),
    mk("e", "web", 0.5),
    mk("f", "web", 0.4),
  ];
  const picked = pickProposals(ideas);
  assert.deepEqual(
    picked.map((i) => i.id),
    ["a", "d", "e", "b"],
  );
  assert.equal(new Set(picked.map((i) => i.pillar)).size, 3);
});

test("pickProposals ignores other statuses and returns what exists", () => {
  const ideas = [
    mk("a", "seo", 0.9),
    mk("b", "ia", 0.8),
    { ...mk("c", "web", 0.99), status: "aprobada" },
  ];
  assert.deepEqual(
    pickProposals(ideas).map((i) => i.id),
    ["a", "b"],
  );
});

test("setIdeaStatus changes only one entry and throws on unknown id or status", () => {
  const next = setIdeaStatus(queue, "que-es-un-chatbot-clinica", "aprobada");
  assert.equal(next.ideas[1].status, "aprobada");
  assert.deepEqual(next.ideas[0], queue.ideas[0]);
  assert.equal(queue.ideas[1].status, "propuesta");
  assert.throws(() => setIdeaStatus(queue, "nope", "aprobada"), /unknown idea/);
  assert.throws(
    () => setIdeaStatus(queue, queue.ideas[0].id, "hecha"),
    /unknown status/,
  );
});
