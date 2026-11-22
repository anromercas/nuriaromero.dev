## Why

Tracker: [NRD-322](https://nuriaromerodev.atlassian.net/browse/NRD-322).

`robots.txt` and `/.well-known/ai.txt` already allow the 8 crawler rules in `src/data/crawler-policy.ts`, and `tests/ai-discovery.test.js:16` plus `tests/ai-discovery-contract.test.js` fail if one is disallowed. Answer engines can still be shut out one level lower: by the CDN/WAF (403, 429, challenge pages) or by a response header. `public/_headers:12-13` sets `X-Robots-Tag: noindex, nofollow` for `/informes/*`, and nothing stops a similar rule from reaching public pages. There is also no recorded production evidence that the AI user-agents get the real pages.

## What Changes

- New unit test `tests/robots-headers.test.js` that parses `public/_headers` and fails if any `X-Robots-Tag` containing `noindex` or `none` applies to `/*` or to any path pattern other than `/informes/*`; it also keeps `/informes/*` noindex (private reports invariant).
- One-off, read-only production evidence: GET of 6 URLs with 7 AI user-agents plus a browser control, tabulated in the PR body. Any non-200 for an AI agent stops the story and is recorded on the issue for the owner.

## Out of scope

- Any change to `public/_headers`, robots policy, `src/data/crawler-policy.ts`, CSP, pages or Netlify settings.
- Fixing a CDN/WAF block (owner, Netlify settings: radical).
- Duplicating the existing robots/ai.txt guards.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `ai-discovery`: adds the requirements that public pages carry no noindex response header and that AI crawlers get the real pages in production.

## Impact

- New file `tests/robots-headers.test.js` (layer `app`). Reads `public/_headers` (infra-owned) without editing it.
- No dependency, URL, copy, schema or data change; nothing radical.
