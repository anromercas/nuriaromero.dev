# Tasks

Documentation only: no file under `src/`, `public/`, `scripts/` or `tests/` changes.

## 1. FAQ gap report

- [ ] 1.1 [NRD-336 app] Create `docs/research/NRD-323-faq-gap-report.md` with the published FAQ inventory from `faqPages()`, the question table (source and call date, volume, covered yes/partial/no, covering entry), the data-source log (developer DataForSEO calls: 0; questions reused from `docs/seo-audit/`, `.claude/state/seo/questions/2026-11-16.md` or the optional data step) and the empty owner section; file force-added on its exact path; tests: none (docs, `skip_specs`), `node --test tests/*.test.js` stays green
- [ ] 1.2 [NRD-337 app] Add a 1-2 sentence Spanish answer, target page and word budget (source, current and resulting count) for each uncovered recurring question, or a rejection with reason; only data already in `src/data`; close the data-source log and add the per-page list for the PO; tests: none (docs), `node --test tests/*.test.js` stays green

## Workflow follow-up

- Archive the change at dev-done (`/team-harness:dev`).
