// CLI: node scripts/blog-ideas-refresh.mjs --date YYYY-MM-DD [--queue seo/contenido/ideas.json]
//   [--posts src/content/blog] [--dry-run] [export.json...]
// Merges new question ideas from saved exports into the idea queue (never
// calls an API), rewrites the queue file unless --dry-run, and prints the
// "Ideas para el blog" report section.
import { readFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { basename } from "node:path";
import { normaliseKeywordData } from "./lib/keyword-data.mjs";
import { shortlistTopics } from "./lib/topic-shortlist.mjs";
import { PILLARS } from "./lib/blog-pillars.mjs";
import { readPosts } from "./lib/blog-posts.mjs";
import {
  DEFAULT_QUEUE_PATH,
  mergeIdeas,
  pickProposals,
  readIdeaQueue,
  serializeQueue,
} from "./lib/idea-queue.mjs";
import { keywordOwners, intentMatrix } from "../src/data/seo-intents.ts";

const TOP = 4;

function fail(message) {
  console.error(`blog-ideas-refresh: ${message}`);
  process.exit(1);
}

const files = [];
let date;
let queuePath = DEFAULT_QUEUE_PATH;
let postsDir = "src/content/blog";
let dryRun = false;
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--date") date = args[++i];
  else if (args[i] === "--queue")
    queuePath = args[++i] ?? fail("--queue needs a value");
  else if (args[i] === "--posts")
    postsDir = args[++i] ?? fail("--posts needs a value");
  else if (args[i] === "--dry-run") dryRun = true;
  else if (args[i].startsWith("--")) fail(`unknown option ${args[i]}`);
  else files.push(args[i]);
}
if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? ""))
  fail("--date YYYY-MM-DD is required");

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
    fail(`${file}: ${error.message}`);
  }
}

let result;
try {
  const queue = await readIdeaQueue(queuePath);
  const pool = shortlistTopics(datasets, { limit: Infinity }).candidates;
  result = mergeIdeas(queue, pool, {
    date,
    owners: keywordOwners,
    intents: intentMatrix,
    posts: await readPosts(postsDir),
  });
} catch (error) {
  fail(error.message);
}

if (!dryRun) await writeFile(queuePath, serializeQueue(result.queue));

const label = Object.fromEntries(PILLARS.map((p) => [p.id, p.label]));
const cell = (text) => String(text).replace(/\|/g, "\\|");
const picked = pickProposals(result.queue.ideas, TOP);
const lines = [`## Ideas para el blog (${date})`, ""];
if (picked.length === 0) {
  lines.push("Sin ideas propuestas con datos: no hay nada que aprobar.");
} else {
  lines.push(
    "| # | Pregunta | Pilar | Volumen | Página destino | Fuente |",
    "| --- | --- | --- | --- | --- | --- |",
  );
  picked.forEach((idea, index) => {
    lines.push(
      `| ${[
        index + 1,
        `${cell(idea.question)} (\`${idea.id}\`)`,
        label[idea.pillar],
        idea.volume === null ? "sin dato" : idea.volume,
        idea.target,
        cell(`${idea.source.name} (${idea.source.date})`),
      ].join(" | ")} |`,
    );
  });
  if (picked.length < TOP)
    lines.push(
      "",
      `Solo hay ${picked.length} ideas con datos; no se inventa ninguna.`,
    );
}
lines.push(
  "",
  `Nuevas esta semana: ${result.added.length}. Descartadas: ${result.dropped.length}.`,
);
console.log(lines.join("\n"));
