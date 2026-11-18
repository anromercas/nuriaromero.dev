import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const { internalLinksBySource } = await import(
  new URL("../src/data/internal-links.ts", import.meta.url)
);
const { reciprocalLinks } = await import(
  new URL("../src/data/seo-intents.ts", import.meta.url)
);

// ADR 0013 table A, rows 1-11.
const rows = [
  [
    "/diseno-web-sevilla/",
    "/desarrollo-software-medida/",
    "aplicaciones web a medida para tu empresa",
  ],
  [
    "/desarrollo-software-medida/",
    "/diseno-web-sevilla/",
    "diseño web para negocios en Sevilla",
  ],
  [
    "/inteligencia-artificial/",
    "/desarrollo-software-medida/",
    "desarrollo de software a medida para empresas",
  ],
  [
    "/diseno-web-sevilla/",
    "/portfolio/",
    "casos de éxito de webs para negocios en Sevilla",
  ],
  ["/", "/portfolio/", "casos de éxito de webs para negocios locales"],
  [
    "/blog/pagina-web-para-restaurantes-que-necesita/",
    "/diseno-web-sevilla/",
    "diseño web para negocios locales en Sevilla",
  ],
  [
    "/tienda-online-sevilla/",
    "/seo-local-sevilla/",
    "SEO para que encuentren tu tienda online en Sevilla",
  ],
  [
    "/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/",
    "/seo-para-ia/",
    "servicio de SEO para IA",
  ],
  [
    "/seo-para-ia/",
    "/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/",
    "guía sobre qué es el GEO",
  ],
  [
    "/seo-para-ia/",
    "/seo-local-sevilla/",
    "SEO local para negocios en Sevilla",
  ],
  [
    "/seo-local-sevilla/",
    "/seo-para-ia/",
    "SEO para IA y visibilidad en respuestas generativas",
  ],
];

test("ADR 0013 table A rows 1-11 exist as contextual links", () => {
  rows.forEach(([source, path, anchor], index) => {
    const found = (internalLinksBySource[source] ?? []).filter(
      (link) => link.path === path && link.anchor === anchor,
    );
    assert.equal(found.length, 1, `row ${index + 1}: ${source} -> ${path}`);
    assert.equal(found[0].kind, "contextual", `row ${index + 1} kind`);
  });
});

test("new contextual rows sit before the conversion row of their source", () => {
  for (const [source] of rows) {
    const kinds = internalLinksBySource[source].map((link) => link.kind);
    const lastContextual = kinds.lastIndexOf("contextual");
    const firstConversion = kinds.indexOf("conversion");
    if (firstConversion !== -1) {
      assert.ok(lastContextual < firstConversion, `${source} order`);
    }
  }
});

test("row 7 replaced the old tienda-online anchor in place", () => {
  const links = internalLinksBySource["/tienda-online-sevilla/"];
  assert.equal(
    links.some(
      (link) => link.anchor === "SEO local para atraer clientes de tu zona",
    ),
    false,
  );
  assert.equal(links[2].path, "/seo-local-sevilla/");
});

test("ADR 0013 table D pairs exist", () => {
  const pairs = [
    {
      source: "/diseno-web-sevilla/",
      target: "/desarrollo-software-medida/",
      sourceAnchor: "aplicaciones web a medida para tu empresa",
      targetAnchor: "diseño web para negocios en Sevilla",
    },
    {
      source: "/blog/como-aparecer-en-google-maps-negocio-sevilla/",
      target: "/seo-local-sevilla/",
      sourceAnchor: "servicio de SEO local y GEO",
      targetAnchor: "guía para mejorar tu ficha de Google Maps",
    },
    {
      source: "/automatizaciones/",
      target: "/inteligencia-artificial/",
      sourceAnchor: "chatbots y soluciones con IA",
      targetAnchor: "automatizaciones conectadas con tu negocio",
    },
    {
      source: "/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/",
      target: "/seo-para-ia/",
      sourceAnchor: "servicio de SEO para IA",
      targetAnchor: "guía sobre qué es el GEO",
    },
    {
      source: "/seo-local-sevilla/",
      target: "/seo-para-ia/",
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

function parseTableA(markdown) {
  const lines = markdown.split("\n");
  const start = lines.findIndex((line) =>
    line.startsWith("_A. `internalLinksBySource`"),
  );
  assert.notEqual(start, -1, "ADR 0013 section A not found");
  const end = lines.findIndex(
    (line, index) => index > start && line.startsWith("_B."),
  );
  const clean = (cell) =>
    cell
      .replace(/`/g, "")
      .replace(/\s*\((edit existing row|P1)\)\s*$/, "")
      .trim();
  const parsed = new Map();
  for (const line of lines.slice(start, end === -1 ? undefined : end)) {
    const cells = line.split("|").map((cell) => cell.trim());
    if (!/^\d+$/.test(cells[1] ?? "")) continue;
    const n = Number(cells[1]);
    if (n < 1 || n > 11) continue;
    parsed.set(n, [clean(cells[2]), clean(cells[3]), clean(cells[5])]);
  }
  return parsed;
}

test("ADR 0013 table A matches the pinned rows", () => {
  const adr = readFileSync(
    new URL("../docs/adr/0013-seo-site-architecture.md", import.meta.url),
    "utf8",
  );
  const parsed = parseTableA(adr);
  assert.equal(parsed.size, 11, "ADR table A must list rows 1-11");
  rows.forEach((expected, index) => {
    assert.deepEqual(
      parsed.get(index + 1),
      expected,
      `ADR 0013 table A row ${index + 1} differs from the pinned row`,
    );
  });
});
