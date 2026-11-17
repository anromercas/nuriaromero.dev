# Proposal

## Why

Tracker: [NRD-25](https://nuriaromerodev.atlassian.net/browse/NRD-25) (epic NRD-3, milestone M2). A new page without internal links or an `llms.txt` entry is hard to discover for Google and AI crawlers, and a wrong anchor would cannibalise the home ("consultor SEO en Sevilla") or `/seo-local-sevilla/` ("SEO local Sevilla", Google Maps). ADR 0013 (P1 accepted on 2026-11-17) lists the conditional link rows 8 to 11 of table A, the `intentMatrix` row of table B and the `keywordOwners` row for `/seo-para-ia/`; the plan `odd/tasks/seo-para-ia-geo-page.md` (PR #97 version) adds its own link table.

**Dependencies.** Blocked by NRD-24 (`openspec/changes/nuriaromero-24-seo-para-ia-page/`): the page, its `seoParaIa` entry and its menu entry must be on `develop` first; this branch is cut or rebased after NRD-24 merges. This change blocks NRD-26 (`check-seo-21` asserts the `llms.txt` entry).

## What Changes

- `src/data/internal-links.ts`: rows to `/seo-para-ia/` from the home, `/seo-local-sevilla/` (ADR row 11), the GEO post (ADR row 8) and `/inteligencia-artificial/`; a new `"/seo-para-ia/"` block with the GEO post (ADR row 9), `/seo-local-sevilla/` (ADR row 10), `/sobre-mi/`, `/diseno-web-sevilla/` and the conversion row to `/contacto/`. Where ADR 0013 and the plan give different anchors for the same pair, ADR 0013 wins. No row links "consultor SEO en Sevilla" to anything but `/`; the page's single home link stays in its process byline (NRD-24), so its block has no `/` row.
- `src/data/seo-intents.ts`: `intentMatrix` row for `/seo-para-ia/` (national scope, does not target Seville-qualified queries), `keywordOwners` rows `posicionamiento en ia` and `seo para ia` owned by `/seo-para-ia/`, `/seo-para-ia/` in `serviceRoutes`, and two `reciprocalLinks` pairs (GEO post and `/seo-local-sevilla/`). The `/seo-local-sevilla/` row is unchanged.
- `.claude/harness.json` (`seo.rankTracking`): "posicionamiento en ia" now tracks `/seo-para-ia/` (ADR 0013 "Until the page exists") and "seo para ia" is tracked for it (ADR 0012: the registry follows the tracked list); 13 keywords within `maxCallsPerRun` 14.
- `public/llms.txt`: one entry under "## Servicios" with the page name, the Local Pro price as published and the honesty line.
- Tests updated where they pin exact sets (`keyword-ownership`, `ia-template`, `home-template`) and new assertions for the rows, the registry and `llms.txt`.

## Capabilities

### New Capabilities

None. (The requirements below extend `seo-para-ia-page`, created by NRD-24's change; archive order NRD-24, then NRD-25.)

### Modified Capabilities

- `seo-para-ia-page`: adds how the page is linked, registered and listed in `llms.txt` (ADDED requirements; no existing requirement changes).

## Out of scope

- Any title, H1, H2 or meta change on the home, `/seo-local-sevilla/`, `/inteligencia-artificial/` or the GEO post; any page copy (anchors live in the link map only).
- A link from `/sobre-mi/` (it has no link block; the plan says to omit it).
- `check-seo-21` (NRD-26); Search Console submission and baseline (owner, after promotion).

## Impact

- Code (layer `app`): `src/data/internal-links.ts`, `src/data/seo-intents.ts`, `public/llms.txt`, new `tests/seo-para-ia-links.test.js`, `tests/keyword-ownership.test.js`, `tests/adr-0013-link-rows.test.js`, `tests/ia-template.test.js`, `tests/home-template.test.js`, `tests/rank-tracking-keywords.test.js`. Shared path: `.claude/harness.json` (`seo.rankTracking` only).
- Pages whose `<main>` gains one related pill: `/`, `/seo-local-sevilla/`, `/inteligencia-artificial/`, the GEO post; `/seo-para-ia/` gains five pills. Word budgets checked by `check-seo-17` (`/inteligencia-artificial/` measured 846 of 850 on 2026-11-17, so its anchor is three words).
- No URL, price, dependency or CSP change. Not radical.
