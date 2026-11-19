# Tasks

## 1. Font stacks in DESIGN.md

- [x] 1.1 [NRD-315 app] Record the published font stacks (with "Onest Fallback" and "Instrument Serif Fallback") in the seven `DESIGN.md` `typography.*.fontFamily` tokens and the "Display / Body Font" / "Accent Font" lines, plus one sentence on why the fallbacks exist (CLS, NRD-310), where they live (`src/styles/fonts.css`) and that they stay on other pages; tests: `tests/design-md-fonts.test.js` first (tokens equal the CSS stacks of `Layout.astro` `html` and `template.css` `.tpl-accent`, Typography lines include them, explanation present), RED on the current `DESIGN.md`, then GREEN

## Workflow follow-up

- No real-browser checks (documentation and tests only; no file under `src/` changes).
- Archive the change at dev-done (`/team-harness:dev`).
