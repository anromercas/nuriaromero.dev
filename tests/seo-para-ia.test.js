import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

// --- Task 1.1: Service JSON-LD without an own offer (NRD-249) -----------------

test("serviceSchema accepts a missing price and spreads offers last only when present", () => {
  const source = read("src/lib/schema.ts");
  assert.match(source, /price\?: string/);
  assert.match(source, /\.\.\.\(offers \? \{ offers \} : \{\}\)/);
  assert.doesNotMatch(source, /\n\s+price: string\n/);
});

test("ServicePageData declares the ownOffer opt-out", () => {
  assert.match(read("src/data/types.ts"), /ownOffer\?: boolean/);
});

test("ServiceLayout passes no price when ownOffer is false", () => {
  assert.match(
    read("src/layouts/ServiceLayout.astro"),
    /price: page\.ownOffer === false \? undefined : page\.pricing\.from/,
  );
});

test("pricingTier is exported and tierFrom delegates to it", async () => {
  const source = read("src/data/services.ts");
  assert.match(source, /export function pricingTier\(/);
  assert.match(source, /return pricingTier\(service, tierName\)\.from/);
  const { seoLocal, pricingTier, tierFrom } = await import(
    new URL("src/data/services.ts", root).href
  );
  assert.equal(tierFrom(seoLocal, "Local Pro"), "500 €/mes + IVA");
  assert.equal(pricingTier(seoLocal, "Local Pro").from, "500 €/mes + IVA");
  assert.throws(() => pricingTier(seoLocal, "Nope"), /not found/);
});

// --- Task 2.1: page drawings (NRD-250) -----------------------------------------

const mockPath = "src/components/seo-ia/AiAnswerMock.astro";
const artPath = "src/components/seo-ia/SeoIaTileArt.astro";
const svgTags = (source) => source.match(/<svg\b[^>]*>/g) ?? [];
const markupOf = (source) =>
  source.replace(/<style[\s\S]*<\/style>/, "").replace(/^---[\s\S]*?---/, "");
const brands =
  /whatsapp|google|chatgpt|gemini|openai|claude|copilot|perplexity/i;
const styleOf = (source) =>
  source.match(/<style[^>]*>([\s\S]*)<\/style>/)?.[1] ?? "";

for (const path of [mockPath, artPath]) {
  test(`${path} draws single-stroke accessible SVGs without brands or digits`, () => {
    assert.ok(existsSync(new URL(path, root)), `${path} exists`);
    const source = read(path);
    const tags = svgTags(source);
    assert.ok(tags.length > 0, "has at least one svg");
    for (const tag of tags) {
      assert.match(tag, /aria-hidden="true"/);
      assert.match(tag, /focusable="false"/);
      assert.match(tag, /stroke-width="1\.5"/);
      assert.match(tag, /stroke-linecap="round"/);
      assert.match(tag, /stroke-linejoin="round"/);
    }
    for (const [, fill] of source.matchAll(/\sfill="([^"]*)"/g)) {
      assert.ok(fill === "none", `no filled shapes, found fill="${fill}"`);
    }
    const markup = markupOf(source);
    for (const [, text] of markup.matchAll(/<text\b[^>]*>([^<]*)<\/text>/g)) {
      assert.doesNotMatch(text, /\d/, `no digit in SVG text "${text}"`);
      assert.doesNotMatch(text, brands, `no brand in SVG text "${text}"`);
    }
    assert.doesNotMatch(markup, /€|\d\s?%/, "no price or metric in a drawing");
    assert.doesNotMatch(source, /yellow|recomendad|ranking/i);
  });
}

test("SeoIaTileArt has no SVG text at all", () => {
  assert.doesNotMatch(markupOf(read(artPath)), /<text\b/);
});

test("SeoIaTileArt offers one drawing per kind", () => {
  const source = read(artPath);
  const union = source.match(/kind:([\s\S]*?);\s*\}/)?.[1] ?? "";
  const kinds = [
    "coherencia",
    "respuestas",
    "schema",
    "rastreadores",
    "llms",
    "senales",
  ];
  assert.equal((union.match(/"[a-z]+"/g) ?? []).length, kinds.length);
  for (const kind of kinds) {
    assert.ok(union.includes(`"${kind}"`), `kind ${kind} in the union`);
    assert.ok(source.includes(`kind === "${kind}"`), `drawing for ${kind}`);
  }
  assert.equal(svgTags(source).length, kinds.length, "one svg per kind");
  for (const cls of ["signal", "soft"]) {
    assert.match(source, new RegExp(`class="[^"]*\\b${cls}\\b`));
  }
});

