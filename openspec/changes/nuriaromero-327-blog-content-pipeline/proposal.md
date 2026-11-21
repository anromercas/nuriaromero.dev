## Why

Tracker: [NRD-327](https://nuriaromerodev.atlassian.net/browse/NRD-327).

A three-agent chain (SEO expert, copywriter, publisher) can turn validated keyword ideas into blog posts. The repo already has most of the pieces (DataForSEO access, SEO skills, the blog collection with `draft`, CI with tests and SEO checks). Before building it we need a design of a safer, owner-approved pipeline, and proof that a draft can never leak into the public site, because the pipeline will commit drafts on feature branches.

## What Changes

- New document `docs/designs/NRD-327-blog-content-pipeline.md`: the steps topic, outline, cover image (NRD-328/NRD-331), draft and publish, each with its owner approval point, artifact and storage path, the skills/agents reused, the gaps, a recommendation (project skill or team-harness command) with trade-offs, known risks, and follow-up implementation stories (scope, size, acceptance criteria) for the PO to file.
- New test `tests/blog-drafts.test.js`: builds an isolated copy of the site with a `draft: true` fixture post and a published control (helper `tests/helpers/isolated-build.mjs`, ADR 0019, from NRD-328) and proves the draft reaches neither the built pages, the sitemap, `rss.xml`, the blog listing nor `llms.txt`, while the control reaches the first four.
- Known gap reported, not fixed here: committing a draft under `src/content/blog/` moves the `/blog/` `dateModified`, because `src/data/page-freshness.ts:55` dates `/blog/` from the last commit touching that folder.

## Out of scope

- Implementing the pipeline (follow-up stories).
- Fixing a leak larger than S, including the `/blog/` freshness gap (PO files a bug).
- Publishing any post; every post goes through PR review and the owner's merge (PRD principle 1).

## Capabilities

### New Capabilities

- `blog-drafts`: draft posts are never published.

### Modified Capabilities

- None.

## Impact

- Layer `app`: `docs/designs/NRD-327-blog-content-pipeline.md` (new), `tests/blog-drafts.test.js` (new); reuses `tests/helpers/isolated-build.mjs` (creates it with the ADR 0019 interface if NRD-328 has not merged).
- No change under `src/` or `public/` unless an S-sized leak fix is needed. No dependency, URL, copy or data change; nothing radical.
