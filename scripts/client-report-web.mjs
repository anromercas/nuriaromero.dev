#!/usr/bin/env node
// client-report-web.mjs - the web figures of one month for the team-harness monthly client report
// (seo.clientReport.metricsCommand). Prints { "figures": [...] } as JSON on stdout.
//
// Usage: node scripts/client-report-web.mjs --from YYYY-MM-DD --to YYYY-MM-DD
//
// Sources, read-only, through the claude-seo service-account launcher ~/.config/claude-seo/run.sh:
//   - Search Console (gsc_query, daily rows): clicks and impressions of the month and of the month before.
//   - GA4 (ga4_report organic, daily rows): organic search sessions of the month and of the month before.
// A source that fails is left out (the report shows "no data this month"); nothing is estimated.

import { spawnSync } from "node:child_process";
import { homedir } from "node:os";
import { join } from "node:path";

const DATE = /^\d{4}-\d{2}-\d{2}$/;
// CLIENT_REPORT_RUN replaces the launcher in tests.
const RUN =
  process.env.CLIENT_REPORT_RUN ||
  join(homedir(), ".config", "claude-seo", "run.sh");

function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  const value = i === -1 ? undefined : process.argv[i + 1];
  if (!DATE.test(value ?? "")) {
    console.error(`--${name} YYYY-MM-DD is required`);
    process.exit(2);
  }
  return value;
}

const pad = (n) => String(n).padStart(2, "0");
const iso = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** The calendar month before the one holding `from`. */
function previousRange(from) {
  const [y, m] = from.split("-").map(Number);
  return { from: iso(new Date(y, m - 2, 1)), to: iso(new Date(y, m - 1, 0)) };
}

function run(args) {
  const r = spawnSync(RUN, args, {
    encoding: "utf8",
    timeout: 90000,
    maxBuffer: 8 * 1024 * 1024,
  });
  if (r.status !== 0)
    throw new Error(
      (r.stderr || r.error?.message || "failed").trim().split("\n").pop(),
    );
  return JSON.parse(r.stdout);
}

function gscTotals(range) {
  const doc = run([
    "gsc_query",
    "--start-date",
    range.from,
    "--end-date",
    range.to,
    "--dimensions",
    "date",
    "--json",
  ]);
  const rows = Array.isArray(doc.rows) ? doc.rows : [];
  return {
    clicks: rows.reduce((s, r) => s + (r.clicks ?? 0), 0),
    impressions: rows.reduce((s, r) => s + (r.impressions ?? 0), 0),
  };
}

function ga4Sessions(ranges) {
  const earliest = ranges.map((r) => r.from).sort()[0];
  const days =
    Math.ceil(
      (Date.now() - new Date(`${earliest}T00:00:00`).getTime()) / 86400000,
    ) + 1;
  const doc = run([
    "ga4_report",
    "--report",
    "organic",
    "--days",
    String(days),
    "--json",
  ]);
  if (doc.error) throw new Error(doc.error);
  const daily = (doc.daily_data ?? []).map((d) => ({
    date: `${d.date.slice(0, 4)}-${d.date.slice(4, 6)}-${d.date.slice(6, 8)}`,
    sessions: d.sessions ?? 0,
  }));
  return ranges.map((r) =>
    daily
      .filter((d) => d.date >= r.from && d.date <= r.to)
      .reduce((s, d) => s + d.sessions, 0),
  );
}

const month = { from: arg("from"), to: arg("to") };
const before = previousRange(month.from);
const figures = [];
const span = `${month.from}..${month.to}`;

try {
  const now = gscTotals(month);
  const prev = gscTotals(before);
  figures.push({
    id: "web-google-clicks",
    label: "visits to the website from Google search results (clicks)",
    value: now.clicks,
    previous: prev.clicks,
    better: "higher",
    source: `Search Console ${span}`,
  });
  figures.push({
    id: "web-google-appearances",
    label: "times the website was shown in Google search results (impressions)",
    value: now.impressions,
    previous: prev.impressions,
    better: "higher",
    source: `Search Console ${span}`,
  });
} catch (e) {
  console.error(`Search Console: ${e.message}`);
}

try {
  const [now, prev] = ga4Sessions([month, before]);
  figures.push({
    id: "web-organic-visits",
    label:
      "visits to the website that came from search engines (organic sessions)",
    value: now,
    previous: prev,
    better: "higher",
    source: `GA4 ${span}`,
  });
} catch (e) {
  console.error(`GA4: ${e.message}`);
}

console.log(JSON.stringify({ figures }, null, 2));
