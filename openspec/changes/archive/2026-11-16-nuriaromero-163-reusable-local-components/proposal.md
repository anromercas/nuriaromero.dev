# Proposal

## Why

Tracker: [NRD-163](https://nuriaromerodev.atlassian.net/browse/NRD-163) (epic NRD-162). The owner wants every public page to follow `/seo-local-sevilla/`, but its section components (`src/components/seo-local/*`) read `seoLocal` from `src/data/services.ts` or carry their copy inline, and the ink tokens, `.band` and the serif accent are copied per component and in the route's global style block. No other page can reuse them without copying code. This enabler blocks NRD-164 (home), NRD-165 (`/diseno-web-sevilla/`), NRD-171 (`/contacto/`) and the rest of the epic.

## What Changes

- Every section component in `src/components/seo-local/` takes its content through typed props (and slots for illustrations and rich text); none imports page data (`seoLocal`). Site-wide data (`SITE`, `bookingUrl`) stays allowed.
- New shared pieces: `src/styles/template.css` (ink tokens as CSS custom properties with the `DESIGN.md` values, `.band`, keyword heading, display title and serif accent classes, the page ground), `SectionHeading.astro` (keyword heading plus display title with one accent phrase), `BentoTile.astro` (one tile with its own SVG), `SeoLocalCycle.astro` (the monthly cycle diagram moved out of the process component) and `src/components/seo-local/types.ts`.
- `ServiceLayout` gains `variant="template"`: slots a page does not fill render nothing (no legacy fallback blocks) and `<main>` gets the ink ground, so the route's `<style is:global>` block goes away.
- `/seo-local-sevilla/` passes the data it uses today; its visible text, headings, `<main>` markup (except `class` and `data-astro-cid-*` attributes) and JSON-LD stay identical.
- Build-time guards: `scripts/check-seo-16.mjs` (reference page JSON-LD and heading outline against a committed fixture), `scripts/check-seo-17.mjs` with `scripts/lib/template-pages.mjs` (per-page contract: visible word range, visible FAQ equals FAQPage, Service present or absent), `scripts/lib/page-contract.mjs` helpers and `scripts/diff-main.mjs` for the before/after `<main>` comparison QA attaches.
- `DESIGN.md` "Known Drift" stops describing page-scoped tokens and documents how to compose a page from the components. ADR 0014 records the pattern.

## Capabilities

### New Capabilities

- `page-template`: the reusable section system every public page is composed from (props-driven sections, shared ink tokens, swappable illustrations, optional sections, template page contract) and the guarantee that the reference page `/seo-local-sevilla/` renders unchanged.

### Modified Capabilities

None (no living specs exist yet).

## Out of scope

- Any visual change or copy change on `/seo-local-sevilla/` (AC 8: preparation only).
- Migrating any other page (NRD-164, NRD-165, NRD-171 and later stories).
- Renaming `src/components/seo-local/` or its components (the names stay; ADR 0014 records that the folder is the template library).
- Restyling old-world shared pieces rendered inside the page (`BookingButton`, `Projects`, `Breadcrumbs`, Header, Footer).
- Changing the timeline dot fill to an ink token: `ink-ground` (`rgb(5 10 24)`) differs from today's gray-950 fill (`rgb(3 7 18)`), so the dot uses the `site-ground` token (same value as today) and the ink swap is left noted for NRD-164.

## Impact

- Code: `src/components/seo-local/*`, new `src/styles/template.css`, `src/layouts/ServiceLayout.astro`, `src/pages/seo-local-sevilla.astro`, `src/data/site.ts` (proof facts now hardcoded in `ProofStrip`), `scripts/`, `tests/`, `package.json` scripts, `DESIGN.md`, `docs/adr/`.
- No new dependency, no URL change, no data or price change, no CSP change. Not radical.
- Existing source-level tests that assert copy inside component files (`tests/seo-local-ficha-redesign.test.js`, `tests/seo-local-sevilla-redesign.test.js`, `tests/visibility-audit-graphics.test.js`, `tests/seo-local-posicionamiento-web.test.js`) move their assertions to the page or data source; their intent is kept.
