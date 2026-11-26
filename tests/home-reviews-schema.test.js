import test from "node:test";
import assert from "node:assert/strict";

const data = {
  placeId: "place-1",
  rating: 4.8,
  userRatingCount: 7,
  reviews: [
    {
      author: "Ana",
      rating: 5,
      text: "Muy buen trabajo",
      relativeTime: "hace 1 semana",
    },
    { author: "Luis", rating: 4, text: "Bien", relativeTime: "hace 2 semanas" },
    {
      author: "Marta",
      rating: 3,
      text: "Regular",
      relativeTime: "hace 3 semanas",
    },
  ],
};

test("reviewsSchema declares only the quoted review", async () => {
  const { reviewsSchema } = await import("../src/lib/schema.ts");
  const schema = reviewsSchema(data);

  assert.equal(schema.review.length, 1);
  assert.deepEqual(schema.review[0], {
    "@type": "Review",
    author: { "@type": "Person", name: "Ana" },
    reviewRating: {
      "@type": "Rating",
      ratingValue: 5,
      bestRating: 5,
      worstRating: 1,
    },
    reviewBody: "Muy buen trabajo",
  });
});

test("reviewsSchema keeps the aggregate rating and omits review when there is no quotable review", async () => {
  const { reviewsSchema } = await import("../src/lib/schema.ts");
  const schema = reviewsSchema({ ...data, reviews: [] });

  assert.equal("review" in schema, false);
  assert.deepEqual(schema.aggregateRating, {
    "@type": "AggregateRating",
    ratingValue: 4.8,
    reviewCount: 7,
    bestRating: 5,
    worstRating: 1,
  });
});

test("quotedReview returns the first review or null", async () => {
  const { quotedReview } = await import("../src/lib/google-reviews.ts");

  assert.equal(quotedReview(null), null);
  assert.equal(quotedReview({ ...data, reviews: [] }), null);
  assert.equal(quotedReview(data), data.reviews[0]);
});
