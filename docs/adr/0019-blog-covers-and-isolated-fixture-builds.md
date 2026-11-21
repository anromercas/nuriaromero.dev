# 0019. Blog covers through astro:assets, tested with isolated fixture builds

- Status: Accepted
- Date: 2026-11-21

## Context

NRD-328 adds an optional cover image to blog posts. The blog schema had an unused `image` string that only fed og:image and the Article schema. The site already optimizes images with `astro:assets` (`<Image>` with sources in `src/assets/`, `sharp` installed), and the static build must stay free of new dependencies and new origins.

Testing the post layout with a cover needs a built page that has a cover. Committing a fixture post would publish it (or, as a draft, still bump `/blog/` freshness through `src/data/page-freshness.ts`), and Astro 4.4 has no container API to render a component in a unit test. NRD-327 has the same need: it must prove with a real build that a `draft: true` post never reaches pages, sitemap, RSS, the blog listing or `llms.txt`.

## Decision

- A blog post image is set only through `cover: { src, alt }` in the frontmatter. `src` uses the content-collection `image()` helper with files under `src/assets/blog/`; `alt` is required and non-blank. The schema lives in the pure builder `blogSchema(image)` in `src/content/blog-schema.ts` so `node --test` covers it; `src/content/config.ts` only passes the helper.
- The visible cover is rendered with `<Picture>` (AVIF and WebP, JPEG fallback); share images (og:image, twitter:image, Article `image`) use one JPEG generated with `getImage()`. All files are same-origin under `/_astro/`.
- `scripts/check-seo-25.mjs` guards cover alt, dimensions, missing files and weight (largest generated file at most 100 KB).
- Tests that need built output for content that must not be published use `tests/helpers/isolated-build.mjs`: it copies an allow-list of project files (never `.env*`) to a temporary directory, adds fixture posts and files, and runs the Astro JS `build()` in a child process with its own cache directory and without Google API credentials. One isolated build per test file.

## Consequences

- One way to add a post image, with alt enforced by the build; NRD-331 and the content pipeline (NRD-327) use `cover`.
- Layout and content-flow tests can assert real built HTML without committing fixtures to `src/content/`.
- The unit suite gets slower by one site build per test file that uses the helper; designs should reuse an existing isolated build file rather than add new ones when possible.
- Reviews check that new fixture-dependent tests use the helper instead of committing fixtures under `src/content/` or `src/pages/`.

## Evidence

- `src/content/blog-schema.ts`, `src/content/config.ts`, `src/layouts/BlogPostLayout.astro`, `scripts/lib/blog-cover-contract.mjs`, `scripts/check-seo-25.mjs` (NRD-328).
- `tests/helpers/isolated-build.mjs`, `tests/blog-cover-render.test.js` (NRD-328), `tests/blog-drafts.test.js` (NRD-327).
- Design: `openspec/changes/nuriaromero-328-blog-cover-images/design.md`.
