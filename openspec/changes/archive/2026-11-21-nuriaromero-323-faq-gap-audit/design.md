## Context

- One source of truth for published FAQs: `faqPages()` in `src/lib/ai-discovery.ts:17` returns home and contact (`homeFaqs`, `contactFaqs` in `src/data/page-faqs.ts`), every `services[].faqs` (`src/data/services.ts`) and every `niches[].faqs` (`src/data/niches.ts`). `/ai/faq.json` is built from it (`buildAiFaq`) and `tests/ai-discovery*.test.js` keep it equal to the FAQPage JSON-LD, so the inventory needs no separate scrape.
- Word budgets: ADR 0015 (budgets measure owner-controlled visible text in `<main>`, `data-word-budget="exclude"` blocks removed; counter in `scripts/lib/page-contract.mjs`). Each page budget lives in its living spec (`openspec/specs/<page>/spec.md`: `home-page`, `contact-page`, `seo-para-ia-page`, `diseno-web-page`, `tienda-online-page`, `software-page`, `automatizaciones-page`, `ai-page`, `page-template`...) or in the page design under `docs/designs/`.
- Question data in the repo: `docs/seo-audit/keyword-clusters-2026-11.md` and other `docs/seo-audit/` studies; `seo/estudios/` exists only in the owner's main checkout (untracked, not on develop); the developer may read it there read-only and cite the file names, or state that it was not available.
- Recorded question data from DataForSEO already exists in the owner's main checkout (untracked): `.claude/state/seo/questions/2026-11-16.md` (SEO-strategist run of 2026-11-16, 23 calls: People Also Ask from live SERPs at `Seville,Andalusia,Spain`, question-form keywords with Spain monthly volume from Labs `keyword_suggestions` and Google Ads `search_volume`, related searches, AI Overview topics) for `/`, `/seo-local-sevilla/`, `/diseno-web-sevilla/`, `/tienda-online-sevilla/`, `/automatizaciones/`, `/desarrollo-software-medida/`, `/inteligencia-artificial/`, the five niche pages and cross-page questions, with its own "Limitaciones" section. PAA lists for `posicionamiento en ia` and other in-focus terms are also recorded in `docs/seo-audit/keyword-clusters-2026-11.md` (sources S1, S3, S10) and `.claude/state/seo/2026-11-15-NRD-97-calls.md`. Not covered by recorded question data: `/contacto/` and `/seo-para-ia/` as pages of their own (the GEO PAA in the clusters doc is the closest).
- DataForSEO is reachable only by the `team-harness:seo-strategist` agent (run through `/team-harness:seo`); the developer agent has no DataForSEO tools, holds no credentials and must never read `.env`, so **the developer makes no DataForSEO call**.
- `docs/research/` is ignored today by the infra-owned `.gitignore` rule `research/` (line 38); NRD-326 force-added its file. See "Git handling of docs/research/".
- Invariants: real proof only, no promised rankings, prices only from `src/data` (single price source, NRD-10).

## Goals / Non-Goals

**Goals:** a sourced gap table and ready-to-file proposals per page, within each page budget, with nothing invented.

**Non-Goals:** editing FAQs; owner data; filing issues.

## Decisions

**Approach.** Two documentation commits on one file: inventory plus question table first, proposals second. Coverage is judged by intent, not wording: a question is "covered" when an existing FAQ entry answers it directly in its first sentence; partially answered questions are marked "partial" and treated as gaps. "Recurring" means it appears in at least two sources or has a known monthly volume of 10 or more; one-off questions are listed but get no proposal.

**Data sourcing (answer to the developer question of 2026-11-21).** The developer never calls DataForSEO. Questions and volumes are taken, in this order, from:

1. Tracked repo docs (`docs/seo-audit/keyword-clusters-2026-11.md` and other `docs/seo-audit/` studies): cite path, section and the source id (S1, S3, S10...).
2. Recorded SEO-strategist outputs in the owner's main checkout, read read-only by absolute path (`/Users/nuria/Desktop/code/nuriaromerodev/porfolio-nuriaromero.dev/nuriaromero.dev/.claude/state/seo/questions/2026-11-16.md`, `.../.claude/state/seo/2026-11-15-NRD-97-calls.md` and `raw/2026-11-15-NRD-97/`; same for `seo/estudios/`). They are untracked, so they do not exist in the developer worktree: cite the relative path and the call date, and copy each question and volume used into the report so it stands alone. If the main checkout is not readable, say so and fall back to 1.
3. The optional story data step `.claude/state/seo/<date>-NRD-323-calls.md` when it exists; see "Owner-account actions".

