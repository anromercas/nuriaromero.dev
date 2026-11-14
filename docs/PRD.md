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

## 11. Current state (2026-11-14)

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
