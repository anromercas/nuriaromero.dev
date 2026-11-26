## Why

[NRD-376](https://nuriaromerodev.atlassian.net/browse/NRD-376): in a production build with Google reviews, the home emits the reviews JSON-LD from `reviewsSchema()` (`src/pages/index.astro:102`) with the `AggregateRating` and every `Review` returned by Place Details (up to five, full bodies and authors), but the home no longer renders the old `GoogleReviews` section. It shows `RealProof` (`src/pages/index.astro:223`), which quotes only the first review, and the proof stat "X,X en Google · N opiniones". The structured data therefore declares reviews that are not visible on the page, and `scripts/check-google-reviews.mjs`, still written against the removed section's copy, fails with `GOOGLE-REVIEWS: section is absent but the JSON-LD contains AggregateRating or Review`. `src/components/GoogleReviews.astro` is dead code.

PO decision (refinement 2026-11-26): keep a reviews JSON-LD on the home limited to what is visible: the `aggregateRating` (the visible stat) and at most the review `RealProof` quotes, with the same author and text. No other `Review`. Removing the whole reviews JSON-LD is not the chosen option.

## What Changes

- New `quotedReview()` in `src/lib/google-reviews.ts`: the single rule that picks the review the site quotes. `RealProof` and `reviewsSchema()` both use it, so the quoted review and the declared review cannot diverge.
- `reviewsSchema()` emits the `aggregateRating` plus a `review` array with only the quoted review (author, text, rating), or no `review` key when there is none.
- `RealProof` marks its quote with `data-review-quote`, `data-review-author` and `data-review-rating` so the check reads it without depending on copy or CSS classes.
- `scripts/check-google-reviews.mjs` is rewritten over a pure contract module (`scripts/lib/google-reviews-contract.mjs`): it compares the reviews JSON-LD of a built page with the visible rating stat and the visible quote, exits 0 when they agree (or when there is no reviews JSON-LD) and 1 when the JSON-LD declares anything that is not visible.
- `src/components/GoogleReviews.astro` and its source test are deleted; no test or script depends on its copy any more.
- The isolated production build test (NRD-375) gains a second stub review, the assertion that the check exits 0 on the built home, and a failing case with a not-visible review injected into the JSON-LD.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `home-page`: adds the requirement that the home reviews structured data mirrors the visible proof, and the requirement for the check that enforces it.
- `google-reviews-fetch`: the production-build requirement now states that the home reviews JSON-LD is limited to the visible proof (it pointed to NRD-376).

## Impact

- Code (layer `app`): `src/lib/google-reviews.ts`, `src/lib/schema.ts`, `src/components/seo-local/RealProof.astro`, `scripts/check-google-reviews.mjs`, new `scripts/lib/google-reviews-contract.mjs`, deleted `src/components/GoogleReviews.astro`; tests `tests/home-reviews-schema.test.js` (new), `tests/check-google-reviews.test.js` (new), `tests/google-reviews-production-build.test.js`, `tests/helpers/places-fetch-stub.mjs`, `tests/google-reviews-error.test.js`, `tests/seo-local-ficha-redesign.test.js`; doc `docs/seo-checklist-65-factores.md` (row 62).
- `RealProof` is shared by seven pages; they gain three invisible `data-review-*` attributes on the quote and keep the same visible output. Only the home emits reviews JSON-LD, so no other page's structured data changes.
- Non-production builds (no review data) are unchanged: no stat, no quote, no reviews JSON-LD, and the check exits 0.
- No new dependency, external service, data or URL change. Nothing radical.

## Out of scope

- Running `check-google-reviews.mjs` in CI or in the Netlify build (separate story).
- Changes to the other nine pages that show reviews, beyond the invisible hooks on the shared `RealProof` quote.
- Changing which review is quoted (still the first one Place Details returns) or the visible copy of the stat and the quote.
- A production deploy (develop is promoted to main by the scheduled task).
