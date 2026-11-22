# 0020. Blog content pipeline: tracked working folder, deterministic scripts, project skill, owner gates

- Status: Accepted
- Date: 2026-11-21

## Context

NRD-327 designed a chain that turns real search questions into blog posts (topic, outline, cover, draft, publish) with the owner approving every step (`docs/designs/NRD-327-blog-content-pipeline.md`). The PO split it into NRD-344 to NRD-350. Several stories share the same pieces: where the working files live, how mechanical steps run, how the chain is orchestrated and what stops a draft from being published by an agent. Without one record each story would re-decide them.

## Decision

- **Working folder.** Pipeline working files live in `seo/contenido/` and are tracked: `seo/contenido/<slug>/tema.md`, `seo/contenido/<slug>/esquema.md` and one idea queue `seo/contenido/ideas.json`. The rest of `seo/` (`seo/estudios/`, `seo/ranks/`) stays untracked. Raw exports from DataForSEO or Search Console stay in `.claude/state/seo/` (runtime state, never committed). Commits add exact paths under `seo/contenido/`, never `seo/` as a whole.
- **Deterministic steps are scripts, not model steps.** Shortlist, de-duplication, idea-queue refresh and status changes, outline lint, frontmatter scaffold and word count are Node scripts `scripts/blog-*.mjs` over pure helpers in `scripts/lib/*.mjs`, tested with fixtures in `tests/` (ADR 0006). They read already-saved exports and never call an external API; they take the run date as an argument and produce byte-identical output for the same input. No new dependency.
- **Orchestration is a project skill.** `.claude/skills/blog-pipeline/` (tracked; the other local skills in `.claude/skills/` stay untracked) chains the existing SEO skills and the scripts, and hands the post to the team-harness PR flow for the final step.
- **Owner gates.** Each step ends at an owner approval point recorded in the artifact (`Estado: aprobado (YYYY-MM-DD)` in `tema.md` and `esquema.md`; the idea status in `ideas.json`). The scaffold script refuses to write `src/content/blog/<slug>.md` unless the outline is approved. Every post is created with `draft: true`; no script or skill ever sets `draft: false`. Publishing is the owner's flip of `draft` in the PR and her merge (ADR 0009 branch flow).
- **Keyword ownership.** A candidate topic covered by `keywordOwners` or `intentMatrix` in `src/data/seo-intents.ts` (ADR 0012), by a published post, or by a queued idea that is rejected, in progress or published is dropped with a stated reason.

## Consequences

- Topic and outline approvals travel with the post's PR and survive a clean clone.
- Token cost stays low: the model writes prose and judgement; parsing, counting, ranking and de-duplication are scripts.
- Draft safety rests on two guards: the build never publishes `draft: true` (NRD-327 test `tests/blog-drafts.test.js`) and nothing in the pipeline flips it. A CI guard on the flip (NRD-327 follow-up 7) is not part of this decision.
- The weekly idea refresh leaves `seo/contenido/ideas.json` modified in the checkout where the SEO run happens; it reaches git with the next post branch (skill step 0) or a commit by the owner.
- Reviews check that new pipeline logic is a tested script, that commits add exact `seo/contenido/` paths, and that nothing writes `draft: false`.

## Evidence

- `docs/designs/NRD-327-blog-content-pipeline.md`, `openspec/changes/archive/2026-11-21-nuriaromero-327-blog-content-pipeline/`.
- Planned in NRD-345 (`seo/contenido/README.md`), NRD-346 (`scripts/blog-shortlist.mjs`, `scripts/blog-outline-lint.mjs`, `scripts/blog-scaffold.mjs`, `scripts/blog-word-count.mjs`), NRD-347 (`scripts/lib/topic-dedup.mjs`), NRD-348 (`docs/blog-voice.md`), NRD-349 (`.claude/skills/blog-pipeline/`), NRD-350 (`seo/contenido/ideas.json`, `scripts/blog-ideas-refresh.mjs`).
