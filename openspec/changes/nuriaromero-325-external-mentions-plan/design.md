## Context

- `docs/designs/NRD-21-backlink-baseline-outreach.md` defines the rules for this kind of record: sourced metrics only, dated baseline, anti-manipulation (no link buying, no PBNs, no reciprocal-link schemes).
- `docs/seo-audit/authority-backlink-register.md` holds the figures ("Línea base 2026-11-14 (DataForSEO Backlinks API)": summary, anchors, spam score, probable spam domains) and "Activos públicos que pueden enlazarse".
- NRD-72 (tracker) holds the first outreach with 5 verified opportunities, deferred by the owner. The plan starts there.
- `docs/seo-audit/local-signals-2026-11.md` records third-party citations (Sortlist, Clutch pending); targets already obtained are not repeated as new.
- DataForSEO is reachable only by the `team-harness:seo-strategist` agent (its `mcp__dataforseo__*` tools, run through `/team-harness:seo`, `seo.dataforseo.maxCallsPerRun` 30). The developer agent has no DataForSEO tools, holds no credentials and must never read `.env`, so **the developer makes no DataForSEO call**.
- Recorded DataForSEO figures already exist and are reused (see "Data sourcing"): tracked `docs/seo-audit/authority-backlink-register.md` (baseline 2026-11-14); untracked SEO-strategist outputs in the owner's main checkout under `.claude/state/seo/`: `raw/2026-11-14-NRD-21/` (baseline raw: `backlinks_summary.json`, `backlinks_referring_domains.json`, `backlinks_anchors.json`, competitor backlinks and referring domains), the daily reports `2026-11-15.md` to `2026-11-21.md` (`2026-11-21.md`: `backlinks_bulk_referring_domains` = 38 referring domains, 37 on 2026-11-20; `ai_opt_llm_ment_cross_agg_metrics`, google, Spain: no mentions found for `nuriaromero.dev`, `citysem.es` 172, top AI source domains listed). `docs/seo-audit/keyword-clusters-2026-11.md` and the reports also record SERP listicles and directories that rank for the in-focus terms (target candidates).
- `docs/research/` is ignored today by the infra-owned `.gitignore` rule `research/` (line 38); NRD-326 force-added its file. See "Git handling of docs/research/".

## Goals / Non-Goals

**Goals:** an owner-ready plan: what changed since NRD-21, who to approach and how, 3 tactics as hypotheses, a 90-day calendar starting with NRD-72.

**Non-Goals:** outreach, paid commitments, filing issues, site changes.

## Decisions

**Approach.** Two documentation commits on one file: first the facts (delta and targets), then the plan built on them (tactics, 90 days). Figures come only from recorded DataForSEO responses (see "Data sourcing") or public pages read on a stated date; the source log is part of the document so provenance and spend are auditable.

**Data sourcing (answer to the developer question of 2026-11-21).** The developer never calls DataForSEO. Each figure is taken, in this order, from:

1. Tracked repo docs (`docs/seo-audit/*`, `docs/designs/NRD-21-backlink-baseline-outreach.md`): cite path and section.
2. Recorded SEO-strategist outputs in the owner's main checkout, read read-only by absolute path (`/Users/nuria/Desktop/code/nuriaromerodev/porfolio-nuriaromero.dev/nuriaromero.dev/.claude/state/seo/...`; they are untracked, so they do not exist in the developer worktree): cite the relative path `.claude/state/seo/<file>` and the call date, and copy every figure used into the document so it stands alone. If the main checkout is not readable, say so and fall back to 1.
3. The optional story data step `.claude/state/seo/<date>-NRD-325-calls.md` (with raw extracts in `.claude/state/seo/raw/<date>-NRD-325/`) when it exists; see "Owner-account actions". Its calls are listed in the document's source log as "data step (seo-strategist)".
4. Public pages read by the developer with a read-only `curl -sSIL` / `curl -sSL` GET (target existence, a media outlet's sections, an association's member page), with the read date.

A figure found in none of these reads **"not available (<reason>)"**, for example "not available (backlink total and spam score not re-read after 2026-11-14; data step not run)"; it is never estimated or carried over as current. The delta table uses the latest recorded value with its own date, so mixed dates are visible. Work never waits for the data step: if it has not run when NRD-334 starts, the developer proceeds with 1, 2 and 4.

**Git handling of `docs/research/`.** Until infra adds `!docs/research/` to `.gitignore` (an infra-owned path, not part of this design), the developer stages the one file explicitly with `git add -f docs/research/NRD-325-mentions-plan.md` (never `-f` on a directory or any other path), confirms with `git ls-files docs/research/` that it is tracked, and says in the PR description that the file was force-added because of the `research/` rule, with the infra follow-up. In NRD-335 the file is already tracked, so a normal `git add` of that path works (ignore rules do not apply to tracked files). Targets are checked to exist with a read-only GET; no form is submitted and no one is contacted. Expected returns are written as hypotheses with what would confirm or refute them (for example "a mention in X; check with backlinks or LLM-mentions call in 60 days"), never as promised rankings.

