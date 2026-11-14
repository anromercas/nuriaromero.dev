# NRD-34 - Retarget /tienda-online-sevilla/ to "diseño / crear tienda online Sevilla"

## Why

[NRD-34](https://nuriaromerodev.atlassian.net/browse/NRD-34) (M3, epic NRD-4). Source: S-2026-11-13-6. The SERP for "tienda online sevilla" in Seville is navigational: 8 of 10 results are the Sevilla FC shop. A business owner who wants a shop built searches "diseño tienda online sevilla" (70/month) or "crear tienda online sevilla" (10/month). The page should speak to that intent, and rank tracking should stop treating the shopping query as a target.

Current state (verified in code):

- `tiendaOnline` in `src/data/services.ts:646-760`:
  - title "Tienda online en Sevilla | Ecommerce con pasarela de pago";
  - H1 "Tienda online en Sevilla para negocios que quieren vender, no solo tener una web";
  - meta description and subtitle about the gateway and closed price;
  - the FAQ "¿Cuánto cuesta una tienda online en Sevilla?" with "desde 399 €" plus "se presupuestan aparte".
- `src/data/seo-intents.ts:75-84` row: `titleSignal` "Tienda online en Sevilla", `h1Signal` "Tienda online en Sevilla para negocios". `scripts/check-seo-07.mjs:26-28` checks them against `dist/`, so they must move with the copy.
- `public/llms.txt:15`: "[Tienda online en Sevilla](...): Ecommerce a medida con pasarela de pago propia. La tienda se presupuesta según el catálogo."
- `scripts/check-seo-02.mjs:11` pins `breadcrumbName` "Tienda online en Sevilla". It stays.
- `tests/seo-meta-titles.test.js:53-69` pins the titles of four other services, not this one.
- `.claude/harness.json` `seo.rankTracking.keywords` has "tienda online sevilla" in group "Diseño web" (11 keywords, `maxCallsPerRun` 14).
- The keyword registry `keywordOwners` and ADR 0012 come from [NRD-33](https://nuriaromerodev.atlassian.net/browse/NRD-33) (`NRD-33 Blocks NRD-34`).

## What changes

- Title, H1, meta description and hero subtitle lead with building a shop ("Diseño de tienda online en Sevilla"). The URL, breadcrumb, FAQ price logic and the rest of the copy stay.
- `seo-intents`:
  - the `/tienda-online-sevilla/` row signals follow the new title and H1;
  - `keywordOwners` gains `diseño tienda online sevilla` mapped to `/tienda-online-sevilla/`.
- `llms.txt` link label becomes "Diseño de tienda online en Sevilla"; the description and price sentence are unchanged.
- `.claude/harness.json` rank tracking:
  - add "diseño tienda online sevilla" (group "Diseño web");
  - move "tienda online sevilla" to group "Referencia (navegacional)".

## Out of scope

- Prices: none change (radical per invariants).
- URL or breadcrumb change, new pages, FAQ rewrites beyond keeping them consistent.
- "crear tienda online sevilla" as a separate owned term: 10/month. It may appear naturally in copy, but it gets no registry row unless the PO asks.
- `/diseno-web-sevilla/` (M3 starts there; the PO ordered this story after it).

## Requirements and scenarios

### Requirement: build intent in title and H1

The `<title>` and the single H1 of `/tienda-online-sevilla/` SHALL start with "Diseño de tienda online en Sevilla". The title MUST be at most 65 characters and the URL MUST NOT change.

#### Scenario: built page

- WHEN `pnpm build` runs and `dist/tienda-online-sevilla/index.html` is read
- THEN there is one `<h1>` starting with that phrase, the title starts with it, and `check:seo-07:dist` passes with the updated intent signals

### Requirement: description and first paragraph

The meta description (140-160 chars) and the hero subtitle SHALL speak to building an online shop for a local business, in Spanish, and MUST NOT promise rankings or sales.

#### Scenario: honest copy

- WHEN `tests/tienda-online-retarget.test.js` reads them
- THEN the description length is 140-160, both contain "tienda online", and neither matches the promise regex

### Requirement: price logic unchanged

The FAQ price answer SHALL keep "desde 399 €" for the base web and the "se presupuesta según el catálogo" logic, consistent with `public/llms.txt` and `src/data/services.ts`.

#### Scenario: no new price

- WHEN the tests run
- THEN the FAQ answer still contains "399 €" and "presupuest", the `llms.txt` line still contains "se presupuesta según el catálogo", and `tests/single-price-source.test.js` is green

### Requirement: ownership and tracking

`keywordOwners` SHALL map "diseño tienda online sevilla" to `/tienda-online-sevilla/`. `seo.rankTracking.keywords` SHALL include it, and SHALL keep "tienda online sevilla" only as a reference row.

#### Scenario: registry

- WHEN `tests/keyword-ownership.test.js` (from NRD-33) and `tests/tienda-online-retarget.test.js` run
- THEN the row exists and no term has two owners

#### Scenario: rank tracking

- WHEN `tests/rank-tracking-keywords.test.js` parses `.claude/harness.json`
- THEN the new keyword exists for `/tienda-online-sevilla/` in group "Diseño web", "tienda online sevilla" is in group "Referencia (navegacional)", keywords are unique, and the count is at most `maxCallsPerRun`

## Files (layer `app`)

| Action | Path                                   | Notes                                                                                                            |
| ------ | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| modify | `src/data/services.ts`                 | `tiendaOnline.seo.title`, `.seo.description`, `.hero.h1`, `.hero.subtitle`                                       |
| modify | `src/data/seo-intents.ts`              | intent row signals; `keywordOwners` row                                                                          |
| modify | `public/llms.txt`                      | link label only                                                                                                  |
| modify | `.claude/harness.json`                 | `seo.rankTracking.keywords` only. **Outside the `app` layer globs**; labelled `app` because it is the only layer |
| create | `tests/tienda-online-retarget.test.js` |                                                                                                                  |
| create | `tests/rank-tracking-keywords.test.js` |                                                                                                                  |

## Interfaces

Copy proposal (the developer may refine it within the scenarios):

- Title: `Diseño de tienda online en Sevilla | Pasarela de pago propia` (60 chars)
- H1: `Diseño de tienda online en Sevilla para negocios que quieren vender`
- Description: lead with "Diseño y creo tiendas online para negocios de Sevilla…", keep "pasarela de pago propia" and "presupuesto cerrado", 140-160 chars.
- Subtitle: start from the business owner's goal of selling their own products online, keeping the gateway, stock and closed-price points.
- Intent row: `titleSignal: "Diseño de tienda online en Sevilla"`, `h1Signal: "Diseño de tienda online en Sevilla"`, `descriptionSignal` = a substring that stays in the new description (for example "pasarela de pago propia"), `topic: "diseño de tienda online para negocios en Sevilla"`.
- Rank tracking rows:

```json
{ "keyword": "tienda online sevilla", "page": "/tienda-online-sevilla/", "group": "Referencia (navegacional)" },
{ "keyword": "diseño tienda online sevilla", "page": "/tienda-online-sevilla/", "group": "Diseño web" }
```

## Data

Settings: `.claude/harness.json` `seo.rankTracking.keywords` (two rows). No product schema, storage or migration.

## Test plan (TDD order)

1. `tests/tienda-online-retarget.test.js` (RED, task 1.1): title and H1 prefix, title at most 65 chars, description 140-160, no promise, FAQ price logic, `llms.txt` sentence, `keywordOwners` row (import `../src/data/seo-intents.ts`), intent signals as substrings of the new title and H1. Copy and data edits (GREEN). Then `pnpm build`, `check:seo-07:dist`, `check:seo-02:dist` and the rest.
2. `tests/rank-tracking-keywords.test.js` (RED, task 1.2), then edit `.claude/harness.json` (GREEN).

## Real-browser / e2e checks

- `/tienda-online-sevilla/` at 375 and 1280 px: the new H1 wraps cleanly and the hero CTA stays above the fold at 390x844.
- The page's breadcrumb still reads "Tienda online en Sevilla".
- The home services list link to `/tienda-online-sevilla/` still works (anchor unchanged).

## Risks

- **Dependency on NRD-33.** `keywordOwners` must exist (NRD-33 task NRD-51). If NRD-34 is picked first, it creates the registry exactly as NRD-33's design specifies, and NRD-33 then only adds its rows. The `Blocks` link makes the order explicit.
- **Editing the harness configuration.** `.claude/harness.json` is the team-harness configuration, outside the `app` globs. The edit is limited to two `rankTracking` rows, as the AC asks. Flagged for the human in the TL report.
- The "Referencia (navegacional)" group is a convention of this design; the rank report renders one table per group.

## ADRs

0003 (data in `src/data`), 0004 (SEO head), 0005 (SEO checks and `llms.txt`), 0008 (Spanish copy), 0012 (keyword ownership registry, from NRD-33).

## UI spec

Scope: copy-only change inside the existing hero of `/tienda-online-sevilla/`. No component, layout, token or style changes. Everything below the hero (intro section, benefits, process, pricing, FAQ, closing CTA) is unchanged.

### Hero (`src/components/services/ServiceHero.astro`, rendered by `src/layouts/ServiceLayout.astro`, data `tiendaOnline.hero` in `src/data/services.ts`)

1. **Screens and layout**: same page, same regions and order: breadcrumbs (`src/components/Breadcrumbs.astro`), then hero (H1, subtitle, CTA row with `src/components/BookingButton.astro` and the "Ver cómo se presupuesta" link to `#precios`). `ServiceHero.astro` is reused unchanged; no new props.
2. **Hierarchy**: the H1 states the service (building a shop) and who it is for; the subtitle answers "what do I get and on what terms"; the primary action stays the booking button, the secondary stays the pricing anchor. Reading order: breadcrumb, H1, subtitle, booking button, pricing link.
3. **States**: n/a (static content, no data-driven element).
4. **Copy** (Spanish, exact strings; they replace the current values):
   - H1: `Diseño de tienda online en Sevilla para negocios que quieren vender` (67 chars). Assumption: taken from the TL copy proposal; dropping the old ", no solo tener una web" tail keeps the H1 at about 5 lines at 320 px and the CTA above the fold.
   - Subtitle: `Si tienes un negocio en Sevilla y quieres vender por internet con una tienda online propia, la diseño y la construyo a medida: pasarela de pago, gestión de productos y stock, sin comisión de marketplace y con precio cerrado antes de empezar.` Assumption: no AC fixes the string; it opens with the local owner's goal (AC "building a shop for a local business"), keeps the gateway, stock and closed-price points of the current subtitle, contains "tienda online", promises no rankings or sales, and is no longer than the current subtitle (243 chars), so the hero does not grow.
   - Meta description (not visible; fixed here so all new copy lives in one place): `Diseño y creo tiendas online para negocios de Sevilla, con pasarela de pago propia y sin comisión de marketplace. Presupuesto cerrado según tu catálogo.` (152 chars). Assumption: follows the TL proposal and keeps the `descriptionSignal` "pasarela de pago propia".
   - Unchanged on purpose: breadcrumb label "Tienda online en Sevilla" (pinned by `check-seo-02`), booking button label (default "Reserva una primera sesión"), secondary CTA "Ver cómo se presupuesta", all section titles and the closing CTA "Empecemos con tu tienda online en Sevilla". The breadcrumb "Tienda online en Sevilla" above an H1 "Diseño de tienda online…" is accepted: the breadcrumb names the page, the H1 names the offer.
   - Tone: tuteo, first person singular ("la diseño y la construyo"), as in the sibling service heroes (`disenoWeb`, `desarrolloSoftware` in `src/data/services.ts`).
5. **Design system reuse**: the existing `ServiceHero.astro` styles (H1 `text-4xl sm:text-5xl font-bold tracking-tight`, subtitle `text-xl max-w-2xl`) and `BookingButton.astro` (`button-booking` in `DESIGN.md`). Do not add an Instrument Serif accent phrase to this H1: `ServiceHero` has no accent slot and adding one is outside this story. No new component.
6. **Responsive**: no markup change. At 320 and 375 px the H1 wraps naturally (no `<br>`, no non-breaking spaces, no manual hyphenation). At 390x844 the booking button stays fully visible in the first viewport (the subtitle length cap protects this). At 1280 px the H1 runs 2-3 lines; the subtitle keeps `max-w-2xl`.
7. **Interactions**: unchanged (existing hover and focus of the booking button and the pricing link).
8. **Accessibility hand-off**: still exactly one `<h1>`; the `BookingButton` accessible name is unchanged. Nothing else to note.

## Tasks

- [x] 1.1 [NRD-65 app] Retarget title, H1, meta description and hero subtitle to "Diseño de tienda online en Sevilla", update the intent row, `keywordOwners` and the `llms.txt` label, with no price change; tests: `tests/tienda-online-retarget.test.js` first.
- [ ] 1.2 [NRD-66 app] Rank tracking: add "diseño tienda online sevilla" and move "tienda online sevilla" to the reference group in `.claude/harness.json`; tests: `tests/rank-tracking-keywords.test.js` first.
