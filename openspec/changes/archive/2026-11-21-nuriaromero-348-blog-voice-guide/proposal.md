## Why

Tracker: [NRD-348](https://nuriaromerodev.atlassian.net/browse/NRD-348).

The draft step of the blog content pipeline (NRD-327) has no voice guide for posts, so each draft can sound different or slip into promises and jargon. The rules exist, spread across `PRODUCT.md`, `.agents/product-marketing-context.md`, the PRD principles and the invariants; the copywriting step and the review need them in one short page with a checklist.

## What Changes

- New guide `docs/blog-voice.md` (English instructions, Spanish examples): voice (`tú`, close and professional Spanish from Spain), value before mechanism, jargon explained on first use, no invented or promised figures, testimonials, rankings or AI mentions, direct answer first (GEO template), one brand string ("Nuria Romero", `SITE.name`), real dates only, no keyword stuffing, sources cited, and a close that leads to the call booking the post layout already renders. Ends with a 5-10 item checklist the draft step and the review apply.
- New test `tests/blog-voice.test.js`: fails if the guide disappears, loses the never-promise-rankings rule, or its checklist leaves the 5-10 range.
- The PR description carries a review of one published post (`que-es-geo-posicionamiento-ia-negocios-sevilla`) against the checklist (meets / does not meet per item); the post is not changed.

## Out of scope

- Editing any published post, even where the review finds a gap (the PO decides follow-ups).
- Wiring the guide into the skill (NRD-349 references it).
- Site copy, layout, schema or data changes.

## Capabilities

### New Capabilities

- `blog-voice`: a guarded voice guide and checklist for blog posts.

### Modified Capabilities

- None.

## Impact

- Layer `app`: `docs/blog-voice.md`, `tests/blog-voice.test.js` (new).
- No dependency, URL, copy, schema or data change; nothing radical.
