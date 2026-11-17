# Proposal: Services menu with grouped services only, niche pages in the footer "Por sector"

## Why

Story [NRD-256](https://nuriaromerodev.atlassian.net/browse/NRD-256). The header "Servicios" dropdown concatenates `[...services, ...niches]` in `src/components/Header.astro`, so it lists 12 entries without hierarchy and mixes services with niche pages; `/seo-para-clinicas-capilares-sevilla/` lives in the `services` array although it is a niche page. Now that `/seo-para-ia/` (NRD-24) is on `develop`, the menu should show the services as two clear groups and leave the sector pages to the footer, without losing their internal links.

## What Changes

- New data module `src/data/navigation.ts` that classifies every service-template page: two service menu groups ("Visibilidad", "Webs y desarrollo") and one list of sector pages (the four niche pages plus `/seo-para-clinicas-capilares-sevilla/`). Header and Footer are built from it; the classification never lives in a component.
- Header "Servicios" dropdown (desktop) and accordion (mobile): only the seven services, in two groups with non-link group headings. `/seo-para-ia/` sits in "Visibilidad".
- The "Servicios" active state is computed from the menu services only, so it keeps working on every service page; sector pages no longer mark "Servicios" as current (they are not in the menu).
- Footer: the "Servicios" column lists the same seven services; the column "Webs por sector" is renamed "Por sector" and lists the five sector pages.
- Contextual links from each parent service to its sector pages already exist in `src/data/internal-links.ts` (`/diseno-web-sevilla/` to the four niche pages, `/seo-local-sevilla/` to the four niche pages and the capilares page) and are rendered on both pages; this change locks them with a test instead of adding links.
- `scripts/check-capilar-local.mjs`: its "shared navigation" expectation now reads the sector list.
- ADR 0013 "Menu and breadcrumbs" is amended: the menu is built from `src/data/navigation.ts` and sector pages leave the dropdown (they stay public, in the footer and linked from their parent service).

No public URL is removed or renamed; no page, price, copy of a page body, structured data or `llms.txt` changes.

## Capabilities

### New Capabilities

- `site-navigation`: what the shared header menu and footer navigation list, how entries are grouped, and the guarantee that pages leaving the menu keep internal links.

### Modified Capabilities

None.

## Impact

- Code (layer `app`): `src/data/navigation.ts` (new), `src/components/Header.astro`, `src/components/Footer.astro`, `scripts/check-capilar-local.mjs`, `tests/site-navigation.test.js` (new); one comment in `src/data/services.ts` (the `services` array itself is unchanged: `llms.txt` price tests and other tests read it).
- Docs: `docs/adr/0013-seo-site-architecture.md` amendment (written with this design).
- SEO: every page loses the header links to the five sector pages but keeps the footer links (all pages) and the contextual links from `/diseno-web-sevilla/` and `/seo-local-sevilla/`. No check-seo script changes; PR #103 (NRD-26, `package.json` `check:seo` chain) does not overlap.
- No runtime dependency, schema, setting or radical change.

## Out of scope

- Adding `/seo-para-clinicas-capilares-sevilla/` to `llms.txt` "## Sectores" (parked, NRD-27).
- Unparking, rewriting or re-targeting any niche page (PRD section 5).
- Reordering or renaming the services themselves, or the `services` / `focusServices` arrays.
- Desktop dropdown keyboard behaviour beyond what exists today (hover and `focus-within`); Escape-to-close on desktop.
