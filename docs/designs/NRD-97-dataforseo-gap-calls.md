# NRD-97 - Run the NRD-73 DataForSEO call plan and close the volume and SERP gaps

## Why

[NRD-97](https://nuriaromerodev.atlassian.net/browse/NRD-97) (SEO method phase 2, completion; epic NRD-4). NRD-73 shipped `docs/seo-audit/keyword-clusters-2026-11.md` with 0 of 30 planned DataForSEO calls: 22 of 41 queries have no volume and 7 clusters (SL-3, GEO-2, GEO-3, DW-3, TO-1, TO-3, IA-1) are grouped by wording only. NRD-74 assigns one owner page per cluster; a cluster that is really two intents (or two clusters that are one) makes the ADR create, merge or re-target the wrong page. Relates to NRD-74 (ranked before it) and NRD-73.

### Why NRD-73 ran with 0 calls, and how this design avoids it

The `dev` skill routes every subtask to the owner of its layer (`layers.app.owner`, default `team-harness:developer`). That agent has no DataForSEO tools (`agents/developer.md`: Read, Grep, Glob, Edit, Write, Bash and Jira only). The agents that do have them are `team-harness:seo-strategist` (`mcp__dataforseo__*`) and `team-harness:rank-tracker` (SERP only). NRD-73 put the calls inside developer subtasks, so they could not run.

This design separates **data acquisition** from **recording**, the pattern the user authorised on 2026-11-14 for NRD-21 (comment on NRD-21: "routing the missing data through the SEO strategist", output `.claude/state/seo/2026-11-14-NRD-21-backlinks.md`, then the developer recorded it on the story branch):

1. **Step 0, data acquisition (before `dev NRD-97`, run by the orchestrator, not a subtask).** The orchestrator launches `team-harness:seo-strategist` with the brief in "Step 0 brief" below. It makes at most 30 DataForSEO calls and writes one evidence file plus raw JSON, both untracked.
2. **Subtasks 1.1 and 1.2 (layer `app`, developer).** The developer copies the figures and SERP evidence from that file into the tracked study, with source and date. No subtask makes a paid call.

The spend is within the configured cap (`seo.dataforseo.enabled: true`, `maxCallsPerRun: 30`), which the `seo` skill treats as the approval ("do not ask, the config is the approval"). No harness change is needed for this story. Making `dev` run such data steps on its own would be a harness change (see Risks); it is not required here.

## What changes

- `docs/seo-audit/keyword-clusters-2026-11.md` (tracked): measured volumes or "sin dato" with reason for every volume gap, SERP evidence next to each of the 7 inferred clusters (confirmed, merged or split), the "Mapa cluster -> propietario" and "Conflictos de propiedad" sections updated, "Run status", "Huecos", open question 11 and the call ledger updated with the real calls.
- `docs/seo-audit/README.md`: the NRD-73 index row's evidence status updated.
- Untracked (never committed): `.claude/state/seo/<YYYY-MM-DD>-NRD-97-calls.md` and `.claude/state/seo/raw/<YYYY-MM-DD>-NRD-97/*.json`, written by the strategist in Step 0.

## Out of scope

- Any page, copy, URL, link, `src/data/*` (including `keywordOwners` and `intentMatrix`) or test change.
- Deciding owners or moving registered terms (NRD-74 decides; this story records evidence and proposed owners only).
- New keywords beyond what the planned candidate calls surface; rank tracking; committing raw DataForSEO responses.
- Re-buying data already in the daily SEO reports of 2026-11-13, 2026-11-14 and 2026-11-15 (and any later daily report that exists when Step 0 runs).

## Step 0 brief (for the orchestrator to pass verbatim to `team-harness:seo-strategist`)

> Story NRD-97 (story-scoped data run, not the daily report). Do not write or overwrite `<reportDir>/<today>.md`, do not touch `latest.md` or `notified.json`, and do not produce PO candidates.
> Execute the call plan in `docs/seo-audit/keyword-clusters-2026-11.md`, section "Plan de llamadas", with its rules: reuse first (S1-S9 and every daily report in `.claude/state/seo/` dated 2026-11-13 or later; never re-query a volume or Seville SERP already there), the four Labs-absent queries are not sent to the overview endpoint again, volumes at Spain / `es`, SERPs at `Seville,Andalusia,Spain` / `es` / mobile / depth 10. Hard cap: 30 DataForSEO calls for the whole story, retries included. Priority when the budget is short: (1) a Seville SERP for each head of the 7 inferred clusters (SL-3 `plan seo sevilla`, GEO-2 `agencia geo sevilla`, GEO-3 `geo generative engine optimization`, DW-3 `mantenimiento web sevilla`, TO-1 `diseño tienda online sevilla`, TO-3 `seo para tiendas woocommerce en sevilla`, IA-1 `automatización de procesos sevilla`); (2) one batched volume/difficulty call per group for the 22 volume-gap queries listed in "Huecos"; (3) the remaining plan rows. Stop at the cap; anything not measured stays a gap.
> Write `.claude/state/seo/<YYYY-MM-DD>-NRD-97-calls.md` (today's date) with: (a) a ledger table, one row per call: endpoint, parameters (keywords, location, language, device, depth), call timestamp, data date when returned, cost when returned, status (ok / error and message); total calls; (b) per query of the 41 in the study plus any new candidate: volume (Spain), difficulty, source endpoint and call date, or "sin dato" with the reason the tool gave (absent from database, zero rows, error); (c) per SERP read: the top 10 organic results (domain, URL, title, page type: service page, agency home, listicle/directory, blog/guide, marketplace, other), local pack yes/no with names and review counts, AI Overview yes/no, PAA yes/no; (d) for each of the 7 inferred clusters, the shared-intent reading: "same SERP as <cluster>", "distinct", or "mixed", with the page-type counts that support it. Save each raw response as JSON in `.claude/state/seo/raw/<YYYY-MM-DD>-NRD-97/`. Never estimate a figure. If the DataForSEO tools are not available in this run, write the file with "DataForSEO no disponible en esta ejecución: <exact tool or error>" and zero calls.

## Requirements and scenarios

### Requirement: data acquired by an agent with DataForSEO tools, within 30 calls

Paid calls SHALL be made only in Step 0 by `team-harness:seo-strategist`, at most 30 for the story, with results of the daily SEO reports reused and not bought again. No developer subtask SHALL make or simulate a DataForSEO call.

#### Scenario: evidence file present

- WHEN subtask 1.1 starts and `.claude/state/seo/<date>-NRD-97-calls.md` exists in the main checkout with a ledger of 30 calls or fewer
- THEN the developer uses it as the only new data source and cites it as a new source id (S10, with its date)

#### Scenario: budget respected

- WHEN the ledger in the evidence file is copied into "Registro de llamadas DataForSEO"
- THEN every call has endpoint, parameters, date and cost when returned, and the total is 30 or fewer; a total above 30 is reported in the story comment as a budget breach and the extra results are not used

#### Scenario: daily-report data reused

- WHEN a query already has a volume (S1) or a Seville SERP (S1, S2, S3 or a later daily report)
- THEN the study keeps citing that source and the ledger shows no call for it

### Requirement: every volume gap measured or explained

Every query of the study that read "gap" for volume SHALL show a measured volume with source and date, or "sin dato" with the reason. No figure is estimated, averaged or inferred.

#### Scenario: tool returns no row

- WHEN the volume call returns no data for `consultor seo provincia de sevilla`
- THEN the cell reads "sin dato (DataForSEO keyword_overview, <fecha>: sin registro)" and the query stays in "Huecos"

#### Scenario: four Labs-absent queries

- WHEN a query was absent from the Labs database on 2026-11-13 and was not re-sent (plan rule)
- THEN its cell reads "sin dato (ausente de Labs, S1 2026-11-13)" unless another endpoint in the ledger measured it

### Requirement: inferred clusters resolved from SERP page types

Each of SL-3, GEO-2, GEO-3, DW-3, TO-1, TO-3 and IA-1 SHALL be marked **confirmed**, **merged into <cluster>** or **split into <clusters>**, with the SERP evidence (page-type counts, local pack, AI Overview, top domains, source and date) next to the cluster. "Mapa cluster -> propietario" and "Conflictos de propiedad" SHALL reflect every merge or split (cluster list, counts line, evidence column from "inferred" to "observed").

#### Scenario: same SERP as another cluster

- WHEN the `plan seo sevilla` SERP shares most of its top 10 page types and domains with the `agencia seo sevilla` SERP
- THEN SL-3 is marked "merged into SL-1" with the overlap counted, and the map and counts line change accordingly

#### Scenario: SERP not read within budget

- WHEN Step 0 ran out of calls before a cluster head's SERP was read
- THEN the cluster keeps "intent: inferred from query wording, SERP not read", stays in "Huecos", and NRD-74 treats it as provisional

### Requirement: no DataForSEO access (fallback)

If Step 0 did not run, or its file states DataForSEO was unavailable, no figure SHALL be invented, the study SHALL state it in "Run status", the story SHALL get `needs-human` with the exact access missing, and the comment SHALL say that NRD-74 proceeds with the 7 clusters as provisional.

#### Scenario: evidence file missing

- WHEN subtask 1.1 starts and no `<date>-NRD-97-calls.md` exists
- THEN the developer stops before editing the study, comments "Step 0 (seo-strategist data run) has not run; see design section 'Step 0 brief'", and labels the story `needs-human` only if the orchestrator confirms the strategist cannot run (otherwise the orchestrator runs Step 0 and resumes)

#### Scenario: strategist ran without tools

- WHEN the evidence file says "DataForSEO no disponible en esta ejecución: <detail>"
- THEN "Run status" records it with the detail, the ledger records 0 calls, the story gets `needs-human` naming the missing access (the DataForSEO MCP server `dataforseo` for the seo-strategist), and the comment states NRD-74 treats the 7 clusters as provisional

### Requirement: docs only

The diff SHALL touch only `docs/seo-audit/keyword-clusters-2026-11.md`, `docs/seo-audit/README.md` and the tasks list of this design. `node --test tests/*.test.js` stays green.

## Files (layer `app`)

| Action | Path                                         | Notes                                                                                                                              |
| ------ | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| modify | `docs/seo-audit/keyword-clusters-2026-11.md` | add S10 to "Fuentes reutilizadas"; update query tables, clusters, map, conflicts, open question 11, "Run status", "Huecos", ledger |
| modify | `docs/seo-audit/README.md`                   | NRD-73 row: evidence status "DataForSEO calls of <fecha> (NRD-97, N of 30)"                                                        |
| read   | `.claude/state/seo/<date>-NRD-97-calls.md`   | main checkout only (untracked); never copied into the branch                                                                       |
| read   | `.claude/state/seo/raw/<date>-NRD-97/*.json` | spot-check source for figures; never committed                                                                                     |

Section edits keep the document's existing structure and labels ("Dato observado" / "Inferencia", "gap" vs "sin dato"). Rename nothing; add a dated "Ejecución NRD-97 (<fecha>)" paragraph under "Run status" instead of deleting the NRD-73 one (audit trail).

## Interfaces

None (documentation only). The evidence file format is fixed by the Step 0 brief: sections (a) ledger, (b) per-query volume, (c) per-SERP reading, (d) cluster readings.

## Data

None in the site. Raw DataForSEO JSON stays under `.claude/state/seo/raw/` (untracked, `repo.untrackedPaths`).

## Test plan (TDD order)

No behaviour change, so no new test. Each subtask ends with `node --test tests/*.test.js` green and a self-check: every new figure cites S10 and its call date; no "gap" cell left without either a figure or "sin dato (<reason>)"; ledger total equals the row count and is 30 or fewer; counts line of the map matches the table.

## Real-browser / e2e checks

None (docs path, `qaExemptPaths`). The PR reviewer spot-checks three volumes and one SERP reading against the raw JSON in the main checkout, and the ledger total.

## Risks

- **Step 0 not run.** If the orchestrator calls `dev NRD-97` without Step 0, subtask 1.1 stops at its gate rather than repeating NRD-73's 0-call outcome. The tracker summary and subtask 1.1 both state the step.
- **Harness gap (for the user, not blocking).** `dev` cannot itself route a data step to the seo-strategist; today the orchestrator does it by hand (NRD-21 precedent). A durable fix (for example a `dataSteps` hook in `dev`, or giving the developer read-only DataForSEO tools) is a harness change only the user can make.
- **Budget.** 30 calls cannot read every SERP in the plan; the brief puts the 7 inferred-cluster heads first so the ADR-relevant gaps close first.
- **Cost of Step 0 on the same day as the daily SEO run.** They are separate runs, each within its own 30-call cap; the ledger in the evidence file is the story's spend.
- **API errors.** The 2026-11-15 daily run had a Labs endpoint fail twice with HTTP 500; retries count against the 30.

## ADRs

0012 (keyword ownership registry). No new ADR.

## Tasks

- [x] 1.1 [NRD-99 app] Gate on the Step 0 evidence file; add S10, record measured volumes and difficulty (or "sin dato" with reason) for every volume gap, update "Run status", "Huecos" and the call ledger (30 or fewer); tests: unit suite green.
- [ ] 1.2 [NRD-100 app] Resolve SL-3, GEO-2, GEO-3, DW-3, TO-1, TO-3, IA-1 from SERP page types (confirmed, merged or split, evidence next to each), update "Mapa cluster -> propietario", "Conflictos de propiedad", open question 11 and the README row; tests: unit suite green.
