import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import {
  IDEA_STATUSES,
  DEFAULT_QUEUE_PATH,
  parseIdeaQueue,
  readIdeaQueue,
} from "../scripts/lib/idea-queue.mjs";
import {
  BLOCKING_STATUSES,
  dedupeCandidates,
  describeReason,
} from "../scripts/lib/topic-dedup.mjs";

const dir = new URL("./fixtures/blog-pipeline/dedup/", import.meta.url);
const path = (name) => new URL(name, dir).pathname;
const queue = JSON.parse(readFileSync(path("ideas.json"), "utf8"));
const candidate = (question) => ({
  key: question,
  question,
  keyword: question,
});
const ask = "¿Cuánto cobra un SEO al mes?";
const withStatus = (status) => ({
  ideas: [{ id: "i-1", question: ask, keyword: "cobra seo mes", status }],
});
const context = (status, extra = {}) => ({
  owners: [],
  intents: [],
  posts: [],
  queue: withStatus(status),
  ...extra,
});

test("idea queue constants", () => {
  assert.equal(DEFAULT_QUEUE_PATH, "seo/contenido/ideas.json");
  assert.deepEqual(IDEA_STATUSES, [
    "propuesta",
    "aprobada",
    "rechazada",
    "en curso",
    "publicada",
  ]);
  assert.deepEqual(BLOCKING_STATUSES, ["rechazada", "en curso", "publicada"]);
});

test("parseIdeaQueue accepts the fixture", () => {
  assert.equal(parseIdeaQueue(queue).ideas.length, 2);
});

test("parseIdeaQueue rejects bad version and bad status with the entry index", () => {
  assert.throws(
    () => parseIdeaQueue({ ...queue, version: 2 }),
    /idea queue: version must be 1/,
  );
  const bad = {
    version: 1,
    ideas: [queue.ideas[0], { ...queue.ideas[1], status: "pendiente" }],
  };
  assert.throws(() => parseIdeaQueue(bad), /idea queue: entry 1: status/);
  assert.throws(
    () =>
      parseIdeaQueue({ version: 1, ideas: [{ ...queue.ideas[0], id: "" }] }),
    /idea queue: entry 0: id/,
  );
});

test("readIdeaQueue returns an empty queue for a missing file", async () => {
  assert.deepEqual(await readIdeaQueue(path("no-existe.json")), {
    version: 1,
    ideas: [],
  });
});

test("settled statuses drop with queued-idea", () => {
  for (const status of ["rechazada", "en curso", "publicada"]) {
    const { dropped } = dedupeCandidates([candidate(ask)], context(status));
    assert.deepEqual(dropped[0].reason, {
      kind: "queued-idea",
      ref: "i-1",
      detail: status,
    });
  }
});

test("propuesta and aprobada do not drop", () => {
  for (const status of ["propuesta", "aprobada"]) {
    const { kept } = dedupeCandidates([candidate(ask)], context(status));
    assert.equal(kept.length, 1);
  }
});

test("blockingStatuses override lets NRD-350 block every status", () => {
  const { dropped } = dedupeCandidates(
    [candidate(ask)],
    context("propuesta", { blockingStatuses: IDEA_STATUSES }),
  );
  assert.equal(dropped[0].reason.kind, "queued-idea");
});

test("describeReason is Spanish for the three kinds", () => {
  assert.equal(
    describeReason({
      kind: "owned-intent",
      ref: "/seo-local-sevilla/",
      detail: "seo local sevilla",
    }),
    "Intención con página propietaria: /seo-local-sevilla/ («seo local sevilla»)",
  );
  assert.equal(
    describeReason({ kind: "published-post", ref: "/blog/x/", detail: "T" }),
    "Ya respondida por el post publicado /blog/x/",
  );
  assert.equal(
    describeReason({ kind: "queued-idea", ref: "i-1", detail: "rechazada" }),
    "Ya en la cola como «rechazada» (i-1)",
  );
});

const run = (...extra) =>
  spawnSync(
    process.execPath,
    [
      "scripts/blog-shortlist.mjs",
      path("keywords.json"),
      "--queue",
      path("ideas.json"),
      "--posts",
      path("posts"),
      ...extra,
    ],
    { encoding: "utf8", cwd: new URL("..", import.meta.url).pathname },
  );

test("CLI keeps the free idea and prints one reason per rule", () => {
  const out = run();
  assert.equal(out.status, 0, out.stderr);
  const [table, dropped] = out.stdout.split("### Descartadas");
  assert.match(table, /¿Qué es un chatbot para una clínica\?/);
  assert.doesNotMatch(table, /¿Cuánto cobra un SEO al mes\?/);
  assert.match(dropped, /\| Pregunta \| Motivo \|/);
  assert.match(
    dropped,
    /¿Cuánto cuesta el SEO local en Sevilla\? \| Intención con página propietaria: \/seo-local-sevilla\//,
  );
  assert.match(
    dropped,
    /¿Cuánto cuesta mantener una web al año\? \| Ya respondida por el post publicado \/blog\/publicado\//,
  );
  assert.match(
    dropped,
    /¿Cuánto cobra un SEO al mes\? \| Ya en la cola como «rechazada» \(idea-001\)/,
  );
  assert.doesNotMatch(dropped, /chatbot/);
});

test("CLI --json includes the three dropped entries", () => {
  const out = run("--json");
  assert.equal(out.status, 0, out.stderr);
  const result = JSON.parse(out.stdout);
  assert.equal(result.dropped.length, 3);
  assert.deepEqual(result.dropped.map((d) => d.reason.kind).sort(), [
    "owned-intent",
    "published-post",
    "queued-idea",
  ]);
  assert.equal(result.candidates.length, 1);
});

test("CLI exits non-zero naming the entry of a malformed queue", () => {
  const bad = join(mkdtempSync(join(tmpdir(), "dedup-")), "ideas.json");
  writeFileSync(
    bad,
    JSON.stringify({
      version: 1,
      ideas: [{ ...queue.ideas[0], status: "pendiente" }],
    }),
  );
  const out = spawnSync(
    process.execPath,
    ["scripts/blog-shortlist.mjs", path("keywords.json"), "--queue", bad],
    { encoding: "utf8", cwd: new URL("..", import.meta.url).pathname },
  );
  assert.notEqual(out.status, 0);
  assert.match(out.stderr, /entry 0/);
});

test("CLI applies --limit after de-duplication", () => {
  const out = run("--json", "--limit", "1");
  assert.equal(out.status, 0, out.stderr);
  const result = JSON.parse(out.stdout);
  assert.equal(result.dropped.length, 3);
  assert.deepEqual(
    result.candidates.map((c) => c.question),
    ["¿Qué es un chatbot para una clínica?"],
  );
});
