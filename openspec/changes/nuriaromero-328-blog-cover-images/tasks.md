# Tasks

Ships before NRD-331 (images for the 4 posts) and before NRD-327 task 1.1, which reuses `tests/helpers/isolated-build.mjs`.

## 1. Blog cover

- [x] 1.1 [NRD-338 app] Move the blog schema into `src/content/blog-schema.ts` as `blogSchema(image)` with optional `cover: { src: image(), alt }` (strict, alt non-blank) replacing the unused `image`; `config.ts` passes the real helper; layout compiles with the fallback unchanged; tests: `tests/blog-cover-schema.test.js` first (missing alt, blank alt, unknown key fail; no cover passes)
- [x] 1.2 [NRD-339 app] Add `scripts/lib/blog-cover-contract.mjs` (`blogCoverFailures`) and `scripts/check-seo-25.mjs`, wired into `check:seo:dist` with `check:seo-25` and `check:seo-25:dist`; tests: `tests/check-seo-25.test.js` fixture HTML cases first (alt, dimensions, empty figure, missing file, largest file over 102400 bytes), then `tests/package-scripts.test.js` green after wiring
- [ ] 1.3 [NRD-340 app] Render the cover in `BlogPostLayout.astro` (`<Picture>` AVIF/WebP, JPEG fallback, eager, high priority, intrinsic size) and use a 1200 px JPEG of it for og:image, twitter:image and Article image; add `tests/helpers/isolated-build.mjs` and `isolated-build-child.mjs`; tests: `tests/blog-cover-render.test.js` (isolated build of a fixture post with and without cover) and source cases in `tests/blog-post-template.test.js` first

## Workflow follow-up

- QA runs the real-browser checks in design.md with a temporary local cover.
- Archive the change at dev-done (`/team-harness:dev`).