test("AiAnswerMock is an honest illustrative figure with a reduced-motion guard", () => {
  const source = read(mockPath);
  assert.match(
    source,
    /<figure[^>]*aria-label="Ejemplo de la información de un negocio, ordenada y con datos estructurados, que un asistente de IA usa al escribir su respuesta"/s,
  );
  assert.match(source, /<figcaption>Ejemplo ilustrativo<\/figcaption>/);
  assert.match(source, /animate\?:\s*boolean/);
  assert.match(source, /animate\s*=\s*true/);
  assert.match(source, /@media \(prefers-reduced-motion: no-preference\)/);
  assert.match(source, /@supports \(animation-timeline: scroll\(\)\)/);
  assert.equal(svgTags(source).length, 1, "one single-viewBox SVG");
  assert.match(source, /viewBox="0 0 320 220"/);
});

test("AiAnswerMock has one label sized for 11 px at 320 px", () => {
  const source = read(mockPath);
  const texts = [
    ...markupOf(source).matchAll(/<text\b[^>]*>\s*([^<]*?)\s*<\/text>/g),
  ];
  assert.equal(texts.length, 1, "at most one SVG text");
  assert.equal(texts[0][1], "Tu negocio");
  assert.match(styleOf(source), /\.label\s*\{[^}]*font-size:\s*15px/);
});

test("AiAnswerMock rests in the completed drawing at scroll 0", () => {
  const style = styleOf(read(mockPath));
  assert.doesNotMatch(style, /stroke-dashoffset/, "no stroke starts hidden");
  assert.doesNotMatch(style, /visibility:\s*hidden/);
  assert.doesNotMatch(style, /opacity:\s*0[;\s}]/);
  const outside = style.replace(/@media[\s\S]*?\n  \}\n/g, "");
  assert.doesNotMatch(outside, /animation:/);
  const first = style.match(/@keyframes[^{]+\{\s*0%\s*\{([^}]*)\}/)?.[1] ?? "";
  assert.match(
    first,
    /transform:\s*none/,
    "first keyframe is the resting pose",
  );
  const shifts = [...style.matchAll(/translate[XY]\((-?[\d.]+)px\)/g)].map(
    (m) => Math.abs(Number(m[1])),
  );
  assert.ok(shifts.length > 0);
  for (const px of shifts) assert.ok(px <= 4, `nudge of ${px}px`);
});

// --- Task 2.2: data entry and page (NRD-251) -----------------------------------

const { seoParaIa, seoLocal, services, focusServices, tierFrom, pricingTier } =
  await import(new URL("src/data/services.ts", root).href);
const pagePath = "src/pages/seo-para-ia.astro";
const pageSource = () => read(pagePath);
const dataSource = read("src/data/services.ts");
const entryBlock = dataSource.slice(
  dataSource.indexOf("const LOCAL_PRO_TIER"),
  dataSource.indexOf("export const capilarLocal"),
);
const walk = (value, out = []) => {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) for (const v of value) walk(v, out);
  else if (value && typeof value === "object")
    for (const v of Object.values(value)) walk(v, out);
  return out;
};
const entryStrings = () => walk(seoParaIa);
const pageText = () => pageSource().replace(/^---[\s\S]*?---/, "");
const wholePage = () => pageSource();

test("seoParaIa has a national placement within the limits", () => {
  assert.equal(seoParaIa.slug, "/seo-para-ia/");
  assert.equal(seoParaIa.breadcrumbName, "SEO para IA");
  assert.ok(seoParaIa.seo.title.length <= 60);
  const d = seoParaIa.seo.description.length;
  assert.ok(d >= 140 && d <= 160, `description ${d}`);
  for (const text of [
    seoParaIa.seo.title,
    seoParaIa.seo.description,
    seoParaIa.hero.h1,
  ]) {
    assert.match(text, /SEO para IA/);
    assert.doesNotMatch(text, /Sevilla/);
  }
});

test("title, H1 and section headings carry no term of the home or the local page", () => {
  const headings = [
    seoParaIa.seo.title,
    seoParaIa.hero.h1,
    ...Object.values(seoParaIa.sectionTitles),
  ];
  for (const text of headings) {
    assert.doesNotMatch(text, /consultor/i);
    assert.doesNotMatch(text, /seo local sevilla/i);
  }
});

