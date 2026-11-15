# NRD-121 - `/diseno-web-sevilla/`: bring "diseño web sevilla" into title, H1 and H2 and keep software intent on its owner (phase 5, step 2)

## Why

[NRD-121](https://nuriaromerodev.atlassian.net/browse/NRD-121) (phase 5 step 2 of ADR 0013 "Orden de optimización (fase 5)"; draft in `docs/seo-audit/page-optimization-checklist.md` "Paso 2"; epic NRD-4). `diseño web sevilla` (880 searches a month) brings this page 4 impressions at position 60.8, against 145 for `diseñador web sevilla` (58.4) and 94 for `diseño paginas web sevilla` (60.2) in the window 2026-10-16 to 2026-11-12. The page never states the head term literally: title `Diseño web en Sevilla | Precio cerrado desde 149 €` (`src/data/services.ts:18`), H1 `Diseño web en Sevilla para negocios que quieren clientes, no solo una web bonita` (`:23`), H2s `Diseño web en Sevilla hecho por una programadora, no con plantillas` (`:32`) and `Preguntas frecuentes sobre diseño web en Sevilla` (`:35`). After `normaliseTerm` (`scripts/lib/keyword-ownership.mjs`) none contains `diseno web sevilla`, and "diseñador" appears once in `<main>` (a FAQ question). The page also takes 67 impressions of `aplicaciones web a medida sevilla` (70.8), an intent owned by `/desarrollo-software-medida/` (SW-1). The page is the registered owner of `diseño web sevilla` (`keywordOwners`, ADR 0012) and of cluster DW-1 (ADR 0013).

## What changes

1. **Evidence first (SEO-2).** One SERP read, `desarrollo web sevilla` (140 a month, KD 6, data 2026-09-17; ADR 0013 names it the next SERP to read because it sits between DW-1 and SW-1), recorded in `docs/seo-audit/keyword-clusters-2026-11.md` under "Diseño web" as "Dato observado (NRD-121, date)".
2. **Title, H1 and one H2 work the head term and its strongest variant (SEO-1).** Data only, in `disenoWeb` (`src/data/services.ts`): the title and the H1 carry the literal `Diseño web Sevilla`; the title and the benefits H2 carry "diseñadora web" (the variant `diseñador web sevilla`, 145 impressions). The FAQ H2 and the meta description stay (the description already leads with `Diseño páginas web en Sevilla`, the third variant).
3. **Registry and guards follow the copy.** The `/diseno-web-sevilla/` row of `intentMatrix` gets the new `titleSignal`/`h1Signal` and the new H2 as a content signal; `tests/seo-meta-titles.test.js` pins the new title; a new test file proves the term rules.
4. **Software intent stays on its owner (SEO-6).** Nothing new to add: table A row 1 (link to `/desarrollo-software-medida/`, anchor "aplicaciones web a medida para tu empresa") and row 4 (to `/portfolio/`) and the reciprocal pair already exist (NRD-119, `src/data/internal-links.ts`, `reciprocalLinks`). The new test asserts that no title, H1 or H2 of this page works "aplicaciones web a medida" or "software a medida", and `check-seo-06`/`07` keep the rows.

Unchanged: URL, prices and every price string (title keeps `desde 149 €` exactly as today, SEO-4; no price copy is added while S-2026-11-13-1 is open), `seo.description`, `breadcrumbName` (`check-seo-02` pins it), the page template `src/pages/diseno-web-sevilla.astro`, `public/llms.txt`, FAQ, `Service`/`FAQPage`/`BreadcrumbList` structure (the `Service` `name` follows `hero.h1` automatically).

## Out of scope

- Any price copy or the 800 to 5,000+ EUR range of the SERP AI answer (user decision S-2026-11-13-1).
- `diseño tienda online sevilla` (registered on `/tienda-online-sevilla/`): this page must not work it in title, H1 or H2 (G6 rule).
- Moving `aplicaciones web a medida sevilla` to this page: NRD-124 re-reads that SERP and the PO decides (ADR review trigger).
- `src/pages/diseno-web-sevilla.astro` markup and its `dark:` classes (NRD-14).

## Requirements and scenarios

"Works a term" in this story means, after `normaliseTerm`, the element contains the term as a contiguous phrase (the G6 form, `findOwnershipViolations`). "Carries the variant" means the normalised element matches `/\bdisenador(a)? web\b/` and contains `sevilla`.

### Requirement: SERP evidence recorded before the copy (SEO-2)

The story SHALL record, in `docs/seo-audit/keyword-clusters-2026-11.md` section "Diseño web", a "Dato observado (NRD-121, YYYY-MM-DD), `desarrollo web sevilla`" entry with: source (DataForSEO `serp/google/organic/live/advanced`, Seville, `es`, mobile, task id; or the scheduled SEO report in `.claude/state/seo/` if it holds that SERP and is at most 7 days old), local pack (names, review counts), organic domains in order with page type, AI Overview presence, and an **Inferencia** line saying whether the SERP is web-design (DW-1) or software (SW-1). One call (`seo.dataforseo.maxCallsPerRun` 30). On failure: "sin dato (<error>)", the copy still ships with the recorded DW-1 evidence (local pack Gráfica Estudio Creativo 15, Diseño Web Sevilla 13, Starenlared 77; organic `sortlist.es`, `lsjestudio.com`, `metricweb.es`, `designcloud.es`, `creadorpaginaswebsevilla.es`, `agencianewmar.es`; S3, S5), stated as such in the PR.

#### Scenario: reading is web design

- WHEN the SERP is led by web-design pages
- THEN the entry says so and the developer may add "desarrollo web" once to the running copy of this page (a benefit or FAQ answer, never title, H1 or H2); no term is registered

#### Scenario: reading is software

- WHEN the SERP is led by software firms
- THEN the entry says so, no copy of this page changes for it, and the subtask comment flags it for NRD-124

### Requirement: title, H1 and one H2 work `diseño web sevilla` and carry `diseñador web sevilla` (SEO-1)

`disenoWeb.seo.title` SHALL work `diseño web sevilla`, carry the variant, keep the substring `desde 149 €`, and be at most 65 characters. `disenoWeb.hero.h1` SHALL work `diseño web sevilla`. Exactly one H2 of the page (`disenoWeb.sectionTitles.benefits`) SHALL carry the variant. Tech Lead proposal (the UI spec may refine wording within these rules): title `Diseño web Sevilla | Diseñadora web, precio cerrado desde 149 €` (63 characters); H1 `Diseño web Sevilla para negocios que quieren clientes, no solo una web bonita` (the current H1 minus "en", so the LCP element keeps its length); benefits H2 `Diseñadora web en Sevilla que programa tu página, sin plantillas` (64; refined by the UI spec, accepted by the Tech Lead: use this exact string in `sectionTitles.benefits`, `contentSignals` and the test). "Diseñadora" is the truthful form for Nuria; it shares the stem Google matches for "diseñador".

#### Scenario: title

- WHEN the built `<title>` of `/diseno-web-sevilla/` is read
- THEN it works `diseño web sevilla`, carries the variant, contains `desde 149 €` and is at most 65 characters

#### Scenario: H1 and H2

- WHEN the built page is read
- THEN there is exactly one `<h1>` (NRD-118), it works `diseño web sevilla`, and exactly one `<h2>` carries the variant

#### Scenario: ownership (G6)

- WHEN `pnpm check:seo-07:dist` runs NRD-117's rule
- THEN no other page works `diseño web sevilla` in title, H1 or H2, and this page works no other owner's term (in particular `diseño tienda online sevilla` and `desarrollo de software a medida sevilla`)

#### Scenario: software intent not targeted here

- WHEN the new test reads `disenoWeb` title, H1 and `sectionTitles`
- THEN none contains "aplicaciones web a medida" or "software a medida" (normalised), and `internalLinksBySource["/diseno-web-sevilla/"]` still holds the `/desarrollo-software-medida/` and `/portfolio/` rows

### Requirement: prices untouched (SEO-4, DEL-5)

No price string in `disenoWeb` (`pricing`, `faqs`, `seo`) SHALL change; `tests/single-price-source.test.js` passes unchanged and the `llms.txt` line of the page keeps `149 €` and `399 €`. No ranking or result is promised.

#### Scenario: price strings

- WHEN `tests/single-price-source.test.js` and the new test run
- THEN they pass, and the new test asserts the title still contains `desde 149 €` and the `llms.txt` line of `https://nuriaromero.dev/diseno-web-sevilla/` contains `149 €` and `399 €`

### Requirement: registry signals follow the copy (SEO-1, check-seo-07)

The `/diseno-web-sevilla/` row of `intentMatrix` (`src/data/seo-intents.ts`) SHALL use `titleSignal: "Diseño web Sevilla"`, `h1Signal: "Diseño web Sevilla para negocios"` and SHALL add the new benefits H2 to `contentSignals`, keeping the two existing signals.

#### Scenario: build checks

- WHEN `pnpm build && pnpm check:seo:dist` runs
- THEN every check passes (02, 06, 07 with NRD-116/117 rules, 08, 11, one-H1)

## Files

| Layer | Action | Path                                         | Notes                                                                            |
| ----- | ------ | -------------------------------------------- | -------------------------------------------------------------------------------- |
| `app` | modify | `docs/seo-audit/keyword-clusters-2026-11.md` | "Dato observado (NRD-121, date)" for `desarrollo web sevilla` (task 1.1)         |
| `app` | modify | `src/data/services.ts`                       | `disenoWeb.seo.title`, `hero.h1`, `sectionTitles.benefits` (task 1.2)            |
| `app` | modify | `src/data/seo-intents.ts`                    | `/diseno-web-sevilla/` row signals (task 1.2)                                    |
| `app` | create | `tests/diseno-web-sevilla-intent.test.js`    | term, variant, software-not-targeted, price and `llms.txt` assertions (task 1.2) |
| `app` | modify | `tests/seo-meta-titles.test.js`              | `expectedTitles.disenoWeb` pin updated to the new title (task 1.2)               |

`src/pages/diseno-web-sevilla.astro`, `src/data/internal-links.ts`, `public/llms.txt`: read only. If task 1.1 leads to one "desarrollo web" mention, it goes in a `disenoWeb.benefits` or `faqs` string of `src/data/services.ts` (same task).

## Interfaces

```js
// tests/diseno-web-sevilla-intent.test.js
import { normaliseTerm } from "../scripts/lib/keyword-ownership.mjs";
const worksPhrase = (text, term) =>
  normaliseTerm(text).includes(normaliseTerm(term));
const carriesVariant = (text) =>
  /\bdisenadora? web\b/.test(normaliseTerm(text)) &&
  normaliseTerm(text).includes("sevilla");
// disenoWeb is read from src/data/services.ts with a small regex per field
// (like tests/seo-meta-titles.test.js extractSeoBlocks), or via dynamic import of the .ts file
```

## Data

Static copy in `src/data/services.ts` and `src/data/seo-intents.ts`. No storage, schema, settings or price change.

## Test plan (TDD order)

1. Task 1.1 (docs, no test): SERP read and entry; subtask comment lists source, date, task id and call count.
2. Task 1.2 (RED first):
   - Create `tests/diseno-web-sevilla-intent.test.js`: (a) title works `diseño web sevilla`, carries the variant, contains `desde 149 €`, length <= 65; (b) H1 works `diseño web sevilla`; (c) exactly one of `sectionTitles` carries the variant; (d) no title/H1/section title contains "aplicaciones web a medida" / "software a medida"; (e) `internal-links.ts` keeps the two rows; (f) `llms.txt` line keeps `149 €` and `399 €`. (a) to (c) fail on today's copy.
   - Update `tests/seo-meta-titles.test.js` `expectedTitles.disenoWeb` (fails until the data changes).
   - Then `src/data/services.ts` and `src/data/seo-intents.ts` (GREEN).
   - `node --test tests/*.test.js`; `pnpm build && pnpm check:seo:dist`.
3. Format only edited files.

## Real-browser / e2e checks

- 375 px: the H1 (`h1.text-4xl` in `ServiceHero`) wraps without overflow; the benefits H2 fits.
- LCP and CLS: the H1 is the LCP element (median 1.78 s, NRD-18). Re-measure mobile LCP and CLS on the built page; record the element and value in the PR.
- Heading outline: one H1, the benefits H2 first after the "¿Tu web actual no te trae clientes...?" section.
- Rich Results Test or Schema Markup Validator on the built page: `Service`, `FAQPage`, `BreadcrumbList` with 0 errors (GEO-4).
- Specialist reviews (DEL-6): `seo-review` with the task 1.1 evidence, `ux-review`, `a11y-responsive`.

## Owner-account actions (executed by the orchestrator)

- Search Console URL inspection and "Request indexing" for `https://nuriaromero.dev/diseno-web-sevilla/` after the scheduled promotion to `main` that contains this story: **executable owner action** (configured Search Console API first, then the signed-in browser in an attended session, else queued in `.claude/state/attended-actions.json`).

## Risks

- **Gendered variant.** The query is "diseñador"; the copy says "diseñadora" (truthful). The home uses the masculine "Consultor SEO" for its keyword, so the PO may prefer the masculine form here; that is a copy/positioning call, not technical. The tests accept both.
- **Overlap with NRD-123/NRD-124.** All three edit `src/data/services.ts`, `src/data/seo-intents.ts` and the same pinned-title test in `tests/seo-meta-titles.test.js` (different entries). Run in rank order; NRD-121 `Blocks` NRD-124 (shared reciprocal pair and the `aplicaciones web a medida sevilla` ownership read).
- **Size.** The change is data and tests only (no new section, no markup). 5 points looks high; 3 would fit unless the UI spec adds copy.
- **Evidence gap.** If the SERP read fails, the copy still ships with the S3/S5 evidence, stated in the PR.

## ADRs

Relies on [0012](../adr/0012-keyword-ownership-registry.md), [0013](../adr/0013-seo-site-architecture.md) (DW-1 owner, "Registered term inside a merged cluster (TO-1)", candidate `desarrollo web sevilla`), [0004](../adr/0004-seo-head-and-structured-data.md), [0008](../adr/0008-spanish-copy-english-code.md), [0003](../adr/0003-single-app-layer-and-src-data.md). No new ADR.

## UI spec

Scope: copy only, on `/diseno-web-sevilla/`. The page lives in the older Tailwind gray world (DESIGN.md "Known Drift: two styling worlds coexist"), not in the "Annotated Storefront" world of `/seo-local-sevilla/`: do not port `.kw`, `.display`, the serif accent or ink tokens here. No markup, class, token, component, icon, illustration or motion change; `src/pages/diseno-web-sevilla.astro`, `src/layouts/ServiceLayout.astro`, `src/components/services/ServiceHero.astro` and `src/components/TitleSection.astro` stay byte-identical. Mode: persuade (the visitor compares and books a call).

### 1. Document title (`disenoWeb.seo.title`, rendered by `src/components/seo/SEO.astro`)

- Exact string: `Diseño web Sevilla | Diseñadora web, precio cerrado desde 149 €` (63 characters). Assumption: TL proposal kept; head term first for the SERP, the variant right after the separator, and the existing price promise ("precio cerrado", "desde 149 €") unchanged in meaning and form.
- Visible only in the browser tab and the SERP; no on-page impact. States: n/a.

### 2. Hero H1 (`disenoWeb.hero.h1`, rendered by `ServiceHero.astro`, `h1.text-4xl.sm:text-5xl.font-bold.tracking-tight`)

- Exact string: `Diseño web Sevilla para negocios que quieren clientes, no solo una web bonita` (77 characters, today 80). Assumption: TL proposal kept verbatim. A colon after "Sevilla" would read more naturally in Spanish, but it would break the registered `h1Signal` `Diseño web Sevilla para negocios` that the design pins; not worth the risk for one character.
- Hierarchy unchanged: H1 is the main information and the LCP element; then the subtitle (`text-xl`, `max-w-2xl`), then the `BookingButton` primary action and the "Ver precios" text link to `#precios`. Subtitle and CTA copy unchanged.
- Responsive: the H1 sits in `SectionContainer` (`container`, `md:max-w-2xl`, `lg:max-w-4xl`) inside `main.px-4`. At 320 px (about 288 px measure, 36 px type) it wraps to about 6 lines, at 375 px to about 5; the longest word ("clientes,") fits, so no horizontal scroll and no hyphenation is needed. From 640 px (`sm:text-5xl`) through the `md`/`lg` containers it takes 3 lines or fewer. The string is 3 characters shorter than today, so the hero can lose a line but never gain one; no CLS from the change. No `text-wrap`, font-size or line-height change.
- States: static data, n/a.

### 3. Benefits H2 (`disenoWeb.sectionTitles.benefits`, rendered by `ServiceLayout.astro` through `TitleSection.astro` with `src/components/icons/ProfileCheck.astro`, `size-8`)

- Exact string: `Diseñadora web en Sevilla que programa tu página, sin plantillas` (64 characters). Assumption: refines the TL proposal `...que programa tu web, sin plantillas` to avoid "web" twice in an eight-word heading; it still carries the variant (`disenadora web` + `sevilla` after `normaliseTerm`), keeps the "a programmer, not templates" claim of today's H2, works no other owner's term and contains neither "aplicaciones web a medida" nor "software a medida". The developer uses this same string in the `/diseno-web-sevilla/` `contentSignals` of `intentMatrix` and in the new test.
- Placement unchanged: first section after the `before-benefits` slot ("¿Tu web actual no te trae clientes, o todavía no tienes una?"), above `BenefitsGrid`. Benefit titles and texts unchanged (except the conditional case in 4).
- Responsive: `TitleSection` is `flex items-center gap-x-3 text-3xl`; at 320 px the text column (about 244 px next to the 32 px icon) wraps to about 5 lines with the icon vertically centred, as today's 68-character heading does; the new string is shorter. Larger widths: only fewer lines.
- States: static data, n/a.

### 4. Conditional "desarrollo web" mention (only if task 1.1 reads the SERP as web design)

- Location: `disenoWeb.benefits[0].text` ("Construida pensando en los Core Web Vitals de Google"). Replace the sentence `Diseño y programo cada proyecto para cumplir esos tres puntos desde el primer día, sin plugins de sobra que la frenen.` with `Me encargo del diseño y del desarrollo web de cada proyecto para cumplir esos tres puntos desde el primer día, sin plugins de sobra que la frenen.` The rest of the text stays. Assumption: running copy, one mention, first person and truthful; never in title, H1 or H2.
- Reading is software, or the SERP read fails: no copy change here.

### 5. Design system reuse

Existing pieces only, untouched: `src/components/services/ServiceHero.astro` (H1 classes above), `src/components/TitleSection.astro` (H2 with icon), `src/components/SectionContainer.astro`, the benefits grid and booking button as rendered by `src/layouts/ServiceLayout.astro` and `ServiceHero.astro`. No token added or changed (`tailwind.config.mjs` untouched). New component: none.

### 6. Interactions

n/a: no interactive element changes. The "Ver precios" link and the booking button behave as today.

### 7. Accessibility hand-off

- Heading outline stays: one `h1` (hero), then the `before-benefits` H2, the benefits H2, process, pricing, FAQ and the rest as today. Only text changes, so the headings' accessible names follow the new strings; the `ProfileCheck` icon keeps its current treatment.
- The page `lang="es"` covers the copy; no extra markup.
- Real-browser checks for QA (already in the design): 375 px wrap of the H1 and the benefits H2 without overflow; LCP and CLS re-measured on the H1.

## Tasks

- [x] 1.1 [NRD-146 app] Read the SERP of `desarrollo web sevilla` and record it in `docs/seo-audit/keyword-clusters-2026-11.md`; tests: none (docs), source, date and task id in the subtask comment.
- [ ] 1.2 [NRD-147 app] Title, H1 and benefits H2 work `diseño web sevilla` and carry "diseñadora web"; tests: new `tests/diseno-web-sevilla-intent.test.js` and the `seo-meta-titles` pin first (RED), then `services.ts` and the `intentMatrix` row.
