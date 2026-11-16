# Proposal

## Why

Tracker: [NRD-173](https://nuriaromerodev.atlassian.net/browse/NRD-173) (epic NRD-162, milestone M4). `/recursos/` (about 162 visible words) still uses the old Tailwind world: a two-column grid of four identical gray cards and a gray bordered aside. It is already short: the goal is the `/seo-local-sevilla/` visual world, not more text.

**Depends on NRD-212** only for sprint order (this page has no live review quote; its cap is measured with the same method).

## What Changes

- `src/pages/recursos.astro` uses `Layout` with `<main class="template-ground ...">` (non-service pattern of `/contacto/`, ADR 0014) and renders: visible breadcrumbs; a short hero (keyword H1 "Recursos para citar y compartir", serif display title, one sentence on which guides there are and for whom, booking button); the resources section as asymmetric index rows (the same four resources, one sentence each, a text link each) ending with a short transparency note that keeps "No se compran enlaces"; closing band with the booking button. No FAQ, proof, plans or Service.
- `/recursos/` registered in `scripts/lib/template-pages.mjs` (`words: [100, 250]`, `service: false`).

## Capabilities

### New Capabilities

- `resources-page`: what `/recursos/` must show and guarantee on the template: direct answer, sections and order, the 250-word cap, the four linkable resources and the no-link-buying policy (SEO-13), no owned term targeted, BreadcrumbList only, booking.

### Modified Capabilities

None.

## Out of scope

- New resources, downloads or tools; new figures or promises.
- A six-tile bento: it would need two extra resources (more text, which the story rules out) and a new illustration set; the story leaves the choice to the UI spec, and this design sets index rows (design decision 1).
- Changes to `check-seo-13` or to the authority register.

## Impact

- Code: `src/pages/recursos.astro`, `scripts/lib/template-pages.mjs`, `tests/recursos-template.test.js`.
- SEO: same URL, title, description and H1 text (`check-seo-13`); JSON-LD stays BreadcrumbList; the four resource links and the policy stay in `<main>`.
- No URL, price, dependency or CSP change. Not radical.
