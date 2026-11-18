# Proposal

## Why

Tracker: [NRD-126](https://nuriaromerodev.atlassian.net/browse/NRD-126) (phase 5 step 7 of ADR 0013; draft in `docs/seo-audit/page-optimization-checklist.md` "Paso 7"; epic NRD-4, milestone M3). `/inteligencia-artificial/` is the registered owner of `inteligencia artificial para empresas sevilla` (`keywordOwners`, step 0, NRD-119) and is now indexed (URL Inspection 2026-11-17: "Submitted and indexed"), but none of its three search signals works that term: the title is `IA para negocios en Sevilla | Chatbots y asistentes con IA` (no "inteligencia artificial", no "empresas"), the H1 is `Inteligencia artificial aplicada a tu negocio` (no "empresas", no "Sevilla") and the description starts `Llevo la IA a tu negocio en Sevilla...` (`src/data/services.ts:408-417`). The Seville SERP (S10 2026-11-15 and daily report 2026-11-17) has no local pack and is led by local agency service pages whose titles follow "service + Sevilla" (`iasevilla.com`, `simebuscas.com`, `robleragency.com`), plus training and directory pages; nuriaromero.dev is not in the top 10.

## What Changes

- **Evidence first (SEO-2).** Re-read the SERP (one DataForSEO call), measure the main-content words of the ranking service pages (at most three calls) and take a Lighthouse baseline of the page before any edit; record both in `docs/seo-audit/`.
- **SEO-1.** Title, H1 and meta description work the registered term: title `Inteligencia artificial para empresas en Sevilla | Chatbots`, H1 `Inteligencia artificial para empresas en Sevilla`, description `Inteligencia artificial para empresas en Sevilla: chatbots que atienden clientes y agentes que reservan o toman pedidos. Más de 10 años de experiencia.` (data only, `inteligenciaArtificial` in `src/data/services.ts`). The H1 keeps six words, so the `<main>` word budget (846 of 850) does not move.
- The `/inteligencia-artificial/` `intentMatrix` row follows the copy (`titleSignal`, `h1Signal`); `descriptionSignal` "chatbots que atienden clientes" stays.
- **SEO-6.** Verify only: the row to `/desarrollo-software-medida/` (table A row 3) and the reciprocal pair with `/automatizaciones/` already exist (NRD-119); the new test pins them.
- Frozen-string tests updated in the same commit (`tests/ia-template.test.js`, `tests/seo-meta-titles.test.js`).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `ai-page`: the intent placement changes from "IA para negocios en Sevilla" to the registered term (MODIFIED "The page keeps its intent placement"); the placement is backed by a recorded SERP reading and a measured competitor sample (ADDED).

## Out of scope

- Any section, FAQ, benefit, process, price or `public/llms.txt` change; the display title "IA que responde con tu información" and the subtitle stay.
- Training or course intent (four of nine results are training pages): the service does not offer training, so the page does not chase it.
- Changing the word budget of ADR 0014 to match competitor lengths; the measured counts are recorded, not acted on.
- Any promise that an AI assistant or Google will recommend or rank the business (DEL-5).

## Impact

- Code (layer `app`): `src/data/services.ts`, `src/data/seo-intents.ts`, new `tests/ia-intent.test.js`, `tests/ia-template.test.js`, `tests/seo-meta-titles.test.js`; docs `docs/seo-audit/keyword-clusters-2026-11.md`, `docs/seo-audit/full-audit-2026-09-21/tasks/04-validar-cwv-y-lcp.md`.
- `Service.name` and `Service.description` in JSON-LD follow the H1 and description automatically (`ServiceLayout.astro`); `WebPage.dateModified` refreshes from git (ADR 0017).
- DataForSEO: at most 4 calls. No URL, price, dependency, CSP or template change. Not radical.
