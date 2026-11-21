## Context

- Blog collection: `src/content/config.ts` (`draft: z.boolean().default(false)`; NRD-328 moves the schema to `src/content/blog-schema.ts` and adds `cover`). Draft filters today: `src/pages/blog/[slug].astro:7` (`getStaticPaths`), `src/pages/blog/index.astro:13`, `src/pages/rss.xml.ts:8`, all `getCollection("blog", ({ data }) => !data.draft)`.
- Sitemap: `@astrojs/sitemap` lists built pages only (`astro.config.mjs:52-71`), so a draft is absent if no page is built; `getBlogLastmodBySlug` reads every file, drafts included, but only applies to URLs present in the sitemap.
- `public/llms.txt` is hand-kept (lines 26-30 list the 4 posts); a draft can only leak there by a human or agent edit.
- `/ai/summary.json` and `/ai/faq.json` do not read the blog.
- Existing partial guards: `scripts/check-seo-23.mjs:68-71` (drafts not in `rss.xml`, vacuous while no draft exists); `tests/rss-feed.test.js:65` (source regex of the filter); `tests/blog-index-template.test.js:77-83` (listing vs non-draft posts).
- Freshness: `src/data/page-freshness.ts:55` dates `/blog/` from the last commit touching `src/pages/blog/index.astro` or `src/content/blog`, so committing a draft moves the `/blog/` `dateModified` (and its visible updated label) without any visible content change. Not one of the five paths in the acceptance criteria.
- Isolated build helper and cover schema: NRD-328 (ADR 0019, `tests/helpers/isolated-build.mjs`), designed in `openspec/changes/nuriaromero-328-blog-cover-images/design.md`.
- Tools the pipeline can reuse (installed for the orchestrator): skills `claude-seo:seo-content-brief`, `claude-seo:seo-geo`, `claude-seo:seo-sxo`, a copywriting skill, `seo-page-pipeline`, agent `seo-strategist`, DataForSEO (30 calls per run), `team-harness` (PO/TL/dev/QA, PR flow with CI `verify`), and the social image library flow (`social.library`) as a possible cover source.

## Goals / Non-Goals

**Goals:** a pipeline design the owner can approve step by step; proof by test that drafts never publish; a short list of follow-up stories.

**Non-Goals:** implementing the pipeline; publishing posts; fixing the `/blog/` freshness gap here.

## Decisions

**Approach.** Two commits: first the draft-safety test (it informs the document), then the document. The test uses a real isolated build instead of source regexes ("proven by tests, not by reading") and never commits a fixture under `src/content/blog/` (that would publish it, or as a draft bump `/blog/` freshness). A published control post with the same body makes every negative assertion meaningful. The document recommends, with trade-offs, a project skill (`.claude/skills/blog-pipeline/`) that orchestrates existing skills and calls deterministic scripts (topic shortlist from DataForSEO data, outline lint, frontmatter scaffold, word count) rather than a team-harness command, because the steps are specific to this site's voice, template and data; the document may conclude otherwise if the mapping shows the harness already covers more.

**Files (layer `app`).**

- Create `tests/blog-drafts.test.js`:
  - `before`: `isolatedBuild({ posts: [draft, control] })` from `./helpers/isolated-build.mjs`; fixture frontmatter `title`, `description`, `pubDate: 2026-11-20`, `tags: []`, `draft: true|false`; neutral Spanish body with one H2 so the post contract passes. `after`: `cleanup()`. `{ timeout: 240_000 }`.
  - Cases per scenario in the spec: page file existence; `sitemap-*.xml` (all files from `readdir(dist)`); `rss.xml`; `blog/index.html` (`href="/blog/<slug>/"`); `llms.txt`; the pure `public/llms.txt` vs draft slugs case (no build needed).
- If `tests/helpers/isolated-build.mjs` does not exist on the branch (NRD-328 not merged), create it and `isolated-build-child.mjs` exactly per the interface in the NRD-328 design and ADR 0019 (the ADR file itself is NRD-328's; reference it).
- Create `docs/designs/NRD-327-blog-content-pipeline.md` (English, Spanish quotes verbatim) with sections:
  1. Summary and principles (nothing publishes without the owner merge; no invented claims, PRD principle 1; GEO template: direct answer first, freshness from content, one brand string).
  2. Steps table: step (1 topic, 2 outline, 3 cover image, 4 draft, 5 publish), input, who/what runs it (skill, agent, script), output artifact and path, owner approval point, gap. Paths: `seo/contenido/<slug>/tema.md` (topic with demand data and sources), `seo/contenido/<slug>/esquema.md` (title, H1/H2, secondary keywords, sources, direct-answer opening, word target), cover per NRD-328/NRD-331 (`src/assets/blog/<slug>.<ext>` plus `cover.alt`, under 100 KB guard), draft `src/content/blog/<slug>.md` with `draft: true` on branch `feat/NRD-<n>-post-<slug>`, publish = PR with CI `verify`, the owner flips `draft: false` (or approves the commit that does) and merges. Note that `seo/` is untracked in the main checkout today: the document recommends tracking `seo/contenido/` or using `docs/content/` instead, as a decision for the owner/PO.
  3. Draft safety: the five paths and the test that covers each (task 1.1 result), plus the reported gap (draft commit moves `/blog/` `dateModified`; proposed fix: date `/blog/` from the newest published post date instead of the folder commit date; size; filed by the PO as a bug).
  4. Reused skills/agents per step and gaps (what is missing: brand-voice guide for posts, outline lint script, topic de-duplication against `src/data/seo-intents.ts` keyword ownership, ADR 0012).
  5. Recommendation: project skill vs team-harness command, with trade-offs (reuse across projects, token cost, approval UX, unattended runs) and the deterministic steps that become scripts.
  6. Follow-up stories (title, scope, size, acceptance criteria with tests), for the PO to file.

**Interfaces.** `isolatedBuild` as defined in the NRD-328 design / ADR 0019. No new production interface.

**Data.** None.

**Test plan (TDD order).**

1. Task 1.1 (NRD-341): write `tests/blog-drafts.test.js`. Observe RED honestly: run it once with the `!data.draft` filter removed from `src/pages/rss.xml.ts` (local edit, never committed) and see the `rss.xml` case fail; restore and see GREEN. If any path really leaks: fix it in this task only if S (for example adding a missing filter), otherwise keep the failing case as `test.todo` with the bug reference and report it in the document.
2. Task 1.2 (NRD-342): write the document. Checks: `node --test tests/*.test.js`, `pnpm build`.

**Real-browser / e2e checks.** None for QA beyond CI: the test file and a document; no page, layout or style changes.

**ADRs relied on.** ADR 0019 (isolated fixture builds, blog covers), ADR 0017 (build-derived freshness: the reported gap), ADR 0018 (build-time endpoints: `rss.xml`), ADR 0012 (keyword ownership for topic selection), ADR 0005 (sitemap, robots, llms.txt).

## Risks / Trade-offs

- Dependency on NRD-328 for the helper: mitigated by the fallback to create it with the same interface; whichever story merges second resolves the trivial conflict by keeping one copy.
- The isolated build adds tens of seconds to the unit suite; it shares nothing with the real `dist/` and is cleaned up after the test.
- `seo/` is untracked today, so artifacts stored there would not reach the PR; the document flags it instead of choosing silently.
- Size: the test infrastructure plus the document fits 3 points only because NRD-328 provides the helper; if NRD-328 slips and the helper must be built here, the story is closer to 5 points (noted for the PO).
