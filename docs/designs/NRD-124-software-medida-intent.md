# NRD-124 - `/desarrollo-software-medida/`: give the page its intent and confirm who owns "aplicaciones web a medida sevilla" (phase 5, step 5)

## Why

[NRD-124](https://nuriaromerodev.atlassian.net/browse/NRD-124) (phase 5 step 5 of ADR 0013; draft in `docs/seo-audit/page-optimization-checklist.md` "Paso 5"; epic NRD-4). 67 of the 76 impressions of cluster SW-1 go to `/diseno-web-sevilla/` and 9 to this page (`apps a medida sevilla` 8 at 46). The page is the registered owner of `desarrollo de software a medida sevilla` (`keywordOwners`, step 0) and its title already works it (`Desarrollo de software a medida en Sevilla | Aplicaciones web`, `src/data/services.ts:149`), but the H1 (`Software a medida para tu empresa en Sevilla`, `:154`) drops "desarrollo de" and the description (`Desarrollo software y aplicaciones web a medida...`, `:151`, exactly 160 characters) drops "de". SW-1 is provisional: the reading of `aplicaciones web a medida sevilla` (software firms) was assigned to its query by response order (NRD-97, S10). Table A rows 1 to 3 and the reciprocal pair with `/diseno-web-sevilla/` already exist (NRD-119, `src/data/internal-links.ts`).

## What changes

1. **Evidence first (SEO-2).** Re-read the SERP of `aplicaciones web a medida sevilla` in a single, standalone call (so the response cannot be confused with another query; record whether the response echoes the keyword) and record it. If the SERP is the web-design SERP, the subtask comments on the story asking the PO whether `/diseno-web-sevilla/` should own the term (ADR 0013 review trigger); this does not block the copy below, which works the registered term, not this one.
2. **Title, H1 and description work `desarrollo de software a medida sevilla` (SEO-1).** Data only, in `desarrolloSoftware`. Proposals (the UI spec may refine within the rules): title unchanged (already works the term); H1 `Desarrollo de software a medida en Sevilla para tu empresa` (58 characters); description `Desarrollo de software y aplicaciones web a medida en Sevilla: gestión interna, reservas, presupuestos y portales de cliente. +10 años de experiencia.` (150 characters; keeps "aplicaciones web a medida" and "años de experiencia").
3. **Registry follows the copy.** The `/desarrollo-software-medida/` `intentMatrix` row gets `h1Signal: "Desarrollo de software a medida en Sevilla"`; `titleSignal` and `descriptionSignal` already match; content signals unchanged.
4. **Links (SEO-6).** Verify only: rows 1-3 (from `/diseno-web-sevilla/`, `/automatizaciones/`, `/inteligencia-artificial/`) and the reciprocal pair, inside `<main>` (`check-seo-06`/`07` with NRD-116's rule). The new test also pins the four inbound rows in `internal-links.ts`.

Unchanged: URL, title, price (`999 €`), benefits, process, FAQ, `public/llms.txt`, page template.

## Out of scope

- Moving `aplicaciones web a medida sevilla` to `/diseno-web-sevilla/` or splitting SW-1 (PO / ADR decision after the reading).
- New sections or copy beyond H1 and description.

## Requirements and scenarios

"Works the term" here: the normalised element (`normaliseTerm`) contains `desarrollo de software`, `a medida` and `sevilla`.

### Requirement: SERP of `aplicaciones web a medida sevilla` re-read (SEO-2)

The story SHALL record, in `docs/seo-audit/keyword-clusters-2026-11.md` section "Software a medida", a "Dato observado (NRD-124, YYYY-MM-DD), `aplicaciones web a medida sevilla`" entry: source (DataForSEO `serp/google/organic/live/advanced`, Seville, `es`, mobile, task id, whether the keyword is echoed), local pack, organic domains in order with page type, AI Overview, and an **Inferencia**: software (SW-1 stays) or web design (PO decision). It SHALL compare with the S10 reading (local pack Beateam 4, DINAMIC ÁREA 7, Neored Solutions 4; organic `10code.es`, `beateam.es`, `sortlist.es`, `dasscore.com`, `bloonde.com`). One call; on failure "sin dato (<error>)".

#### Scenario: software SERP

- WHEN software firms lead the SERP
- THEN the entry confirms SW-1 and the "assigned by response order" caveat is resolved

#### Scenario: web-design SERP

- WHEN web-design pages lead the SERP
- THEN the entry says so and the subtask posts a story comment asking the PO whether `/diseno-web-sevilla/` owns the term; task 1.2 still proceeds

### Requirement: H1 and description work the registered term (SEO-1)

`desarrolloSoftware.seo.title`, `hero.h1` and `seo.description` SHALL each work `desarrollo de software a medida sevilla`; the title stays <= 65 characters and unchanged; the description <= 160 characters and contains "años de experiencia". No other page works the term in title, H1 or H2 (G6).

#### Scenario: data test

- WHEN `tests/software-medida-intent.test.js` runs
- THEN title, H1 and description work the term; it fails on today's H1 and description

#### Scenario: build

- WHEN `pnpm build && pnpm check:seo:dist` runs
- THEN `check-seo-07` finds the signals and the G6 rule passes; `check-seo-06` finds the inbound rows inside `<main>`

### Requirement: inbound links hold (SEO-6)

`internalLinksBySource` SHALL keep links to `/desarrollo-software-medida/` from `/diseno-web-sevilla/`, `/automatizaciones/` and `/inteligencia-artificial/`, and `reciprocalLinks` SHALL keep the `/diseno-web-sevilla/` pair.

#### Scenario: rows

- WHEN the new test reads `src/data/internal-links.ts` and `src/data/seo-intents.ts`
- THEN the three rows and the pair exist

## Files

| Layer | Action | Path                                         | Notes                                                      |
| ----- | ------ | -------------------------------------------- | ---------------------------------------------------------- |
| `app` | modify | `docs/seo-audit/keyword-clusters-2026-11.md` | SW-1 "Dato observado (NRD-124, date)" (task 1.1)           |
| `app` | modify | `src/data/services.ts`                       | `desarrolloSoftware.hero.h1`, `seo.description` (task 1.2) |
| `app` | modify | `src/data/seo-intents.ts`                    | `/desarrollo-software-medida/` `h1Signal` (task 1.2)       |
| `app` | create | `tests/software-medida-intent.test.js`       | term, length, inbound rows assertions (task 1.2)           |

`tests/seo-meta-titles.test.js` needs no change (title unchanged; description length and "años de experiencia" already tested there).

## Interfaces

```js
// tests/software-medida-intent.test.js
import { normaliseTerm } from "../scripts/lib/keyword-ownership.mjs";
const worksTerm = (text) => {
  const t = normaliseTerm(text);
  return (
    t.includes("desarrollo de software") &&
    t.includes("a medida") &&
    t.includes("sevilla")
  );
};
```

## Data

Static copy only. No storage, schema, settings or price change.

## Test plan (TDD order)

1. Task 1.1 (docs): SERP read and entry; story comment for the PO only in the web-design case.
2. Task 1.2 (RED first): create `tests/software-medida-intent.test.js` (fails on H1 and description); then `src/data/services.ts` and the `intentMatrix` row (GREEN). `node --test tests/*.test.js`; `pnpm build && pnpm check:seo:dist`.
3. Format only edited files.

## Real-browser / e2e checks

- 375 px: the longer H1 wraps cleanly.
- LCP and CLS: the H1 is the LCP text element (median 1.74 s, NRD-18); re-measure on the built page and record in the PR.
- Rich Results Test or Schema Markup Validator: `Service` (name follows the H1), `FAQPage`, `BreadcrumbList` 0 errors.
- Specialist reviews: `seo-review` with the task 1.1 reading, `ux-review`, `a11y-responsive`.

## Owner-account actions (executed by the orchestrator)

- Search Console URL inspection and "Request indexing" for `https://nuriaromero.dev/desarrollo-software-medida/` after the scheduled promotion that contains this story: **executable owner action**.

## Risks

- **Blocked by NRD-121.** NRD-121 changes `/diseno-web-sevilla/` (the page that receives this cluster's impressions) and edits the same files; reading the SERP and touching the reciprocal side after it avoids rework. Link: NRD-121 `Blocks` NRD-124.
- **Small demand.** `desarrollo de software a medida sevilla` is 10 a month; the value is routing, not volume.

## ADRs

Relies on [0012](../adr/0012-keyword-ownership-registry.md), [0013](../adr/0013-seo-site-architecture.md) ("SW-1 split not applied", review trigger), [0004](../adr/0004-seo-head-and-structured-data.md), [0008](../adr/0008-spanish-copy-english-code.md). No new ADR.

## UI spec

Copy-only change on `/desarrollo-software-medida/`. The page keeps the shared service template (`src/layouts/ServiceLayout.astro` with `src/components/services/ServiceHero.astro`), not the "Annotated Storefront" world of `DESIGN.md`. Moving it to that world is out of scope ("page template unchanged"). No new component, token, class, layout or style rule. Every string below is exact. If the developer changes one in the PR, it must still meet the scenarios above, and this section must be updated to match.

### 1. Hero H1 (`src/components/services/ServiceHero.astro`, data in `desarrolloSoftware.hero.h1`, `src/data/services.ts`)

- **Screens and layout**: unchanged. Breadcrumbs ("Inicio" > "Software a medida"), then the `h1`, the subtitle `p`, and the CTA `nav` (`src/components/BookingButton.astro` with its default label). The page has no secondary CTA. The H1 stays the only `h1` on the page (NRD-118 guard) and the LCP text element (NRD-18).
- **Copy** (58 chars, today 44): `Desarrollo de software a medida en Sevilla para tu empresa`
  - Assumption: adopts the Tech Lead's proposal as is. It leads with the registered term in reading order and keeps "para tu empresa", so it still names who the page is for. It matches the `<title>` lead without copying it, because the title ends in "Aplicaciones web".
  - Plain text: no `<br>`, `&nbsp;`, `<em>`, soft hyphen or forced break. No serif accent phrase: this template has none, and adding one would mean a component change.
- **Hierarchy**: unchanged. H1, then the subtitle as lead copy, then the booking button as the primary action. The breadcrumb label "Software a medida" stays, because it is short navigation and not a heading.
- **Design system reuse**: the existing H1 classes in `ServiceHero.astro` (`text-4xl sm:text-5xl font-bold tracking-tight text-gray-800 mb-6`) inside `src/components/SectionContainer.astro` (`md:max-w-2xl lg:max-w-4xl`). Do not change the size, weight, tracking, max width or `text-wrap`. Any of those would change every service page that renders the default `ServiceHero`.
- **Responsive**: the H1 wraps naturally, with breaks between words and no hyphenation or overflow.
  - 320 px: at most 5 lines.
  - 375 px: at most 4 lines. Today it takes 3, so one more line pushes the booking button about one line down.
  - 768 px and up: at most 2 lines.
  - Assumption: these line ceilings are estimates from the 2.25rem/3rem sizes at a 106.25% root, measured against the container widths. QA checks them on the built page. If the H1 goes over a ceiling, report it to the Tech Lead; never shrink the font to make it fit.
  - No horizontal scroll at 320 px.
- **States, interactions**: n/a (static text).
- **Accessibility hand-off**: n/a. It stays a single `h1`, and the page's accessible heading outline is otherwise unchanged. `Service.name` in JSON-LD follows the H1 automatically (`serviceSchema({ name: page.hero.h1 })`). Nothing to wire.

### 2. Meta description (`desarrolloSoftware.seo.description`, `src/data/services.ts`; rendered by `src/layouts/Layout.astro` in `<meta name="description">` and used as `Service.description`)

- **Copy** (150 chars, today 160): `Desarrollo de software y aplicaciones web a medida en Sevilla: gestión interna, reservas, presupuestos y portales de cliente. +10 años de experiencia.`
  - Assumption: adopts the Tech Lead's proposal as is. It fixes "Desarrollo software" to "Desarrollo de software", keeps the four examples that match the page's benefits copy and the "+10 años de experiencia" proof already used on the page ("Más de 10 años"), and replaces the list comma before the last item with "y". At 150 characters it stays within the 160-character limit. Nothing new is claimed.
  - Assumption: "para empresas" is dropped to make room for "de". The H1 still carries "para tu empresa", so the audience signal stays on the page.
- **Screens, hierarchy, states, responsive, interactions, accessibility**: n/a (not rendered in the page body).

### Not changed

`<title>`, subtitle, breadcrumb, section titles (benefits, process, pricing, FAQ), benefits, process, price card, FAQ, the closing CTA and internal-link blocks, and every other service page. Loading, empty, error, partial and disabled states: n/a (static page, no data-driven element in scope).

## Tasks

- [x] 1.1 [NRD-152 app] Re-read the SERP of `aplicaciones web a medida sevilla` (standalone call) and record it; tests: none (docs).
- [ ] 1.2 [NRD-153 app] H1 and description work `desarrollo de software a medida sevilla`; tests: new `tests/software-medida-intent.test.js` first (RED), then `services.ts` and the `intentMatrix` row.
