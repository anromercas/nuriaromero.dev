# Tasks

Task 1.1 reuses `tests/helpers/isolated-build.mjs` from NRD-328 (NRD-340 blocks NRD-341); if it is not on develop yet, create it with the ADR 0019 interface.

## 1. Draft safety and pipeline design

- [ ] 1.1 [NRD-341 app] Add `tests/blog-drafts.test.js`: isolated build with a `draft: true` fixture and a published control; the draft reaches no page, sitemap, `rss.xml`, blog listing or `llms.txt`, the control reaches the first four; plus `public/llms.txt` links no draft slug; tests: `tests/blog-drafts.test.js` first, RED observed by removing the `rss.xml.ts` draft filter locally (not committed)
- [ ] 1.2 [NRD-342 app] Write `docs/designs/NRD-327-blog-content-pipeline.md` (steps with approval points, artifacts and paths, cover step, reused skills and gaps, draft-safety results and the `/blog/` freshness gap, recommendation with trade-offs, follow-up stories); tests: none new (document), `node --test tests/*.test.js` and `pnpm build` green

## Workflow follow-up

- Archive the change at dev-done (`/team-harness:dev`).
