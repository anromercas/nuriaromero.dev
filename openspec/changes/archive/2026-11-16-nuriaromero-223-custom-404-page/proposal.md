# Proposal

## Why

Tracker: [NRD-223](https://nuriaromerodev.atlassian.net/browse/NRD-223) (epic NRD-162, milestone M4). The site has no custom 404: there is no `src/pages/404.astro` and no 404 rule in `public/_redirects`, so a broken or old URL ends on Netlify's generic page, with no navigation, brand or booking. After the URL moves of the last months (services to the root, trailing slashes) it is the exit that visitors from old links see, and the owner rule of epic NRD-162 asks every public page to follow the `/seo-local-sevilla/` visual world.

**Dependencies:** none blocking. Sprint order is after NRD-221 and NRD-222; this change adds the build check numbered after NRD-222's `check-seo-18` (19 when NRD-222 is on `develop`; otherwise the next free number) and rebases on `develop` for the `package.json` script chain.

## What Changes

- `src/pages/404.astro` (Astro emits `dist/404.html`, which Netlify serves with a 404 status for unmatched paths, no configuration needed): `Layout` with `noindex`; `<main class="template-ground ...">`; short hero (`SeoLocalHero`, keyword H1 in business language: the page does not exist or has moved, one orienting sentence, booking button); links to the home and to the in-focus service pages through `SeoLocalRelated`, built from `src/data`; closing band with the booking button (`SeoLocalClosing`). No breadcrumbs, no page JSON-LD (the site-wide business and website entities from `Layout` stay).
- `src/data/services.ts` exports `focusServices`, the six in-focus service pages (PRD section 5), so the 404 does not hand-write routes.
- `src/components/seo/SEO.astro` omits the canonical link when `noindex` is set (no page uses `noindex` today, so no other page changes).
- New build check `scripts/check-seo-19.mjs` (number per the dependency note) asserting the 404 contract on `dist/`, wired into `package.json`.

## Capabilities

### New Capabilities

- `not-found-page`: what the custom 404 must show and guarantee: business-language answer, exits to home, in-focus services and booking, `noindex` without canonical, outside the sitemap and `llms.txt`, one H1, no Service or FAQPage, no Netlify configuration change.

### Modified Capabilities

None.

## Out of scope

- `public/_redirects`, `public/_headers`, any Netlify setting or a `netlify.toml` (not needed to serve `404.html`; infra paths untouched).
- New redirects for old URLs, search on the 404, analytics events for 404 hits.
- Registering the 404 in `scripts/lib/template-pages.mjs`: that contract reads `dist/<route>/index.html` and measures word budgets for indexable pages; the 404 is `dist/404.html`, noindex and has no word target in the story, so it is excluded explicitly and its own contract lives in the new check (story criterion "excluded explicitly and tested, not by omission").
- Parked pages (niches, clinicas capilares) as 404 exits.

## Impact

- Code (layer `app`): `src/pages/404.astro`, `src/data/services.ts`, `src/components/seo/SEO.astro`, `scripts/check-seo-19.mjs`, `package.json`, `tests/not-found-page.test.js`.
- SEO: `@astrojs/sitemap` 3.1.6 already skips status-code pages (`STATUS_CODE_PAGES` = 404, 500), and `public/llms.txt` is a curated static file without it; both asserted by the check. Existing checks treat `dist/404.html` like any page: `check-seo-02` (one H1), `check-seo-06` (internal hrefs exist, trailing slash), `check-seo-07` (no owned term in title, H1, H2).
- No URL, price, dependency, CSP or Netlify change. Not radical.
