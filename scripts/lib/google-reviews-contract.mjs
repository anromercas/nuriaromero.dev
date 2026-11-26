// NRD-376: contract between the reviews JSON-LD and the visible proof on the home.
// Pure string parsing over built HTML so it runs against synthetic pages in tests
// and against dist/index.html in scripts/check-google-reviews.mjs.
//
// The visible rating stat is read from text ("4,8 en Google" / "7 opiniones", built in
// src/pages/index.astro for ProofStrip) and the quoted review from the data-review-*
// hooks of src/components/seo-local/RealProof.astro. Change them together.

const NAMED_ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

const decode = (text) =>
  text.replace(/&(?:#(\d+)|#x([0-9a-f]+)|([a-z]+));/gi, (match, dec, hex, name) => {
    if (dec) return String.fromCodePoint(Number(dec));
    if (hex) return String.fromCodePoint(parseInt(hex, 16));
    return NAMED_ENTITIES[name.toLowerCase()] ?? match;
  });

const normalize = (text) => decode(text).replace(/\s+/g, " ").trim();

const visibleText = (html) =>
  normalize(
    html
      .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, " ")
      .replace(/<[^>]*>/g, " "),
  );

const STAT = /(\d+,\d) en Google (\d+) opini(?:ón|ones)(?!\p{L})/u;

function jsonLdNodes(html) {
  const nodes = [];
  let found = 0;
  for (const [, body] of html.matchAll(
    /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    found += 1;
    try {
      nodes.push(JSON.parse(body));
    } catch {
      return { error: "a JSON-LD block is not valid JSON" };
    }
  }
  if (found === 0) return { error: "no JSON-LD found" };
  return { nodes };
}

function walk(value, visit) {
  if (Array.isArray(value)) return value.forEach((item) => walk(item, visit));
  if (value && typeof value === "object") {
    visit(value);
    Object.values(value).forEach((item) => walk(item, visit));
  }
}

const typesOf = (node) => [node["@type"]].flat().filter(Boolean);

function visibleQuotes(html) {
  const hook = (name) =>
    [
      ...html.matchAll(
        new RegExp(
          `<(\\w+)\\b[^>]*\\sdata-review-${name}(?:\\s*=\\s*"([^"]*)")?[^>]*>([\\s\\S]*?)<\\/\\1>`,
          "gi",
        ),
      ),
    ].map((m) => (name === "rating" ? normalize(m[2] ?? "") : visibleText(m[3])));
  const texts = hook("quote");
  const authors = hook("author");
  const ratings = hook("rating");
  return texts.map((text, i) => ({
    text,
    author: authors[i] ?? "",
    rating: ratings[i] ?? "",
  }));
}

/** @param {string} html @returns {{ failures: string[], summary: string }} */
export function googleReviewsFailures(html) {
  const parsed = jsonLdNodes(html);
  if (parsed.error) return { failures: [parsed.error], summary: "" };

  const ratingNodes = [];
  const reviews = [];
  walk(parsed.nodes, (node) => {
    if ("aggregateRating" in node) ratingNodes.push(node);
    if (typesOf(node).includes("Review")) reviews.push(node);
  });

  if (ratingNodes.length === 0 && reviews.length === 0) {
    return { failures: [], summary: "reviews schema absent" };
  }

  const failures = [];
  const text = visibleText(html);
  const summary = [];

  if (ratingNodes.length > 1) {
    failures.push(
      `expected at most one node with aggregateRating, found ${ratingNodes.length}`,
    );
  } else if (ratingNodes.length === 1) {
    const { aggregateRating } = ratingNodes[0];
    const stat = STAT.exec(text);
    if (!stat) {
      failures.push(
        "aggregateRating is declared but the rating stat is not visible",
      );
    } else {
      const [, visibleRating, visibleCount] = stat;
      const declared = Number(aggregateRating?.ratingValue)
        .toFixed(1)
        .replace(".", ",");
      if (declared !== visibleRating) {
        failures.push(
          `ratingValue ${aggregateRating?.ratingValue} does not match the visible rating ${visibleRating}`,
        );
      }
      if (String(aggregateRating?.reviewCount) !== visibleCount) {
        failures.push(
          `reviewCount ${aggregateRating?.reviewCount} does not match the visible count ${visibleCount}`,
        );
      }
      summary.push(`rating ${visibleRating}, ${visibleCount} opiniones`);
    }
  }

  const quotes = visibleQuotes(html);
  const used = new Set();
  for (const review of reviews) {
    const author = normalize(
      typeof review.author === "string" ? review.author : (review.author?.name ?? ""),
    );
    const body = normalize(String(review.reviewBody ?? ""));
    const index = quotes.findIndex(
      (q, i) => !used.has(i) && q.author === author && q.text === body,
    );
    const quote = quotes[index];
    if (!quote) {
      failures.push(`review by "${author}" is not visible on the page`);
      continue;
    }
    used.add(index);
    const declared = review.reviewRating?.ratingValue;
    if (Number(declared) !== Number(quote.rating)) {
      failures.push(
        `review by "${author}" has rating ${declared} but the page shows ${quote.rating}`,
      );
    }
  }
  summary.push(`${reviews.length} review(s) declared`);

  return { failures, summary: summary.join(", ") };
}
