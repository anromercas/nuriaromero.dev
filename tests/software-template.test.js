import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

// --- Task 1.1: page illustrations (NRD-208) -----------------------------------

const mockPath = "src/components/software/AppMock.astro";
const artPath = "src/components/software/SoftwareTileArt.astro";
const svgTags = (source) => source.match(/<svg\b[^>]*>/g) ?? [];
const markupOf = (source) =>
  source.replace(/<style[\s\S]*<\/style>/, "").replace(/^---[\s\S]*?---/, "");

for (const path of [mockPath, artPath]) {
  test(`${path} draws single-stroke accessible SVGs without digits`, () => {
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
    }
    assert.doesNotMatch(markup, /€|\d\s?%/, "no price or metric in a drawing");
    assert.doesNotMatch(source, /yellow/i);
  });
}

test("SoftwareTileArt has no SVG text at all", () => {
  assert.doesNotMatch(markupOf(read(artPath)), /<text\b/);
});

test("AppMock is an honest illustrative figure with a reduced-motion guard", () => {
  const source = read(mockPath);
  assert.match(
    source,
    /<figure[^>]*aria-label="Herramienta interna de ejemplo con una lista de pedidos y su estado"/s,
  );
  assert.match(source, /<figcaption>Ejemplo ilustrativo<\/figcaption>/);
  assert.match(source, /animate\?:\s*boolean/);
  assert.match(source, /animate\s*=\s*true/);
  assert.match(source, /@media \(prefers-reduced-motion: no-preference\)/);
  assert.match(source, /@supports \(animation-timeline: scroll\(\)\)/);
  assert.equal(svgTags(source).length, 1, "one single-viewBox SVG");
  const texts = [...source.matchAll(/<text\b[^>]*>\s*([^<]*?)\s*<\/text>/g)];
  assert.deepEqual(
    texts.map((m) => m[1]),
    ["Pedidos"],
    "the only drawing text is a common noun",
  );
});

test("AppMock rests in the completed drawing at scroll 0 and without timelines", () => {
  const source = read(mockPath);
  const style = source.match(/<style[^>]*>([\s\S]*)<\/style>/)?.[1] ?? "";
  assert.doesNotMatch(style, /stroke-dashoffset/, "no stroke starts hidden");
  assert.doesNotMatch(style, /visibility:\s*hidden/);
  for (const [, from] of style.matchAll(
    /(?:from|0%)\s*\{[^}]*opacity:\s*([\d.]+)/g,
  )) {
    assert.ok(Number(from) >= 0.7, `keyframe starts at opacity ${from}`);
  }
  const outside = style.replace(/@media[\s\S]*?\n  \}\n/g, "");
  assert.doesNotMatch(outside, /animation:/);
  assert.doesNotMatch(outside, /opacity:\s*0[;\s]/);
  const first = style.match(/@keyframes[^{]+\{\s*0%\s*\{([^}]*)\}/)?.[1] ?? "";
  assert.match(
    first,
    /transform:\s*none/,
    "first keyframe is the resting pose",
  );
  const shifts = [...style.matchAll(/translateX\((-?[\d.]+)px\)/g)].map((m) =>
    Math.abs(Number(m[1])),
  );
  for (const px of shifts) assert.ok(px <= 4, `nudge of ${px}px`);
});

