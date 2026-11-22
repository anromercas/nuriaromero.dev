## Why

[NRD-372](https://nuriaromerodev.atlassian.net/browse/NRD-372): `getGoogleReviews()` in `src/lib/google-reviews.ts` called the paid Places API (New) Place Details once per page that shows reviews, with no caching, in every build that had `GOOGLE_PLACES_API_KEY` set (local, CI, the hourly unattended sprint, deploy previews). Google Cloud billing shows 4,879 "Place Details Enterprise + Atmosphere" calls between 2026-11-16 and 2026-11-21 (EUR 87.09 + VAT). The fix must cut that cost without losing the reviews in production, which is an M1 exit criterion ("Google reviews render in production").

## What Changes

- One shared Place Details request per build process: every page awaits the same promise (implemented in commit `fb09ab2` on this branch).
- Only the Netlify production build (`process.env.CONTEXT === "production"`) makes the request; every other build renders the pages as if no reviews existed (implemented in `fb09ab2`).
- Behavioral tests replace the source-shape-only coverage: a unit test that imports the module and proves the non-production path makes no request and shares one promise, and an isolated production build with fake credentials and a stubbed `fetch` that proves exactly one request and that the reviews render on every page that shows them.
- `tests/helpers/isolated-build.mjs` gains two opt-in options (`env`, `preload`) so a test can run the isolated build in a given Netlify context with a `fetch` stub. Defaults stay unchanged (no Google credentials).
- ADR 0019 gets a short amendment recording that fake credentials are allowed in an isolated build only together with the `fetch` stub.

## Capabilities

### New Capabilities

- `google-reviews-fetch`: when and how often the build requests Google review data from Places API, and what the pages render when it does not.

### Modified Capabilities

- None. The page specs (`home-page`, `diseno-web-page`, `ai-page`, `about-page`, `site-identity`, `page-template`) already define the "reviews unavailable" rendering, which non-production builds now always take; their requirements do not change.

## Impact

- Code: `src/lib/google-reviews.ts` (done in `fb09ab2`), `tests/google-reviews-error.test.js` (done in `fb09ab2`), new `tests/google-reviews-fetch.test.js`, new `tests/google-reviews-production-build.test.js`, new `tests/helpers/places-fetch-stub.mjs`, `tests/helpers/isolated-build.mjs`, `docs/adr/0019-blog-covers-and-isolated-fixture-builds.md`.
- Billing: at most one Place Details call per production deploy (about 20 a month) instead of 11 per build of any kind.
- Behavior outside production: local, CI, sprint and deploy-preview builds never show the reviews section, the review quote, the "X,X en Google" stat or the reviews JSON-LD. This is intended.
- Production builds from `main` keep the old code until the next scheduled `develop` -> `main` promotion; bringing a deploy forward is the owner's decision (deploy budget).
- No new dependency, no new external service, no data or schema change. Nothing radical.

## Out of scope

- Persisting the reviews between builds (file cache, KV, committed snapshot).
- Changing what the pages render with reviews, the review JSON-LD or `scripts/check-google-reviews.mjs`.
- Netlify settings, environment variables or a production deploy.
- Removing the existing source-regex tests in `tests/google-reviews-error.test.js` (they stay as cheap guards).
