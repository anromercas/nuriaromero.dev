import { test } from "node:test";
import assert from "node:assert/strict";
import {
  parseRobotsGroups,
  aiTxtFailures,
  faqFailures,
  priceFailures,
  sitemapFailures,
} from "../scripts/lib/ai-discovery-contract.mjs";

// --- parseRobotsGroups -------------------------------------------------------

test("parseRobotsGroups groups consecutive User-agent lines and ignores noise", () => {
  const groups = parseRobotsGroups(
    [
      "# comment",
      "User-agent: A",
      "User-agent: B",
      "Allow: /",
      "Disallow: /x/",
      "",
      "User-agent: C",
      "Disallow: /",
      "Sitemap: https://example.com/sitemap-index.xml",
      "Host: example.com",
    ].join("\n"),
  );
  assert.deepEqual([...groups.keys()], ["A", "B", "C"]);
  assert.deepEqual(groups.get("A"), { allow: ["/"], disallow: ["/x/"] });
  assert.deepEqual(groups.get("B"), groups.get("A"));
  assert.deepEqual(groups.get("C"), { allow: [], disallow: ["/"] });
});

// --- aiTxtFailures -----------------------------------------------------------

const ROBOTS = "User-agent: *\nAllow: /\n\nUser-agent: GPTBot\nAllow: /\n";
const RESOURCES = [
  "# Recursos",
  "LLMs-Txt: https://nuriaromero.dev/llms.txt",
  "AI-Summary: https://nuriaromero.dev/ai/summary.json",
  "AI-FAQ: https://nuriaromero.dev/ai/faq.json",
  "Sitemap: https://nuriaromero.dev/sitemap-index.xml",
].join("\n");
const AI_TXT = `# ai.txt\n\nUser-agent: *\nAllow: /\n\nUser-agent: GPTBot\nAllow: /\n\n${RESOURCES}\n`;

test("aiTxtFailures is empty when ai.txt matches robots.txt and links resources", () => {
  assert.deepEqual(aiTxtFailures({ aiTxt: AI_TXT, robotsTxt: ROBOTS }), []);
});

test("aiTxtFailures flags Allow in ai.txt where robots.txt disallows", () => {
  const robots = "User-agent: *\nAllow: /\n\nUser-agent: GPTBot\nDisallow: /\n";
  const failures = aiTxtFailures({ aiTxt: AI_TXT, robotsTxt: robots });
  assert.ok(failures.some((f) => f.includes("GPTBot")));
});

test("aiTxtFailures flags an agent present only in ai.txt", () => {
  const aiTxt = AI_TXT.replace(
    "# Recursos",
    "User-agent: ExtraBot\nAllow: /\n\n# Recursos",
  );
  const failures = aiTxtFailures({ aiTxt, robotsTxt: ROBOTS });
  assert.ok(failures.some((f) => f.includes("ExtraBot")));
});

test("aiTxtFailures flags an agent present only in robots.txt", () => {
  const robots = `${ROBOTS}\nUser-agent: ClaudeBot\nAllow: /\n`;
  const failures = aiTxtFailures({ aiTxt: AI_TXT, robotsTxt: robots });
  assert.ok(failures.some((f) => f.includes("ClaudeBot")));
});

for (const link of [
  "llms.txt",
  "ai/summary.json",
  "ai/faq.json",
  "sitemap-index.xml",
]) {
  test(`aiTxtFailures flags a missing link to ${link}`, () => {
    const aiTxt = AI_TXT.split("\n")
      .filter((line) => !line.includes(link))
      .join("\n");
    const failures = aiTxtFailures({ aiTxt, robotsTxt: ROBOTS });
    assert.ok(failures.some((f) => f.includes(link)));
  });
}

test("aiTxtFailures requires absolute URLs on the site origin", () => {
  const aiTxt = AI_TXT.replaceAll(
    "https://nuriaromero.dev/",
    "https://other.example/",
  );
  const failures = aiTxtFailures({ aiTxt, robotsTxt: ROBOTS });
  for (const link of [
    "llms.txt",
    "ai/summary.json",
    "ai/faq.json",
    "sitemap-index.xml",
  ]) {
    assert.ok(
      failures.some((f) => f.includes(link)),
      link,
    );
  }
});

// --- faqFailures -------------------------------------------------------------

const ld = (faqs) =>
  `<html><head><script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "BreadcrumbList", itemListElement: [] },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map(([q, a]) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
    ],
  })}</script></head><body></body></html>`;
const pageFaq = (path, faqs) => ({
  url: `https://nuriaromero.dev${path}`,
  questions: faqs.map(([question, answer]) => ({ question, answer })),
});
const FAQS = [
  ["¿Uno?", "Respuesta uno."],
  ["¿Dos?", "Respuesta dos."],
];

test("faqFailures is empty when faq.json mirrors the FAQPage", () => {
  assert.deepEqual(
    faqFailures({
      faqJson: { pages: [pageFaq("/a/", FAQS)] },
      pages: [
        { route: "/a/", html: ld(FAQS) },
        { route: "/b/", html: "<html></html>" },
      ],
    }),
    [],
  );
});

test("faqFailures flags a faq.json question missing from the FAQPage", () => {
  const failures = faqFailures({
    faqJson: { pages: [pageFaq("/a/", [...FAQS, ["¿Tres?", "Tres."]])] },
    pages: [{ route: "/a/", html: ld(FAQS) }],
  });
  assert.ok(failures.some((f) => f.includes("¿Tres?")));
});

