# Tasks

Order: 1.1 blocks 1.2 (NRD-269 blocks NRD-270): the check of 1.2 reads the feed of 1.1.

## 1. Feed and discovery

- [ ] 1.1 [NRD-269 app] Create `src/lib/rss.ts` (`escapeXml`, `buildRssFeed`) and the prerendered endpoint `src/pages/rss.xml.ts`, exclude `/rss.xml` from the sitemap in `astro.config.mjs`, reword the "Static output" item of `.claude/harness/invariants.md` and the static-output line of `openspec/config.yaml` (exact text and `.claude/` guard in design.md); tests: `tests/rss-feed.test.js` builder and source tests first (RED), then full suite, `pnpm build` (`dist/rss.xml` present, not in `dist/sitemap-0.xml`) and `pnpm check:seo:dist` green
- [ ] 1.2 [NRD-270 app] Add the alternate link to `src/components/seo/SEO.astro`, create `scripts/check-seo-23.mjs` (rules in design.md) and wire `check:seo-23`, `check:seo-23:dist` and `check:seo:dist` in `package.json`; tests: `SEO.astro` source assertion in `tests/rss-feed.test.js` and `tests/package-scripts.test.js` RED, `check-seo-23` RED on the current `dist/`, then full suite, `pnpm build` and `pnpm check:seo:dist` green

## Workflow follow-up

- QA runs the real-browser checks in design.md (feed in the browser, W3C feed validator on `dist/rss.xml`, one alternate link in the head).
- The PR description calls out the reworded "Static output" invariant (ADR 0018).
- Archive the change at dev-done (`/team-harness:dev`).
