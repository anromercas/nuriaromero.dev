# NRD-18 - Core Web Vitals and LCP baseline for in-focus pages

## Why

[NRD-18](https://nuriaromerodev.atlassian.net/browse/NRD-18) (M1, epic NRD-2). The site is built for Core Web Vitals as a design goal (PRD principle 6), but LCP/INP/CLS were never measured: `docs/seo-audit/full-audit-2026-09-21/tasks/04-validar-cwv-y-lcp.md` records only a local HTTP-200 baseline because Lighthouse/PSI were not available. The baseline must be taken on production before the header CTA ([NRD-15](https://nuriaromerodev.atlassian.net/browse/NRD-15)) is promoted, so its effect can be compared; NRD-18 now `Blocks` NRD-15.

## What changes

- A dated measurement section in `docs/seo-audit/full-audit-2026-09-21/tasks/04-validar-cwv-y-lcp.md` (lab + field, 7 URLs).
- Follow-up NRD issues for every page/metric outside Google "good" thresholds, linked from the same doc.
- No product code changes.

## Out of scope

- Any optimisation (`fetchpriority`, preload, image changes, font changes): each goes to its own follow-up story with evidence.
- Niche and parked pages (PRD section 5).
- INP lab proxy beyond TBT; real-user monitoring (needs GA4/web-vitals: NRD-17 and a new dependency, radical).
- Committing Lighthouse reports to the repo (attached to the story instead).

## Requirements and scenarios

### Requirement: lab measurement of production

Each in-focus production URL SHALL be measured with Lighthouse (Chrome DevTools, mobile form factor, default simulated throttling, navigation mode, clean profile), recording LCP, CLS, TBT, Performance score and the LCP element.

URLs: `https://nuriaromero.dev/`, `/seo-local-sevilla/`, `/diseno-web-sevilla/`, `/tienda-online-sevilla/`, `/desarrollo-software-medida/`, `/automatizaciones/`, `/inteligencia-artificial/`.

#### Scenario: page measured

- WHEN Lighthouse runs 3 times on a URL
- THEN the median LCP, CLS, TBT, score and the LCP element are recorded for that URL

### Requirement: field data when available

For each URL the PageSpeed Insights CrUX field data (p75 LCP, INP, CLS) SHALL be recorded, URL-level first, origin-level as fallback, otherwise the literal "no field data".

#### Scenario: no CrUX data

- WHEN PSI shows no field data for the URL or origin
- THEN the row says "no field data" and no number is invented

### Requirement: reproducible record

The record MUST include date, tool and version, device profile, throttling and the production commit when known.

#### Scenario: recorded

- WHEN the measurements are done
- THEN `04-validar-cwv-y-lcp.md` has a dated table with all 7 URLs and the conditions, and its acceptance checklist is updated

### Requirement: follow-ups, no fixes

Each page outside the thresholds (LCP <= 2.5 s, CLS <= 0.1, INP <= 200 ms; TBT <= 200 ms as lab proxy) SHALL get a follow-up story or bug with the measured cause; this story MUST NOT change code.

#### Scenario: page fails LCP

- WHEN a URL's median lab LCP is above 2.5 s
- THEN an NRD issue exists with the URL, value, LCP element and the Lighthouse opportunity that explains it, and its key is in the doc

#### Scenario: all pass

- WHEN every URL is within thresholds
- THEN the doc says so explicitly and no issue is created

## Files

Layer `app` (only layer in the harness; `docs/**` is outside its globs and in `repo.qaExemptPaths`).

| Action | Path                                                                                                                                                                                                      |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| modify | `docs/seo-audit/full-audit-2026-09-21/tasks/04-validar-cwv-y-lcp.md` (append "Medición 2026-11-..." section in Spanish, like the file; keep older sections as history; update "Estado" and the checklist) |

## Interfaces

None. Table columns: URL | fecha | herramienta y versión | dispositivo / throttling | LCP | CLS | TBT | score | elemento LCP | campo LCP / INP / CLS (p75) o "sin datos de campo" | veredicto.

## Data

None.

## Test plan (TDD order)

No behaviour change, so no `tests/*.test.js` case (DoD TDD item not applicable; state it in the PR). Verification is the recorded data:

1. Before measuring, confirm production is what `main` holds (compare a visible string such as the home `<title>` with `src/pages/index.astro`); note the commit.
2. Measure, record, attach reports.

## Real-browser / e2e checks

- Lighthouse runs themselves are the real-browser check (Chrome DevTools MCP, `qa.browser: devtools-mcp`).
- QA spot-checks one URL's numbers against the attached report.

## Risks

- Lab variance: medians of 3 runs, same machine, no other load; record the Chrome version.
- PSI rate limits or no CrUX data for a low-traffic origin: "no field data" is a valid outcome.
- Measuring after NRD-15 reaches production would contaminate the baseline: hence the `Blocks` link.

## ADRs

0001 (static site on Netlify), 0005 (SEO checks), 0009 (production from `main`).

## UI spec

No user-facing UI change. This story only measures production and writes to `docs/` (outside the `app` layer globs); no file under `src/**`, `public/**` or `tailwind.config.mjs` changes, so the checklist items (screens, hierarchy, states, copy, design system, responsive, interactions, accessibility) are n/a.

What must stay visually unchanged, so the baseline measures the current site:

- All 7 in-focus pages exactly as `main` serves them in production: layout, header (without the NRD-15 CTA), hero, images, fonts and styles.
- No markup, asset, font or style tweak made "while measuring": any optimisation found becomes a follow-up issue (Requirement: follow-ups, no fixes).
- `ux-review` and `a11y-responsive` have nothing to check: an empty diff under their paths is the expected result.

## Tasks

- [x] 1.1 [NRD-36 app] Measure lab and field CWV for the 7 production URLs and record them in audit task 04; tests: none (measurement only), record conditions and attach reports.
- [x] 1.2 [NRD-37 app] File follow-up bugs/stories for pages outside the thresholds and link them from audit task 04; tests: none.
