# Tasks

## 1. ADR 0013 row 5 anchor

- [x] 1.1 [NRD-279 app] Align ADR 0013 table A row 5 with the published `/` → `/portfolio/` anchor (note: changed with NRD-243 for the home "Sevilla" cap), record the amendment in the Status line, optionally add one pointer line to `docs/designs/NRD-119-registry-link-rows.md`; tests: doc-sync test "ADR 0013 table A matches the pinned rows" in `tests/adr-0013-link-rows.test.js` first (RED on row 5), then the ADR edit (GREEN), then `node --test tests/*.test.js` and `pnpm build` green

## Workflow follow-up

- No real-browser checks (docs and test only).
- Archive the change at dev-done (`/team-harness:dev`).
