import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { withoutWordBudgetExcluded } from "../scripts/lib/page-contract.mjs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

// --- Task 1.1: page illustrations (NRD-205) -----------------------------------

const mockPath = "src/components/automatizaciones/FlowMock.astro";
const artPath = "src/components/automatizaciones/AutomationTileArt.astro";
const svgTags = (source) => source.match(/<svg\b[^>]*>/g) ?? [];
const markupOf = (source) =>
  source.replace(/<style[\s\S]*<\/style>/, "").replace(/^---[\s\S]*?---/, "");
const brands = /whatsapp|google|n8n|make\b|woocommerce|shopify|holded|excel/i;

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

test("AutomationTileArt has no SVG text at all", () => {
  assert.doesNotMatch(markupOf(read(artPath)), /<text\b/);
});

test("FlowMock is an honest illustrative figure with a reduced-motion guard", () => {
  const source = read(mockPath);
  assert.match(
    source,
    /<figure[^>]*aria-label="Ejemplo de automatización: un mensaje nuevo se apunta en tu hoja o CRM y te llega un aviso"/s,
  );
  assert.match(source, /<figcaption>Ejemplo ilustrativo<\/figcaption>/);
  assert.match(source, /animate\?:\s*boolean/);
  assert.match(source, /animate\s*=\s*true/);
  assert.match(source, /@media \(prefers-reduced-motion: no-preference\)/);
  assert.match(source, /@supports \(animation-timeline: scroll\(\)\)/);
  assert.equal(svgTags(source).length, 1, "one single-viewBox SVG");
  for (const label of ["Mensaje nuevo", "Tu hoja o CRM", "Aviso para ti"]) {
    assert.ok(source.includes(label), `label ${label}`);
  }
});

test("FlowMock rests in the completed drawing at scroll 0 and without timelines", () => {
  const source = read(mockPath);
  const style = source.match(/<style[^>]*>([\s\S]*)<\/style>/)?.[1] ?? "";
  assert.doesNotMatch(style, /stroke-dashoffset/, "no stroke starts hidden");
  assert.doesNotMatch(style, /visibility:\s*hidden/);
  for (const [, from] of style.matchAll(
    /(?:from|0%)\s*\{[^}]*opacity:\s*([\d.]+)/g,
  )) {
    assert.ok(Number(from) >= 0.7, `keyframe starts at opacity ${from}`);
  }
  // Every animation lives behind the timeline support query, so browsers
  // without it never move anything; the first keyframe is the resting state.
  const outside = style.replace(/@media[\s\S]*?\n  \}\n/g, "");
  assert.doesNotMatch(outside, /animation:/);
  assert.doesNotMatch(outside, /opacity:\s*0[;\s]/);
  const first = style.match(/@keyframes[^{]+\{\s*0%\s*\{([^}]*)\}/)?.[1] ?? "";
  assert.match(
    first,
    /transform:\s*none/,
    "first keyframe is the resting pose",
  );
});

