import test from "node:test";
import assert from "node:assert/strict";

const { internalLinksBySource } = await import(
  new URL("../src/data/internal-links.ts", import.meta.url)
);
const { intentMatrix, keywordOwners, serviceRoutes, reciprocalLinks } =
  await import(new URL("../src/data/seo-intents.ts", import.meta.url));
const { seoParaIa } = await import(
  new URL("../src/data/services.ts", import.meta.url)
);

const GEO_POST = "/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/";
const PAGE = "/seo-para-ia/";

// [source, path, anchor, kind] from design.md "Rows".
const rows = [
  ["/", PAGE, "SEO para IA y GEO", "contextual"],
  [
    "/seo-local-sevilla/",
    PAGE,
    "SEO para IA y visibilidad en respuestas generativas",
    "contextual",
  ],
  [GEO_POST, PAGE, "servicio de SEO para IA", "contextual"],
  ["/inteligencia-artificial/", PAGE, "SEO para IA", "contextual"],
  [PAGE, GEO_POST, "guía sobre qué es el GEO", "contextual"],
  [
    PAGE,
    "/seo-local-sevilla/",
    "SEO local para negocios en Sevilla",
    "contextual",
  ],
  [PAGE, "/sobre-mi/", "quién soy y cómo trabajo", "contextual"],
  [PAGE, "/diseno-web-sevilla/", "una web bien construida", "contextual"],
  [PAGE, "/contacto/", "cuéntame cómo te encuentran hoy", "conversion"],
];

test("every design row exists once with its exact anchor and kind", () => {
  for (const [source, path, anchor, kind] of rows) {
    const found = (internalLinksBySource[source] ?? []).filter(
      (l) => l.path === path,
    );
    assert.equal(found.length, 1, `${source} -> ${path} exactly once`);
    assert.equal(found[0].anchor, anchor, `${source} -> ${path} anchor`);
    assert.equal(found[0].kind, kind, `${source} -> ${path} kind`);
  }
});

test("contextual rows sit before the conversion row of their source", () => {
  for (const source of new Set(rows.map((r) => r[0]))) {
    const kinds = internalLinksBySource[source].map((l) => l.kind);
    const firstConversion = kinds.indexOf("conversion");
    if (firstConversion !== -1) {
      assert.ok(kinds.lastIndexOf("contextual") < firstConversion, source);
      assert.equal(
        firstConversion,
        kinds.length - 1,
        `${source} conversion last`,
      );
    }
  }
});

test("the new page block has no row to the home", () => {
  const block = internalLinksBySource[PAGE];
  assert.ok(block, "block exists");
  assert.equal(
    block.some((l) => l.path === "/"),
    false,
  );
  assert.equal(block.length, 5);
});

test("anchor rules across all sources", () => {
  for (const [source, links] of Object.entries(internalLinksBySource)) {
    for (const l of links) {
      if (/consultor SEO en Sevilla/i.test(l.anchor)) {
        assert.equal(l.path, "/", `${source}: consultor anchor only to /`);
      }
      if (l.path === "/seo-local-sevilla/") {
        assert.doesNotMatch(
          l.anchor,
          /seo para ia|posicionamiento en ia/i,
          source,
        );
      }
      if (l.path === PAGE) {
        assert.doesNotMatch(l.anchor, /consultor|seo local/i, source);
      }
    }
  }
});

test("existing rows of touched sources keep their relative order", () => {
  assert.equal(internalLinksBySource["/"][0].path, GEO_POST);
  assert.equal(internalLinksBySource["/"][1].path, PAGE);
  assert.equal(internalLinksBySource["/"].length, 10);
  assert.equal(internalLinksBySource["/inteligencia-artificial/"].length, 6);
  assert.equal(internalLinksBySource["/seo-local-sevilla/"].length, 10);
  assert.equal(internalLinksBySource[GEO_POST].length, 6);
});

test("intent row matches the merged page copy", () => {
  const row = intentMatrix.find((r) => r.url === PAGE);
  assert.ok(row, "intent row exists");
  assert.deepEqual(row, {
    url: PAGE,
    intent:
      "Commercial: contract SEO for AI answers (GEO/AEO), national scope; does not target Seville-qualified queries",
    topic: "servicio de SEO para IA y GEO",
    cta: "Book a call",
    titleSignal: "SEO para IA",
    descriptionSignal: "ChatGPT, Gemini",
    h1Signal: "SEO para IA",
    contentSignals: [
      "Qué trabajo para que una IA entienda tu negocio",
      "Cómo trabajamos el SEO para IA",
    ],
  });
  assert.ok(seoParaIa.seo.title.includes(row.titleSignal));
  assert.ok(seoParaIa.hero.h1.includes(row.h1Signal));
  assert.ok(seoParaIa.seo.description.includes(row.descriptionSignal));
  const titles = Object.values(seoParaIa.sectionTitles);
  for (const signal of row.contentSignals) {
    assert.ok(
      titles.some((t) => t.includes(signal)),
      signal,
    );
  }
});

test("the /seo-local-sevilla/ intent row is unchanged", () => {
  assert.deepEqual(
    intentMatrix.find((r) => r.url === "/seo-local-sevilla/"),
    {
      url: "/seo-local-sevilla/",
      intent: "Commercial: hire an SEO local and GEO implementation service",
      topic: "servicio de SEO local y GEO en Sevilla",
      cta: "Request a proposal",
      titleSignal: "SEO local Sevilla",
      descriptionSignal: "desde 300 €/mes",
      h1Signal: "SEO local Sevilla",
      contentSignals: [
        "Posicionamiento web en Sevilla: Google y Google Maps",
        "Cómo trabajamos el SEO local en Sevilla",
        "¿Agencia SEO en Sevilla o consultora?",
        "Cuánto cuesta el SEO local en Sevilla",
      ],
    },
  );
});

test("ownership and service route registered", () => {
  for (const keyword of ["posicionamiento en ia", "seo para ia"]) {
    const owners = keywordOwners.filter((o) => o.keyword === keyword);
    assert.equal(owners.length, 1, keyword);
    assert.equal(owners[0].url, PAGE);
  }
  assert.ok(serviceRoutes.includes(PAGE));
});

test("both reciprocal pairs exist", () => {
  const pairs = [
    {
      source: GEO_POST,
      target: PAGE,
      sourceAnchor: "servicio de SEO para IA",
      targetAnchor: "guía sobre qué es el GEO",
    },
    {
      source: "/seo-local-sevilla/",
      target: PAGE,
      sourceAnchor: "SEO para IA y visibilidad en respuestas generativas",
      targetAnchor: "SEO local para negocios en Sevilla",
    },
  ];
  for (const pair of pairs) {
    assert.ok(
      reciprocalLinks.some((p) => JSON.stringify(p) === JSON.stringify(pair)),
      `missing pair ${pair.source} <-> ${pair.target}`,
    );
  }
});
