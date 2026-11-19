## Context

[NRD-300](https://nuriaromerodev.atlassian.net/browse/NRD-300). `docs/seo-audit/measurement-seo.md` holds the NRD-17 baselines (Search Console 2026-11-14 and 28-day 2026-11-15, GA4 2026-11-15, AI citation 2026-11-15) and a generic "Cadencia y registro de cambios" section with the "Plantilla mínima de anotación". There is no per-page routine for the iteration review NRD-78 will run. `keywordOwners` (`src/data/seo-intents.ts`, 12 terms over 9 URLs) is the ownership map (ADR 0012); `.claude/harness.json` `seo.rankTracking.keywords` tracks 13 rows (the 12 owner terms plus `tienda online sevilla` as navigational reference, ADR 0013). `tests/rank-tracking-keywords.test.js` only checks the `/seo-para-ia/` owners. `scripts/lib/keyword-ownership.mjs` already hosts the pure ownership helpers (`normaliseTerm`, `findOwnershipViolations`).

Constraint found in the code: `tests/register-metrics.test.js` ("the current measurement protocol reports no unsourced KPI figures") and `scripts/check-seo-14.mjs` fail when the document has a KPI figure (`KPI_METRIC_PATTERN` in `scripts/lib/register-metrics.mjs`: "<n> clics|impresiones|conversiones|consultas|backlinks", "posición: <n>") outside a `## Línea base YYYY-MM-DD` section with `Fuente:` and `Fecha de captura:`. The new section is a routine, not a capture, so it must carry no such figures.

## Goals / Non-Goals

**Goals:**

- A written, testable routine NRD-78 can follow page by page.
- A guard that every owner term is tracked for its owner page.

**Non-Goals:**

- No data reading, no new tracked keywords, no edit to `.claude/harness.json` or `src/data/seo-intents.ts`, no site change.

## Decisions

**Approach.** Add a pure function `untrackedOwners(owners, trackedRows)` next to the other ownership helpers and use it in `tests/rank-tracking-keywords.test.js` against the real data, replacing the `/seo-para-ia/`-only loop (the explicit group checks stay). Writing the function test-first gives an observable RED even though today's data already matches. Then add `## Revisión de iteración` to the measurement document, right after "Cadencia y registro de cambios" and before "Validación reproducible", and a new test file that extracts the section and checks it names every owner URL and the required sources and decisions. The owner URL list in the document is a table written by hand (Markdown cannot import data); the test is what keeps it in sync with `keywordOwners`.

**Files** (all layer `app`):

- modify `scripts/lib/keyword-ownership.mjs`: add `untrackedOwners`.
- modify `tests/rank-tracking-keywords.test.js`: unit cases for `untrackedOwners` plus the real-data assertion; drop the `/seo-para-ia/`-only `keywordOwners` loop (now covered).
- create `tests/iteration-review-routine.test.js`.
- modify `docs/seo-audit/measurement-seo.md`: new section `## Revisión de iteración`.
- `.claude/harness.json`: read only (shared path; not edited, AC 4).

**Interfaces:**

```js
// scripts/lib/keyword-ownership.mjs
/**
 * Owner terms not tracked for their owner page.
 * @param {{keyword: string, url: string}[]} owners - keywordOwners
 * @param {{keyword: string, page: string}[]} trackedRows - seo.rankTracking.keywords
 * @returns {{keyword: string, url: string, trackedPage: string | null}[]}
 */
export function untrackedOwners(owners, trackedRows)
```

Exact keyword match (both sides are stored lowercase) and exact page match (trailing slash).

**Section content** (Spanish; wording is the developer's, these elements are required):

1. Cadencia: cada 2 a 4 semanas; la primera, no antes de 28 días tras la promoción a producción del cambio de página revisado (fecha de la promoción de `develop` a `main`).
2. Tabla "Página propietaria | Keywords propietarias" with the 9 URLs of `keywordOwners` in backticks (`/`, `/seo-local-sevilla/`, `/tienda-online-sevilla/`, `/diseno-web-sevilla/`, `/desarrollo-software-medida/`, `/inteligencia-artificial/`, `/seo-para-ia/`, `/blog/como-aparecer-en-google-maps-negocio-sevilla/`, `/blog/cuanto-cuesta-una-pagina-web-en-sevilla/`) and their terms.
3. Qué se compara por página con la línea base de NRD-17 (linking the dated sections by name): impresiones, clics, CTR y posición media de Search Console en ventanas de 28 días (filtro por página); posición de sus keywords en `seo/ranks/history.jsonl`; clics de reserva de GA4 (`contact_click` con `contact_method=booking`), filtrados por página; presencia en citas de IA con el mismo método que "Línea base 2026-11-15 (citación en IA)".
4. Plantilla de registro por revisión, a fenced `text` block extending the "Plantilla mínima de anotación" with the fields: fecha, página, ventana (baseline / revisión), fuente y filtros, dato observado, hueco, decisión. Fields empty.
5. Cierre obligatorio: una decisión por página, mantener, ajustar (historia nueva o refinada en NRD-4 con la evidencia) o escalar al PO; solo cifras observadas, fechadas y con fuente; los huecos se marcan como "N/D" con su motivo; ninguna nota promete posiciones. Figures observed in a review go into a new dated `## Línea base YYYY-MM-DD (...)` section with `Fuente:` and `Fecha de captura:`, never into the routine section.
6. Paso de control: comprobar que `seo.rankTracking.keywords` sigue coincidiendo con `keywordOwners` (guardado por `tests/rank-tracking-keywords.test.js`); si una página nueva gana una keyword propietaria, se propone al PO; el PO no edita la configuración, la cambia una historia.

**Data:** none. No schema, storage or settings change.

**Test plan (TDD order):**

- Task 1.1, `tests/rank-tracking-keywords.test.js` (scenarios "All owner terms tracked for their page", "Owner term missing or tracked for another page"):
  1. `untrackedOwners([{keyword:"a", url:"/x/"}], [{keyword:"a", page:"/x/"}])` -> `[]`.
  2. absent term -> `[{ keyword: "a", url: "/x/", trackedPage: null }]`.
  3. term tracked for `/y/` -> `[{ keyword: "a", url: "/x/", trackedPage: "/y/" }]`.
  4. real data: `untrackedOwners(keywordOwners, config.seo.rankTracking.keywords)` deep-equals `[]`.
  RED: import of `untrackedOwners` fails. GREEN: implement.
- Task 1.2, `tests/iteration-review-routine.test.js` (scenarios "Section names every owner page", "Decision vocabulary and control step present"): read the document, slice from `/^## Revisión de iteración\s*$/m` to the next `/^## /m`; assert it exists; for each unique `keywordOwners` url assert the section includes `` `${url}` ``; assert it includes `seo/ranks/history.jsonl`, `contact_click`, `contact_method=booking`, `seo.rankTracking.keywords`, `keywordOwners`, and (case-insensitive) `mantener`, `ajustar`, `escalar`. RED on the current document. GREEN: write the section. Then confirm `tests/register-metrics.test.js` and `pnpm build && pnpm check:seo:dist` (`check-seo-14`) stay green (scenario "No unsourced KPI figure").

No fakes or fixtures.

**Real-browser / e2e checks (QA):** none. No public page, layout, component, style or script changes; `docs/` is QA-exempt (`repo.qaExemptPaths`).

**ADRs relied on:** 0012 (keyword ownership registry), 0013 (SEO site architecture, one owner page per cluster; `tienda online sevilla` as reference). No new ADR.

## Risks / Trade-offs

- [A KPI-like phrase in the routine (e.g. "28 clics") would fail `register-metrics` and `check-seo-14`] -> Mitigation: the template keeps fields empty; "28 días" is not a KPI pattern.
- [The owner table in the document is hand-written] -> Mitigation: the new test fails when `keywordOwners` gains a URL the section does not name.
- [The guard is one-directional: extra tracked rows are allowed] -> Intentional (navigational reference rows, ADR 0013); uniqueness and `maxCallsPerRun` stay checked by the existing test.
