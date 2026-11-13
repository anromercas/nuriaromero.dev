# Architecture Decision Records

Short records of the technical decisions this site relies on. ADRs 0001-0010 were written at team-harness adoption and document decisions already visible in the code ("Accepted (retroactive)"), with file-path evidence.

A new ADR is needed for a cross-cutting decision: a new shared module or pattern, a convention change, or anything listed as radical in `.claude/harness/invariants.md` (those also need the user's approval first).

## Template

Copy into `docs/adr/NNNN-kebab-title.md`, using the next free number (check `develop` and open PRs).

```markdown
# NNNN. Title

- Status: Proposed | Accepted | Accepted (retroactive) | Superseded by NNNN
- Date: YYYY-MM-DD

## Context

What forces are at play and why a decision is needed.

## Decision

What we do, stated as a rule.

## Consequences

What becomes easier, what becomes harder, what designs and reviews must check.

## Evidence

Paths and symbols in the repository that show or enforce the decision.
```

## Index

| ADR                                                | Title                                                                     | Status                 |
| -------------------------------------------------- | ------------------------------------------------------------------------- | ---------------------- |
| [0001](0001-static-astro-on-netlify.md)            | Static Astro 4 output on Netlify, configured from `public/`               | Accepted (retroactive) |
| [0002](0002-tailwind-and-typescript.md)            | Tailwind CSS 3 and strict TypeScript                                      | Accepted (retroactive) |
| [0003](0003-single-app-layer-and-src-data.md)      | Single `app` layer with `src/data` as the single source of truth          | Accepted (retroactive) |
| [0004](0004-seo-head-and-structured-data.md)       | SEO head and JSON-LD through `src/components/seo` and `src/lib/schema.ts` | Accepted (retroactive) |
| [0005](0005-sitemap-robots-llms-and-seo-checks.md) | Sitemap, robots, llms.txt and build-time SEO checks                       | Accepted (retroactive) |
| [0006](0006-testing-node-test-and-tdd.md)          | Testing with node:test and TDD                                            | Accepted (retroactive) |
| [0007](0007-contact-form-analytics-consent-csp.md) | Formspree contact form, GA4 after consent, CSP in `public/_headers`       | Accepted (retroactive) |
| [0008](0008-spanish-copy-english-code.md)          | Spanish copy, English code                                                | Accepted (retroactive) |
| [0009](0009-branch-flow-and-production-deploys.md) | Branch flow and budgeted production deploys from `main`                   | Accepted (retroactive) |
| [0010](0010-markdown-designs.md)                   | Markdown designs in `docs/designs/`                                       | Accepted               |
