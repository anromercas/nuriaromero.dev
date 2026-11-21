## Why

Tracker: [NRD-323](https://nuriaromerodev.atlassian.net/browse/NRD-323).

AI assistants cite pages that answer concrete questions directly, so the published FAQs must cover what people actually ask. Nobody has compared the FAQs (home, contact, service and niche pages, `/ai/faq.json`) with search question data. The developer has no access to the owner's inbox, WhatsApp or call notes and must not ask for personal data, so this story uses search data and the repo's SEO studies and leaves a section for the owner.

## What Changes

- New report `docs/research/NRD-323-faq-gap-report.md`: inventory of every published FAQ (from `faqPages()`), a question table (question, source with call date, monthly volume when known, covered yes/no, page and FAQ entry), a proposed 1-2 sentence Spanish answer with target page and word budget for each uncovered recurring question (or an explicit rejection with reason), a data-source log, an empty "Preguntas de clientes reales (dueña)" section and a per-page list for the PO.

## Out of scope

- Any change under `src/` or `public/` (FAQ additions are follow-up stories the PO files).
- Owner inbox, WhatsApp or call data; any personal data.
- Proposed answers with figures, results or prices not already in `src/data`.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- None. Documentation only (`skip_specs: true`).

## Impact

- One new file `docs/research/NRD-323-faq-gap-report.md` (layer `app`, `docs/**`).
- No DataForSEO spend by the developer: question data is reused from recorded SEO-strategist outputs (`docs/seo-audit/`, `.claude/state/seo/questions/2026-11-16.md`); the optional data step (at most 6 calls) runs as an SEO-strategist run within `seo.dataforseo.maxCallsPerRun` (30).
- `docs/research/` is ignored by the infra-owned `.gitignore`; the file is force-added on its exact path until infra adds `!docs/research/`.
- No dependency, URL, copy, schema or data change; nothing radical.
