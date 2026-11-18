# Tasks

Ships before NRD-248, which reads the real-browser verification recorded here before adding Sortlist to `sameAs`. Documentation only: no file under `src/`, `public/`, `scripts/` or `tests/` changes.

## 1. Citation record

- [x] 1.1 [NRD-293 app] Check the Sortlist profile in a real browser and record it in `docs/seo-audit/local-signals-2026-11.md` (sources, NAP third-party row, "Citas de terceros" rows for Sortlist and Clutch "pendiente de revisión (NRD-292)", "Seguimiento" AI-citation check) and in a new "Pending checks" section of `.claude/harness/seo.md`; tests: none (docs, `skip_specs`), `node --test tests/*.test.js` stays green

## Workflow follow-up

- QA (or the orchestrator, see design.md) runs the real-browser check in design.md.
- Archive the change at dev-done (`/team-harness:dev`).