test("seoParaIa has no own offer and reads the Local Pro tier", () => {
  assert.equal(seoParaIa.ownOffer, false);
  assert.equal(seoParaIa.pricing.from, tierFrom(seoLocal, "Local Pro"));
  assert.equal(seoParaIa.pricing.note, seoLocal.pricing.note);
  assert.doesNotMatch(
    entryBlock,
    /€/,
    "no euro literal in the seoParaIa source",
  );
  assert.doesNotMatch(pageSource(), /€/, "no euro literal in the page");
  assert.match(entryBlock, /pricingTier\(seoLocal, "Local Pro"\)/);
});

test("the plan includes are the Local Pro includes without the Local pointer", () => {
  const tier = pricingTier(seoLocal, "Local Pro");
  const includes = seoParaIa.pricing.includes;
  assert.equal(includes.length, tier.includes.length - 1);
  for (const item of includes) {
    assert.doesNotMatch(item, /^Todo lo incluido/);
    assert.ok(tier.includes.includes(item));
  }
});

test("seoParaIa has six benefits, four steps and the D3 method in steps 1 and 4", () => {
  assert.equal(seoParaIa.benefits.length, 6);
  assert.equal(seoParaIa.process.length, 4);
  assert.match(seoParaIa.process[0].text, /asistentes de IA/);
  assert.match(seoParaIa.process[0].text, /pregunt/i);
  assert.match(seoParaIa.process[3].text, /cada mes/i);
  assert.match(seoParaIa.process[3].text, /informe/i);
  for (const text of [seoParaIa.process[0].text, seoParaIa.process[3].text]) {
    assert.doesNotMatch(text, /dataforseo|geo-optimizer|ga4/i);
  }
});

test("one booking label everywhere on the page", () => {
  assert.equal(seoParaIa.hero.primaryCtaLabel, "Reservar una llamada");
  const page = pageSource();
  assert.match(page, /primaryCtaLabel=\{seoParaIa\.hero\.primaryCtaLabel\}/);
  assert.match(page, /ctaLabel:\s*seoParaIa\.hero\.primaryCtaLabel/);
  assert.doesNotMatch(page, /Reserva una primera sesión/);
});

test("services and focusServices list the page right after seoLocal", () => {
  for (const list of [services, focusServices]) {
    const slugs = list.map((s) => s.slug);
    const i = slugs.indexOf("/seo-local-sevilla/");
    assert.equal(slugs[i + 1], "/seo-para-ia/");
  }
});

test("the page is on the template with the editorial hero, never ServiceHero", () => {
  const page = pageSource();
  assert.match(
    page,
    /<ServiceLayout\s+page=\{seoParaIa\}\s+variant="template"/,
  );
  assert.match(page, /<SeoLocalHero[\s\S]*?<AiAnswerMock slot="visual"/);
  assert.doesNotMatch(page, /ServiceHero|TitleSection|RealProof/);
  assert.doesNotMatch(page, /text-gray-|bg-gray-/);
});

test("the page composes the template components in section-map order", () => {
  const page = pageSource();
  const order = [
    "<SeoLocalHero",
    "<ProofStrip",
    "<ReviewBento",
    "<SeoLocalProcess",
    "<SeoLocalAgencia",
    "<SeoLocalPlans",
    "<SeoLocalFaq",
    "<SeoLocalRelated",
    "<SeoLocalClosing",
    "<SeoLocalNap",
  ].map((tag) => page.indexOf(`${tag}`, page.indexOf("<ServiceLayout")));
  assert.ok(
    order.every((i) => i > -1),
    "all sections present",
  );
  assert.deepEqual(
    [...order].sort((a, b) => a - b),
    order,
  );
  assert.equal(
    (page.match(/<BentoTile/g) ?? []).length,
    1,
    "tiles mapped from data",
  );
  assert.match(page, /id="que-trabajo"/);
});

test("exactly one home link with the owner anchor and no other consultor", () => {
  const page = pageSource();
  const links = page.match(/<a href="\/">consultor SEO en Sevilla<\/a>/g) ?? [];
  assert.equal(links.length, 1);
  assert.equal((page.match(/consultor/gi) ?? []).length, 1);
  for (const text of entryStrings()) assert.doesNotMatch(text, /consultor/i);
});

