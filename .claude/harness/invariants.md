# Invariants

The rules every design, commit and review in this repository must preserve. The Tech Lead owns this file (designs comply with it), the adversarial reviewer walks it item by item, the PR reviewer checks the diff against it. Keep each item short, testable and with a pointer to where it lives in the code.

Each item: **name** - the rule - where (`path` or symbol) - why it exists - how a violation shows up.

## Architecture and layering

- **Static output** - the site is a fully static Astro build (`output` static in `astro.config.mjs`); no server runtime, SSR adapter or API routes; third-party APIs are called at build time only (`src/lib/google-reviews.ts`). Netlify config lives in `public/_headers` and `public/_redirects`; there is no `netlify.toml` (ADR 0001). Why: Netlify static hosting and deploy budget. Violation: an adapter, `export const prerender = false`, an endpoint under `src/pages/`, or a `netlify.toml`.
- **Data lives in `src/data`** - site-wide facts (NAP, services, prices, intents, internal links, trust signals) come from `src/data/*.ts`, never hardcoded twice in pages. Why: one source of truth for copy and structured data. Violation: a price, phone or address literal duplicated in a page or component.
- **SEO head goes through one component** - title, meta, canonical and Open Graph come from `src/components/seo/SEO.astro`; JSON-LD from `src/components/seo/Schema.astro` built by `src/lib/schema.ts`. Violation: a page writing its own `<title>`, canonical or `<script type="application/ld+json">`.
- **Layouts** - every page uses one of `src/layouts/` (`Layout`, `ServiceLayout`, `BlogPostLayout`, `LegalLayout`). Only `src/layouts/Layout.astro` writes `<html>`/`<head>`; the other layouts wrap it and add JSON-LD through `<Schema slot="head">`. Service and niche pages are a `ServicePageData` object from `src/data` rendered by `ServiceLayout`. Violation: a page with its own `<html>` shell, or a layout that does not wrap `Layout`.

## SEO safety

- **No URL breaks** - an existing public URL is never removed or renamed without a 301 in `public/_redirects`. Why: ranking and backlinks. Violation: a deleted or moved file under `src/pages/` or `src/content/blog/` with no redirect.
- **One H1 per page, trailing-slash URLs** - internal links and canonicals use the trailing-slash form of the route. `astro.config.mjs` sets no `trailingSlash`, so this is enforced by review, not by Astro. Violation: two `<h1>` or a link to `/ruta` without the trailing slash.
- **Sitemap, robots and llms.txt stay consistent** - sitemap from `@astrojs/sitemap`, robots from `astro-robots-txt` (AI crawlers allowed) in `astro.config.mjs`, `public/llms.txt` lists the public service pages. Sitemap `lastmod` is set only from blog frontmatter (`updatedDate`/`pubDate`), never the build date (`getBlogLastmodBySlug`). The `check-seo-*` scripts must keep passing. Violation: a failing `pnpm check:seo-NN:dist` after `pnpm build`.
- **No promised rankings** - copy never promises a concrete Google position or guaranteed result. Why: honesty and the product positioning in `PRODUCT.md`.

## Security and privacy

- **Secrets** - no secret in the repo or in client bundles; only `PUBLIC_*` variables reach the browser. `GOOGLE_PLACES_API_KEY` is read at build time only (`src/lib/google-reviews.ts`). `.env*` is never committed or read by agents.
- **CSP and headers** - `public/_headers` defines the CSP; any new third-party script, font, image or form endpoint needs its origin added there deliberately. Violation: a new external origin that the CSP blocks, or a CSP widened with `*` or `'unsafe-eval'`.
- **No inline scripts** - `script-src` has no `'unsafe-inline'`: client JS lives in `src/scripts/*.js` and is imported from a component `<script>` (SEO-27); scripts that run on every page hook `astro:page-load` and keep their state inside a function so View Transitions do not redeclare it (`src/scripts/contact-form.js`). Violation: `<script is:inline>`, an inline `on*=` handler, or `'unsafe-inline'` added to `script-src`.
- **Analytics only after consent** - GA4 (`PUBLIC_GA4_MEASUREMENT_ID`) loads only after the visitor accepts in `src/components/AnalyticsConsent.astro` / `src/scripts/analytics-consent.js`. Violation: any tracking request before consent.
- **Personal data** - the contact form (`src/components/ContactForm.astro`, `src/scripts/contact-form.js`) sends name, email, phone and message to Formspree; the legal basis and retention are described in `/privacidad/` and `/cookies/`. A new field, processor or tracker requires updating those pages in the same story.
- **Private client reports** - `public/informes/**` stays `noindex, nofollow` (`public/_headers`) and out of the sitemap and internal links.

## Content

- **Spanish copy** - all user-facing copy, metadata and structured data text is in Spanish; identifiers, new comments and commits are in English (ADR 0008). Existing Spanish comments are translated only when the surrounding code is edited.
- **Real proof only** - testimonials, reviews, client names and figures must be real and sourced; never invented. Trust signals carry a status in `src/data/local-trust.ts` (`pending-human-approval` | `verified`) and only `verified` ones are published (`scripts/check-seo-10.mjs`, `check-seo-11.mjs`).

## Testing

- **TDD** - behavior changes come with a test in `tests/*.test.js` (node:test) that fails without the change (`process.tdd`). SEO-structure changes add or update a `scripts/check-seo-*.mjs` check when one covers the area.
- **What only shows up in a real browser** - mobile menu, consent banner, contact form submission states, dark-only styles (`<html class="dark">` is fixed in `Layout.astro`; there is no theme switch), layout at 375 px, and focus visibility: designs list these under "Real-browser checks" for QA.

## Process

- **Branch flow and deploy budget** - story branches `{type}/{KEY}-{slug}` are cut from `develop` and merged into `develop` with a merge commit; nothing from a story or sprint merges or pushes to `main`. Production deploys only from `main`, promoted from `develop` by the scheduled task (at most about 20 a month, Netlify credits) (ADR 0009). Violation: a PR targeting `main`, a squash/rebase merge, or a deploy triggered outside the schedule.
- Conventional Commits in English, no AI attribution, one work unit per commit, nothing under `repo.untrackedPaths` committed. Format only the files you edit (`pnpm format <file>`), never the whole repo.

## Radical changes (need the user, never decided by an agent)

- A new runtime dependency.
- A layering or dependency-rule change, or leaving static output.
- A new external service, tracker, form processor, network boundary or paid infrastructure.
- Removing, merging or renaming a public page, or changing prices shown on the site.
- Any change to legal pages beyond keeping them consistent with a planned feature.
