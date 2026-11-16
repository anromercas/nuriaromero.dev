import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

// --- Task 1.1: page illustrations (NRD-214) -----------------------------------

const mockPath = "src/components/ia/ChatMock.astro";
const artPath = "src/components/ia/AiTileArt.astro";
const svgTags = (source) => source.match(/<svg\b[^>]*>/g) ?? [];
const markupOf = (source) =>
  source.replace(/<style[\s\S]*<\/style>/, "").replace(/^---[\s\S]*?---/, "");
const brands = /whatsapp|google|chatgpt|gemini|openai|claude|copilot/i;

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
    assert.doesNotMatch(source, /yellow/i);
  });
}

test("AiTileArt has no SVG text at all", () => {
  assert.doesNotMatch(markupOf(read(artPath)), /<text\b/);
});

test("ChatMock is an honest illustrative figure with a reduced-motion guard", () => {
  const source = read(mockPath);
  assert.match(
    source,
    /<figure[^>]*aria-label="Ejemplo de chatbot que responde a un cliente con la información del negocio y pasa la conversación a una persona"/s,
  );
  assert.match(source, /<figcaption>Ejemplo ilustrativo<\/figcaption>/);
  assert.match(source, /animate\?:\s*boolean/);
  assert.match(source, /animate\s*=\s*true/);
  assert.match(source, /@media \(prefers-reduced-motion: no-preference\)/);
  assert.match(source, /@supports \(animation-timeline: scroll\(\)\)/);
  assert.equal(svgTags(source).length, 1, "one single-viewBox SVG");
  assert.match(source, /viewBox="0 0 320 220"/);
});

test("ChatMock has one common-noun label sized for 11 px at 320 px", () => {
  const source = read(mockPath);
  const texts = [
    ...markupOf(source).matchAll(/<text\b[^>]*>\s*([^<]*?)\s*<\/text>/g),
  ];
  assert.equal(texts.length, 1, "at most one SVG text");
  assert.equal(texts[0][1], "Asistente");
  const style = source.match(/<style[^>]*>([\s\S]*)<\/style>/)?.[1] ?? "";
  assert.match(style, /\.label\s*\{[^}]*font-size:\s*15px/);
});

