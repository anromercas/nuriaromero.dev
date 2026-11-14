# NRD-19 - Validate deployed SEO signals: JSON-LD, FAQs and llms.txt links

## Why

[NRD-19](https://nuriaromerodev.atlassian.net/browse/NRD-19) (M1, epic NRD-2). Structured data, FAQs and `llms.txt` were validated only on local builds (`odd/tasks/seo-audit-backlog-2026-09-21.md` SEO-08, SEO-09, SEO-11). A stale deploy, CSP or redirects could make production differ from the build, so Google and AI answer engines would read something else.

## What changes

- Dated validation sections in three audit task files:
  - `docs/seo-audit/full-audit-2026-09-21/tasks/11-schema-local-y-marca.md` (JSON-LD)
  - `docs/seo-audit/full-audit-2026-09-21/tasks/09-autoría-y-llms.md` (llms.txt links)
  - `docs/seo-audit/full-audit-2026-09-21/tasks/08-mejorar-citabilidad-y-legibilidad.md` (FAQ rendering at 375 px)
- One NRD bug per defect found, linked from the doc.
- No product code changes.

## Out of scope

- Fixing any defect (each becomes its own bug).
- A new automated network check script (the existing `scripts/check-seo-09.mjs` already guards `dist/llms.txt` structure at build time; a live-URL checker would add network calls to the toolchain and is not requested).
- Niche and parked pages.

## Requirements and scenarios

### Requirement: production JSON-LD parses without errors

Production `/`, `/seo-local-sevilla/` and `/diseno-web-sevilla/` SHALL be validated with Schema Markup Validator and Google Rich Results Test; `ProfessionalService`/`Organization`, `Person`, `WebSite`, `Service`, `FAQPage` and `BreadcrumbList` (where the page emits them; `AggregateRating`/`Review` on `/`) MUST parse with 0 errors; warnings are listed.

#### Scenario: validated

- WHEN the three URLs are validated
- THEN each has its detected types, errors (0) and verbatim warnings recorded with date and tool in task 11

#### Scenario: production differs from build

- WHEN a type present in `dist/` after `pnpm build` is missing in production (or vice versa)
- THEN the difference is recorded and a bug is filed

### Requirement: llms.txt links resolve directly

Every absolute `https://nuriaromero.dev/...` link in production `/llms.txt` MUST return HTTP 200 with no redirect, in trailing-slash form.

#### Scenario: all links checked

- WHEN each link is requested with `--max-redirs 0`
- THEN task 09 lists URL, status and redirect target with the date

#### Scenario: redirecting link

- WHEN an internal link returns 301/302/404
- THEN a bug is filed and linked from task 09

#### Scenario: external profile blocks bots

- WHEN LinkedIn answers 999 (bot blocking)
- THEN the status is recorded as a note, not a defect

### Requirement: FAQ direct answers readable on mobile

At 375 px, every question-form block on `/seo-local-sevilla/` and `/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/` SHALL show the question, answer it in the first sentence, and cause no horizontal scroll. Where the page has a FAQ accordion and `FAQPage` JSON-LD (`/seo-local-sevilla/`: `<details>/<summary>` in `SeoLocalFaq.astro`, `faqSchema` in `ServiceLayout.astro`), each FAQ MUST also open with touch and keyboard, and its visible text MUST match the `FAQPage` JSON-LD. The GEO post has neither: `BlogPostLayout.astro` emits only `Article` and `BreadcrumbList`, and its questions are `##` headings in `src/content/blog/que-es-geo-posicionamiento-ia-negocios-sevilla.md`. The accordion and JSON-LD checks do not apply to it. Nobody asked for an accordion or `FAQPage` on that post, so the missing ones are not defects. They are recorded as an observation in task 08 and no follow-up is filed (adding `FAQPage` to blog posts would be a new SEO candidate for the PO, and Google limits FAQ rich results anyway).

#### Scenario: service page FAQs on mobile

- WHEN QA opens `/seo-local-sevilla/` at 375x812
- THEN each FAQ opens by touch and by keyboard, its first sentence answers the question, there is no horizontal scroll, and `Question.name` and `acceptedAnswer.text` match the visible text

#### Scenario: GEO post question headings on mobile

- WHEN QA opens the GEO post at 375x812
- THEN each question-form `##` heading (including "Respuesta corta") is followed by a paragraph whose first sentence answers it, and nothing scrolls horizontally (watch the comparison table under "¿En qué se diferencian el SEO local y el GEO?")

#### Scenario: recorded

- WHEN both pages are checked
- THEN findings, screenshots (attached to the story) and date are recorded in task 08, the GEO post's lack of accordion and `FAQPage` is noted as an observation, and each real defect (overflow, no direct answer, text and JSON-LD mismatch) is filed as a bug

## Files

Layer `app` (only layer in the harness; `docs/**` is outside its globs and in `repo.qaExemptPaths`). The audit files are in Spanish: append in Spanish.

| Action | Path                                                                                 |
| ------ | ------------------------------------------------------------------------------------ |
| modify | `docs/seo-audit/full-audit-2026-09-21/tasks/11-schema-local-y-marca.md`              |
| modify | `docs/seo-audit/full-audit-2026-09-21/tasks/09-autoría-y-llms.md`                    |
| modify | `docs/seo-audit/full-audit-2026-09-21/tasks/08-mejorar-citabilidad-y-legibilidad.md` |

## Interfaces

Commands (read-only, public site):

```sh
curl -sS https://nuriaromero.dev/llms.txt | rg -o '\]\((https?://[^)]+)\)' -r '$1'
curl -sS -o /dev/null -w '%{http_code} %{redirect_url}\n' --max-redirs 0 <url>
```

## Data

None.

## Test plan (TDD order)

No behaviour change, so no `tests/*.test.js` case (state it in the PR). Before validating, confirm production matches `main` (home `<title>` vs `src/pages/index.astro`) and note the commit. The existing build-time guards stay green: `pnpm build && pnpm check:seo-09:dist && pnpm check:seo-11:dist`.

## Real-browser / e2e checks

- 375x812 (DPR 3, touch), `/seo-local-sevilla/`: open each FAQ by touch and by keyboard (Tab + Enter/Space), focus visible, no horizontal scroll.
- 375x812, GEO post: each question heading is followed by a direct answer; no horizontal scroll, including the comparison table.
- Rich Results Test is itself a rendered-page check (Googlebot smartphone).

## Risks

- Rich Results Test may flag `FAQPage` as not eligible for rich results (Google restricted FAQ rich results to authoritative sites in 2023): record as "not eligible", not as an error.
- Validators are third-party web tools; if unavailable, record the outage and retry; do not substitute guesses.

## ADRs

0004 (SEO head and JSON-LD), 0005 (sitemap, robots, llms.txt and checks).

## UI spec

No user-facing UI change. This story only validates production and appends findings to audit docs; no page, layout, component, style or copy changes. Checklist items 1-8: n/a.

Reference for the 375 px FAQ check (task 1.3), so QA judges against the current UI rather than an imagined one:

- `/seo-local-sevilla/`: FAQs render in `src/components/seo-local/SeoLocalFaq.astro` as native `<details>/<summary>` (question in `.question`, decorative plus/minus SVG `aria-hidden`). The answer's first sentence is the bold lead (`splitAnswer(faq.a).lead`), the rest are context paragraphs. Visible text and JSON-LD share one source, `seoLocal.faqs` in `src/data/services.ts`: `ServiceLayout.astro` emits `faqSchema(page.faqs)` from `src/lib/schema.ts`, which collapses whitespace in `a`. Expected sync rule: `Question.name` equals the visible question verbatim, and `acceptedAnswer.text` equals the visible lead plus context paragraphs joined by single spaces. Any other difference is a defect (file a bug, do not edit copy in this story).
- `/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/`: the post has no FAQ accordion and no `FAQPage` JSON-LD (`BlogPostLayout.astro` emits only `Article` and `BreadcrumbList`). Its "FAQs" are question-form `##` headings, opening with "Respuesta corta". The "opens with touch and keyboard" and "matches FAQPage JSON-LD" checks do not apply there; check only that each question heading is followed by a paragraph whose first sentence answers it, and that there is no horizontal scroll at 375 px (the comparison table under "¿En qué se diferencian el SEO local y el GEO?" is the likely overflow risk). Per "Requirement: FAQ direct answers readable on mobile" (scenario "GEO post question headings on mobile"), the missing accordion and `FAQPage` are recorded as an observation in task 08, not as a bug.

## Tasks

- [x] 1.1 [NRD-40 app] Validate production JSON-LD on `/`, `/seo-local-sevilla/`, `/diseno-web-sevilla/` and record it in task 11; tests: none (validation only), keep `check:seo-11:dist` green.
- [ ] 1.2 [NRD-41 app] Check every absolute link in production `llms.txt` returns 200 without redirects and record it in task 09; tests: none, keep `check:seo-09:dist` green.
- [ ] 1.3 [NRD-42 app] Check FAQ direct-answer rendering at 375 px on `/seo-local-sevilla/` and the GEO post and record it in task 08; tests: none.
