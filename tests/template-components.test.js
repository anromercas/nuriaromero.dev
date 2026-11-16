import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

const design = read("DESIGN.md");
const css = read("src/styles/template.css");

function designColors() {
  const front = design.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
  const block = front.match(/^colors:\n((?:[ ]{2}.+\n?)+)/m)?.[1] ?? "";
  return [...block.matchAll(/^ {2}([\w-]+):\s*"(#[0-9a-fA-F]{6})"/gm)].map(
    (m) => [m[1], m[2].toLowerCase()],
  );
}

const ruleBody = (selector) => {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`))?.[1] ?? null;
};

test("template.css defines every DESIGN.md colour token with its value", () => {
  const colors = designColors();
  assert.ok(colors.length >= 20, "DESIGN.md colour tokens parsed");
  for (const [name, hex] of colors) {
    assert.match(
      css,
      new RegExp(`--${name}:\\s*${hex}\\s*;`, "i"),
      `--${name} should be ${hex}`,
    );
  }
});

test("template.css defines the alpha channel triplets and shared values", () => {
  assert.match(css, /--sky-signal-rgb:\s*56 189 248\s*;/);
  assert.match(css, /--ink-band-rgb:\s*8 16 36\s*;/);
  assert.match(css, /--accent-size:\s*1\.12em\s*;/);
  assert.match(css, /--ease-out:\s*cubic-bezier\(0\.16, 1, 0\.3, 1\)\s*;/);
});

test("template.css carries today's ground, band and heading rules", () => {
  const ground = ruleBody(".template-ground");
  assert.ok(ground, ".template-ground exists");
  assert.match(ground, /background-color:\s*var\(--ink-ground\)/);
  assert.match(ground, /radial-gradient\(\s*ellipse 80% 30% at 50% 0%/);
  assert.match(ground, /rgb\(var\(--sky-signal-rgb\) \/ 0\.1\)/);

  const band = ruleBody(".band");
  assert.ok(band, ".band exists");
  assert.match(band, /margin-inline:\s*-1rem/);
  assert.match(band, /padding:\s*3rem 1rem/);
  assert.match(band, /border-block:\s*1px solid var\(--hairline-quiet\)/);
  assert.match(band, /rgb\(var\(--ink-band-rgb\) \/ 0\.85\)/);

  const kw = ruleBody(".tpl-kw");
  assert.ok(kw, ".tpl-kw exists");
  assert.match(kw, /font-size:\s*1\.0625rem/);
  assert.match(kw, /font-weight:\s*600/);
  assert.match(kw, /color:\s*var\(--text-secondary\)/);
  assert.doesNotMatch(kw, /uppercase|letter-spacing/);

  const display = ruleBody(".tpl-display");
  assert.ok(display, ".tpl-display exists");
  assert.match(display, /clamp\(1\.9rem, 4\.5vw, 3rem\)/);
  assert.match(display, /color:\s*var\(--text-strong\)/);
  assert.match(display, /text-wrap:\s*balance/);

  const accent = ruleBody(".tpl-accent");
  assert.ok(accent, ".tpl-accent exists");
  assert.match(accent, /color:\s*var\(--sky-accent\)/);
  assert.match(accent, /"Instrument Serif", Georgia, serif/);
  assert.match(accent, /font-style:\s*italic/);
  assert.match(accent, /font-size:\s*var\(--accent-size\)/);

  const link = ruleBody(".tpl-link");
  assert.ok(link, ".tpl-link exists");
  assert.match(link, /text-underline-offset:\s*0\.3em/);
  assert.match(css, /\.tpl-link:hover/);
  assert.match(css, /\.tpl-link:focus-visible/);
});

test("types.ts exports the shared prop types", () => {
  const types = read("src/components/seo-local/types.ts");
  for (const name of [
    "AccentTitle",
    "TextLink",
    "ProofItem",
    "Step",
    "ComparisonItem",
    "FaqItem",
    "Tier",
    "BentoArea",
  ]) {
    assert.match(types, new RegExp(`export (interface|type) ${name}\\b`));
  }
});

test("SectionHeading declares its Props and renders a single optional em", () => {
  const src = read("src/components/seo-local/SectionHeading.astro");
  assert.match(src, /import "@\/styles\/template\.css"/);
  assert.match(src, /import "@fontsource\/instrument-serif\/400-italic\.css"/);
  assert.match(src, /interface Props/);
  for (const field of ["id", "keyword", "title", "level", "class"]) {
    assert.match(src, new RegExp(`\\b${field}\\??:`), `Props.${field}`);
  }
  assert.match(src, /AccentTitle/);
  assert.equal((src.match(/<em\b/g) ?? []).length, 1);
  assert.match(src, /class="tpl-accent"/);
  assert.match(src, /tpl-kw/);
  assert.match(src, /tpl-display/);
  assert.doesNotMatch(src, /@\/data\//);
});

const component = (name) => read(`src/components/seo-local/${name}.astro`);
const page = () => read("src/pages/seo-local-sevilla.astro");

function assertTemplateSection(src, name, fields) {
  assert.match(src, /interface Props/, `${name} declares Props`);
  for (const field of fields) {
    assert.match(src, new RegExp(`\\b${field}\\??:`), `${name} Props.${field}`);
  }
  assert.doesNotMatch(src, /@\/data\/services/, `${name} imports no page data`);
  assert.doesNotMatch(src, /\bseoLocal\b/, `${name} reads no seoLocal`);
  assert.match(src, /var\(--/, `${name} uses tokens`);
  assert.doesNotMatch(src, /\.display em\s*\{/, `${name} redefines the accent`);
  assert.doesNotMatch(src, /\.band\s*\{/, `${name} redefines the band`);
}

test("hero takes copy by props and the drawing by the visual slot", () => {
  const src = component("SeoLocalHero");
  assertTemplateSection(src, "SeoLocalHero", [
    "keyword",
    "title",
    "subtitle",
    "primaryCtaLabel",
    "secondaryLink",
    "actionsAttrs",
  ]);
  assert.match(src, /<SectionHeading[^>]*level="h1"/);
  assert.match(src, /<slot name="visual"/);
  assert.match(src, /Astro\.slots\.has\("visual"\)/);
  assert.match(src, /\{\.\.\.actionsAttrs\}/);
  assert.doesNotMatch(src, /ListingMock/);
});

test("proof strip renders the items it is given and nothing when empty", () => {
  const src = component("ProofStrip");
  assertTemplateSection(src, "ProofStrip", ["items"]);
  assert.match(src, /ProofItem\[\]/);
  assert.match(src, /items\.length/);
  assert.doesNotMatch(src, /\+10 años|2 webs en Sevilla|GoogleReviewsData/);
  const site = read("src/data/site.ts");
  assert.match(site, /export const SITE_PROOF/);
  assert.match(site, /stat: "\+10 años", label: "de experiencia"/);
  assert.match(
    site,
    /stat: "2 webs en Sevilla", label: "de negocios locales"/,
  );
});

test("closing takes copy by props and the drawing by the visual slot", () => {
  const src = component("SeoLocalClosing");
  assertTemplateSection(src, "SeoLocalClosing", [
    "headingId",
    "keyword",
    "title",
    "text",
    "ctaLabel",
    "meta",
  ]);
  assert.match(src, /<SectionHeading/);
  assert.match(src, /<slot name="visual"/);
  assert.match(src, /Astro\.slots\.has\("visual"\)/);
  assert.match(src, /30 minutos · Sin compromiso · Directamente conmigo/);
  assert.doesNotMatch(src, /ListingMock/);
});

test("NAP takes the heading by props and the lines from SITE", () => {
  const src = component("SeoLocalNap");
  assertTemplateSection(src, "SeoLocalNap", ["headingId", "keyword"]);
  assert.match(src, /SITE\.address\.full/);
  assert.match(src, /aria-labelledby=\{headingId\}/);
});

test("listing mock reads the shared tokens", () => {
  const src = component("ListingMock");
  assert.match(src, /var\(--/);
  // rgb(100 116 139) is a drawing detail with no DESIGN.md token; it stays
  // as is because this story introduces no new colour.
  const literals = [...src.matchAll(/rgb\(\d+ \d+ \d+\)/g)].map((m) => m[0]);
  assert.deepEqual([...new Set(literals)], ["rgb(100 116 139)"]);
});

test("the reference page passes the hero, proof, closing and NAP content", () => {
  const src = page();
  assert.match(src, /<SeoLocalHero[\s\S]*?keyword=\{seoLocal\.hero\.h1\}/);
  assert.match(src, /accent: seoLocal\.hero\.titleAccent/);
  assert.match(
    src,
    /secondaryLink=\{\{ label: "Ver los planes", href: "#precios" \}\}/,
  );
  assert.match(src, /<ListingMock slot="visual" \/>/);
  assert.match(src, /<ListingMock slot="visual" animate=\{false\} \/>/);
  assert.match(src, /SITE_PROOF/);
  assert.match(src, /<ProofStrip items=\{proofItems\}/);
  assert.match(src, /reviewsData\s*\?/);
  assert.match(src, /userRatingCount === 1 \? "opinión" : "opiniones"/);
  assert.match(src, /keyword="Reserva una llamada sobre SEO local en Sevilla"/);
  assert.match(src, /accent: "tu presencia local"/);
  assert.match(
    src,
    /<SeoLocalNap\s+headingId="nap-title"\s+keyword="SEO local desde La Rinconada, Sevilla"/,
  );
});

test("bento wrapper takes the heading by props and tiles by children", () => {
  const src = component("ReviewBento");
  assertTemplateSection(src, "ReviewBento", [
    "headingId",
    "id",
    "keyword",
    "title",
    "caption",
  ]);
  assert.match(src, /<SectionHeading/);
  assert.match(src, /<slot\s*\/>/);
  assert.match(src, /Ejemplo ilustrativo/);
  assert.match(src, /"a a a a b b"\s+"c c d d d d"\s+"c c e e e e"\s+"f f f f f f"/);
  assert.doesNotMatch(src, /<svg|<h3/);
});

test("bento tile takes text and link by props and the drawing by slot", () => {
  const src = component("BentoTile");
  assertTemplateSection(src, "BentoTile", [
    "area",
    "title",
    "text",
    "layout",
    "link",
    "class",
  ]);
  assert.match(src, /BentoArea/);
  assert.match(src, /<slot\s*\/>/);
  assert.match(src, /tpl-link/);
  for (const strokeClass of ["signal", "soft", "label", "strong"]) {
    assert.match(src, new RegExp(`:global\\(\\.${strokeClass}\\)`));
  }
  assert.match(src, /\.tile :global\(svg\)/);
  assert.doesNotMatch(src, /<svg/);
});

test("process takes steps by props with byline and aside slots", () => {
  const src = component("SeoLocalProcess");
  assertTemplateSection(src, "SeoLocalProcess", [
    "headingId",
    "id",
    "keyword",
    "title",
    "steps",
    "portrait",
    "portraitAlt",
  ]);
  assert.match(src, /<slot name="byline"/);
  assert.match(src, /<slot name="aside"/);
  assert.match(src, /<SectionHeading/);
  assert.match(src, /@\/assets\/perfil-home\.webp/);
  assert.doesNotMatch(src, /<svg|cycle-diagram/);
});

test("cycle diagram takes its labels by props", () => {
  const src = component("SeoLocalCycle");
  assertTemplateSection(src, "SeoLocalCycle", ["items", "centre", "label"]);
  assert.match(src, /class="cycle-diagram"/);
  assert.match(src, /aria-hidden="true"/);
  assert.match(src, /class="cycle-list"/);
  assert.match(src, /instrument-serif\/400-italic\.css/);
  assert.doesNotMatch(src, /Trabajo revisable|Vídeo-informe|cada mes/);
});

test("real proof and comparison take their copy by props", () => {
  const proof = component("RealProof");
  assertTemplateSection(proof, "RealProof", [
    "headingId",
    "id",
    "keyword",
    "title",
    "reviews",
    "note",
    "projects",
  ]);
  assert.match(proof, /<SectionHeading/);
  assert.match(proof, /<Projects only=\{projects\}/);
  assert.doesNotMatch(proof, /arkady|adfsevilla|Dos webs reales/);

  const agencia = component("SeoLocalAgencia");
  assertTemplateSection(agencia, "SeoLocalAgencia", [
    "id",
    "headingId",
    "keyword",
    "title",
    "items",
    "link",
  ]);
  assert.match(agencia, /<SectionHeading/);
  assert.doesNotMatch(agencia, /consultora SEO|Una agencia SEO|Conmigo/);
});

test("the reference page draws its own bento tiles and passes the section copy", () => {
  const src = page();
  assert.equal((src.match(/<BentoTile\b/g) ?? []).length, 6);
  for (const area of ["a", "b", "c", "d", "e", "f"]) {
    assert.match(src, new RegExp(`<BentoTile[^>]*area="${area}"`));
  }
  assert.match(src, /<BentoTile[^>]*area="f"[^>]*layout="row"/);
  assert.ok((src.match(/<svg\b/g) ?? []).length >= 6);
  for (const heading of [
    "Ficha de Google Business Profile",
    "Datos coherentes en directorios locales",
    "Búsquedas locales en Sevilla",
    "Reseñas de Google",
    "Web para negocios locales",
    "Medición de llamadas, clics y rutas",
  ]) {
    assert.ok(src.includes(`title="${heading}"`), heading);
  }
  assert.match(src, /<ReviewBento[\s\S]*?headingId="revision-title"/);
  assert.match(src, /accent: "te encuentren"/);
  assert.match(src, /accent: "quien hace el trabajo"/);
  assert.match(src, /accent: "puedes ver"/);
  assert.match(src, /accent: "tu SEO local"/);
  assert.match(src, /<Fragment slot="byline">/);
  assert.match(src, /<a href="\/">consultor SEO en Sevilla<\/a>/);
  assert.match(src, /<SeoLocalCycle[\s\S]*?slot="aside"/);
  assert.match(src, /steps=\{seoLocal\.process\}/);
  assert.match(src, /projects=\{\["arkady", "adfsevilla"\]\}/);
  assert.match(src, /Dos webs reales de negocios de Sevilla/);
  assert.match(src, /Una agencia SEO suele repartir tu cuenta/);
});
