## Context

[NRD-284](https://nuriaromerodev.atlassian.net/browse/NRD-284). `public/llms.txt` is a hand-curated static file copied verbatim to `dist/llms.txt`. NRD-246 added the prerendered endpoints `src/pages/.well-known/ai.txt.ts`, `src/pages/ai/summary.json.ts` and `src/pages/ai/faq.json.ts` (spec `openspec/specs/ai-discovery/spec.md`); `ai.txt` already links back to `llms.txt` (`buildAiTxt` in `src/lib/ai-discovery.ts`), but `llms.txt` does not link to them.

Guards that read `llms.txt` today: `scripts/check-seo-09.mjs` (all links `https://nuriaromero.dev/...` or two allowed profiles, at least 10 links, readable sections, no-promise notice, no private URLs), `scripts/check-seo-13.mjs` (links `/recursos/`), `scripts/check-seo-19.mjs` (no `/404`), `scripts/lib/seo-para-ia-contract.mjs` (`/seo-para-ia/` under `## Servicios`), `tests/single-price-source.test.js` (prices in `## Servicios`, section ends at the next `\n## `), `tests/site-identity.test.js` and several page tests reading single lines. None checks trailing slashes in `llms.txt` (`tests/trailing-slash-links.test.js` only scans `src/content/blog/`).

## Goals / Non-Goals

**Goals:** link the three discovery files from `llms.txt` with honest descriptions; protect it with a test that fails today; keep every existing guard green.

**Non-Goals:** generating `llms.txt` at build time; changing any other line of it; production `Content-Type` checks; touching any check script.

## Decisions

**Approach.** Add a new section `## Datos para asistentes de IA` to `public/llms.txt`, placed after `## Contenido editorial` and before `## Perfiles oficiales`, so the existing `## Servicios` boundary used by the price test is untouched. The URLs are file URLs (no trailing slash), matching the endpoint routes. The source test reads `public/llms.txt`, slices the section up to the next `\n## `, extracts the Markdown links and asserts the exact ordered list plus a no-promise regex over the section lines; the build test, gated like the existing NRD-282 test on `dist/ai/summary.json`, maps each URL to `dist/<path>` and asserts it exists. The URLs are hard-coded in the test on purpose: they are the public contract, and `SITE.url` is already used in the same file if the developer prefers building them from it.

Section text (Spanish copy, final):

```
## Datos para asistentes de IA
- [Resumen del negocio](https://nuriaromero.dev/ai/summary.json): Resumen en JSON del negocio, sus datos de contacto y sus servicios con precios, generado desde los datos de la web.
- [Preguntas frecuentes](https://nuriaromero.dev/ai/faq.json): Preguntas frecuentes publicadas en las páginas de la web, en JSON, con el mismo texto que muestra cada página.
- [Política para agentes de IA](https://nuriaromero.dev/.well-known/ai.txt): Reglas de acceso para rastreadores y agentes de IA, las mismas que robots.txt, con enlaces a estos recursos.
```

**Files** (all layer `app`):
- modify `public/llms.txt`: insert the section above, with one blank line before and after.
- modify `tests/ai-discovery.test.js`: append a `// --- Task 1.1 (NRD-285): llms.txt links ---` block with the two tests.

**Interfaces.** None (no code symbols added). Test helpers stay local to the test file (`read`, `existsSync`, `dist` already exist there).

**Data.** None: no schema, storage, settings or data change; `src/data` untouched.

**Test plan (TDD order).**
1. RED: in `tests/ai-discovery.test.js`, test "llms.txt links the three AI discovery files" (scenarios *Section with the three links* and *No promises*): heading present, ordered links equal the three URLs, each link line has `: <description>`, no line matches `/garantiz|citar|citación|posicion|prioridad|tratamiento especial/i`. Fails today (no heading).
2. RED/skip: test "every llms.txt AI link exists in dist" with `{ skip: !existsSync(new URL("ai/summary.json", dist)) }` (scenario *Every linked file exists in the build*); fails once built without the section only if the section exists, so its RED is covered by test 1; after `pnpm build` it must run (not skip) and pass.
3. GREEN: edit `public/llms.txt`.
4. Verify scenario *Existing llms.txt guards keep passing*: `node --test tests/*.test.js`, `pnpm build`, `pnpm check:seo:dist`.

**Real-browser / e2e checks.** None visual. QA fetches `http://localhost:4399/llms.txt` (or `dist/llms.txt` after build) and opens the three links: each answers 200 with the file content.

**ADRs relied on.** ADR 0018 (prerendered build-time endpoints), ADR 0008 (Spanish copy, English identifiers).

## Risks / Trade-offs

- `llms.txt` stays hand-kept, so the three URLs could drift from the routes; mitigated by the `dist/` existence test. Generating `llms.txt` from data would remove the drift entirely but is out of scope for a 1-point story.
- A future guard enforcing trailing slashes on `llms.txt` would have to exempt file URLs (extension or `/.well-known/`), as the trailing-slash blog test already does with its extension rule.

## UI spec

**No visual UI.** The story changes only the plain-text file `public/llms.txt` (served as `/llms.txt`). No screen, component, layout, token or style is added or changed. Checklist items 1 (screens and layout), 2 (hierarchy), 3 (states), 5 (design system reuse), 6 (responsive), 7 (interactions) and 8 (accessibility hand-off): n/a.

### `public/llms.txt`: section "Datos para asistentes de IA"

- **Placement**: as fixed in Decisions, after `## Contenido editorial` and before `## Perfiles oficiales`, one blank line before and after. Reading order of the file stays: intro and notice, profile, services, sectors, editorial content, AI data, official profiles, sitemap (machine-readable resources grouped right before the external profiles and sitemap).
- **Format**: identical to the other sections: `## ` heading in sentence case, one `- [Label](absolute URL): Description.` line per link, each description a single sentence ending with a period. No bold, no emoji, no extra notes.
- **Copy (Spanish, exact)**: the three lines in Decisions are adopted verbatim; the heading is `## Datos para asistentes de IA`. Checked against the rest of the file:
  - plain, factual register, describing what each file contains and where its data comes from, like the existing descriptions;
  - no promise of reading, citation, ranking, priority or special treatment (none of the words the test regex forbids appears); the existing intro notice ("no garantiza indexación, posicionamiento, citación ni un tratamiento especial...") keeps covering the whole file, so the section adds no second disclaimer;
  - brand: the section does not name the brand; no change to how "Nuria Romero" / "nuriaromero.dev" appear elsewhere;
  - no prices, phone numbers or dates repeated inside the section (they live in the linked JSON), so nothing can drift from `src/data`.
- Assumption: link labels "Resumen del negocio", "Preguntas frecuentes" and "Política para agentes de IA" stay short nouns, like "Blog" or "Portfolio" in the file, because no acceptance criterion fixes them and the description already carries the detail.

### GEO-ready content (checklist item 9)

Applies only as copy hygiene: no visible "updated" date is added (the file has none and the section must not invent one); no keyword stuffing or hidden text. Structured data and discovery files themselves belong to the Tech Lead's design and `seo-review`.
