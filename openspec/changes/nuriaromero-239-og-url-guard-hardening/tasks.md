# Tasks

## 1. Guard hardening

- [x] 1.1 [NRD-240 app] Make `isNoindex` in `scripts/lib/og-url.mjs` treat the robots tokens `noindex` and `none` as noindex, and replace `URL.pathname` with `fileURLToPath` in `scripts/check-seo-20.mjs`, `tests/og-url-guard.test.js` and `tests/store-offer.test.js`; tests: new "robots none is treated as noindex" test in `tests/og-url-guard.test.js` first (RED), then suite, `pnpm build` and `pnpm check:seo-20:dist` green with the same indexable/noindex counts as `develop`

## Workflow follow-up

- QA runs the checks in design.md.
- Archive the change at dev-done (`/team-harness:dev`).
