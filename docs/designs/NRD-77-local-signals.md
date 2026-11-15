# NRD-77 - Local signals: align Google Business Profile, NAP citations and review cadence with the owner pages

## Why

[NRD-77](https://nuriaromerodev.atlassian.net/browse/NRD-77) (SEO method phase 6 of 8, epic NRD-2 / M1). The local pack for "seo local sevilla" and "agencia seo sevilla" depends on Google Business Profile relevance, distance and prominence. Open questions from the SEO runs are still unanswered: today's review count, the primary category and service area (registered address in La Rinconada), and whether the GBP services and website links point to the pages that own each cluster after phase 3. Blocked by NRD-74 (ADR `docs/adr/0013-seo-site-architecture.md`); blocks NRD-72.

Reused, not redone: GBP verified with public address (`src/data/local-trust.ts:22-36`, place id `ChIJ8Uv-vM9f0CoR8J75dj4I0HM`, `serviceArea: "Sevilla y área metropolitana"`); NAP from `src/data/site.ts` (`SITE.name`, `SITE.phone`, `SITE.address`) rendered by the footer and `localBusinessSchema()` (`src/lib/schema.ts:15`), guarded by `tests/nap-consistency.test.js` and `scripts/check-seo-10.mjs`; real Google reviews on the home (NRD-16); review link and template `docs/google-review-request-template.md` (NRD-32, synced by `tests/review-template-sync.test.js`); local-pack competitor review counts in `.claude/state/seo/2026-11-13.md`, `2026-11-14.md`, `2026-11-15.md`.

### Who can observe what

- **GBP facts (categories, review count and average, website link, hours, address)** can be read from public data: DataForSEO Business Data (Google My Business info by place id or name) and the Seville local-pack items of the live SERP. Only `team-harness:seo-strategist` has those tools; the developer agent does not (the NRD-73 lesson, see `docs/designs/NRD-97-dataforseo-gap-calls.md`).
- **Citations (directory listings with our NAP)** need web page reads; the strategist has WebSearch/WebFetch, the developer does not.
- **Owner-only fields** (GBP services list, appointment link, service-area configuration, secondary categories when not public) are visible only in the owner's GBP dashboard. Agents never log in to GBP. These are recorded as "sin dato público; lo confirma la propietaria" and go to the owner checklist.

So, like NRD-97, this story has a **Step 0 data run** by the seo-strategist before `dev NRD-77`, then developer subtasks that record and map it.

## What changes

- New `docs/seo-audit/local-signals-2026-11.md` (tracked): dated GBP record vs the top 3 local-pack competitors for the two head terms; NAP consistency table; GBP services and links mapped to ADR 0013 owner pages; owner change checklist; monthly review routine; site-side gaps table.
- `docs/seo-audit/README.md`: one index row.
- Untracked (never committed): `.claude/state/seo/<YYYY-MM-DD>-NRD-77-local.md` and `.claude/state/seo/raw/<YYYY-MM-DD>-NRD-77/`, written by the strategist in Step 0.
- Tracker: a comment on NRD-77 with the site-side gaps for the PO to file (the developer agent cannot create issues).

## Out of scope

- Any GBP change (the owner applies them); any login to GBP or Search Console.
- Code, schema, footer or link changes (each site-side gap becomes a bug or story).
- Incentivised, fake, filtered or gated reviews; contacting clients (the owner does it).
- Backlink or outreach work (NRD-72).

## Step 0 brief (for the orchestrator to pass verbatim to `team-harness:seo-strategist`)

> Story NRD-77 (story-scoped data run, not the daily report). Do not write or overwrite `<reportDir>/<today>.md`, `latest.md` or `notified.json`; no PO candidates. Hard cap: 10 DataForSEO calls, retries included; reuse the daily reports in `.claude/state/seo/` dated 2026-11-13 or later first (local packs of `seo local sevilla` and `agencia seo sevilla`).
> (1) Our profile, place id `ChIJ8Uv-vM9f0CoR8J75dj4I0HM` ("Nuria Romero"): primary and additional categories, rating and review count, address, phone, website URL, appointment/booking URL if exposed, hours, attributes, as returned by DataForSEO Business Data (Google My Business info). (2) The same fields for the top 3 local-pack businesses of `seo local sevilla` and of `agencia seo sevilla` at `Seville,Andalusia,Spain` (one fresh SERP each only if the latest daily report is older than 3 days). (3) Citations: search for our exact name and phone (`"Nuria Romero" "611 812 431"`) and our domain on public directories and profiles (including any directory listed in `docs/seo-audit/authority-backlink-register.md` and the referring domains of the 2026-11-14 backlink baseline that look like directories); for each listing found, record the URL and the exact name, address and phone as shown, and the date read (max 15 page reads).
> Write `.claude/state/seo/<YYYY-MM-DD>-NRD-77-local.md` with: a call ledger (endpoint, parameters, timestamp, cost when returned, status); section A (our profile fields, each with source and date, or "sin dato público"); section B (competitor table); section C (citations table: URL, name, address, phone as shown, date). Raw responses as JSON in `.claude/state/seo/raw/<YYYY-MM-DD>-NRD-77/`. Never estimate or infer a field. If the DataForSEO tools are unavailable, still do (3) with web tools and say so in the header.

## Requirements and scenarios

### Requirement: dated GBP record compared with the local pack

`local-signals-2026-11.md` SHALL record, with source and observation date: primary and secondary categories, service area, services list, website link, appointment link, review count and average for our profile, and the same public fields for the top 3 local-pack competitors of "seo local sevilla" and "agencia seo sevilla" (sources: the Step 0 file and the cited daily reports). Fields not publicly observable read "sin dato público; lo confirma la propietaria".

#### Scenario: competitor data reused

- WHEN the 2026-11-14 report lists Starenlared (77 reviews) in the "agencia seo sevilla" pack and Step 0 did not re-read it
- THEN the row cites `.claude/state/seo/2026-11-14.md` and its date, not a new figure

#### Scenario: Step 0 missing

- WHEN subtask 1.1 starts and no `.claude/state/seo/<date>-NRD-77-local.md` exists
- THEN the developer stops before writing, comments that Step 0 has not run (design section "Step 0 brief"), and nothing is invented; if the orchestrator confirms the strategist cannot run, the story gets `needs-human` naming the missing access

### Requirement: NAP consistency across existing citations

A table SHALL compare the exact name, address and phone of: GBP (Step 0), the site footer and `LocalBusiness` JSON-LD (read from `src/data/site.ts` via the built `dist/index.html`, citing `path:line`), and every citation found in Step 0 section C. Each mismatch lists its URL, the field and both values.

#### Scenario: directory shows an old phone

- WHEN a directory listing shows a phone that differs from `SITE.phone`
- THEN the row is marked "discrepancia" with the URL, and the owner checklist gets "corregir en <directorio>"

### Requirement: GBP services and links mapped to ADR 0013 owners

For each service in the owner map of ADR 0013, the doc SHALL state the GBP service entry and the link it should point to (the owner URL, trailing slash), and the GBP website link and appointment link targets (`bookingUrl` from `src/data/site.ts:54` for appointments). Every proposed GBP change goes into "Cambios en la ficha para la propietaria" (checkbox list); agents never apply them.

#### Scenario: ADR proposal pending the user

- WHEN ADR 0013 lists `/seo-para-ia/` under "Propuestas pendientes de la usuaria"
- THEN its GBP service link is "pendiente de la decisión de la usuaria" and no link to a non-existent URL is proposed

### Requirement: monthly review routine without gating

The doc SHALL define a simple monthly routine for review requests reusing `docs/google-review-request-template.md` (same link, `localTrust.gbp.writeReviewUrl`): when to ask (after delivery, once per client), who asks (the owner), how to log it (date, client initial, sent yes/no; no personal data in the repo), and a monthly check of the review count. It SHALL follow the template's rule of asking **every** client with a delivered project, not only satisfied ones: selective asking is review gating under Google's policy and contradicts PRD "Real proof only". No incentives, no fake reviews, no filtering.

### Requirement: site-side gaps become work

Gaps on the site (schema, footer NAP, links, missing `sameAs` to the GBP, `areaServed` wording vs GBP service area) SHALL each be one row of "Huecos en el sitio (bugs o historias a crear)" with `path:line` evidence and a proposed test or `check-seo-*` guard. The developer comments the table on NRD-77; the PO files them. GBP-side changes stay in the owner checklist.

### Requirement: docs only

The diff SHALL touch only `docs/seo-audit/local-signals-2026-11.md`, `docs/seo-audit/README.md` and this design's task list. `node --test tests/*.test.js` stays green. No personal data of clients is written.

## Files (layer `app`)

| Action | Path                                                                                                                                                                                  | Notes                                            |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| create | `docs/seo-audit/local-signals-2026-11.md`                                                                                                                                             | the deliverable                                  |
| modify | `docs/seo-audit/README.md`                                                                                                                                                            | index row                                        |
| read   | `.claude/state/seo/<date>-NRD-77-local.md`                                                                                                                                            | main checkout only; never copied into the branch |
| read   | `src/data/site.ts`, `src/data/local-trust.ts`, `src/lib/schema.ts`, `src/components/Footer.astro`, `docs/adr/0013-seo-site-architecture.md`, `docs/google-review-request-template.md` | evidence                                         |

Document outline: Fuentes y fechas; Ficha de Google Business Profile (nuestra vs top 3 por término); Consistencia NAP; Servicios y enlaces de la ficha -> páginas propietarias (ADR 0013); Cambios en la ficha para la propietaria; Rutina mensual de reseñas; Huecos en el sitio (bugs o historias a crear); Huecos de datos.

## Interfaces

None. The Step 0 file format is fixed by the brief (ledger, sections A, B, C).

## Data

None in the site.

## Test plan (TDD order)

No behaviour change, so no new test. Each subtask ends with `node --test tests/*.test.js` green and a self-check: every observed field has a source and date; every mismatch has a URL; every owner page in ADR 0013 has a GBP mapping line or "pendiente".

## Real-browser / e2e checks

None (docs path, `qaExemptPaths`). The PR reviewer opens two citation URLs and compares one GBP field with the raw JSON.

## Risks

- **Step 0 not run.** Same mitigation as NRD-97: subtask 1.1 gates on the file.
- **Owner-only GBP fields.** Services list and appointment link may not be public; they become owner checklist items, not invented values.
- **AC wording "satisfied clients".** Asking only satisfied clients would be review gating; the design follows the NRD-32 template (every client). Flagged to the PO in the tracker summary.
- **Developer cannot create issues.** The PO files the site-side gaps.

## ADRs

0003 (data in `src/data`), 0004 (JSON-LD), 0013 (input, written by NRD-74).

## Tasks

- [x] 1.1 [NRD-108 app] Gate on the Step 0 file; write the dated GBP record vs the top 3 local-pack competitors and the NAP consistency table in `docs/seo-audit/local-signals-2026-11.md`, plus the README row; tests: unit suite green.
- [ ] 1.2 [NRD-109 app] Map GBP services and links to the ADR 0013 owner pages, write the owner change checklist, the monthly review routine (no gating) and the site-side gaps table, and comment the gaps on NRD-77 for the PO; tests: unit suite green.
