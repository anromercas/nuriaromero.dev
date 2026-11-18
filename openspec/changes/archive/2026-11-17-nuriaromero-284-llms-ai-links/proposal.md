## Why

[NRD-284](https://nuriaromerodev.atlassian.net/browse/NRD-284) (epic M2, NRD-3). NRD-246 publishes three AI discovery files generated from `src/data` (`/.well-known/ai.txt`, `/ai/summary.json`, `/ai/faq.json`), but the curated index assistants and crawlers already read, `public/llms.txt`, does not mention them. A reader entering through `llms.txt` never finds the structured data, and the two indexes are inconsistent with the Definition of Done ("`llms.txt` and sitemap consistent").

## What Changes

- `public/llms.txt` gains one curatorial section, `## Datos para asistentes de IA`, with three absolute links (`https://nuriaromero.dev/ai/summary.json`, `https://nuriaromero.dev/ai/faq.json`, `https://nuriaromero.dev/.well-known/ai.txt`), each with a short Spanish description of its content and no promise of reading, citation or special treatment.
- `tests/ai-discovery.test.js` gains a source test (the section and its three links) and a `dist/`-gated test (every linked file exists in the build).
- No `scripts/check-seo-*.mjs` change: no existing trailing-slash or link guard reads `llms.txt`, and `check-seo-09` already accepts any `https://nuriaromero.dev/` link.

No radical change: no dependency, no new file or data, no price change.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `ai-discovery`: adds the requirement that `llms.txt` links the three discovery files.

## Impact

- `public/llms.txt` (app layer; plain text, not a visual UI) and `tests/ai-discovery.test.js`.
- Ships to production with NRD-246 in the next scheduled promotion (principle 5, grouped deploys).

## Out of scope

- Checking the production `Content-Type` of the files (already queued as an attended action after the promotion).
- New discovery files, new data, or any other change to `llms.txt` content (prices included).
- Generating `llms.txt` at build time.
