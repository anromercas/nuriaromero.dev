# NRD-74 - Site architecture decision (ADR): one owner page per keyword cluster, verdict rework vs adjust

## Why

[NRD-74](https://nuriaromerodev.atlassian.net/browse/NRD-74) (SEO method phase 3 of 8, epic NRD-4). The user's first SEO priority is keyword targeting of the service pages, and reworking the structure if it is wrong, before any page rewrite (phase 5, NRD-76) or link building (phase 7, NRD-72). Blocked by NRD-73 (done). Blocks NRD-75 (P4), NRD-77 (P6) and NRD-24 (`/seo-para-ia/`). Relates to NRD-97 (cluster data gaps) and NRD-98 (indexation diagnosis), both ranked before it in NRD Sprint 4.

Inputs (all tracked on `develop` once their stories merge):

- `docs/seo-audit/inventory-2026-11.md` (NRD-22): 24 URLs, title/H1/canonical/word count/inbound links, GSC coverage and top queries, cannibalization, intent mismatches, 10 recommendations.
- `docs/seo-audit/keyword-clusters-2026-11.md` (NRD-73, completed by NRD-97): 16 clusters with a proposed owner, ownership flags, 12 open questions.
- `docs/seo-audit/technical-follow-up.md`, section "Indexación de páginas en foco (..., NRD-98)": confirmed indexation state and site-side causes.
- `src/data/seo-intents.ts` (`intentMatrix`, `keywordOwners`, `serviceRoutes`, `nicheRoutes`, `reciprocalLinks`), `src/data/internal-links.ts` (`internalLinksBySource`), `src/components/Header.astro`, `src/components/Footer.astro`, `src/components/Breadcrumbs.astro` (used by `BlogPostLayout`; `ServiceLayout` renders none), `src/lib/schema.ts` (`breadcrumbSchema`), `public/_redirects`, `public/llms.txt`, ADR 0012.
- PRD sections 5 (scope), 9 (decision rights), 10 (NFR "no URL breaks without a 301"); M2 gate D1-D4 (`odd/tasks/seo-para-ia-geo-page.md`).

## What changes

One decision document, `docs/adr/0013-seo-site-architecture.md` (next free number: `develop` has 0001-0012 and no open PR adds an ADR on 2026-11-15; re-check at implementation), plus its row in `docs/adr/README.md`. Status **Proposed**: the PO sets it to **Accepted** when accepting the story; each radical proposal inside stays "Pendiente de la usuaria" until the user approves it in the PRD decision log. No code, copy, URL, redirect or data change.

## Out of scope

- Any change to `src/**`, `public/**` (including `_redirects` and `llms.txt`), tests or scripts. The ADR specifies those changes for later stories.
- Creating per-page or redirect stories (the PO does it on acceptance, in owner-map order; NRD-76 defines the per-page checklist).
- Deciding the GEO page D1-D4 (user); deciding prices on the site (pending PO decision S-2026-11-13-1); reopening parked pages.
- New keyword research or DataForSEO calls (NRD-97 owns the data).

## Requirements and scenarios

### Requirement: inputs gate and provisional clusters

The ADR SHALL open with an "Inputs" section stating the date and state of each input. If NRD-97 ended with `needs-human` or left clusters with "intent: inferred from query wording, SERP not read", those clusters SHALL be marked **provisional** wherever they appear, with the reason. If NRD-98 has not merged, indexation SHALL be taken from the NRD-22 inspection of 2026-11-15 and marked "no confirmada".

#### Scenario: NRD-97 had no DataForSEO access

- WHEN `keyword-clusters-2026-11.md` "Run status" says the NRD-97 run had no DataForSEO data
- THEN SL-3, GEO-2, GEO-3, DW-3, TO-1, TO-3 and IA-1 carry "provisional (NRD-97 sin datos)" in the owner map, and the ADR still assigns them a proposed owner

#### Scenario: NRD-97 merged or split clusters

- WHEN NRD-97 merged SL-3 into SL-1
- THEN the owner map uses the merged cluster list and cites the NRD-97 evidence

### Requirement: owner map, one owner per in-focus cluster

The ADR SHALL contain a table with every in-focus cluster: cluster id, head query, evidence (volume with source and date, SERP page type, GSC impressions/position with window), proposed owner URL (trailing slash) or "new page (proposal)", and status (decided / provisional / pending the user). Exactly one owner per cluster. Clusters of parked pages are excluded and listed as such.

#### Scenario: two clusters, one page

- WHEN SL-1 and SL-3 both propose `/seo-local-sevilla/`
- THEN both rows name it, and the page's verdict row explains how one page serves both intents (or proposes a split with evidence)

#### Scenario: cluster with no page

- WHEN a cluster's owner is "new page needed" (GEO-1, GEO-2, DW-3)
- THEN the row is a proposal with options and a recommendation, marked "Pendiente de la usuaria" (new page or new service is radical, PRD section 9)

### Requirement: verdict per existing in-focus page

For `/`, `/seo-local-sevilla/`, `/diseno-web-sevilla/`, `/tienda-online-sevilla/`, `/desarrollo-software-medida/`, `/automatizaciones/`, `/inteligencia-artificial/` and the four blog posts, the ADR SHALL give one of **keep**, **re-target**, **merge**, **split** or **create**, with the clusters owned, the evidence, and the `intentMatrix` / `keywordOwners` change it implies (rows to add, move or remove, described as data, not code). The three `Crawled - currently not indexed` posts get keep / extend / merge with the NRD-98 one-line check as evidence.

#### Scenario: page not indexed

- WHEN NRD-98 confirms `/inteligencia-artificial/` is still not indexed
- THEN its verdict is conditional on indexation ("keep; re-evaluate after indexation") and the first per-page story is not this page

### Requirement: `/seo-para-ia/` placed in the map

The ADR SHALL state the cluster(s) `/seo-para-ia/` (NRD-24/25/26) would own, confirm the URL or propose another, and resolve the overlap with `intentMatrix`'s "SEO local y GEO" row on `/seo-local-sevilla/` (open questions 1 and 2 of NRD-73), keeping D1-D4 with the user.

### Requirement: hub-and-spoke and internal links

The ADR SHALL define: which blog posts support which service page (spoke -> hub), the link rules (hub to spoke, spoke to hub, anchor policy: descriptive Spanish anchors that match the owner cluster, no exact-match repetition of another page's owned term per ADR 0012), menu changes (`Header.astro`, `Footer.astro`), breadcrumb changes (service pages have no visible breadcrumbs or `BreadcrumbList` today), and the concrete change spec for `internalLinksBySource` (source -> target, kind `contextual` | `conversion`, anchor) and for `intentMatrix` / `keywordOwners` / `reciprocalLinks`. Inventory recommendations 3, 4, 6 and 8 are answered.

#### Scenario: weak page gains links

- WHEN `/desarrollo-software-medida/` has 2 inbound `<main>` links (NRD-22)
- THEN the spec lists the sources that will link to it (for example `/diseno-web-sevilla/` for "aplicaciones web a medida") with anchors

### Requirement: URL change impact

Every proposed URL change (rename, merge, removal, new page) SHALL list its `public/_redirects` 301 row (source, target, one hop only), sitemap impact, `public/llms.txt` entry change, canonical, internal links and `keywordOwners` rows to update. A URL change without a 301 row is not allowed (invariant "No URL breaks").

#### Scenario: no URL change proposed

- WHEN the verdict is "adjust" and no URL changes
- THEN the section says "Sin cambios de URL" and the redirect table is empty

### Requirement: verdict line and decision rights

The ADR SHALL contain one line: `Veredicto: rework` or `Veredicto: adjust`, followed by the reasons (3-5 bullets with evidence). Removing, merging or renaming a public page, creating a new service or page, or reopening parked pages SHALL appear only under "Propuestas pendientes de la usuaria", each with options, a recommendation and the evidence; they are applied only after the user approves them in the PRD decision log.

### Requirement: order for phase 5

The ADR SHALL end with "Orden de optimización (fase 5)": the owner pages in the order the PO should create per-page stories, with the reason (demand, indexation, dependency), naming the existing stories that already cover a page (NRD-34 for `/tienda-online-sevilla/`, NRD-24/25/26 for `/seo-para-ia/`). After committing, the developer comments the order on NRD-74 for the PO.

### Requirement: decision document only

The diff SHALL touch only `docs/adr/0013-seo-site-architecture.md`, `docs/adr/README.md` and this design's task list. `node --test tests/*.test.js` stays green.

## Files (layer `app`)

| Action | Path                                     | Notes                                                                      |
| ------ | ---------------------------------------- | -------------------------------------------------------------------------- |
| create | `docs/adr/0013-seo-site-architecture.md` | the deliverable; template of `docs/adr/README.md` plus the sections below  |
| modify | `docs/adr/README.md`                     | index row `0013 SEO site architecture: one owner page per keyword cluster` |

ADR outline (English, queries and page copy in Spanish verbatim): Status / Date; Context; **Inputs** (state and date of each); Decision: Owner map; Page verdicts; `/seo-para-ia/`; Hub-and-spoke and internal links (with data change spec); Menu and breadcrumbs; URL changes (redirect, sitemap, `llms.txt`, canonical table); `Veredicto: rework|adjust`; Propuestas pendientes de la usuaria; Orden de optimización (fase 5); Consequences (what NRD-75, NRD-76, NRD-77 and NRD-24 must take from it); Evidence (paths).

## Interfaces

None in code. The ADR's data change spec uses the existing shapes so later stories can apply it directly: `SeoIntentRow` and `KeywordOwner` (`src/data/seo-intents.ts:1,91`), `InternalLink` (`src/data/internal-links.ts:3`), `breadcrumbSchema(items: { name: string; url: string }[])` (`src/lib/schema.ts:216`).

## Data

None changed here. The ADR specifies future changes to `src/data/seo-intents.ts`, `src/data/internal-links.ts`, `public/_redirects` (infra-owned path: those rows go to `/team-harness:infra` stories), `public/llms.txt`.

## Test plan (TDD order)

No behaviour change, so no new test. Each subtask ends with `node --test tests/*.test.js` green and self-checks: every in-focus cluster appears exactly once in the owner map; every URL change has a 301 row; every radical item is under "Propuestas pendientes de la usuaria"; the verdict line exists once.

## Real-browser / e2e checks

None (docs path). The PR reviewer and `seo-review` read the ADR against the inputs (two owner-map rows and one verdict row traced to evidence).

## Risks

- **Inputs late.** If NRD-97 or NRD-98 has not merged when this starts, the ADR uses what is on `develop` and marks the rest provisional / not confirmed (PO decision 2026-11-15: NRD-74 does not wait).
- **Scope creep into rewrites.** The ADR names changes; it never edits pages. Per-page work is NRD-76's stories.
- **Radical proposals.** New `/seo-para-ia/`, a maintenance page (DW-3) or any merge are user decisions; the ADR is accepted without them and they stay pending.
- **`public/_redirects` is infra-owned.** Redirect stories are routed to the infra engineer, not the app developer.
- **Size.** 5 points; split into three subtasks so the owner map lands first.

## ADRs

0004 (SEO head), 0005 (sitemap, robots, llms.txt, checks), 0012 (keyword ownership registry). Writes 0013.

## Tasks

- [x] 1.1 [NRD-103 app] Create `docs/adr/0013-seo-site-architecture.md` (Proposed) with Context, Inputs (provisional/unconfirmed marking), owner map for every in-focus cluster, page verdicts (incl. the four posts) and `/seo-para-ia/` placement; tests: unit suite green.
- [x] 1.2 [NRD-104 app] Hub-and-spoke rules, anchor policy, menu and breadcrumb changes, and the data change spec for `internalLinksBySource`, `intentMatrix`, `keywordOwners` and `reciprocalLinks`; tests: unit suite green.
- [x] 1.3 [NRD-105 app] URL change impact table (301, sitemap, `llms.txt`, canonical), verdict line with reasons, "Propuestas pendientes de la usuaria", phase-5 order, Consequences, README index row, and the order comment on NRD-74; tests: unit suite green.
