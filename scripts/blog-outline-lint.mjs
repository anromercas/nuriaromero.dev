// CLI: node scripts/blog-outline-lint.mjs <esquema.md>
import { readFileSync } from "node:fs";
import { lintOutline } from "./lib/outline-lint.mjs";

const file = process.argv[2];
if (!file || process.argv.length > 3) {
  console.error("usage: node scripts/blog-outline-lint.mjs <esquema.md>");
  process.exit(2);
}
let markdown;
try {
  markdown = readFileSync(file, "utf8");
} catch (error) {
  console.error(`blog-outline-lint: cannot read ${file}: ${error.message}`);
  process.exit(2);
}
const { ok, errors } = lintOutline(markdown);
if (ok) {
  console.log(`blog-outline-lint: OK ${file}`);
} else {
  for (const e of errors) console.error(`blog-outline-lint: ${e}`);
  process.exit(1);
}
