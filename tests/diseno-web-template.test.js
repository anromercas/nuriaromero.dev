import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

const disenoWebBlock = () => {
  const source = read("src/data/services.ts");
  const start = source.indexOf("export const disenoWeb");
  const end = source.indexOf("export const ", start + 10);
  return source.slice(start, end === -1 ? undefined : end);
};

test("types.ts declares one-time billing and FAQ links", () => {
  const types = read("src/data/types.ts");
  assert.match(types, /tierBilling\?:\s*"monthly"\s*\|\s*"one-time"/);
  assert.match(
    types,
    /faqs:\s*\{[^}]*links\?:\s*\{\s*label:\s*string;\s*href:\s*string\s*\}\[\]/s,
  );
});

test("serviceSchema has a one-time branch without a monthly unit price", () => {
  const schema = read("src/lib/schema.ts");
  assert.match(schema, /billing\?:\s*"monthly"\s*\|\s*"one-time"/);
  assert.match(schema, /billing\s*===\s*"one-time"/);
  const start = schema.indexOf('service.billing === "one-time"');
  assert.ok(start > -1, "one-time branch present");
  const branch = schema.slice(start, schema.indexOf(": {", start));
  assert.doesNotMatch(branch, /UnitPriceSpecification|priceSpecification/);
  assert.match(schema, /unitText:\s*"MON"/, "monthly branch stays");
});

test("ServiceLayout passes billing with the tiers", () => {
  const layout = read("src/layouts/ServiceLayout.astro");
  assert.match(layout, /billing:\s*page\.tierBilling/);
});

test("disenoWeb opts in to one-time tier offers", () => {
  const block = disenoWebBlock();
  assert.match(block, /offersFromTiers:\s*true/);
  assert.match(block, /tierBilling:\s*"one-time"/);
});

test("check-seo-02 asserts the one-time offers of /diseno-web-sevilla/", () => {
  const check = read("scripts/check-seo-02.mjs");
  assert.match(check, /one-time/);
  assert.match(check, /Landing de una página/);
  assert.match(check, /Web completa \(hasta 5 páginas\)/);
});

// --- Page illustrations (task 1.2) ------------------------------------------

const webMockPath = "src/components/diseno-web/WebMock.astro";
const webTileArtPath = "src/components/diseno-web/WebTileArt.astro";
const svgTags = (source) => source.match(/<svg\b[^>]*>/g) ?? [];

for (const path of [webMockPath, webTileArtPath]) {
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
    const cssFills = [...source.matchAll(/fill:\s*([^;}]+)/g)].map((m) =>
      m[1].trim(),
    );
    for (const fill of cssFills) {
      assert.ok(
        ["var(--card-surface)", "var(--text-secondary)"].includes(fill),
        `only the phone screen ground and SVG text, found `,
      );
    }
  });
}

test("WebMock is an honest illustrative figure with a reduced-motion guard", () => {
  const source = read(webMockPath);
  assert.match(
    source,
    /<figure\b[^>]*aria-label="Web de ejemplo de un negocio, en ordenador y en móvil"/,
  );
  assert.match(source, /<figcaption>Ejemplo ilustrativo<\/figcaption>/);
  assert.match(source, /animate\?:\s*boolean/);
  assert.match(source, /animate\s*=\s*true/);
  assert.match(source, /@media \(prefers-reduced-motion: no-preference\)/);
  assert.match(source, /@supports \(animation-timeline: scroll\(\)\)/);
  assert.ok(source.includes("tunegocio.es"), "address pill text");
  const markup = source.replace(/<style[\s\S]*<\/style>/, "");
  assert.doesNotMatch(source, /yellow|estrella|polygon/i);
  assert.doesNotMatch(markup, /\d\s?%/, "no fake metrics in the drawing");
  assert.equal(svgTags(source).length, 1, "one single-viewBox SVG");
});

