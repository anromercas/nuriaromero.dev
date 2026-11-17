import test from "node:test";
import assert from "node:assert/strict";

const { freshnessFailures } =
  await import("../scripts/lib/freshness-contract.mjs");

const DATE = "2026-11-10T09:30:00+01:00";
const NOW = Date.parse("2026-11-17T12:00:00Z");

const ld = (...entities) =>
  entities
    .map(
      (e) => `<script type="application/ld+json">${JSON.stringify(e)}</script>`,
    )
    .join("");
const webPage = (dateModified) => ({
  "@type": "WebPage",
  url: "https://nuriaromero.dev/x/",
  ...(dateModified ? { dateModified } : {}),
});
const label = (datetime) =>
  `<main><p><time datetime="${datetime}" data-page-updated>noviembre de 2026</time></p></main>`;
const page = (route, html, mtimeMs = NOW) => ({ route, html, mtimeMs });
const run = (pages, sitemap = []) => freshnessFailures({ pages, sitemap });

const postHtml = ({ pub, upd, article }) =>
  `${ld({ "@type": "Article", ...article })}<main><time datetime="${pub}" data-post-published>x</time>${
    upd ? `<time datetime="${upd}" data-post-updated>y</time>` : ""
  }</main>`;

test("a matching label and WebPage dateModified passes and is counted", () => {
  const result = run([page("/x/", ld(webPage(DATE)) + label(DATE))]);
  assert.deepEqual(result.failures, []);
  assert.equal(result.dated, 1);
});

test("pages without any date are valid (shallow build)", () => {
  const result = run([page("/x/", "<main>hola</main>")]);
  assert.deepEqual(result.failures, []);
  assert.equal(result.dated, 0);
});

test("Label and JSON-LD disagree: mismatched datetime fails naming the page", () => {
  const { failures } = run([
    page("/x/", ld(webPage(DATE)) + label("2026-11-11T09:30:00+01:00")),
  ]);
  assert.equal(failures.length, 1);
  assert.match(failures[0], /\/x\//);
});

test("a label without dateModified fails", () => {
  const { failures } = run([page("/x/", ld(webPage()) + label(DATE))]);
  assert.match(failures.join("\n"), /\/x\/.*label/);
});

test("a dateModified later than the build output fails", () => {
  const future = "2026-11-18T09:30:00+01:00";
  const { failures } = run([page("/x/", ld(webPage(future)))]);
  assert.match(failures.join("\n"), /\/x\/.*later/);
});

test("a date without ISO 8601 time zone offset fails", () => {
  const { failures } = run([page("/x/", ld(webPage("2026-11-10")))]);
  assert.match(failures.join("\n"), /\/x\/.*ISO 8601/);
});

test("Legal page: a freshness label or a WebPage on noindex fails", () => {
  const legal = run([page("/privacidad/", ld(webPage(DATE)) + label(DATE))]);
  assert.match(legal.failures.join("\n"), /\/privacidad\//);
  const noindex = run([
    page(
      "/404.html",
      `<meta name="robots" content="noindex, nofollow">${ld(webPage(DATE))}`,
    ),
  ]);
  assert.match(noindex.failures.join("\n"), /404\.html.*noindex/);
});

test("Post with an update date: both <time> equal the Article dates", () => {
  const pub = "2026-06-24T00:00:00.000Z";
  const upd = "2026-08-01T00:00:00.000Z";
  const ok = run([
    page(
      "/blog/a/",
      postHtml({
        pub,
        upd,
        article: { datePublished: pub, dateModified: upd },
      }),
    ),
  ]);
  assert.deepEqual(ok.failures, []);
  const bad = run([
    page(
      "/blog/a/",
      postHtml({
        pub,
        upd: pub,
        article: { datePublished: pub, dateModified: upd },
      }),
    ),
  ]);
  assert.match(bad.failures.join("\n"), /\/blog\/a\//);
});

test("Post without an update date: dateModified must equal datePublished", () => {
  const pub = "2026-06-24T00:00:00.000Z";
  const bad = run([
    page(
      "/blog/a/",
      postHtml({
        pub,
        article: {
          datePublished: pub,
          dateModified: "2026-07-01T00:00:00.000Z",
        },
      }),
    ),
  ]);
  assert.match(bad.failures.join("\n"), /\/blog\/a\//);
});

test("Sitemap coherence: post lastmod equals Article dateModified, others have none", () => {
  const pub = "2026-06-24T00:00:00.000Z";
  const posts = [
    page(
      "/blog/a/",
      postHtml({ pub, article: { datePublished: pub, dateModified: pub } }),
    ),
  ];
  assert.deepEqual(
    run(posts, [{ route: "/blog/a/", lastmod: pub }, { route: "/" }]).failures,
    [],
  );
  const wrong = run(posts, [
    { route: "/blog/a/", lastmod: "2026-01-01T00:00:00.000Z" },
  ]);
  assert.match(wrong.failures.join("\n"), /\/blog\/a\//);
  const stray = run(posts, [{ route: "/", lastmod: pub }]);
  assert.match(stray.failures.join("\n"), /lastmod/);
});
