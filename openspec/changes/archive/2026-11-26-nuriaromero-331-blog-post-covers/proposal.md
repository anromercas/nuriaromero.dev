## Why

[NRD-331](https://nuriaromerodev.atlassian.net/browse/NRD-331): NRD-328 made the post layout render an optional, optimized cover with required alt text, but none of the four published posts in `src/content/blog/` sets one. Without a cover the posts look unfinished, share with the generic site image and give search and AI engines less context. PO decision (refinement 2026-11-26): reuse the Flow media library (`social/mediateca/`, themes `negocio-local` and `busqueda-movil`, never `navidad-sevilla`); since `social/` is not tracked, each cover is copied into `src/assets/blog/<slug>.<ext>`, sized and compressed for the `check-seo-25` guard, with its source recorded in a `credits.json` beside the images.

## What Changes

- Four covers, one per post, cropped to 16:9 (1536x864) from approved mediateca stills and committed as `src/assets/blog/<slug>.jpg`.
- `src/assets/blog/credits.json` records, per cover, the mediateca entry (id and file), the generation tool, model and date, the crop box and the licence.
- Each post sets `cover: { src, alt }` with a Spanish alt that describes the image. `pubDate` and `updatedDate` stay as they are: a cover is not a content change, so the posts' `dateModified` does not move.
- `BlogPostLayout` encodes the generated cover files (`<Picture>` sources, JPEG fallback and the 1200 px share JPEG) at quality 60 so detailed photos fit the 100 KB guard (measured: quality 80 gives 119-138 KB for the two most detailed crops).
- The blog pipeline skill (step 3) states the 16:9 crop and the 1280 px minimum width (the largest generated width) instead of 1600 px, which the 1536 px Flow stills cannot meet.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `blog-post-layout`: covers are encoded at quality 60; the four existing posts now render a cover; every published post carries a sourced cover.

## Impact

- Code and content (layer `app`): `src/layouts/BlogPostLayout.astro`, `src/content/blog/*.md` (frontmatter only), new `src/assets/blog/*.jpg` and `src/assets/blog/credits.json`, tests `tests/blog-post-template.test.js` and new `tests/blog-covers-content.test.js`; shared path `.claude/skills/blog-pipeline/SKILL.md` (one line of step 3).
- Public pages: the four post pages gain a visible cover and their own og:image, twitter:image and `Article.image`. No URL, title, copy or date changes.
- Repository: about 450 KB of new JPEG sources (four 1536x864 files).
- No new dependency (`sharp` is already a dependency), no new origin (files are same-origin under `/_astro/`), no data migration. Nothing radical.

## Out of scope

- Generating new images with Flow (only needed if no mediateca image fits; the design maps all four posts to existing approved stills).
- Covers on the blog index or related-post cards.
- A reusable cover-preparation script for the blog pipeline.
- Versioning `social/` or moving the media library.
