# Tasks

## 1. Breadcrumbs in the ink world

- [ ] 1.1 [NRD-231 app] Restyle `src/components/Breadcrumbs.astro` on the ink tokens: import `@/styles/template.css`, links with `class="tpl-link"`, scoped `crumbs` / `crumbs-sep` / `crumbs-current` rules, no `gray-*` / `blue-*`, same props and ARIA; tests: `tests/breadcrumbs-ink.test.js` first (RED: palette, import, `tpl-link` focus rule, token contrast, ARIA), then suite, `pnpm build` and `pnpm check:seo:dist` green

## Workflow follow-up

- QA runs the real-browser checks in design.md.
- Archive the change at dev-done (`/team-harness:dev`).
