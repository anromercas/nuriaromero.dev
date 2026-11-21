import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { parseIdeaQueue } from "../scripts/lib/idea-queue.mjs";

const root = new URL("..", import.meta.url).pathname;
const fixture = (name) =>
  new URL(`./fixtures/blog-pipeline/queue/${name}`, import.meta.url).pathname;

function workspace(queueFile = "queue.json") {
  const dir = mkdtempSync(join(tmpdir(), "ideas-"));
  const posts = join(dir, "posts");
  mkdirSync(posts);
  const queue = join(dir, "ideas.json");
  if (queueFile) writeFileSync(queue, readFileSync(fixture(queueFile)));
  return { dir, posts, queue };
}
const run = (script, args) =>
  spawnSync("node", [`scripts/${script}`, ...args], {
    cwd: root,
    encoding: "utf8",
  });
const refresh = (ws, args) =>
  run("blog-ideas-refresh.mjs", [
    "--queue",
    ws.queue,
    "--posts",
    ws.posts,
    ...args,
  ]);
const rows = (out) => out.split("\n").filter((l) => /^\| \d+ \|/.test(l));

test("refresh requires a valid --date", () => {
  const ws = workspace();
  assert.equal(refresh(ws, []).status, 1);
  assert.equal(refresh(ws, ["--date", "ayer"]).status, 1);
});

test("refresh with an unreadable export exits 1 and leaves the queue untouched", () => {
  const ws = workspace();
  const before = readFileSync(ws.queue, "utf8");
  const result = refresh(ws, [
    "--date",
    "2026-11-23",
    join(ws.dir, "nope.json"),
  ]);
  assert.equal(result.status, 1);
  assert.equal(readFileSync(ws.queue, "utf8"), before);
});

test("week-1 export adds ideas and prints four proposals", () => {
  const ws = workspace();
  const result = refresh(ws, [
    "--date",
    "2026-11-23",
    fixture("export-week1.json"),
  ]);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /^## Ideas para el blog \(2026-11-23\)/m);
  assert.match(
    result.stdout,
    /\| # \| Pregunta \| Pilar \| Volumen \| Página destino \| Fuente \|/,
  );
  assert.equal(rows(result.stdout).length, 4);
  assert.match(result.stdout, /Nuevas esta semana: 5\. Descartadas: 3\./);
  const saved = parseIdeaQueue(JSON.parse(readFileSync(ws.queue, "utf8")));
  assert.equal(saved.ideas.length, 7);
});

test("few ideas: says how many exist and that none is invented", () => {
  const ws = workspace(null);
  const result = refresh(ws, [
    "--date",
    "2026-11-23",
    fixture("export-few.json"),
  ]);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(rows(result.stdout).length, 2);
  assert.match(
    result.stdout,
    /Solo hay 2 ideas con datos; no se inventa ninguna\./,
  );
});

test("empty queue and no exports says there is nothing to approve", () => {
  const ws = workspace(null);
  const result = refresh(ws, ["--date", "2026-11-23"]);
  assert.equal(result.status, 0, result.stderr);
  assert.match(
    result.stdout,
    /Sin ideas propuestas con datos: no hay nada que aprobar\./,
  );
  assert.equal(rows(result.stdout).length, 0);
});

test("a queue with proposals and no exports lists them", () => {
  const ws = workspace();
  const result = refresh(ws, ["--date", "2026-11-23"]);
  assert.equal(rows(result.stdout).length, 1);
  assert.match(result.stdout, /que-es-un-chatbot-clinica/);
  assert.match(result.stdout, /Solo hay 1 ideas? con datos/);
});

test("--dry-run leaves the queue file untouched", () => {
  const ws = workspace();
  const before = readFileSync(ws.queue, "utf8");
  const result = refresh(ws, [
    "--dry-run",
    "--date",
    "2026-11-23",
    fixture("export-week1.json"),
  ]);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(readFileSync(ws.queue, "utf8"), before);
  assert.equal(rows(result.stdout).length, 4);
});

test("a second identical run leaves the queue byte-identical", () => {
  const ws = workspace();
  const args = ["--date", "2026-11-23", fixture("export-week1.json")];
  refresh(ws, args);
  const first = readFileSync(ws.queue, "utf8");
  const second = refresh(ws, args);
  assert.equal(readFileSync(ws.queue, "utf8"), first);
  assert.match(second.stdout, /Nuevas esta semana: 0\./);
});

test("blog-idea-status approves exactly one idea", () => {
  const ws = workspace();
  const result = run("blog-idea-status.mjs", [
    "que-es-un-chatbot-clinica",
    "aprobada",
    "--queue",
    ws.queue,
  ]);
  assert.equal(result.status, 0, result.stderr);
  assert.match(
    result.stdout,
    /blog-idea-status: que-es-un-chatbot-clinica -> aprobada/,
  );
  const saved = JSON.parse(readFileSync(ws.queue, "utf8")).ideas;
  assert.deepEqual(
    saved.map((i) => [i.id, i.status]),
    [
      ["que-es-un-chatbot-clinica", "aprobada"],
      ["cuanto-cobra-un-seo-al-mes", "rechazada"],
    ],
  );
});

test("blog-idea-status fails for an unknown id or status and keeps the file", () => {
  const ws = workspace();
  const before = readFileSync(ws.queue, "utf8");
  assert.equal(
    run("blog-idea-status.mjs", ["nada", "aprobada", "--queue", ws.queue])
      .status,
    1,
  );
  assert.equal(
    run("blog-idea-status.mjs", [
      "que-es-un-chatbot-clinica",
      "hecha",
      "--queue",
      ws.queue,
    ]).status,
    1,
  );
  assert.equal(run("blog-idea-status.mjs", ["--queue", ws.queue]).status, 1);
  assert.equal(readFileSync(ws.queue, "utf8"), before);
});

test("the repository queue validates", () => {
  const json = JSON.parse(
    readFileSync(join(root, "seo/contenido/ideas.json"), "utf8"),
  );
  assert.doesNotThrow(() => parseIdeaQueue(json));
});
