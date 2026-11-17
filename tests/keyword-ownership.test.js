import test from "node:test";
import assert from "node:assert/strict";

const intents = await import(
  new URL("../src/data/seo-intents.ts", import.meta.url)
);
const { keywordOwners = [], intentMatrix, serviceRoutes } = intents;

const normalise = (keyword) =>
  keyword
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ")
    .trim();

test("keywordOwners records the local head terms", () => {
  const owners = Object.fromEntries(
    keywordOwners.map(({ keyword, url }) => [keyword, url]),
  );

  assert.deepEqual(owners, {
    "consultor seo sevilla": "/",
    "seo local sevilla": "/seo-local-sevilla/",
    "agencia seo sevilla": "/seo-local-sevilla/",
    "posicionamiento web sevilla": "/seo-local-sevilla/",
    "diseño tienda online sevilla": "/tienda-online-sevilla/",
    "diseño web sevilla": "/diseno-web-sevilla/",
    "desarrollo de software a medida sevilla": "/desarrollo-software-medida/",
    "inteligencia artificial para empresas sevilla":
      "/inteligencia-artificial/",
    "posicionamiento en ia": "/seo-para-ia/",
    "seo para ia": "/seo-para-ia/",
    "como aparecer en google maps":
      "/blog/como-aparecer-en-google-maps-negocio-sevilla/",
    "cuanto cuesta una pagina web en sevilla":
      "/blog/cuanto-cuesta-una-pagina-web-en-sevilla/",
  });
});

test("no head term has two owners", () => {
  const seen = new Map();
  for (const { keyword, url } of keywordOwners) {
    const key = normalise(keyword);
    assert.ok(
      !seen.has(key),
      `"${keyword}" is owned twice: ${seen.get(key)} and ${url}`,
    );
    seen.set(key, url);
  }
});

test("every owner is a real page in trailing-slash form", () => {
  const known = new Set([
    "/",
    ...intentMatrix.map((row) => row.url),
    ...serviceRoutes,
  ]);
  assert.ok(keywordOwners.length > 0, "keywordOwners is empty");
  for (const { keyword, url } of keywordOwners) {
    assert.ok(url.endsWith("/"), `${keyword}: ${url} lacks the trailing slash`);
    assert.ok(known.has(url), `${keyword}: ${url} is not a known route`);
  }
});

const {
  normaliseTerm,
  routeOf,
  LISTING_CARD_EXEMPTION,
  targetedTexts,
  findOwnershipViolations,
} = await import(
  new URL("../scripts/lib/keyword-ownership.mjs", import.meta.url)
);

const page = (body, title = "Página") =>
  `<html><head><title>${title}</title></head><body><main>${body}</main></body></html>`;
const owners = (...rows) => rows.map(([keyword, url]) => ({ keyword, url }));

test("normaliseTerm folds case, accents and punctuation", () => {
  assert.equal(
    normaliseTerm("  Diseño tienda online, Sevilla "),
    "diseno tienda online sevilla",
  );
});

test("routeOf maps built files to routes", () => {
  assert.equal(routeOf("index.html"), "/");
  assert.equal(routeOf("blog/index.html"), "/blog/");
  assert.equal(routeOf("a/b/index.html"), "/a/b/");
});

test("a second page using a registered term in an H2 is a violation", () => {
  const pages = new Map([
    ["/seo-local-sevilla/", page("<h1>SEO local Sevilla</h1>")],
    [
      "/diseno-web-sevilla/",
      page("<h1>Diseño web</h1><h2>Agencia SEO Sevilla para tu web</h2>"),
    ],
  ]);
  const violations = findOwnershipViolations(
    pages,
    owners(["agencia seo sevilla", "/seo-local-sevilla/"]),
  );
  assert.equal(violations.length, 1);
  assert.equal(violations[0].route, "/diseno-web-sevilla/");
  assert.equal(violations[0].element, "h2");
  assert.equal(violations[0].keyword, "agencia seo sevilla");
  assert.equal(violations[0].owner, "/seo-local-sevilla/");
});

