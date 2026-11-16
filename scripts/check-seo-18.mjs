// NRD-225: every built blog post must keep the contract frozen in the
// baseline (title, description, canonical, Article and BreadcrumbList JSON-LD,
// visible body text and body links). A later story that edits a post on
// purpose regenerates the fixture in the same commit:
//   pnpm build && node scripts/check-seo-18.mjs --write
import assert from "node:assert/strict";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { postContract } from "./lib/post-contract.mjs";

const blogDir = new URL("../dist/blog/", import.meta.url);
const fixtureUrl = new URL(
  "../tests/fixtures/blog-posts.baseline.json",
  import.meta.url,
);

const current = {};
const entries = await readdir(blogDir, { withFileTypes: true });
for (const entry of entries
  .filter((e) => e.isDirectory())
  .sort((a, b) => a.name.localeCompare(b.name))) {
  let html;
  try {
    html = await readFile(new URL(`${entry.name}/index.html`, blogDir), "utf8");
  } catch {
    continue;
  }
  current[entry.name] = postContract(html);
}

if (process.argv.includes("--write")) {
  await writeFile(fixtureUrl, `${JSON.stringify(current, null, 2)}\n`);
  console.log(
    `check-seo-18: baseline written (${Object.keys(current).length} posts)`,
  );
} else {
  const baseline = JSON.parse(await readFile(fixtureUrl, "utf8"));
  assert.deepEqual(
    Object.keys(current),
    Object.keys(baseline),
    "Blog post set differs from the baseline",
  );
  for (const slug of Object.keys(baseline)) {
    for (const field of Object.keys(baseline[slug])) {
      assert.deepEqual(
        current[slug][field],
        baseline[slug][field],
        `${slug}: ${field} differs from the baseline`,
      );
    }
  }
  console.log(
    `check-seo-18: ${Object.keys(current).length} posts match the baseline`,
  );
}
