// CLI: node scripts/blog-idea-status.mjs <id> <status> [--queue seo/contenido/ideas.json]
// Records the owner's decision on one idea of the blog idea queue.
import { writeFile } from "node:fs/promises";
import {
  DEFAULT_QUEUE_PATH,
  readIdeaQueue,
  serializeQueue,
  setIdeaStatus,
} from "./lib/idea-queue.mjs";

function fail(message) {
  console.error(`blog-idea-status: ${message}`);
  process.exit(1);
}

const positional = [];
let queuePath = DEFAULT_QUEUE_PATH;
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--queue")
    queuePath = args[++i] ?? fail("--queue needs a value");
  else if (args[i].startsWith("--")) fail(`unknown option ${args[i]}`);
  else positional.push(args[i]);
}
if (positional.length !== 2) fail("usage: <id> <status> [--queue path]");
const [id, status] = positional;

try {
  const next = setIdeaStatus(await readIdeaQueue(queuePath), id, status);
  await writeFile(queuePath, serializeQueue(next));
} catch (error) {
  fail(error.message);
}
console.log(`blog-idea-status: ${id} -> ${status}`);
