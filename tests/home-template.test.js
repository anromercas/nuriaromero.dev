import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

const heroMockPath = "src/components/home/HomeHeroMock.astro";
const tileArtPath = "src/components/home/ServiceTileArt.astro";

const svgTags = (source) => source.match(/<svg\b[^>]*>/g) ?? [];

for (const path of [heroMockPath, tileArtPath]) {
  test(`${path} draws single-stroke accessible SVGs`, () => {
    assert.ok(existsSync(new URL(path, root)), `${path} exists`);
    const source = read(path);
    const tags = svgTags(source);
    assert.ok(tags.length > 0, "has at least one svg");
    for (const tag of tags) {
      assert.match(tag, /aria-hidden="true"/, `aria-hidden in ${tag}`);
      assert.match(tag, /focusable="false"/, `focusable=false in ${tag}`);
      assert.match(tag, /stroke-width="1\.5"/, `1.5 stroke in ${tag}`);
      assert.match(tag, /stroke-linecap="round"/, `round caps in ${tag}`);
      assert.match(tag, /stroke-linejoin="round"/, `round joins in ${tag}`);
    }
    const fills = [...source.matchAll(/\sfill="([^"]*)"/g)].map((m) => m[1]);
    for (const fill of fills) {
      assert.ok(
        fill === "none" || fill === "currentColor",
        `no filled icons, found fill="${fill}"`,
      );
    }
    assert.doesNotMatch(
      source,
      /fill:\s*(#|rgb|yellow)/i,
      "no CSS colour fills",
    );
  });
}

test("HomeHeroMock is an honest illustrative figure with a reduced-motion guard", () => {
  const source = read(heroMockPath);
  assert.match(
    source,
    /<figure\b[^>]*aria-label="Ejemplo: tu negocio en el buscador, en el mapa y en un asistente de IA"/,
  );
  assert.match(source, /<figcaption>Ejemplo ilustrativo<\/figcaption>/);
  assert.match(source, /animate\?:\s*boolean/);
  assert.match(source, /animate\s*=\s*true/);
  assert.match(source, /@media \(prefers-reduced-motion: no-preference\)/);
  assert.match(source, /@supports \(animation-timeline: scroll\(\)\)/);
  for (const text of [
    "peluquería en Triana",
    "En el buscador",
    "En el mapa",
    "En un asistente de IA",
    "Tu negocio",
  ]) {
    assert.ok(source.includes(text), `mock text "${text}"`);
  }
  assert.doesNotMatch(
    source,
    /#1\b|yellow|estrella|polygon/i,
    "no rank number, yellow or stars",
  );
});

test("ServiceTileArt offers one drawing per bento service", () => {
  const source = read(tileArtPath);
  for (const kind of [
    "seo-local",
    "diseno-web",
    "tienda-online",
    "software",
    "automatizaciones",
    "ia",
  ]) {
    assert.ok(source.includes(`"${kind}"`), `kind ${kind}`);
  }
  for (const cls of ["signal", "soft", "label"]) {
    assert.match(
      source,
      new RegExp(`class="[^"]*\\b${cls}\\b`),
      `uses .${cls}`,
    );
  }
  for (const label of [
    "correo",
    "hoja",
    "factura",
    "¿Abrís el sábado?",
    "Sí, de 10 a 14 h",
  ]) {
    assert.ok(source.includes(label), `label ${label}`);
  }
});

// --- Home page structure (task 1.2) ---------------------------------------

const home = () => read("src/pages/index.astro");
const main = () => home().match(/<main\b[\s\S]*<\/main>/)?.[0] ?? "";

test("home composes the template section components", () => {
  const src = home();
  for (const name of [
    "SeoLocalHero",
    "ProofStrip",
    "ReviewBento",
    "BentoTile",
    "SeoLocalProcess",
    "RealProof",
    "SeoLocalAgencia",
    "SeoLocalFaq",
    "SeoLocalRelated",
    "SeoLocalClosing",
    "SeoLocalNap",
    "HomeHeroMock",
    "ServiceTileArt",
  ]) {
    assert.match(
      src,
      new RegExp(`import ${name} from "@/components/`),
      `imports ${name}`,
    );
  }
});

test("home drops the legacy gray/yellow world and plans", () => {
  const src = home();
  for (const name of [
    "TitleSection",
    "ProcessSteps",
    "GoogleReviews",
    "CTASection",
    "InternalLinks",
    "Badge",
    "SeoLocalPlans",
    "SocialPill",
    "ProfileCheck",
    "WhatsAppIcon",
    "CodeIcon",
    "Briefcase",
  ]) {
    assert.doesNotMatch(
      src,
      new RegExp(`import ${name}\\b`),
      `no ${name} import`,
    );
  }
  assert.doesNotMatch(
    src,
    /<Image\b|astro:assets|perfil-home/,
    "no raster hero portrait",
  );
  assert.doesNotMatch(
    main(),
    /text-yellow|bg-gray-|text-gray-/,
    "no legacy palette classes",
  );
});

test("home keeps the SEO12 hero markers and a single h1 keyword", () => {
  const src = home();
  assert.match(src, /id="home-hero"/);
  assert.match(src, /seo12-home-hero/);
  assert.match(src, /data-seo12-hero="true"/);
  assert.match(
    src,
    /actionsAttrs=\{\{\s*"data-seo12-primary-cta":\s*""\s*\}\}/,
  );
  assert.match(src, /keyword="Consultor SEO en Sevilla para negocios locales"/);
  assert.doesNotMatch(src, /<h1\b/, "the h1 comes from SeoLocalHero only");
  assert.match(src, /<main class="template-ground px-4 pt-24">/);
  assert.match(src, /<HomeHeroMock slot="visual" \/>/);
  assert.match(src, /<HomeHeroMock slot="visual" animate=\{false\} \/>/);
  assert.match(
    src,
    /secondaryLink=\{\{ label: "Ver qué hago", href: "#que-hago" \}\}/,
  );
});

test("home sections follow the reference order", () => {
  const body = main();
  const order = [
    "<SeoLocalHero",
    "<ProofStrip",
    "<ReviewBento",
    "<SeoLocalProcess",
    "<RealProof",
    "<SeoLocalAgencia",
    "<SeoLocalFaq",
    "<SeoLocalRelated",
    "<SeoLocalClosing",
    "<SeoLocalNap",
  ];
  let last = -1;
  for (const tag of order) {
    const at = body.indexOf(tag);
    assert.ok(at > last, `${tag} appears after the previous section`);
    last = at;
  }
  assert.equal(
    (body.match(/class="band"/g) ?? []).length,
    1,
    "only the process is a band",
  );
  assert.match(
    body,
    /<div class="band">\s*<SectionContainer[^>]*>\s*<SeoLocalProcess/,
  );
});

test("home has six service tiles, each linking to its service route", () => {
  const body = main();
  assert.equal((body.match(/<BentoTile\b/g) ?? []).length, 6);
  assert.match(body, /<SectionContainer id="que-hago">/);
  for (const kind of [
    "seo-local",
    "diseno-web",
    "tienda-online",
    "software",
    "automatizaciones",
    "ia",
  ]) {
    assert.match(
      body,
      new RegExp(`<ServiceTileArt kind="${kind}"`),
      `tile art ${kind}`,
    );
  }
  const links = [
    ...body.matchAll(
      /link=\{\{\s*label: (\w+)\.breadcrumbName,\s*href: (\w+)\.slug,?\s*\}\}/g,
    ),
  ];
  assert.equal(links.length, 6, "each tile links to its service page");
  for (const [, label, href] of links)
    assert.equal(label, href, "label and href share the service");
  assert.equal(
    new Set(links.map((m) => m[1])).size,
    6,
    "six distinct services",
  );
  assert.doesNotMatch(
    home(),
    /capilarLocal/,
    "the capilar niche page is not a home tile",
  );
});

test("every home service tile target ends in a slash", () => {
  const services = read("src/data/services.ts");
  for (const slug of [
    "/seo-local-sevilla/",
    "/diseno-web-sevilla/",
    "/tienda-online-sevilla/",
    "/desarrollo-software-medida/",
    "/automatizaciones/",
    "/inteligencia-artificial/",
  ]) {
    assert.ok(services.includes(`slug: "${slug}"`), `service ${slug}`);
  }
});

test("home comparison links to the plans without owning the 'Sevilla' agency keyword", () => {
  const body = main();
  const agencia = body.match(/<SeoLocalAgencia[\s\S]*?\/>/)?.[0] ?? "";
  assert.match(agencia, /id="consultor-o-agencia"/);
  assert.match(agencia, /keyword="¿Consultor SEO o agencia\?"/);
  assert.doesNotMatch(agencia, /keyword="[^"]*Sevilla/);
  assert.match(agencia, /href: "\/seo-local-sevilla\/#precios"/);
});

