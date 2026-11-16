import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";

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
  assert.match(site, /stat: "2 webs en Sevilla", label: "de negocios locales"/);
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
  assert.match(
    src,
    /"a a a a b b"\s+"c c d d d d"\s+"c c e e e e"\s+"f f f f f f"/,
  );
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

test("plans take tiers and note by props with a lede slot", () => {
  const src = component("SeoLocalPlans");
  assertTemplateSection(src, "SeoLocalPlans", [
    "id",
    "headingId",
    "keyword",
    "title",
    "tiers",
    "note",
  ]);
  assert.match(src, /<SectionHeading/);
  assert.match(src, /<slot name="lede"/);
  assert.match(src, /id = "precios"/);
  assert.doesNotMatch(src, /(?:300|500)\s*€|Local Pro/);
});

test("FAQ takes questions by props and renders the optional links of an item", () => {
  const src = component("SeoLocalFaq");
  assertTemplateSection(src, "SeoLocalFaq", [
    "headingId",
    "keyword",
    "title",
    "lede",
    "faqs",
    "ctaLabel",
  ]);
  assert.match(src, /<SectionHeading/);
  assert.match(src, /FaqItem\[\]/);
  assert.match(src, /faq\.links/);
  assert.match(src, /class="answer-links"/);
  assert.match(src, /tpl-link/);
  assert.match(src, /<span aria-hidden="true">/);
  assert.match(src, /splitAnswer/);
  assert.doesNotMatch(src, /Si tu duda no está aquí/);
});

test("faqSchema ignores FAQ item links and keeps its signature", () => {
  const schema = read("src/lib/schema.ts");
  assert.match(
    schema,
    /export function faqSchema\(faqs: \{ q: string; a: string \}\[\]\)/,
  );
  assert.doesNotMatch(schema, /\.links/);
});

test("related links take the list by props", () => {
  const src = component("SeoLocalRelated");
  assertTemplateSection(src, "SeoLocalRelated", ["links", "label"]);
  assert.match(src, /links\.length > 0/);
  assert.doesNotMatch(src, /internalLinksBySource/);
});

test("the reference page passes plans, FAQ and related content", () => {
  const src = page();
  assert.match(
    src,
    /<SeoLocalPlans[\s\S]*?headingId="planes-title"[\s\S]*?keyword="Cuánto cuesta el SEO local en Sevilla"/,
  );
  assert.match(src, /tiers=\{seoLocal\.pricing\.tiers \?\? \[\]\}/);
  assert.match(src, /note=\{seoLocal\.pricing\.note\}/);
  assert.match(
    src,
    /<Fragment slot="lede">[\s\S]*?tierFrom\(seoLocal, "Local"\)[\s\S]*?tierFrom\(seoLocal, "Local Pro"\)/,
  );
  assert.doesNotMatch(src, /(?:300|500)\s*€/);
  assert.match(
    src,
    /<SeoLocalFaq[\s\S]*?headingId="faq-title"[\s\S]*?keyword="Preguntas frecuentes sobre SEO local en Sevilla"/,
  );
  assert.match(src, /faqs=\{seoLocal\.faqs\}/);
  assert.match(src, /accent: "antes de empezar"/);
  assert.match(src, /accent: "un alcance claro"/);
  assert.match(
    src,
    /lede="Si tu duda no está aquí, la resolvemos en la llamada\."/,
  );
  assert.match(
    src,
    /links=\{internalLinksBySource\[seoLocal\.slug\] \?\? \[\]\}/,
  );
});

test("no section copies the shared heading styles or imports the serif font twice", () => {
  const dir = new URL("src/components/seo-local/", root);
  const files = readdirSync(dir).filter((name) => name.endsWith(".astro"));
  assert.ok(files.length >= 15);
  for (const file of files) {
    const src = readFileSync(new URL(file, dir), "utf8");
    assert.doesNotMatch(
      src,
      /^ {2}\.(?:kw|display)(?: em)? \{/m,
      `${file} redefines heading styles`,
    );
    assert.doesNotMatch(src, /^ {2}\.band \{/m, `${file} redefines the band`);
    const importsSerif = /@fontsource\/instrument-serif/.test(src);
    const mayImport = ["SectionHeading.astro", "SeoLocalCycle.astro"].includes(
      file,
    );
    assert.equal(importsSerif, mayImport, `${file} serif import`);
  }
});

test("ServiceLayout has a template variant without slot fallbacks and the ink ground", () => {
  const layout = read("src/layouts/ServiceLayout.astro");
  assert.match(layout, /variant\?:\s*"legacy"\s*\|\s*"template"/);
  assert.match(layout, /variant\s*=\s*"legacy"/);
  assert.match(layout, /variant === "template"/);
  assert.match(layout, /template-ground px-4 pt-24/);

  const start = layout.indexOf('{variant === "template" ? (');
  const templateBranch = layout.slice(
    layout.indexOf("(", start),
    layout.indexOf(") : (", start),
  );
  for (const name of [
    "hero",
    "benefits",
    "process",
    "pricing",
    "faq",
    "related",
    "closing",
  ]) {
    assert.match(
      templateBranch,
      new RegExp(`<slot name="${name}"\\s*/>`),
      name,
    );
  }
  assert.doesNotMatch(
    templateBranch,
    /ServiceHero|BenefitsGrid|ProcessSteps|PricingCard|<FAQ|InternalLinks|CTASection|TitleSection/,
  );

  const legacyBranch = layout.slice(layout.indexOf(") : (", start));
  for (const fallback of [
    "ServiceHero",
    "BenefitsGrid",
    "ProcessSteps",
    "PricingCard",
    "<FAQ",
    "InternalLinks",
    "CTASection",
  ]) {
    assert.ok(legacyBranch.includes(fallback), `legacy keeps ${fallback}`);
  }
  assert.match(layout, /faqSchema\(page\.faqs\)/);
});

test("the reference page uses the template variant and no route-local global style", () => {
  const src = page();
  assert.match(src, /<ServiceLayout page=\{seoLocal\} variant="template">/);
  assert.doesNotMatch(src, /<style/);
  assert.doesNotMatch(src, /rgb\(5 10 24\)/);
  assert.equal((src.match(/<div class="band">/g) ?? []).length, 2);
});

test("DESIGN.md describes the shared tokens and how to use the components on another page", () => {
  const drift = design.slice(design.indexOf("## Known Drift"));
  assert.doesNotMatch(drift, /Page-scoped tokens/);
  assert.doesNotMatch(drift, /defined per component/);
  assert.doesNotMatch(drift, /copy-pasted per component/);
  assert.match(drift, /gray-950/, "the timeline dot note stays");

  assert.match(design, /src\/styles\/template\.css/);
  assert.match(design, /theme\.extend/);
  assert.match(design, /ADR 0014|0014-template-section-components/);

  const guide = design.slice(
    design.indexOf("## Using the components on another page"),
  );
  assert.ok(design.includes("## Using the components on another page"));
  for (const term of [
    'variant="template"',
    "SectionHeading",
    "BentoTile",
    "visual",
    "templatePages",
    "FaqItem",
    "diff-main",
  ]) {
    assert.ok(guide.includes(term), `guide mentions ${term}`);
  }
  for (const section of [
    "hero",
    "proof strip",
    "bento",
    "process",
    "real proof",
    "plans",
    "FAQ",
    "related",
    "closing",
  ]) {
    assert.match(guide, new RegExp(section, "i"), section);
  }
});
