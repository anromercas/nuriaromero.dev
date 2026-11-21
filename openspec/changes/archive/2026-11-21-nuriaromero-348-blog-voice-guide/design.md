## Context

- Voice sources: `PRODUCT.md` (plain language, no jargon, "Brand Commitments"), `.agents/product-marketing-context.md:59-80` (how the customer searches, never promise exact speed, position or guarantees, `tú`, neutral professional Spanish from Spain), PRD principles 1 (truth over persuasion) and 3 (business language first), invariants "No promised rankings" and "Real proof only".
- Brand string: `SITE.name = "Nuria Romero"` (`src/data/site.ts:6`), also the only title suffix (ADR 0016).
- Post structure today: frontmatter title is the only H1; posts open with `## Respuesta corta` (for example `src/content/blog/que-es-geo-posicionamiento-ia-negocios-sevilla.md:8`); `src/layouts/BlogPostLayout.astro:117` already renders the closing section "Reserva una llamada" with the booking link, so a post body must not duplicate a booking CTA block; it ends leading naturally to it.
- Freshness: post dates come from frontmatter (`pubDate`, `updatedDate`), published as Article dates (ADR 0017); `updatedDate` only when the content really changed.
- Pattern for doc guard tests: `tests/design-md-fonts.test.js`, `tests/iteration-review-routine.test.js`.
- Docs under `docs/` are in English (PRD, ADRs); post copy is Spanish (ADR 0008). The guide is English with Spanish examples.

## Goals / Non-Goals

**Goals:** one short guide (about 80-130 lines) the draft step reads before writing and the review applies after; a checklist small enough to apply per draft; a test that keeps the critical rule.

**Non-Goals:** rewriting published posts; a lint for prose; skill wiring (NRD-349).

## Decisions

**Approach.** A single markdown guide with one `##` section per rule, each with a one-line rule, a short "why" and a Spanish do/don't example pair, followed by `## Checklist` with 8 numbered items. The test reads the file and checks the headings, the never-promise rule wording and the checklist count, so the guide can evolve without breaking tests on every wording change. The review of a published post goes in the PR description (not a file), as the story asks.

**Guide outline** (`docs/blog-voice.md`; headings are fixed because the test reads them):

1. `# Blog voice guide` - purpose in two lines; read by the draft step of `.claude/skills/blog-pipeline/` and by the review.
2. `## Who reads the posts` - the local business owner of the PRD persona 1, the words they search with (from `.agents/product-marketing-context.md`).
3. `## Voice` - Spanish from Spain, close and professional, `tú` (never `usted` or `vosotros`); short sentences.
4. `## Value before mechanism` - what the reader gains first, how it works after.
5. `## Explain jargon` - a technical term is explained in plain words the first time (SEO, GEO, ficha, schema...).
6. `## Never promise rankings` - never promise a Google position, a guaranteed result, traffic, sales or being mentioned or recommended by ChatGPT or another AI assistant; describe what improves the information, not the outcome.
7. `## Real proof only` - no invented figures, testimonials, clients or case results; every figure or claim cites a source listed in `esquema.md` (`## Fuentes`); prices only from `src/data` (single price source).
8. `## Direct answer first` - the first paragraph after the H1 (section `## Respuesta corta`) answers the target question on its own in 1-2 sentences; every key H2 opens with its direct answer before context (GEO template).
9. `## One brand` - the brand is always "Nuria Romero" (`SITE.name`); no variants ("Nuria Romero Dev", "nuriaromero.dev" as a name).
10. `## Dates are real` - `pubDate` is the real publication date; `updatedDate` only when the content changed; no hand-written "actualizado" text in the body.
11. `## Keywords, naturally` - the target question appears where a person would say it; no keyword lists, place-name lists or hidden text.
12. `## Close` - the body ends with a practical next step; the layout adds "Reserva una llamada", so no extra booking block or second CTA.
13. `## Checklist` - 8 numbered items:
    1. Uses `tú` throughout and reads like a person, not an agency.
    2. The opening answers the question by itself in 1-2 sentences.
    3. Each H2 starts with a direct answer.
    4. Every technical term is explained the first time.
    5. No promised position, result or AI mention.
    6. Every figure or claim has a source listed in `esquema.md`; no invented testimonials or clients.
    7. The brand appears only as "Nuria Romero".
    8. Keywords read naturally; the close points to booking a call without a duplicate CTA block.

**Files (all layer `app`).**

- Create `docs/blog-voice.md`.
- Create `tests/blog-voice.test.js`.

**Interfaces.** None (documentation and a test).

**Data.** None. No migration.

**Test plan (TDD order).**

1. `tests/blog-voice.test.js` first (RED: file missing):
   - "guide exists with every rule heading": reads `docs/blog-voice.md`; asserts `## Voice`, `## Value before mechanism`, `## Explain jargon`, `## Never promise rankings`, `## Real proof only`, `## Direct answer first`, `## One brand`, `## Close`, `## Checklist` (scenarios "Guide present", "Guide removed").
   - "never-promise rule": the text of the `## Never promise rankings` section (up to the next `## `) matches `/position/i` and `/AI/` and `/guarantee/i` (scenario "Rule removed").
   - "brand string matches SITE.name": imports `SITE` from `src/data/site.ts` and asserts the guide contains `"${SITE.name}"` in the `## One brand` section.
   - "checklist has 5-10 items": counts lines matching `/^\d+\.\s+\S/` in the `## Checklist` section; `>= 5 && <= 10` (scenario "Checklist size").
2. Write the guide; GREEN. `node --test tests/*.test.js`, `pnpm build`.
3. Review `src/content/blog/que-es-geo-posicionamiento-ia-negocios-sevilla.md` (chosen because it was never rewritten for the redesign and is a GEO post, so it exercises the direct-answer rule) against the 8 items; put a table `| # | Item | Cumple / No cumple | Cita |` in the PR description (scenario "Review in the PR"). Any "No cumple" is reported to the PO in the PR, not fixed.

**Real-browser / e2e checks.** None: no page changes. QA checks the PR description holds the review table and that the diff has no file under `src/`.

**ADRs relied on.** ADR 0008 (Spanish copy, English code and docs), ADR 0016 (brand string), ADR 0017 (real dates), ADR 0020 (pipeline; NRD-345 branch).

## Risks / Trade-offs

- A guide does not enforce itself; the checklist is applied by the draft step and the review (NRD-349) and by the `seo-review` specialist on post PRs.
- Heading-based tests break if someone renames a heading; that is intended for the guarded rules and cheap to update otherwise.
