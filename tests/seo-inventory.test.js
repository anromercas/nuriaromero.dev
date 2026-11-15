import test from "node:test";
import assert from "node:assert/strict";
import {
  parseSitemapPaths,
  parsePage,
  countInboundLinks,
  classifyPath,
  findCannibalization,
  topQueriesByPage,
  fromGscExport,
  fromInspectExport,
} from "../scripts/lib/seo-inventory.mjs";

const intents = await import(
  new URL("../src/data/seo-intents.ts", import.meta.url)
);

test("parseSitemapPaths returns trailing-slash pathnames in order", () => {
  const xml = `<?xml version="1.0"?><urlset>
    <url><loc>https://nuriaromero.dev/</loc></url>
    <url><loc>https://nuriaromero.dev/seo-local-sevilla/</loc></url>
    <url><loc>https://nuriaromero.dev/blog/post</loc></url>
  </urlset>`;
  assert.deepEqual(parseSitemapPaths(xml), [
    "/",
    "/seo-local-sevilla/",
    "/blog/post/",
  ]);
});

const page = `<!doctype html><html><head>
<title>Diseño &amp; web</title>
<meta name="description" content="Una &quot;descripción&quot; &amp; más">
<link rel="canonical" href="https://nuriaromero.dev/x/">
<style>.a{color:red}</style>
</head><body>
<header><a href="/recursos/">Recursos</a></header>
<main>
  <h1>Uno</h1><h1>Dos <span>b</span></h1>
  <p>Tres cuatro cinco.</p>
  <script>var palabras = "no cuentan";</script>
  <a href="/x/">self</a>
  <a href="/otra/#seccion">frag</a>
  <a href="/otra/?q=1">query</a>
  <a href="/sin-barra">sin barra</a>
  <a href="https://nuriaromero.dev/abs/">abs</a>
  <a href="https://example.com/ext/">ext</a>
  <a href="#ancla">ancla</a>
  <a href="mailto:a@b.c">mail</a>
</main>
<footer><a href="/footer/">F</a> pie pie pie</footer>
</body></html>`;

test("parsePage extracts on-page columns from main only", () => {
  const p = parsePage(page);
  assert.equal(p.title, "Diseño & web");
  assert.deepEqual(p.h1, ["Uno", "Dos b"]);
  assert.equal(p.metaDescriptionLength, 'Una "descripción" & más'.length);
  assert.equal(p.canonical, "https://nuriaromero.dev/x/");
  // Uno Dos b Tres cuatro cinco. self frag query sin barra abs ext ancla mail
  assert.equal(p.mainWordCount, 3 + 3 + 1 + 1 + 1 + 2 + 1 + 1 + 1 + 1);
  assert.deepEqual(p.mainLinks, [
    "/x/",
    "/otra/",
    "/otra/",
    "/sin-barra/",
    "/abs/",
  ]);
});

test("parsePage handles a page without main, canonical or description", () => {
  const p = parsePage(
    "<html><head><title>T</title></head><body>hola</body></html>",
  );
  assert.equal(p.mainWordCount, 0);
  assert.equal(p.canonical, null);
  assert.equal(p.metaDescriptionLength, 0);
  assert.deepEqual(p.mainLinks, []);
});

test("countInboundLinks ignores self links and counts distinct source pages", () => {
  const pages = new Map([
    ["/a/", { mainLinks: ["/a/", "/b/", "/b/"] }],
    ["/b/", { mainLinks: ["/a/"] }],
    ["/recursos/", { mainLinks: [] }],
  ]);
  const inbound = countInboundLinks(pages);
  assert.equal(inbound.get("/a/"), 1);
  assert.equal(inbound.get("/b/"), 1);
  assert.equal(inbound.get("/recursos/"), 0);
});

