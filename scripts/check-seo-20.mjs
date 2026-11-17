// NRD-236: every built page keeps a consistent og:url (indexable) or none (noindex).
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isNoindex, ogUrlProblems } from "./lib/og-url.mjs";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (e.name.endsWith(".html")) out.push(p);
  }
  return out;
}

const files = await walk(dist).catch(() => []);
if (files.length === 0) {
  console.error("check-seo-20: no HTML files in dist/");
  process.exit(1);
}

let indexable = 0;
let noindex = 0;
let failed = false;
for (const f of files.sort()) {
  const html = await readFile(f, "utf8");
  if (isNoindex(html)) noindex++;
  else indexable++;
  for (const problem of ogUrlProblems(html)) {
    console.error(`check-seo-20: ${path.relative(dist, f)}: ${problem}`);
    failed = true;
  }
}
if (indexable === 0) {
  console.error("check-seo-20: no indexable page found");
  failed = true;
}
if (failed) process.exit(1);
console.log(
  `check-seo-20: og:url ok on ${indexable} indexable pages, absent on ${noindex} noindex pages`,
);