test("WebMock never fades text below full opacity", () => {
  const source = read(webMockPath);
  const style = source.match(/<style[^>]*>([\s\S]*)<\/style>/)?.[1] ?? "";
  const fading = [
    ...style.matchAll(/@keyframes\s+([\w-]+)\s*\{([\s\S]*?\})\s*\}/g),
  ]
    .filter((k) => /opacity\s*:/.test(k[2]))
    .map((k) => k[1]);
  for (const name of fading) {
    const users = [...style.matchAll(/([^{}]+)\{([^{}]*)\}/g)].filter(
      (rule) =>
        new RegExp(`animation\\s*:[^;]*\\b${name}\\b`).test(rule[2]) &&
        !rule[1].includes("@keyframes"),
    );
    for (const [, selector] of users) {
      assert.match(
        selector.trim(),
        /\.phone\s*$/,
        `${name} only fades the text-free phone, got "${selector.trim()}"`,
      );
    }
  }
  const phone =
    source.match(/<g class="phone"[\s\S]*?<\/g>\s*<\/svg>/)?.[0] ?? "";
  assert.ok(phone.length > 0, "phone group found");
  assert.doesNotMatch(phone, /<text\b/, "no text inside the phone group");
});

test("WebTileArt offers one drawing per kind and no panel", () => {
  const source = read(webTileArtPath);
  const union = source.match(/kind:([\s\S]*?);\s*\}/)?.[1] ?? "";
  for (const kind of [
    "movil",
    "seo-local",
    "contacto",
    "google",
    "dominio",
    "soporte",
  ]) {
    assert.ok(union.includes(`"${kind}"`), `kind ${kind} in the union`);
    assert.ok(
      source.includes(`kind === "${kind}"`),
      `drawing for kind ${kind}`,
    );
  }
  assert.doesNotMatch(union, /panel/i, "no panel kind (owner fact H2)");
  assert.doesNotMatch(source, /panel/i);
  for (const cls of ["signal", "soft", "label"]) {
    assert.match(
      source,
      new RegExp(`class="[^"]*\\b${cls}\\b`),
      `uses .${cls}`,
    );
  }
  assert.ok(source.includes("tunegocio.es"), "dominio address pill text");
  assert.ok(source.includes("Sevilla"), "seo-local pin label");
});

// --- Page on the template (task 2.1) -----------------------------------------

const { disenoWeb } = await import("../src/data/services.ts");
const pageSource = () => read("src/pages/diseno-web-sevilla.astro");

const SELF_EDIT =
  /\b(t[uú] mism[oa]|por tu cuenta|te enseño a (editar|cambiar)|editarla t[uú]|cambias (t[uú] )?(un|los) (texto|precio)|sin depender de m[ií])\b/i;
const SUPPORT = "Un mes de soporte tras el lanzamiento";

test("page uses the template variant and drops the legacy blocks", () => {
  const page = pageSource();
  assert.match(
    page,
    /<ServiceLayout\s+page=\{disenoWeb\}\s+variant="template"/,
  );
  assert.doesNotMatch(page, /TitleSection|niches|✓/);
  assert.doesNotMatch(page, /<Projects\b/);
  assert.doesNotMatch(page, /text-gray-|bg-gray-/);
});