Keep the source's own labels: a Spain-level volume is not a Seville volume; "sin dato" is not 0. A page with no recorded questions reads "no recorded question data (<reason>)" in the question table instead of invented questions. Work never waits for the data step: if it has not run when NRD-336 starts, the developer proceeds with 1 and 2.

**Git handling of `docs/research/`.** Until infra adds `!docs/research/` to `.gitignore` (an infra-owned path, not part of this design), the developer stages the one file explicitly with `git add -f docs/research/NRD-323-faq-gap-report.md` (never `-f` on a directory or any other path), confirms with `git ls-files docs/research/` that it is tracked, and says in the PR description that the file was force-added because of the `research/` rule, with the infra follow-up. In NRD-337 the file is already tracked, so a normal `git add` of that path works.

**Files (layer `app`).**

- Create `docs/research/NRD-323-faq-gap-report.md` (English analysis, questions and proposed answers in Spanish), sections:
  1. Summary.
  2. Published FAQ inventory (table: page URL, entry number, question), generated by reading `faqPages()` data (a throwaway `node -e` import is fine; nothing committed).
  3. Question table: question, source (file and source label such as `PAA`, `KW-Labs`, `KW-Ads`, with the original call date), monthly volume when known (with its scope, Spain or Seville), covered (yes/partial/no), page and FAQ entry that covers it.
  4. Proposals (uncovered or partial recurring questions): question, proposed answer in Spanish (1-2 sentences, direct answer first), target page, that page's word budget with its source (spec or design path), current count and count after adding, data used (file and symbol, for example a price from `src/data/services.ts`). Or a rejection with reason: off-offer, parked page, would promise results.
  5. Data sources and calls (table: #, source type (repo doc / recorded report / data step), file, endpoint, seed, original call date, cost when returned). The developer's own DataForSEO calls are 0 by design; reused calls are listed but not re-charged; data-step calls count against that run's `maxCallsPerRun`.
  6. Preguntas de clientes reales (dueña): empty table with the same columns plus "anonimizada: sí", for the owner.
  7. For the PO: additions grouped by page, ready to file as stories.

**Interfaces.** None.

**Data.** None.

**Test plan (TDD order).** No behavior change, no new test (`skip_specs: true`). Checks per commit: `node --test tests/*.test.js` green; `git diff origin/develop --stat` lists only the report; `pnpm format docs/research/NRD-323-faq-gap-report.md`. Current page word counts come from a local `pnpm build` and the page-contract counter (`scripts/lib/page-contract.mjs`), stated with the build date.

**Real-browser / e2e checks.** None for QA (`docs/` is QA-exempt).

**ADRs relied on.** ADR 0015 (word budgets), ADR 0012 (keyword ownership: a proposal must not target a term owned by another page; if it would, route it to the owner page or reject).

## Owner-account actions (executed by the orchestrator)

- **Executable owner action: optional story data step (DataForSEO, configured API).** The orchestrator runs `team-harness:seo-strategist` through `/team-harness:seo` in a story-scoped run (precedent: NRD-97, source S10 in `docs/seo-audit/keyword-clusters-2026-11.md`), ideally before NRD-336 starts, writing `.claude/state/seo/<date>-NRD-323-calls.md` with raw extracts, without touching the daily report, `latest.md` or PO candidates. Plan, at most 6 calls, only for the gaps in the recorded data: live SERPs (People Also Ask) at `Seville,Andalusia,Spain`, `es`, for `seo para ia` and `geo posicionamiento ia` (`/seo-para-ia/`) and for `presupuesto pagina web sevilla` and `contratar diseñador web sevilla` (contact intent), plus 1-2 Labs `keyword_suggestions` for question forms of `seo para ia`. If it runs on the same day as the NRD-325 data step, the two plans share one run and the orchestrator keeps the sum within 30, or runs them on different days. Not a subtask and not a blocker.

## Risks / Trade-offs

- The recorded question data is from 2026-11-16 (five days old at design time); PAA rotates, so every question keeps its original date and the report does not present it as today's SERP.

- People Also Ask for low-volume local queries may be sparse; the report then leans on the recorded question-form keywords and the repo studies and says so.
- Some budgets may leave no room; the proposal then states the trade (which existing sentence would give way) or is rejected for budget, never silently over budget.