test("every assistant named in thisSiteItems maps to an allowed crawler", () => {
  const page = pageSource();
  const block = page.slice(
    page.indexOf("const thisSiteItems"),
    page.indexOf("---", page.indexOf("const thisSiteItems")),
  );
  const config = read("src/data/crawler-policy.ts");
  const map = {
    ChatGPT: ["GPTBot", "OAI-SearchBot"],
    Claude: ["ClaudeBot"],
    Perplexity: ["PerplexityBot"],
    Gemini: ["Google-Extended"],
  };
  let named = 0;
  for (const [assistant, agents] of Object.entries(map)) {
    if (!block.includes(assistant)) continue;
    named++;
    for (const agent of agents) {
      assert.match(
        config,
        new RegExp(`userAgent:\\s*['"]${agent}['"],\\s*allow:\\s*['"]/['"]`),
      );
    }
  }
  assert.ok(named > 0, "the section names at least one assistant");
  for (const name of [
    "ChatGPT",
    "Claude",
    "Perplexity",
    "Gemini",
    "Copilot",
    "Grok",
    "DeepSeek",
  ]) {
    if (block.includes(name))
      assert.ok(name in map, `${name} has a crawler mapping`);
  }
});

test("no promise phrase outside the negated recommendation answer", () => {
  const promise =
    /garantiz|primeras posiciones|te sale en|te recomendar|asegur/i;
  for (const text of [...entryStrings(), pageText()]) {
    assert.doesNotMatch(text, promise);
  }
});

test("digits are only the Local Pro price or the experience figure", () => {
  const strip = (text) => text.replace(/\bLocal Pro\b/g, "");
  for (const text of entryStrings()) {
    const clean = strip(text).replace(seoParaIa.pricing.from, "");
    assert.doesNotMatch(clean, /\d/, `digit in "${text}"`);
  }
  const copy = pageText()
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/\{[^}]*\}/g, "");
  assert.doesNotMatch(copy.replace(/\bh[1-6]\b/g, ""), />[^<]*\d[^<]*</);
});

test("no placeholder markers under src", () => {
  for (const path of [pagePath, "src/data/services.ts", mockPath, artPath]) {
    assert.doesNotMatch(read(path), /\[PENDIENTE|\[VERIFICAR/);
  }
  assert.doesNotMatch(wholePage(), /\[PENDIENTE|\[VERIFICAR/);
});

// --- Task 2.3: FAQ and word budget (NRD-252) ----------------------------------

const faqQuestions = [
  "¿Qué es el SEO para IA o GEO?",
  "¿En qué se diferencia el SEO para IA del SEO tradicional?",
  "¿Es lo mismo GEO que AEO?",
  "¿Cómo hago que ChatGPT recomiende mi negocio?",
  "¿Qué hay que trabajar para aparecer en las respuestas de IA?",
  "¿Cuánto cuesta el SEO para IA?",
];
// Same split as SeoLocalFaq: the lead is the first sentence.
const firstSentence = (answer) =>
  answer.match(/^[\s\S]*?[.!?](?=\s|$)/)?.[0] ?? answer;

test("the FAQ holds the six sourced questions in order", () => {
  assert.deepEqual(
    seoParaIa.faqs.map((f) => f.q),
    faqQuestions,
  );
});

test("every FAQ answer opens with a direct sentence of at most 220 characters", () => {
  for (const { q, a } of seoParaIa.faqs) {
    const lead = firstSentence(a);
    assert.ok(lead.length <= 220, `${q}: ${lead.length} characters`);
    assert.doesNotMatch(a, /\n/, "one paragraph, no links");
  }
  for (const faq of seoParaIa.faqs) assert.equal(faq.links, undefined);
});

test("the recommendation answer promises nothing, then says what can be done", () => {
  const answer = seoParaIa.faqs[3].a;
  assert.ok(
    answer.startsWith(
      "Nadie puede prometerte que un asistente recomiende o cite tu negocio: no lo controlas tú ni lo controlo yo.",
    ),
  );
  assert.ok(answer.length > firstSentence(answer).length, "it continues");
});

test("the price answer reads the Local Pro tier", () => {
  assert.match(
    entryBlock,
    /`El SEO para IA va incluido en el plan Local Pro, que cuesta \$\{LOCAL_PRO_TIER\.from\}\.`/,
  );
  const answer = seoParaIa.faqs[5].a;
  assert.match(answer, /que cuesta 500 €\/mes \+ IVA\./);
  assert.ok(
    answer.endsWith(
      `que cuesta ${seoLocal.pricing.tiers.find((t) => t.name === "Local Pro").from}.`,
    ),
  );
});

test("the work answer keeps its disclaimer after the direct opening", () => {
  const answer = seoParaIa.faqs[4].a;
  assert.ok(answer.length > firstSentence(answer).length);
  assert.match(answer, /aparecer no depende solo de ti\.$/);
});
