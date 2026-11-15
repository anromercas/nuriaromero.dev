# NRD-123 - `/automatizaciones/`: read the exact SERP and align title, H1 and description with the process-automation intent (phase 5, step 4)

## Why

[NRD-123](https://nuriaromerodev.atlassian.net/browse/NRD-123) (phase 5 step 4 of ADR 0013; draft in `docs/seo-audit/page-optimization-checklist.md` "Paso 4"; epic NRD-4). The page already earns impressions for four process-automation variants (`automatizacion procesos sevilla` 17 at 23.9; `automatización de procesos sevilla` 15 at 31.9; `automatización de procesos en sevilla` 4 at 11.5; `automatizaciones ia sevilla` 4 at 52). Its title names the topic loosely (`Automatización de procesos para negocios en Sevilla | n8n y Make`, `src/data/services.ts:255`), but the H1 (`Automatizaciones: que tu negocio trabaje solo`, `:260`) and the description (`Automatizo las tareas repetitivas...`, `:257`) do not. Cluster IA-1 is provisional: the exact head `automatización de procesos sevilla` was never read (two 40101 errors in NRD-97) and the unaccented variant's SERP is industrial automation (directories 7 of 10, S10). The `intentMatrix` row exists since step 0 (NRD-119); there is no `keywordOwners` row and there must not be one until the PO adds the term to `seo.rankTracking` (ADR 0012).

## What changes

1. **Evidence first, with a stop gate (SEO-2).** Task 1.1 reads the exact SERP of `automatización de procesos sevilla` and records it. The rest of the story proceeds only if the reading succeeds and shows business-process automation (service pages, software/RPA/no-code consultancies, n8n/Make/Zapier content). If the call fails again, or the SERP is industrial automation (PLC, robotics, industrial integrators), the developer stops after task 1.1, comments the reading on the story, adds `needs-human` per the AC ("the story goes back to the PO, no estimate") and does not start task 1.2.
2. **Title, H1 and description work the variant the reading picks (SEO-1).** Data only, in `automatizaciones` (`src/data/services.ts`). Default (business-process SERP): the phrase `Automatización de procesos en Sevilla`, which works both `automatización de procesos sevilla` and the 11.5-position `... en sevilla` form. Proposals (the UI spec may refine within the rules): title `Automatización de procesos en Sevilla para negocios | n8n y Make` (64 characters); H1 `Automatización de procesos en Sevilla: que tu negocio trabaje solo`; description `Automatización de procesos en Sevilla con n8n y Make: facturas, correos, citas e informes que se hacen solos. Más de 10 años de experiencia.` (140 characters, keeps "años de experiencia" for `tests/seo-meta-titles.test.js`).
3. **Registry follows the copy.** The `/automatizaciones/` `intentMatrix` row gets `titleSignal: "Automatización de procesos en Sevilla"`, `descriptionSignal: "Automatización de procesos en Sevilla"`, `h1Signal: "Automatización de procesos en Sevilla"`; content signals unchanged. No `keywordOwners` row.

Unchanged: URL, price (`149 €` per automation), benefits, process, FAQ, `public/llms.txt` entry and its price, the reciprocal pair with `/inteligencia-artificial/` and the three `internalLinksBySource` rows, page template `src/pages/automatizaciones.astro`.

## Out of scope

- Registering a keyword owner for IA-1 (needs the PO to add the term to `seo.rankTracking` first).
- `automatización de procesos con ia` (260 a month, no Seville qualifier, out of local scope per ADR 0013).
- New sections or copy beyond title, H1 and description; markup changes (LCP is not at risk: median 0.94 s, NRD-18, and the H1 keeps a similar length).

## Requirements and scenarios

"Works a term" here: every word of the term occurs in the normalised element (`normaliseTerm` from `scripts/lib/keyword-ownership.mjs`), and the normalised element contains the contiguous phrase `automatizacion de procesos`.

### Requirement: exact SERP read before writing, with a stop gate (SEO-2)

The story SHALL record, in `docs/seo-audit/keyword-clusters-2026-11.md` section "IA / automatizaciones", a "Dato observado (NRD-123, YYYY-MM-DD), `automatización de procesos sevilla`" entry: source (DataForSEO `serp/google/organic/live/advanced`, Seville, `es`, mobile, task id; the response must echo the keyword, or the call is made alone so it cannot be confused), local pack, organic domains in order with page type, AI Overview presence, and an **Inferencia**: business-process or industrial. At most two calls (one retry). The IA-1 verdict in the cluster table changes from provisional only if the reading supports it.

#### Scenario: business-process SERP

- WHEN the reading shows business-process automation pages leading
- THEN the entry says so and task 1.2 proceeds with the default phrase (or the variant the reading favours, stated in the entry)

#### Scenario: tool fails or industrial SERP

- WHEN both calls fail, or industrial automation leads the SERP
- THEN the entry records "sin dato (<error>)" or the industrial reading, task 1.2 is not started, the story gets a comment with the reading and the label `needs-human`, and the PO decides (AC SEO-2)

### Requirement: title, H1 and description work the chosen variant (SEO-1)

`automatizaciones.seo.title` (at most 65 characters), `automatizaciones.hero.h1` and `automatizaciones.seo.description` (at most 160 characters, still containing "años de experiencia") SHALL each work the chosen variant. The copy MUST NOT promise a result or a time saving figure that is not already published.

#### Scenario: data test

- WHEN `tests/automatizaciones-intent.test.js` runs
- THEN title, H1 and description each contain `automatizacion de procesos` and `sevilla` (normalised), title <= 65 and description <= 160; it fails on today's H1 and description

#### Scenario: registry and build

- WHEN `pnpm build && pnpm check:seo:dist` runs
- THEN `check-seo-07` finds the new signals in the built title, description and H1, the reciprocal pair with `/inteligencia-artificial/` holds, and no `keywordOwners` row exists for the page (`tests/keyword-ownership.test.js` unchanged)

### Requirement: published price and llms.txt entry kept (GEO-3, SEO-4)

The `llms.txt` line of `https://nuriaromero.dev/automatizaciones/` SHALL keep `149 €`; `automatizaciones.pricing` SHALL not change.

#### Scenario: llms.txt

- WHEN the new test reads `public/llms.txt`
- THEN the automatizaciones line contains `149 €` and `tests/single-price-source.test.js` passes

## Files

| Layer | Action | Path                                         | Notes                                                                 |
| ----- | ------ | -------------------------------------------- | --------------------------------------------------------------------- |
| `app` | modify | `docs/seo-audit/keyword-clusters-2026-11.md` | IA-1 "Dato observado (NRD-123, date)" (task 1.1)                      |
| `app` | modify | `src/data/services.ts`                       | `automatizaciones.seo.title`, `seo.description`, `hero.h1` (task 1.2) |
| `app` | modify | `src/data/seo-intents.ts`                    | `/automatizaciones/` row signals (task 1.2)                           |
| `app` | create | `tests/automatizaciones-intent.test.js`      | term, length, `llms.txt` assertions (task 1.2)                        |
| `app` | modify | `tests/seo-meta-titles.test.js`              | `expectedTitles.automatizaciones` pin updated (task 1.2)              |

## Interfaces

```js
// tests/automatizaciones-intent.test.js
import { normaliseTerm } from "../scripts/lib/keyword-ownership.mjs";
const worksProcess = (text) => {
  const t = normaliseTerm(text);
  return t.includes("automatizacion de procesos") && t.includes("sevilla");
};
```

## Data

Static copy only. No storage, schema, settings or price change.

## Test plan (TDD order)

1. Task 1.1 (docs): SERP read and entry; gate decision in the subtask comment (proceed / stopped, with reason).
2. Task 1.2 (RED first, only if the gate is open): create `tests/automatizaciones-intent.test.js` (fails on H1 and description); update `expectedTitles.automatizaciones` in `tests/seo-meta-titles.test.js`; then `src/data/services.ts` and the `intentMatrix` row (GREEN). `node --test tests/*.test.js`; `pnpm build && pnpm check:seo:dist`.
3. Format only edited files.

## Real-browser / e2e checks

- 375 px: the longer H1 wraps cleanly in `ServiceHero`.
- Spot-check LCP/CLS on the built page (no markup change; median 0.94 s, NRD-18).
- Rich Results Test or Schema Markup Validator: `Service` (its `name` follows the H1), `FAQPage`, `BreadcrumbList` with 0 errors.
- Specialist reviews: `seo-review` with the task 1.1 reading, `ux-review`, `a11y-responsive`.

## Owner-account actions (executed by the orchestrator)

- Search Console URL inspection and "Request indexing" for `https://nuriaromero.dev/automatizaciones/` after the scheduled promotion that contains this story: **executable owner action**.

## Risks

- **Gate may stop the story.** That outcome is accepted by the AC; it is not a failure of the design.
- **Overlap with NRD-121 and NRD-124.** Same files (`services.ts`, `seo-intents.ts`, the pinned-title test) with different entries; run in rank order.
- **Unaccented variant.** `automatizacion procesos sevilla` (17 impressions, best-performing) reads as industrial in S10; the copy targets the accented, business form, which also matches the unaccented query lexically.

## ADRs

Relies on [0012](../adr/0012-keyword-ownership-registry.md) (no owner row until tracked), [0013](../adr/0013-seo-site-architecture.md) (IA-1, question 8), [0004](../adr/0004-seo-head-and-structured-data.md), [0008](../adr/0008-spanish-copy-english-code.md). No new ADR.

## UI spec

Scope: copy only, on the existing `/automatizaciones/` page (`src/pages/automatizaciones.astro` -> `src/layouts/ServiceLayout.astro` -> `src/components/services/ServiceHero.astro`). No component, class, token or markup change. Applies only if the task 1.1 gate is open; if the gate stops the story, nothing in this section ships.

### Hero (`ServiceHero`, data `automatizaciones.hero` in `src/data/services.ts`)

1. **Screens and layout:** unchanged. The H1 stays the first element of the hero, above the unchanged subtitle and the `BookingButton` (`src/components/BookingButton.astro`); the breadcrumb label stays `Automatizaciones`.
2. **Hierarchy:** the H1 now leads with the service name and place (what it is, where), then keeps the incumbent promise after the colon (why it matters). The primary action stays the booking button; the subtitle keeps carrying the concrete examples.
3. **States:** n/a (static copy, no data-driven element).
4. **Copy (exact, Spanish):**
   - H1: `Automatización de procesos en Sevilla: que tu negocio trabaje solo` (66 characters). Assumption: adopts the Tech Lead's proposal unchanged; the part after the colon is the published H1 tail, so no new claim is introduced.
   - Subtitle: unchanged.
   - Plain text only: no manual `<br>`, no `<span>` accent, no `&shy;`. The colon is followed by one normal space.
   - If task 1.1 favours another variant, keep the same pattern `<variant including Sevilla>: que tu negocio trabaje solo`, sentence case, no final period. Assumption: keeps the H1 shape stable whatever the reading picks.
5. **Design system reuse:** `ServiceHero` as is (`text-4xl sm:text-5xl font-bold tracking-tight text-gray-800 dark:text-white mb-6`). The DESIGN.md "Display" 16ch rule describes the redesigned SEO local hero, not this legacy template; it is not applied here (no markup change in scope).
6. **Responsive:** at 320-375 px the H1 grows from about 4 to about 5-6 lines; that is accepted. The longest word becomes `Automatización` (14 characters), shorter than today's `Automatizaciones:` (17), so there is no new horizontal overflow risk. Check at 320, 375, 640 and 1024 px: no horizontal scroll, no word broken mid-word, the colon stays attached to `Sevilla`, and the booking button keeps its place below the subtitle.
7. **Interactions:** n/a.
8. **Accessibility hand-off:** still exactly one `h1`. The `Service` JSON-LD `name` follows `hero.h1` automatically (`src/layouts/ServiceLayout.astro:38`), so the page heading and the schema name stay identical; nothing else to do.

### Head (`automatizaciones.seo` in `src/data/services.ts`, rendered by the existing SEO head)

4. **Copy (exact, Spanish):**
   - `<title>`: `Automatización de procesos en Sevilla para negocios | n8n y Make` (64 characters, within 65). Assumption: Tech Lead proposal kept; the `| n8n y Make` suffix stays because it is the published tool signal and separates the page from industrial automation results.
   - Meta description: `Automatización de procesos en Sevilla con n8n y Make: facturas, correos, citas e informes que se hacen solos. Más de 10 años de experiencia.` (140 characters, within 160; keeps `años de experiencia`). Assumption: "que se hacen solos" restates the published subtitle ("para que esas tareas se hagan solas"), so it is not a new promised result; no time-saving figure is added.
   - All three strings (title, description, H1) use the accented form `Automatización`; the unaccented query still matches after normalisation.

- Items 1-3 and 5-8: n/a (no visible UI; SERP snippet only).

## Tasks

- [ ] 1.1 [NRD-150 app] Read the exact SERP of `automatización de procesos sevilla`, record it and apply the stop gate; tests: none (docs).
- [ ] 1.2 [NRD-151 app] Title, H1 and description work `automatización de procesos en Sevilla`; tests: new `tests/automatizaciones-intent.test.js` and the `seo-meta-titles` pin first (RED), then `services.ts` and the `intentMatrix` row.
