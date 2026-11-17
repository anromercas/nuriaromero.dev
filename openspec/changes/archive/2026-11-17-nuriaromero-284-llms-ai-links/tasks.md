# Tasks

Single work unit, no ordering links.

## 1. llms.txt links the AI discovery files

- [x] 1.1 [NRD-285 app] Add the `## Datos para asistentes de IA` section to `public/llms.txt` with the three file links and descriptions; tests: in `tests/ai-discovery.test.js` first (RED) the source test for the ordered links, descriptions and no-promise wording, plus the `dist/`-gated existence test, then the edit, `node --test tests/*.test.js`, `pnpm build` and `pnpm check:seo:dist` green