test("faqFailures flags a FAQPage question missing from faq.json", () => {
  const failures = faqFailures({
    faqJson: { pages: [pageFaq("/a/", FAQS.slice(0, 1))] },
    pages: [{ route: "/a/", html: ld(FAQS) }],
  });
  assert.ok(failures.some((f) => f.includes("¿Dos?")));
});

test("faqFailures flags a page with FAQPage that is absent from faq.json", () => {
  const failures = faqFailures({
    faqJson: { pages: [] },
    pages: [{ route: "/a/", html: ld(FAQS) }],
  });
  assert.ok(failures.some((f) => f.includes("/a/")));
});

test("faqFailures flags a faq.json page whose HTML has no FAQPage", () => {
  const failures = faqFailures({
    faqJson: { pages: [pageFaq("/a/", FAQS)] },
    pages: [{ route: "/a/", html: "<html></html>" }],
  });
  assert.ok(failures.some((f) => f.includes("/a/")));
});

test("faqFailures flags a different answer", () => {
  const failures = faqFailures({
    faqJson: {
      pages: [pageFaq("/a/", [FAQS[0], ["¿Dos?", "Otra respuesta."]])],
    },
    pages: [{ route: "/a/", html: ld(FAQS) }],
  });
  assert.ok(failures.some((f) => f.includes("¿Dos?")));
});

test("faqFailures flags a different order", () => {
  const failures = faqFailures({
    faqJson: { pages: [pageFaq("/a/", [...FAQS].reverse())] },
    pages: [{ route: "/a/", html: ld(FAQS) }],
  });
  assert.ok(failures.some((f) => /order/i.test(f)));
});

test("faqFailures reports two FAQPage blocks instead of guessing", () => {
  const html = ld(FAQS) + ld(FAQS);
  const failures = faqFailures({
    faqJson: { pages: [pageFaq("/a/", FAQS)] },
    pages: [{ route: "/a/", html }],
  });
  assert.ok(failures.some((f) => /more than one FAQPage/i.test(f)));
});

// --- priceFailures -----------------------------------------------------------

const svc = (over) => ({
  slug: "/s/",
  pricing: { from: "149 €" },
  ...over,
});
const tiered = svc({
  slug: "/t/",
  pricing: {
    from: "10 €",
    tiers: [
      { name: "Uno", from: "10 €", includes: [] },
      { name: "Dos", from: "20 €", includes: [] },
    ],
  },
});
const noOffer = svc({ slug: "/n/", ownOffer: false });
const niche = svc({ slug: "/sector/", pricing: { from: "300 €" } });
const summary = () => ({
  url: "https://nuriaromero.dev",
  services: [
    { url: "https://nuriaromero.dev/s/", priceFrom: "149 €" },
    {
      url: "https://nuriaromero.dev/t/",
      priceFrom: "10 €",
      plans: [
        { name: "Uno", from: "10 €" },
        { name: "Dos", from: "20 €" },
      ],
    },
    { url: "https://nuriaromero.dev/n/" },
  ],
  sectors: [{ url: "https://nuriaromero.dev/sector/", priceFrom: "300 €" }],
});
const dataset = { services: [svc(), tiered, noOffer], niches: [niche] };

test("priceFailures is empty when summary prices equal src/data", () => {
  assert.deepEqual(priceFailures({ summary: summary(), ...dataset }), []);
});

test("priceFailures flags a different service price", () => {
  const s = summary();
  s.services[0].priceFrom = "199 €";
  assert.ok(
    priceFailures({ summary: s, ...dataset }).some((f) => f.includes("/s/")),
  );
});

test("priceFailures flags a different plan price", () => {
  const s = summary();
  s.services[1].plans[1].from = "25 €";
  assert.ok(
    priceFailures({ summary: s, ...dataset }).some((f) => f.includes("Dos")),
  );
});

test("priceFailures flags a different sector price", () => {
  const s = summary();
  s.sectors[0].priceFrom = "1 €";
  assert.ok(
    priceFailures({ summary: s, ...dataset }).some((f) =>
      f.includes("/sector/"),
    ),
  );
});

test("priceFailures flags a registry service missing from the summary", () => {
  const s = summary();
  s.services.pop();
  assert.ok(
    priceFailures({ summary: s, ...dataset }).some((f) => f.includes("/n/")),
  );
});

test("priceFailures flags a price on a service without its own offer", () => {
  const s = summary();
  s.services[2].priceFrom = "1 €";
  assert.ok(
    priceFailures({ summary: s, ...dataset }).some((f) => f.includes("/n/")),
  );
});

// --- sitemapFailures ---------------------------------------------------------

test("sitemapFailures is empty for a sitemap without the AI files", () => {
  assert.deepEqual(
    sitemapFailures(
      "<urlset><url><loc>https://nuriaromero.dev/</loc></url></urlset>",
    ),
    [],
  );
});

for (const path of [
  "/ai/summary.json",
  "/ai/faq.json",
  "/.well-known/ai.txt",
]) {
  test(`sitemapFailures flags ${path}`, () => {
    const xml = `<urlset><url><loc>https://nuriaromero.dev${path}</loc></url></urlset>`;
    assert.ok(sitemapFailures(xml).some((f) => f.includes(path)));
  });
}