test("ChatMock rests in the completed drawing at scroll 0 and without timelines", () => {
  const source = read(mockPath);
  const style = source.match(/<style[^>]*>([\s\S]*)<\/style>/)?.[1] ?? "";
  assert.doesNotMatch(style, /stroke-dashoffset/, "no stroke starts hidden");
  assert.doesNotMatch(style, /visibility:\s*hidden/);
  assert.doesNotMatch(style, /opacity:\s*0[;\s}]/);
  // Every animation lives behind the timeline support query, so browsers
  // without it never move anything; the first keyframe is the resting state.
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

test("AiTileArt offers one drawing per kind", () => {
  const source = read(artPath);
  const union = source.match(/kind:([\s\S]*?);\s*\}/)?.[1] ?? "";
  const kinds = [
    "chatbot",
    "agente",
    "respuestas",
    "persona",
    "resumenes",
    "rgpd",
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

// --- Task 2.1: page on the template (NRD-215) ----------------------------------

const { inteligenciaArtificial } = await import(
  new URL("../src/data/services.ts", import.meta.url)
);
const { internalLinksBySource } = await import(
  new URL("../src/data/internal-links.ts", import.meta.url)
);
const pageSource = () => read("src/pages/inteligencia-artificial.astro");

test("page uses the template variant and drops the legacy blocks", () => {
  const page = pageSource();
  assert.match(
    page,
    /<ServiceLayout\s+page=\{inteligenciaArtificial\}\s+variant="template"/,
  );
  assert.doesNotMatch(page, /RealProof|TitleSection|✓/);
  assert.doesNotMatch(page, /text-gray-|bg-gray-/);
});

test("page composes the template components in reference slot order", () => {
  const page = pageSource();
  const order = [
    'slot="hero"',
    "<SeoLocalHero",
    '<ChatMock slot="visual"',
    "<ProofStrip",
    'slot="benefits"',
    "<ReviewBento",
    "<AiTileArt",
    'slot="process"',
    "<SeoLocalProcess",
    'slot="before-pricing"',
    "<SeoLocalAgencia",
    'slot="pricing"',
    "<SeoLocalPlans",
    'slot="faq"',
    "<SeoLocalFaq",
    'slot="related"',
    "<SeoLocalRelated",
    'slot="closing"',
    "<SeoLocalClosing",
    '<ChatMock slot="visual" animate={false}',
    "<SeoLocalNap",
  ];
  let last = -1;
  for (const token of order) {
    const at = page.indexOf(token, last + 1);
    assert.ok(at > last, `${token} appears after the previous section`);
    last = at;
  }
});

test("keyword headings are bound to inteligenciaArtificial.sectionTitles", () => {
  const page = pageSource();
  for (const key of ["benefits", "process", "pricing", "faq"]) {
    assert.match(
      page,
      new RegExp(
        `keyword=\\{inteligenciaArtificial\\.sectionTitles\\?\\.${key}\\b`,
      ),
      `sectionTitles.${key}`,
    );
  }
  assert.match(page, /keyword=\{inteligenciaArtificial\.hero\.h1\}/);
  assert.match(page, /secondaryLink=\{\{[^}]*href:\s*"#precios"/);
  assert.match(page, /internalLinksBySource\[inteligenciaArtificial\.slug\]/);
  assert.match(page, /keyword="¿IA a medida o ChatGPT tal cual\?"/);
});

test("the single plan is built from inteligenciaArtificial.pricing", () => {
  const page = pageSource();
  assert.match(page, /tiers=\{\[plan\]\}/);
  for (const field of ["from", "includes", "note"]) {
    assert.match(
      page,
      new RegExp(`inteligenciaArtificial\\.pricing\\.${field}\\b`),
    );
  }
  assert.match(page, /desde \{inteligenciaArtificial\.pricing\.from\}/);
  assert.doesNotMatch(page, /€/, "no price literal in the page");
  assert.equal(inteligenciaArtificial.pricing.tiers, undefined);
  assert.equal(inteligenciaArtificial.pricing.from, "399 €");
});

test("services.ts holds the AI price in one constant", () => {
  const services = read("src/data/services.ts");
  assert.match(services, /^const AI_FROM = "399 €"$/m);
  assert.match(services, /^\s*from: AI_FROM,?$/m);
  const block = services.slice(
    services.indexOf("export const inteligenciaArtificial"),
    services.indexOf("export const seoLocal"),
  );
  assert.doesNotMatch(block, /"399 €"/, "no second literal in the AI page");
});

test("proof strip shows the experience cell and the rating only", () => {
  const page = pageSource();
  assert.match(page, /SITE_PROOF\[0\]/);
  assert.doesNotMatch(page, /SITE_PROOF\[1\]/);
  assert.match(page, /reviewsData\s*\?/);
});

test("data: six tiles, four steps, hero and closing copy", () => {
  assert.equal(inteligenciaArtificial.benefits.length, 6);
  assert.equal(inteligenciaArtificial.process.length, 4);
  const { title, titleAccent, secondaryCta } = inteligenciaArtificial.hero;
  assert.ok(title.includes(titleAccent), "accent is a substring of the title");
  assert.equal(secondaryCta.label, "Ver precio");
  assert.equal(secondaryCta.href, "#precios");
  assert.equal(
    inteligenciaArtificial.sectionTitles.benefits,
    "Qué puede hacer la IA en tu negocio",
  );
  assert.ok(inteligenciaArtificial.cta.title.length > 0);
  assert.ok(inteligenciaArtificial.cta.text.length > 0);
  for (const b of inteligenciaArtificial.benefits) {
    assert.equal(
      b.text.match(/[.!?](\s|$)/g)?.length,
      1,
      `one sentence: ${b.title}`,
    );
  }
});

test("plan copy: no 'mejor retorno' and the published price only", () => {
  const { includes, note } = inteligenciaArtificial.pricing;
  assert.equal(includes[0], "Análisis de tu caso de uso");
  assert.equal(
    note,
    "El coste depende del caso de uso. Con la prueba piloto ves cómo responde con tus datos antes de seguir.",
  );
  assert.equal(includes.length, 5);
});

test("intent signals stay as they were", () => {
  const { sectionTitles, hero, seo } = inteligenciaArtificial;
  assert.equal(
    sectionTitles.process,
    "Así es el proceso de implantar IA en tu negocio",
  );
  assert.equal(
    sectionTitles.pricing,
    "Cuánto cuesta implementar IA en tu negocio",
  );
  assert.equal(hero.h1, "Inteligencia artificial aplicada a tu negocio");
  assert.equal(
    seo.title,
    "IA para negocios en Sevilla | Chatbots y asistentes con IA",
  );
  assert.ok(seo.description.includes("chatbots que atienden clientes"));
});

test("the subtitle answers what and for whom in its first two sentences", () => {
  const sentences =
    inteligenciaArtificial.hero.subtitle.match(/[^.!?]+[.!?]/g) ?? [];
  assert.ok(sentences.length >= 2, "at least two sentences");
  const lead = sentences.slice(0, 2).join(" ");
  assert.match(lead, /inteligencia artificial/i);
  assert.match(lead, /empresas/i);
  assert.doesNotMatch(lead, /\d/);
});

const copyStrings = (value, out = []) => {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => copyStrings(v, out));
  else if (value && typeof value === "object")
    Object.entries(value).forEach(([k, v]) => {
      if (k !== "href" && k !== "slug") copyStrings(v, out);
    });
  return out;
};

test("no figure beyond the price, '10 años' and the pilot weeks", () => {
  const { faqs, ...copy } = inteligenciaArtificial; // FAQ copy: task 2.2
  for (const text of copyStrings(copy)) {
    for (const digits of text.match(/\d+/g) ?? []) {
      assert.ok(
        ["399", "10", "1", "2"].includes(digits),
        `unexpected figure ${digits} in "${text}"`,
      );
    }
    assert.doesNotMatch(text, /ROI|retorno|amortiz|ahorr|%/i, text);
  }
});

test("no H2 targets GEO or 'posicionamiento en IA'", () => {
  const { sectionTitles } = inteligenciaArtificial;
  for (const h2 of Object.values(sectionTitles)) {
    assert.doesNotMatch(h2, /GEO|posicionamiento en IA/i, h2);
  }
  assert.doesNotMatch(pageSource(), /GEO|posicionamiento en IA/i);
});

test("related links add the GEO guide before the conversion link", () => {
  const rows = internalLinksBySource["/inteligencia-artificial/"];
  const geo = rows.findIndex(
    (r) => r.path === "/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/",
  );
  const conversion = rows.findIndex((r) => r.kind === "conversion");
  assert.ok(geo >= 0, "GEO guide row exists");
  assert.equal(rows[geo].anchor, "guía sobre cómo te encuentran las IA");
  assert.equal(rows[geo].kind, "contextual");
  assert.ok(geo < conversion, "before the conversion row");
  assert.equal(rows.length, 5);
});

// --- Task 2.2: FAQ and word budget (NRD-216) -----------------------------------

const norm = (s) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const { automatizaciones } = await import(
  new URL("../src/data/services.ts", import.meta.url)
);

test("template-pages lists the AI page with the word budget", () => {
  assert.match(
    read("scripts/lib/template-pages.mjs"),
    /\{\s*route:\s*"\/inteligencia-artificial\/",\s*words:\s*\[750,\s*850\],\s*service:\s*true\s*\}/,
  );
});

test("FAQ holds the six sourced questions in order", () => {
  assert.deepEqual(
    inteligenciaArtificial.faqs.map((f) => norm(f.q)),
    [
      "¿Cuál es la mejor IA para empresas?",
      "¿Qué diferencia hay entre ChatGPT y una IA para mi negocio?",
      "¿Cómo implantar IA en mi empresa?",
      "¿Qué es un agente de IA para empresas?",
      "¿Un chatbot puede atender a mis clientes?",
      "¿Cuánto cuesta y cuánto se tarda en poner IA en marcha?",
    ].map(norm),
  );
});

test("no question repeats one of /automatizaciones/", () => {
  const taken = automatizaciones.faqs.map((f) => norm(f.q));
  for (const { q } of inteligenciaArtificial.faqs) {
    assert.ok(!taken.includes(norm(q)), q);
  }
  assert.ok(
    !inteligenciaArtificial.faqs
      .map((f) => norm(f.q))
      .includes(norm("¿Cuál es la mejor IA para automatizar procesos?")),
  );
});

test("best-AI and ChatGPT answers give criteria and rank no brand", () => {
  for (const { q, a } of inteligenciaArtificial.faqs.slice(0, 2)) {
    assert.doesNotMatch(
      a,
      /(la|el) mejor (es|ia es)|te recomiendo|mejor que chatgpt es/i,
      q,
    );
    assert.doesNotMatch(a, /\bmejor (que|IA)\b.*\b(ChatGPT|Gemini)\b/i, q);
  }
  assert.match(inteligenciaArtificial.faqs[0].a, /caso de uso|tarea/i);
});

test("agent answer mentions booking or orders and per-case quote", () => {
  const { a } = inteligenciaArtificial.faqs[3];
  assert.match(a, /reserv|pedido/i);
  assert.match(a, /persona/i);
});

test("chatbot answer hands off to a person with no absolute guarantee", () => {
  const { a } = inteligenciaArtificial.faqs[4];
  assert.match(a, /persona/);
  assert.match(a, /no .*garant/i);
  assert.doesNotMatch(a, /mucho/i, "no unbacked effectiveness claim");
  assert.doesNotMatch(a, /siempre acierta|100 ?%/i);
});

test("price answer interpolates AI_FROM and the pilot time", () => {
  assert.match(read("src/data/services.ts"), /cuesta desde \$\{AI_FROM\}/);
  const { a } = inteligenciaArtificial.faqs[5];
  assert.ok(a.includes(inteligenciaArtificial.pricing.from));
  assert.match(a, /1 (a|y) 2 semanas/);
});

test("FAQ answers open with a direct answer and name no savings", () => {
  for (const { q, a } of inteligenciaArtificial.faqs) {
    assert.ok(a.split(/(?<=[.!?])\s+/).length >= 2, `${q} has two sentences`);
    assert.doesNotMatch(a, /ROI|retorno|amortiz|ahorr|%/i, q);
    assert.doesNotMatch(
      a,
      /\b(arriba|abajo|como ves|como has visto|de esta página|anterior)\b/i,
      q,
    );
    for (const digits of a.match(/\d+/g) ?? []) {
      assert.ok(["399", "1", "2"].includes(digits), `${digits} in "${q}"`);
    }
  }
});

test(
  "built page stays within the word budget with matching FAQPage",
  {
    skip: !existsSync(new URL("dist/inteligencia-artificial/index.html", root)),
  },
  () => {
    const html = read("dist/inteligencia-artificial/index.html");
    const main = html.match(/<main\b[\s\S]*?<\/main>/)?.[0] ?? "";
    const words = main
      .replace(/<(script|style)\b[\s\S]*?<\/\1>/g, " ")
      .replace(/<[^>]+>/g, " ")
      .split(/\s+/)
      .filter(Boolean).length;
    assert.ok(words >= 750 && words <= 850, `${words} words`);
    const ld = [
      ...html.matchAll(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
      ),
    ]
      .map((m) => JSON.parse(m[1]))
      .flatMap((j) => j["@graph"] ?? [j]);
    const faq = ld.find((n) => n["@type"] === "FAQPage");
    assert.deepEqual(
      faq.mainEntity.map((e) => e.name),
      inteligenciaArtificial.faqs.map((f) => f.q),
    );
  },
);
