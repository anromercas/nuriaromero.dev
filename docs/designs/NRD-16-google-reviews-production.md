# NRD-16 - Real Google reviews on the production home

## Why

[NRD-16](https://nuriaromerodev.atlassian.net/browse/NRD-16) (M1, epic NRD-2). Visitors and Google should see the real reviews of the verified Google Business Profile. On 2026-09-27 production showed no reviews block and no `AggregateRating`/`Review` (`odd/tasks/mejoras-home-conversion.md` T6), although the code worked locally.

## Diagnosis (Tech Lead, 2026-11-13)

- Code path: `src/pages/index.astro:27` calls `getGoogleReviews()` once at build time; `src/lib/google-reviews.ts:61-124` returns `null` when `GOOGLE_PLACES_API_KEY`/`GOOGLE_PLACE_ID` are unset, on non-2xx (logs status and body, never the key), on zero reviews and on any exception; `src/components/GoogleReviews.astro:22-23` renders nothing unless `data && data.reviews.length > 0`; `index.astro:128` adds `reviewsSchema(reviewsData)` only when data exists.
- `main` and `develop` both contain the reviews commits (`8d2ee17`, `d88ed2c`, `13f9ebd`, `9601979`); `main` is at `f4f6bfe`.
- `curl https://nuriaromero.dev/` on 2026-11-13 09:00 UTC: the page contains `id="resenas-google"`, the visible text "valoración media de 5.0 sobre 5" and JSON-LD `"AggregateRating","ratingValue":5,"reviewCount":1`. Production now renders the reviews.
- Conclusion: the 2026-09-27 absence came from a deploy that predated the commits and/or Places variables not applied to the Netlify build; both are resolved in production today. No code fix is needed. What remains is to guard the behaviour (fallback and visible/JSON-LD consistency) and record dated evidence.

User-owned configuration (documented, never touched by agents): Netlify env vars `GOOGLE_PLACES_API_KEY` and `GOOGLE_PLACE_ID` available to the production build context; the API key restricted by API (Places API (New)) and not by HTTP referrer, because the request is server-side at build time and carries no referrer (a referrer restriction yields 403, the error seen in a local build).

## What changes

- `tests/google-reviews-error.test.js`: cases for every fallback path and for the conditional schema.
- New `scripts/check-google-reviews.mjs` (+ `check:google-reviews` and `check:google-reviews:dist` scripts): build-output check that the reviews section and the `AggregateRating` agree, or are both absent.
- `odd/tasks/mejoras-home-conversion.md` T6: dated diagnosis and production evidence.

## Out of scope

- Netlify settings, env vars, API key restrictions (user).
- Review content, design of the reviews block, reviews on `/seo-local-sevilla/` (`ProofStrip`/`RealProof`, NRD-32 relates).
- Adding the check to CI (NRD-6 owns `ci.yml`; CI builds without secrets, where only the "absent" branch runs).

## Requirements and scenarios

### Requirement: reviews fail closed

When the Places API is unconfigured, fails, throws or returns no reviews, the build SHALL pass and the home MUST render no reviews section and no `AggregateRating`/`Review` JSON-LD.

#### Scenario: no credentials

- WHEN `GOOGLE_PLACES_API_KEY` or `GOOGLE_PLACE_ID` is unset
- THEN `getGoogleReviews()` returns `null` without calling `fetch`, and the build passes

#### Scenario: API error

- WHEN Place Details answers non-2xx or the request throws
- THEN a warning without the API key is logged, `null` is returned, and the section and schema are absent

#### Scenario: no reviews yet

- WHEN the response has an empty `reviews` array
- THEN `null` is returned and nothing renders (no empty block)

### Requirement: visible data and JSON-LD agree

When the reviews section renders, the home JSON-LD SHALL contain exactly one `AggregateRating` whose `ratingValue` equals the visible average and `reviewCount` equals the visible count, and one `Review` per rendered review card.

#### Scenario: reviews rendered

- WHEN `dist/index.html` (or a saved production HTML) contains `id="resenas-google"`
- THEN `node scripts/check-google-reviews.mjs [file]` exits 0 only if rating, count and review count match

#### Scenario: section absent

- WHEN the section is absent
- THEN the check exits 0 only if no JSON-LD block contains `AggregateRating` or `"@type":"Review"`

### Requirement: production evidence

The story SHALL carry dated evidence (screenshot or HTML/JSON-LD excerpt) that `https://nuriaromero.dev/` shows real reviews with source and a matching `AggregateRating`.

#### Scenario: evidence recorded

- WHEN QA fetches production
- THEN T6 in `odd/tasks/mejoras-home-conversion.md` has the dated diagnosis and the story has screenshots at 375 and 1280 px plus the excerpt

## Files (layer `app`)

| Action | Path                                   | Notes                                                                             |
| ------ | -------------------------------------- | --------------------------------------------------------------------------------- |
| modify | `tests/google-reviews-error.test.js`   | source-level cases, same style as the file                                        |
| create | `scripts/check-google-reviews.mjs`     | pattern of `scripts/check-seo-15.mjs` (readFile + assert, English messages)       |
| modify | `package.json`                         | `check:google-reviews`, `check:google-reviews:dist` next to `check:capilar-local` |
| modify | `odd/tasks/mejoras-home-conversion.md` | T6 evidence (outside the `app` globs; docs)                                       |

## Interfaces

`scripts/check-google-reviews.mjs`:

```js
// usage: node scripts/check-google-reviews.mjs [htmlPath = "dist/index.html"]
// exit 0 when consistent, 1 with "GOOGLE-REVIEWS: <reason>" otherwise
```

Algorithm:

1. Read the HTML; collect every `<script type="application/ld+json">` body, `JSON.parse` each, flatten `@graph` arrays.
2. `const section = html.includes('id="resenas-google"')`.
3. Absent: fail if any node has `aggregateRating` or `@type` `Review`/`AggregateRating` anywhere. Print `GOOGLE-REVIEWS OK: section and schema absent`.
4. Present: exactly one node with `aggregateRating`; parse the visible average from `valoración media de (\d+[.,]\d) sobre 5` and the count from `\((\d+)\s*reseñas?\)` within the section; assert `Number(ratingValue).toFixed(1) === visibleAverage`, `reviewCount === visibleCount`; count `<li` inside the section's `<ul>` and assert `review.length` equals it. Print `GOOGLE-REVIEWS OK: <n> reviews, rating <x>`.

`package.json` scripts (use the pnpm form NRD-8 introduces):

```json
"check:google-reviews": "pnpm build && node scripts/check-google-reviews.mjs",
"check:google-reviews:dist": "node scripts/check-google-reviews.mjs"
```

## Data

None. No new env var (the two Places variables already exist in `src/env.d.ts`), no new origin (the call is build-time; review author photos are already served under the current CSP).

## Test plan (TDD order)

1. `tests/google-reviews-error.test.js` new cases (characterisation of existing guards; prove RED by temporarily removing each guard, note it in the PR):
   - `!apiKey || !placeId` -> `return null` appears before the first `fetch(`.
   - `rawReviews.length === 0` -> `return null`.
   - `catch` block returns `null` and its `console.warn` does not include `apiKey`.
   - `GoogleReviews.astro` wraps its markup in `data && data.reviews.length > 0`.
   - `index.astro`: `reviewsData ? [reviewsSchema(reviewsData)] : []` and exactly one `getGoogleReviews()` call.
2. New case: `package.json` defines both `check:google-reviews` scripts (RED), then write the script and scripts entries (GREEN).
3. `pnpm build && pnpm check:google-reviews:dist` without Places variables (absent branch). `curl -sS https://nuriaromero.dev/ -o <tmp>/home.html && node scripts/check-google-reviews.mjs <tmp>/home.html` (present branch).
4. Full suite and `pnpm build` green.

## Real-browser / e2e checks

- Production home at 375 px and 1280 px: reviews section visible with author, stars, text, relative date in Spanish and the Google source line; no empty block; screenshot attached.
- Local build without variables: no reviews heading, no gap where the section was.

## Risks

- Production state can change (key revoked, quota): the check makes a mismatch visible on any build that has the key; CI only sees the absent branch.
- Visible-text parsing depends on the Spanish copy in `GoogleReviews.astro:30-39`; if the copy changes, the script and that copy change together (comment in the script pointing to the component).
- Size: the story was sized for a diagnosis plus a possible fix; the fix is not needed, so it is likely smaller than 2 points (PO's call).

## ADRs

0001 (build-time APIs only), 0004 (JSON-LD through `src/lib/schema.ts`), 0005 (build-time SEO checks), 0006 (node:test, TDD), 0007 (CSP).

## UI spec

No visual change. This story adds tests, a build-output check script and evidence; no file under `src/pages/**`, `src/layouts/**`, `src/components/**` or `src/styles/**` changes. The developer MUST NOT edit markup, classes or copy in `src/components/GoogleReviews.astro` or `src/pages/index.astro`. The spec below fixes the current behaviour as the reference that the tests, `ux-review` and QA check against.

### Home reviews section (`src/components/GoogleReviews.astro`, slot at `src/pages/index.astro:351`)

1. **Screens and layout**: unchanged. The section sits in the home `div.space-y-24` stack, after `#casos` and before the following `SectionContainer` and `#faq`. Wrapper: `rounded-2xl border border-gray-800 bg-gray-900/60` panel holding `SectionContainer id="resenas-google"` (`src/components/SectionContainer.astro`).
2. **Hierarchy**: unchanged. The heading is the `TitleSection` (`src/components/TitleSection.astro`) with the yellow `Star` icon (`src/components/icons/Star.astro`), then the source/average line, then the review cards, then the secondary link "Ver todas las reseñas en Google →".
3. **States**:
   - Success (Places data with at least one review): renders as it does today: one `<li>` card per review with 5 stars (the filled ones `text-yellow-400`), the text, the author, the relative date in Spanish when present, and the source line with average and count.
   - Empty / error / unconfigured (`data` is `null`: no credentials, non-2xx, exception, zero reviews): **render nothing**. No wrapper panel, no heading, no placeholder, no "Aún no hay reseñas" message, no skeleton. Because Astro emits no element, `space-y-24` adds no extra gap between `#casos` and the next section; QA confirms there is no blank band in a local build without the Places variables (375 and 1280 px). The JSON-LD omits `AggregateRating`/`Review` in the same state (design requirement "reviews fail closed").
   - Loading: n/a (build-time data, static HTML).
   - Partial: `userRatingCount === 0` with reviews present hides the ", con una valoración media de …" clause (current behaviour, unchanged). `placeId` missing hides the "Ver todas" link (unchanged).
   - Assumption: hiding the section entirely is the right empty state rather than an honest "no reviews yet" note. Reason: DESIGN.md requires real reviews and never invented or placeholder testimonials, and the story asks for "no empty block".
4. **Copy**: unchanged. `scripts/check-google-reviews.mjs` parses the existing strings "valoración media de X.X sobre 5" and "(N reseña/reseñas)". Any future copy change to `GoogleReviews.astro:30-39` must update the script in the same change (see Risks).
5. **Design system reuse**: no new tokens or components. The existing ones listed above are kept: Tailwind gray/yellow/blue styling, the older home styling world per DESIGN.md "Two styling worlds coexist". New component: none.
6. **Responsive**: unchanged. The cards are a single column below `sm` and use `sm:grid-cols-2` from `sm` up. The panel padding goes `px-4 py-12`, then `sm:px-6`, then `md:px-8 md:py-16`. QA evidence screenshots: 375 and 1280 px.
7. **Interactions**: unchanged. The only interactive element is the external link (`target="_blank" rel="noopener noreferrer"`, underline removed on hover).
8. **Accessibility hand-off**: unchanged. Each star row has `aria-label="Valoración: N de 5 estrellas"`. In the empty state nothing is rendered, so there is no orphan heading or landmark.

## Tasks

- [ ] 1.1 [NRD-38 app] Guard the reviews fallback and the visible/JSON-LD consistency; tests: new cases in `tests/google-reviews-error.test.js` first, then `scripts/check-google-reviews.mjs` and its `package.json` scripts.
- [ ] 1.2 [NRD-39 app] Record the production diagnosis and dated evidence in T6 of `odd/tasks/mejoras-home-conversion.md` and on the story; tests: run the 1.1 script on the saved production HTML.
