# Proposal

## Why

Tracker: [NRD-222](https://nuriaromerodev.atlassian.net/browse/NRD-222) (epic NRD-162, milestone M4). The four blog posts (`src/content/blog/*.md`) render through `src/layouts/BlogPostLayout.astro`, still in the old world: gray Tailwind header, `EntryContentStyles` gray/blue prose, the gray `InternalLinks` aside and the old `CTASection`. Two posts own measured head terms (Google Maps guide, web prices) and all four feed the in-focus service pages (PRD section 5); a visitor who lands on a post from Google and moves to a service page changes "website" visually, against the owner rule of epic NRD-162.

**Related story:** [NRD-221](https://nuriaromerodev.atlassian.net/browse/NRD-221) (`/blog/` index). The PO wants both on `develop` together. There is no code dependency: NRD-221 touches only `src/pages/blog/index.astro` and `scripts/lib/template-pages.mjs`; this change touches only the post layout, a new contract check and its baseline. Sprint order: NRD-221 first, then this one. **NRD-223** (404 page) adds the next `check-seo-NN` after this change's `check-seo-18`, so this change should merge before NRD-223 (sprint order already does).

## What Changes

- Freeze the post contract before any visual change: a `data-post-body` marker on the element that wraps the rendered Markdown, a helper `scripts/lib/post-contract.mjs`, a new build check `scripts/check-seo-18.mjs` and its baseline `tests/fixtures/blog-posts.baseline.json`, generated from the current layout: per post, the visible body text, the body links, title, meta description, canonical and the Article and BreadcrumbList JSON-LD. CI runs it in `check:seo:dist` from then on.
- Recompose `BlogPostLayout.astro` on the ink template: `<main class="template-ground ...">`; breadcrumbs and an `<article>` whose header keeps the post title as the only H1, the description, the author link and the publication / update dates; the body in ink prose styles (headings, lists, tables, links, strong, rules) scoped under the layout; the post's internal links (`internalLinksBySource`) through `SeoLocalRelated`; the closing band `SeoLocalClosing` with the booking button instead of `CTASection`.
- `BlogPostLayout` stops using `CTASection`, `InternalLinks` and `EntryContentStyles` (the last stays for `LegalLayout`).

## Capabilities

### New Capabilities

- `blog-post-layout`: what every blog post page must show and guarantee on the template: post text unchanged, header with H1, author and dates, ink prose, related links with the same destinations, closing with booking, unchanged search signals and structured data.

### Modified Capabilities

None.

## Out of scope

- Editing the text of any post, including the restaurants post (it feeds a parked page; it gets the new layout with no text change). Content changes are NRD-127 and NRD-128, gated by indexation.
- Word budgets for posts (the story sets none); posts are not added to `scripts/lib/template-pages.mjs`.
- `LegalLayout` and `EntryContentStyles` (legal pages keep the old layout).
- `/blog/` index (NRD-221), `internalLinksBySource` content, `articleSchema`, title or description logic.

## Impact

- Code (layer `app`): `src/layouts/BlogPostLayout.astro`, `scripts/lib/post-contract.mjs`, `scripts/check-seo-18.mjs`, `tests/fixtures/blog-posts.baseline.json`, `package.json` (two scripts and the `check:seo:dist` chain), `tests/post-contract.test.js`, `tests/blog-post-template.test.js`.
- SEO: same URLs, titles, descriptions, canonicals, H1s, Article and BreadcrumbList JSON-LD and body links, enforced by `check-seo-18`; `check-seo-06` keeps every mapped related link inside `<main>`; `check-seo-08` and `check-seo-09` (GEO post `<article>`, author link, "Publicado el" date) stay green.
- No URL, price, dependency, CSP or Netlify change. Not radical.
