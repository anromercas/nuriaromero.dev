# NRD-21 - Backlink baseline and first local outreach list

## Why

[NRD-21](https://nuriaromerodev.atlassian.net/browse/NRD-21) (M1, epic NRD-2). Source: SEO-13 (`odd/tasks/seo-audit-backlog-2026-09-21.md`). Domain authority is the main limit for ranking the local pages. `odd/tasks/seo-para-ia-geo-page.md:28` cites a 2026-10-09 DataForSEO report ("0 enlaces útiles, 26 dominios referentes casi todos spam"), but that figure is undated in the repo and has no export. `docs/seo-audit/authority-backlink-register.md` has the policy and the empty tables, with no measured baseline. Without a dated baseline and a target list, authority work never starts.

Current state (verified in code):

- `scripts/check-seo-13.mjs:59-62` fails if the register contains anything like "N backlinks", "N dominios referentes" or "DA/DR/authority score: N", anywhere. That guard exists against invented metrics, so a real baseline would fail it too. The AC requires `check:seo-13` to keep passing, so the guard must learn the difference between sourced and unsourced numbers.
- The register's outreach table (lines 38-40) has one placeholder row, with the columns date | prospect and URL | real relationship | proposed resource | owner | expected evidence | rejection criterion | status.

## What changes

- `check-seo-13` metric guard: numbers are allowed only inside `## Línea base <YYYY-MM-DD>` sections that carry `Fuente:` and `Fecha de captura:` lines. The logic is extracted into a tested helper.
- A dated baseline section from an authorised source: DataForSEO Backlinks API via the harness account (`seo.dataforseo`), or a Search Console links export from the owner.
- 10-20 verified local or sector opportunities in the outreach table.
- Toxic or likely-spam domains listed, not disavowed.

## Out of scope

- Disavow, contacting anyone (the owner sends outreach), paid or exchanged links.
- Changes to `/recursos/` or any public page.
- Rewriting the 2026-09-21 baseline rows (kept as history).
- Search Console access setup (NRD-17).

## Requirements and scenarios

### Requirement: sourced metrics only

The register MAY contain backlink metrics only inside a section whose heading matches `^## Línea base \d{4}-\d{2}-\d{2}` and whose body contains a `Fuente:` line and a `Fecha de captura:` line. Anywhere else, `check-seo-13` MUST fail.

#### Scenario: unsourced number

- WHEN "26 dominios referentes" appears outside a dated baseline section
- THEN `findUnsourcedMetrics` reports it and `check-seo-13` fails with an `SEO-13:` message

#### Scenario: sourced baseline

- WHEN the same text sits in `## Línea base 2026-11-20` with `Fuente:` and `Fecha de captura:` lines
- THEN nothing is reported

#### Scenario: dated section without a source

- WHEN a `## Línea base <date>` section lacks `Fuente:`
- THEN its numbers are reported

### Requirement: dated baseline

The register SHALL record, for `nuriaromero.dev`, from one authorised source:

- source, endpoint and capture date, and the call count;
- backlinks, referring domains, dofollow share;
- top 10 anchors;
- spam share with its threshold;
- the list of toxic or likely-spam domains.

#### Scenario: DataForSEO available

- WHEN the developer has the harness DataForSEO access
- THEN at most 5 calls are spent (`backlinks/summary/live`, `backlinks/referring_domains/live`, `backlinks/anchors/live`), within `seo.dataforseo.maxCallsPerRun` (30), and the raw JSON is attached to the story, not committed

#### Scenario: no authorised source

- WHEN neither DataForSEO nor a Search Console export is available
- THEN nothing is recorded, NRD-21 gets a comment and the `needs-human` label, and the undated "26 dominios referentes" figure is not reused

#### Scenario: toxic domains

- WHEN domains have a DataForSEO `backlinks_spam_score` of 60 or more
- THEN they are listed with their score under "Dominios probablemente spam (solo listado, sin disavow)"

### Requirement: outreach list

The outreach table SHALL hold 10-20 real opportunities (Scope decision 2026-11-14: closed with 5 verified opportunities by the owner). Each has a URL that answers 200 at the time of checking, the real relationship (or "sin relación previa"), the proposed resource (usually `/recursos/` or a guide), why it is relevant, expected evidence and a rejection criterion. Status is "No iniciado".

#### Scenario: anti-manipulation

- WHEN a candidate requires payment, a link exchange or is an irrelevant or bulk directory
- THEN it is not listed

## Files (layer `app`)

| Action | Path                                            | Notes                                                                              |
| ------ | ----------------------------------------------- | ---------------------------------------------------------------------------------- |
| create | `scripts/lib/register-metrics.mjs`              | `findUnsourcedMetrics(markdown)`                                                   |
| modify | `scripts/check-seo-13.mjs`                      | use the helper instead of the inline regex at lines 59-62                          |
| create | `tests/register-metrics.test.js`                | unit test of the rule                                                              |
| modify | `docs/seo-audit/authority-backlink-register.md` | baseline section, toxic list, outreach rows; update "Estado" and "Última revisión" |

## Interfaces

```js
// scripts/lib/register-metrics.mjs
export const METRIC_PATTERN =
  /(?:\b(?:DA|DR|authority score)\s*[:=]\s*\d|\b\d+\s+backlinks?\b|\b\d+\s+dominios?\s+referentes?\b)/gi;

/**
 * Returns metric mentions that are not inside a dated, sourced baseline
 * section ("## Línea base YYYY-MM-DD" with "Fuente:" and "Fecha de captura:").
 * @param {string} markdown
 * @returns {{ section: string, match: string }[]}
 */
export function findUnsourcedMetrics(markdown) {}
```

The baseline section layout (Spanish):

- `## Línea base <fecha> (<fuente>)`;
- `Fuente:`, `Fecha de captura:`, `Llamadas:`;
- a totals table;
- the top anchors table;
- spam share with its threshold;
- the "Dominios probablemente spam (solo listado, sin disavow)" list.

## Data

None in the product. The register is documentation.

## Test plan (TDD order)

1. `tests/register-metrics.test.js` (RED, task 1.1): the four cases from the Requirements, plus "current register reports nothing". Implement the helper and wire it into `check-seo-13.mjs` (GREEN). Then `pnpm build` and `pnpm check:seo-13:dist`.
2. Task 1.2: capture and record the baseline; `check:seo-13:dist` must pass.
3. Task 1.3: research and record the opportunities; `check:seo-13:dist` must pass.

## Real-browser / e2e checks

None in the UI. QA spot-checks three opportunity URLs (they answer and are relevant) and one baseline total against the attached export.

## Risks

- **Developer access to DataForSEO.** The harness has `seo.dataforseo.enabled`, but the developer agent may not have the tools. The fallback is explicit (`needs-human`) rather than invented numbers.
- **Cost.** At most 5 Backlinks API calls. The Backlinks API may need a separate DataForSEO subscription. If it answers "access denied", that is a fallback case, not a failure.
- **Loosening a guard.** The new rule permits numbers only with a dated source, so it is stricter about provenance than before, not looser. The unit test locks it.
- **Size.** Research of 10-20 verified opportunities plus the baseline fits 3 points if the source is available.

## ADRs

0005 (sitemap, robots, llms.txt and build-time SEO checks), 0006 (node:test and TDD).

## Tasks

- [x] 1.1 [NRD-60 app] Extract the register metric guard into `scripts/lib/register-metrics.mjs` (numbers only in dated, sourced baseline sections) and use it in `check-seo-13`; tests: `tests/register-metrics.test.js` first.
- [x] 1.2 [NRD-61 app] Capture a dated backlink baseline from DataForSEO (at most 5 calls) or a Search Console export and record it, with the toxic list and no disavow; tests: check-seo-13 (rule from 1.1).
- [x] 1.3 [NRD-62 app] Add 10-20 verified local and sector link opportunities to the outreach table; tests: check-seo-13. Scope decision 2026-11-14: closed with 5 verified opportunities by the owner.
