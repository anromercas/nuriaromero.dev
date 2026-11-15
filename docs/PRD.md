# PRD - nuriaromero.dev

- Owner: Product Owner (team-harness), decisions above PO level by Nuria Romero
- Written: 2026-11-13 (team-harness bootstrap, brownfield)
- Tracker: Jira project `NRD` (https://nuriaromerodev.atlassian.net/browse/NRD)
- Sources: `PRODUCT.md`, `DESIGN.md`, `.agents/product-marketing-context.md`, `.claude/harness/invariants.md`, `.claude/harness/seo.md`, `docs/adr/0001-0010`, `odd/tasks/*.md`, the code under `src/`.

Artifacts (this PRD, tracker content) are in English. Every user-facing string on the site stays in Spanish (ADR 0008).

## 1. Vision

nuriaromero.dev is the storefront of a one-person studio in Seville. It should be the place where an owner of a small local business in Seville understands, in plain language and without promises, how Nuria can make them visible on Google, Google Maps and AI answers (and build or improve the website that supports it), and books a first call.

Success means qualified call bookings from Seville businesses, driven by organic visibility of the service pages, earned page by page against the agencies that rank today.

## 2. Personas

1. **Local business owner (primary).** 35-55, self-employed or 1-10 employees in Seville and its metropolitan area (hospitality, health, neighbourhood retail, professional offices). Uses WhatsApp and Instagram daily, does not know what Search Console is. Wants calls and messages, not "a pretty website". Fears being tied to an agency with hidden fees, not understanding the technical side, and paying for promises. Searches with words such as "cuánto cuesta una página web en Sevilla", "quiero que mi negocio salga en Google", "[sector] cerca de mí".
2. **Manager or decision-maker of a competitive local business (secondary).** Already has a website and maybe a Google Business Profile, competes with several local rivals and evaluates whether local SEO and GEO are worth a monthly fee (Plan Local 300 EUR/month, Plan Local Pro 500 EUR/month, taxes not included). Needs transparent scope, deliverables and a direct contact.
3. **Business looking for a specific build (tertiary).** Needs a website, online store, custom software, an automation or an AI assistant and compares closed prices (landing from 149 EUR, website up to 5 pages from 399 EUR, automation from 149 EUR, AI from 399 EUR, software from 999 EUR, e-commerce quoted).
4. **Answer engines and crawlers (system persona).** Google, Google Maps, AI Overviews, ChatGPT and Perplexity read the site; they need crawlable static pages, coherent structured data, `llms.txt` and citable answers.

## 3. Problems

- The domain has little authority (almost no useful backlinks), so on-page quality alone ranks slowly.
- Search and conversion are not yet measured end to end in production (GA4 and Search Console verification and a KPI baseline are pending).
- GEO / "SEO para IA" demand has no commercial page; the topic lives only in a blog post and secondary blocks.
- Some site facts are still duplicated by hand (home meta price, `llms.txt` prices) and the repository has no CI, so regressions reach `develop` unchecked.
- Production deploys are budgeted (about 20 a month), so every change must be batched deliberately.

## 4. Principles (ordered; earlier wins a tie)

1. **Truth over persuasion.** No invented testimonials, figures, rankings or results; no promised positions or AI recommendations (`PRODUCT.md`, invariants "No promised rankings", "Real proof only").
2. **Focus beats breadth.** Improve one in-focus page at a time until it is clearly better than the pages that outrank it; out-of-focus pages wait.
3. **Business language first.** Explain value before mechanism; no unexplained jargon; Spanish copy, close and professional, `tú`.
4. **Qualified conversations over vanity metrics.** The one primary conversion is booking a call (`bookingUrl`).
5. **Ship small, batch deploys.** Small stories, merged to `develop`; production gets them in the scheduled promotions, never one deploy per change.
6. **Static, fast and accessible.** Static Astro output, Core Web Vitals by design, WCAG 2.2 AA and mobile first.

## 5. Scope and non-goals

In focus now:

- Local SEO in Seville: the home `/` (owns "consultor SEO en Sevilla") and `/seo-local-sevilla/` (owns "SEO local Sevilla", "agencia SEO Sevilla", Google Maps).
- GEO / AI visibility: the planned `/seo-para-ia/` page and the GEO blog post.
- The other services, page by page: `/diseno-web-sevilla/`, `/tienda-online-sevilla/`, `/desarrollo-software-medida/`, `/automatizaciones/`, `/inteligencia-artificial/` and the blog posts that feed them.
- Delivery foundation: CI, repository hygiene, single source of truth for site facts.

Out of focus for now (parked, the user will reopen them):

- Niche pages `/web-para-restaurantes-sevilla/`, `/web-para-clinicas-sevilla/`, `/web-para-comercios-sevilla/`, `/web-para-abogados-gestorias-sevilla/`.
- `/seo-para-clinicas-capilares-sevilla/` (CAPILAR LOCAL) and its content cluster.

Non-goals:

- Server runtime, SSR, API routes or a CMS (ADR 0001).
- Paid infrastructure, Netlify deploy previews or extra deploys outside the schedule (ADR 0009).
- Publishing proof that is not verified (`src/data/local-trust.ts` status `verified` only).
- Outreach, sales and pricing activities that happen outside the website.

## 6. Milestones

| Milestone                                                  | Outcome                                                                                    | Exit criterion                                                                                                                                                                                                                           |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **M0 - Delivery foundation**                               | Every PR is verified automatically and the repo has one source of truth for site facts.    | `ci.yml` job `verify` runs on PRs to `develop` and on pushes and is the required check; lockfile, script and type inconsistencies fixed; prices in meta and `llms.txt` guarded by tests; no orphan theme code.                           |
| **M1 - Local SEO Seville: home and `/seo-local-sevilla/`** | The two local pages convert and are measured.                                              | Header booking CTA live; Google reviews render in production; GA4 and Search Console verified with a recorded KPI baseline; CWV baseline recorded; production SEO signals validated; backlink baseline and first outreach list recorded. |
| **M2 - GEO / AI visibility**                               | A commercial page owns "SEO para IA / GEO" without cannibalising M1 pages.                 | `/seo-para-ia/` published with tests, schema, internal links, `llms.txt` entry and its `dist/` check passing; Search Console baseline recorded.                                                                                          |
| **M3 - Other services, page by page**                      | Each other service page is improved against its real SERP competitors, one page at a time. | Each page has a competitor-backed improvement story shipped (fed by the daily SEO runs), starting with `/diseno-web-sevilla/`.                                                                                                           |
| **Parked - Niche pages and clinicas capilares**            | Kept for later.                                                                            | Reopened only by the user.                                                                                                                                                                                                               |

Gating: M1 work may start before M0 closes, but no story merges while `verify` is missing once the CI story is done. M2 page stories are gated by the user's decisions D1-D4 (`odd/tasks/seo-para-ia-geo-page.md`). Parked stories are never selected for a sprint.

## 7. Prioritization framework

WSJF-lite: score = (value + urgency + risk reduction) / size, each 1-5, size from points.

- **Value:** expected effect on qualified bookings or on visibility of an in-focus page.
- **Urgency:** blocks other work (CI, measurement) or decays (data that must be baselined before a change ships).
- **Risk reduction:** prevents regressions, wrong prices, invented claims or wasted deploys.
- Ties break by the principles order, then by milestone order.

Priority mapping: Highest = blocks the team or production correctness (CI); High = current milestone, top of WSJF; Medium = current milestone, rest; Low = next milestone or tech debt; Lowest = parked.

## 8. Delivery process

- Sprints of 14 days (`NRD Sprint n`), initial capacity 20 points, WIP 1.
- Sizes: S = 1-2, M = 3-5, L = 8, XL = 13+ points. Anything above 8 is split before planning.
- Branches `{type}/{KEY}-{slug}` from `develop`, merge commits into `develop`; `develop` is promoted to `main` by the scheduled task about every 2 days, at most about 20 production deploys a month. Sprints never deploy.
- **Batching:** plan sprints so related stories land on `develop` together; a hotfix outside the schedule is the user's call because it spends budget.

**Definition of Ready**

- User problem and the in-focus page or area named; milestone epic set.
- Acceptance criteria testable, including the Spanish copy source when copy changes.
- Size label and story points; dependencies linked (`Blocks`); no open user decision (or it is answered in the story).
- Evidence (`path:line`, doc or report) for bugs and SEO stories.

**Definition of Done**

- Acceptance criteria met and verified by QA at the PR head.
- TDD: a `tests/*.test.js` case that failed before the change; relevant `scripts/check-seo-*.mjs` pass.
- `node --test tests/*.test.js` and `pnpm build` green locally and in CI (`verify`).
- Invariants respected (no invented proof, no promises, data from `src/data`, CSP, consent, trailing slashes, one H1).
- Specialist reviews (SEO, UX, a11y, privacy) passed where paths match; PR approved and merged into `develop`.
- Related `odd/tasks` doc, `llms.txt` and sitemap kept consistent.

## 9. Decision rights

PO decides alone: backlog order, priorities, estimates, splitting, acceptance criteria, labels, links, sprint scope and goals, moving stories between adjacent milestones, accepting S/M research and SEO candidates.

Radical (needs the user):

- Prices or offers shown on the site, a new service, or the GEO page pricing (D1).
- Removing, merging or renaming a public page; reopening parked pages.
- A new runtime dependency, external service, tracker, form processor or paid infrastructure; leaving static output.
- Legal pages beyond keeping them consistent; anything touching Netlify settings, env vars, DNS or deploy budget.
- A new milestone or epic, a story of 8+ points from research, a principle change.
- Publishing any proof (testimonial, logo, figure) not already verified.

## 10. Non-functional requirements

- Static build only; Core Web Vitals within Google "good" thresholds as a design goal (never promised as a figure).
- WCAG 2.2 AA, usable from 320 px, keyboard and focus visible.
- CSP in `public/_headers` without `unsafe-inline` scripts; analytics only after consent; personal data only through the Formspree contact form documented in `/privacidad/`.
- No secret in the repo or client bundle; only `PUBLIC_*` variables reach the browser.
- SEO safety: no URL breaks without a 301, one H1, trailing-slash links, sitemap/robots/`llms.txt` consistent, `check-seo-*` passing.

## 11. Current state (2026-11-15)

Shipped in NRD Sprint 5 (closed 2026-11-15, goal met, 20 of 20 points, no spillover, no QA bugs; on `develop` up to PR #52, production gets them with the scheduled promotions):

- SEO P5 guards (NRD-112 to NRD-118): CI `verify` runs every `check-seo-NN` through `pnpm check:seo:dist`; blog links, breadcrumb items and `/contacto` links carry the trailing slash; `check-seo-06/07` prove links inside `<main>`; keyword ownership is enforced on `dist/` (only the owner targets a registered term in title, H1 or H2); one-H1 guard for every built page.
- SEO P5 step 0 (NRD-119): ADR 0013 intent rows, keyword owners, link rows 1-7 and reciprocal pairs applied; ADR 0013 set to Accepted.
- SEO P5 step 1 (NRD-120): `/seo-local-sevilla/` title "SEO local Sevilla y posicionamiento web | Desde 300 €/mes + IVA", H1 "SEO local Sevilla y posicionamiento web", an honest comparative H2 "¿Agencia SEO en Sevilla o consultora?" (the page never calls Nuria an agency) and a price lede built from the tier data. SL-3 confirmed as a separate price intent. After the next promotion: Rich Results Test and field CWV (the 375 px LCP element moved to `p.hero-subtitle`).
- Next (NRD Sprint 6): NRD-129 (JSON-LD phone tied to the published phone), steps 2-5 `/diseno-web-sevilla/` (NRD-121), `/` (NRD-122, now also resolves the home H2 overlap with "posicionamiento web Sevilla"), `/automatizaciones/` (NRD-123), `/desarrollo-software-medida/` (NRD-124), then the M0 dark-only cleanup (NRD-13, NRD-14) that closes M0.

Shipped in NRD Sprint 4 (closed 2026-11-15, goal met, 18 of 18 points, no spillover; on `develop` via PRs #36-#42, docs-only except NRD-71):

- SEO P2 follow-up (NRD-97): DataForSEO run closed 7 of 22 volume gaps; 14 clusters after merging GEO-2 into SL-1 and TO-1 into DW-1 (`docs/seo-audit/keyword-clusters-2026-11.md`).
- Indexation diagnosis (NRD-98): `/tienda-online-sevilla/` and `/inteligencia-artificial/` have no on-site cause ("URL is unknown to Google"); the owner's Search Console requests are listed in `docs/seo-audit/technical-follow-up.md`. The only site cause found is the blog links without trailing slash (now NRD-113).
- SEO P3 (NRD-74): ADR 0013, verdict "adjust": 12 of 14 clusters already have an existing owner page; owner map, link tables A-D, phase-5 order. Accepted by the PO on 2026-11-15 (the file status line is updated in NRD-119); proposals P1 (`/seo-para-ia/`) and P2 (maintenance page) wait for the user.
- SEO P4 (NRD-75): technical review scoped to the ADR; guard coverage table and gaps G1a-G6 (filed as NRD-112 to NRD-118).
- SEO P6 (NRD-77): GBP vs local-pack competitors, NAP check, owner checklist of 13 GBP items and a monthly review routine that asks every client with a delivered project (`docs/seo-audit/local-signals-2026-11.md`). Site gap G1 filed as NRD-129; G2-G4 wait for the owner's GBP read.
- SEO P5 (NRD-76): 19-item SEO/GEO/delivery checklist and per-page drafts (`docs/seo-audit/page-optimization-checklist.md`), filed as NRD-119 to NRD-128 in ADR 0013 order.
- M1: the consent panel no longer covers the WhatsApp button on mobile (NRD-71).
- Next (NRD Sprint 5): the seven guard stories (CI runs the `check-seo` scripts, trailing slash, breadcrumbs, links inside `<main>`, keyword ownership, one H1), step 0 registry and link rows, then the first page story, `/seo-local-sevilla/` (NRD-120).

Waiting on the owner: Search Console indexation requests for `/tienda-online-sevilla/`, `/inteligencia-artificial/` and the blog (they gate NRD-125, NRD-126, NRD-127, NRD-128); the GBP read and changes of the NRD-77 owner checklist.

Shipped in NRD Sprint 3 (closed 2026-11-15, goal met, 22 points: 20 committed + NRD-94 added; on `develop` via PRs #31-#34, production gets them with the scheduled promotions):

- SEO P0 (NRD-17): GA4 and Search Console verified in production with the 28-day KPI, position and AI-citation baselines recorded (`docs/seo-audit/measurement-seo.md`). This closes the last M1 measurement exit criterion. The consent controller now stops every GA4 hit after a revoke (`ga-disable` flag plus `_ga*` cookie expiry, NRD-94).
- SEO P1 (NRD-22): dated inventory of every sitemap URL (`docs/seo-audit/inventory-2026-11.md`). Two in-focus pages are outside Google's index: `/tienda-online-sevilla/` (Discovered - not indexed) and `/inteligencia-artificial/` (unknown to Google). 3 of 4 blog posts are Crawled - not indexed. Only 2 two-URL queries were found, so the head terms have no cannibalization.
- SEO P2 (NRD-73): Seville keyword clusters and a cluster-owner map per service (`docs/seo-audit/keyword-clusters-2026-11.md`). It was built without DataForSEO data: 22 of 41 queries have no volume and 7 clusters have inferred intent. The 30-call plan is written down for a later run (NRD-97).
- M1 consent panel: footer cookie settings work after client-side navigation (NRD-69), and the panel no longer hides the hero booking CTA or traps focus behind it (NRD-70). NRD-71 (panel over the WhatsApp button) remains.
- Next (NRD Sprint 4): close the P2 data gaps (NRD-97), diagnose the unindexed pages (NRD-98), write the SEO P3 architecture ADR (NRD-74), then P4 (NRD-75), P6 (NRD-77) and P5 (NRD-76).

Shipped in NRD Sprint 2 (closed 2026-11-15, goal met, 20 points: 19 committed + NRD-67 added; in production since the develop -> main promotion of 2026-11-15, PR #27, except the docs-only NRD-50 record):

- M1: BookingButton contrast meets WCAG AA (NRD-49); `/seo-local-sevilla/` covers "posicionamiento web Sevilla" with keyword ownership of the four local head terms recorded (NRD-33); Google review request link on the contact success state plus client template (NRD-32); Person.url trailing slash fixed (NRD-48); real-browser mobile UX check of `/` and `/seo-local-sevilla/` (NRD-20); header booking CTA measured in production with no CLS/LCP regression (NRD-50); backlink baseline and 5 verified outreach opportunities (NRD-21, outreach itself deferred into NRD-72); GA4 gtag wrapper fixed so GA4 receives data after consent (NRD-67). Search Console verified with a first KPI baseline (NRD-17 progress, PR #18).
- M0: orphan theme toggle removed (NRD-11) and nav blur follows the dark-only site (NRD-12). Remaining M0: `dark:` variant cleanup (NRD-13, NRD-14).
- M3: `/tienda-online-sevilla/` retargeted to "diseño / crear tienda online Sevilla" (NRD-34).
- Found during the sprint: consent panel defects NRD-69 (cookie settings dead after client-side navigation), NRD-70 (panel hides the hero booking CTA and obscures focus), NRD-71 (panel covers the WhatsApp button).
- Remaining M1 exit criteria: GA4 verification and the full KPI and AI-citation baseline (NRD-17, in NRD Sprint 3). Next: the SEO method phases P1-P3 (NRD-22, NRD-73, NRD-74).

Shipped in NRD Sprint 1 (closed 2026-11-14, 20 of 20 points, all on `develop`; production gets them with the scheduled promotions):

- M0: CI workflow `ci.yml` with the required `verify` job on PRs to `develop` (NRD-6); `pnpm-lock.yaml` tracked and out of `.gitignore` (NRD-7); `check:seo-*` scripts use pnpm and `check-seo-15` has a script (NRD-8, NRD-46); `PUBLIC_GA4_MEASUREMENT_ID` declared in `src/env.d.ts` (NRD-9); home meta and `llms.txt` prices guarded by tests from one source (NRD-10). Remaining M0: dark-only cleanup (NRD-11 to NRD-14).
- M1: desktop and mobile booking CTA in the header (NRD-15); Google reviews confirmed rendering on the production home (NRD-16); production CWV/LCP baseline for the in-focus pages recorded (NRD-18, `docs/designs/NRD-18-cwv-lcp-baseline.md`); production JSON-LD, FAQs and `llms.txt` links validated (NRD-19). Remaining M1 exit criteria: GA4 / Search Console verification and KPI baseline (NRD-17, needs the user's access), backlink baseline and outreach list (NRD-21).
- Found during the sprint: NRD-48 (Person.url without trailing slash), NRD-49 (BookingButton dark-theme contrast below WCAG AA), NRD-50 (header CLS to be measured on production).

Product:

- Static Astro 4 + Tailwind 3 + TypeScript site on Netlify, dark-only design (`DESIGN.md`), 20+ pages: home, six service pages at root (`/diseno-web-sevilla/`, `/tienda-online-sevilla/`, `/desarrollo-software-medida/`, `/automatizaciones/`, `/inteligencia-artificial/`, `/seo-local-sevilla/`), four niche pages, `/seo-para-clinicas-capilares-sevilla/`, blog, `/recursos/`, `/casos-de-exito/`, `/sobre-mi/`, `/contacto/`, legal pages.
- Home repositioned as "Consultor SEO en Sevilla" with process, milestones below the hero, services list, Google reviews block (`src/pages/index.astro`).
- `/seo-local-sevilla/` redesigned around the "ficha" narrative with Local (300 EUR/month + VAT) and Local Pro (500 EUR/month + VAT, recommended) plans, published NAP and Maps link, review bento and `check-seo-15` guard (`src/components/seo-local/*`, `src/data/services.ts:460-591`).
- Booking: Google Calendar booking page via `bookingUrl` (`src/data/site.ts:54`) and `BookingButton`; contact form via Formspree.
- SEO layer: one SEO head component and JSON-LD graph (`src/lib/schema.ts`), hub/spoke internal links (`src/data/internal-links.ts`), intent matrix (`src/data/seo-intents.ts`), curated `public/llms.txt`, build-time checks `scripts/check-seo-02..15.mjs`, GA4 after consent (`src/scripts/analytics-consent.js`).
- Google Business Profile verified (`src/data/local-trust.ts:24`).

Completed feature docs: `home-reposicionamiento`, `google-calendar-reserva`, `jerarquia-diseno-web-sevilla`, `seo-local-sevilla`, `seo-local-ficha-redesign`, `seo-28-meta-titles-descriptions`, `seo-audit-backlog-2026-09-22`, `seo-free-audit-fixes-2026-09-24`, `casos-de-exito`, `technology-stack-copy`, `servicios-a-raiz` (except Search Console monitoring).

Open work (now in Jira):

- `mejoras-home-conversion`: header CTA (T4), reviews in production (T6), real-data visuals (T7). T1/T5 superseded (see decision log).
- `seo-audit-backlog-2026-09-21`: production verification of CWV, measurement, structured data, `llms.txt`, mobile UX, backlinks and cannibalization; SEO-05 (niche pages) parked.
- `seo-para-ia-geo-page`: not started, waiting for D1-D4.
- `eliminar-selector-tema-dark-only`: not started.
- `capilar-local-captacion`: parked.

Known gaps (CI, lockfile, `check:seo-*` scripts, price duplication and the GA4 env type were closed in Sprint 1): `llms.txt` missing the capilares page (parked, NRD-27); orphan `ThemeToggle.astro` / `theme-toggle.js` and `darkMode: 'class'` with 186 `dark:` usages in 38 files (NRD-11 to NRD-14); BookingButton contrast below AA in the dark theme (NRD-49).

## 12. Open questions for the user

- GEO page D1-D4 (price variant, main keyword, review and follow-up method, hero A or B). Blocks the M2 page stories.
- Data source for home charts (T7): which real data may be shown? Story kept Low until answered.
- Netlify env vars for Google Places in production (reviews story) and GA4 / Search Console access (measurement story) are the user's.
- Assumption: `pnpm-lock.yaml` stays tracked and leaves `.gitignore` (CI needs a frozen lockfile).
- Assumption: M3 has no stories yet; it is filled by the daily SEO runs, starting with `/diseno-web-sevilla/`.

## 14. Decision log

- 2026-11-13 - PRD written at team-harness adoption (brownfield). Milestones M0-M3 plus Parked; one Jira epic per milestone.
- 2026-11-13 - Focus: local SEO in Seville and the other services, page by page. Niche pages and `/seo-para-clinicas-capilares-sevilla/` parked until the user reopens them.
- 2026-11-13 - CI (`verify`) is the first story; auto-merge stays blocked until it exists.
- 2026-11-13 - `mejoras-home-conversion` T5 (remove "Sevilla") not filed: superseded by `home-reposicionamiento` and SEO-28, which reinforce "Sevilla"; T1 not filed: its open decisions moved into the T7 story and the open questions.
- 2026-11-13 - SEO-10 / SEO-11 not filed: GBP verified and NAP published (`src/data/local-trust.ts`, commit `c85ef6b`); remaining social proof follows "Real proof only".
- 2026-11-13 - Backlog bootstrapped: epics NRD-1 (M0), NRD-2 (M1), NRD-3 (M2), NRD-4 (M3, empty until SEO runs feed it), NRD-5 (Parked); stories and bugs NRD-6 to NRD-30. No sprint started.
- 2026-11-13 - `llms.txt` stays a static file (no endpoints, invariant "Static output"); price consistency is enforced by a test instead.
- 2026-11-13 - NRD Sprint 1 (id 50) planned and started for 2026-11-16 to 2026-11-30 with 20 points (initial capacity): M0 NRD-7, NRD-6, NRD-8, NRD-10, NRD-9 and M1 NRD-18, NRD-16, NRD-19, NRD-15. NRD-17 left out because it needs the user's GA4/Search Console access; NRD-18 raised to High so the CWV baseline is taken before the header CTA ships.
- 2026-11-13 - SEO report 2026-11-13: accepted S-2026-11-13-2 -> NRD-32 (M1), S-2026-11-13-3 -> NRD-33 (M1), S-2026-11-13-6 -> NRD-34 (M3); S-2026-11-13-5 covered by NRD-21; S-2026-11-13-4 rejected (single source, focus); S-2026-11-13-1 (prices in the blog post) waits for the user's decision.
- 2026-11-14 - NRD Sprint 1 closed: goal met, 20 of 20 points, velocity 20, no spillover. NRD-31 closed as done (merged in PR #1).
- 2026-11-14 - NRD-15 AC "exactly one link to `bookingUrl`" confirmed as one visible and accessible link per breakpoint (two instances with mutually exclusive `display`, never hidden only visually). Review follow-ups filed in M1: NRD-49 (BookingButton dark-theme contrast, High) and NRD-50 (header CLS/LCP on production vs the NRD-18 baseline).
- 2026-11-14 - NRD Sprint 2 (id 57) planned and started for 2026-11-16 to 2026-11-30 with 19 points (capacity 20): M1 NRD-49, NRD-33, NRD-32, NRD-48, NRD-20, NRD-50, NRD-21; M0 NRD-11, NRD-12; M3 fill NRD-34 (M2 is gated by D1-D4). NRD-17 labelled `needs-human` and left out again (user's GA4 / Search Console access), so NRD-22 stays blocked. M2 stories set to Low per the priority mapping (next, gated milestone).
- 2026-11-14 - SEO method (user decision, live session): measure -> inventory -> keywords per service -> architecture before page rewrites and links; one story per phase, worked sprint by sprint. Link building comes later; outreach deferred into NRD-72 (Low, not planned until the user says so). Phases: P0 NRD-17 (reused, + AI-citation baseline, 5 pts), P1 NRD-22 (reused and folded into the full URL inventory, moved M1 -> M3), P2 NRD-73 (keyword clusters per service, reusing the SEO reports), P3 NRD-74 (architecture ADR, verdict rework vs adjust; page merges, renames or new pages stay the user's call), P4 NRD-75, P5 NRD-76 (checklist and per-page stories after P3), P6 NRD-77 (M1, local signals), P7 NRD-72, P8 NRD-78. Blocks chain 17 -> 22 -> 73 -> 74 -> 75 -> 76 -> 78, 74 -> 77 -> 72, 74 -> NRD-24. Priorities: P0-P3 High, P4-P6 Medium, P7-P8 Low; epic NRD-4 (M3) hosts the method and goes Low -> High. NRD Sprint 2 scope unchanged.
- 2026-11-15 - NRD Sprint 2 closed early with every item done: goal met, 20 points (19 committed + NRD-67 added), velocity 20 (average 20 over 2 sprints), no spillover. Consent panel bugs estimated: NRD-69 2 pts (epic M1), NRD-70 3 pts, NRD-71 1 pt; NRD-72 placed under epic M1 (still deferred, Low).
- 2026-11-15 - NRD Sprint 3 (id 63) planned and started for 2026-11-16 to 2026-11-30 with 20 points (capacity 20), in execution order: NRD-17 (SEO P0, ready now that NRD-67 is in production), NRD-69 (RGPD consent revocation, High), NRD-70 (consent panel vs hero CTA, batched with NRD-69), NRD-22 (P1 inventory), NRD-73 (P2 keyword clusters). NRD-74 (P3 architecture ADR, 5 pts) did not fit and is first in the backlog, followed by NRD-71. NRD-72 outreach stays out per the 2026-11-14 decision; M2 stays gated.
- 2026-11-15 - NRD Sprint 3 closed early with every item done: goal met, 22 points (20 committed + NRD-94 at 2 pts, an RGPD revoke leak found by QA on NRD-17), velocity 22 (average 20.7 over 3 sprints, capacity stays 20), no spillover. M1 measurement exit criterion met (NRD-17).
- 2026-11-15 - The NRD-22 and NRD-73 gaps become two S stories that feed NRD-74. They are not folded into NRD-74 because they decay or need other tools. NRD-97 (2 pts) runs the NRD-73 DataForSEO plan within the configured 30-call budget and confirms the 7 inferred-intent clusters. If it again runs without DataForSEO tools, NRD-74 proceeds with those clusters marked as provisional. NRD-98 (2 pts) diagnoses why `/tienda-online-sevilla/` and `/inteligencia-artificial/` are not indexed and lists the Search Console actions for the user. The keep/extend/merge decision for the unindexed blog posts stays in NRD-74 as an input; any merge or removal is the user's call.
- 2026-11-15 - NRD Sprint 4 (id 65) planned and started for 2026-11-16 to 2026-11-30 with 18 points (capacity 20), in execution order: NRD-97, NRD-98, NRD-74 (P3 ADR), NRD-71, NRD-75 (P4), NRD-77 (P6), NRD-76 (P5). NRD-75, NRD-77 and NRD-76 are blocked by stories earlier in the same sprint. The 2 points left are not filled: no unblocked S story remains outside gated (M2), deferred (NRD-72) or parked work, and they serve as a buffer for QA defects. Backlog after the sprint: NRD-78, NRD-13, NRD-14, then the gated M2 stories, NRD-23 and NRD-72.
- 2026-11-15 - NRD Sprint 4 closed early with every item done: goal met, 18 of 18 points, velocity 18 (last 3 sprints 20, 22, 18; average 20, capacity stays 20), no spillover.
- 2026-11-15 - ADR 0013 (SEO site architecture) accepted by the PO with NRD-74: verdict "adjust", owner map, link rules and phase-5 order. Proposals P1 (`/seo-para-ia/`) and P2 (maintenance page) stay with the user. The file status line still reads "Proposed"; the developer of NRD-119 updates it and the ADR index (docs path, not a PO commit).
- 2026-11-15 - NRD-76 drafts filed in epic NRD-4, label `seo`, one page at a time in ADR 0013 order: step 0 NRD-119 (3 pts), step 1 `/seo-local-sevilla/` NRD-120 (5), step 2 `/diseno-web-sevilla/` NRD-121 (5, no price copy while S-2026-11-13-1 is open), step 3 `/` NRD-122, step 4 `/automatizaciones/` NRD-123, step 5 `/desarrollo-software-medida/` NRD-124, step 6 `/tienda-online-sevilla/` NRD-125 (follow-up related to NRD-34, which is not reopened), step 7 `/inteligencia-artificial/` NRD-126, step 8 existing NRD-24/25/26 (still gated by P1 and D1-D4), step 9a NRD-127, step 9b NRD-128 (2 pts each). Steps 6, 7, 9a and 9b need the page indexed first and are Low.
- 2026-11-15 - NRD-75 gaps filed as Blocks before step 0 and step 1: G4 NRD-112 (CI runs `check-seo-02..15`, infra, Highest), G1a NRD-113, G1b NRD-114 (filed so the slash rule needs no permanent `/contacto` exemption), G2a+G2b NRD-115 (folded: same fix and guard), G3 NRD-116, G6 NRD-117 (`/blog/` listing card headings do not count as targeting), G5 NRD-118.
- 2026-11-15 - NRD-77 site gaps: G1 filed as NRD-129 (1 pt, M1). G2 (`Person` vs business locality) and G3 (`areaServed` literals) wait for the owner's GBP service-area read; G4 (two GBP URL forms) is an owner check and becomes a bug only if the links open different listings.
- 2026-11-15 - Review requests go to every client with a delivered project, never only the satisfied ones (review gating breaks Google's policy and "Real proof only"). NRD-77's acceptance criterion was reworded to match the delivered routine.
- 2026-11-15 - NRD Sprint 5 (id 66) planned and started for 2026-11-16 to 2026-11-30 with 20 points (capacity 20), in execution order: NRD-112, NRD-113, NRD-114, NRD-115, NRD-116, NRD-117, NRD-118, NRD-119, NRD-120. Backlog after the sprint: NRD-129, NRD-121 to NRD-124, then the indexation-gated NRD-125 and NRD-126, the gated NRD-24/25/26, NRD-127, NRD-128, then NRD-78, NRD-13, NRD-14, NRD-23 and NRD-72.
- 2026-11-15 - NRD Sprint 5 closed early with every item done: goal met, 20 of 20 points, velocity 20 (last 3 sprints 22, 18, 20; average 20, capacity stays 20), no spillover. NRD-120 design question settled: "agencia" stays out of the `/seo-local-sevilla/` title and H1 and appears only in the comparative H2 (NRD-33 positioning, principle 1); putting it in the title or H1 would be a positioning decision for the user. The home H2 overlap with "posicionamiento web Sevilla" became acceptance criterion SEO-1b of NRD-122.
- 2026-11-15 - NRD Sprint 6 (id 67) planned and started for 2026-11-16 to 2026-11-30 with 20 points (capacity 20), in execution order: NRD-129 (1), NRD-121 (5), NRD-122 (2), NRD-123 (2), NRD-124 (2), NRD-13 (5), NRD-14 (3). The page steps 6, 7, 9a and 9b (NRD-125 to NRD-128) still wait for the owner's indexation requests and M2 stays gated by D1-D4, so the remaining 8 points close M0 (dark-only cleanup) instead of starting gated work. NRD-78 (P8 measurement) stays out until the step 1-5 changes have been in production 2-4 weeks. Backlog after the sprint: NRD-125, NRD-126, NRD-24/25/26, NRD-127, NRD-128, NRD-78, NRD-23, NRD-72, then parked.
