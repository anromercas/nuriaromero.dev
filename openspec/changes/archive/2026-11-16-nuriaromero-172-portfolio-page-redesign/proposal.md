# Proposal

## Why

Tracker: [NRD-172](https://nuriaromerodev.atlassian.net/browse/NRD-172) (epic NRD-162, milestone M4). `/portfolio/` (about 149 visible words) still uses the old Tailwind world (glyph H1, gray text, `Projects` cards with `shadow-xl` and `border-gray-800`, legacy `CTASection`). It is already short: the goal is the `/seo-local-sevilla/` visual world, not more text.

**Depends on NRD-212** (the 250-word cap is measured without the live Google review quote of `RealProof`) **and on NRD-170 task 1.1 (NRD-217)**, which adds the ink variant of the project cards (`Projects variant="ink"`, `RealProof projectsVariant`). Sprint rank puts NRD-170 before this story; the branch is rebased on `develop` after both are merged.

## What Changes

- `src/pages/portfolio.astro` uses `Layout` with `<main class="template-ground ...">` (non-service pattern of `/contacto/`, ADR 0014) and renders: visible breadcrumbs; a short hero (keyword H1 "Casos de éxito", serif display title, one sentence that says which real projects are here, booking button); real proof (`RealProof` with the two published projects as ink cards, the live Google review quote when present); related service links; closing band with the booking button. No FAQ, no proof strip, no plans, no Service.
- `src/data/internal-links.ts` gets a `"/portfolio/"` entry (three service pages and a conversion link to `/contacto/`).
- `/portfolio/` registered in `scripts/lib/template-pages.mjs` (`words: [100, 250]`, `service: false`).

## Capabilities

### New Capabilities

- `portfolio-page`: what `/portfolio/` must show and guarantee on the template: a direct answer about the projects, sections and order, the 250-word cap, only published projects in ink cards, no owned term in headings, BreadcrumbList only, related links and booking.

### Modified Capabilities

None (the ink project cards are specified by NRD-170 in `page-template`).

## Out of scope

- New projects, metrics, results, testimonials or logos.
- Renaming the page, its URL, title or breadcrumb "Casos de éxito" (pinned by `tests/casos-exito.test.js`).
- A FAQ (the research of 2026-11-16 has no question for this page) and a proof strip (no extra sourced figure beyond what the cards show).

## Impact

- Code: `src/pages/portfolio.astro`, `src/data/internal-links.ts`, `scripts/lib/template-pages.mjs`, `tests/portfolio-template.test.js`, `tests/casos-exito.test.js` (H1 assertion moves to the `SeoLocalHero` keyword prop).
- SEO: same URL, title and description; JSON-LD stays BreadcrumbList only, now with visible breadcrumbs already present; new outbound links to three service pages inside `<main>`.
- No URL, price, dependency or CSP change. Not radical.