**Files (layer `app`).**

- Create `docs/research/NRD-325-mentions-plan.md` (English analysis, Spanish names and quotes verbatim), sections:
  1. Summary.
  2. Delta vs NRD-21 (table: metric, NRD-21 value and date, latest recorded value and its date, source file and endpoint). Metrics: referring domains (latest recorded: 38, `backlinks_bulk_referring_domains`, 2026-11-21), backlinks, referring main domains, spam score (from the data step, else "not available (<reason>)"), AI/brand mentions (`ai_opt_llm_ment_cross_agg_metrics`, google, Spain, 2026-11-21: none found for `nuriaromero.dev`; state the tool's daily noise as the report does). Brand mentions on the open web: a public web page search by the developer is not reproducible, so it is reported only if the data step returns it, else "not available".
  3. Data sources and calls (table: #, source type (repo doc / recorded report / data step / public GET), file or URL, endpoint when DataForSEO, call or read date, cost when returned). The developer's own DataForSEO calls are 0 by design; reused calls are listed but not re-charged; data-step calls count against that run's `maxCallsPerRun`.
  4. Targets (at least 20, ranked by fit then effort; candidates from NRD-72, the SERP listicles and directories already recorded in `keyword-clusters-2026-11.md` and the daily reports, the competitors' referring domains in `raw/2026-11-14-NRD-21/`, the data step if run, and the developer's own public GETs): rank, name, URL, type (business media, local blog, association, chamber of commerce, podcast, newsletter, directory, guest post), why it fits a Seville small-business audience, how to get the mention, effort (S/M/L), cost (none / paid: owner option), checked on (date).
  5. Tactics (exactly 3): description, targets used, effort, expected return as a hypothesis, how to measure, risks.
  6. Options for the owner (anything that costs money), never as a commitment.
  7. 90-day plan (by fortnight), starting with NRD-72 and stating the owner decision at each step.
  8. Proposed follow-up stories (prose only: title, scope, size, acceptance criteria); "to be filed by the PO after the owner approves the tactics".

**Interfaces.** None.

**Data.** None.

**Test plan (TDD order).** No behavior change, no new test (`skip_specs: true`). Checks per commit: `node --test tests/*.test.js` green; `git diff origin/develop --stat` lists only the document; `pnpm format docs/research/NRD-325-mentions-plan.md`.

**Real-browser / e2e checks.** None for QA (`docs/` is QA-exempt).

**ADRs relied on.** None changed. Invariants: no promised rankings, real proof only, radical changes (paid services are the owner's).

## Owner-account actions (executed by the orchestrator)

- **Executable owner action: optional story data step (DataForSEO, configured API).** The orchestrator runs `team-harness:seo-strategist` through `/team-harness:seo` in a story-scoped run (precedent: NRD-97 in `docs/seo-audit/keyword-clusters-2026-11.md`, source S10), ideally before NRD-334 starts, writing `.claude/state/seo/<date>-NRD-325-calls.md` and raw extracts in `.claude/state/seo/raw/<date>-NRD-325/`, without touching the daily report, `latest.md` or PO candidates. Plan, at most 12 calls: `backlinks_summary` for `nuriaromero.dev` (backlinks, referring main domains, spam score) 1; `backlinks_referring_domains` sorted by first seen, to name the domains gained since 2026-11-14, 1; LLM mentions search for the brand strings `Nuria Romero` and `nuriaromero.dev` 1-2; live SERPs at `Seville,Andalusia,Spain`, `es`, for up to 8 target-discovery queries (for example `blog negocios sevilla`, `asociación de empresarios sevilla`, `podcast emprendedores sevilla`, `diario económico sevilla`, `mejores agencias seo sevilla`). If it runs on the same day as the NRD-323 data step, the two plans share one run and the orchestrator keeps the sum within 30, or runs them on different days. Not a subtask and not a blocker: without it the document uses recorded data and "not available".

## Risks / Trade-offs

- Recorded figures have different dates (baseline 2026-11-14, referring domains and AI mentions 2026-11-21); the delta table shows each date instead of implying one snapshot.

- Local media lists go stale; every target carries a "checked on" date.
- The recorded `.claude/state/seo/` files are untracked and live only in the owner's checkout; copying each figure into the document keeps it verifiable after those files rotate.
- The plan depends on owner time for outreach; the 90-day calendar names the owner effort per step so she can scale it down.
