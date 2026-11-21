## Context

- The blog has 4 posts (`src/content/blog/`), no fixed publishing cadence, and posts dated from frontmatter (`pubDate`/`updatedDate`).
- CSP (`public/_headers:7`): `script-src 'self' https://www.googletagmanager.com`, no `'unsafe-inline'`; `img-src 'self' data: https://www.google-analytics.com`; `connect-src` limited to self, Formspree and GA; `frame-ancestors 'none'` (irrelevant to embedding others) and no `frame-src`, so `default-src 'self'` blocks third-party iframes.
- Invariants: no inline scripts (client JS in `src/scripts/*.js`), analytics only after consent (`src/scripts/analytics-consent.js`), a new external origin or tracker is a radical change for the owner.
- `docs/research/` does not exist yet; this story creates it (other research stories this sprint, NRD-323 and NRD-325, also write there).

## Goals / Non-Goals

**Goals:** verified facts from Google, an honest privacy/CSP assessment, a go/no-go in one paragraph, and a follow-up story text if go.

**Non-Goals:** implementing the button; changing CSP; filing issues.

## Decisions

**Approach.** One documentation commit. Primary sources only for facts (Google Search Central documentation, the Google Search Central blog or The Keyword announcement, Google Search help pages); the video is a claim source, never evidence. Anything Google does not state is written as "not documented", never inferred. The privacy analysis is done by reading the official embed code and, if the code is public, by loading it once in a throwaway local HTML file in a real browser and listing the requests and cookies from DevTools (no change to the site).

**Files (layer `app`).**

- Create `docs/research/NRD-326-google-preferred-sources.md`, in English with Spanish quotes verbatim, sections:
  1. Summary (go/no-go in one paragraph, first).
  2. Sources (table: title, URL, publisher, date published, date read).
  3. Mechanism (exact embed code or link format quoted, parameters, where it may be placed).
  4. Requirements and availability (eligibility, content freshness, languages and countries; Spanish and Spain explicitly).
  5. Surfaces (Top Stories, AI Overviews, AI Mode, Discover: each confirmed, denied or not documented, with the source).
  6. What it loads (scripts, iframes, cookies, network origins) and fit with the CSP and consent: which directives would change (for example `script-src`, `frame-src`), whether it sets cookies before consent, and whether a plain link variant avoids any third-party load.
  7. Blog fit (4 posts, cadence, freshness requirement).
  8. Video claims (table: claim, status confirmed/unconfirmed, official source).
  9. If go: follow-up story (title, why, scope, placement such as the end of `BlogPostLayout`, privacy/CSP notes, acceptance criteria with a `tests/*.test.js` case and a `scripts/check-seo-NN.mjs` guard), marked "to be filed by the PO; any third-party script or CSP change is the owner's decision (PRD section 9)".

**Interfaces.** None.

**Data.** None.

**Test plan (TDD order).** No behavior change, no new test (`skip_specs: true`). Checks: `node --test tests/*.test.js` stays green; `git diff origin/develop --stat` lists only the new document; `pnpm format docs/research/NRD-326-google-preferred-sources.md`.

**Real-browser / e2e checks.** None for QA (`docs/` is QA-exempt). The optional throwaway embed check above runs on the developer machine outside the repo.

**ADRs relied on.** None changed. Invariants: CSP and headers, no inline scripts, analytics only after consent, radical changes.

## Risks / Trade-offs

- The feature is recent and documentation may change; the dated sources table keeps the record honest.
- If the official page is not reachable from the developer environment, the document says so and the recommendation becomes "no-go until verified", never a guess.
