# Proposal

## Why

Tracker: [NRD-170](https://nuriaromerodev.atlassian.net/browse/NRD-170) (epic NRD-162, milestone M4). `/sobre-mi/` has about 1,005 visible words in `<main>` and renders the old Tailwind world (`Hero`, `AboutMe`, `Experience` with gray text, yellow highlights, a rotated portrait and glyph section titles). It is not a service page, but the owner wants every public page on the `/seo-local-sevilla/` visual world with short, clear text.

**Depends on NRD-212** (the 550-600 range is measured without the live Google review quote, which `RealProof` shows on this page in production).

## What Changes

- `src/pages/sobre-mi.astro` uses `Layout` with `<main class="template-ground ...">` (the non-service pattern of `/contacto/`, ADR 0014) and renders: visible breadcrumbs; hero with the H1, a serif display title, a 48-52ch lead that says who Nuria is, what she does and where (GEO-1) and her real portrait instead of a drawn mock, booking button and a secondary link to the process; proof strip with published, verified data only; process timeline "cómo trabajo" with a byline (natural links to `/` and `/seo-local-sevilla/`) and a compact career record in the `aside` slot; real proof with the published projects; closing band with the booking button. No FAQ, no services bento, no plans, no NAP.
- Shared piece for NRD-170 and NRD-172: `Projects.astro` gains `variant="ink"` (project cards in the ink world: real screenshots with 0.9rem corners, no shadows, hairline borders, asymmetric layout) and `RealProof.astro` gains `projectsVariant`; both default to today's output, so delivered pages do not change.
- The old-world components used only by this page are removed: `Hero`, `AboutMe`, `Experience`, `ExperienceItem`, `Badge`, `SocialPill`.
- `/sobre-mi/` registered in `scripts/lib/template-pages.mjs` (`words: [550, 600]`, `service: false`).

## Capabilities

### New Capabilities

- `about-page`: what `/sobre-mi/` must show and guarantee on the template: direct answer about who, what and where, sections and order, text budget, no owned term in headings, Person and BreadcrumbList coherent with the page and no Service or FAQPage, real proof only, natural links to the home and to SEO local.

### Modified Capabilities

- `page-template`: project cards can render in the ink world as an opt-in variant of the real proof section.

## Out of scope

- A FAQ: of the two sourced questions, "¿Qué hace un consultor SEO?" is already on the home (NRD-164) and "¿freelance, estudio o agencia?" is already on `/contacto/` ("¿Mejor un freelance o una agencia?", NRD-171); the rule "never the same question on two pages" leaves none (the story makes the FAQ optional).
- Switching the other template pages to the ink project cards (follow-up for the PO; ADR 0014 lists `Projects` as a component still to migrate).
- Changes to `personSchema()` or the page title and description.

## Impact

- Code: `src/pages/sobre-mi.astro`, `src/components/Projects.astro`, `src/components/seo-local/RealProof.astro`, removal of six components, `scripts/lib/template-pages.mjs`, `tests/sobre-mi-template.test.js`, `tests/template-components.test.js`, `tests/seo-consultor-strategy.test.js`, `tests/trailing-slash-links.test.js`.
- SEO: same URL, title and description; JSON-LD stays Person + BreadcrumbList, now with visible breadcrumbs; the exact "consultor SEO en Sevilla" link to the home moves from `AboutMe` into the page. No Service, no FAQPage.
- Content: the long work history becomes a compact career record with the same published facts (roles, companies, years); the "Disponible para trabajar" badge and the LinkedIn pill go (LinkedIn stays in the footer and in `/contacto/`).
- No URL, price, dependency or CSP change. Not radical.
