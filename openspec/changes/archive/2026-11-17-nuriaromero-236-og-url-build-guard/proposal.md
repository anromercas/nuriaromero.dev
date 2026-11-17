# Proposal

## Why

[NRD-236](https://nuriaromerodev.atlassian.net/browse/NRD-236): LOW review follow-up of NRD-230 (PR #89), which stopped publishing `og:url` on `noindex` pages. The only built-output guard for `og:url` on an indexable page is the "built home: og:url equals its canonical" case in `tests/not-found-page.test.js`, and it reads only `dist/index.html` and skips in CI (node tests run before the build). `scripts/check-seo-19.mjs` checks that indexable pages keep their canonical, but not their `og:url`. A regression in any other template (services, blog, legal) that drops `og:url` or misaligns it from the canonical would ship unnoticed.

## What Changes

- New build check `scripts/check-seo-20.mjs`, chained last in `pnpm check:seo:dist` (what CI runs), walks every built HTML page in `dist/`:
  - indexable page: exactly one `og:url`, equal to its single `<link rel="canonical">`, absolute and with a trailing slash;
  - `noindex` page (the 404, private reports): neither `og:url` nor canonical.
- The rule lives in a pure helper `scripts/lib/og-url.mjs`, so `tests/og-url-guard.test.js` proves on synthetic HTML that dropping `og:url` from a service page or adding it to the 404 fails.

## Capabilities

### Modified Capabilities

- `not-found-page`: requirement "Canonical is omitted only on noindex pages" gains the exactly-once, trailing-slash and site-wide build-guard scenarios.

## Impact

- New `scripts/lib/og-url.mjs`, `scripts/check-seo-20.mjs`, `tests/og-url-guard.test.js`; modified `package.json` (scripts only) and `tests/not-found-page.test.js` (the chain-order assertion). Layer `app`.
- Published HTML unchanged: nothing under `src/` changes.
- No new dependency (node built-ins only). No radical change.

## Out of scope

- Other Open Graph or Twitter tags (`og:title`, `og:image`...).
- Changing `SEO.astro` or any page.
- Moving existing checks out of `check-seo-19`.
