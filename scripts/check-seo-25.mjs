// NRD-328: every blog cover has alt text, intrinsic dimensions and generated
// files that exist and weigh at most 100 KB.
import { readdir, readFile } from "node:fs/promises";
import { statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { blogCoverFailures } from "./lib/blog-cover-contract.mjs";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));
const blogDir = path.join(dist, "blog");

const pages = [];
let entries = [];
try {
  entries = await readdir(blogDir, { withFileTypes: true });
} catch {
  console.error("check-seo-25: dist/blog is missing; run the build first");
  process.exit(1);
}
for (const entry of entries
  .filter((e) => e.isDirectory())
  .sort((a, b) => a.name.localeCompare(b.name))) {
  const file = path.join(blogDir, entry.name, "index.html");
  const html = await readFile(file, "utf8").catch(() => null);
  if (html !== null) pages.push({ route: `/blog/${entry.name}/`, html });
}

const fileSize = (url) => {
  try {
    const clean = url.split(/[?#]/)[0];
    const target = path.join(dist, clean);
    if (!target.startsWith(dist)) return undefined;
    return statSync(target).size;
  } catch {
    return undefined;
  }
};

const { failures, covers } = blogCoverFailures({ pages, fileSize });
if (failures.length) {
  for (const f of failures) console.error(`check-seo-25: ${f}`);
  process.exit(1);
}
console.log(`check-seo-25: ${covers} covers checked`);
