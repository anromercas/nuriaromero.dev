---
name: blog-pipeline
description: Turn a real search question into a blog post draft PR for nuriaromero.dev, stopping for the owner's approval after topic, outline, cover, draft and publish.
---

# Blog pipeline

Five steps, each ending at a named owner approval point. At every approval point you stop and wait for the owner; never continue on your own. Artifacts and messages to the owner are in Spanish; these instructions are in English.

## Before you start

- Read `docs/blog-voice.md`, `seo/contenido/README.md`, ADR 0012 (keyword ownership) and ADR 0020 (pipeline rules).
- Never set `draft` to false. Never write under `src/content/blog/` except through `scripts/blog-scaffold.mjs`.
- Commit exact paths only; never stage the whole tree.

## Resume

Find the folder `seo/contenido/<slug>/`. The first artifact without `Estado: aprobado` (or the outline without an approved `- Portada:` field, or a missing draft) is the current step. Approval state lives in the files, not in memory.

## Step 0. Ideas

The idea queue is `seo/contenido/ideas.json` (fields in `seo/contenido/README.md`). The scheduled SEO run refreshes it weekly and leaves it modified in the checkout.

1. Apply the owner's decisions: `node scripts/blog-idea-status.mjs <id> <aprobada|rechazada>` for each idea she approved or rejected.
2. If no idea is `aprobada`, show the latest four proposals (`node scripts/blog-ideas-refresh.mjs --dry-run --date <today>` with no exports prints them) and stop; there is nothing to write yet.

## Step 1. Topic

1. Input: an `aprobada` idea of `seo/contenido/ideas.json`. The saved keyword exports in `.claude/state/seo/` with `node scripts/blog-shortlist.mjs <exports...> --limit 5` remain a fallback; show the owner the candidates and the reasons in "Descartadas".
2. Set the chosen idea to `en curso`: `node scripts/blog-idea-status.mjs <id> "en curso"`.
3. Write `seo/contenido/<slug>/tema.md` from `templates/tema.md` (question, keyword, intent, volume with source and date, pillar, target page, all taken from the idea) with `Estado: pendiente de aprobación`.
4. Commit `seo/contenido/ideas.json` together with `tema.md` on the post branch.

Stop: **Aprobación 1 (tema)**. On approval set `Estado: aprobado (<fecha>)`.

## Step 2. Outline

1. Use `claude-seo:seo-content-brief`, `claude-seo:seo-sxo` and `claude-seo:seo-geo` to write `seo/contenido/<slug>/esquema.md` from `templates/esquema.md`: H1, direct answer, H2 list, secondary keywords, word target, sources with dates. The H1 must not target a term owned by another page (ADR 0012).
2. Run `node scripts/blog-outline-lint.mjs seo/contenido/<slug>/esquema.md` until it passes.

Stop: **Aprobación 2 (esquema)**. On approval set `Estado: aprobado (<fecha>)`.

## Step 3. Cover

Only after the outline is approved.

1. Get the image from the owner, or from `social/mediateca` or `team-harness:flow-media`. Never use a stock image with an unclear license or a recognisable person without consent.
2. Save it as `src/assets/blog/<slug>.<jpg|png|webp>`, at least 1600 px wide and within the weight guard of `scripts/check-seo-25.mjs`.
3. Write the alt text in Spanish, describing the image.
4. Record `- Portada: <file> | alt: <texto>` in `esquema.md`.

Stop: **Aprobación 3 (portada)**. On approval append `| aprobada (<fecha>)` to that field. Do not scaffold a post before this approval.

## Step 4. Draft

1. Work on branch `feat/<KEY>-post-<slug>` from `develop`, where `<KEY>` is the post's tracker story (ask the PO skill to file one if none exists).
2. Run the scaffold command (it refuses unless the outline is lint-clean, approved and has the same slug, and the cover exists):

<!-- blog-pipeline:scaffold -->

```bash
node scripts/blog-scaffold.mjs --slug "<slug>" --title "<title>" --description "<description>" --date "<date>" --cover "<cover>" --alt "<alt>" --tags "<tags>" --outline "seo/contenido/<slug>/esquema.md" --write
```

3. Write the body following the outline and `docs/blog-voice.md`: direct answer first, H2 from the outline, every figure cited from the outline sources, no promises.
4. Run, in this order:
   - `node scripts/blog-word-count.mjs src/content/blog/<slug>.md --outline seo/contenido/<slug>/esquema.md`
   - `node --test tests/*.test.js`
   - `pnpm build`
   - `pnpm check:seo:dist`
5. Apply the voice checklist of `docs/blog-voice.md` and paste the result for the owner.
6. Commit `seo/contenido/<slug>/`, the cover and the post by exact path.

Stop: **Aprobación 4 (borrador)**.

## Step 5. Publish

Hand the branch to the team-harness PR flow (`/team-harness:dev`, PR into `develop`, CI `verify`, ADR 0009). The PR body must say the post is a draft, list what happens when the owner flips `draft` (page, sitemap, RSS, blog listing) and the follow-ups that go in that same owner-approved commit (`intentMatrix` row, internal links, `public/llms.txt` if it lists posts).

The idea becomes `publicada` in the owner's merge commit: after the merge, run `node scripts/blog-idea-status.mjs <id> publicada` and commit the queue with the next post branch if the merge did not include it.

The skill never changes `draft`: only the owner flips `draft`, when she approves and merges.

Stop: **Aprobación 5 (publicación)** is the owner's merge.