test("SoftwareTileArt offers one drawing per kind", () => {
  const source = read(artPath);
  const union = source.match(/kind:([\s\S]*?);\s*\}/)?.[1] ?? "";
  const kinds = ["web", "movil", "gestion", "api", "reservas", "datos"];
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

// --- Task 2.1: page on the template (NRD-209) ----------------------------------

const { desarrolloSoftware } = await import(
  new URL("../src/data/services.ts", import.meta.url)
);
const pageSource = () => read("src/pages/desarrollo-software-medida.astro");

test("page uses the template variant and drops the legacy blocks", () => {
  const page = pageSource();
  assert.match(
    page,
    /<ServiceLayout\s+page=\{desarrolloSoftware\}\s+variant="template"/,
  );
  assert.doesNotMatch(page, /TitleSection|✓/);
  assert.doesNotMatch(page, /text-gray-|bg-gray-/);
});

test("page composes the template components in reference slot order", () => {
  const page = pageSource();
  const order = [
    'slot="hero"',
    "<SeoLocalHero",
    '<AppMock slot="visual"',
    "<ProofStrip",
    'slot="benefits"',
    "<ReviewBento",
    "<SoftwareTileArt",
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

test("proof strip keeps experience, rating and the two real websites", () => {
  const page = pageSource();
  assert.match(page, /SITE_PROOF\[0\]/);
  assert.match(page, /SITE_PROOF\[1\]/);
  assert.match(page, /reviewsData\s*\?/);
  assert.match(page, /projects=\{\["arkady", "adfsevilla"\]\}/);
});

test("keyword headings are bound to desarrolloSoftware.sectionTitles", () => {
  const page = pageSource();
  for (const key of ["benefits", "process", "pricing", "faq"]) {
    assert.match(
      page,
      new RegExp(
        `keyword=\\{desarrolloSoftware\\.sectionTitles\\?\\.${key}\\b`,
      ),
      `sectionTitles.${key}`,
    );
  }
  assert.match(page, /keyword=\{desarrolloSoftware\.hero\.h1\}/);
  assert.match(page, /secondaryLink=\{\{[^}]*href:\s*"#precios"/s);
  assert.match(page, /internalLinksBySource\[desarrolloSoftware\.slug\]/);
  assert.match(page, /keyword="¿Software a medida o estándar\?"/);
});

test("the single plan is built from desarrolloSoftware.pricing", () => {
  const page = pageSource();
  assert.match(page, /tiers=\{\[plan\]\}/);
  for (const field of ["from", "includes", "note"]) {
    assert.match(
      page,
      new RegExp(`desarrolloSoftware\\.pricing\\.${field}\\b`),
    );
  }
  assert.match(page, /desde\s+\{desarrolloSoftware\.pricing\.from\}/);
  assert.doesNotMatch(page, /€/, "no price literal in the page");
  assert.equal(desarrolloSoftware.pricing.tiers, undefined, "no tiers in data");
});

test("services.ts holds the price once, as SOFTWARE_FROM", () => {
  const services = read("src/data/services.ts");
  assert.equal(services.match(/"999 €"/g)?.length, 1);
  assert.match(services, /const SOFTWARE_FROM = "999 €"/);
  assert.match(services, /pricing:\s*\{\s*from:\s*SOFTWARE_FROM/);
  assert.equal(desarrolloSoftware.pricing.from, "999 €");
});

test("data: six tiles, four steps, hero and closing copy", () => {
  assert.equal(desarrolloSoftware.benefits.length, 6);
  assert.equal(desarrolloSoftware.process.length, 4);
  const titles = desarrolloSoftware.benefits.map((b) => b.title).join(" ");
  for (const term of [/web/i, /móvil/, /ERP/, /API/, /Reservas/, /datos/i]) {
    assert.match(titles, term);
  }
  const { title, titleAccent, secondaryCta } = desarrolloSoftware.hero;
  assert.ok(title.includes(titleAccent), "accent is a substring of the title");
  assert.equal(secondaryCta.label, "Ver precio");
  assert.equal(secondaryCta.href, "#precios");
  assert.equal(
    desarrolloSoftware.sectionTitles.benefits,
    "Qué software a medida puedo hacer para tu empresa",
  );
  assert.ok(desarrolloSoftware.cta.title.length > 0);
  assert.ok(desarrolloSoftware.cta.text.length > 0);
  assert.ok(
    desarrolloSoftware.hero.subtitle.includes("aplicaciones web a medida"),
  );
});

test("intent signals and published price stay as they were", () => {
  const { sectionTitles, hero, seo } = desarrolloSoftware;
  assert.equal(
    sectionTitles.process,
    "Así es el proceso de desarrollar tu aplicación a medida",
  );
  assert.equal(
    sectionTitles.pricing,
    "Cuánto cuesta el software a medida en Sevilla",
  );
  assert.equal(
    hero.h1,
    "Desarrollo de software a medida en Sevilla para tu empresa",
  );
  assert.equal(
    seo.title,
    "Desarrollo de software a medida en Sevilla | Aplicaciones web",
  );
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

test("no figure other than the price and the experience in the page copy", () => {
  for (const text of copyStrings(desarrolloSoftware)) {
    for (const digits of text.match(/\d+/g) ?? []) {
      assert.ok(["999", "10"].includes(digits), `"${digits}" in "${text}"`);
    }
  }
});

test("meta description carries the starting price from pricing.from", () => {
  const { description } = desarrolloSoftware.seo;
  const price = desarrolloSoftware.pricing.from.replace(/\s*€/, "");
  assert.ok(description.includes(`desde ${price} euros`), description);
  assert.ok(description.length <= 160, `${description.length}`);
});

// --- Task 2.2: FAQ and word budget (NRD-210) -----------------------------------

const norm = (s) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

test("template-pages lists the software page with the word budget", () => {
  assert.match(
    read("scripts/lib/template-pages.mjs"),
    /\{\s*route:\s*"\/desarrollo-software-medida\/",\s*words:\s*\[750,\s*850\],\s*service:\s*true\s*\}/,
  );
});

test("FAQ holds the five sourced questions in order", () => {
  assert.deepEqual(
    desarrolloSoftware.faqs.map((f) => norm(f.q)),
    [
      "¿Qué es un software a medida?",
      "¿Cuánto cuesta un software a medida?",
      "¿Qué se puede desarrollar a medida: aplicación web, app móvil, ERP o API?",
      "¿De quién es el código?",
      "¿Qué empresas de desarrollo de software a medida hay en Sevilla?",
    ].map(norm),
  );
});

test("price answer interpolates SOFTWARE_FROM and speaks of phases", () => {
  const services = read("src/data/services.ts");
  assert.match(services, /`Desde \$\{SOFTWARE_FROM\}[^`]*`/);
  const { a } = desarrolloSoftware.faqs[1];
  assert.ok(a.startsWith(`Desde ${desarrolloSoftware.pricing.from}`), a);
  assert.match(a, /fases/);
});

test("code answer repeats what the site already publishes", () => {
  const { a } = desarrolloSoftware.faqs[3];
  assert.match(a, /c[oó]digo/);
  assert.match(a, /tuyos? desde el primer d[ií]a/);
});

test("companies answer holds no ranking and names Sevilla", () => {
  const { a } = desarrolloSoftware.faqs[4];
  assert.doesNotMatch(a, /mejores|ranking|top \d/i);
  assert.match(a, /Sevilla/);
});

test("what-can-be-built answer names web, móvil, ERP and API", () => {
  const { a } = desarrolloSoftware.faqs[2];
  for (const term of [/web/, /móvil/, /ERP/, /API/, /reservas/]) {
    assert.match(a, term);
  }
});

test("FAQ answers are self-contained: two sentences, no reference to the page", () => {
  for (const { q, a } of desarrolloSoftware.faqs) {
    assert.doesNotMatch(
      a,
      /\b(arriba|abajo|como ves|como has visto|de esta página|anterior)\b/i,
      `${q} refers to the page around it`,
    );
    assert.ok(a.split(/(?<=[.!?])\s+/).length >= 2, `${q} has two sentences`);
  }
});

const builtWords = () => {
  const main =
    read("dist/desarrollo-software-medida/index.html").match(
      /<main\b[\s\S]*?<\/main>/,
    )?.[0] ?? "";
  return main
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
};
const hasBuild = existsSync(
  new URL("dist/desarrollo-software-medida/index.html", root),
);

test(
  "built page stays within the word budget, with headroom for the rating cell",
  { skip: !hasBuild },
  () => {
    const words = builtWords();
    assert.ok(words >= 750 && words <= 840, `${words} words`);
  },
);
