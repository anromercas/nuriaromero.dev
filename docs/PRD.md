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
3. **Business looking for a specific build (tertiary).** Needs a website, online store, custom software, an automation or an AI assistant and compares closed prices (landing from 149 EUR, website up to 5 pages from 399 EUR, automation from 149 EUR, AI from 399 EUR, software from 999 EUR, online store from 499 EUR with a management panel included, built on WooCommerce, Shopify or custom code at the client's choice).
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

| Milestone                                                  | Outcome                                                                                                                        | Exit criterion                                                                                                                                                                                                                           |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **M0 - Delivery foundation**                               | Every PR is verified automatically and the repo has one source of truth for site facts.                                        | `ci.yml` job `verify` runs on PRs to `develop` and on pushes and is the required check; lockfile, script and type inconsistencies fixed; prices in meta and `llms.txt` guarded by tests; no orphan theme code.                           |
| **M1 - Local SEO Seville: home and `/seo-local-sevilla/`** | The two local pages convert and are measured.                                                                                  | Header booking CTA live; Google reviews render in production; GA4 and Search Console verified with a recorded KPI baseline; CWV baseline recorded; production SEO signals validated; backlink baseline and first outreach list recorded. |
| **M2 - GEO / AI visibility**                               | A commercial page owns "SEO para IA / GEO" without cannibalising M1 pages.                                                     | `/seo-para-ia/` published with tests, schema, internal links, `llms.txt` entry and its `dist/` check passing; Search Console baseline recorded.                                                                                          |
| **M3 - Other services, page by page**                      | Each other service page is improved against its real SERP competitors, one page at a time.                                     | Each page has a competitor-backed improvement story shipped (fed by the daily SEO runs), starting with `/diseno-web-sevilla/`.                                                                                                           |
| **M4 - Redesign on the `/seo-local-sevilla/` template**    | Every in-focus public page follows the structure and visual world of `/seo-local-sevilla/` with much less text (epic NRD-162). | Every in-focus page is built with the reusable components of NRD-163 and its visible words in `<main>` are within the target set in its story.                                                                                           |
| **Parked - Niche pages and clinicas capilares**            | Kept for later.                                                                                                                | Reopened only by the user.                                                                                                                                                                                                               |

Gating: M1 work may start before M0 closes, but no story merges while `verify` is missing once the CI story is done. M2 page stories are gated by the user's decisions D1-D4 (`odd/tasks/seo-para-ia-geo-page.md`). Parked stories are never selected for a sprint. M4 runs alongside M1-M3 (owner decision of 2026-11-16); its stories for parked pages (NRD-174 to NRD-178) stay parked.

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

## 11. Current state (2026-11-17)

Shipped in NRD Sprint 14 (closed 2026-11-17, goal met, 11 points: 9 committed + NRD-256 estimated at 2 pts after the fact, no spillover, no QA bugs; on `develop` up to PR #104, production gets it with the scheduled promotions):

- M2 started: `/seo-para-ia/` is a commercial "SEO para IA" page on the `/seo-local-sevilla/` template with the editorial hero, included in Local Pro without its own price (NRD-24); it is linked internally, registered in `seo-intents` and listed in `llms.txt` (NRD-25) and guarded by `check-seo-21` inside `check:seo` (NRD-26).
- Navigation: the header "Servicios" menu lists only services in two groups ("Visibilidad", "Webs y desarrollo") from `src/data/navigation.ts`; the niche pages and the clinicas capilares page moved to the footer column "Por sector" (NRD-256).
- Remaining M2 exit criterion: the Search Console baseline of `/seo-para-ia/` after promotion and indexation (NRD-261).
- Follow-ups filed: NRD-259 (header navigation keyboard, ARIA and focus defects that predate NRD-256) and NRD-260 (`check:capilar-local` fails on `develop` with 20 stale offer assertions; parked, the offer is the owner's call).
- Next (NRD Sprint 15): the GEO audit stories NRD-241, NRD-242, NRD-244, NRD-245, NRD-243, plus NRD-259 and NRD-247.

Shipped in NRD Sprint 13 (closed 2026-11-17, goal met, 1 of 1 point, no spillover, no QA bugs; on `develop` up to PR #94, production gets it with the scheduled promotions):

- M4 guard hardening: `check-seo-20` and its tests resolve paths with `fileURLToPath`, so they pass from a checkout path with spaces or accents, and `isNoindex` treats robots `content="none"` as noindex (NRD-239). No published HTML changed.
- The three LOW findings of the PR #94 review (test cases already verified by QA, spec wording) are not filed.
- No NRD Sprint 14 is started: no unparked story is ready. Every one waits on the owner (NRD-160 directory accounts, Search Console indexation for NRD-125 to NRD-128, D1-D4 for M2 NRD-24/25/26, the real-data decision for NRD-23, NRD-72 deferred) or on time in production (NRD-78, after the 2026-11-16 promotion carried the SEO P5 steps 1-5; earliest about 2026-11-30).

Shipped in NRD Sprint 12 (closed 2026-11-17, goal met, 3 of 3 points, no spillover, no QA bugs; on `develop` up to PR #92, production gets them with the scheduled promotions):

- M4 polish: the breadcrumb current item keeps the default cursor, its row gap no longer clips the focus ring when it wraps on mobile, and its contrast is tested over the purple radial background (NRD-235); `check-seo-20` guards every built page: indexable pages publish `og:url` equal to their canonical and `noindex` pages publish none (NRD-236).
- Review follow-ups (LOW) of PR #92 filed as NRD-239: path resolution through `fileURLToPath` instead of `URL.pathname` in the guard and its tests, and `isNoindex` recognising robots `content="none"`. Neither affects production today (the site only emits `noindex, nofollow`).
- Next (NRD Sprint 13): NRD-239. The ready backlog is otherwise empty: every other unparked story waits on the owner (NRD-160 accounts, indexation for NRD-125 to NRD-128, D1-D4 for M2, the real-data decision for NRD-23) or on time in production (NRD-78).

Shipped in NRD Sprint 11 (closed 2026-11-17, goal met, 6 of 6 points, no spillover, no QA bugs; on `develop` up to PR #89, production gets them with the scheduled promotions):

- M4 polish: the shared `Breadcrumbs` component is on the ink tokens with its own `:focus-visible` style (NRD-228); blog post table borders reach 3:1, `.post-prose` styles blockquote, code, pre and img, and the post contract checks related links, the booking close and one H1 (NRD-229); `noindex` pages (the 404) no longer emit `og:url` (NRD-230).
- Review follow-ups (LOW) filed: NRD-235 (breadcrumb current item cursor, row gap vs focus ring, contrast test over the purple radial) and NRD-236 (built-page `og:url` guard beyond the home).
- Next (NRD Sprint 12): NRD-235 and NRD-236. Every other unparked story waits on the owner (NRD-160 accounts, indexation for NRD-125 to NRD-128, D1-D4 for M2, the real-data decision for NRD-23) or on time in production (NRD-78).

Shipped in NRD Sprint 10 (closed 2026-11-16, goal met, 7 of 7 points, no spillover, no QA bugs; on `develop` up to PR #85, production gets them with the scheduled promotions):

- M4: `/blog/` (NRD-221), the blog post layout with the post text unchanged (NRD-222) and a custom `noindex` 404 page outside the sitemap and `llms.txt` (NRD-223) follow the `/seo-local-sevilla/` visual world. Every in-focus public page is now on the template; legal pages keep `LegalLayout`.
- Review follow-ups (LOW) still open: the shared `Breadcrumbs` component keeps pre-M4 gray styles and has no own focus style; blog post table borders measure about 1.9:1; `.post-prose` has no styles for blockquote, code, pre or img (no post uses them yet); the post contract does not check related links, the booking close or the single H1; the 404 emits `og:url` pointing to `/404/`.
- Next (NRD Sprint 11): those follow-ups, NRD-228, NRD-229 and NRD-230.

Shipped in NRD Sprint 9 (closed 2026-11-16, goal met, 15 of 15 points, no spillover, no QA bugs; on `develop` up to PR #80, production gets them with the scheduled promotions):

- M4: `/inteligencia-artificial/` (NRD-169, one plan from the published price, six real sourced FAQ questions), `/sobre-mi/` (NRD-170), `/portfolio/` (NRD-172) and `/recursos/` (NRD-173) are rebuilt on the template with much less text. Every page story of epic NRD-162 that is not parked is done: ten pages plus the reference follow the template (`scripts/lib/template-pages.mjs`).
- `check-seo-17` counts only the text Nuria controls: the live Google review quote of `RealProof` carries `data-word-budget="exclude"`, so the budget is the same with and without reviews data (NRD-212, ADR 0015).
- Delivery: the Prettier hook only formats files inside the repository (NRD-211).
- Still outside the template: `/blog/`, the blog post layout and the missing custom 404 page (Netlify's generic page is served today). Legal pages keep `LegalLayout`.
- Next (NRD Sprint 10): `/blog/` (NRD-221), the blog post layout without touching post content (NRD-222) and a custom 404 page (NRD-223).

Shipped in NRD Sprint 8 (closed 2026-11-16, goal met, 20 of 20 points, no spillover, no QA bugs; on `develop` up to PR #74, production gets them with the scheduled promotions):

- M3 offer: `/tienda-online-sevilla/` publishes the owner's store offer "desde 499 €" in three options (WooCommerce, Shopify or custom code) with the management panel included, from one price source in `src/data`, with coherent copy, FAQ, Service JSON-LD and `llms.txt` (NRD-195).
- M4: `/tienda-online-sevilla/` (NRD-168, batched with NRD-195), `/automatizaciones/` (NRD-166) and `/desarrollo-software-medida/` (NRD-167) are rebuilt on the template with much less text and FAQ blocks built only from real sourced questions. Six pages plus the reference now follow the template (`scripts/lib/template-pages.mjs`).
- Found during the sprint: `check-seo-17` counts words on a build without Google reviews data, while production renders a live review quote inside `<main>` on every template page with `RealProof` (filed as NRD-212). The NRD-167 FAQ answers came out at about 25 words instead of the design's 50-65; review accepted it as non-blocking.
- Next (NRD Sprint 9): the Prettier hook fix (NRD-211), the word-count fix (NRD-212), then `/inteligencia-artificial/` (NRD-169), `/sobre-mi/` (NRD-170), `/portfolio/` (NRD-172) and `/recursos/` (NRD-173), the last M4 page stories that are not parked.

Shipped in NRD Sprint 7 (closed 2026-11-16, goal met, 22 of 22 points: 20 committed + QA bugs NRD-196 and NRD-197 at 1 pt each, no spillover; on `develop`, production gets them with the scheduled promotions):

- M4 started: the `/seo-local-sevilla/` sections are reusable components with content by props and shared tokens, with no visual change on the reference page (NRD-163). The home (NRD-164), `/diseno-web-sevilla/` (NRD-165, including the owner's web design offer facts: one month of support in both plans, no editing panel by default) and `/contacto/` (NRD-171) are rebuilt on the template with much less text and FAQ blocks built only from real sourced questions.
- QA fixes inside the sprint: the home hero mock labels kept below AA contrast before the first scroll (NRD-196) and the `/contacto/` consent checkbox lost its keyboard focus outline (NRD-197).
- Next (NRD Sprint 8): the online store offer "desde 499 €" in three options with the management panel included (NRD-195), then the store page redesign on the template (NRD-168, batched with NRD-195), `/automatizaciones/` (NRD-166) and `/desarrollo-software-medida/` (NRD-167).

Shipped in NRD Sprint 6 (closed 2026-11-16, goal met, 22 of 22 points: 20 committed + NRD-159 and NRD-161 at 1 pt each, no spillover; on `develop` up to PR #61, production gets them with the scheduled promotions):

- M0 closed: no `dark:` variants left in layouts, components or pages and no `darkMode: 'class'` (NRD-13, NRD-14). Inline-text whitespace lost in the NRD-14 reformat was restored inside the sprint (NRD-157, NRD-158).
- SEO P5 steps 2-5: `/diseno-web-sevilla/` carries "diseño web sevilla" in title, H1 and H2 and routes software intent to its owner (NRD-121); home copy for "consultor / experto SEO Sevilla" checked against evidence, H2 overlap with "posicionamiento web Sevilla" resolved (NRD-122); `/automatizaciones/` aligned with the process-automation intent (NRD-123); `/desarrollo-software-medida/` given its intent and owner of "aplicaciones web a medida sevilla" (NRD-124, H1 at 768 px fixed in NRD-159).
- M1: LocalBusiness JSON-LD telephone tied to `SITE.phone` with a guard (NRD-129).
- Delivery: designs are now OpenSpec changes (`openspec/`, `design.mode: openspec`) and tracker and PR content is written in Spanish (NRD-161, PR #60). `docs/designs/` stays as history.
- Next (NRD Sprint 7): the page-redesign epic NRD-162 requested by the owner on 2026-11-16 (every public page follows `/seo-local-sevilla/`: same section order and visual world, much less text, FAQ blocks only with real sourced questions). Enabler NRD-163 (reusable components, no visual change on the reference page), then the home (NRD-164), `/diseno-web-sevilla/` (NRD-165) and `/contacto/` (NRD-171).

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
- Editing panel on the parked niche pages: `src/data/niches.ts` promises a management panel (restaurant menu, clinic and law-office team pages, shop catalogue). Is it included in those offers? (Custom websites: not included; online stores: included in all three store options, both decided 2026-11-16.)
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
- 2026-11-16 - NRD Sprint 6 closed early with every item done: goal met, 22 of 22 points (20 committed + NRD-159, a QA bug on NRD-124, and NRD-161, the OpenSpec adoption the owner asked for; both estimated at 1 pt after the fact), velocity 22 (last 3 sprints 18, 20, 22; average 20, capacity stays 20), no spillover. M0 exit criterion met (NRD-13, NRD-14). NRD-160 (Sortlist and Clutch profiles, owner request) estimated at 2 pts and placed under epic M1 (local citations); not planned yet because account creation and verification are the owner's.
- 2026-11-16 - Owner rule (live session, recorded in epic NRD-162): every public page follows the structure and visual world of `/seo-local-sevilla/`, with short copy, GEO FAQ blocks built only from real sourced questions and a UI spec with impeccable in every UI story. Epic NRD-162 holds the enabler NRD-163 and one story per page; the niche and clinicas capilares stories (NRD-174 to NRD-178) keep `needs-human` and stay parked. The milestone table (section 6) does not list this epic yet; that change is proposed to the owner.
- 2026-11-16 - NRD Sprint 7 (id 68) planned and started for 2026-11-16 to 2026-11-30 with 20 points (capacity 20), in execution order: NRD-163 (8, enabler, blocks the rest), NRD-164 home (5), NRD-165 `/diseno-web-sevilla/` (5), NRD-171 `/contacto/` (2). Chosen because every remaining M1-M3 story is gated (indexation for NRD-125 to NRD-128, D1-D4 for M2, 2-4 weeks in production for NRD-78, the real-data decision for NRD-23, NRD-72 deferred) and the home and `/diseno-web-sevilla/` own the two largest measured head terms. NRD-165 raised to High and NRD-171 to Medium. Backlog after the sprint: NRD-166, NRD-167, NRD-160, NRD-169, NRD-168, NRD-170, NRD-172, NRD-173, then the gated SEO P5 steps, M2, NRD-78, NRD-23, NRD-72 and parked.
- 2026-11-16 - Owner decision (live session) on epic NRD-162: option (a), a new milestone "M4 - Redesign on the `/seo-local-sevilla/` template" (section 6) with exit criterion "every in-focus page is built with the NRD-163 components and meets the visible-word target of its story". Epic NRD-162 is the M4 epic and loses `needs-human`; options (b) split into M1/M3 and (c) outside the milestones were rejected. This closes the milestone-table proposal of the owner-rule entry above.
- 2026-11-16 - Owner product facts for the web design offer (live session, applied to NRD-165): (1) the one month of support after launch is included in both plans, the landing (from 149 EUR) and the full website (from 399 EUR), not only the full website; (2) custom websites do not include an editing panel (a CMS back office where the client edits texts, photos or prices) by default because of the reduced price; if the client asks for one it is quoted separately. Published copy that implies an included panel or self-editing is corrected in NRD-165, and the landing plan data gains the support item there (developer change in `src/data/services.ts`). Online stores and the parked niche pages also describe a panel; whether that is right for those offers is an open question for the owner, not changed here.
- 2026-11-16 - Owner decision (live session, answering the section 12 panel question for online stores): a basic online store starts at a minimum of 499 EUR (published as "desde 499 €") and includes a management back office, like WooCommerce, where the client uploads products and manages the catalogue. It replaces today's store offer (the 399 EUR full website plus the payment gateway, stock, variants and shipping quoted separately). No other store figure was decided. The niche-page part of the question stays open. Site change filed as NRD-195 (M3, 3 pts, High): one price source in `src/data`, store copy and FAQ, the store mentions on `/diseno-web-sevilla/` and `/web-para-comercios-sevilla/` (store price only; the niche panel copy is untouched), Service JSON-LD and `llms.txt`, tests. NRD-195 goes to the top of the backlog, not into NRD Sprint 7: the sprint is at its 20-point capacity with an M4 goal, NRD-165 edits the same `/diseno-web-sevilla/` data, and the published copy never offers a store at 399 EUR. NRD-195 blocks the store redesign NRD-168.
- 2026-11-16 - Owner decision (attended session, refining the previous entry and NRD-195): the online store is offered in three options the client chooses, all "desde 499 €": (a) WooCommerce, (b) Shopify, (c) a custom-coded store (for example Next.js + Supabase). Same starting price for all three; the final price is closed in writing after learning the project, and the owner adjusts it if a build turns out to be more work. Basic scope included in "desde 499 €": the store set up on the client's site with design adapted to the brand; one card payment gateway (for example Stripe); simple shipping (flat rate and/or local pickup); up to about 20 products loaded by Nuria, with simple variants (size or colour); a training session so the client uploads products and manages orders from the management panel; one month of support, as with websites. Quoted separately: Redsys/Bizum, large catalogues or bulk imports, weight/zone shipping and carrier integrations, automatic invoicing or stock sync with other systems (the automations service). On Shopify the platform's monthly fee is paid by the client to Shopify; on WooCommerce and custom builds the hosting and domain are in the client's name, like the websites. No other figure was decided. The Service JSON-LD keeps one offer "desde 499 €" (the three options share the price, so separate offers would repeat it and add nothing). NRD-195 is re-estimated from 3 to 5 points (still size-M, High, top of the backlog): the page gains the three-option block, the included and quoted-separately lists, and the FAQs that today present Shopify only as a rival or put the initial product load outside the price are rewritten. The niche-page panel question (section 12) stays open.
- 2026-11-16 - NRD Sprint 7 closed early with every item done: goal met, 22 of 22 points (20 committed + NRD-196 and NRD-197, accessibility QA bugs on NRD-164 and NRD-171, estimated at 1 pt each after the fact), velocity 22 (last 3 sprints 20, 22, 22; average 21.3, capacity 21), no spillover. Both QA bugs came from the switch to the ink world (an animated element's initial state and a scoped `outline: none`); the next M4 stories keep C7 and NRD-168 now asks for the no-scroll initial state of any animation to meet AA.
- 2026-11-16 - NRD Sprint 8 (id 69) planned and started for 2026-11-16 to 2026-11-30 with 20 points (capacity 21), in execution order: NRD-195 (5, store offer "desde 499 €"), NRD-168 (5, store page redesign, blocked by NRD-195 and batched with it so the page reaches `develop` with the new offer and design together), NRD-166 `/automatizaciones/` (5), NRD-167 `/desarrollo-software-medida/` (5). NRD-168 refined to read price, options and the included and quoted-separately lists from the NRD-195 single source (replacing its old "web base desde 399 €" plan section), its platform FAQ now compares the three offered options, and it goes Medium -> High. The free point is not filled: no unblocked 1-point story remains outside parked work. Backlog after the sprint: NRD-169, NRD-160, NRD-170, NRD-172, NRD-173, then the gated SEO P5 steps, M2, NRD-78, NRD-23, NRD-72 and parked.
- 2026-11-16 - NRD Sprint 8 closed early with every item done: goal met, 20 of 20 points, velocity 20 (last 3 sprints 22, 22, 20; average 21.3, capacity 21), no spillover, no QA bugs. QA/review finding on NRD-167 filed as NRD-212 (M4, 2 pts, High): the `check-seo-17` word budget measures the text Nuria controls, and the live Google review quote of `RealProof` is excluded from the count by an explicit marker instead of by the build having no reviews data. A real review is never trimmed or edited to fit a budget (principle 1). The shorter NRD-167 FAQ answers (about 25 words against 50-65 in the design) are accepted and not reopened.
- 2026-11-16 - NRD Sprint 9 (id 71) planned and started for 2026-11-16 to 2026-11-30 with 15 points (capacity 21), in execution order: NRD-211 (1, infra bug, Prettier hook formats files outside the repo; draft PR #71 exists), NRD-212 (2), NRD-169 `/inteligencia-artificial/` (5, Medium -> High), NRD-170 `/sobre-mi/` (3), NRD-172 `/portfolio/` (2), NRD-173 `/recursos/` (2), the last three Low -> Medium as current-milestone work. The 6 free points are not filled: NRD-160 needs the owner to create and verify the directory accounts, and every other unparked story is gated (indexation for NRD-125 to NRD-128, D1-D4 for M2, 2-4 weeks in production for NRD-78, the real-data decision for NRD-23, NRD-72 deferred). Backlog after the sprint: NRD-160, NRD-125, NRD-126, NRD-24/25/26, NRD-127, NRD-128, NRD-78, NRD-23, NRD-72, then parked.
- 2026-11-16 - NRD Sprint 9 closed early with every item done: goal met, 15 of 15 points, velocity 15 (last 3 sprints 22, 20, 15; average 19, capacity 19), no spillover, no QA bugs. The low velocity reflects a commitment below capacity (every other unparked story was gated), not a slower pace.
- 2026-11-16 - M4 gaps filed in epic NRD-162 after the Sprint 9 review, under the owner rule "every public page follows `/seo-local-sevilla/`": NRD-221 `/blog/` (2 pts, High), NRD-222 blog post layout with the post text unchanged (3 pts, High; content changes stay in the indexation-gated NRD-127 and NRD-128) and NRD-223 a custom `noindex` 404 page outside the sitemap and `llms.txt`, with no Netlify setting change (2 pts, Medium). Legal pages are not filed: they keep `LegalLayout`, and anything beyond keeping them consistent is the owner's call.
- 2026-11-16 - NRD Sprint 10 (id 72) planned and started for 2026-11-16 to 2026-11-30 with 7 points (capacity 19), in execution order: NRD-221, NRD-222 (batched so the blog index and posts reach `develop` together), NRD-223. The 12 free points are not filled: NRD-160 needs the owner's directory accounts, and every other unparked story is gated (indexation for NRD-125 to NRD-128, D1-D4 for M2, 2-4 weeks in production for NRD-78, the real-data decision for NRD-23, NRD-72 deferred). Backlog after the sprint: NRD-160, NRD-125, NRD-126, NRD-24/25/26, NRD-127, NRD-128, NRD-78, NRD-23, NRD-72, then parked.
- 2026-11-16 - NRD Sprint 10 closed early with every item done: goal met, 7 of 7 points, velocity 7 (last 3 sprints 20, 15, 7; average 14, capacity 14), no spillover, no QA bugs. The low velocity reflects a commitment below capacity (every other unparked story is gated), not a slower pace. M4 exit criterion is met for every in-focus page.
- 2026-11-16 - Sprint 10 review follow-ups filed in epic NRD-162 (M4): NRD-228 `Breadcrumbs` on the ink tokens with an own `:focus-visible` style (2 pts, High; the component is used by `ServiceLayout`, `LegalLayout`, the blog and four other pages); NRD-229 blog post table borders to at least 3:1, `.post-prose` styles for blockquote, code, pre and img, and the post contract extended to related links, booking close and one H1 (3 pts, Medium; batched so it lands before NRD-127 and NRD-128 change post content); NRD-230 `og:url` omitted on `noindex` pages like the canonical (1 pt bug, Low).
- 2026-11-16 - NRD Sprint 11 (id 73) planned and started for 2026-11-16 to 2026-11-30 with 6 points (capacity 14), in execution order: NRD-228, NRD-229, NRD-230. The 8 free points are not filled: NRD-160 needs the owner's directory accounts, and every other unparked story is gated (indexation for NRD-125 to NRD-128, D1-D4 for M2, 2-4 weeks in production for NRD-78, the real-data decision for NRD-23, NRD-72 deferred). Backlog after the sprint: NRD-160, NRD-125, NRD-126, NRD-24/25/26, NRD-127, NRD-128, NRD-78, NRD-23, NRD-72, then parked.
- 2026-11-17 - NRD Sprint 11 closed with every item done: goal met, 6 of 6 points, velocity 6 (last 3 sprints 15, 7, 6; average 9.3, capacity 9), no spillover, no QA bugs. Low velocity again reflects a commitment below capacity, not a slower pace. Sprint 11 review follow-ups filed in epic NRD-162 (M4): NRD-235 (2 pts, Medium) and NRD-236 (1 pt, Low).
- 2026-11-17 - NRD Sprint 12 (id 74) planned and started for 2026-11-17 to 2026-12-01 with 3 points (capacity 9), in execution order: NRD-235, NRD-236. The 6 free points are not filled: NRD-160 needs the owner's directory accounts and every other unparked story is gated (indexation for NRD-125 to NRD-128, D1-D4 for M2, 2-4 weeks in production for NRD-78, the real-data decision for NRD-23, NRD-72 deferred). Backlog after the sprint: NRD-160, NRD-125, NRD-126, NRD-24/25/26, NRD-127, NRD-128, NRD-78, NRD-23, NRD-72, then parked.
- 2026-11-17 - NRD Sprint 12 closed with every item done: goal met, 3 of 3 points, velocity 3 (last 3 sprints 7, 6, 3; average 5.3, capacity 5), no spillover, no QA bugs. Low velocity again reflects a commitment below capacity, not a slower pace. The two LOW findings of the PR #92 reviewer (`URL.pathname` vs `fileURLToPath` in `scripts/check-seo-20.mjs`, `tests/og-url-guard.test.js` and the same pattern in `tests/store-offer.test.js`; `isNoindex` ignoring robots `content="none"`) are kept and folded into one story, NRD-239 (1 pt, Low, epic NRD-162): cheap risk reduction for a guard that can fail on a checkout path with spaces or accents and miss a future `none` directive. No user-facing change. The SEO report of 2026-11-17 brought no new candidate.
- 2026-11-17 - NRD Sprint 13 (id 75) planned and started for 2026-11-17 to 2026-12-01 with 1 point (capacity 5): NRD-239. The 4 free points are not filled: NRD-160 needs the owner's directory accounts and every other unparked story is gated (indexation for NRD-125 to NRD-128, D1-D4 for M2, 2-4 weeks in production for NRD-78, the real-data decision for NRD-23, NRD-72 deferred). Backlog after the sprint: NRD-160, NRD-125, NRD-126, NRD-24/25/26, NRD-127, NRD-128, NRD-78, NRD-23, NRD-72, then parked.
- 2026-11-17 - NRD Sprint 13 closed with every item done: goal met, 1 of 1 point, velocity 1 (last 3 sprints 6, 3, 1; average 3.3), no spillover, no QA bugs. The three LOW findings of the PR #94 review are not filed: QA verified the behaviour at the PR head and the rest is spec wording, so a story would add almost no value or risk reduction; they are picked up only if another story touches `scripts/lib/og-url.mjs` or that spec. This ends the chain of one-point follow-up sprints (Sprints 11-13).
- 2026-11-17 - NRD Sprint 14 is not created or started: no unparked story meets the Definition of Ready without an owner action (NRD-160 accounts, indexation for NRD-125 to NRD-128, D1-D4 for M2, the real-data decision for NRD-23, NRD-72 deferred) or time in production (NRD-78, earliest about 2026-11-30). Starting an empty or filler sprint would only spend review and QA effort. The next plan run creates Sprint 14 as soon as the owner unblocks a story, an SEO run brings an accepted candidate, or NRD-78 becomes due. Backlog order unchanged: NRD-160, NRD-125, NRD-126, NRD-24/25/26, NRD-127, NRD-128, NRD-78, NRD-23, NRD-72, then parked.
- 2026-11-17 - M2 unblocked: the owner answered D1 = A (GEO work included in Local Pro, no own price), D2 = "SEO para IA" with slug `/seo-para-ia/` and D4 = B (editorial hero, now the site-wide "Editorial Hero Rule" in `DESIGN.md`, PR #97). D3 (review and follow-up method) stays open and does not block: process steps 1 and 4 ship with generic wording, per the owner. Choosing slug and price variant is read as acceptance of ADR 0013 proposal P1. NRD-24 acceptance criteria refined to the M4 template (NRD-163 components, `SeoLocalHero`, `template-pages.mjs` word budget, sourced FAQ, step-8 checklist, Local Pro price from one source and no own `Offer`) instead of the October plan's `ServiceLayout`/`ServiceHero`; NRD-26 becomes `check-seo-21` inside `check:seo`, and the post-promotion Search Console baseline moves out of it to the M2 exit criterion. NRD-25 now blocks NRD-26.
- 2026-11-17 - NRD Sprint 14 (id 76) planned and started for 2026-11-17 to 2026-12-01 with 9 points, in execution order: NRD-24 (5, High), NRD-25 (2, High), NRD-26 (2, Medium); epic NRD-3 Low -> High. Capacity is taken as the 20-point pace of Sprints 1-9, not the 3.3 average of Sprints 11-13, because those sprints were limited by the lack of ready work, not by pace (see their entries). No filler: every other unparked story still waits on the owner or on time in production. Backlog after the sprint: NRD-160, NRD-125, NRD-126, NRD-127, NRD-128, NRD-78, NRD-23, NRD-72, then parked.
- 2026-11-17 - GEO audit improvements accepted from the owner (attended session; audit `geo-optimizer-skill` 4.19.7 on the home, 77/100: Google AI 81, ChatGPT 65, Perplexity 50). Filed in the backlog, label `seo`, not in NRD Sprint 14, ranked before NRD-160 in this order: NRD-241 canonical brand "Nuria Romero" and complete Organization node (2 pts, High, M2 epic NRD-3), NRD-242 real build-derived `dateModified` and visible "Actualizado", never a fake date (3, High, NRD-3), NRD-243 home "sevilla" density from 5.3 % to 2.5 % or less keeping keyword ownership (2, Medium, M1 epic NRD-2), NRD-244 blog RSS feed and `rel="alternate"` (2, Medium, NRD-3; a static endpoint without a new dependency, `@astrojs/rss` only with the owner's confirmation), NRD-245 template sections open with a 1-2 sentence direct answer (5, Medium, M4 epic NRD-162), NRD-247 contact form per-field error a11y (1, Low, bug, NRD-162), NRD-246 AI discovery files generated from `src/data` (3, Low, NRD-3: no major engine documents reading them). NRD-248 `sameAs` with real directory profiles (1, Low, NRD-3) sits after NRD-160, which blocks it; no Wikipedia or Wikidata profile is created. "About page not detected" is a tool false positive (`/sobre-mi/` exists) and is not filed.
- 2026-11-17 - NRD Sprint 14 closed with every item done: goal met, 11 points (9 committed + NRD-256, the owner's grouped services menu added during the sprint and estimated at 2 pts after the fact), velocity 11 (last 3 sprints 3, 1, 11; average 5), no spillover, no QA bugs. Review follow-ups: the pre-existing header navigation accessibility defects reported by the PR #104 review (collapsed mobile accordion links still tabbable, desktop dropdown without `aria-expanded` or Escape, mobile drawer without focus management, `aria-label` replacing visible link text, `ul` directly inside `ul`) are folded into one bug, NRD-259 (3 pts, Medium, epic NRD-162), because the header is on every page and WCAG 2.2 AA is a principle. The `check:capilar-local` failure found by QA (20 stale price and copy assertions, outside `check:seo` and CI) is filed as NRD-260 in the Parked epic with `needs-human`: deciding which CAPILAR LOCAL offer is true is a price decision on a parked page. NRD-261 (1 pt, Low, epic NRD-3) holds the M2 exit criterion moved out of NRD-26, the Search Console baseline of `/seo-para-ia/`, gated on promotion and indexation.
- 2026-11-17 - NRD Sprint 15 (id 77) planned and started for 2026-11-17 to 2026-12-01 with 18 points, in execution order: NRD-241 (2, High), NRD-242 (3, High; same `schema.ts` area as NRD-241), NRD-244 (2), NRD-259 (3), NRD-247 (1, Low -> Medium as current sprint work), NRD-245 (5), NRD-243 (2; after NRD-245 because both rewrite home copy and the density cut must keep the new direct-answer paragraphs). Capacity is again taken as the 20-point pace of Sprints 1-9 rather than the average of 5, for the reason recorded at Sprint 14 (Sprints 11-13 were limited by ready work, not pace). The 2 free points are a buffer: NRD-246 (3, Low, unproven value) does not fit and NRD-248 is blocked by NRD-160. Backlog after the sprint: NRD-246, NRD-160, NRD-248, NRD-261, NRD-125, NRD-126, NRD-127, NRD-128, NRD-78, NRD-23, NRD-72, then parked.