test("classifyPath assigns status and target query", () => {
  assert.deepEqual(classifyPath("/", intents), {
    status: "in-focus",
    targetQuery: "consultor seo sevilla",
  });
  assert.deepEqual(classifyPath("/seo-local-sevilla/", intents), {
    status: "in-focus",
    targetQuery:
      "seo local sevilla; agencia seo sevilla; posicionamiento web sevilla",
  });
  assert.equal(
    classifyPath("/seo-para-clinicas-capilares-sevilla/", intents).status,
    "parked",
  );
  assert.deepEqual(classifyPath("/web-para-comercios-sevilla/", intents), {
    status: "parked",
    targetQuery: "web para comercios de barrio en Sevilla",
  });
  assert.equal(classifyPath("/privacidad/", intents).status, "legal");
  assert.deepEqual(
    classifyPath("/blog/cuanto-cuesta-una-pagina-web-en-sevilla/", intents),
    {
      status: "support",
      targetQuery: "cuanto cuesta una pagina web en sevilla",
    },
  );
  assert.deepEqual(classifyPath("/contacto/", intents), {
    status: "support",
    targetQuery: "none",
  });
  assert.equal(classifyPath("/automatizaciones/", intents).status, "in-focus");
});

const rows = [
  {
    page: "/",
    query: "seo local sevilla",
    clicks: 0,
    impressions: 5,
    position: 20,
  },
  {
    page: "/seo-local-sevilla/",
    query: "seo local sevilla",
    clicks: 1,
    impressions: 50,
    position: 9,
  },
  { page: "/", query: "consultor", clicks: 0, impressions: 100, position: 30 },
  { page: "/", query: "consultor", clicks: 0, impressions: 10, position: 31 },
  { page: "/a/", query: "x", clicks: 0, impressions: 1, position: 3 },
  { page: "/b/", query: "y", clicks: 0, impressions: 2, position: 4 },
  { page: "/b/", query: "z", clicks: 0, impressions: 9, position: 4 },
  { page: "/b/", query: "w", clicks: 0, impressions: 7, position: 4 },
  { page: "/b/", query: "v", clicks: 0, impressions: 3, position: 4 },
];

test("findCannibalization keeps queries with 2+ distinct pages by impressions", () => {
  const out = findCannibalization(rows);
  assert.equal(out.length, 1);
  assert.equal(out[0].query, "seo local sevilla");
  assert.equal(out[0].pages.length, 2);
});

test("topQueriesByPage returns the top N queries per page by impressions", () => {
  const top = topQueriesByPage(rows, 3);
  assert.deepEqual(
    top.get("/b/").map((r) => r.query),
    ["z", "w", "v"],
  );
  assert.equal(top.get("/a/").length, 1);
});

test("fromGscExport normalises page URLs and keeps the row shape", () => {
  const rows = fromGscExport({
    rows: [
      {
        keys: ["https://nuriaromero.dev/x", "q"],
        page: "https://nuriaromero.dev/x",
        query: "q",
        clicks: 1,
        impressions: 4,
        position: 2.5,
      },
    ],
  });
  assert.deepEqual(rows, [
    { page: "/x/", query: "q", clicks: 1, impressions: 4, position: 2.5 },
  ]);
  assert.deepEqual(fromGscExport({}), []);
});

test("fromInspectExport maps coverage state and last crawl by path", () => {
  const map = fromInspectExport({
    results: [
      {
        url: "https://nuriaromero.dev/a/",
        index_status: {
          coverage_state: "Submitted and indexed",
          last_crawl_time: "2026-11-11T06:05:48Z",
        },
      },
      {
        url: "https://nuriaromero.dev/b/",
        index_status: { coverage_state: "URL is unknown to Google" },
      },
      { url: "https://nuriaromero.dev/c/", error: "boom" },
    ],
  });
  assert.deepEqual(map.get("/a/"), {
    coverageState: "Submitted and indexed",
    lastCrawl: "2026-11-11",
  });
  assert.deepEqual(map.get("/b/"), {
    coverageState: "URL is unknown to Google",
    lastCrawl: null,
  });
  assert.equal(map.get("/c/").coverageState, "N/D");
});
