# Design

## Context

See proposal.md (Why). State on `develop` (b6da86a) plus NRD-24 merged (prerequisite):

- `src/data/internal-links.ts`: `internalLinksBySource` keyed by source route; each template page renders its block with `SeoLocalRelated` inside `<main>` (home `src/pages/index.astro:283`, `/seo-local-sevilla/` `:270`, `/inteligencia-artificial/` `:182`, the GEO post through `BlogPostLayout`, and `/seo-para-ia/` through NRD-24's page, empty until now). `check-seo-06` asserts every row as `<a href=path>` containing the anchor inside `<main>` and at least two rows per source; the related block of a post is outside its `data-post-body`, so `check-seo-18` (blog baseline) is unaffected.
- `src/data/seo-intents.ts`: `intentMatrix` (11 rows), `keywordOwners` (10 terms, pinned as an exact set by `tests/keyword-ownership.test.js`), `serviceRoutes`, `reciprocalLinks` (checked by `check-seo-07` inside `<main>`, both directions). `check-seo-07` also runs the ownership guard on every built page.
- ADR 0013 table A rows 8 to 11 (conditional on P1, now accepted):
  - 8: GEO post -> `/seo-para-ia/`, "servicio de SEO para IA"
  - 9: `/seo-para-ia/` -> GEO post, "guía sobre qué es el GEO"
  - 10: `/seo-para-ia/` -> `/seo-local-sevilla/`, "SEO local para negocios en Sevilla"
  - 11: `/seo-local-sevilla/` -> `/seo-para-ia/`, "SEO para IA y visibilidad en respuestas generativas"
- The plan's link table (`odd/tasks/seo-para-ia-geo-page.md`) gives different anchors for rows 8, 10 and 11 ("servicio de SEO para IA y GEO", "servicio de SEO local y Google Maps", "SEO para IA y GEO para buscadores con IA"), a home row, an `/inteligencia-artificial/` row, rows from the page to `/sobre-mi/`, `/diseno-web-sevilla/` and `/contacto` (without trailing slash), and a `/seo-para-ia/` -> `/` row.
- Pinned tests: `tests/ia-template.test.js` asserts `/inteligencia-artificial/` has exactly 5 rows; `tests/home-template.test.js` pins the home rows (`slice(0, 5)` paths and `slice(5)` niche rows); `tests/seo-consultor-strategy.test.js` pins the home anchor rows of the two posts.
- `public/llms.txt` "## Servicios" lists six services; `tests/single-price-source.test.js` requires every listed URL to be a `services` slug and every listed price to exist in that service's pricing (`seoParaIa.pricing.from` is "500 €/mes + IVA" from NRD-24). `check-seo-09` keeps the curated index and its honesty header.
- `.claude/harness.json` `seo.rankTracking.keywords` (12, `maxCallsPerRun` 14) tracks "posicionamiento en ia" against the GEO post; ADR 0013 says it moves to `/seo-para-ia/` when the page ships, and ADR 0012 registers owners from the tracked list.
- Word budgets (`check-seo-17`, local build 2026-11-17): `/` 1013 of 1100; `/inteligencia-artificial/` 846 of 850; `/seo-para-ia/` lands at 780-815 of 850 (NRD-24 design decision 8); `/seo-local-sevilla/` and the post have no range.

## Goals / Non-Goals

**Goals:**

- The page linked in and out with descriptive Spanish anchors, registered as the national GEO owner, listed in `llms.txt`, all guarded by tests and the existing `dist/` checks.

**Non-Goals:**

- Page copy, headings or meta changes anywhere; `check-seo-21` (NRD-26).

## Decisions

**Approach.** Data-only change: rows in `internal-links.ts` and `seo-intents.ts`, one `llms.txt` line and one `harness.json` tracking edit; every page already renders its block, so no `.astro` file changes. Tests first: a new `tests/seo-para-ia-links.test.js` asserts the rows, the anchor rules, the registry and the `llms.txt` line; the exact-set tests that pin today's rows are updated in the same commit as the rows they pin.

1. **ADR 0013 wins where the plan disagrees.** The story asks for both the plan rows and ADR rows 8-11 "with the exact anchors"; they conflict for three pairs and a source may not link the same target twice. ADR 0013 is the accepted architecture decision, so rows 8, 10 and 11 use its anchors verbatim; the plan anchors are used for the pairs the ADR does not cover. Flagged for the PO in the tracker summary.
2. **No `/seo-para-ia/` -> `/` row.** The page's single "consultor SEO en Sevilla" link is in its process byline (NRD-24 decision 4); a map row would make a second one.
3. **`/inteligencia-artificial/` anchor "SEO para IA".** The plan's "SEO para IA: que los asistentes entiendan tu negocio" (8 words) would push the page from 846 to about 854 words, over its 850 budget; three words keep it at about 849. If `check-seo-17` still reports more than 850, the developer stops and asks the TL (the IA copy is out of scope here).
4. **`/contacto/` with trailing slash** (invariant; the plan wrote `/contacto`).
5. **Two reciprocal pairs.** GEO post <-> `/seo-para-ia/` (rows 8 and 9) and `/seo-local-sevilla/` <-> `/seo-para-ia/` (rows 11 and 10), so `check-seo-07` keeps both bridges.
6. **Two owner terms, both tracked.** `keywordOwners` gains `posicionamiento en ia` and `seo para ia` (`/seo-para-ia/`). Following ADR 0012 (owners follow `seo.rankTracking`), the tracked page of "posicionamiento en ia" moves from the GEO post to `/seo-para-ia/` and "seo para ia" (320 searches/month, DataForSEO 2026-10-09) is added in group "GEO / IA". No other built page uses either term in a title, H1 or H2 (checked on the 2026-11-17 build: the GEO post headings say "SEO para la inteligencia artificial", which does not contain "seo para ia").
7. **Intent row position.** Inserted right after the `/seo-local-sevilla/` row (the "fifth row" of the story is ADR 0013 table B's conditional fifth row; position in the array has no behaviour). Signals are copied verbatim from the merged `seoParaIa`; the values below are NRD-24's fixed copy and are re-read from `src/data/services.ts` before writing.

### Rows (`src/data/internal-links.ts`)

| Source                                                  | Path                                                    | Anchor                                              | Kind       | Origin / placement                                           |
| ------------------------------------------------------- | ------------------------------------------------------- | --------------------------------------------------- | ---------- | ------------------------------------------------------------ |
| `/`                                                     | `/seo-para-ia/`                                         | SEO para IA y GEO                                   | contextual | plan; right after the GEO post row (index 1)                 |
| `/seo-local-sevilla/`                                   | `/seo-para-ia/`                                         | SEO para IA y visibilidad en respuestas generativas | contextual | ADR row 11; right after the GEO guide row, before conversion |
| `/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/` | `/seo-para-ia/`                                         | servicio de SEO para IA                             | contextual | ADR row 8; right after the `/seo-local-sevilla/` row         |
| `/inteligencia-artificial/`                             | `/seo-para-ia/`                                         | SEO para IA                                         | contextual | plan, shortened (decision 3); before conversion              |
| `/seo-para-ia/` (new block)                             | `/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/` | guía sobre qué es el GEO                            | contextual | ADR row 9                                                    |
| `/seo-para-ia/`                                         | `/seo-local-sevilla/`                                   | SEO local para negocios en Sevilla                  | contextual | ADR row 10                                                   |
| `/seo-para-ia/`                                         | `/sobre-mi/`                                            | quién soy y cómo trabajo                            | contextual | plan                                                         |
| `/seo-para-ia/`                                         | `/diseno-web-sevilla/`                                  | una web bien construida                             | contextual | plan                                                         |
| `/seo-para-ia/`                                         | `/contacto/`                                            | cuéntame cómo te encuentran hoy                     | conversion | plan (decision 4)                                            |

The `"/seo-para-ia/"` block goes after the `"/seo-local-sevilla/"` block.

### Registry (`src/data/seo-intents.ts`)

```ts
// intentMatrix, after the /seo-local-sevilla/ row
{
  url: "/seo-para-ia/",
  intent: "Commercial: contract SEO for AI answers (GEO/AEO), national scope; does not target Seville-qualified queries",
  topic: "servicio de SEO para IA y GEO",
  cta: "Book a call",
  titleSignal: "SEO para IA",
  descriptionSignal: "ChatGPT, Gemini",
  h1Signal: "SEO para IA",
  contentSignals: ["Qué trabajo para que una IA entienda tu negocio", "Cómo trabajamos el SEO para IA"],
},
// keywordOwners (after "inteligencia artificial para empresas sevilla")
{ keyword: "posicionamiento en ia", url: "/seo-para-ia/" },
{ keyword: "seo para ia", url: "/seo-para-ia/" },
// serviceRoutes: "/seo-para-ia/" after "/seo-local-sevilla/"
// reciprocalLinks
{ source: "/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/", target: "/seo-para-ia/", sourceAnchor: "servicio de SEO para IA", targetAnchor: "guía sobre qué es el GEO" },
{ source: "/seo-local-sevilla/", target: "/seo-para-ia/", sourceAnchor: "SEO para IA y visibilidad en respuestas generativas", targetAnchor: "SEO local para negocios en Sevilla" },
```

### `llms.txt` line (after the "SEO local en Sevilla" line)

`- [SEO para IA](https://nuriaromero.dev/seo-para-ia/): Preparar la información de tu negocio para que asistentes de IA como ChatGPT o Gemini puedan entenderla y citarla: datos coherentes, respuestas directas, datos estructurados y acceso de rastreadores. Incluido en el plan Local Pro (500 €/mes + IVA). Sin garantía de mención ni de posición.`

The label equals `seoParaIa.breadcrumbName` (GEO-2); the price equals `LOCAL_PRO_TIER.from` (tested against the runtime data, so a future price change fails the test instead of drifting).

### Files

All in layer `app` except the shared path noted.

Create:

- `tests/seo-para-ia-links.test.js`.

Modify:

- `src/data/internal-links.ts`: rows per the table.
- `src/data/seo-intents.ts`: registry per the block above.
- `public/llms.txt`: one line.
- `tests/keyword-ownership.test.js`: exact owner set gains the two terms.
- `tests/adr-0013-link-rows.test.js`: rows 8-11 added to the table-A list (comment "rows 8-11 belong to NRD-25" removed) so the existing "exist as contextual links" and "before the conversion row" tests cover them; table D test gains the two reciprocal pairs if it enumerates pairs.
- `tests/ia-template.test.js`: `/inteligencia-artificial/` rows from 5 to 6; the new row sits before the conversion row.
- `tests/home-template.test.js`: home rows with the new row at index 1.
- `tests/rank-tracking-keywords.test.js`: "posicionamiento en ia" and "seo para ia" tracked for `/seo-para-ia/` in group "GEO / IA"; every `keywordOwners` term whose owner is `/seo-para-ia/` is tracked for the same page.
- Shared path `.claude/harness.json` (routed to task 1.1, the subtask that needs it; layer `app` owner): only `seo.rankTracking.keywords` changes ("posicionamiento en ia" page `/seo-para-ia/`; new `{ "keyword": "seo para ia", "page": "/seo-para-ia/", "group": "GEO / IA" }` after it). `.claude/` guard: never remove or weaken a `permissions.deny` entry, never add an allow rule that reads `.env`, never disable the team-harness plugin or its hooks; `merge.auto`, `ci.requiredChecks` and the merge/push guardrails are not touched (state that in the PR description).

Unchanged and green: `tests/seo-consultor-strategy.test.js`, `tests/seo-local-sevilla-redesign.test.js`, `tests/single-price-source.test.js` (now also covering the new line), `tests/trailing-slash-links.test.js`, `check-seo-06/07/09/16/17/18`.

### Interfaces

No type or function change: rows use the existing `InternalLink`, `SeoIntentRow`, `KeywordOwner` and reciprocal-link shapes.

### Data

No storage or migration. Registry and link data only; no price change (the `llms.txt` price is the published Local Pro price).

### Test plan (TDD order)

1. Task 1.1 (links and registry), RED first in `tests/seo-para-ia-links.test.js` (runtime imports of `internal-links.ts`, `seo-intents.ts`, `services.ts`): every row of the table exists once with its exact anchor and kind; contextual rows sit before the conversion row of their source; `internalLinksBySource["/seo-para-ia/"]` has no `/` row; across all sources, anchor "consultor SEO en Sevilla" only with path `/`, no anchor to `/seo-local-sevilla/` matches `/seo para ia|posicionamiento en ia/i`, no anchor to `/seo-para-ia/` matches `/consultor|seo local/i`; the intent row equals the block above and its `titleSignal`/`h1Signal`/`descriptionSignal`/`contentSignals` are substrings of `seoParaIa.seo.title`/`hero.h1`/`seo.description`/`sectionTitles`; the `/seo-local-sevilla/` row deep-equals its previous literal; both reciprocal pairs exist; `serviceRoutes` includes `/seo-para-ia/`. Then update the pinned tests (keyword-ownership, adr-0013-link-rows, ia-template, home-template, rank-tracking-keywords) and implement data plus `harness.json`. Verify `node --test tests/*.test.js`, `pnpm build`, `pnpm check:seo:dist` green, especially `check-seo-06`, `check-seo-07` and `check-seo-17` (report the word counts of `/`, `/inteligencia-artificial/` and `/seo-para-ia/` in the PR). Scenarios "ADR rows 8 to 11 exist", "Owner anchors stay with their owners", "One home link on the page", "Links render inside main", "Intent row matches the built page", "Ownership registered and respected", "Local row unchanged".
2. Task 1.2 (`llms.txt`), RED first: the "## Servicios" section has exactly one line with `https://nuriaromero.dev/seo-para-ia/`, label "SEO para IA" (equal to `seoParaIa.breadcrumbName`), contains "Local Pro" and `LOCAL_PRO` price read at run time (`tierFrom(seoLocal, "Local Pro")`), contains "Sin garantía", matches neither `/garantiza/i` nor `/posiciona primero/i`. Then add the line; `tests/single-price-source.test.js` and `check-seo-09` green. Scenario "Entry present and honest".

### Real-browser / e2e checks (QA)

- At 375 px, the new pills wrap inside their related rows without overflow on `/`, `/seo-local-sevilla/` (its 51-character anchor), `/inteligencia-artificial/`, the GEO post and `/seo-para-ia/`.
- Keyboard focus reaches each new pill with the 2 px sky ring.
- `https://nuriaromero.dev/llms.txt` equivalent on the build (`dist/llms.txt`) shows the new line under "Servicios".

### ADRs relied on

0003, 0005 (`llms.txt`, checks), 0006, 0008, 0012 (ownership follows tracking), 0013 (table A rows 8-11, table B, P1 accepted), 0015.

## Risks / Trade-offs

- [The PO expected the plan anchors for rows 8, 10, 11] -> decision 1; ADR anchors are descriptive and keep the "no promised rankings" rule; easy to swap in data if the PO prefers.
- [`/inteligencia-artificial/` word budget] -> three-word anchor (decision 3); stop-and-ask rule.
- [A future heading on another page uses "SEO para IA"] -> `check-seo-07` ownership guard fails the build, by design.
- [Rank tracking spend] -> 13 keywords, within `maxCallsPerRun` 14.
- Size: two work units for 2 points; no size concern.

## UI spec

Scope: no component, layout, style or copy change outside the new pills. Every new link renders through the existing related row `src/components/seo-local/SeoLocalRelated.astro` (DESIGN.md "Related links"), fed from `internalLinksBySource`. The developer edits data only; this section fixes what the built row must look like so `ux-review` and QA can check it.

### Related row (all five pages)

1. **Screens and layout.** The row keeps its current slot on each page: `/` (`src/pages/index.astro:283`, inside `SectionContainer`, before `SeoLocalClosing`), `/seo-local-sevilla/` and `/inteligencia-artificial/` (`related` slot of `ServiceLayout variant="template"`), the GEO post (`src/layouts/BlogPostLayout.astro:88`, after the post body), `/seo-para-ia/` (NRD-24 slot 7 `related`, between FAQ and closing). Pill order = array order in the design's Rows table:
   - `/`: "qué son el SEO local y el GEO", **"SEO para IA y GEO"**, then the existing rows unchanged (Maps guide, price guide, recursos, portfolio, four niche pills).
   - `/seo-local-sevilla/`: existing rows through "guía sobre SEO local y GEO", **"SEO para IA y visibilidad en respuestas generativas"**, then "cuéntame cómo aparece hoy tu negocio" last.
   - GEO post: "servicio de SEO local y GEO en Sevilla", **"servicio de SEO para IA"**, then the existing rows, conversion last.
   - `/inteligencia-artificial/`: the four existing contextual rows, **"SEO para IA"**, then "cuéntame qué solución de IA necesitas" last.
   - `/seo-para-ia/` (block appears for the first time): "guía sobre qué es el GEO", "SEO local para negocios en Sevilla", "quién soy y cómo trabajo", "una web bien construida", "cuéntame cómo te encuentran hoy".
2. **Hierarchy.** The row is secondary navigation below the page's main content; the booking button stays the single filled control. All pills share one visual weight: `kind` (contextual or conversion) is data only and is not styled differently, the conversion pill is distinguished only by sitting last.
3. **States.** Static build, no loading or error. Empty list: the component renders nothing (existing behaviour); after this story no affected source is empty. Current page: no pill points to the page it sits on (guaranteed by the data). Hover/focus as in point 7.
4. **Copy.** Pill text = the anchors in the design's Rows table, verbatim, case included (lowercase start except where the anchor starts with "SEO"); no trailing punctuation, no icons, no "→". Row label stays the component default "Sigue leyendo" and the nav accessible name the default "Contenido relacionado" on all five pages (no `label`/`ariaLabel` prop passed), matching NRD-24 slot 7. No new strings beyond the anchors.
5. **Design system reuse.** `SeoLocalRelated` unchanged: `nav.related` top rule `1px var(--hairline)`, label `var(--text-muted)` at 0.875rem, pills `border 1px var(--hairline)`, `border-radius: 9999px` (`rounded.pill`), `var(--text-body)` at 0.9rem, padding 0.3rem 0.85rem, gaps 0.5rem between pills and 0.75rem/1rem between label and list; tokens from `src/styles/template.css`. Container `src/components/SectionContainer.astro`. No new component, no new token, no prop added.
6. **Responsive.** 320 px up: the list is `flex-wrap`, pills flow to as many lines as needed, the label sits on its own line when it does not fit beside the first pill. A pill whose text is wider than the container (the 51-character "SEO para IA y visibilidad en respuestas generativas" at 320-375 px) wraps its text inside the pill onto two lines and keeps its full-round border; it never overflows horizontally, never truncates with ellipsis and never forces a horizontal scroll. Precedent: the 46-character "CAPILAR LOCAL para clínicas de injerto capilar" pill on the same row already does this. Assumption: in-pill wrapping is acceptable as is, because changing the shared component (e.g. `white-space: nowrap` or smaller radius for wrapped pills) would touch ten pages and is outside this data-only design. From `md` (`max-w-2xl`) and `lg` (`max-w-4xl`) the same pills simply fit more per line; nothing hides at any width.
7. **Interactions.** Existing: hover turns the border to `var(--sky-signal)` and text to `var(--sky-accent)` with a 0.2s colour transition; `:focus-visible` shows a 2 px `var(--sky-signal)` outline at 3 px offset. Plain navigation links, no JS, no confirmation, no optimistic state.
8. **Accessibility hand-off.** Each pill is a text link, so its accessible name is the anchor; no `aria-label`/`title` added (it would diverge from the anchor that `check-seo-06` asserts). Tab order follows DOM order = the order in point 1. On `/seo-para-ia/` the related `nav` is a second landmark named "Contenido relacionado"; it must not reuse the name of any other `nav` on that page. No announcements (no async results).

### `public/llms.txt`

n/a for UI: plain-text file served to crawlers, not rendered by any page. Format is fixed by the design's `llms.txt` line.
