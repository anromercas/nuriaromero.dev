// NRD-163: compare the <main> of two built pages ignoring class and
// data-astro-cid-* attributes. Usage: node scripts/diff-main.mjs <before.html> <after.html>
// Prints the first differing region and exits 1 on difference.
import { readFile } from "node:fs/promises";
import { normalizedMain } from "./lib/page-contract.mjs";

const [beforePath, afterPath] = process.argv.slice(2);
if (!beforePath || !afterPath) {
  console.error("Usage: node scripts/diff-main.mjs <before.html> <after.html>");
  process.exit(2);
}

const before = normalizedMain(await readFile(beforePath, "utf8"));
const after = normalizedMain(await readFile(afterPath, "utf8"));

if (before === after) {
  console.log(`diff-main: <main> identical (${before.length} chars)`);
} else {
  let i = 0;
  while (i < before.length && i < after.length && before[i] === after[i]) i++;
  const from = Math.max(0, i - 80);
  console.error(`diff-main: <main> differs at char ${i}`);
  console.error(`  before: ...${before.slice(from, i + 160)}`);
  console.error(`  after:  ...${after.slice(from, i + 160)}`);
  process.exit(1);
}
