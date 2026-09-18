# SEO audit follow-up

This folder turns the September 2026 audit findings into focused, verifiable work items. Start with the highest-priority content and page-structure tasks; measurement-dependent checks stay explicitly unverified until the relevant data access or field evidence is available.

## Quick path

1. Complete [the `/portfolio/` heading task](portfolio-heading.md).
2. Improve the blog, sector pages, and case studies using the separate briefs below.
3. Triage technical observations without treating optional or data-dependent checks as blockers.
4. Re-check acceptance criteria and record what was actually verified.

## Task index

| Task | Priority | Evidence status | Depends on |
|---|---|---|---|
| [Portfolio page heading](portfolio-heading.md) | High | Verified in audit | None |
| [Blog claims and sourcing](blog-claims.md) | High | Verified content concern; each claim needs editorial review | None |
| [Sector landing pages](sector-pages.md) | High | Verified pages exist; quality improvements require page-by-page review | None |
| [Client case studies](case-studies.md) | Medium | Verified substantiation gap | Client-approved evidence where available |
| [Technical and measurement follow-up](technical-follow-up.md) | Medium / low | Mixed: console errors observed; performance/indexing data unavailable | Browser validation; Search Console/Analytics or field data for data-dependent items |

## Evidence boundaries

- The sitemap contains 20 URLs. This is an audit snapshot, not a statement that all URLs are indexed.
- `/portfolio/` lacks an H1; malformed SVG path errors were observed in the browser console.
- Blog content includes SEO claims or statistics that need sources or careful qualification. Four sector pages need meaningful unique content, proof, and a relevant CTA. Avoid adding geographic pages unless each has distinct user value and evidence.
- Client case studies need substantiation and dated methods/results.
- Search Console and GA4 data, PSI/CrUX field data, and indexing results were unavailable. Organic traffic, indexing status, and Core Web Vitals therefore remain unverified.
- Sitemap `lastmod` is low priority and should only be added when reliable modification dates exist. `/llms.txt` returning 404 is optional, not a blocker. FAQ rich results are not an expected outcome for this commercial site.

## Completion rule

Treat each task's acceptance criteria as the evidence standard. Record the page(s), date, and verification method for completed work. Do not infer rankings, traffic impact, indexing, or Core Web Vitals from content edits alone.
