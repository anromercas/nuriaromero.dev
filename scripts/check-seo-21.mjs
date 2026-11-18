// NRD-26: build contract of /seo-para-ia/ (page, sitemap, llms.txt)
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { seoParaIaFailures } from "./lib/seo-para-ia-contract.mjs";

const dist = process.argv[2]
  ? path.resolve(process.argv[2])
  : fileURLToPath(new URL("../dist/", import.meta.url));

const files = {
  html: path.join(dist, "seo-para-ia", "index.html"),
  sitemap: path.join(dist, "sitemap-0.xml"),
  llms: path.join(dist, "llms.txt"),
};

const input = {};
const failures = [];
for (const [key, file] of Object.entries(files)) {
  try {
    input[key] = await readFile(file, "utf8");
  } catch {
    failures.push(`missing file ${file}`);
  }
}
failures.push(
  ...seoParaIaFailures(input).filter(
    (f) => !/^missing (page html|sitemap|llms\.txt)$/.test(f),
  ),
);

if (failures.length > 0) {
  for (const failure of failures) console.error(`SEO-21: ${failure}`);
  process.exit(1);
}
console.log("SEO-21: /seo-para-ia/ contract passed");
