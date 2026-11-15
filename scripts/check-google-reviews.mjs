// usage: node scripts/check-google-reviews.mjs [htmlPath = "dist/index.html"]
// Exit 0 when the home reviews section and its JSON-LD agree (or are both absent),
// exit 1 with "GOOGLE-REVIEWS: <reason>" otherwise.
// The visible-text parsing depends on the Spanish copy of src/components/GoogleReviews.astro
// ("valoración media de X.X sobre 5" and "(N reseña/reseñas)"). Change both together.
import { readFile } from "node:fs/promises";

function fail(reason) {
  console.error(`GOOGLE-REVIEWS: ${reason}`);
  process.exit(1);
}

const htmlPath = process.argv[2] ?? "dist/index.html";
const html = await readFile(htmlPath, "utf8");

const nodes = [];
for (const [, body] of html.matchAll(
  /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi,
)) {
  let payload;
  try {
    payload = JSON.parse(body);
  } catch {
    fail("a JSON-LD block is not valid JSON");
  }
  nodes.push(
    ...(Array.isArray(payload["@graph"]) ? payload["@graph"] : [payload]),
  );
}

const typesOf = (node) => [node?.["@type"]].flat().filter(Boolean);
const hasReviewType = (node) =>
  typesOf(node).some((type) => type === "Review" || type === "AggregateRating");

function containsReviewSchema(value) {
  if (Array.isArray(value)) return value.some(containsReviewSchema);
  if (value && typeof value === "object") {
    if ("aggregateRating" in value || hasReviewType(value)) return true;
    return Object.values(value).some(containsReviewSchema);
  }
  return false;
}

const sectionStart = html.indexOf('id="resenas-google"');

if (sectionStart === -1) {
  if (nodes.length === 0) {
    fail("no JSON-LD found")
  }
  if (nodes.some(containsReviewSchema)) {
    fail(
      "section is absent but the JSON-LD contains AggregateRating or Review",
    );
  }
  console.log("GOOGLE-REVIEWS OK: section and schema absent");
  process.exit(0);
}

const rest = html.slice(sectionStart);
const sectionEnd = rest.indexOf("</ul>");
if (sectionEnd === -1) fail("section is present but has no review list");
const section = rest.slice(0, sectionEnd);
const text = section.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");

const withRating = nodes.filter((node) => node && "aggregateRating" in node);
if (withRating.length !== 1)
  fail(
    `expected exactly one node with aggregateRating, found ${withRating.length}`,
  );
const { aggregateRating, review } = withRating[0];

const visibleAverage = text
  .match(/valoración media de (\d+[.,]\d) sobre 5/)?.[1]
  ?.replace(",", ".");
const visibleCount = text.match(/\(\s*(\d+)\s*reseñas?\s*\)/)?.[1];
if (!visibleAverage || !visibleCount)
  fail("could not read the visible average and count");

if (Number(aggregateRating?.ratingValue).toFixed(1) !== visibleAverage) {
  fail(
    `ratingValue ${aggregateRating?.ratingValue} does not match visible average ${visibleAverage}`,
  );
}
if (String(aggregateRating?.reviewCount) !== visibleCount) {
  fail(
    `reviewCount ${aggregateRating?.reviewCount} does not match visible count ${visibleCount}`,
  );
}

const cards = (section.match(/<li\b/g) ?? []).length;
const reviewCount = Array.isArray(review) ? review.length : 0;
if (cards === 0 || reviewCount !== cards) {
  fail(
    `review entries (${reviewCount}) do not match rendered cards (${cards})`,
  );
}

console.log(`GOOGLE-REVIEWS OK: ${cards} reviews, rating ${visibleAverage}`);
