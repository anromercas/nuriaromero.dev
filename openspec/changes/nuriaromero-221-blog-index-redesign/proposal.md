# Proposal

## Why

Tracker: [NRD-221](https://nuriaromerodev.atlassian.net/browse/NRD-221) (epic NRD-162, milestone M4). `/blog/` (`src/pages/blog/index.astro`) still renders the old Tailwind world: a gray H1 block and a list of identical gray bordered cards with a "Leer artículo →" glyph link. After Sprint 9 it is the only indexable in-focus page outside the template, against the owner rule of epic NRD-162 ("every public page follows the structure and visual world of `/seo-local-sevilla/`"). The blog feeds the in-focus service pages (PRD section 5), so the list should read as the same site as the home and `/recursos/`.

**Related story:** [NRD-222](https://nuriaromerodev.atlassian.net/browse/NRD-222) (blog post layout). The PO wants both on `develop` together. There is no code dependency in either direction: this change touches only `src/pages/blog/index.astro`, `scripts/lib/template-pages.mjs` and a new test; NRD-222 touches only the post layout and its own check. They can merge in either order; sprint order is NRD-221 first.

## What Changes

- `src/pages/blog/index.astro` uses `Layout` with `<main class="template-ground ...">` (the non-service pattern of `/contacto/` and `/recursos/`, ADR 0014) and renders: visible breadcrumbs; a short hero (`SeoLocalHero`, keyword H1, display title, one direct-answer sentence, booking button); the post list as ink rows (the `/recursos/` row pattern of NRD-220) with date, title (an `h3` carrying the link) and description of each post read from the `blog` collection, no new text per post; closing band with the booking button (`SeoLocalClosing`). No FAQ, proof, plans or Service.
- `/blog/` registered in `scripts/lib/template-pages.mjs` (`words: [150, 350]`, `service: false`).

## Capabilities

### New Capabilities

- `blog-index`: what `/blog/` must show and guarantee on the template: direct answer, sections and order, posts listed from the collection with trailing-slash links, the 350-word cap, no owned term targeted, BreadcrumbList only, booking.

### Modified Capabilities

None.

## Out of scope

- Any change to post content (`src/content/blog/*.md`): content work is NRD-127 and NRD-128, gated by indexation.
- The post layout (NRD-222).
- Tags, categories, pagination, search or featured images.
- Changes to the keyword ownership exemption `LISTING_CARD_EXEMPTION` (`scripts/lib/keyword-ownership.mjs`): it stays, although the new `h3` titles no longer need it.
- Title or meta description changes (kept as today).

## Impact

- Code: `src/pages/blog/index.astro`, `scripts/lib/template-pages.mjs`, `tests/blog-index-template.test.js` (layer `app`).
- SEO: same URL, title, description and BreadcrumbList; post links keep the `/blog/<slug>/` trailing-slash form (`tests/trailing-slash-links.test.js` unchanged); `llms.txt` unchanged.
- No URL, price, dependency, CSP or Netlify change. Not radical.
