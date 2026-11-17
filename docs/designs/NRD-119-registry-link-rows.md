# NRD-119 - Apply the ADR 0013 registry and internal-link rows (phase 5, step 0)

## Why

[NRD-119](https://nuriaromerodev.atlassian.net/browse/NRD-119) (phase 5 step 0 of ADR 0013 "Orden de optimización (fase 5)"; draft in `docs/seo-audit/page-optimization-checklist.md` "Paso 0"; epic NRD-4). `src/data` does not reflect the owner map: `/automatizaciones/`, `/desarrollo-software-medida/` and `/inteligencia-artificial/` have no `intentMatrix` row and no owner, `/portfolio/` receives one link from `<main>` and `/desarrollo-software-medida/` two, while 67 impressions of cluster SW-1 land on `/diseno-web-sevilla/`. Without these rows `check-seo-07` does not watch those pages and every per-page story starts from an inconsistent registry. Data and links only; no page copy.

## What changes

- `src/data/seo-intents.ts`: 4 `intentMatrix` rows (ADR 0013 table B, rows 1-4), 5 `keywordOwners` rows (table C), 3 `reciprocalLinks` pairs (table D).
- `src/data/internal-links.ts`: rows 1-6 of table A added, row 7 edited (anchor of `/tienda-online-sevilla/` -> `/seo-local-sevilla/`).
- The links render automatically in `<main>`: `InternalLinks.astro` from `ServiceLayout.astro:106`, `index.astro:356` and `BlogPostLayout.astro:86`. No component or page change.
- Tests: `tests/keyword-ownership.test.js` exact set (5 -> 10 terms), `tests/seo-inventory.test.js` (`classifyPath` of the price post now returns its registered term), a new `tests/adr-0013-link-rows.test.js` pinning the table A rows and table D pairs.
- Docs: ADR 0013 status line, its row in `docs/adr/README.md`, the ADR 0013 input row of `docs/seo-audit/page-optimization-checklist.md`.

## Out of scope

- Rows 8-11 of table A and the fifth `intentMatrix` row (`/seo-para-ia/`, P1): NRD-25.
- Any page copy, title, H1, component, price or URL. No page is created, merged or renamed.
- Fixing a pre-existing keyword overlap: reported to the PO (ADR 0012).
- The guards themselves: G3 (NRD-116, links inside `<main>`) and G6 (NRD-117, ownership on built pages) land before this story (existing `Blocks` links).

## Requirements and scenarios

### Requirement: four new intent rows guarded by check-seo-07

`intentMatrix` SHALL contain the four rows of ADR 0013 table B (rows for `/desarrollo-software-medida/`, `/automatizaciones/`, `/inteligencia-artificial/`, `/blog/como-aparecer-en-google-maps-negocio-sevilla/`) with the exact `intent`, `topic`, `titleSignal`, `descriptionSignal`, `h1Signal` and `contentSignals` of the table; `cta` (required by `SeoIntentRow`, not in the table) is an English sentence in the style of the existing rows (`Request a software scope and quote`, `Request an automation proposal`, `Request an AI solution proposal`, `Read the service when the profile needs hands-on work`). Existing rows are unchanged.

#### Scenario: signals present on the current copy

- WHEN `pnpm build && pnpm check:seo-07:dist` runs
- THEN it passes (all signals of the four rows were found on the 2026-11-15 build by the Tech Lead, read-only)

### Requirement: ten registered terms

`keywordOwners` SHALL add, in this order after the existing five: `diseño web sevilla` -> `/diseno-web-sevilla/`, `desarrollo de software a medida sevilla` -> `/desarrollo-software-medida/`, `inteligencia artificial para empresas sevilla` -> `/inteligencia-artificial/`, `como aparecer en google maps` -> `/blog/como-aparecer-en-google-maps-negocio-sevilla/`, `cuanto cuesta una pagina web en sevilla` -> `/blog/cuanto-cuesta-una-pagina-web-en-sevilla/` (keywords verbatim from table C, lowercase, as tracked in `seo.rankTracking`).

#### Scenario: exact set test

- WHEN `node --test tests/keyword-ownership.test.js` runs
- THEN the first test asserts the 10-term map, written first and failing before the data change (same commit)

#### Scenario: every owner is a known route

- WHEN the third existing test runs
- THEN the Google Maps post is known through its new `intentMatrix` row and the price post through its existing row

#### Scenario: built pages respect ownership (G6)

- WHEN `check-seo-07` runs NRD-117's rule with the ten terms
- THEN it passes; the only literal overlaps on the 2026-11-15 build are the two `/blog/` card headings, exempt by NRD-117's named rule. Any other overlap the developer finds is reported to the PO in the subtask and the story report, not fixed in copy

### Requirement: link rows 1-7 and reciprocal pairs

`internalLinksBySource` SHALL contain rows 1-6 of table A (kind `contextual`, anchors verbatim) appended after the existing contextual rows of their source and before its `conversion` row, and row 7 SHALL replace the anchor `SEO local para atraer clientes de tu zona` with `SEO para que encuentren tu tienda online en Sevilla` in place. `reciprocalLinks` SHALL add the three table D pairs. The `/diseno-web-sevilla/` with `/desarrollo-software-medida/` pair lands in the same commit as rows 1 and 2.

| #   | Source                                             | Target                         | Anchor                                              |
| --- | -------------------------------------------------- | ------------------------------ | --------------------------------------------------- |
| 1   | `/diseno-web-sevilla/`                             | `/desarrollo-software-medida/` | aplicaciones web a medida para tu empresa           |
| 2   | `/desarrollo-software-medida/`                     | `/diseno-web-sevilla/`         | diseño web para negocios en Sevilla                 |
| 3   | `/inteligencia-artificial/`                        | `/desarrollo-software-medida/` | desarrollo de software a medida para empresas       |
| 4   | `/diseno-web-sevilla/`                             | `/portfolio/`                  | casos de éxito de webs para negocios en Sevilla     |
| 5   | `/`                                                | `/portfolio/`                  | casos de éxito de webs para negocios en Sevilla     |
| 6   | `/blog/pagina-web-para-restaurantes-que-necesita/` | `/diseno-web-sevilla/`         | diseño web para negocios locales en Sevilla         |
| 7   | `/tienda-online-sevilla/` (edit)                   | `/seo-local-sevilla/`          | SEO para que encuentren tu tienda online en Sevilla |

#### Scenario: rows guarded inside `<main>` (G3)

- WHEN `pnpm check:seo-06:dist` and `pnpm check:seo-07:dist` run with NRD-116's rule
- THEN each new row and both directions of each new pair are found as `<a href>` with the anchor text inside `<main>`

#### Scenario: pinned rows

- WHEN `node --test tests/adr-0013-link-rows.test.js` runs
- THEN it finds rows 1-7 with their exact anchors and kind, the old row-7 anchor is absent, and the three pairs exist (fails before the data change)

#### Scenario: row 7 at 375 px

- WHEN QA opens `/tienda-online-sevilla/` at 375 px
- THEN the 51-character link in "Contenido relacionado" wraps inside its list item with no horizontal overflow

### Requirement: ADR 0013 accepted

`docs/adr/0013-seo-site-architecture.md` line 3 SHALL read `- Status: Accepted (2026-11-15, PO on accepting NRD-74; proposals P1 and P2 remain "Pendiente de la usuaria")`; its row in `docs/adr/README.md` SHALL say `Accepted`; the ADR 0013 input row of `docs/seo-audit/page-optimization-checklist.md` ("Estado a 2026-11-15" column) SHALL say the ADR is "Accepted" (2026-11-15, PO al aceptar NRD-74) with P1 and P2 still "Pendiente de la usuaria". The other mentions of "Proposed" in the checklist describe the inputs at drafting time and stay.

#### Scenario: index consistent

- WHEN a reader opens the ADR index
- THEN 0013 shows `Accepted` and the ADR file shows the same status

## Files

| Layer | Action | Path                                            | Notes                                                                                                |
| ----- | ------ | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `app` | modify | `src/data/seo-intents.ts`                       | 4 `intentMatrix` rows, 5 `keywordOwners` rows (task 1.1); 3 pairs (1.2)                              |
| `app` | modify | `tests/keyword-ownership.test.js`               | exact-set assertion lines 22-28 (task 1.1)                                                           |
| `app` | modify | `tests/seo-inventory.test.js`                   | lines 112-118: price post `targetQuery` becomes `cuanto cuesta una pagina web en sevilla` (task 1.1) |
| `app` | modify | `src/data/internal-links.ts`                    | rows 1-6 added, row 7 edited (task 1.2)                                                              |
| `app` | create | `tests/adr-0013-link-rows.test.js`              | pins table A rows 1-7 and table D pairs (task 1.2)                                                   |
| `app` | modify | `docs/adr/0013-seo-site-architecture.md`        | status line (task 1.3)                                                                               |
| `app` | modify | `docs/adr/README.md`                            | index row 0013 (task 1.3)                                                                            |
| `app` | modify | `docs/seo-audit/page-optimization-checklist.md` | ADR 0013 input row (task 1.3)                                                                        |

## Interfaces

Existing shapes only: `SeoIntentRow` (`src/data/seo-intents.ts:1`), `KeywordOwner` (`:91`), `InternalLink` (`src/data/internal-links.ts:3`), the `reciprocalLinks` object shape (`source`, `target`, `sourceAnchor`, `targetAnchor`). No new type or export.

## Data

Static TypeScript data only; no storage, schema, settings or migration. Rendered effect: one more link chip in the "Contenido relacionado" aside of `/`, `/diseno-web-sevilla/` (two), `/desarrollo-software-medida/`, `/inteligencia-artificial/` and the restaurants post; one changed anchor on `/tienda-online-sevilla/`.

## Test plan (TDD order)

1. Task 1.1 (RED): update the exact-set test to the 10 terms and the `classifyPath` expectation for the price post; run them (fail). Add the 4 `intentMatrix` and 5 `keywordOwners` rows (GREEN). Then `pnpm build`, `node scripts/check-seo-07.mjs` (signals + NRD-117 ownership rule) green; record the ownership output; report any overlap other than the exempt `/blog/` cards to the PO. Also run `node --test tests/tienda-online-retarget.test.js` (reads the registry) and the full suite.
2. Task 1.2 (RED): `tests/adr-0013-link-rows.test.js` imports `internalLinksBySource` and `reciprocalLinks` and asserts the 7 rows (source, path, anchor, `contextual`), the absence of the old row-7 anchor and the 3 pairs; run (fail). Add rows 1-6, edit row 7 and add the 3 pairs in the same commit (GREEN). Then `pnpm build`, `check-seo-06` and `check-seo-07` green (NRD-116 `<main>` rule).
3. Task 1.3: docs only; `node --test tests/*.test.js` stays green; `pnpm format` on the three docs.
4. Before shipping: `pnpm build` and the full aggregate `pnpm check:seo:dist` (NRD-112).

## Real-browser / e2e checks

- `/tienda-online-sevilla/` at 375 px: the row-7 anchor (51 characters) wraps without horizontal scroll; the aside keeps its padding.
- `/`, `/diseno-web-sevilla/`, `/desarrollo-software-medida/`, `/inteligencia-artificial/`, `/blog/pagina-web-para-restaurantes-que-necesita/`: the new links appear in "Contenido relacionado", are keyboard-focusable with visible focus, and navigate to the target with a trailing slash.

## Risks

- **Order.** Blocked by NRD-112, NRD-113, NRD-115, NRD-116 and NRD-117 (existing links). Landing it before NRD-116 would let rows 1-6 pass on header/footer hrefs; before NRD-117 would register five terms with no built-page guard.
- **File overlaps.** `tests/keyword-ownership.test.js` with NRD-117 (NRD-117 appends tests, this story edits lines 22-28; NRD-117 first). `src/data/internal-links.ts` with NRD-114 (`/contacto` -> `/contacto/` on the conversion rows; this story does not touch conversion rows, so only line context differs). `src/data/seo-intents.ts` with NRD-120 (NRD-120 may edit the `/seo-local-sevilla/` signals; this story leaves that row as is and lands first).
- **Pre-existing overlap outside literal matching.** The home H2 "Posicionamiento web en Sevilla: cómo trabajo" works `posicionamiento web sevilla` with the connector "en"; NRD-117's literal rule does not flag it. Reported to the PO in NRD-117 and NRD-120; nothing to do here.
- **UI.** No component change, so no UI spec; the rendered aside gains chips (375 px check above).

## ADRs

- Applies [0013](../adr/0013-seo-site-architecture.md) tables A-D and sets its status; relies on [0012](../adr/0012-keyword-ownership-registry.md) and [0003](../adr/0003-single-app-layer-and-src-data.md) (data in `src/data`). No new ADR.

## UI spec

Data-only. No component, token or class change: the rows render through the existing `src/components/InternalLinks.astro` aside ("Contenido relacionado", `h2#related-links-title`) inside `src/components/SectionContainer.astro`, in the older Tailwind gray/blue styling (DESIGN.md "Two styling worlds coexist"). The DESIGN.md "Related links" pill row does not apply here; migrating the component is out of scope.

### "Contenido relacionado" aside (`/`, `/diseno-web-sevilla/`, `/desarrollo-software-medida/`, `/inteligencia-artificial/`, `/blog/pagina-web-para-restaurantes-que-necesita/`, `/tienda-online-sevilla/`)

1. **Screens and layout**: no new region. Each new contextual row is one more `<li>` in the existing `ul.flex.flex-wrap.gap-x-5.gap-y-2`, after the source's existing contextual links (data order) and before the unchanged conversion paragraph (`p.mt-5`). Row 7 keeps its third position on `/tienda-online-sevilla/`; only its text changes. `/diseno-web-sevilla/` goes from 7 to 9 contextual items, the other sources gain one.
2. **Hierarchy**: unchanged. Contextual links stay secondary (regular weight, `text-blue-600` / `dark:text-blue-400`); the conversion link stays the only `font-medium` link.
3. **States**: static links; loading, empty, error, disabled: n/a. The `links.length > 0` guard is unaffected. Hover: existing `hover:underline underline-offset-4`. Focus: the browser default outline the component relies on today (no project focus style on it); unchanged by this story.
4. **Copy**: anchors verbatim from table A above (Spanish, sentence case, no trailing punctuation). Heading unchanged. No new strings.
5. **Design system reuse**: existing classes only (`rounded-xl border-gray-200 bg-gray-50/70 p-6`, `text-blue-600 dark:text-blue-400`, `gap-x-5 gap-y-2`). No new component.
6. **Responsive**: anchors are 35-51 characters (row 7: 51; rows 4/5: 47; row 3: 45; row 6: 43; row 1: 41; row 2: 35). At 375 px the aside text column is about 290 px (page gutter plus `p-6`), roughly 35-40 characters per line, so the longer anchors take their own row and wrap to a second line inside their `<li>`, breaking at spaces. Acceptance at 320 and 375 px: no horizontal scroll, no mid-word break, the aside keeps its 24 px padding, the second line starts flush under the first, `gap-y-2` separates items. From `md` up (`md:max-w-2xl`, `lg:max-w-4xl`) items flow several per row as today.
7. **Interactions**: plain same-tab navigation links with trailing-slash hrefs; no confirmation, no transition.
8. **Accessibility hand-off**: link text is the accessible name; every new anchor names its destination's topic without surrounding context. Within each page's aside every anchor text is unique, so no identical names lead to different targets (rows 4 and 5 share their text but render on different pages and both point to `/portfolio/`). Focus order follows data order: new rows after the existing contextual links, before the conversion link. No live announcements (no async content). Assumption: a 51-character link wrapping over two lines is acceptable (the whole wrapped text is the hit area); no truncation or ellipsis, because it would cut the accessible name and the SEO anchor.

## Tasks

- [x] 1.1 [NRD-139 app] Add the 4 `intentMatrix` rows (table B) and the 5 `keywordOwners` rows (table C); tests: exact-set assertion in `tests/keyword-ownership.test.js` and `classifyPath` in `tests/seo-inventory.test.js` first (RED), then data (GREEN), then `check-seo-07` with the G6 rule.
- [x] 1.2 [NRD-140 app] Add table A rows 1-6, edit row 7 and add the 3 table D pairs in one commit; tests: `tests/adr-0013-link-rows.test.js` first (RED), then data (GREEN), then `check-seo-06` and `check-seo-07` with the G3 rule.
- [x] 1.3 [NRD-141 app] Set ADR 0013 to Accepted in the ADR, the ADR index and the checklist input row; tests: `node --test tests/*.test.js` stays green.

Note (2026-11-17, NRD-278): the published row 5 anchor is now kept in ADR 0013 table A; this design is historical.
