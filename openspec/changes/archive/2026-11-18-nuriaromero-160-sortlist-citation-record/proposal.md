## Why

Tracker: [NRD-160](https://nuriaromerodev.atlassian.net/browse/NRD-160).

The GEO check of 2026-11-15 (NRD-124) showed ChatGPT and Perplexity answering `aplicaciones web a medida sevilla` and `desarrollo de software a medida sevilla` mostly from directories (Sortlist, Clutch, Milanuncios) and dedicated service pages; nuriaromero.dev was not cited. On 2026-11-18 the owner created a public Sortlist profile (`https://www.sortlist.es/agency/nuria-romero`, two services) and a Clutch profile that is still under Clutch review. The local signals record (`docs/seo-audit/local-signals-2026-11.md`, section "Citas de terceros") still says no third-party citation exists, and nothing tells the scheduled SEO run to look for the expected effect.

## What Changes

- The Sortlist profile is checked once in a real browser (automated clients get HTTP 403): public without login, name, locality, phone and website link compared with `SITE` (`src/data/site.ts`). Mismatches are noted in the PR and on the story for the owner; the team never edits the profile.
- `docs/seo-audit/local-signals-2026-11.md` records the Sortlist citation (URL, date 2026-11-18, the two listed services, the observed NAP and the check date) and Clutch as "pendiente de revisión (NRD-292)" without a URL; the source table and the NAP table's third-party row are updated.
- A follow-up check is recorded, in the same document and in the SEO brief read by every SEO run (`.claude/harness/seo.md`): whether AI answers for the two queries start citing nuriaromero.dev. Recorded, with no promised result.

## Out of scope

- Editing the Sortlist or Clutch profile, paid plans or sponsored listings, the tax ID on Sortlist (owner).
- Clutch's public URL and `sameAs` entry (NRD-292); adding Sortlist to `sameAs` (NRD-248).
- Other directories; any change under `src/`, `public/`, `scripts/` or `tests/`.
- Running the AI-citation check itself (the scheduled SEO run does it).

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- None. Documentation only; no site behavior changes (`skip_specs: true`).

## Impact

- `docs/seo-audit/local-signals-2026-11.md`, `.claude/harness/seo.md` (a tracked `.claude/` file: shared path, one appended section, no permission, hook or harness-config change).
- No dependency, URL, copy, schema or data change; nothing radical.
