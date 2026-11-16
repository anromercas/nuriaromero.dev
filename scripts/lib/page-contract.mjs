// Pure build-time contract helpers for template pages (NRD-163). Each function
// takes the HTML string of a built page; same regex approach as seo-inventory.mjs.
import { decodeEntities, parsePage } from "./seo-inventory.mjs";

function mainInner(html) {
  return html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? "";
}

function plainText(fragment) {
  return decodeEntities(
    fragment
      .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

/** Visible word count of <main>, same method as the page story targets. */
export function mainWordCount(html) {
  return parsePage(html).mainWordCount;
}

/** Flat array of entities from every ld+json block, @graph unwrapped. */
export function jsonLdEntities(html) {
  const entities = [];
  for (const m of html.matchAll(
    /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    const payload = JSON.parse(m[1]);
    if (Array.isArray(payload["@graph"])) entities.push(...payload["@graph"]);
    else entities.push(payload);
  }
  return entities;
}

/** FAQPage mainEntity[].name, in order. */
export function faqPageQuestions(html) {
  const faq = jsonLdEntities(html).find((e) => e["@type"] === "FAQPage");
  return (faq?.mainEntity ?? []).map((question) => question.name);
}

/** Text of every <summary> inside <main> details, in order. */
export function visibleFaqQuestions(html) {
  return [
    ...mainInner(html).matchAll(
      /<details\b[^>]*>\s*<summary\b[^>]*>([\s\S]*?)<\/summary>/gi,
    ),
  ].map((m) => plainText(m[1]));
}

/** h1-h3 inside <main>: [{ level, text }]. */
export function headingOutline(html) {
  return [
    ...mainInner(html).matchAll(/<h([1-3])\b[^>]*>([\s\S]*?)<\/h\1>/gi),
  ].map((m) => ({ level: Number(m[1]), text: plainText(m[2]) }));
}

// Whitespace-only gaps are not visible differences between sections: the
// browser collapses them at element edges and between flex or grid items.
// Whitespace between text and a tag (for example "</em> .") is kept, so a
// real change in the visible text still shows up.
const EDGE_OPEN = /(<[a-z][\w-]*\b[^>]*>)\s+/gi;
const EDGE_CLOSE = /\s+(<\/[a-z][\w-]*>)/gi;
const BETWEEN = />\s+</g;

/** <main> inner HTML without class and data-astro-cid-* attributes, whitespace collapsed. */
export function normalizedMain(html) {
  return mainInner(html)
    .replace(/\sclass\s*=\s*("[^"]*"|'[^']*')/gi, "")
    .replace(/\sdata-astro-cid-[\w-]+(\s*=\s*("[^"]*"|'[^']*'))?/gi, "")
    .replace(/\s+/g, " ")
    .replace(/\s+(\/?>)/g, "$1")
    .replace(BETWEEN, "><")
    .replace(EDGE_OPEN, "$1")
    .replace(EDGE_CLOSE, "$1")
    .trim();
}
