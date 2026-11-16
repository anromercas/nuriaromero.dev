# NRD-120 - `/seo-local-sevilla/`: work "agencia seo sevilla" and "posicionamiento web sevilla" without losing the price intent (phase 5, step 1)

## Why

[NRD-120](https://nuriaromerodev.atlassian.net/browse/NRD-120) (phase 5 step 1 of ADR 0013 "Orden de optimización (fase 5)"; draft in `docs/seo-audit/page-optimization-checklist.md` "Paso 1"; epic NRD-4). `agencia seo sevilla` (1,000 searches a month) and `posicionamiento web sevilla` (320) have no impressions on the owner page in the window 2026-10-16 to 2026-11-12, while `plan seo sevilla` (45 impressions, position 40.5) and `presupuesto seo sevilla` (37, 48.7) do and `seo local sevilla` has 76 at 32.5. Today the page names "posicionamiento web en Sevilla" only in one H2 (`ReviewBento.astro:6`), the hero subtitle and one FAQ answer; "agencia" appears once, in the FAQ question "¿Eres una agencia de SEO local?", whose answer says "No, soy consultora SEO". The page is the registered owner of `seo local sevilla`, `agencia seo sevilla` and `posicionamiento web sevilla` (`keywordOwners`, ADR 0012) and of clusters SL-1, SL-3 and TO-3 (ADR 0013).

## What changes

1. **Evidence first (SEO-2).** Re-read three SERPs and record them with date and source in `docs/seo-audit/keyword-clusters-2026-11.md`: `agencia seo sevilla` (SL-1), `presupuesto seo sevilla` (SL-3, the second price SERP the cluster lacks) and `seo para tiendas woocommerce en sevilla` (TO-3).
2. **Title and H1 work `posicionamiento web sevilla`** and keep the literal brand head `SEO local Sevilla` (the only term with impressions; it is also the `titleSignal`/`h1Signal` of `intentMatrix` and the `check-seo-15` H1 assertion).
3. **One new section answers the agency intent honestly.** A new component `SeoLocalAgencia.astro` with the keyword H2 "¿Agencia SEO en Sevilla o consultora?", a display line and two or three short, self-contained paragraphs that explain what changes for a Seville business between hiring an agency and working directly with the consultant who does the work. It never says or implies that Nuria is an agency.
4. **Direct price answer (SL-3, GEO-1).** Under the existing H2 "Cuánto cuesta el SEO local en Sevilla" a lede whose first two sentences answer the question, built from `seoLocal.pricing.tiers` (no price literal in a component).
5. **Guards.** New and updated tests (see Test plan); `check-seo-15` asserts the new H1, title and agency H2; the `/seo-local-sevilla/` row of `intentMatrix` gains the new H2 as a content signal.

Unchanged: URL, prices (300 and 500 €/mes + IVA), plans, NAP, `Service`/`FAQPage`/`BreadcrumbList`, the two spoke links (Google Maps guide, SEO local and GEO guide), the `llms.txt` entry text (it already lists both published prices and "Sin promesas de posiciones"), the meta description (146 characters, already within 140-160 with Google Maps and both prices; the developer may improve it within `tests/seo-consultor-strategy.test.js:19` limits but it is not required).

## Out of scope

- Calling Nuria an agency anywhere, or putting "agencia" in the `<title>` or H1 (see Risks, "Interpretation of SEO-1"; flagged to the PO).
- The home H2 "Posicionamiento web en Sevilla: cómo trabajo" (pinned by `tests/seo-meta-titles.test.js:132`): it works the term with the connector "en", which the literal G6 rule (NRD-117) does not flag. It is the home page's story (step 3) or a PO decision, not this story's.
- New prices, plans, page, URL or redirects (DEL-7, DEL-8). Word-count target (none is set: the only competitor length is an estimate).
- Row 7 of ADR 0013 table A (the TO-3 link from `/tienda-online-sevilla/`): delivered by NRD-119; this story only verifies it.

## Requirements and scenarios

### Requirement: SERP evidence recorded before the copy (SEO-2)

The story SHALL record, in `docs/seo-audit/keyword-clusters-2026-11.md` under SL-1, SL-3 and TO-3, a "Dato observado (NRD-120, YYYY-MM-DD)" entry per SERP with: source (DataForSEO `serp/google/organic/live/advanced`, Seville, `es`, mobile; or the scheduled SEO report in `.claude/state/seo/` if it holds that SERP and is at most 7 days old), local pack (business names and review counts), organic domains in order with page type, AI Overview presence. Three calls at most (`seo.dataforseo.maxCallsPerRun` is 30). If a call fails, the entry says "sin dato (<error>)"; no figure is estimated. The SL-3 and TO-3 verdicts ("provisional") are updated only if the new reading supports it, stated as Inferencia.

#### Scenario: SL-1 re-read

- WHEN the `agencia seo sevilla` SERP is read
- THEN the entry names by domain, with date, the pages that rank, and compares them with the 2026-11-13/14 reading (local pack Starenlared 77, Posiciona Tu Web Sevilla 27, Slocal 4; organic Momo & Cía, Prismalia, Sortlist, `seosevilla.net`, `docseo.es`)

#### Scenario: tool unavailable

- WHEN DataForSEO is unavailable and no report of the last 7 days has the SERP
- THEN the entry records "sin dato" with the reason, the subtask comment says so, and `seo-review` is told the competitor evidence is the 2026-11-13/14 reading

### Requirement: title and H1 work `posicionamiento web sevilla` and keep `SEO local Sevilla` (SEO-1)

`seoLocal.seo.title` SHALL contain the literal `SEO local Sevilla`, all words of `posicionamiento web sevilla` and the Local price, at most 65 characters. `seoLocal.hero.h1` SHALL contain the literal `SEO local Sevilla` and all words of `posicionamiento web sevilla`. Tech Lead proposal (the UI spec may refine the wording within these rules): title `SEO local Sevilla y posicionamiento web | Desde 300 €/mes + IVA` (63 characters), H1 `SEO local Sevilla y posicionamiento web` (39). "Works a term" in this story's tests means: after `normaliseTerm` (lowercase, accents folded, punctuation to spaces) every word of the term occurs in the element.

#### Scenario: title

- WHEN the built `<title>` of `/seo-local-sevilla/` is read
- THEN it includes `SEO local Sevilla`, works `posicionamiento web sevilla`, includes `300 €/mes` and is at most 65 characters

#### Scenario: H1

- WHEN the built page is read
- THEN there is exactly one `<h1>` (NRD-118 site-wide, `check-seo-15` page-specific), it matches `/SEO local Sevilla/` and it works `posicionamiento web sevilla`

### Requirement: an H2 works `agencia seo sevilla` without claiming to be an agency (SEO-1, honesty)

The page SHALL have exactly one H2 that works `agencia seo sevilla` (proposal: `¿Agencia SEO en Sevilla o consultora?`), rendered by the new `SeoLocalAgencia.astro`, followed by a display line and two or three paragraphs whose first two sentences each stand alone (GEO-1). The section MUST contain "consultora" and MUST NOT contain a self-description as an agency (`/\b(?:soy|somos) (?:una |tu )?agencia\b/i`, `/\bnuestra agencia\b/i`) or a promised result (the `check-seo-15` `positivePromise` regex). Outside this section, "agencia" appears only in the FAQ question "¿Eres una agencia de SEO local?", whose answer keeps "No, soy consultora SEO". The existing H2 "Posicionamiento web en Sevilla: Google y Google Maps" stays the only H2 naming "posicionamiento web en Sevilla" (`check-seo-15` line 39 and `tests/seo-local-posicionamiento-web.test.js` first test).

#### Scenario: agency H2

- WHEN the H2 texts of the built page are read
- THEN exactly one works `agencia seo sevilla`, and no H1-H3 says Nuria is an agency

#### Scenario: honesty guard

- WHEN `tests/seo-local-posicionamiento-web.test.js` runs
- THEN "agencia" occurs only in the FAQ question and in `SeoLocalAgencia.astro`, the self-description regexes do not match anywhere in `seoLocal` data or `src/components/seo-local/*.astro`, and the new component contains "consultora"

#### Scenario: ownership stays with the owner (G6)

- WHEN `check-seo-07` runs NRD-117's rule
- THEN no page other than `/seo-local-sevilla/` carries any of its three registered terms (literal) in title, H1 or H2

### Requirement: price intent kept and answered first (SEO-4, DEL-5, SL-3)

The pricing section SHALL keep 300 €/mes + IVA and 500 €/mes + IVA from `seoLocal.pricing.tiers`, the note "Se factura mes a mes y no hay cuota de puesta en marcha aparte." and the H2 "Cuánto cuesta el SEO local en Sevilla", and SHALL add, right after the display line, a lede whose first sentence states both prices, composed in `SeoLocalPlans.astro` from the tier data (proposal: `El SEO local en Sevilla cuesta {Local.from} con el plan Local, centrado en tu ficha de Google, y {Local Pro.from} con Local Pro, que suma el trabajo en tu web.`). No price literal is added to any component. No ranking or result is promised.

#### Scenario: price answer

- WHEN the built page is read
- THEN the first sentence after the "Cuánto cuesta el SEO local en Sevilla" H2's display line contains `300 €/mes + IVA` and `500 €/mes + IVA`, and `check-seo-15` (prices, legacy amounts, promises) passes

#### Scenario: single price source

- WHEN `tests/single-price-source.test.js` and `tests/seo-local-sevilla-redesign.test.js` run
- THEN they pass unchanged, and a new assertion proves `SeoLocalPlans.astro` reads the lede prices from `tiers` (no `300 €` / `500 €` literal in the component)

### Requirement: links, entity and structured data intact (SEO-6, GEO-2 to GEO-4)

The page SHALL keep linking, inside `<main>`, to `/blog/como-aparecer-en-google-maps-negocio-sevilla/` and `/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/` (existing rows and `reciprocalLinks`, `check-seo-06/07` with NRD-116's rule) and SHALL receive the row-7 link from `/tienda-online-sevilla/` (NRD-119). NAP, `Service` with both offers, `FAQPage` equal to the visible FAQ and `BreadcrumbList` stay as today (`check-seo-02`, `08`, `10`, `11`, `15`). The `public/llms.txt` entry SHALL keep the URL and both published prices; this story's test asserts it.

#### Scenario: llms.txt entry

- WHEN the new test reads `public/llms.txt`
- THEN the line with `https://nuriaromero.dev/seo-local-sevilla/` contains `300 €/mes + IVA` and `500 €/mes + IVA` and no promise of position

#### Scenario: checks

- WHEN `pnpm build && pnpm check:seo:dist` runs
- THEN every check passes

## Files

| Layer | Action | Path                                             | Notes                                                                                                                           |
| ----- | ------ | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `app` | modify | `docs/seo-audit/keyword-clusters-2026-11.md`     | SL-1, SL-3, TO-3 "Dato observado (NRD-120, date)" entries (task 1.1)                                                            |
| `app` | modify | `src/data/services.ts`                           | `seoLocal.seo.title`, `seoLocal.hero.h1` (task 1.2)                                                                             |
| `app` | modify | `src/data/seo-intents.ts`                        | `/seo-local-sevilla/` row: add the agency H2 to `contentSignals` (task 1.3); `titleSignal`/`h1Signal` unchanged                 |
| `app` | create | `src/components/seo-local/SeoLocalAgencia.astro` | agency-vs-consultant section: `kw` H2, `display` line, 2-3 paragraphs, scoped styles in the page's language (task 1.3)          |
| `app` | modify | `src/pages/seo-local-sevilla.astro`              | render `SeoLocalAgencia` in the `before-pricing` slot after `RealProof` (task 1.3; position may be refined by the UI spec)      |
| `app` | modify | `src/components/seo-local/SeoLocalPlans.astro`   | price lede computed from `tiers` (task 1.3)                                                                                     |
| `app` | modify | `tests/seo-local-posicionamiento-web.test.js`    | title/H1 term tests (1.2); honesty guard rewritten, agency H2 test, lede-from-data test, `llms.txt` test (1.3)                  |
| `app` | modify | `tests/seo-local-ficha-redesign.test.js`         | T7 pins of `title:` and `h1:` (lines 308 and 310) updated to the new values (1.2); new component follows `kw` + `display` (1.3) |
| `app` | modify | `scripts/check-seo-15.mjs`                       | title and H1 work `posicionamiento web` (1.2); one H2 works the agency term, no self-description (1.3)                          |

`public/llms.txt` is read, not written (wording unchanged unless the developer must change it to stay consistent; then the `single-price-source` test still applies).

## Interfaces

```astro
---
// src/components/seo-local/SeoLocalAgencia.astro: no props; copy lives in the component (Spanish),
// like ReviewBento/RealProof; no price, phone or address literal (Data lives in src/data).
---

<section
  id="agencia-o-consultora"
  class="agencia scroll-m-20"
  aria-labelledby="agencia-title"
>
  <h2 id="agencia-title" class="kw">
    ¿Agencia SEO en Sevilla o consultora?
  </h2>
  <p class="display">...</p>
  <p>...</p>
</section>
```

```js
// SeoLocalPlans.astro frontmatter
const local = tiers.find((tier) => tier.name === "Local");
const pro = tiers.find((tier) => tier.name === "Local Pro");
// lede rendered only when both exist
```

Test helper (inside `tests/seo-local-posicionamiento-web.test.js`, or imported from NRD-117's `scripts/lib/keyword-ownership.mjs` `normaliseTerm` once merged):

```js
const worksTerm = (text, term) =>
  normaliseTerm(term)
    .split(" ")
    .every((word) => ` ${normaliseTerm(text)} `.includes(` ${word} `));
```

## Data

Static data only (`src/data/services.ts`, `src/data/seo-intents.ts`); no storage, schema or settings. No price changes.

## Test plan (TDD order)

1. Task 1.1 (docs, no test): SERP readings recorded; the subtask comment lists sources, dates and call count. Its findings may refine the agency section's angle (what agency pages and listicles promise, which questions the AI Overview answers); they never introduce figures that are not sourced.
2. Task 1.2 (RED first):
   - `tests/seo-local-posicionamiento-web.test.js`: new test "title and H1 work posicionamiento web sevilla and keep SEO local Sevilla" reading `seoLocal` from `src/data/services.ts` (title literal, `worksTerm`, `300 €/mes`, length <= 65; H1 literal and `worksTerm`). Fails on today's copy.
   - `tests/seo-local-ficha-redesign.test.js` T7: update the `title:` and `h1:` pins to the new strings (fails until data changes).
   - `scripts/check-seo-15.mjs`: H1 also matches `/posicionamiento web/i`; title matches `/SEO local Sevilla/` and `/posicionamiento web/i`.
   - Then `src/data/services.ts` (GREEN); `pnpm build`, `node scripts/check-seo-15.mjs`, `check-seo-07`, `check-seo-02` green.
3. Task 1.3 (RED first):
   - Honesty test rewritten as in the requirement (allowed places, self-description regexes, "consultora" in the new component); new test: exactly one H2 across `src/components/seo-local/*.astro` works `agencia seo sevilla` and it is in `SeoLocalAgencia.astro`; new test: `SeoLocalPlans.astro` composes the lede from `tiers` and has no `300 €`/`500 €` literal; new test: the `llms.txt` line of the page has both prices; `tests/seo-local-ficha-redesign.test.js`: the new component has `<h2 id="agencia-title" class="kw">` followed by `class="display"`, no `<h1`, `.kw` style as the other sections; `tests/seo-local-sevilla-redesign.test.js` order assertion extended so `<SeoLocalAgencia` sits after `<RealProof` and before `<SeoLocalPlans` (if the UI spec keeps that position).
   - `scripts/check-seo-15.mjs`: one H2 works the agency term; no self-description regex match in the page text.
   - Then the component, the page slot, the plans lede and the `contentSignals` entry (GREEN).
   - `pnpm build && pnpm check:seo:dist` (all checks, including NRD-116/117/118 rules), `node --test tests/*.test.js`.
4. Format only edited files (`pnpm format <file>`).

## Real-browser / e2e checks

- 375 px: hero with the longer H1 (39 characters) wraps cleanly above the display title; the new section and the plans lede reflow with no horizontal scroll; the FAQ still opens with keyboard.
- LCP and CLS: the LCP element today is `p.display` in the hero (NRD-18, NRD-50 baselines). Re-measure mobile LCP and CLS on the built page; if the LCP element changes because the H1 wraps, record it in the PR.
- Focus visibility on any link or button added in the new section; heading outline (one H1, the new H2 between "Webs de negocios locales en Sevilla" and "Cuánto cuesta el SEO local en Sevilla").
- Rich Results Test or Schema Markup Validator on the built page: `Service`, `FAQPage`, `BreadcrumbList` with 0 errors (GEO-4).
- Specialist reviews (DEL-6): `seo-review` with the SERP evidence of task 1.1, `ux-review` against the UI spec and `DESIGN.md`, `a11y-responsive`.

## Risks

- **Interpretation of SEO-1 ("title, H1 and at least one H2 work `agencia seo sevilla` and `posicionamiento web sevilla`").** Read as: across title, H1 and H2, both terms are worked; `posicionamiento web` in title, H1 and the existing H2; `agencia` in one H2. Putting "agencia" in the title or H1 would contradict the positioning decided in NRD-33 (design NRD-33: "MUST NOT call her an agencia"; `tests/seo-local-posicionamiento-web.test.js` "copy stays honest"; Person `jobTitle` "Consultor SEO y desarrolladora web freelance"). This design rewrites that honesty test to allow the comparative H2 and section while still banning any self-description as an agency. **Flagged to the PO**: if the PO wants "agencia" in the title or H1, that is a positioning decision for the user, not a technical one.
- **Literal G6 vs natural phrasing.** NRD-117 matches the term literally; the home's H2 "Posicionamiento web en Sevilla: cómo trabajo" competes for `posicionamiento web sevilla` with the connector "en" and is pinned by `tests/seo-meta-titles.test.js:132`. SEO-1's "no other page works those terms (G6 rule green)" holds literally; the PO decides whether step 3 (home) removes it.
- **Order and file overlaps.** Blocked by NRD-112, NRD-113, NRD-118 and NRD-119 (existing links). `src/data/seo-intents.ts` also changes in NRD-119 (other rows; NRD-119 first). `scripts/check-seo-15.mjs` keeps its line-9 H1 assertion next to NRD-118's site-wide rule (no conflict). NRD-115 touches `check-seo-02.mjs`, not edited here.
- **UI.** New section and a longer H1: `team-harness:ux-designer` should write the `## UI spec` (section placement, display line, paragraph rhythm, copy within the rules above).
- **Evidence gap.** If the SERP re-read fails, the copy still ships with the 2026-11-13/14 evidence, stated as such in the PR.

## ADRs

- Relies on [0012](../adr/0012-keyword-ownership-registry.md) (owner terms in title, H1, H2), [0013](../adr/0013-seo-site-architecture.md) ("One page, two intents (SL-1 and SL-3)", owner map), [0004](../adr/0004-seo-head-and-structured-data.md), [0008](../adr/0008-spanish-copy-english-code.md), [0003](../adr/0003-single-app-layer-and-src-data.md) (prices from data). No new ADR.

## UI spec

Scope: three UI changes on `/seo-local-sevilla/`, all inside the established "Annotated Storefront" world of `DESIGN.md` (this page is its reference). No new tokens, no new shared component, no new colour, no illustration, no motion. Mode: persuade (the visitor decides and books a call). Values below are the ones already copied per component in `src/components/seo-local/*.astro` (DESIGN.md "Known Drift: page-scoped tokens"); reuse them verbatim.

### 1. Hero keyword heading and title (`src/data/services.ts`, rendered by `src/components/seo-local/SeoLocalHero.astro`)

- `seoLocal.hero.h1`: `SEO local Sevilla y posicionamiento web`. `seoLocal.seo.title`: `SEO local Sevilla y posicionamiento web | Desde 300 €/mes + IVA` (63 characters). Assumption: both TL proposals kept as written; "y" reads naturally, keeps the literal brand head first and stays under 65 characters.
- No markup or style change in `SeoLocalHero.astro`. The h1 stays the small keyword heading (`.kw`, 1.0625rem, weight 600, rgb(203 213 225)) above the unchanged `p.display` ("Tu negocio está en Sevilla. La pregunta es si te encuentran cuando importa.", accent "cuando importa"). Hierarchy unchanged: the display line stays the visual lead and the LCP candidate.
- Responsive: at 320-375 px the h1 wraps to two lines; this adds one line (about 1.4rem) above the display and nothing else moves. From 768 px (two-column hero) it may still wrap to two lines inside the 1.05fr column; acceptable. No `text-wrap` or font-size change.
- States: static data. n/a.

### 2. New section `src/components/seo-local/SeoLocalAgencia.astro` ("¿Agencia SEO en Sevilla o consultora?")

**Placement.** In `src/pages/seo-local-sevilla.astro`, slot `before-pricing`, after the `RealProof` container and before the pricing `.band`: a second `<SectionContainer>` (no `id` prop; the id lives on the component's `<section>` as in Interfaces) wrapping `<SeoLocalAgencia />`. Page reading order becomes: hero, proof band, "Posicionamiento web en Sevilla: Google y Google Maps", process band, "Webs de negocios locales en Sevilla", **"¿Agencia SEO en Sevilla o consultora?"**, pricing band, FAQ, related, closing, NAP. Assumption: right before prices is where a visitor weighing an agency against a freelancer decides, and the section hands over to the plans. It sits on the plain `ink-ground` (no `.band`) because the next section is a band; the existing 6rem `space-y-24` gap separates it from RealProof.

**Structure (markup order = reading order = focus order).**

```
section#agencia-o-consultora.agencia.scroll-m-20 [aria-labelledby="agencia-title"]
  div.agencia-intro
    h2#agencia-title.kw      ¿Agencia SEO en Sevilla o consultora?
    p.display                Dos maneras de llevar <em>tu SEO local</em>
  div.agencia-body
    ul.agencia-list          3 x li > p > strong (lead sentence) + second sentence
    p.agencia-more > a.agencia-link[href="#precios"]   Ver los planes y precios
```

No h3, no cards, no icons, no "agencia vs consultora" table or two-column versus grid (DESIGN.md bans equal-card grids and glyph icons; a versus table would also read as attacking agencies).

**Hierarchy.** Main information: the keyword h2 and the display line, then the three bold lead sentences (a scanner reading only the bold gets the whole answer). Secondary: the second sentence of each item. The only action is the text link to the plans; no booking button here (the plan cards right below carry it).

**Copy (exact, Spanish, `tú`).** The h2 is fixed by the design. Everything else is Assumption: no acceptance criterion fixes it; written to the honesty rules (contains "consultora", no self-description as an agency, no promised result against the `check-seo-15` `positivePromise` regex, no price, phone or address literal, no figure about agencies).

- Display: `Dos maneras de llevar <em>tu SEO local</em>` (one serif-italic accent phrase per The One Serif Phrase Rule; avoids repeating the process display "Hablas con quien hace el trabajo").
- Item 1: **`Una agencia SEO suele repartir tu cuenta entre varias personas: quien vende, quien coordina y quien ejecuta.`** `Conmigo, como consultora SEO, hablas directamente con quien revisa tu ficha de Google y trabaja tu web.`
- Item 2: **`Una agencia tiene más manos y puede llevar a la vez campañas, redes sociales y diseño.`** `Si lo que necesitas es que tu negocio se entienda bien en Google y Google Maps, una consultora que domina la ficha y la parte técnica de la web suele ser suficiente.`
- Item 3: **`Elijas lo que elijas, pide por escrito qué incluye cada mes y cuánto cuesta.`** `Aquí lo tienes publicado: dos planes con su alcance, facturados mes a mes y sin promesas de posiciones.`
- Link: `Ver los planes y precios` to `#precios`.

Each lead sentence and each second sentence stands alone (GEO-1). Item 2 deliberately grants agencies a real strength: honesty is the brand commitment (`PRODUCT.md`). Do not write "sin permanencia" (`PRODUCT.md`: no confirmed contractual minimum term; the FAQ wording is the reference). If task 1.1's SERP reading suggests a different angle, the developer keeps these strings and raises it in the subtask; copy changes go back through this spec.

**Design system reuse (copy the existing rules from sibling components).**

- `.kw`: identical to `ReviewBento.astro` / `SeoLocalPlans.astro` (margin 0 0 0.6rem, rgb(203 213 225), 1.0625rem, weight 600, line-height 1.3; no uppercase, no letter-spacing; pinned by `tests/seo-local-ficha-redesign.test.js` T7).
- `.display` and `.display em`: identical to `ReviewBento.astro` (clamp(1.9rem, 4.5vw, 3rem), 700, line-height 1.06, -0.03em, `text-wrap: balance`, max-width 20ch, margin 0 0 1rem; em in Instrument Serif italic 400, rgb(125 211 252), 1.12em, -0.01em). Import `@fontsource/instrument-serif/400-italic.css` like the siblings.
- `.agencia-list`: the FAQ list rhythm from `SeoLocalFaq.astro`: `list-style: none`, padding 0, margin 0, `border-top: 1px solid rgb(51 65 85)` (`hairline`); each `li` `border-bottom: 1px solid rgb(51 65 85)`, padding 1.25rem 0. Paragraph: rgb(203 213 225) (`text-secondary`), 1rem, line-height 1.65, max-width 65ch, margin 0. `strong`: white (`text-strong`), weight 600 (the FAQ answer's bold lead sentence).
- `.agencia-link`: same rules as `.hero-link` in `SeoLocalHero.astro` (rgb(226 232 240), underline rgb(56 189 248 / 0.7), offset 0.3em, radius 0.25rem, hover rgb(125 211 252) with 0.2s cubic-bezier(0.16, 1, 0.3, 1), focus-visible 2px solid rgb(56 189 248) offset 4px). `.agencia-more` margin 1.5rem 0 0.
- Section text colour rgb(226 232 240), like `.bento-wrap` and `.plans`.

**Layout and responsive.**

- 320-1023 px: single column (intro, list, link), gap 0 between intro and list beyond the display's 1rem bottom margin. At 375 px the display wraps to 2-3 lines; no horizontal scroll at 320 px.
- 1024 px and up: the FAQ asymmetric split (The Asymmetry Rule): `.agencia` becomes a grid `minmax(0, 0.8fr) minmax(0, 1.2fr)`, gap 4rem, `align-items: start`; `.agencia-intro` left (display max-width 14ch there, as in the FAQ), `.agencia-body` right. Not sticky: the content is short. Assumption: mirrors the FAQ so the page keeps one pattern for "short intro plus ruled answers".

**States.** Static copy: no loading, empty, error, partial or disabled state. n/a.

**Interactions.** Only the link: hover colour, focus outline as above; the `#precios` jump lands correctly thanks to the existing `scroll-m-20` on the plans section. No new animation (the `SectionContainer` viewport fade-in already applies).

**Accessibility hand-off.** `aria-labelledby="agencia-title"` on the section; the h2 is its only heading (list items are not headings). The bold lead is `strong`, not a heading. Link text is self-describing. Focus order: the single link, between RealProof's last project link and the first plan's booking button.

### 3. Price lede in `src/components/seo-local/SeoLocalPlans.astro`

**Placement.** Between `p.display` ("Dos planes, con un alcance claro") and the existing `p.plans-note`; lede and note read as one two-sentence answer.

**Markup and copy.**

```
<p class="plans-lede">
  El SEO local en Sevilla cuesta <strong>{local.from}</strong> con el plan Local, centrado en tu ficha de Google, y <strong>{pro.from}</strong> con Local Pro, que suma el trabajo en tu web.
</p>
```

Rendered today: "El SEO local en Sevilla cuesta **300 €/mes + IVA** con el plan Local, centrado en tu ficha de Google, y **500 €/mes + IVA** con Local Pro, que suma el trabajo en tu web." followed by the unchanged note "Se factura mes a mes y no hay cuota de puesta en marcha aparte." Wording is the TL proposal. Assumption: the bold prices are my call, so a scanner sees both figures before the cards.

**Style.** `.plans-lede`: max-width 52ch (lead copy, DESIGN.md Typography "Body"), margin 0 0 0.75rem, rgb(226 232 240) (`text-body`), 1.125rem, line-height 1.6 (the hero subtitle size). `.plans-lede strong`: white, weight 650, `white-space: nowrap` so a price never splits across lines at 320-375 px. No yellow (The Reserved Yellow Rule), no badge, no price-sized type (the 1.75rem price stays in the cards). `.plans-note` and `.display` keep their current rules.

**States.** Both tiers present: rendered as above. Either tier missing: the lede is not rendered and the note follows the display as today (Interfaces: "lede rendered only when both exist").

**Responsive.** 375 px: about five lines; the unbreakable prices may force an earlier break, acceptable. No change at 768 or 1024 px.

**Accessibility.** Plain paragraph, no focusable element added.

### Browser checks for `ux-review` and `a11y-responsive`

- 320 and 375 px: no horizontal scroll; hero h1 at most two lines; agency display at most three lines; lede prices unbroken.
- 1024 and 1440 px: agency section in the 0.8/1.2 split, aligned with the FAQ further down.
- Heading outline: one h1; the agency h2 between "Webs de negocios locales en Sevilla" and "Cuánto cuesta el SEO local en Sevilla".
- Keyboard: "Ver los planes y precios" shows the focus ring and lands on `#precios` with its heading visible below the sticky header.

## Tasks

- [x] 1.1 [NRD-142 app] Re-read the SERPs of `agencia seo sevilla`, `presupuesto seo sevilla` and `seo para tiendas woocommerce en sevilla` and record them in `docs/seo-audit/keyword-clusters-2026-11.md`; tests: none (docs), sources and dates in the subtask comment.
- [x] 1.2 [NRD-143 app] Title and H1 work `posicionamiento web sevilla` and keep `SEO local Sevilla`; tests: new title/H1 test in `tests/seo-local-posicionamiento-web.test.js`, T7 pins and `check-seo-15` assertions first (RED), then `src/data/services.ts`.
- [x] 1.3 [NRD-144 app] Add `SeoLocalAgencia.astro` (agency H2, honest comparison) and the price lede from `tiers`; tests: honesty guard rewrite, agency H2, lede-from-data, `llms.txt`, component-pattern and order tests and `check-seo-15` assertions first (RED), then the component, page slot, plans lede and `contentSignals`.
