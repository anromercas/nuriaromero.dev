## Context

Bug [NRD-372](https://nuriaromerodev.atlassian.net/browse/NRD-372). Ten pages call `getGoogleReviews()` in their frontmatter: `src/pages/index.astro`, `seo-local-sevilla.astro`, `diseno-web-sevilla.astro`, `tienda-online-sevilla.astro`, `desarrollo-software-medida.astro`, `automatizaciones.astro`, `inteligencia-artificial.astro`, `seo-para-ia.astro`, `sobre-mi.astro`, `portfolio.astro`. They render the data through `src/components/seo-local/RealProof.astro` (review quote), the proof stats (`"<rating> en Google"`), `src/components/GoogleReviews.astro` and, on the home, `reviewsSchema()` from `src/lib/schema.ts`. Before the fix each call issued its own Place Details request, in every build with credentials.

The owner already implemented the fix on `fix/NRD-372-google-reviews-build-cost` (commit `fb09ab2`, draft PR #176, `verify` green):

- `src/lib/google-reviews.ts:64-69`: module-level `let cachedReviews: Promise<GoogleReviewsData | null> | undefined`; `getGoogleReviews()` returns `cachedReviews ??= fetchGoogleReviews()`.
- `src/lib/google-reviews.ts:71-76`: `fetchGoogleReviews()` returns `null` first thing when `process.env.CONTEXT !== "production"`, before reading credentials or calling `fetch`.
- `tests/google-reviews-error.test.js:88-102`: two source-regex tests (guard before `fetch(`, shared promise, single `fetch(`).

Gap against the acceptance criteria: every test of this module reads the source text; nothing executes the code. The PO criterion "a production build with credentials still requests and renders the reviews on every page that showed them, covered by a test" has no test at all, and "non-production builds make none" is only shape-checked.

## Goals / Non-Goals

**Goals:**

- Keep the implemented approach (shared promise + production gate) unchanged.
- Prove behaviorally: non-production makes no request and shares one promise; a production build with credentials makes exactly one request and renders the reviews on all ten pages.

**Non-Goals:**

- Caching across builds, changing rendering, JSON-LD or `scripts/check-google-reviews.mjs`, Netlify configuration or deploys.

## Decisions

**Approach.** The fix in `fb09ab2` is correct and minimal: Astro 4 prerenders all static pages in one Node process, so a module-level promise dedupes the calls for the whole build, and Netlify sets `CONTEXT=production` only for production deploys, so the gate removes the cost from local, CI, sprint and preview builds. Memoizing the promise (not the value) also dedupes concurrent page renders. What remains is test coverage. The non-production path can be executed directly in Node 24 (type stripping, as `tests/freshness.test.js` and `tests/page-freshness.test.js` already import `.ts` modules) because it returns before touching `import.meta.env`, which is Vite-only. The production path needs Vite's `import.meta.env`, so it is proven with one isolated Astro build (ADR 0019) run with `CONTEXT=production`, fake credentials and a `fetch` stub preloaded with `node --import` that answers Place Details from a fixture and counts the calls. No real key and no network call is ever used in tests.

**Files** (layer `app` for all):

- `src/lib/google-reviews.ts`: modify; done in `fb09ab2` (`cachedReviews`, `getGoogleReviews`, `fetchGoogleReviews`). No further change.
- `tests/google-reviews-error.test.js`: modify; done in `fb09ab2`. Keep as is.
- `tests/google-reviews-fetch.test.js`: create. Unit test of the non-production path.
- `tests/helpers/isolated-build.mjs`: modify. Add options `env` and `preload` to `isolatedBuild()`.
- `tests/helpers/places-fetch-stub.mjs`: create. `fetch` stub preloaded into the isolated build child.
- `tests/google-reviews-production-build.test.js`: create. One isolated production build and its assertions.
- `docs/adr/0019-blog-covers-and-isolated-fixture-builds.md`: modify (shared doc, written by the Tech Lead in this design commit). Amendment: fake credentials only with the stub.

**Interfaces:**

```js
// tests/helpers/isolated-build.mjs
/**
 * @param {{ posts?: ..., files?: ...,
 *           env?: Record<string, string>,   // merged AFTER the GOOGLE_* deletion
 *           preload?: string[] }} input     // absolute paths, each passed as `--import <file URL>`
 */
export async function isolatedBuild({ posts = [], files = [], env = {}, preload = [] } = {})
// spawnSync(process.execPath, [...preload.flatMap((p) => ["--import", pathToFileURL(p).href]), childScript, root],
//           { env: { ...inheritedWithoutGoogle, ...env }, ... })
```

Defaults keep today's behavior byte for byte (no credentials, no preload). The helper keeps deleting the inherited `GOOGLE_PLACES_API_KEY` / `GOOGLE_PLACE_ID`, so a developer's real key never reaches a test build; only explicit `env` can set fake ones.

```js
// tests/helpers/places-fetch-stub.mjs  (loaded with --import in the build child)
// Wraps globalThis.fetch. Requests whose URL starts with
// "https://places.googleapis.com/v1/places/" get a 200 JSON fixture:
//   { rating: 4.8, userRatingCount: 7, reviews: [{ rating: 5,
//     authorAttribution: { displayName: "Cliente de prueba" },
//     originalText: { text: "Reseña de prueba NRD-372" },
//     publishTime: "2026-11-01T10:00:00Z" }] }
// and append one line to the file named by process.env.PLACES_STUB_LOG.
// Any other URL goes to the original fetch.
```

```js
// tests/google-reviews-fetch.test.js
const { getGoogleReviews } = await import("../src/lib/google-reviews.ts")
// globalThis.fetch replaced by a counting stub before the import.
```

**Data:** none. No storage, schema, settings or environment variable changes.

**Test plan (TDD order).** The production code already exists, so RED is observed against the pre-fix module: run each new test once with `src/lib/google-reviews.ts` temporarily taken from `fb09ab2^` (`git show fb09ab2^:src/lib/google-reviews.ts`), confirm it fails for the expected reason (request made / several requests), restore the file, confirm GREEN. Never commit the reverted file.

1. Task 1.1 (verify `fb09ab2`): `node --test tests/google-reviews-error.test.js` green; read the diff against the scenarios "Repeated calls share one result", "Non-production build with credentials" and "Null paths stay unchanged".
2. Task 1.2, `tests/google-reviews-fetch.test.js` (scenarios "Repeated calls share one result", "Non-production build with credentials"): with `process.env.GOOGLE_PLACES_API_KEY` / `GOOGLE_PLACE_ID` set and `CONTEXT` set to `deploy-preview`, a counting `globalThis.fetch` stub, then dynamic import: `getGoogleReviews()` called twice returns the identical promise (`assert.equal(a, b)`), resolves to `null`, and the stub counted 0 calls. Restore `process.env` and `fetch` in `after()`. One module instance per test file, so cover both properties in one process (identity + null + zero calls).
3. Task 1.3, `tests/google-reviews-production-build.test.js` (scenarios "Several pages need the reviews in one build", "Production build with credentials and reviews"): `before()` (timeout 240 s) runs `isolatedBuild({ env: { CONTEXT: "production", GOOGLE_PLACES_API_KEY: "test-key", GOOGLE_PLACE_ID: "test-place-id", PLACES_STUB_LOG: <tmp file> }, preload: [<places-fetch-stub.mjs>] })`; `after()` calls `cleanup()` and removes the log. Assertions:
   - the stub log has exactly 1 line (one request for the whole build);
   - each of the ten pages' `dist/**/index.html` contains `Reseña de prueba NRD-372` or `4,8 en Google`; `portfolio/index.html` contains the review text (it only has the quote);
   - `dist/index.html` JSON-LD contains an `aggregateRating`, and `node scripts/check-google-reviews.mjs <dist>/index.html` exits 0;
   - no output file contains `test-key` (the key never reaches the HTML).
   Extend `tests/isolated-build-layout.test.js` only if needed to keep it passing; its current assertions are unaffected.
4. Full suite `node --test tests/*.test.js` and `pnpm build` green (`pnpm build` locally runs without `CONTEXT`, so it renders without reviews and makes no request).

**Real-browser / e2e checks (QA):** none needed in the browser for the fix itself. QA verifies: `pnpm build` locally with real credentials in `.env` and no `CONTEXT` renders no reviews section and no "en Google" stat on `/` and `/seo-local-sevilla/` (no billing); the production-build test passes and shows the reviews in `dist`; PR #176 `verify` green. The real production render is confirmed after the next scheduled promotion (owner-account action below).

**Owner-account actions (executed by the orchestrator):**

- After the next scheduled `develop` -> `main` promotion: open `https://nuriaromero.dev/` and `/seo-local-sevilla/` and confirm the Google rating stat and review quote are present. Class: executable owner action (public pages, no sign-in).
- About a week after that promotion: read the Places API Place Details request count in Google Cloud billing/metrics and confirm it is at most one per production deploy. Class: executable owner action (configured API first, else the owner's signed-in browser in an attended session, else queued in `.claude/state/attended-actions.json`).

**ADRs relied on:** 0001 (static Astro on Netlify, third-party APIs at build time only), 0006 (node:test and TDD), 0009 (branch flow and production deploys from `main`), 0019 (isolated fixture builds; amended by this change).

## Risks / Trade-offs

- [Reviews silently missing in production if `CONTEXT` is not `production`] -> Netlify always sets `CONTEXT=production` for production deploys; the post-promotion owner check above catches it.
- [Module-level promise lives for the whole process: in `astro dev` a cached result would persist until restart] -> dev never runs with `CONTEXT=production`, so the cached value is `null` and no request is made.
- [A failed request is cached for the build, so pages do not retry] -> intended: one failure means one warning and no reviews for that deploy, not N billed retries.
- [Unit suite gets one more isolated build (about 1-2 min)] -> accepted; ADR 0019 allows one isolated build per test file, and this one cannot be merged into an existing build file without giving those builds credentials.
- [The stub relies on Astro prerendering in the process that ran `--import`] -> true for Astro 4 static output; if the test ever sees 0 stub calls with reviews missing, the stub did not load and the test fails loudly rather than calling the real API (the key is fake).

## UI spec

No visual change is intended. This change only decides when the Google reviews data is fetched; markup, copy, styles, tokens and components stay exactly as they are. No new component.

### Reviews on the ten pages (`src/pages/index.astro`, `seo-local-sevilla.astro`, `diseno-web-sevilla.astro`, `tienda-online-sevilla.astro`, `desarrollo-software-medida.astro`, `automatizaciones.astro`, `inteligencia-artificial.astro`, `seo-para-ia.astro`, `sobre-mi.astro`, `portfolio.astro`)

1. **Screens and layout**: unchanged. Production builds (`CONTEXT=production`) render the existing reviews UI as today: the proof stat `"<rating> en Google"` with its `"<n> opinión|opiniones"` label, the review quote in `src/components/seo-local/RealProof.astro`, the reviews block in `src/components/GoogleReviews.astro` where a page uses it, and on the home the `reviewsSchema()` JSON-LD. Non-production builds (local `pnpm build`, `pnpm dev`, CI, sprint and deploy previews) render the existing `null` path: no "en Google" stat, no review quote, no `GoogleReviews` block, no reviews JSON-LD; the surrounding sections keep their current order and spacing because those components already render nothing for `null`.
2. **Hierarchy**: unchanged.
3. **States**: production with data = current success state; production with a failed request or no reviews = current `null` state (one build warning, no retries); every non-production build = current `null` state by design. Loading state n/a (data is resolved at build time). No new empty or error message.
4. **Copy**: unchanged; no new strings.
5. **Design system reuse**: existing `RealProof.astro`, `GoogleReviews.astro` and the pages' proof stats, untouched.
6. **Responsive**: unchanged.
7. **Interactions**: unchanged.
8. **Accessibility hand-off**: unchanged (existing star `aria-label`s stay in production).
9. **GEO-ready content**: unchanged; the rating and reviews remain visible in production only, as the public pages are built only there.

Assumption: a preview or local build without the reviews block is not a regression; reviewers (`ux-review`, QA) must compare the reviews UI only against a production build or the production-build test output, never against a preview. Reason: the gate deliberately returns `null` outside production to stop billed requests.
