# Tasks

## 1. Breadcrumbs polish

- [ ] 1.1 [NRD-237 app] Add `cursor: default` to `.crumbs-current` and set `.crumbs ol` to `gap: 0.375rem 0.5rem` in `src/components/Breadcrumbs.astro`; tests: `tests/breadcrumbs-ink.test.js` first (RED: default cursor, row gap >= focus ring width + offset read from `template.css`; coverage: muted, secondary, link >= 4.5:1 and sky >= 3:1 on the purple radial of `Layout.astro` composited over `--site-ground`), then suite, `pnpm build` and `pnpm check:seo:dist` green

## Workflow follow-up

- QA runs the real-browser checks in design.md.
- Archive the change at dev-done (`/team-harness:dev`).
