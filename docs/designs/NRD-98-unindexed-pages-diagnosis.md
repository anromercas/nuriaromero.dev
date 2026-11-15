# NRD-98 - Diagnose why /tienda-online-sevilla/ and /inteligencia-artificial/ are not in Google's index

## Why

[NRD-98](https://nuriaromerodev.atlassian.net/browse/NRD-98) (SEO, epic NRD-4; found by NRD-22). URL Inspection on 2026-11-15 (`docs/seo-audit/inventory-2026-11.md`, coverage table and "Recomendaciones para la fase 3", item 1): `/tienda-online-sevilla/` is `Discovered - currently not indexed` (6 inbound `<main>` links, 2,094 words) and `/inteligencia-artificial/` is `URL is unknown to Google` (in the sitemap, HTTP 200, first commit 2026-09-19). Both are in-focus M3 pages. A page Google has not indexed cannot rank or be measured, so NRD-74 (owner map) and phase 5 rewrites need the confirmed indexation state first. Relates to NRD-74 and NRD-22.

What the code says today (read on `develop` at `5abc00f`; hypotheses to verify, not conclusions):

- Both pages are a `ServicePageData` rendered by `ServiceLayout` (`src/pages/inteligencia-artificial.astro:5`, `src/pages/tienda-online-sevilla.astro`), so the main content is static HTML from the build (ADR 0001), not client-rendered.
- `noindex` is opt-in (`src/components/seo/SEO.astro:19,28`); neither page passes it.
- robots: `astro-robots-txt` with `allow: '/'` for `*` and AI crawlers (`astro.config.mjs`, `robotsTxt({...})`).
- Sitemap: `@astrojs/sitemap`, `lastmod` only for blog posts (`astro.config.mjs`, `serialize`), so the two service pages have no `lastmod` by design (invariant "Sitemap ... lastmod").
- `public/_redirects` keeps `/servicios/inteligencia-artificial -> /inteligencia-artificial/ 301`; there is no `/servicios/tienda-online-sevilla` row (the page may never have lived under `/servicios/`; to check in git history).
- The inventory notes Search Console reports the sitemap index as submitted on 2026-11-14. If that was the first submission, discovery of `/inteligencia-artificial/` may simply lag; the diagnosis must read the sitemap submission history, not assume it.

## What changes

- `docs/seo-audit/technical-follow-up.md`: a dated section `## Indexación de páginas en foco (<YYYY-MM-DD>, NRD-98)` with, per page, the evidence list of the acceptance criteria, a one-line check per support URL, a "Causas en el sitio (bugs a crear)" table and a "Acciones en Search Console para la propietaria" checklist.
- `docs/seo-audit/README.md`: the "Technical and measurement follow-up" row's evidence status updated with the date.
- Tracker: a comment on NRD-74 linking the section and summarising the confirmed state. Bugs found are filed by the PO from the table (the developer agent has no issue-creation tool).

## Out of scope

- Any code, copy, URL, link, sitemap, robots or redirect change (each cause becomes a bug).
- Search Console writes: Request indexing and sitemap resubmission are the owner's; agents use only the read-only service account.
- Deciding whether the three non-indexed posts are kept, extended or merged (NRD-74).
- Parked pages (`/seo-para-clinicas-capilares-sevilla/`, niche pages): not diagnosed.

## Requirements and scenarios

### Requirement: per-page evidence for the two in-focus pages

For `/tienda-online-sevilla/` and `/inteligencia-artificial/` the dated section SHALL record, each with source and capture date:

1. URL Inspection state: coverage, indexing state, last crawl, crawled-as, Google-selected vs user-declared canonical, sitemaps that reference it, referring URLs when returned (`~/.config/claude-seo/run.sh gsc_inspect`, read-only service account).
2. robots: `https://nuriaromero.dev/robots.txt` rules that apply to the path; `X-Robots-Tag` header; `<meta name="robots">` in the production HTML.
3. Canonical: the `<link rel="canonical">` on production equals `https://nuriaromero.dev/<slug>/` (self, trailing slash).
4. Sitemap: the URL is present in the production `sitemap-0.xml` (via `sitemap-index.xml`), with its `lastmod` or "sin lastmod (por diseño: solo posts del blog)"; Search Console sitemap status (`gsc` sitemaps read if the CLI offers it, else "N/D").
5. HTTP: status and redirect chain on production for `/<slug>/`, `/<slug>` (no slash) and, for IA, `/servicios/inteligencia-artificial` (`curl -sSIL`), with final URL and hop count.
6. Internal links from crawlable `<main>` content: count and source URLs, measured on a fresh `pnpm build` (`parsePage` from `scripts/lib/seo-inventory.mjs`, the same rule as the inventory).
7. Render without client JS: the production HTML from `curl` contains the H1 and the first paragraph of the main content.

#### Scenario: signal is healthy

- WHEN robots allows the path, there is no `noindex`, the canonical is self with trailing slash, the URL is in the sitemap and returns 200 with no redirect, and the main content is in the HTML
- THEN the section says "sin causa en el sitio" for that page and lists the owner-side actions

#### Scenario: a site-side cause is found

- WHEN any of the seven checks fails (for example, a non-trailing-slash link that redirects, a canonical mismatch, or the URL missing from the sitemap)
- THEN the section records it with `path:line` evidence in the repository and a proposed `check-seo-*` guard when it can be automated, as one row of "Causas en el sitio (bugs a crear)"

#### Scenario: Search Console access unavailable

- WHEN `gsc_inspect` fails (no service account or quota)
- THEN item 1 reads "N/D: <error>" with the date, the other six checks still run, and the story comment names the missing access; no state is inferred

### Requirement: one-line checks for support URLs

`/blog/`, `/recursos/`, `/portfolio/`, `/blog/como-aparecer-en-google-maps-negocio-sevilla/`, `/blog/cuanto-cuesta-una-pagina-web-en-sevilla/` and `/blog/pagina-web-para-restaurantes-que-necesita/` SHALL each get one table row: URL Inspection state (date), robots/meta robots, canonical OK, in sitemap (with `lastmod` for posts), inbound `<main>` links count. No keep/extend/merge verdict.

### Requirement: owner checklist, no agent writes to Search Console

The section SHALL end with a short checklist for the owner: Request indexing for each in-focus page with no site-side cause, sitemap resubmission if the sitemap history shows it was never or not recently processed, and the order to do them in. Agents never log in to Search Console with write access.

### Requirement: bugs are filed, not fixed

Each site-side cause SHALL appear in "Causas en el sitio (bugs a crear)" with: title proposal, URL, evidence (`path:line` and production observation), proposed fix in one line, proposed guard (`check-seo-*` file and rule) or "no automatizable". The developer comments the table on the story; the PO files one bug per row (layer label `app`, `seo`).

#### Scenario: no site-side cause

- WHEN all checks pass for both pages
- THEN the table reads "Ninguna causa en el sitio encontrada (<fecha>)" and no bug is requested

### Requirement: result linked from NRD-74

When the section is committed, the developer SHALL comment on NRD-74 with the section heading, the confirmed state per page, and the list of bug proposals.

### Requirement: docs only

The diff SHALL touch only `docs/seo-audit/technical-follow-up.md`, `docs/seo-audit/README.md` and this design's task list. `node --test tests/*.test.js` stays green. Raw GSC and curl outputs are not committed.

## Files (layer `app`)

| Action | Path                                                                                                  | Notes                                                                                |
| ------ | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| modify | `docs/seo-audit/technical-follow-up.md`                                                               | new dated section at the end; existing sections untouched (audit trail)              |
| modify | `docs/seo-audit/README.md`                                                                            | "Technical and measurement follow-up" row: evidence status with the NRD-98 date      |
| read   | `scripts/lib/seo-inventory.mjs`                                                                       | `parsePage` for inbound sources (run ad hoc with `node -e`, no new script committed) |
| read   | `astro.config.mjs`, `src/components/seo/SEO.astro`, `public/_redirects`, `src/data/internal-links.ts` | `path:line` evidence                                                                 |

Section outline: Método y fecha; `/tienda-online-sevilla/` (7 checks); `/inteligencia-artificial/` (7 checks); URLs de soporte (one table); Causas en el sitio (bugs a crear); Acciones en Search Console para la propietaria; Huecos.

## Interfaces

None. Commands used (read-only): `~/.config/claude-seo/run.sh gsc_inspect <url>` (never read or print its config or key), `curl -sSIL https://nuriaromero.dev/<path>`, `curl -sS https://nuriaromero.dev/<path>`, `pnpm build`, `node -e` with `parsePage`.

## Data

None.

## Test plan (TDD order)

No behaviour change, so no new test. Each subtask ends with `node --test tests/*.test.js` green and a self-check that every evidence line has a source and a date and every cause has `path:line`.

## Real-browser / e2e checks

None (docs path, `qaExemptPaths`). The PR reviewer re-runs `curl -sSIL` on the two URLs and compares one URL Inspection field with the record.

## Risks

- **Production vs develop.** Production is built from `main`; checks 2-5 and 7 read production, check 6 reads a `develop` build. A difference between the two is itself a finding (record both).
- **Google-side causes.** `Discovered - currently not indexed` and `URL is unknown` are often crawl-budget or discovery lag on a low-authority domain. The record must say "sin causa en el sitio" when that is what the evidence shows, not invent one.
- **Developer cannot create issues.** The PO files bugs from the table; the comment makes that explicit.

## ADRs

0001 (static output), 0004 (SEO head), 0005 (sitemap, robots, checks).

## Tasks

- [x] 1.1 [NRD-101 app] Run the seven checks for `/tienda-online-sevilla/` and `/inteligencia-artificial/` and write the dated section in `docs/seo-audit/technical-follow-up.md` with sources, dates and `path:line` evidence; tests: unit suite green.
- [ ] 1.2 [NRD-102 app] One-line checks for the six support URLs, "Causas en el sitio (bugs a crear)" table, owner Search Console checklist, README row, and comments on NRD-98 (bug table) and NRD-74 (confirmed state); tests: unit suite green.
