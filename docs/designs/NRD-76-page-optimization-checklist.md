# NRD-76 - Service page optimization process: SEO + GEO checklist per page and per-page stories from the owner map

## Why

[NRD-76](https://nuriaromerodev.atlassian.net/browse/NRD-76) (SEO method phase 5 of 8, epic NRD-4, M3). Umbrella for "optimize each service page, one by one" (PRD principle 2). Without one shared definition of "optimized page", each rewrite is judged differently, GEO signals are forgotten and prices or entity facts drift between page, `llms.txt`, schema and GBP. Blocked by NRD-75 (P4), which follows NRD-74 (ADR `docs/adr/0013-seo-site-architecture.md`); blocks NRD-78 (P8). Relates to NRD-34.

Designed now with ADR 0013 as its input: the checklist's items are fixed by the acceptance criteria and the repository's guards; the per-page part reads the ADR owner map and phase-5 order when the story starts.

## What changes

- New `docs/seo-audit/page-optimization-checklist.md` (tracked):
  1. The checklist (SEO, GEO, Delivery), each item with how it is verified (test, `check-seo-*`, review) and its source of truth in the repo.
  2. "Historias por página (borradores)": one draft per owner page in the ADR 0013 phase-5 order, with summary, user problem, acceptance criteria derived from the checklist, phase 1-2 evidence (inventory row, cluster, competitors that outrank it), size S or M, and links to existing stories.
- `docs/seo-audit/README.md`: one index row.
- Tracker, by the **PO at acceptance** (decision rights: backlog, splitting, acceptance criteria; the developer agent cannot create issues): file one story per draft in epic NRD-4 with label `seo`, rank them one page at a time, and link and re-rank NRD-34 and NRD-24/25/26 instead of duplicating them. The developer comments the drafts' order on NRD-76 to hand them over.

## Out of scope

- Rewriting any page, copy, title, schema, `llms.txt` or price (that is each per-page story).
- New checks or tests (each per-page story adds its own test, per the checklist).
- Deciding page creation, merge, rename or price changes (user, PRD section 9): drafts that need one carry "requiere aprobación de la usuaria" with the ADR proposal reference.

## Requirements and scenarios

### Requirement: checklist tied to the accepted ADR

`page-optimization-checklist.md` SHALL list, each with "cómo se verifica" and "fuente de verdad":

- **SEO:** title, H1 and meta description aligned to the owner cluster (ADR 0013 owner map; `keywordOwners` and `intentMatrix` in `src/data/seo-intents.ts`; `check-seo-07`, `tests/keyword-ownership.test.js`); content that answers the cluster's SERP intent better than the pages that outrank it, naming them with evidence (`docs/seo-audit/keyword-clusters-2026-11.md`); real proof only (`src/data/local-trust.ts` status `verified`; `check-seo-10`, `check-seo-11`); prices consistent with `src/data/services.ts` and the price tests (`tests/single-price-source.test.js`, NRD-10); one primary CTA (`bookingUrl`, `src/data/site.ts:54`); internal links per the ADR hub-and-spoke rules (`src/data/internal-links.ts`; `check-seo-06`, `check-seo-02`).
- **GEO:** self-contained, citable passages (a direct answer in the first 1-2 sentences of key sections and FAQs); entity consistency (name, NAP, services, prices identical across page, schema, `llms.txt` and GBP, with NRD-77's `local-signals-2026-11.md` as the GBP reference); `public/llms.txt` entry (`check-seo-09`); `Service`, `FAQPage`, `BreadcrumbList` JSON-LD (`src/lib/schema.ts`; `check-seo-11`).
- **Delivery:** a TDD test per page in `tests/` that fails before the change; relevant `check-seo-*` green; NRD-75 gaps for that page closed first; Spanish copy (ADR 0008); no promised rankings or AI recommendations (invariant "No promised rankings"); specialist reviews (`seo-review`, `ux-review`, `a11y-responsive`) per `review.specialists`.

#### Scenario: item without an automated guard

- WHEN an item such as "answers the SERP intent better than the pages that outrank it" has no test
- THEN its "cómo se verifica" reads "revisión `seo-review` con la evidencia de competidores citada en la historia", not a made-up check

#### Scenario: GBP reference not ready

- WHEN NRD-77 has not merged
- THEN the entity-consistency item names `src/data/site.ts` and `local-trust.ts` as the source and notes that the GBP comparison comes from NRD-77

### Requirement: per-page drafts in owner-map order

The doc SHALL contain one draft per owner page in the exact order of ADR 0013 "Orden de optimización (fase 5)". Each draft has: summary, user problem, page and owner cluster(s), acceptance criteria from the checklist (concrete for that page), evidence from phases 1-2 (inventory row, cluster table rows, competitors), NRD-75 gaps that must land first, size S or M, and, when the page change is radical, "requiere aprobación de la usuaria (ADR 0013, propuesta N)". Pages not indexed per NRD-98 carry "indexación primero" as a precondition.

#### Scenario: page already has a story

- WHEN the order reaches `/tienda-online-sevilla/` (NRD-34) or `/seo-para-ia/` (NRD-24/25/26)
- THEN the draft is "existente: NRD-34" (or NRD-24/25/26) with the checklist criteria to add to it and its new rank, not a new story

#### Scenario: first page ready for planning

- WHEN the drafts are written
- THEN the first draft meets the Definition of Ready (user problem, page named, testable criteria, size, evidence, dependencies), so the PO can file it for the next sprint planning

### Requirement: hand-over to the PO

After committing, the developer SHALL comment on NRD-76: the ordered list of drafts (page, size, existing story if any, approval needed yes/no) and the instruction that the PO files them in NRD-4 with label `seo`, ranked one page at a time, and links/re-ranks NRD-34 and NRD-24/25/26.

### Requirement: docs only

The diff SHALL touch only `docs/seo-audit/page-optimization-checklist.md`, `docs/seo-audit/README.md` and this design's task list. `node --test tests/*.test.js` stays green.

## Files (layer `app`)

| Action | Path                                                                                                                                                                                                                                                                                                  | Notes              |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| create | `docs/seo-audit/page-optimization-checklist.md`                                                                                                                                                                                                                                                       | checklist + drafts |
| modify | `docs/seo-audit/README.md`                                                                                                                                                                                                                                                                            | index row          |
| read   | `docs/adr/0013-seo-site-architecture.md`, `docs/seo-audit/inventory-2026-11.md`, `docs/seo-audit/keyword-clusters-2026-11.md`, `docs/seo-audit/technical-follow-up.md` (NRD-75 and NRD-98 sections), `docs/seo-audit/local-signals-2026-11.md` (NRD-77), `scripts/check-seo-*.mjs`, `tests/*.test.js` | evidence           |

## Interfaces

None.

## Data

None.

## Test plan (TDD order)

No behaviour change, so no new test. Each subtask ends with `node --test tests/*.test.js` green and the self-check: every checklist item names how it is verified and its source of truth; every guard named exists in `scripts/` or `tests/`; drafts follow the ADR order exactly; no draft duplicates NRD-34 or NRD-24/25/26.

## Real-browser / e2e checks

None (docs path).

## Risks

- **Story creation is a PO action.** The developer cannot create issues and backlog order is the PO's decision; the AC "per-page stories created" is completed by the PO at acceptance from the drafts. Flagged in the tracker summary.
- **Inputs from three stories.** NRD-75 gaps and NRD-77 GBP facts may land after the checklist; the checklist references their docs and the drafts list the gaps that exist on `develop` when written.
- **Overlap with NRD-34.** NRD-34 is done (Sprint 2); its draft lists only the checklist items it did not cover.

## ADRs

0008 (Spanish copy), 0012 (keyword ownership), 0013 (input, written by NRD-74).

## Tasks

- [x] 1.1 [NRD-110 app] Write the SEO, GEO and Delivery checklist in `docs/seo-audit/page-optimization-checklist.md`, each item with how it is verified and its source of truth, tied to ADR 0013, plus the README row; tests: unit suite green.
- [ ] 1.2 [NRD-111 app] Write the per-page story drafts in ADR 0013 phase-5 order (existing NRD-34 and NRD-24/25/26 placed, not duplicated; first draft meets the Definition of Ready) and comment the ordered list on NRD-76 for the PO to file; tests: unit suite green.
