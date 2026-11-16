# Tasks

Sprint order: after NRD-222 (rebase on `develop`; the new check takes the number after NRD-222's `check-seo-18`).

## 1. Custom 404 page

- [ ] 1.1 [NRD-227 app] Add `focusServices` to `src/data/services.ts`, omit the canonical on `noindex` pages in `src/components/seo/SEO.astro`, create `src/pages/404.astro` on the template (noindex, hero, `SeoLocalRelated` exits from `focusServices` plus home, `SeoLocalClosing`, no `SectionContainer`, breadcrumbs or page schema) and `scripts/check-seo-19.mjs` with its `package.json` scripts; tests: `tests/not-found-page.test.js` first (RED); suite, `pnpm build` and `pnpm check:seo:dist` green incl. 02, 06, 07 and the new check; `public/_redirects` and `public/_headers` untouched

## Workflow follow-up

- QA runs the real-browser checks in design.md.
- After promotion to `main`, the orchestrator runs the owner-account check in design.md.
- Archive the change at dev-done (`/team-harness:dev`).
