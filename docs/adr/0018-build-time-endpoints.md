# 0018. Prerendered endpoints for build-time files

- Status: Accepted
- Date: 2026-11-17

## Context

The site is a fully static Astro build (ADR 0001). The invariant "Static output" listed "an endpoint under `src/pages/`" as a violation, meaning server endpoints and API routes. NRD-244 needs `/rss.xml` generated from the blog content collection. In a static Astro build, a `src/pages/*.xml.ts` endpoint is prerendered: Astro calls its `GET` once at build time and writes the result to `dist/`; nothing runs at request time. Alternatives (a new `@astrojs/rss` dependency, a build hook or script that re-parses frontmatter outside the content layer, a hand-kept file) are worse or need the owner.

## Decision

- Prerendered endpoints that emit a static file at build time are allowed under `src/pages/` (first one: `src/pages/rss.xml.ts`). They read only build-time data (content collections, `src/data`), never the request.
- Server endpoints stay forbidden: no adapter, no `export const prerender = false`, no endpoint that reads the request at runtime.
- Pure builders live in `src/lib/` without `astro:*` imports so `node --test` covers them; the endpoint only maps collection data to the builder.

## Consequences

- Machine-readable files derived from site data (feeds, future AI discovery files) can be generated at build instead of hand-kept in `public/`.
- Reviews check that a new endpoint is prerendered and does not read the request.
- `.claude/harness/invariants.md` and `openspec/config.yaml` carry the clarified wording.

## Evidence

- `src/pages/rss.xml.ts`, `src/lib/rss.ts`, `scripts/check-seo-22.mjs`, `tests/rss-feed.test.js` (NRD-244).
- Design: `openspec/changes/nuriaromero-244-blog-rss-feed/design.md`.
