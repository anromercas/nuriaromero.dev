# 0008. Spanish copy, English code

- Status: Accepted (retroactive)
- Date: 2026-11-12

## Context

The audience is local businesses in Seville; every visible word, metadata field and structured data string is read by Spanish users and by Spanish-market search engines. The code is maintained by one developer and by agents that work best with English identifiers.

## Decision

- Everything a visitor, crawler or assistant reads is Spanish (Spain): copy, `<title>`, descriptions, alt text, JSON-LD text, `llms.txt`, URL slugs (`/diseno-web-sevilla/`), `<html lang="es">`, `og:locale` `es_ES`.
- Identifiers, commit messages, ADRs and designs are English. New code comments are English.
- Existing Spanish comments are not rewritten for their own sake; they change to English only when the surrounding code is edited.

## Consequences

- Tests and checks assert on Spanish strings; changing copy may require updating them.
- Slugs stay Spanish and ASCII (no accents), and are never renamed without a 301 (invariant "No URL breaks").

## Evidence

- `src/layouts/Layout.astro` (`lang="es"`), `src/components/seo/SEO.astro` (`og:locale` `es_ES`), `src/data/*.ts` (Spanish copy, English identifiers), `public/llms.txt`.
- English identifiers throughout (`createConsentController`, `localBusinessSchema`, `ServicePageData`).
- Mixed comment language at adoption: Spanish in `astro.config.mjs`, `tailwind.config.mjs`, `src/scripts/contact-form.js`, `src/env.d.ts`, `src/data/site.ts`; English in `src/components/seo/Schema.astro`, `scripts/check-seo-10.mjs`.
- `.claude/harness.json` `project.artifactLanguage: en`; `CLAUDE.md`.
