## ADDED Requirements

### Requirement: Rank tracking follows the keyword ownership map

Every term of `keywordOwners` in `src/data/seo-intents.ts` SHALL appear in `seo.rankTracking.keywords` of `.claude/harness.json` with the same `page` as its owner `url`. Tracked rows that are not owner terms (such as the navigational reference `tienda online sevilla`) are allowed.

#### Scenario: All owner terms tracked for their page

- **WHEN** `tests/rank-tracking-keywords.test.js` compares `keywordOwners` with `seo.rankTracking.keywords`
- **THEN** `untrackedOwners(keywordOwners, keywords)` returns an empty list

#### Scenario: Owner term missing or tracked for another page

- **WHEN** an owner term is absent from the tracked rows, or tracked with a different page
- **THEN** `untrackedOwners` returns that term with its owner `url` and the tracked page (or `null` when absent), and the test fails naming it

### Requirement: Written iteration review routine per owner page

`docs/seo-audit/measurement-seo.md` SHALL hold a section `## Revisión de iteración`, in Spanish, that names every owner URL of `keywordOwners`, sets a cadence of every 2 to 4 weeks (the first not earlier than 28 days after the promotion that took the reviewed page change to production) and provides a record template per review (date, window, source and filters, observed data, gap, decision) reusing the existing annotation template.

#### Scenario: Cadence and template present

- **WHEN** a reviewer reads the section
- **THEN** it states the 2 to 4 week cadence, the 28-day rule after promotion, and a fenced template with the fields date, window, source and filters, observed data, gap and decision

### Requirement: Each owner page is compared with the NRD-17 baselines

For each owner page the routine SHALL compare with the NRD-17 baselines: Search Console impressions, clicks, CTR and average position in 28-day windows; the position of its keywords in `seo/ranks/history.jsonl`; GA4 booking clicks (`contact_click` with `contact_method=booking`); and AI citation presence measured with the same method as the AI citation baseline.

#### Scenario: Section names every owner page

- **WHEN** `tests/iteration-review-routine.test.js` extracts the text from `## Revisión de iteración` to the next H2
- **THEN** the section exists and contains every `keywordOwners` URL in backticks, `seo/ranks/history.jsonl`, `contact_click` and `contact_method=booking`
- **AND** the test fails on the document before this change

#### Scenario: No unsourced KPI figure

- **WHEN** the measurement document is scanned by `tests/register-metrics.test.js` and `check-seo-14`
- **THEN** the new section contains no KPI figure (clicks, impressions, position values) outside a dated baseline section, so both stay green

### Requirement: Every review closes with a decision and a control step

The routine SHALL require one decision per owner page: keep, adjust (a new or refined story in epic NRD-4 with its evidence) or escalate to the PO; it SHALL allow only observed, dated and sourced figures, mark gaps as gaps and never promise positions. It SHALL include a control step that checks `seo.rankTracking.keywords` still matches `keywordOwners` and, when a new page wins an owner keyword, proposes the change to the PO, the configuration being changed only by a story.

#### Scenario: Decision vocabulary and control step present

- **WHEN** `tests/iteration-review-routine.test.js` reads the section
- **THEN** it contains "mantener", "ajustar" and "escalar", and names `seo.rankTracking.keywords` and `keywordOwners`