test("AutomationTileArt offers one drawing per kind", () => {
  const source = read(artPath);
  const union = source.match(/kind:([\s\S]*?);\s*\}/)?.[1] ?? "";
  const kinds = [
    "whatsapp",
    "facturas",
    "citas",
    "formularios",
    "avisos",
    "informes",
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

// --- Task 2.1: page on the template (NRD-206) ----------------------------------

const { automatizaciones } = await import(
  new URL("../src/data/services.ts", import.meta.url)
);
const pageSource = () => read("src/pages/automatizaciones.astro");
const claims = /ROI|retorno|amortiz|%|\d+\s*(horas|semanas)/i;

test("page uses the template variant and drops the legacy blocks", () => {
  const page = pageSource();
  assert.match(
    page,
    /<ServiceLayout\s+page=\{automatizaciones\}\s+variant="template"/,
  );
  assert.doesNotMatch(page, /RealProof|TitleSection|✓/);
  assert.doesNotMatch(page, /text-gray-|bg-gray-/);
});

test("page composes the template components in reference slot order", () => {
  const page = pageSource();
  const order = [
    'slot="hero"',
    "<SeoLocalHero",
    '<FlowMock slot="visual"',
    "<ProofStrip",
    'slot="benefits"',
    "<ReviewBento",
    "<AutomationTileArt",
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
    "<SeoLocalNap",
  ];
  let last = -1;
  for (const token of order) {
    const at = page.indexOf(token, last + 1);
    assert.ok(at > last, `${token} appears after the previous section`);
    last = at;
  }
});

test("keyword headings are bound to automatizaciones.sectionTitles", () => {
  const page = pageSource();
  for (const key of ["benefits", "process", "pricing", "faq"]) {
    assert.match(
      page,
      new RegExp(`keyword=\\{automatizaciones\\.sectionTitles\\?\\.${key}\\b`),
      `sectionTitles.${key}`,
    );
  }
  assert.match(page, /keyword=\{automatizaciones\.hero\.h1\}/);
  assert.match(page, /secondaryLink=\{\{[^}]*href:\s*"#precios"/);
  assert.match(page, /internalLinksBySource\[automatizaciones\.slug\]/);
  assert.match(page, /keyword="¿Qué conviene automatizar primero y qué no\?"/);
});

test("the single plan is built from automatizaciones.pricing", () => {
  const page = pageSource();
  assert.match(page, /tiers=\{\[plan\]\}/);
  for (const field of ["from", "includes", "note"]) {
    assert.match(page, new RegExp(`automatizaciones\\.pricing\\.${field}\\b`));
  }
  assert.match(page, /desde \$\{automatizaciones\.pricing\.from\}/);
  assert.doesNotMatch(page, /€/, "no price literal in the page");
  assert.equal(automatizaciones.pricing.tiers, undefined, "no tiers in data");
  assert.equal(automatizaciones.pricing.from, "149 €");
});

test("proof strip shows the experience cell and the rating only", () => {
  const page = pageSource();
  assert.match(page, /SITE_PROOF\[0\]/);
  assert.doesNotMatch(
    page,
    /SITE_PROOF\[1\]/,
    "websites are not automation proof",
  );
  assert.match(page, /reviewsData\s*\?/);
});

test("data: six examples, five steps, hero and closing copy", () => {
  assert.equal(automatizaciones.benefits.length, 6);
  assert.equal(automatizaciones.process.length, 5);
  const titles = automatizaciones.benefits.map((b) => b.title).join(" ");
  for (const term of [
    /WhatsApp/,
    /Facturas/,
    /Citas/,
    /Formularios/,
    /Avisos/,
    /Informes/,
  ]) {
    assert.match(titles, term);
  }
  const { title, titleAccent, secondaryCta } = automatizaciones.hero;
  assert.ok(title.includes(titleAccent), "accent is a substring of the title");
  assert.equal(secondaryCta.label, "Ver precio");
  assert.equal(secondaryCta.href, "#precios");
  assert.equal(
    automatizaciones.sectionTitles.benefits,
    "Ejemplos de automatización de procesos",
  );
  assert.ok(automatizaciones.cta.title.length > 0);
  assert.ok(automatizaciones.cta.text.length > 0);
});

test("intent signals and published price stay as they were", () => {
  const { sectionTitles, hero, seo } = automatizaciones;
  assert.equal(
    sectionTitles.process,
    "Así es el proceso de automatizar tus tareas repetitivas",
  );
  assert.equal(sectionTitles.pricing, "Cuánto cuesta automatizar un proceso");
  assert.equal(
    hero.h1,
    "Automatización de procesos en Sevilla: que tu negocio trabaje solo",
  );
  assert.ok(seo.title.includes("Automatización de procesos en Sevilla"));
});

test("the subtitle defines process automation in its first two sentences", () => {
  const sentences = automatizaciones.hero.subtitle.match(/[^.!?]+[.!?]/g) ?? [];
  assert.ok(sentences.length >= 2, "at least two sentences");
  const lead = sentences.slice(0, 2).join(" ");
  assert.match(lead, /automatiz/i);
  assert.doesNotMatch(lead, /\d/);
  assert.doesNotMatch(lead, /\b(n8n|Make|Zapier)\b/);
  assert.doesNotMatch(sentences[0].trim(), /^(n8n|Make)\b/);
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

test("no savings guard: only the price digits in the page copy", () => {
  const { seo, ...copy } = automatizaciones;
  for (const text of copyStrings(copy)) {
    const stripped = text.replace(/n8n/gi, "");
    assert.doesNotMatch(stripped, claims, text);
    for (const digits of stripped.match(/\d+/g) ?? []) {
      assert.equal(digits, "149", `unexpected figure in "${text}"`);
    }
  }
  assert.doesNotMatch(seo.description, claims);
});

test("meta description mentions the starting price within 160 chars", () => {
  const d = automatizaciones.seo.description;
  assert.match(d, /desde 149/);
  assert.ok(d.length <= 160, `${d.length}`);
  assert.ok(d.includes("años de experiencia"));
});

test(
  "built page <main> holds no savings claim",
  { skip: !existsSync(new URL("dist/automatizaciones/index.html", root)) },
  () => {
    const html = read("dist/automatizaciones/index.html");
    const main = (html.match(/<main\b[\s\S]*?<\/main>/)?.[0] ?? "")
      .replace(/<(script|style)\b[\s\S]*?<\/\1>/g, " ")
      .replace(/<[^>]+>/g, " ");
    assert.doesNotMatch(main, claims);
  },
);

// --- Task 2.2: FAQ and word budget (NRD-207) -----------------------------------

const norm = (s) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

test("template-pages lists the automations page with the word budget", () => {
  assert.match(
    read("scripts/lib/template-pages.mjs"),
    /\{\s*route:\s*"\/automatizaciones\/",\s*words:\s*\[700,\s*800\],\s*service:\s*true,(\s*keySections:\s*\[[^\]]*\],)?\s*\}/,
  );
});

test("FAQ holds the six sourced questions in order", () => {
  assert.deepEqual(
    automatizaciones.faqs.map((f) => norm(f.q)),
    [
      "¿Qué es la automatización de procesos?",
      "¿Cuál es la mejor IA para automatizar procesos?",
      "¿Qué ejemplos de automatización hay en una empresa?",
      "¿Cómo se automatizan los mensajes de WhatsApp?",
      "¿Se pueden automatizar las facturas y las tareas administrativas?",
      "¿Cómo empiezo a automatizar los procesos de mi empresa?",
    ].map(norm),
  );
});

test("examples answer names the six bento examples", () => {
  const { a } = automatizaciones.faqs[2];
  for (const term of [
    /WhatsApp/,
    /facturas/,
    /citas/,
    /formularios/,
    /avisos/,
    /informes/,
  ]) {
    assert.match(a, term);
  }
});

test("AI answer: tools to automate, where AI fits, link to the AI page", () => {
  const faq = automatizaciones.faqs[1];
  assert.match(faq.a, /n8n|Make/);
  assert.match(faq.a, /IA|inteligencia artificial/);
  assert.deepEqual(faq.links, [
    {
      label: "Chatbots y soluciones con IA",
      href: "/inteligencia-artificial/",
    },
  ]);
  assert.notEqual(norm(faq.q), norm("¿Cuál es la mejor IA para empresas?"));
});

test("FAQ answers are self-contained and hold no figures", () => {
  for (const { q, a } of automatizaciones.faqs) {
    assert.doesNotMatch(a.replace(/n8n/gi, ""), /\d/, q);
    assert.doesNotMatch(a, claims, q);
    assert.doesNotMatch(
      a,
      /\b(arriba|abajo|como ves|como has visto|de esta página|anterior)\b/i,
      `${q} refers to the page around it`,
    );
    assert.ok(a.split(/(?<=[.!?])\s+/).length >= 2, `${q} has two sentences`);
  }
});

test(
  "built page stays within the word budget with matching FAQPage",
  { skip: !existsSync(new URL("dist/automatizaciones/index.html", root)) },
  () => {
    const html = read("dist/automatizaciones/index.html");
    const main = html.match(/<main\b[\s\S]*?<\/main>/)?.[0] ?? "";
    const words = withoutWordBudgetExcluded(main)
      .replace(/<(script|style)\b[\s\S]*?<\/\1>/g, " ")
      .replace(/<[^>]+>/g, " ")
      .split(/\s+/)
      .filter(Boolean).length;
    assert.ok(words >= 700 && words <= 800, `${words} words`);
  },
);

// --- Review round (NRD-166) ----------------------------------------------------

test("meta description price comes from pricing.from", () => {
  const price = automatizaciones.pricing.from.replace(/\s*€/, "");
  assert.ok(
    automatizaciones.seo.description.includes(`desde ${price} euros`),
    automatizaciones.seo.description,
  );
});

test("FlowMock pulse nudge stays clear of the arrowhead", () => {
  const style =
    read(mockPath).match(/<style[^>]*>([\s\S]*)<\/style>/)?.[1] ?? "";
  const shifts = [...style.matchAll(/translateX\((-?[\d.]+)px\)/g)].map((m) =>
    Math.abs(Number(m[1])),
  );
  assert.ok(shifts.length > 0);
  for (const px of shifts) assert.ok(px <= 4, `nudge of ${px}px`);
});

test(
  "built page keeps headroom under the word budget for the rating cell",
  { skip: !existsSync(new URL("dist/automatizaciones/index.html", root)) },
  () => {
    const main =
      read("dist/automatizaciones/index.html").match(
        /<main\b[\s\S]*?<\/main>/,
      )?.[0] ?? "";
    const words = withoutWordBudgetExcluded(main)
      .replace(/<(script|style)\b[\s\S]*?<\/\1>/g, " ")
      .replace(/<[^>]+>/g, " ")
      .split(/\s+/)
      .filter(Boolean).length;
    assert.ok(words <= 790, `${words} words`);
  },
);
