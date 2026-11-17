import { test } from "node:test";
import assert from "node:assert/strict";
import {
  PROMISE_PATTERN,
  SEO_PARA_IA_URL,
  seoParaIaFailures,
} from "../scripts/lib/seo-para-ia-contract.mjs";

const ld = (o) =>
  `<script type="application/ld+json">${JSON.stringify(o)}</script>`;

const service = { "@type": "Service", name: "SEO para IA" };
const faq = {
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Puedo salir en ChatGPT?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nadie puede prometerte nada.",
      },
    },
  ],
};
const crumbs = { "@type": "BreadcrumbList", itemListElement: [] };

function page({
  title = "SEO para IA | Nuria Romero",
  description = "Que los asistentes de IA entiendan tu negocio.",
  h1 = "SEO para IA: que ChatGPT, Gemini y Google entiendan tu negocio",
  extraH1 = "",
  canonical = `<link rel="canonical" href="${SEO_PARA_IA_URL}">`,
  body = "<p>Texto sobrio.</p>",
  byline = '<a href="/">consultor SEO en Sevilla</a>',
  entities = [service, faq, crumbs],
} = {}) {
  return `<html><head><title>${title}</title>
<meta name="description" content="${description}">${canonical}
${entities.map(ld).join("\n")}</head>
<body><header><a href="/">consultor</a></header>
<main><h1>${h1}</h1>${extraH1}<p>Por ${byline}.</p>${body}</main></body></html>`;
}

const sitemap = `<urlset><url><loc>${SEO_PARA_IA_URL}</loc></url></urlset>`;
const llms = `# Nuria\n\n## Servicios\n\n- [SEO para IA](${SEO_PARA_IA_URL}): guía\n\n## Contacto\n\n- x\n`;
const ok = () => ({ html: page(), sitemap, llms });
const failures = (over) => seoParaIaFailures({ ...ok(), ...over });
const has = (list, re) => list.some((f) => re.test(f));

test("valid fixtures pass", () => {
  assert.deepEqual(seoParaIaFailures(ok()), []);
});

test("two h1 fail", () => {
  const f = failures({ html: page({ extraH1: "<h1>Otro</h1>" }) });
  assert.ok(has(f, /expected 1 <h1>, found 2/), f.join("\n"));
});

test("h1 without SEO para IA fails", () => {
  const f = failures({ html: page({ h1: "Servicios web" }) });
  assert.ok(has(f, /h1.*SEO para IA/i), f.join("\n"));
});

test("canonical to another url fails", () => {
  const f = failures({
    html: page({
      canonical: '<link rel="canonical" href="https://nuriaromero.dev/">',
    }),
  });
  assert.ok(has(f, /canonical/), f.join("\n"));
});

test("missing canonical fails", () => {
  const f = failures({ html: page({ canonical: "" }) });
  assert.ok(has(f, /canonical/), f.join("\n"));
});

test("canonical with swapped attribute order passes", () => {
  const html = page({
    canonical: `<link href="${SEO_PARA_IA_URL}" rel="canonical">`,
  });
  assert.deepEqual(failures({ html }), []);
});

for (const type of ["Service", "FAQPage", "BreadcrumbList"]) {
  test(`missing ${type} fails`, () => {
    const entities = [service, faq, crumbs].filter((e) => e["@type"] !== type);
    const f = failures({ html: page({ entities }) });
    assert.ok(has(f, new RegExp(type)), f.join("\n"));
  });
}

test("Service with offers fails", () => {
  const html = page({
    entities: [{ ...service, offers: { price: 1 } }, faq, crumbs],
  });
  assert.ok(has(failures({ html }), /offers/));
});

test("second consultor in main fails", () => {
  const f = failures({
    html: page({ body: "<p>Soy consultor freelance.</p>" }),
  });
  assert.ok(has(f, /consultor/), f.join("\n"));
});

test("consultor in title fails", () => {
  const f = failures({ html: page({ title: "Consultor SEO para IA" }) });
  assert.ok(has(f, /consultor/), f.join("\n"));
});

test("consultor in meta description fails", () => {
  const f = failures({ html: page({ description: "Tu consultor de IA" }) });
  assert.ok(has(f, /consultor/), f.join("\n"));
});

test("consultor in the page's own JSON-LD fails", () => {
  const html = page({
    entities: [{ ...service, description: "consultor" }, faq, crumbs],
  });
  assert.ok(has(failures({ html }), /consultor/));
});

test("consultor in header outside main is not counted", () => {
  assert.deepEqual(seoParaIaFailures(ok()), []);
});

test("home link with another anchor fails", () => {
  const f = failures({
    html: page({ byline: '<a href="/">mi consultor</a>' }),
  });
  assert.ok(has(f, /byline|consultor SEO en Sevilla/), f.join("\n"));
});

test("byline link to another href fails", () => {
  const f = failures({
    html: page({ byline: '<a href="/otra/">consultor SEO en Sevilla</a>' }),
  });
  assert.ok(has(f, /byline|consultor SEO en Sevilla/), f.join("\n"));
});

for (const phrase of [
  "garantizamos",
  "primeras posiciones",
  "te sale en",
  "te recomendar",
  "aseguro",
]) {
  test(`promise "${phrase}" in main fails`, () => {
    assert.ok(PROMISE_PATTERN.test(phrase));
    const f = failures({ html: page({ body: `<p>Ya ${phrase} algo.</p>` }) });
    assert.ok(has(f, /promise/i), f.join("\n"));
  });
}

test("promise in title and FAQ answer fails", () => {
  assert.ok(
    has(
      failures({ html: page({ title: "Te garantizamos SEO para IA" }) }),
      /promise/i,
    ),
  );
  const bad = {
    ...faq,
    mainEntity: [
      {
        ...faq.mainEntity[0],
        acceptedAnswer: { "@type": "Answer", text: "Te aseguro todo." },
      },
    ],
  };
  assert.ok(
    has(
      failures({ html: page({ entities: [service, bad, crumbs] }) }),
      /promise/i,
    ),
  );
});

test("sitemap without the url fails", () => {
  const f = failures({ sitemap: "<urlset></urlset>" });
  assert.ok(has(f, /sitemap/i), f.join("\n"));
});

test("llms.txt without the line fails", () => {
  const f = failures({ llms: "## Servicios\n\n- nada\n" });
  assert.ok(has(f, /llms/i), f.join("\n"));
});

test("llms.txt line outside Servicios fails", () => {
  const f = failures({
    llms: `## Servicios\n\n- x\n\n## Otro\n\n- [SEO para IA](${SEO_PARA_IA_URL})\n`,
  });
  assert.ok(has(f, /llms/i), f.join("\n"));
});

test("missing inputs are reported, not thrown", () => {
  const f = seoParaIaFailures({});
  assert.ok(
    has(f, /html/i) && has(f, /sitemap/i) && has(f, /llms/i),
    f.join("\n"),
  );
});

test("invalid JSON-LD is reported, not thrown", () => {
  const html = page().replace(
    "</head>",
    '<script type="application/ld+json">{</script></head>',
  );
  assert.ok(has(failures({ html }), /json-ld/i));
});