test("accents, case and punctuation do not hide a title match", () => {
  const pages = new Map([
    ["/otra/", page("<h1>Otra</h1>", "Diseno tienda online, Sevilla")],
  ]);
  const violations = findOwnershipViolations(
    pages,
    owners(["diseño tienda online sevilla", "/tienda-online-sevilla/"]),
  );
  assert.equal(violations.length, 1);
  assert.equal(violations[0].element, "title");
});

test("the owner itself is never a violation", () => {
  const pages = new Map([
    [
      "/seo-local-sevilla/",
      page("<h1>SEO local Sevilla</h1>", "SEO local Sevilla"),
    ],
  ]);
  assert.deepEqual(
    findOwnershipViolations(
      pages,
      owners(["seo local sevilla", "/seo-local-sevilla/"]),
    ),
    [],
  );
});

test("body text and H3 do not count", () => {
  const pages = new Map([
    [
      "/otra/",
      page("<h1>Otra</h1><p>seo local sevilla</p><h3>SEO local Sevilla</h3>"),
    ],
  ]);
  assert.deepEqual(
    findOwnershipViolations(
      pages,
      owners(["seo local sevilla", "/seo-local-sevilla/"]),
    ),
    [],
  );
});

const card = (href) =>
  `<a href="${href}"><h2>Cómo aparecer en Google Maps si tienes un negocio en Sevilla</h2></a>`;
const mapsOwner = owners([
  "como aparecer en google maps",
  "/blog/como-aparecer-en-google-maps-negocio-sevilla/",
]);

test("the /blog/ listing exemption is a named rule", () => {
  assert.equal(LISTING_CARD_EXEMPTION.route, "/blog/");
  assert.ok(LISTING_CARD_EXEMPTION.cardHref.test("/blog/x/"));
  assert.ok(LISTING_CARD_EXEMPTION.cardHref.test("/blog/x"));
});

test("/blog/ card headings inside post links are exempt, with or without trailing slash", () => {
  for (const href of ["/blog/x/", "/blog/x"]) {
    const pages = new Map([["/blog/", page(`<h1>Blog</h1>${card(href)}`)]]);
    assert.deepEqual(findOwnershipViolations(pages, mapsOwner), [], href);
  }
});

test("the same heading outside a card link on /blog/ is a violation", () => {
  const pages = new Map([
    [
      "/blog/",
      page(
        "<h1>Blog</h1><h2>Cómo aparecer en Google Maps si tienes un negocio en Sevilla</h2>",
      ),
    ],
  ]);
  const violations = findOwnershipViolations(pages, mapsOwner);
  assert.equal(violations.length, 1);
  assert.equal(violations[0].element, "h2");
});

test("card markup on another route is a violation", () => {
  const pages = new Map([
    ["/recursos/", page(`<h1>Recursos</h1>${card("/blog/x/")}`)],
  ]);
  assert.equal(findOwnershipViolations(pages, mapsOwner).length, 1);
});

test("targetedTexts collects title, every H1 and every H2 as visible text", () => {
  const texts = targetedTexts(
    page("<h1>A &amp; <em>B</em></h1><h1>C</h1><h2>D</h2>", "T"),
    "/x/",
  );
  assert.deepEqual(texts, { title: "T", h1: ["A & B", "C"], h2: ["D"] });
});

test("the finder is registry-driven: a sixth fixture term is checked", () => {
  const registry = owners(
    ["seo local sevilla", "/seo-local-sevilla/"],
    ["termino nuevo", "/dueno/"],
  );
  const pages = new Map([
    ["/dueno/", page("<h1>Termino nuevo</h1>")],
    ["/otra/", page("<h1>Otra</h1><h2>Un termino nuevo aquí</h2>")],
  ]);
  const violations = findOwnershipViolations(pages, registry);
  assert.equal(violations.length, 1);
  assert.equal(violations[0].keyword, "termino nuevo");
});
