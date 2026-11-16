# Proposal

## Why

Tracker: [NRD-229](https://nuriaromerodev.atlassian.net/browse/NRD-229) (epic NRD-162, milestone M4). The NRD-222 post layout leaves three small gaps (LOW follow-ups of its reviews) that should close before NRD-127 / NRD-128 change the post content:

1. Table cell borders use `var(--hairline)` (#334155), about 1.9:1 on the ink ground and 1.8:1 on the header cell surface, so rows and columns of the price tables are hard to tell apart (WCAG 1.4.11 asks 3:1 for the graphics needed to understand content).
2. `.post-prose` has no rules for `blockquote`, `code`, `pre` or `img`; no post uses them today, but the first one that does would ship with browser defaults (and Shiki's own background) outside the ink world, and a long `pre` or a wide image could overflow at 320 px.
3. The post contract (`scripts/lib/post-contract.mjs`, run by `check-seo-18` in CI) does not check the single H1, the related links block or the closing with the booking link.

## What Changes

- New shared token `hairline-strong` (#64748b, 4.2:1 on the ink ground, 4.0:1 on the card surface) in `DESIGN.md` and `src/styles/template.css`; table cell borders of `.post-prose` use it.
- `.post-prose` rules for `blockquote`, inline `code`, `pre` (own horizontal scroll, never wider than the column, visible focus when Shiki makes it focusable; Shiki theme switched to the bundled `github-dark-dimmed` in `astro.config.mjs` so every syntax colour is AA on the card surface) and `img` (max 100% width, auto height), on ink tokens with AA text.
- `postContract` additionally asserts exactly one H1, a related links block with at least one link, and a closing section holding a link to `bookingUrl`; it throws a specific error for each, so `check-seo-18` fails in CI. The returned contract object (and the baseline fixture) is unchanged.
- No post text changes.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `blog-post-layout`: the ink-world requirement now covers quotes, code, images and table borders at 3:1; a new requirement makes the post contract check the H1, related links and closing structure.

## Out of scope

- Any text or Markdown change in `src/content/blog/` (NRD-127 / NRD-128).
- Other uses of `--hairline` (cards, header rule, `hr`), which stay as they are.
- Adding fields to the frozen contract or regenerating `tests/fixtures/blog-posts.baseline.json`.

## Impact

- Code (layer `app`): `src/layouts/BlogPostLayout.astro`, `src/styles/template.css`, `astro.config.mjs`, `scripts/lib/post-contract.mjs`, `tests/blog-post-template.test.js`, `tests/post-contract.test.js`; shared path `DESIGN.md` routed to `app`.
- SEO: unchanged URLs, metadata, JSON-LD and body text; `check-seo-18` gets stricter.
- No dependency, CSP, URL or Netlify change. Not radical.
