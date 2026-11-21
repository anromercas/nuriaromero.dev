## Context

- `docs/designs/NRD-21-backlink-baseline-outreach.md` defines the rules for this kind of record: sourced metrics only, dated baseline, anti-manipulation (no link buying, no PBNs, no reciprocal-link schemes).
- `docs/seo-audit/authority-backlink-register.md` holds the figures ("Línea base 2026-11-14 (DataForSEO Backlinks API)": summary, anchors, spam score, probable spam domains) and "Activos públicos que pueden enlazarse".
- NRD-72 (tracker) holds the first outreach with 5 verified opportunities, deferred by the owner. The plan starts there.
- `docs/seo-audit/local-signals-2026-11.md` records third-party citations (Sortlist, Clutch pending); targets already obtained are not repeated as new.
- DataForSEO access is the one configured for the SEO runs (`seo.dataforseo`, max 30 calls per run). `docs/research/` is created this sprint (NRD-326 also writes there; whichever merges first creates the folder).

## Goals / Non-Goals

**Goals:** an owner-ready plan: what changed since NRD-21, who to approach and how, 3 tactics as hypotheses, a 90-day calendar starting with NRD-72.

**Non-Goals:** outreach, paid commitments, filing issues, site changes.

## Decisions

**Approach.** Two documentation commits on one file: first the facts (delta and targets), then the plan built on them (tactics, 90 days). Figures come only from DataForSEO responses or public pages read on a stated date; the call log is part of the document so spend is auditable. Targets are checked to exist with a read-only GET; no form is submitted and no one is contacted. Expected returns are written as hypotheses with what would confirm or refute them (for example "a mention in X; check with backlinks or LLM-mentions call in 60 days"), never as promised rankings.

**Files (layer `app`).**

- Create `docs/research/NRD-325-mentions-plan.md` (English analysis, Spanish names and quotes verbatim), sections:
  1. Summary.
  2. Delta vs NRD-21 (table: metric, NRD-21 value and date, current value, source/endpoint, call date). Metrics: referring domains, backlinks, referring main domains, spam score, brand mentions (LLM mentions endpoint if available; otherwise state "not available" and use a public web search for "nuriaromero.dev" / "Nuria Romero" + Sevilla with date).
  3. DataForSEO calls (table: #, endpoint, target/keyword, date, cost). Target total at most 30; aim at most 20 in task 1.1, the rest reserved for task 1.2. If DataForSEO is not available, say so and use public sources only.
  4. Targets (at least 20, ranked by fit then effort): rank, name, URL, type (business media, local blog, association, chamber of commerce, podcast, newsletter, directory, guest post), why it fits a Seville small-business audience, how to get the mention, effort (S/M/L), cost (none / paid: owner option), checked on (date).
  5. Tactics (exactly 3): description, targets used, effort, expected return as a hypothesis, how to measure, risks.
  6. Options for the owner (anything that costs money), never as a commitment.
  7. 90-day plan (by fortnight), starting with NRD-72 and stating the owner decision at each step.
  8. Proposed follow-up stories (prose only: title, scope, size, acceptance criteria); "to be filed by the PO after the owner approves the tactics".

**Interfaces.** None.

**Data.** None.

**Test plan (TDD order).** No behavior change, no new test (`skip_specs: true`). Checks per commit: `node --test tests/*.test.js` green; `git diff origin/develop --stat` lists only the document; `pnpm format docs/research/NRD-325-mentions-plan.md`.

**Real-browser / e2e checks.** None for QA (`docs/` is QA-exempt).

**ADRs relied on.** None changed. Invariants: no promised rankings, real proof only, radical changes (paid services are the owner's).

## Risks / Trade-offs

- Local media lists go stale; every target carries a "checked on" date.
- LLM-mentions data may not be part of the DataForSEO plan; the document then says "not available" instead of estimating.
- The plan depends on owner time for outreach; the 90-day calendar names the owner effort per step so she can scale it down.
