// NRD-236: og:url build guard (scripts/lib/og-url.mjs + scripts/check-seo-20.mjs).
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { isNoindex, ogUrlProblems } from "../scripts/lib/og-url.mjs";

const root = new URL("../", import.meta.url);
const URL_OK = "https://nuriaromero.dev/seo-local-sevilla/";

const page = ({
  canonical = URL_OK,
  og = [URL_OK],
  robots = null,
  extra = "",
} = {}) =>
  `<!doctype html><html><head>` +
  (robots ? `<meta name="robots" content="${robots}">` : "") +
  (canonical ? `<link rel="canonical" href="${canonical}">` : "") +
  og.map((u) => `<meta property="og:url" content="${u}">`).join("") +
  extra +
  `</head><body></body></html>`;

const notFound = (robots = "noindex, nofollow", extra = "") =>
  page({ canonical: null, og: [], robots, extra });

test("valid indexable service page has no problems", () => {
  assert.deepEqual(ogUrlProblems(page()), []);
});

test("missing og:url is reported", () => {
  const p = ogUrlProblems(page({ og: [] }));
  assert.ok(p.length > 0);
  assert.ok(p.some((m) => /missing og:url/.test(m)));
});

test("mismatched, duplicated and slashless og:url are reported", () => {
  assert.ok(
    ogUrlProblems(page({ og: ["https://nuriaromero.dev/otra/"] })).length > 0,
  );
  assert.ok(ogUrlProblems(page({ og: [URL_OK, URL_OK] })).length > 0);
  const noSlash = "https://nuriaromero.dev/seo-local-sevilla";
  assert.ok(
    ogUrlProblems(page({ canonical: noSlash, og: [noSlash] })).length > 0,
  );
});

test("attribute order does not matter", () => {
  const html = `<head><link href="${URL_OK}" rel="canonical"><meta content="${URL_OK}" property="og:url"></head>`;
  assert.deepEqual(ogUrlProblems(html), []);
});

test("clean noindex pages have no problems", () => {
  assert.deepEqual(ogUrlProblems(notFound("noindex, nofollow")), []);
  assert.deepEqual(ogUrlProblems(notFound("noindex,nofollow")), []);
  assert.equal(isNoindex(notFound("noindex,nofollow")), true);
  assert.equal(isNoindex(page()), false);
});

test("noindex page with og:url or canonical is reported", () => {
  const withOg = page({
    canonical: null,
    og: [URL_OK],
    robots: "noindex, nofollow",
  });
  assert.ok(ogUrlProblems(withOg).length > 0);
  const withCanonical = page({
    canonical: URL_OK,
    og: [],
    robots: "noindex, nofollow",
  });
  assert.ok(ogUrlProblems(withCanonical).length > 0);
});

test("og:url inside JSON-LD, scripts and comments is ignored", () => {
  const extra = `<script type="application/ld+json">{"x":"<meta property=\\"og:url\\" content=\\"https://x.dev/\\">"}</script><!-- <meta property="og:url" content="https://y.dev/"> -->`;
  assert.deepEqual(ogUrlProblems(page({ extra })), []);
  assert.deepEqual(ogUrlProblems(notFound("noindex, nofollow", extra)), []);
});

test("package.json wires the check-seo-20 pair last in check:seo:dist", () => {
  const { scripts } = JSON.parse(readFileSync(new URL("package.json", root)));
  assert.equal(
    scripts["check:seo-20"],
    "pnpm build && node scripts/check-seo-20.mjs",
  );
  assert.equal(scripts["check:seo-20:dist"], "node scripts/check-seo-20.mjs");
  assert.ok(
    scripts["check:seo:dist"].endsWith(" && node scripts/check-seo-20.mjs"),
  );
  assert.ok(existsSync(new URL("scripts/check-seo-20.mjs", root)));
});

const distDir = new URL("dist/", root);
test(
  "built dist: every html has a valid og:url state",
  { skip: !existsSync(new URL("index.html", distDir)) },
  () => {
    const walk = (dir) =>
      readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
        const p = path.join(dir, e.name);
        return e.isDirectory() ? walk(p) : p.endsWith(".html") ? [p] : [];
      });
    const files = walk(distDir.pathname);
    let indexable = 0;
    for (const f of files) {
      const html = readFileSync(f, "utf8");
      assert.deepEqual(ogUrlProblems(html), [], f);
      if (!isNoindex(html)) indexable++;
    }
    assert.ok(indexable > 0);
  },
);
