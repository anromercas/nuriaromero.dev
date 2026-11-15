# NRD-75 - Technical SEO review limited to what the architecture decision changes

## Why

[NRD-75](https://nuriaromerodev.atlassian.net/browse/NRD-75) (SEO method phase 4 of 8, epic NRD-4). A structural change (new, merged or re-targeted pages, menu, breadcrumbs, redirects, internal links) can silently break indexation, canonicals or structured data, and every fix costs a budgeted production deploy (ADR 0009). This review covers exactly what the accepted phase 3 ADR changes and names what is already guarded, so only real gaps get new work. Blocked by NRD-74 (ADR `docs/adr/0013-seo-site-architecture.md`); blocks NRD-76.

This story is designed now with the ADR as its input: the procedure, the coverage table and the output format do not depend on the ADR's content; the scope list is read from the ADR when the story starts (the `Blocks` link guarantees it is accepted by then).

## What changes

- `docs/seo-audit/technical-follow-up.md`: a dated section `## Revisión técnica del cambio de arquitectura (<YYYY-MM-DD>, NRD-75)` with: scope (from ADR 0013), coverage table (what is already guarded), per-item checks, and a gaps table ordered against the page changes.
- Tracker: a comment on NRD-75 with the gaps table for the PO to file (one bug or story per row); the developer agent has no issue-creation tool.

## Out of scope

- Re-auditing anything the ADR does not change.
- Any code, check script, copy, URL or redirect change (gaps become bugs/stories).
- Measuring CWV on templates that do not exist yet: the CWV item is a risk assessment against the NRD-18 baseline, not a new measurement.

## Requirements and scenarios

### Requirement: scope comes only from ADR 0013

The section SHALL start with a scope table extracted from ADR 0013: each changed page, URL, redirect, menu entry, breadcrumb and internal-link rule, with the ADR section it comes from. Items under "Propuestas pendientes de la usuaria" that the user has not approved (PRD decision log) are listed as "fuera de alcance hasta aprobación".

#### Scenario: verdict adjust with no structural change

- WHEN ADR 0013 says "Sin cambios de URL" and changes only titles, H1s and internal links
- THEN the scope holds only those pages and link rules, and the checks for redirects, sitemap and new templates read "no aplica (sin cambio en el ADR)"

#### Scenario: proposal not approved

- WHEN the ADR proposes merging two pages and the PRD decision log has no approval
- THEN the merge is listed as "fuera de alcance hasta aprobación" and gets no checks

### Requirement: coverage table of existing guards

The section SHALL contain a coverage table: for each check family (sitemap entries, robots, canonical with trailing slash, 301 chains, JSON-LD `Service` / `FAQPage` / `BreadcrumbList` / `LocalBusiness`, `llms.txt` entries, one H1, internal links, mobile rendering at 375 px, CWV), the existing guard that covers it for the scoped pages (name each relevant `scripts/check-seo-02..15.mjs`, NRD-50, NRD-18, NRD-19), what it does not cover, and "nuevo trabajo: sí/no". The guard descriptions SHALL be verified by reading each script, not taken from this design.

Starting point from the Tech Lead's reading on `develop` `5abc00f` (verify):

| Guard                                  | Covers (as read)                                                                                                                                                        |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `check-seo-02.mjs`                     | canonical with trailing slash and trailing-slash internal hrefs on the canonical service/niche pages; shared Header/Footer nav routes with trailing slash on every page |
| `check-seo-05.mjs`                     | niche pages: sector headings, distinct copy, canonical matches route (parked pages)                                                                                     |
| `check-seo-06.mjs`                     | `internalLinksBySource` rows rendered in the built HTML                                                                                                                 |
| `check-seo-07.mjs`                     | `intentMatrix` signals in title/H1/copy, FAQ near-duplicates, `reciprocalLinks` anchors                                                                                 |
| `check-seo-08.mjs`                     | FAQ blocks and GEO article structure                                                                                                                                    |
| `check-seo-09.mjs`                     | authorship markup, `Article` schema, curated `llms.txt` links (absolute, public, no promises)                                                                           |
| `check-seo-10.mjs`, `check-seo-11.mjs` | verified NAP / Maps link, no unverified proof; schema naming for pages and services                                                                                     |
| `check-seo-12.mjs`                     | hero CTA and consent constraints                                                                                                                                        |
| `check-seo-13.mjs`, `check-seo-14.mjs` | authority register and measurement docs (not page structure)                                                                                                            |
| `check-seo-15.mjs`                     | `/seo-local-sevilla/` commercial and schema checks                                                                                                                      |
| NRD-18                                 | production CWV/LCP baseline for the in-focus pages (`docs/designs/NRD-18-cwv-lcp-baseline.md`)                                                                          |
| NRD-50                                 | header CLS/LCP on production after the booking CTA                                                                                                                      |
| NRD-19                                 | production JSON-LD, FAQs and `llms.txt` links validated                                                                                                                 |

Apparent gaps to confirm: no check reads `robots.txt` or sitemap membership; none follows `public/_redirects` chains; none asserts one H1 site-wide; `BreadcrumbList` is only emitted by `BlogPostLayout` and some pages, not `ServiceLayout`.

### Requirement: per-item checks for the scope

For each scoped item the section SHALL record the result of: CWV risk of the new or changed template against the NRD-18 baseline (what is added above the fold, new images, fonts, client scripts; "riesgo bajo/medio/alto" with the reason), mobile rendering at 375 px (on a `develop` build when the change exists; otherwise "pendiente: se verifica en la historia de la página" with the story), sitemap entry, robots, canonical with trailing slash, 301 chains (none longer than one hop; check every new `_redirects` row against existing ones), JSON-LD coherence (`Service`, `FAQPage`, `BreadcrumbList`, `LocalBusiness` facts identical to `src/data`), `llms.txt` entry, one H1. Each result is "cubierto por <guard>", "OK (<evidence>)" or "hueco".

#### Scenario: redirect chain

- WHEN the ADR adds `/a/ -> /b/` and `_redirects` already has `/old -> /a/`
- THEN the chain `/old -> /a/ -> /b/` is recorded as a gap with the fix "point `/old` to `/b/`", ordered before the merge story

### Requirement: gaps become work, ordered with the page change

Each gap SHALL become one row of "Huecos (bugs o historias a crear)": title proposal, evidence (`path:line` or ADR section), proposed `check-seo-*` guard (new script or rule in an existing one) when automatable, and the page-change story it must land with or before. The developer comments the table on NRD-75; the PO files and links them (`Blocks` before the page story).

#### Scenario: no gap

- WHEN every scoped item is covered or OK
- THEN the table reads "Sin huecos (<fecha>)" and nothing is filed

### Requirement: no code change

The diff SHALL touch only `docs/seo-audit/technical-follow-up.md` and this design's task list. `node --test tests/*.test.js` stays green.

## Files (layer `app`)

| Action | Path                                                                                                                                                                                                                                                                                              | Notes                                                     |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| modify | `docs/seo-audit/technical-follow-up.md`                                                                                                                                                                                                                                                           | new dated section at the end; existing sections untouched |
| read   | `docs/adr/0013-seo-site-architecture.md`, `scripts/check-seo-*.mjs`, `public/_redirects`, `public/llms.txt`, `src/layouts/*.astro`, `src/lib/schema.ts`, `docs/designs/NRD-18-cwv-lcp-baseline.md`, `docs/designs/NRD-50-header-cls-production.md`, `docs/designs/NRD-19-validate-seo-signals.md` | evidence                                                  |

## Interfaces

None. Commands (read-only): `pnpm build`, `pnpm check:seo-NN:dist`, `curl -sSIL` on production for existing URLs in scope.

## Data

None.

## Test plan (TDD order)

No behaviour change, so no new test. Each subtask ends with `node --test tests/*.test.js` green and the self-check: every scoped item has a result for every applicable check; every "cubierto" names the guard; every gap names a target story.

## Real-browser / e2e checks

None for this story (docs path). Mobile 375 px checks of changed templates are recorded here only when the change already exists on `develop`; otherwise they are carried as a requirement into the page story.

## Risks

- **ADR content unknown at design time.** The procedure is generic; if ADR 0013 proposes a structure this design did not foresee (for example a new layout), the developer asks via `question NRD-75` instead of improvising checks.
- **Developer cannot create issues.** The PO files the gaps from the comment.
- **Size.** 3-5 points depending on the ADR scope; if the ADR changes more than about 8 pages, the developer reports it and the PO may split by page group.

## ADRs

0005 (sitemap, robots, llms.txt, checks), 0004 (SEO head and JSON-LD), 0009 (deploy budget), 0013 (input, written by NRD-74).

## Tasks

- [ ] 1.1 [NRD-106 app] Extract the scope table from ADR 0013 and write the verified coverage table of existing guards (check-seo-02..15, NRD-18, NRD-50, NRD-19) in a dated section of `docs/seo-audit/technical-follow-up.md`; tests: unit suite green.
- [ ] 1.2 [NRD-107 app] Run the per-item checks for every scoped item, write the gaps table ordered against the page-change stories, and comment it on NRD-75 for the PO to file; tests: unit suite green.
