# Tasks

## 1. Build guard

- [ ] 1.1 [NRD-238 app] Add the pure rule `scripts/lib/og-url.mjs` (`isNoindex`, `ogUrlProblems`), the walker `scripts/check-seo-20.mjs` over every `dist/**/*.html`, the `check:seo-20` pair and its place at the end of `check:seo:dist` in `package.json`, and relax the chain-order assertion in `tests/not-found-page.test.js`; tests: `tests/og-url-guard.test.js` first (RED: valid service page, missing/mismatched/duplicated/no-slash `og:url`, clean noindex 404 and report, 404 with `og:url` or canonical, JSON-LD ignored, package.json wiring, built dist clean when present), then suite, `pnpm build` and `pnpm check:seo:dist` green

## Workflow follow-up

- QA runs the checks in design.md.
- Archive the change at dev-done (`/team-harness:dev`).
