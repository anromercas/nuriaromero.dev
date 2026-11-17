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
