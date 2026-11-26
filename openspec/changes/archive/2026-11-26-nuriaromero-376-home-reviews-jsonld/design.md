## Context

Bug [NRD-376](https://nuriaromerodev.atlassian.net/browse/NRD-376), found by the developer of NRD-375 with the Places stub, older than the NRD-372 fix.

- `src/lib/schema.ts:47-73` `reviewsSchema(data)` maps every `data.reviews` entry (Place Details returns up to five) to a `Review`.
- `src/pages/index.astro:97-104` adds it to the home `<Schema>` when `reviewsData` exists; `src/pages/index.astro:43-54` puts the stat `"<rating> en Google"` / `"<N> opinión|opiniones"` into `ProofStrip` (`src/components/seo-local/ProofStrip.astro`: `<li><strong>{stat}</strong><span>{label}</span></li>`).
- `src/components/seo-local/RealProof.astro:20` quotes `reviews.reviews[0]` (`<blockquote><p>{quote.text}</p>`, `span.author`, stars `aria-label="Valoración: {rating} de 5 estrellas"`). It is used by seven pages; only the home emits reviews JSON-LD.
- `scripts/check-google-reviews.mjs` looks for `id="resenas-google"` and the copy of `src/components/GoogleReviews.astro`, which no page imports any more.
- `tests/google-reviews-production-build.test.js` (NRD-375) runs one isolated production build (ADR 0019 and its NRD-372 amendment) with `tests/helpers/places-fetch-stub.mjs`, whose fixture has a single review, so today the extra-review defect does not even show there.

PO decision: keep the reviews JSON-LD, limited to the visible `aggregateRating` and at most the quoted review; GoogleReviews.astro is deleted if unused; the production build test gains the check assertion and a failing case.

## Goals / Non-Goals

**Goals:**

- The home JSON-LD declares only the visible rating stat and the quoted review, chosen by one shared rule.
- The check compares JSON-LD with visible markup through stable hooks and is covered by unit tests and the production build test.
- Dead component and copy-coupled code removed.

**Non-Goals:**

- Check in CI or Netlify build; changes to other pages' visible output; changing which review is quoted.

## Decisions

**Approach.** The quoted review can be matched reliably, so the design keeps it in the JSON-LD (the PO's preferred option) rather than falling back to `aggregateRating` only. Reliability comes from one selection function, `quotedReview()`, used by both `RealProof` and `reviewsSchema()`: the page and the schema cannot pick different reviews. The check then verifies the result on built HTML: it reads the visible stat by its text and the visible quote through three `data-review-*` hooks added to `RealProof` (attributes, not classes, because Astro scopes classes and a source test pins the `<figure class="quote" data-word-budget="exclude">` tag), decodes HTML entities and collapses whitespace, and requires every declared `Review` to match a visible quote. The check logic moves to a pure module like `scripts/lib/blog-cover-contract.mjs` so unit tests cover every rule with synthetic HTML, and the CLI keeps its usage, exit codes and `GOOGLE-REVIEWS:` prefixes. The NRD-375 stub gains a second review so the production build actually exercises the limit.

**Files** (layer `app` for all):

- `src/lib/google-reviews.ts`: modify. Add `quotedReview()`.
- `src/lib/schema.ts`: modify. `reviewsSchema()` uses `quotedReview()`.
- `src/components/seo-local/RealProof.astro`: modify. `const quote = quotedReview(reviews)`; hooks `data-review-quote` on `<blockquote>`, `data-review-author` on `span.author`, `data-review-rating={quote.rating}` on `div.stars`.
- `src/components/GoogleReviews.astro`: delete.
- `scripts/lib/google-reviews-contract.mjs`: create.
- `scripts/check-google-reviews.mjs`: rewrite as a thin CLI over the contract.
- `tests/home-reviews-schema.test.js`: create.
- `tests/check-google-reviews.test.js`: create.
- `tests/google-reviews-error.test.js`: modify. Delete the test "GoogleReviews.astro renders only when there is data with at least one review"; keep the rest (the home `reviewsSchema(reviewsData)` line and the "no JSON-LD found" test still hold).
- `tests/seo-local-ficha-redesign.test.js`: modify. The two `RealProof` source regexes on `reviews.reviews[0]` (around lines 147 and 270) accept `quotedReview(reviews)`.
- `tests/helpers/places-fetch-stub.mjs`: modify. Second review in the fixture.
- `tests/google-reviews-production-build.test.js`: modify. Check exit 0, one `Review`, failing mutated copy.
- `docs/seo-checklist-65-factores.md`: modify row 62 (shared doc, layer `app`): current state (RealProof quote + stat, JSON-LD limited to the visible proof, NRD-376).

**Interfaces:**

```ts
// src/lib/google-reviews.ts
/** The review the site quotes (RealProof) and declares (reviewsSchema): the first one Place Details returns. */
export function quotedReview(data: GoogleReviewsData | null): GoogleReview | null
// returns data?.reviews[0] ?? null

// src/lib/schema.ts (signature unchanged)
export function reviewsSchema(data: GoogleReviewsData): {
  "@context": "https://schema.org"; "@type": ["ProfessionalService", "Organization"]; "@id": string;
  name: string; url: string;
  aggregateRating: { "@type": "AggregateRating"; ratingValue: number; reviewCount: number; bestRating: 5; worstRating: 1 };
  review?: [{ "@type": "Review"; author: { "@type": "Person"; name: string };
              reviewRating: { "@type": "Rating"; ratingValue: number; bestRating: 5; worstRating: 1 }; reviewBody: string }];
}
```

```js
// scripts/lib/google-reviews-contract.mjs
/** @param {string} html @returns {{ failures: string[], summary: string }} */
export function googleReviewsFailures(html)
```

Contract rules, in order (each failure is one string; the CLI prints `GOOGLE-REVIEWS: <failure>` per failure and exits 1, else prints `GOOGLE-REVIEWS OK: <summary>` and exits 0):

1. JSON-LD blocks: `<script type="application/ld+json">` (allow extra attributes); invalid JSON -> `a JSON-LD block is not valid JSON`; none -> `no JSON-LD found`. Nodes are flattened from `@graph`; the walk is recursive.
2. `ratingNodes` = objects with an `aggregateRating` key; `reviews` = every object whose `@type` includes `Review` (also inside `review`, which may be an object or an array). None of either -> pass (`reviews schema absent`).
3. More than one rating node -> `expected at most one node with aggregateRating, found N`.
4. Visible text = HTML with tags replaced by spaces, entities decoded (`&amp; &lt; &gt; &quot; &apos; &nbsp; &#NN; &#xHH;`), whitespace collapsed. Stat = `/(\d+,\d) en Google (\d+) opini(?:ón|ones)\b/`. With a rating node: no stat -> `aggregateRating is declared but the rating stat is not visible`; `Number(ratingValue).toFixed(1)` (comma decimal) differs -> `ratingValue X does not match the visible rating Y`; `String(reviewCount)` differs -> `reviewCount X does not match the visible count Y`.
5. Visible quotes = the `[data-review-quote]` elements in document order, paired by index with `[data-review-author]` and `[data-review-rating]`; text of each is decoded and collapsed as above. More `Review` entries than visible quotes, or a `Review` whose `author.name` (or string `author`) and `reviewBody` do not equal one visible quote -> `review by "<author>" is not visible on the page`; same author and text but `reviewRating.ratingValue` differs from the visible rating -> `review by "<author>" has rating X but the page shows Y`.

**Data:** none. No storage, settings or schema migration; JSON-LD shape change only on the home of production builds.

**Test plan (TDD order):**

1. NRD-377: `tests/home-reviews-schema.test.js` first (RED: today `review` has three entries): `reviewsSchema()` with three reviews -> `review.length === 1` and equal to the first review mapped; with `reviews: []` -> no `review` key; `aggregateRating` unchanged; `quotedReview(null) === null`, `quotedReview(data) === data.reviews[0]`. Covers "Production build with several reviews" and "Review data without a quotable review" at unit level. Then implement; update the two `seo-local-ficha-redesign` regexes; `tests/site-identity.test.js` stays green.
2. NRD-378: `tests/check-google-reviews.test.js` first, importing the contract and spawning the CLI for exit codes. Fixture builder: a minimal page with a `ProofStrip`-like `<li><strong>4,8 en Google</strong><span>7 opiniones</span></li>`, a quote `<blockquote data-review-quote><p>…</p></blockquote><span class="author" data-review-author>…</span><div class="stars" data-review-rating="5">` and a JSON-LD block. Cases: agreeing page (0); JSON-LD without reviews (0); aggregate only (0); extra not-visible review (1, /not visible/); different text (1); different review rating (1); `ratingValue` 4.5 vs "4,8" (1, both values named); `reviewCount` mismatch (1); aggregate without visible stat (1); two rating nodes (1); text with `&quot;`, `&#39;`, `&amp;` (0); no JSON-LD (1, existing message). Then implement contract and CLI, delete `GoogleReviews.astro` and its test, update the checklist row.
3. NRD-379: stub second review and the new `it` blocks in `tests/google-reviews-production-build.test.js` first: CLI exits 0 on `<dist>/index.html`; exactly one `Review` with `Reseña de prueba NRD-372` and no "Segunda reseña NRD-376" in the home HTML; a copy in `mkdtemp` with the second review appended to the JSON-LD `review` array exits 1 with /not visible/. RED against the pre-NRD-377 code, GREEN after 1 and 2. Existing assertions (one request, ten pages, no key leak) stay green. Then `pnpm build` and `pnpm check:seo:dist`.

**Real-browser / e2e checks** (QA): none required beyond a smoke check. Local and CI builds have no review data (production gate), so the visible home is unchanged there; QA verifies with the isolated production build output that the home quote looks as before and that the three `data-review-*` attributes are invisible. Optional: Google Rich Results Test on the built home from the production build test output (paste HTML), expecting the `ProfessionalService` node with `aggregateRating` and one `Review`.

**ADRs relied on:** 0004 (SEO head and structured data through `Schema.astro` and `src/lib/schema.ts`), 0019 and its NRD-372 amendment (isolated build with fake credentials only together with the fetch stub). No new ADR: the change follows existing patterns (pure contract module + thin CLI, as in check-seo-25).

## Risks / Trade-offs

- [Self-serving review markup] Google may ignore review rich results for a business's own reviews on its own site; the change keeps them because the PO chose to and because they now only state visible, real data. → No promise of a rich result anywhere.
- [Stat text coupling] The check reads "X,X en Google N opiniones" from visible text, the same copy built in `src/pages/index.astro`; a copy change there without the check fails loudly in the production build test. → Documented in the CLI header comment.
- [Shared component] The hooks land on seven pages through `RealProof`. → Attributes only; visible output and word budget unchanged (the quote figure already carries `data-word-budget="exclude"`).
- [Not in CI] The check still runs only by hand and in the unit suite's production build test. → Out of scope by PO decision.

## UI spec

No visible change. This story changes structured data and adds invisible hooks; there is no new screen, copy, state or interaction to design.

### RealProof (`src/components/seo-local/RealProof.astro`, seven pages)

1. **Screens and layout**: unchanged. Same `<figure class="quote" data-word-budget="exclude">`, same element order (blockquote, stars, author, relative time, "Ver todas las reseñas en Google" link), same classes and scoped styles.
2. **Hierarchy**: unchanged. The quote stays the main proof; the link stays secondary.
3. **States**: unchanged. With review data and at least one review: quote shown. No data or `reviews: []`: no figure (now via `quotedReview(reviews) === null`), the section keeps heading and projects only. Local and CI builds have no review data, so they render the no-quote state as today.
4. **Copy**: no new or changed strings. The stars `aria-label` stays `Valoración: {rating} de 5 estrellas`.
5. **Design system reuse**: no token, class or component change. The three `data-review-quote`, `data-review-author` and `data-review-rating` attributes carry no styling: no CSS selector may target them (today none in `src/styles/` or `src/components/seo-local/` uses `[data-*]`), so they cannot alter the rendered output.
6. **Responsive**: unchanged at every width from 320 px.
7. **Interactions**: unchanged; the attributes add no behavior or script.
8. **Accessibility hand-off**: unchanged. Do not add `aria-*`, `role` or `tabindex` with the hooks; `data-review-rating` is not exposed to assistive tech, the existing stars `aria-label` remains the accessible rating.
9. **GEO-ready content**: n/a (no visible content change; the JSON-LD now states only what the page shows, which is the point of the story).

### Home proof stat (`src/pages/index.astro` -> `src/components/seo-local/ProofStrip.astro`)

Unchanged. The stat text `"<rating> en Google"` / `"<N> opinión|opiniones"` must stay byte-identical, because the check reads it from visible text (see Risks).
