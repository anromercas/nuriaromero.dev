// NRD-246: the AI discovery files (ai.txt, summary.json, faq.json) never drift from
// the published FAQPage, the prices in src/data, robots.txt or the sitemap.
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  aiTxtFailures,
  faqFailures,
  priceFailures,
  sitemapFailures,
} from "./lib/ai-discovery-contract.mjs";
import { services } from "../src/data/services.ts";
import { niches } from "../src/data/niches.ts";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));
const errors = [];
const fail = (msg) => errors.push(msg);

async function walk(dir, ext) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p, ext)));
    else if (e.name.endsWith(ext)) out.push(p);
  }
  return out;
}

const readText = (rel) =>
  readFile(path.join(dist, rel), "utf8").catch(() => {
    fail(`dist/${rel} is missing`);
    return null;
  });
const readJson = async (rel) => {
  const text = await readText(rel);
  if (text === null) return null;
  try {
    return JSON.parse(text);
  } catch (err) {
    fail(`dist/${rel} is not valid JSON: ${err.message}`);
    return null;
  }
};

const aiTxt = await readText(".well-known/ai.txt");
const robotsTxt = await readText("robots.txt");
const summary = await readJson("ai/summary.json");
const faqJson = await readJson("ai/faq.json");

if (aiTxt !== null && robotsTxt !== null)
  errors.push(...aiTxtFailures({ aiTxt, robotsTxt }));

if (summary) errors.push(...priceFailures({ summary, services, niches }));

let pageCount = 0;
if (faqJson) {
  const files = (await walk(dist, ".html")).filter(
    (f) => !path.relative(dist, f).startsWith("informes" + path.sep),
  );
  const pages = [];
  for (const file of files.sort()) {
    const rel = path.relative(dist, file).split(path.sep).join("/");
    const route = "/" + rel.replace(/(^|\/)index\.html$/, "$1");
    pages.push({ route, html: await readFile(file, "utf8") });
  }
  pageCount = faqJson.pages?.length ?? 0;
  errors.push(...faqFailures({ faqJson, pages }));
}

const sitemaps = (await walk(dist, ".xml")).filter((p) =>
  path.basename(p).startsWith("sitemap-"),
);
for (const file of sitemaps) {
  for (const f of sitemapFailures(await readFile(file, "utf8")))
    fail(`${path.relative(dist, file)}: ${f}`);
}

if (errors.length) {
  for (const e of errors) console.error(`check-seo-24: ${e}`);
  process.exit(1);
}
console.log(
  `check-seo-24: ai.txt matches robots.txt; faq.json mirrors the FAQPage of ${pageCount} pages; prices match src/data; sitemap omits the AI files`,
);