test("page composes the template components in reference slot order", () => {
  const page = pageSource();
  const order = [
    'slot="hero"',
    "<SeoLocalHero",
    '<WebMock slot="visual"',
    "<ProofStrip",
    'slot="benefits"',
    "<ReviewBento",
    "<WebTileArt",
    'slot="process"',
    "<SeoLocalProcess",
    'slot="before-pricing"',
    "<RealProof",
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

test("keyword headings are bound to disenoWeb.sectionTitles and CTA to prices", () => {
  const page = pageSource();
  for (const key of ["benefits", "process", "pricing", "faq"]) {
    assert.match(
      page,
      new RegExp(`keyword=\\{disenoWeb\\.sectionTitles\\?\\.${key}\\b`),
      `sectionTitles.${key}`,
    );
  }
  assert.match(page, /keyword=\{disenoWeb\.hero\.h1\}/);
  assert.match(page, /secondaryLink=\{\{[^}]*href:\s*"#precios"/);
  assert.match(page, /tierFrom\(disenoWeb,\s*"Landing de una página"\)/);
  assert.match(
    page,
    /tierFrom\(disenoWeb,\s*"Web completa \(hasta 5 páginas\)"\)/,
  );
  assert.match(page, /projects=\{\["arkady",\s*"adfsevilla"\]\}/);
  assert.match(page, /internalLinksBySource\[disenoWeb\.slug\]/);
});

test("disenoWeb keeps its published identity", () => {
  assert.equal(
    disenoWeb.seo.title,
    "Diseño web Sevilla | Diseñadora web, precio cerrado desde 149 €",
  );
  assert.equal(
    disenoWeb.hero.h1,
    "Diseño web Sevilla para negocios que quieren clientes, no solo una web bonita",
  );
  assert.deepEqual(disenoWeb.hero.secondaryCta, {
    label: "Ver precios",
    href: "#precios",
  });
  assert.deepEqual(
    disenoWeb.pricing.tiers.map((t) => [t.name, t.from, !!t.recommended]),
    [
      ["Landing de una página", "149 €", false],
      ["Web completa (hasta 5 páginas)", "399 €", true],
    ],
  );
});

test("disenoWeb hero has a display title with an accent inside it", () => {
  const { title, titleAccent, subtitle } = disenoWeb.hero;
  assert.ok(title && titleAccent, "hero.title and hero.titleAccent");
  assert.ok(title.includes(titleAccent), "accent is a substring of the title");
  assert.ok(subtitle.split(/\s+/).length <= 35, "short subtitle");
});

test("disenoWeb has six benefits, domain and hosting included, no panel", () => {
  assert.equal(disenoWeb.benefits.length, 6);
  assert.ok(
    disenoWeb.benefits.some((b) => /dominio y hosting/i.test(b.title)),
    "a tile titled with dominio y hosting",
  );
  for (const b of disenoWeb.benefits) {
    assert.doesNotMatch(`${b.title} ${b.text}`, /panel/i, b.title);
  }
});

test("disenoWeb has four short process steps with no self-editing promise", () => {
  assert.equal(disenoWeb.process.length, 4);
  for (const step of disenoWeb.process) {
    assert.doesNotMatch(`${step.title} ${step.text}`, SELF_EDIT, step.title);
    assert.doesNotMatch(`${step.title} ${step.text}`, /panel/i, step.title);
  }
});

test("support month is listed in both plans", () => {
  for (const tier of disenoWeb.pricing.tiers) {
    assert.ok(tier.includes.includes(SUPPORT), `${tier.name} lists support`);
    assert.equal(tier.includes.at(-1), SUPPORT, `${tier.name} lists it last`);
  }
});

test("no benefit, step or plan frames support as full-website only", () => {
  const strings = [
    ...disenoWeb.benefits.map((b) => `${b.title}. ${b.text}`),
    ...disenoWeb.process.map((s) => `${s.title}. ${s.text}`),
  ];
  for (const text of strings) {
    for (const sentence of text.split(/(?<=[.!?])\s+/)) {
      if (/soporte/i.test(sentence)) {
        assert.doesNotMatch(sentence, /web completa/i, sentence);
      }
    }
  }
});

test("hero subtitle interpolates the landing price published in the plan", () => {
  const landing = disenoWeb.pricing.tiers.find(
    (t) => t.name === "Landing de una página",
  );
  assert.ok(disenoWeb.hero.subtitle.includes(landing.from));
  assert.equal(disenoWeb.pricing.from, landing.from);
});

// --- Sourced FAQ and owner-fact guards (task 2.2) ---------------------------------

const norm = (text) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[¿?¡!.,]/g, "")
    .trim();

// The sourced questions of NRD-165 ("Investigación"); question 3 is answered by
// the comparison section and is not in the FAQ.
const SOURCED = [
  "cuanto cuesta hacer una pagina web",
  "cuanto se tarda en hacer una web",
  "puedo hacer yo mi web gratis",
  "wordpress o web a medida",
  "la web incluye seo",
  "que presupuesto necesito",
];
const GUIDE = "/blog/cuanto-cuesta-una-pagina-web-en-sevilla/";

const allStrings = (value, out = []) => {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => allStrings(v, out));
  else if (value && typeof value === "object")
    Object.values(value).forEach((v) => allStrings(v, out));
  return out;
};
const sentences = (text) => text.split(/(?<=[.!?:])\s+|\n+/);
const NEGATED_PANEL = /presupuest|sin panel|no incluye|no incluyen|sin un panel/i;

test("FAQ has six items, each a sourced question", () => {
  assert.equal(disenoWeb.faqs.length, 6);
  const questions = disenoWeb.faqs.map((f) => norm(f.q));
  assert.deepEqual(questions, SOURCED);
});

test("price and budget answers use the published prices and link to the guide", () => {
  for (const q of [SOURCED[0], SOURCED[5]]) {
    const faq = disenoWeb.faqs.find((f) => norm(f.q) === q);
    assert.ok(faq.a.includes("149 €") && faq.a.includes("399 €"), q);
    assert.ok(
      faq.links?.some((l) => l.href === GUIDE),
      `${q} links to the guide`,
    );
  }
  const seo = disenoWeb.faqs.find((f) => norm(f.q) === SOURCED[4]);
  assert.ok(seo.links?.some((l) => l.href === "/seo-local-sevilla/"));
  for (const faq of disenoWeb.faqs) {
    for (const link of faq.links ?? []) {
      assert.ok(link.href.endsWith("/"), `${link.href} ends in /`);
    }
  }
});

test("FAQ data holds no market range and no price literal", () => {
  const block = disenoWebBlock();
  const faqSource = block.slice(block.indexOf("faqs: ["), block.indexOf("cta:"));
  assert.doesNotMatch(faqSource, /500 y 3\.000/);
  assert.doesNotMatch(faqSource, /€/, "prices come from the constants");
  assert.match(faqSource, /\$\{LANDING_FROM\}/);
  assert.match(faqSource, /\$\{WEB_FROM\}/);
  const all = read("src/data/services.ts");
  assert.equal((all.match(/const WEB_FROM = "399 €"/g) ?? []).length, 1);
});

test("no heading targets the DIY or price-guide terms", () => {
  const titles = Object.values(disenoWeb.sectionTitles).join(" | ");
  assert.doesNotMatch(titles, /gratis|hacer una p[aá]gina web/i);
  assert.doesNotMatch(pageSource(), /title=\{\{[^}]*gratis/i);
});

test("the DIY answer says when it makes sense and when it does not", () => {
  const faq = disenoWeb.faqs.find((f) => norm(f.q) === SOURCED[2]);
  assert.match(faq.a, /^S[ií]/);
  assert.match(faq.a, /se queda corto/i);
});

test("the WordPress answer states the plans have no editing panel, quoted apart", () => {
  const faq = disenoWeb.faqs.find((f) => norm(f.q) === SOURCED[3]);
  assert.match(faq.a, /sin panel de edici[oó]n/i);
  assert.match(faq.a, /se presupuesta aparte/i);
  assert.match(faq.a, /soporte/i);
});

const ownerFactChecks = (label, texts) => {
  for (const text of texts) {
    for (const sentence of sentences(text)) {
      if (/\bpanel\b/i.test(sentence)) {
        assert.match(
          sentence,
          NEGATED_PANEL,
          `${label}: panel only as not included or quoted apart: "${sentence}"`,
        );
      }
    }
    assert.doesNotMatch(text, SELF_EDIT, `${label}: self-edit promise`);
  }
};

test("disenoWeb promises no panel and no self-editing anywhere", () => {
  ownerFactChecks("disenoWeb", allStrings(disenoWeb));
});

test("outside the plan cards, support is never framed as full-website only", () => {
  const { tiers, ...pricing } = disenoWeb.pricing;
  const texts = allStrings({ ...disenoWeb, pricing });
  for (const text of texts) {
    for (const sentence of sentences(text)) {
      if (/soporte/i.test(sentence)) {
        assert.doesNotMatch(sentence, /web completa/i, sentence);
      }
    }
  }
});

test("the built page keeps the owner facts and the word budget", (t) => {
  const file = new URL("dist/diseno-web-sevilla/index.html", root);
  if (!existsSync(file)) return t.skip("dist not built");
  const html = readFileSync(file, "utf8");
  const main = html.match(/<main\b[\s\S]*<\/main>/)?.[0] ?? "";
  const text = main
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ");
  ownerFactChecks("built page", [text]);
  assert.doesNotMatch(text, /500 y 3\.000/);
  assert.ok(
    (text.match(/Un mes de soporte tras el lanzamiento/g) ?? []).length >= 2,
    "support listed in both plans",
  );
});