test("home heading ids are unique and anchors exist", () => {
  const src = home();
  const ids = [...src.matchAll(/headingId="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(new Set(ids).size, ids.length, "unique heading ids");
  for (const id of [
    "que-hago-title",
    "proceso-title",
    "prueba-title",
    "consultor-title",
    "faq-title",
    "cierre-title",
    "nap-title",
  ]) {
    assert.ok(ids.includes(id), `heading id ${id}`);
  }
  for (const anchor of ["que-hago", "trabajo-real", "consultor-o-agencia"]) {
    assert.match(src, new RegExp(`id="${anchor}"`), `anchor ${anchor}`);
  }
});

test("home keeps Person, FAQPage and review JSON-LD with one reviews fetch", () => {
  const src = home();
  assert.match(src, /personSchema\(\)/);
  assert.match(src, /faqSchema\(homeFaqs\)/);
  assert.match(src, /reviewsSchema\(reviewsData\)/);
  assert.equal((src.match(/getGoogleReviews\(\)/g) ?? []).length, 1);
  assert.match(
    src,
    /portraitAlt="Nuria Romero, consultor SEO en Sevilla y desarrolladora web"/,
  );
});

test("home related links keep the five existing rows and add the four niche pages", () => {
  const src = read("src/data/internal-links.ts");
  const row = src.match(/^ {2}"\/": \[([\s\S]*?)^ {2}\],/m)?.[1] ?? "";
  const entries = [
    ...row.matchAll(/path: "([^"]+)", anchor: "([^"]+)", kind: "(\w+)"/g),
  ].map((m) => ({ path: m[1], anchor: m[2], kind: m[3] }));
  assert.deepEqual(
    entries.slice(0, 5).map((e) => e.path),
    [
      "/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/",
      "/blog/como-aparecer-en-google-maps-negocio-sevilla/",
      "/blog/cuanto-cuesta-una-pagina-web-en-sevilla/",
      "/recursos/",
      "/portfolio/",
    ],
  );
  assert.deepEqual(entries.slice(5), [
    {
      path: "/web-para-restaurantes-sevilla/",
      anchor: "web para restaurantes en Sevilla",
      kind: "contextual",
    },
    {
      path: "/web-para-clinicas-sevilla/",
      anchor: "web para clínicas y consultas",
      kind: "contextual",
    },
    {
      path: "/web-para-comercios-sevilla/",
      anchor: "web para comercios y tiendas",
      kind: "contextual",
    },
    {
      path: "/web-para-abogados-gestorias-sevilla/",
      anchor: "web para despachos y gestorías",
      kind: "contextual",
    },
  ]);
});
