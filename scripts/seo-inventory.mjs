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

function pathOf(url) {
  const u = new URL(url, origin);
  return u.pathname.endsWith("/") ? u.pathname : `${u.pathname}/`;
}

/** Adapter for the JSON written by `run.sh gsc_query --dimensions page,query --json`. */
export function fromGscExport(json) {
  return (json.rows ?? []).map((r) => ({
    page: pathOf(r.page ?? r.keys?.[0]),
    query: r.query ?? r.keys?.[1],
    clicks: r.clicks,
    impressions: r.impressions,
    position: r.position,
  }));
}

const gscFile = arg("--gsc");
const gscJson = gscFile ? JSON.parse(readFileSync(gscFile, "utf8")) : null;
const gscRows = gscJson ? fromGscExport(gscJson) : null;
const top = gscRows ? topQueriesByPage(gscRows, 3) : null;

// gsc_inspect --batch output: { results: [{ url, ... coverage ... }] }; keys read leniently.
function coverageStates(json) {
  const list = Array.isArray(json)
    ? json
    : (json.results ?? json.inspections ?? []);
  const map = new Map();
  for (const item of list) {
    const url = item.url ?? item.inspectionUrl ?? item.inspected_url;
    const state =
      item.coverage_state ??
      item.coverageState ??
      item.indexStatusResult?.coverageState ??
      item.inspectionResult?.indexStatusResult?.coverageState ??
      item.verdict ??
      "N/D";
    if (url) map.set(pathOf(url), state);
  }
  return map;
}
const inspectFile = arg("--inspect");
const coverage = inspectFile
  ? coverageStates(JSON.parse(readFileSync(inspectFile, "utf8")))
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
    coverage: coverage ? (coverage.get(path) ?? "N/D") : "N/D",
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
        r.coverage,
        gscCell(r),
      ]
        .map(cell)
        .join(" | ")} |`,
    );
  }
}
