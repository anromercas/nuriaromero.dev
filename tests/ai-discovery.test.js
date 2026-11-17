import { test } from "node:test";
import assert from "node:assert/strict";

// --- Task 1.1: data moves (NRD-280) -----------------------------------------

test("page-faqs.ts exports the home and contact FAQs", async () => {
  const { homeFaqs, contactFaqs } = await import("../src/data/page-faqs.ts");
  assert.ok(homeFaqs.length >= 6 && homeFaqs.length <= 8);
  assert.ok(contactFaqs.length >= 3 && contactFaqs.length <= 4);
  for (const faq of [...homeFaqs, ...contactFaqs]) {
    assert.equal(typeof faq.q, "string");
    assert.equal(typeof faq.a, "string");
  }
});

test("CRAWLER_POLICY keeps the 8 crawlers, all allowed", async () => {
  const { CRAWLER_POLICY } = await import("../src/data/crawler-policy.ts");
  assert.deepEqual(
    CRAWLER_POLICY.map((r) => r.userAgent),
    [
      "*",
      "GPTBot",
      "OAI-SearchBot",
      "ClaudeBot",
      "Claude-Web",
      "anthropic-ai",
      "PerplexityBot",
      "Google-Extended",
    ],
  );
  for (const rule of CRAWLER_POLICY) assert.equal(rule.allow, "/");
});

test("SERVICE_AREA lives in site data and feeds localBusinessSchema", async () => {
  const { SERVICE_AREA } = await import("../src/data/site.ts");
  const { localBusinessSchema } = await import("../src/lib/schema.ts");
  assert.deepEqual(localBusinessSchema().areaServed, SERVICE_AREA);
});

// --- Task 1.2: pure builders (NRD-281) ---------------------------------------

import { SITE, SERVICE_AREA } from "../src/data/site.ts";
import { CRAWLER_POLICY } from "../src/data/crawler-policy.ts";
import { homeFaqs, contactFaqs } from "../src/data/page-faqs.ts";
import { services, seoParaIa } from "../src/data/services.ts";
import { niches } from "../src/data/niches.ts";
import { faqSchema, faqAnswerText } from "../src/lib/schema.ts";
import {
  faqPages,
  buildAiFaq,
  buildAiSummary,
  buildAiTxt,
} from "../src/lib/ai-discovery.ts";

const abs = (path) => new URL(path, SITE.url).href;

test("faqAnswerText collapses paragraph breaks and whitespace", () => {
  assert.equal(faqAnswerText("  uno\n\ndos   tres \n"), "uno dos tres");
});

test("faqPages lists home, contact, services and niches in order", () => {
  assert.deepEqual(
    faqPages().map((p) => p.url),
    [
      "/",
      "/contacto/",
      ...services.map((s) => s.slug),
      ...niches.map((n) => n.slug),
    ],
  );
  assert.equal(faqPages()[0].faqs, homeFaqs);
  assert.equal(faqPages()[1].faqs, contactFaqs);
});

test("buildAiFaq mirrors faqSchema question by question, in order", () => {
  const faq = buildAiFaq();
  assert.equal(faq.site, SITE.url);
  assert.equal(faq.inLanguage, "es");
  const pages = faqPages();
  assert.equal(faq.pages.length, pages.length);
  faq.pages.forEach((page, i) => {
    assert.equal(page.url, abs(pages[i].url));
    const expected = faqSchema(pages[i].faqs).mainEntity.map((e) => ({
      question: e.name,
      answer: e.acceptedAnswer.text,
    }));
    assert.deepEqual(page.questions, expected);
  });
});

test("buildAiSummary carries brand, contact, address and area", () => {
  const s = buildAiSummary();
  assert.equal(s.name, SITE.name);
  assert.equal(s.url, SITE.url);
  assert.equal(s.description, SITE.description);
  assert.equal(s.logo, `${SITE.url}${SITE.logo}`);
  assert.deepEqual(s.contact, {
    email: SITE.email,
    telephone: `+${SITE.whatsapp}`,
  });
  assert.equal(s.address.addressLocality, SITE.address.municipality);
  assert.equal(s.address.streetAddress, SITE.address.street);
  assert.deepEqual(
    s.areaServed,
    SERVICE_AREA.map((a) => a.name),
  );
  assert.deepEqual(s.sameAs, [...SITE.sameAs]);
});

test("buildAiSummary prices equal the data, and SEO para IA has none", () => {
  const s = buildAiSummary();
  assert.equal(s.services.length, services.length);
  services.forEach((svc, i) => {
    const entry = s.services[i];
    assert.equal(entry.name, svc.breadcrumbName);
    assert.equal(entry.url, abs(svc.slug));
    assert.equal(entry.description, svc.seo.description);
    if (svc.ownOffer === false) {
      assert.equal("priceFrom" in entry, false);
    } else {
      assert.equal(entry.priceFrom, svc.pricing.from);
    }
    if (svc.pricing.tiers) {
      assert.deepEqual(
        entry.plans,
        svc.pricing.tiers.map(({ name, from }) => ({ name, from })),
      );
    } else {
      assert.equal("plans" in entry, false);
    }
  });
  const ia = s.services.find((e) => e.url === abs(seoParaIa.slug));
  assert.equal("priceFrom" in ia, false);
  assert.deepEqual(
    s.sectors.map((e) => [e.url, e.priceFrom]),
    niches.map((n) => [abs(n.slug), n.pricing.from]),
  );
});

test("buildAiSummary links the discovery resources", () => {
  assert.deepEqual(buildAiSummary().resources, {
    llmsTxt: `${SITE.url}/llms.txt`,
    aiTxt: `${SITE.url}/.well-known/ai.txt`,
    faq: `${SITE.url}/ai/faq.json`,
    sitemap: `${SITE.url}/sitemap-index.xml`,
  });
});

test("payloads carry no build date", () => {
  const today = new Date().toISOString().slice(0, 10);
  const text = JSON.stringify([buildAiFaq(), buildAiSummary()]) + buildAiTxt();
  assert.equal(text.includes(today), false);
  assert.doesNotMatch(text, /dateModified|lastmod|generatedAt/i);
});

function parseGroups(text) {
  const groups = [];
  let current = null;
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }
    const [key, ...rest] = line.split(":");
    const value = rest.join(":").trim();
    if (key.toLowerCase() === "user-agent") {
      current = { userAgent: value, allow: [], disallow: [] };
      groups.push(current);
    } else if (key.toLowerCase() === "allow" && current) {
      current.allow.push(value);
    } else if (key.toLowerCase() === "disallow" && current) {
      current.disallow.push(value);
    }
  }
  return groups;
}

test("buildAiTxt has one group per crawler rule, same order and paths", () => {
  const groups = parseGroups(buildAiTxt());
  const list = (v) => (v === undefined ? [] : [v].flat());
  assert.deepEqual(
    groups,
    CRAWLER_POLICY.map((r) => ({
      userAgent: r.userAgent,
      allow: list(r.allow),
      disallow: list(r.disallow),
    })),
  );
});

test("buildAiTxt links the four resources", () => {
  const txt = buildAiTxt();
  for (const url of [
    `${SITE.url}/llms.txt`,
    `${SITE.url}/ai/summary.json`,
    `${SITE.url}/ai/faq.json`,
    `${SITE.url}/sitemap-index.xml`,
  ]) {
    assert.ok(txt.includes(url), `links ${url}`);
  }
  assert.ok(txt.endsWith("\n"));
});
