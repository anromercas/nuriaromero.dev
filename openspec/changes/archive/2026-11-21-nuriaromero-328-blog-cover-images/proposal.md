## Why

Tracker: [NRD-328](https://nuriaromerodev.atlassian.net/browse/NRD-328).

The 4 posts have no visible image. `image` in the blog schema (`src/content/config.ts:10`) is an optional string used only for og:image and the Article schema; `src/layouts/BlogPostLayout.astro` does not render it and no post sets it. Posts with a relevant image look more complete, share better and give search and AI engines more context. The PO split the work: this story (1/2) delivers the schema, the layout and the build guard; NRD-331 (2/2) adds the images for the 4 posts; the pipeline step goes into NRD-327.

## What Changes

- The blog schema replaces the unused `image` string with an optional `cover: { src, alt }` object: `src` goes through the Astro image pipeline (`image()` helper, files in `src/assets/blog/`), `alt` is required and non-empty, so a cover without alt fails the build.
- `BlogPostLayout` renders the cover between the post header and the body as a `<figure>` with `<Picture>` (AVIF and WebP sources, JPEG fallback, intrinsic width and height, `loading="eager"`, `fetchpriority="high"`). Posts without a cover render exactly as today.
- og:image, twitter:image and the Article `image` use a 1200 px JPEG of the cover when set; the `SITE.defaultOgImage` fallback is unchanged otherwise.
- New build guard `scripts/check-seo-25.mjs` (pure contract `scripts/lib/blog-cover-contract.mjs`), wired into `check:seo:dist`: fails when a cover lacks alt or dimensions, a referenced file is missing, or the largest generated cover file exceeds 100 KB.
- New test helper `tests/helpers/isolated-build.mjs` that builds a temporary copy of the site with fixture posts, so the layout output is tested with and without a cover without publishing a fixture. Reused by NRD-327 (draft safety). Recorded in ADR 0019.

## Out of scope

- Images for the 4 existing posts and the image sourcing workflow (NRD-331).
- The pipeline cover step (NRD-327 design).
- Covers on the blog index cards, RSS enclosures or `/ai/*` files.
- Any new runtime dependency (`sharp` and `astro:assets` are already used) or CSP change (images are same-origin under `/_astro/`).

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `blog-post-layout`: optional cover image with required alt; cover build guard; og:image and Article image from the cover.

## Impact

- Layer `app`: `src/content/blog-schema.ts` (new), `src/content/config.ts`, `src/layouts/BlogPostLayout.astro`, `scripts/lib/blog-cover-contract.mjs` (new), `scripts/check-seo-25.mjs` (new), `package.json` (scripts only), tests and helpers under `tests/`, `docs/adr/0019-blog-covers-and-isolated-fixture-builds.md` and the ADR index.
- Schema change: `image` (unused) removed, `cover` added; no post changes. No URL, copy or price change; nothing radical.
