// URL inventory (NRD-22): one row per <loc> in dist/sitemap-0.xml with on-page
// columns measured from the build. Optional Search Console columns come from
// JSON exports kept outside the repo; this script never calls Google.
//
// Usage: pnpm build && pnpm seo:inventory [--gsc <file>] [--inspect <file>] [--json]
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  parseSitemapPaths,
  parsePage,
  countInboundLinks,
  classifyPath,
  topQueriesByPage,
  fromGscExport,
  fromInspectExport,
} from "./lib/seo-inventory.mjs";

const root = new URL("../", import.meta.url);
const origin = "https://nuriaromero.dev";

function arg(name) {
  const i = process.argv.indexOf(name);
  return i === -1 ? null : process.argv[i + 1];
}

const dist = fileURLToPath(new URL("dist/", root));
const sitemapFile = `${dist}sitemap-0.xml`;
if (!existsSync(sitemapFile)) {
  console.error("dist/sitemap-0.xml not found: run `pnpm build` first.");
  process.exit(1);
}

const intents = await import(new URL("src/data/seo-intents.ts", root));
const paths = parseSitemapPaths(readFileSync(sitemapFile, "utf8"), origin);

const pages = new Map();
for (const path of paths) {
  const file = `${dist}${path.slice(1)}index.html`;
  if (!existsSync(file)) {
    console.error(`Missing built page for ${path}`);
    process.exit(1);
  }
  pages.set(path, parsePage(readFileSync(file, "utf8"), origin));
}
const inbound = countInboundLinks(pages);

const gscFile = arg("--gsc");
const gscJson = gscFile ? JSON.parse(readFileSync(gscFile, "utf8")) : null;
const gscRows = gscJson ? fromGscExport(gscJson) : null;
const top = gscRows ? topQueriesByPage(gscRows, 3) : null;

const inspectFile = arg("--inspect");
const coverage = inspectFile
  ? fromInspectExport(JSON.parse(readFileSync(inspectFile, "utf8")))
  : null;

const rows = paths.map((path) => {
  const p = pages.get(path);
  const { status, targetQuery } = classifyPath(path, intents);
  const queries = top
    ? (top.get(path) ?? []).map((r) => ({
        query: r.query,
        impressions: r.impressions,
        position: Math.round(r.position * 10) / 10,
      }))
    : null;
  return {
    url: path,
    status,
    targetQuery,
    title: p.title,
    h1: p.h1,
    h1Count: p.h1.length,
    metaDescriptionLength: p.metaDescriptionLength,
    canonical: p.canonical,
    mainWordCount: p.mainWordCount,
    inbound: inbound.get(path) ?? 0,
    coverage: coverage?.get(path)?.coverageState ?? "N/D",
    lastCrawl: coverage?.get(path)?.lastCrawl ?? null,
    topQueries: queries,
  };
});

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(rows, null, 2));
} else {
  const cell = (v) => String(v).replace(/\|/g, "\\|");
  const gscCell = (r) => {
    if (r.topQueries === null) return "N/D";
    if (r.topQueries.length === 0) return "N/D: sin impresiones";
    return r.topQueries
      .map((q) => `${q.query} (${q.impressions} imp, pos ${q.position})`)
      .join("<br>");
  };
  console.log(
    "| URL | Status | Target query | Title | H1 (count) | Meta len | Canonical | Words | Inbound | Coverage | Top queries |",
  );
  console.log("|---|---|---|---|---|---|---|---|---|---|---|");
  for (const r of rows) {
    console.log(
      `| ${[
        r.url,
        r.status,
        r.targetQuery,
        r.title,
        `${r.h1.join(" / ")} (${r.h1Count})`,
        r.metaDescriptionLength,
        r.canonical ?? "none",
        r.mainWordCount,
        r.inbound,
        r.lastCrawl ? `${r.coverage} (crawl ${r.lastCrawl})` : r.coverage,
        gscCell(r),
      ]
        .map(cell)
        .join(" | ")} |`,
    );
  }
}
