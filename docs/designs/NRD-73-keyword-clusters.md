# NRD-73 - Keyword research per service: real Seville queries clustered so one cluster = one page

## Why

[NRD-73](https://nuriaromerodev.atlassian.net/browse/NRD-73) (SEO method phase 2, epic NRD-4). Blocked by [NRD-22](https://nuriaromerodev.atlassian.net/browse/NRD-22) (phase 1 inventory: its GSC page-query rows and cannibalization list are an input); blocks [NRD-74](https://nuriaromerodev.atlassian.net/browse/NRD-74) (phase 3 architecture). The service pages were written around assumed head terms; without a per-service map of real Seville queries grouped by SERP intent, the site cannot decide which page owns which search.

Existing inputs (verified; all but the last are untracked or gitignored and exist only in the main checkout, read them there and never copy them into the branch):

- `.claude/state/seo/2026-11-13.md`: Labs keyword overview (Spain, Google Ads data 2026-09/11), keyword gap vs `gfpublicidad.es`, `posicionatuwebsevilla.com`, `pluxdigital.com`, SERP features and winning page types for the six seeds at Seville.
- `.claude/state/seo/2026-11-14.md`, `2026-11-15.md` (repeated signals; new `diseño web sevilla` competitors; `posicionamiento en ia` national SERP), `latest.md`.
- `seo/ranks/history.jsonl`: 12 tracked keywords at Seville (mobile), capture 2026-11-13, with top 3 domains and local pack.
- `docs/seo-audit/keywords/*.csv` (gitignored): competitor and home keyword exports.
- `docs/seo-audit/inventory-2026-11.md` (NRD-22, tracked once merged): GSC queries per page and cannibalization.
- `src/data/seo-intents.ts` (`keywordOwners`, `intentMatrix`), ADR 0012: one owner page per head term.

## What changes

One tracked document, `docs/seo-audit/keyword-clusters-2026-11.md`: per service, candidate queries with volume, difficulty, intent read from the live Seville SERP, and ranking competitors; queries grouped into clusters (one cluster = one page); each cluster with a proposed owner (existing URL, blog post, or "new page needed"); conflicts with the home and `/seo-local-sevilla/` ownership flagged; a DataForSEO call ledger. No code.

## Out of scope

- Any page, copy, URL, link, `seo-intents.ts` or `keywordOwners` change (owner proposals are inputs for NRD-74; moving a term is a PO decision there).
- Parked niche pages and `/seo-para-clinicas-capilares-sevilla/`.
- New rank tracking; committing raw DataForSEO responses.
- Deciding the GEO page (D1-D4 in PRD section 12 stay with the user); this study only records demand and a proposed owner.

## Requirements and scenarios

### Requirement: reuse before querying

The doc SHALL start with a "Fuentes reutilizadas" table: every figure taken from the inputs above keeps its source file and data date. A query already measured (volume from Labs 2026-11-13, SERP from 2026-11-13/15 or the rank capture) MUST NOT be re-queried.

#### Scenario: seed already measured

- WHEN `diseño web sevilla` has a Labs volume (2026-11-13) and a Seville SERP (2026-11-15)
- THEN both are cited with source and date and no new call is spent on it

### Requirement: gap-only DataForSEO calls within budget

New calls SHALL cover only services or intents with no data, at Seville location for SERPs and Spain for volume, with at most 30 calls in total for the story (`seo.dataforseo.maxCallsPerRun`). Suggested endpoints: `dataforseo_labs/google/keyword_ideas` or `keyword_suggestions` (Spain, `es`) for candidates, `dataforseo_labs/google/keyword_overview` or `bulk_keyword_difficulty` for volume and difficulty, `serp/google/organic/live/advanced` (Seville, `es`, mobile) for intent. The doc ends with a ledger: endpoint, parameters, date, count, total.

#### Scenario: budget planned before calling

- WHEN task 1.1 ends
- THEN the doc holds a call plan per service group that sums to 30 or less (indicative: up to 6 candidate calls, up to 3 volume/difficulty calls, the rest SERP reads for cluster heads with no observed SERP)

#### Scenario: budget exhausted

- WHEN the 30 calls are used before every cluster head has a SERP
- THEN the remaining clusters carry "intent: inferred from query wording, SERP not read" and are listed as gaps; no extra call is made

#### Scenario: no DataForSEO access

- WHEN the developer cannot reach DataForSEO
- THEN the study proceeds with reused data only, every unmeasured volume reads "gap", and the story comment says so; volumes are never estimated

### Requirement: per-service query table

For each in-focus service (diseño web, tienda online, SEO local, software a medida, IA / automatizaciones, GEO) the doc SHALL list candidate queries (Spanish, verbatim) with monthly volume (Spain, source, data date), difficulty when available, intent (informational | commercial | transactional | local) read from the Seville SERP (page types ranking, local pack yes/no, AI Overview yes/no) and the competitors that rank.

#### Scenario: volume unavailable

- WHEN Labs returns no volume for a query
- THEN the cell reads "gap" (not 0) and the query may still be clustered by SERP

### Requirement: clusters with one owner each

Queries SHALL be grouped into clusters whose members share the same SERP intent (same page types in the top results), so one page can satisfy the cluster. Each cluster names a proposed owner: an existing URL (trailing-slash form), a blog post (existing or proposed slug), or "new page needed". Clusters touching `keywordOwners` terms keep the registered owner or are flagged as a proposed move for NRD-74.

#### Scenario: competes with the home

- WHEN a cluster contains "consultor seo sevilla" variants or would be owned by a page other than `/`
- THEN it is flagged "conflicto de propiedad: home" with the evidence

#### Scenario: competes with `/seo-local-sevilla/`

- WHEN a cluster overlaps "seo local sevilla", "agencia seo sevilla" or "posicionamiento web sevilla"
- THEN it is flagged "conflicto de propiedad: /seo-local-sevilla/" unless that page is the proposed owner

#### Scenario: national SERP for a Seville service

- WHEN the Seville SERP for a cluster head shows no local result (for example `posicionamiento en ia`, 2026-11-15)
- THEN the cluster records "SERP nacional" and lists the decision "target national demand or a Seville variant" as an open question for NRD-74, without deciding it

### Requirement: facts separated from inferences

Each section SHALL mark observed data ("Dato observado") apart from inferences ("Inferencia"); no invented volume, difficulty or ranking; gaps are written as gaps. Analysis in English; queries in Spanish verbatim.

### Requirement: no site change

The diff SHALL touch only `docs/`. `node --test tests/*.test.js` stays green.

## Files (layer `app`)

| Action | Path                                         | Notes                           |
| ------ | -------------------------------------------- | ------------------------------- |
| create | `docs/seo-audit/keyword-clusters-2026-11.md` | the deliverable                 |
| modify | `docs/seo-audit/README.md`                   | one index row linking the study |

Document outline: Fuentes reutilizadas; Plan de llamadas; one section per service (query table, then clusters with owner and flags); Mapa cluster -> propietario (all services, one table); Conflictos de propiedad; Preguntas abiertas para NRD-74; Huecos; Registro de llamadas DataForSEO.

## Interfaces

None (documentation only).

## Data

None.

## Test plan (TDD order)

No behaviour change, so no new test (invariant TDD applies to behaviour). Each task ends with `node --test tests/*.test.js` green and a self-check that every volume has a source and date, every cluster has one owner, and the call ledger sums to 30 or less.

## Real-browser / e2e checks

None. QA (docs path, `qaExemptPaths`) is not required; the PR reviewer spot-checks three figures against their cited source and the call total.

## Risks

- **Size (5 points, six services).** The work is split by service group so the first group (SEO local + GEO + diseño web, where most data is already reused) lands even if the second slips; if refinement or the first group shows six services do not fit, the PO splits the second group into its own story (AC fallback).
- **NRD-22 dependency.** The cannibalization and GSC queries per page come from the inventory; if NRD-22 is not merged when this starts, read its branch doc and note the date.
- **Call budget.** 30 calls for six services is tight for SERP reads; reuse first and record unread SERPs as gaps.
- **Agent tools.** DataForSEO is available to agents per `seo.dataforseo`; ChatGPT/Perplexity are not needed here.

## ADRs

0012 (keyword ownership registry).

## Tasks

- [x] 1.1 [NRD-90 app] Collect every reused figure per service with source and date, list the gaps and write the call plan (30 calls or less) in `docs/seo-audit/keyword-clusters-2026-11.md`; tests: unit suite green.
- [x] 1.2 [NRD-91 app] Group A (SEO local, GEO, diseño web): gap calls, Seville SERP intent reads, query tables and clusters with owners and ownership flags; tests: unit suite green.
- [x] 1.3 [NRD-92 app] Group B (tienda online, software a medida, IA / automatizaciones): same as 1.2; tests: unit suite green.
- [x] 1.4 [NRD-93 app] Cross-service cluster-owner map, ownership conflicts, open questions for NRD-74, gaps, call ledger and README index row; tests: unit suite green.
