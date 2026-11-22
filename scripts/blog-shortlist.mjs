// CLI: node scripts/blog-shortlist.mjs <export.json>... [--date YYYY-MM-DD] [--limit 10] [--json]
//   [--queue seo/contenido/ideas.json] [--posts src/content/blog]
// Reads saved keyword exports only: no API calls, no files written.
import { readFileSync } from "node:fs";
import { basename } from "node:path";
import { normaliseKeywordData } from "./lib/keyword-data.mjs";
import { shortlistTopics } from "./lib/topic-shortlist.mjs";
import { PILLARS } from "./lib/blog-pillars.mjs";
import { dedupeCandidates, describeReason } from "./lib/topic-dedup.mjs";
import { readPosts } from "./lib/blog-posts.mjs";
import { DEFAULT_QUEUE_PATH, readIdeaQueue } from "./lib/idea-queue.mjs";
import { keywordOwners, intentMatrix } from "../src/data/seo-intents.ts";

function usage(message) {
  if (message) console.error(`blog-shortlist: ${message}`);
  console.error(
    "usage: node scripts/blog-shortlist.mjs <export.json>... [--date YYYY-MM-DD] [--limit 10] [--json] [--queue seo/contenido/ideas.json] [--posts src/content/blog]",
  );
  process.exit(2);
}

const DEFAULT_LIMIT = 10;
const files = [];
let date;
let limit;
let asJson = false;
let queuePath = DEFAULT_QUEUE_PATH;
let postsDir = "src/content/blog";
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--date") date = args[++i] ?? usage("--date needs a value");
  else if (args[i] === "--limit") {
    const value = args[++i];
    if (!/^[1-9]\d*$/.test(value ?? ""))
      usage("--limit must be a positive integer");
    limit = Number(value);
  } else if (args[i] === "--queue")
    queuePath = args[++i] ?? usage("--queue needs a value");
  else if (args[i] === "--posts")
    postsDir = args[++i] ?? usage("--posts needs a value");
  else if (args[i] === "--json") asJson = true;
  else if (args[i].startsWith("--")) usage(`unknown option ${args[i]}`);
  else files.push(args[i]);
}
if (files.length === 0) usage("give at least one export file");

const datasets = [];
for (const file of files) {
  try {
    datasets.push(
      normaliseKeywordData(JSON.parse(readFileSync(file, "utf8")), {
        date,
        file: basename(file),
      }),
    );
  } catch (error) {
    console.error(`blog-shortlist: ${file}: ${error.message}`);
    process.exit(1);
  }
}

const pool = shortlistTopics(datasets, { limit: Infinity });
let dedup;
try {
  dedup = dedupeCandidates(pool.candidates, {
    owners: keywordOwners,
    intents: intentMatrix,
    posts: await readPosts(postsDir),
    queue: await readIdeaQueue(queuePath),
  });
} catch (error) {
  console.error(`blog-shortlist: ${error.message}`);
  process.exit(1);
}
const result = {
  candidates: dedup.kept.slice(0, limit ?? DEFAULT_LIMIT),
  dropped: dedup.dropped,
  skipped: pool.skipped,
};

if (asJson) {
  console.log(JSON.stringify(result, null, 2));
} else {
  const label = Object.fromEntries(PILLARS.map((p) => [p.id, p.label]));
  const cell = (text) => String(text).replace(/\|/g, "\\|");
  const number = (value) => (value === null ? "sin dato" : String(value));
  const lines = [
    "| # | Pregunta | Palabra clave | Volumen | Dificultad | Pilar | Página destino | Fuente |",
    "| --- | --- | --- | --- | --- | --- | --- | --- |",
  ];
  result.candidates.forEach((c, index) => {
    lines.push(
      `| ${[
        index + 1,
        cell(c.question),
        cell(c.keyword),
        number(c.volume),
        number(c.difficulty),
        c.pillar ? label[c.pillar] : "sin pilar",
        c.target ?? "sin página",
        cell(c.sources.map((s) => `${s.name} (${s.date})`).join("; ")),
      ].join(" | ")} |`,
    );
  });
  lines.push("", "### Descartadas", "");
  if (result.dropped.length === 0) lines.push("Ninguna");
  else {
    lines.push("| Pregunta | Motivo |", "| --- | --- |");
    for (const { candidate, reason } of result.dropped)
      lines.push(
        `| ${cell(candidate.question)} | ${cell(describeReason(reason))} |`,
      );
  }
  lines.push("", `Sin forma de pregunta: ${result.skipped.notQuestion}`);
  console.log(lines.join("\n"));
}
