// CLI: node scripts/blog-word-count.mjs <post.md> (--outline <esquema.md> | --target <n>)
import { readFileSync } from "node:fs";
import { parseOutline } from "./lib/outline-lint.mjs";
import { countWords, compareToTarget } from "./lib/word-count.mjs";

function usage(message) {
  if (message) console.error(`blog-word-count: ${message}`);
  console.error(
    "usage: node scripts/blog-word-count.mjs <post.md> (--outline <esquema.md> | --target <n>)",
  );
  process.exit(2);
}

const args = process.argv.slice(2);
let post = null;
let outline = null;
let target = null;
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--outline")
    outline = args[++i] ?? usage("--outline needs a path");
  else if (args[i] === "--target")
    target = args[++i] ?? usage("--target needs a number");
  else if (post === null && !args[i].startsWith("--")) post = args[i];
  else usage(`unexpected argument ${args[i]}`);
}
if (!post) usage("missing post path");
if ((outline === null) === (target === null))
  usage("give exactly one of --outline or --target");

function read(file) {
  try {
    return readFileSync(file, "utf8");
  } catch (error) {
    return usage(`cannot read ${file}: ${error.message}`);
  }
}

let goal;
if (target !== null) {
  if (!/^[1-9]\d*$/.test(target)) usage("--target must be a positive integer");
  goal = Number(target);
} else {
  goal = parseOutline(read(outline)).wordTarget;
  if (goal === null) usage(`${outline} has no valid 'Objetivo de palabras'`);
}

const r = compareToTarget(countWords(read(post)), goal);
console.log(
  `blog-word-count: ${r.count} words, target ${r.target} (${r.min}-${r.max}): ${r.status}`,
);
process.exit(r.status === "within" ? 0 : 1);
