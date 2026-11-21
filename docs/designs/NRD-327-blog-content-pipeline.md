# NRD-327 - Blog content pipeline (topic, outline, cover, draft, publish)

[NRD-327](https://nuriaromerodev.atlassian.net/browse/NRD-327). Design only: nothing in this document is implemented except the draft-safety test (`tests/blog-drafts.test.js`, NRD-341). Implementation is split into the follow-up stories of section 6, which the PO files.

## 1. Summary and principles

A chain of agents (SEO expert, copywriter, publisher) can turn validated keyword ideas into blog posts, with the owner approving each step. The repo already has most pieces: DataForSEO access, the SEO skills, the blog collection with `draft`, and CI with unit tests and SEO checks.

Principles:

- **Nothing publishes without the owner's merge.** A post is only a draft on a feature branch until the owner approves the PR and merges it (`feat/*` into `develop`, then `develop` into `main` to release).
- **Truth over persuasion** (`docs/PRD.md` principle 1, `PRODUCT.md`). No invented figures, testimonials, rankings or promised positions. Every claim in a draft cites a source listed in `esquema.md`.
- **GEO template.** Direct answer first (the opening paragraph answers the query on its own), freshness derived from content (ADR 0017, not hand-typed dates), one brand string (`SITE`).
- **One keyword owner per intent** (ADR 0012): a topic that duplicates an owned intent is rejected at step 1.

## 2. Steps

| Step          | Input                                                                       | Runs it                                                                                                        | Output artifact and path                                                                                         | Owner approval point                                   | Gap                                                                                                   |
| ------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| 1 Topic       | Validated keyword ideas, DataForSEO volume and SERP data (30 calls per run) | Agent `seo-strategist` with skill `claude-seo:seo-content-brief`; a script shortlists candidates from the data | `seo/contenido/<slug>/tema.md`: topic, search demand data, intent, sources                                       | Owner picks one topic from the shortlist               | No de-duplication against `src/data/seo-intents.ts` keyword ownership (ADR 0012); no shortlist script |
| 2 Outline     | Approved `tema.md`                                                          | Skills `claude-seo:seo-content-brief`, `claude-seo:seo-sxo`, `claude-seo:seo-geo`                              | `seo/contenido/<slug>/esquema.md`: title, H1/H2, secondary keywords, sources, direct-answer opening, word target | Owner approves the outline before any prose is written | No outline lint script (one H1, H2 list, word target, sources present); no post voice guide           |
| 3 Cover image | Approved `esquema.md`                                                       | Cover flow of NRD-328 / NRD-331, possibly fed by the social image library (`social.library`)                   | `src/assets/blog/<slug>.<ext>` plus `cover.alt` in the frontmatter, under the 100 KB guard                       | Owner approves the image and its alt text              | Image source and generation flow are NRD-331; accessible alt text needs a human check                 |
| 4 Draft       | Approved outline and cover                                                  | A copywriting skill, then `seo-page-pipeline` checks                                                           | `src/content/blog/<slug>.md` with `draft: true`, committed on branch `feat/NRD-<n>-post-<slug>`                  | Owner reviews the draft in the PR                      | No brand-voice guide for posts; word count and frontmatter scaffold are done by hand                  |
| 5 Publish     | Reviewed draft PR                                                           | team-harness PR flow with CI `verify` (unit tests, `check:seo`)                                                | The owner flips `draft: false` (or approves the commit that does) and merges                                     | The owner's merge is the only publish action           | Nothing prevents an agent from flipping `draft` itself; the process relies on the PR approval         |

Storage decision for the owner/PO: `seo/` is untracked in the main checkout today, so `seo/contenido/<slug>/` artifacts would not reach a PR or survive a clean clone. Either track `seo/contenido/` or use `docs/content/<slug>/` instead. This document does not choose silently; it recommends tracking `seo/contenido/` (it keeps the SEO working files together) and moving to `docs/content/` if the owner prefers the whole `seo/` folder to stay private.

## 3. Draft safety

The pipeline commits drafts on feature branches, so a draft must never reach a public output. Proven by `tests/blog-drafts.test.js` (NRD-341) on a real isolated build (ADR 0019): a `draft: true` fixture and a published control post with the same body, never committed under `src/content/blog/`.

| Path                                     | Covered by                                                                                                         | Result       |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------ |
| Built page `dist/blog/<slug>/index.html` | "no page is built" (draft) and "page is built" (control)                                                           | Draft absent |
| `dist/sitemap-*.xml` (every file)        | "not in any sitemap file" and control case                                                                         | Draft absent |
| `dist/rss.xml`                           | "not in rss.xml" and control case                                                                                  | Draft absent |
| `dist/blog/index.html`                   | "not in the blog listing" and control case                                                                         | Draft absent |
| `dist/llms.txt`                          | "not in llms.txt" on the build, plus a pure case that `public/llms.txt` links no draft slug of `src/content/blog/` | Draft absent |

The control post reaching the first four outputs shows the test can see a leak. RED was observed by removing the `!data.draft` filter of `src/pages/rss.xml.ts` locally: the "not in rss.xml" case failed with "rss.xml lists the draft"; restoring the filter turned the suite green. No path leaks today.

Reported gap (not one of the five paths): committing a draft under `src/content/blog/` moves the `dateModified` of `/blog/` (and its visible updated label) without any visible change, because `src/data/page-freshness.ts:55` dates `/blog/` from the last commit touching `src/pages/blog/index.astro` or `src/content/blog`. Proposed fix: date `/blog/` from the newest published post date instead of the folder commit date. Size: S. The PO files it as a bug.

`public/llms.txt` is hand-kept, so a draft can only leak there through a human or agent edit; the pure test guards that case.

## 4. Reused skills and agents, and gaps

| Step    | Reused                                                                     | Missing                                                                                         |
| ------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Topic   | `seo-strategist`, `claude-seo:seo-content-brief`, DataForSEO               | Shortlist script; keyword-ownership de-duplication against `src/data/seo-intents.ts` (ADR 0012) |
| Outline | `claude-seo:seo-content-brief`, `claude-seo:seo-sxo`, `claude-seo:seo-geo` | Outline lint script; brand-voice guide for posts                                                |
| Cover   | NRD-328 schema and render, NRD-331 flow, `social.library`                  | Source and alt-text convention (NRD-331)                                                        |
| Draft   | Copywriting skill, `seo-page-pipeline`                                     | Frontmatter scaffold script; word-count script                                                  |
| Publish | team-harness PO/TL/dev/QA flow, PR with CI `verify`, `check:seo`           | A guard that a PR flipping `draft: false` is approved by the owner (today a convention)         |

## 5. Recommendation: project skill or team-harness command

Recommended: a **project skill** at `.claude/skills/blog-pipeline/` that orchestrates the existing skills and calls deterministic scripts, not a team-harness command.

| Criterion             | Project skill                                                                 | team-harness command                                                                                |
| --------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Reuse across projects | Low: specific to this site                                                    | High, but the voice, template and data are specific to this site, so little would be reused         |
| Token cost            | Low: loaded only when the pipeline runs; scripts do the mechanical work       | Higher: the harness prompt is loaded for every step                                                 |
| Approval UX           | One approval per step by the owner, stored as the artifact files of section 2 | Harness approvals are built around stories and PRs, a coarser grain than topic and outline approval |
| Unattended runs       | Steps 1-4 can run unattended up to the next approval point; step 5 never      | Same, plus subtask bookkeeping per post                                                             |

The harness already covers step 5 (branch, PR, CI, merge); the skill hands over to it for the PR. A command may become worthwhile if a second project needs the same chain; revisit then.

Deterministic steps that become scripts (not model steps): topic shortlist from DataForSEO data, outline lint, frontmatter scaffold, word count, `draft` check before commit.

## 6. Follow-up stories (for the PO to file)

1. **Blog pipeline skill (M, 5 points).** Create `.claude/skills/blog-pipeline/` with the five steps of section 2 and the approval points. Acceptance: running it on a sample topic produces `tema.md` and `esquema.md` and stops for approval; no file under `src/content/blog/` is written before the outline is approved; a unit test covers the skill's frontmatter scaffold.
2. **Pipeline scripts (S, 3 points).** Shortlist, outline lint, frontmatter scaffold and word count under `scripts/`. Acceptance: each has a unit test in `tests/` with fixtures; the scaffold always emits `draft: true`; the lint rejects an outline with zero or several H1s or without sources.
3. **Topic de-duplication against keyword ownership (S, 2 points).** The shortlist drops topics owned by an intent in `src/data/seo-intents.ts` (ADR 0012). Acceptance: a test proves an owned intent is dropped and a free one kept.
4. **Brand-voice guide for posts (S, 2 points).** A short guide the copywriting step reads. Acceptance: it lives in `docs/`, is referenced by the skill, and a review checks a sample draft against it.
5. **`/blog/` freshness bug (S, 2 points).** Date `/blog/` from the newest published post, not from the folder commit date. Acceptance: a test proves that committing a `draft: true` post does not change the `/blog/` `dateModified` (uses the isolated build helper).
6. **Track or relocate the content working folder (XS, 1 point).** Decide `seo/contenido/` tracked or `docs/content/`. Acceptance: the chosen path is tracked and the skill writes there.
7. **Draft-flip guard (S, 2 points).** A CI check that a PR changing a post from `draft: true` to `false` carries the owner's approval label. Acceptance: a script test covers the flip and the no-flip cases.

## ADRs relied on

ADR 0005 (sitemap, robots, `llms.txt`), ADR 0012 (keyword ownership), ADR 0017 (build-derived freshness), ADR 0018 (build-time endpoints: `rss.xml`), ADR 0019 (isolated fixture builds, blog covers).
