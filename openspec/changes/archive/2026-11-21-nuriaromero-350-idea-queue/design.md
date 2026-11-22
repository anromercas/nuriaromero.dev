## Context

- Owner decisions (NRD-327 comments, 2026-11-21, quoted in NRD-350): 4 posts a month, minimum 2; pillars SEO (local and GEO), web design and online stores, AI, other services; topics from real questions only.
- Built on (merged before this story):
  - NRD-345: `seo/contenido/README.md` names `ideas.json` and its fields; ADR 0020 (queue path, scripts rule, owner gates).
  - NRD-346: `normaliseKeywordData` (normalized, DataForSEO envelope, Search Console formats; `kind` = `paa` | `keyword` | `gsc` | `client-question`), `shortlistTopics` (question filter, merge, `Candidate`), `PILLARS` / `classifyTopic` (pillar and target route).
  - NRD-347: `dedupeCandidates(candidates, { owners, intents, posts, queue, blockingStatuses })`, `readPosts`, `scripts/lib/idea-queue.mjs` reader (`IDEA_STATUSES`, `DEFAULT_QUEUE_PATH`, `parseIdeaQueue`, `readIdeaQueue`).
  - NRD-349: `.claude/skills/blog-pipeline/SKILL.md` and `tests/blog-pipeline-skill.test.js`.
- Scheduled SEO run: team-harness `seo` skill, daily, reads `.claude/harness/seo.md`; writes its report to `.claude/state/seo/<date>.md` and `latest.md`; makes no commits; DataForSEO cap `seo.dataforseo.maxCallsPerRun` = 30 (`.claude/harness.json`).
- Question sources available: SERP People Also Ask and Labs keyword data (DataForSEO, already used by the run), Search Console via the configured service account (owner's API access), and the recorded questions of `docs/research/NRD-323-faq-gap-report.md` (section 3, "Question table") and `.claude/state/seo/questions/2026-11-16.md`.

## Goals / Non-Goals

**Goals:** a single tracked queue; a deterministic refresh that never invents ideas and never re-proposes settled ones; a weekly report of 4 proposals across pillars; owner decisions recorded by a script; the skill fed by the queue.

**Non-Goals:** new providers or paid services; changing the team-harness `seo` skill; automatic publishing; committing from the unattended run.

## Decisions

**Approach.** The refresh is a pure merge: normalize exports (NRD-346), shortlist without limit, drop what `dedupeCandidates` covers with `blockingStatuses = IDEA_STATUSES` (every status blocks a re-add) plus candidates without a pillar, turn the rest into `propuesta` ideas with a score, and serialize the queue in a fixed order. The run date is a required `--date` argument, so output never depends on the clock. The weekly cadence is an instruction in the SEO brief (the run already happens daily and has the data access), not a new scheduler. The owner approves or rejects in conversation; `blog-idea-status.mjs` writes the decision; the skill's step 0 applies pending decisions and commits the queue with the next post branch.

**Score** (`scoreIdea`, rounded to 3 decimals):

```text
volumeScore = volume == null ? 0 : min(1, log10(volume + 1) / 4)        // 10 000/month -> 1
easeScore   = difficulty == null ? 0.5 : (100 - difficulty) / 100
fit         = pillar ? 1 : 0
citability  = kind in {paa, client-question} ? 1 : 0.5                     // questions people ask verbatim
score       = 0.40 * volumeScore + 0.20 * easeScore + 0.25 * fit + 0.15 * citability
```

**Intent** (`classifyIntent`): the export's `intent` when present (Labs `main_intent` mapped: informational -> `informacional`, commercial -> `comercial`, transactional -> `transaccional`, navigational -> `navegacional`); else `comercial` when the keyword has `precio`, `cuanto cuesta`, `cuanto cobra`, `presupuesto`, `contratar`, `tarifa`; else `informacional` (every queued idea is a question).

**Serialization** (`serializeQueue`): `JSON.stringify(queue, null, 2) + "\n"`, ideas ordered by status (`en curso`, `aprobada`, `propuesta`, `rechazada`, `publicada`), then score descending, then `id`; keys in the fixed order of the entry shape below.

**Pick** (`pickProposals(ideas, n = 4)`): `propuesta` ideas by score desc then id; round-robin over pillars in the order of their best idea, taking one per pillar per round until `n` or exhausted.

**Weekly brief section** (`.claude/harness/seo.md`, new `## Weekly blog idea refresh` at the end, English like the rest of the brief):

1. Once a week, on the first run on or after Monday (Europe/Madrid), and only then.
2. Budget: at most 6 of the run's `seo.dataforseo.maxCallsPerRun` calls: up to 4 live SERP calls (one seed question per pillar, Seville, es) for People Also Ask, up to 2 Labs keyword-suggestion calls filtered to question keywords. Report these calls in the run's call table. No paid service beyond DataForSEO.
3. Save each response, unedited, as JSON under `.claude/state/seo/ideas/<date>/`; Search Console queries of the last 28 days (configured service account, when available) as `gsc-<date>.json`; the recorded client questions from `docs/research/NRD-323-faq-gap-report.md` as the normalized file `.claude/state/seo/ideas/nrd-323-questions.json` (`kind: "client-question"`, created once and reused).
4. Run `node scripts/blog-ideas-refresh.mjs --date <today> .claude/state/seo/ideas/<date>/*.json .claude/state/seo/ideas/nrd-323-questions.json [gsc file]`.
5. Copy its "Ideas para el blog" section into the report and summarise it in `latest.md` for the owner to approve or reject (reply in a session with "aprueba idea <id>" or "rechaza idea <id>").
6. The run does not commit: `seo/contenido/ideas.json` stays modified in the checkout until the blog-pipeline skill's step 0 commits it on the next post branch.

**Skill changes** (`.claude/skills/blog-pipeline/SKILL.md`): new `## Step 0. Ideas`: apply the owner's decisions with `node scripts/blog-idea-status.mjs <id> <aprobada|rechazada>`; if no idea is `aprobada`, show the latest four proposals (`node scripts/blog-ideas-refresh.mjs --dry-run --date <today>` with no exports prints them) and stop. Step 1 starts from an `aprobada` idea (its question, keyword, volume and source fill `tema.md`; the shortlist from exports remains a fallback), sets it to `en curso` with `blog-idea-status.mjs`, and the queue file is committed with `tema.md` on the post branch; the publish step notes that the idea becomes `publicada` in the owner's merge commit.

**Files (layer `app`; `seo/contenido/**`, `.claude/harness/seo.md`, `.claude/skills/blog-pipeline/SKILL.md` are shared paths routed to `app`).**

- Modify `scripts/lib/idea-queue.mjs` and create `tests/blog-idea-queue.test.js`, fixtures `tests/fixtures/blog-pipeline/queue/` (`queue.json`, `export-week1.json`, `export-few.json`) - task 1.1.
- Create `scripts/blog-ideas-refresh.mjs`, `scripts/blog-idea-status.mjs`, `seo/contenido/ideas.json` (`{ "version": 1, "ideas": [] }` plus trailing newline), `tests/blog-ideas-refresh.test.js` - task 1.2.
- Modify `.claude/harness/seo.md`, `.claude/skills/blog-pipeline/SKILL.md`, `seo/contenido/README.md` (how to approve or reject an idea), `tests/blog-pipeline-skill.test.js`; create `tests/seo-brief-ideas.test.js` - task 1.3.

`.claude/` guard for task 1.3: only those two `.claude/` files change; no change to `.claude/settings.json`, `.claude/harness.json` (the call cap stays as is), permissions, hooks or the team-harness plugin. If NRD-345's README field list differs from the entry shape below, update the README in task 1.3.

**Interfaces.**

```js
// scripts/lib/idea-queue.mjs (added to the NRD-347 reader)
export type Idea = {
  id: string; question: string; keyword: string; intent: string;
  volume: number | null; difficulty: number | null;
  target: string; pillar: "seo" | "web" | "ia" | "servicios"; score: number;
  source: { name: string; date: string }; status: (typeof IDEA_STATUSES)[number]; added: string; // YYYY-MM-DD
};
export function ideaId(keyword: string): string;            // normaliseTerm(keyword) tokens joined by "-", max 60 chars at a word boundary
export function validateIdea(idea: unknown): string[];      // [] when valid; else "entry field: problem" messages
export function classifyIntent(candidate: Candidate): string;
export function scoreIdea(candidate: Candidate): number;
export function mergeIdeas(queue: { version: 1; ideas: Idea[] }, candidates: Candidate[], context: {
  date: string; owners; intents; posts;
}): { queue: { version: 1; ideas: Idea[] }; added: Idea[]; dropped: { candidate: Candidate; reason: DropReason | { kind: "no-pillar" } }[] };
// existing ideas are never modified; an added idea's id collision gets a "-2", "-3" suffix
export function pickProposals(ideas: Idea[], n?: number): Idea[];
export function setIdeaStatus(queue, id: string, status: string): { version: 1; ideas: Idea[] }; // throws on unknown id/status
export function serializeQueue(queue): string;
// parseIdeaQueue now also runs validateIdea on every entry.

// scripts/blog-ideas-refresh.mjs
// node scripts/blog-ideas-refresh.mjs --date YYYY-MM-DD [--queue seo/contenido/ideas.json] [--posts src/content/blog] [--dry-run] [export.json...]
//   missing/invalid --date -> exit 1; unreadable export -> exit 1 (queue untouched)
//   writes serializeQueue(result) unless --dry-run; prints:
//   "## Ideas para el blog (<date>)" + "| # | Pregunta | Pilar | Volumen | Página destino | Fuente |" rows (top 4 via pickProposals)
//   + "Nuevas esta semana: N. Descartadas: M." ; fewer than 4 -> "Solo hay N ideas con datos; no se inventa ninguna."
//   rows come from the queue after the merge, so existing proposals are listed even with no exports;
//   zero propuesta ideas -> "Sin ideas propuestas con datos: no hay nada que aprobar."

// scripts/blog-idea-status.mjs
// node scripts/blog-idea-status.mjs <id> <status> [--queue seo/contenido/ideas.json]
//   prints "blog-idea-status: <id> -> <status>"; unknown id or status -> exit 1, file untouched
```

**Data.** New tracked data file `seo/contenido/ideas.json`, starting empty. No schema, site data or settings change; no migration.

**Test plan (TDD order).**

1. `tests/blog-idea-queue.test.js` first (task 1.1): `validateIdea` flags a missing `source.date` (scenario "Entry without a source"); `mergeIdeas` skips a candidate covered by a `rechazada` idea (scenario "Duplicate idea"), by an owner row and by a published post, skips a no-pillar candidate, adds a new one with every field and `status: "propuesta"`, `added: date` (scenario "New idea"); `scoreIdea` exact values for three fixture candidates; `serializeQueue(merge(...))` identical across two runs (scenario "Repeated refresh", pure part); `pickProposals` on six ideas in three pillars returns four covering all three (scenario "Enough data") and on two returns two; `setIdeaStatus` changes one entry and throws on unknown id/status (scenario "Approve an idea", pure part).
2. `tests/blog-ideas-refresh.test.js` first (task 1.2): CLI in a temp dir with `--queue`/`--posts` fixtures: no `--date` exits 1; week-1 export adds ideas and prints four rows; `export-few.json` prints the "Solo hay 2 ideas" line (scenario "Not enough data"); empty queue and no exports prints "Sin ideas propuestas", a queue with proposals and no exports lists them; `--dry-run` leaves the file untouched; second identical run leaves the file byte-identical (scenario "Repeated refresh"); `blog-idea-status.mjs` approve (scenario "Approve an idea"); the repo's `seo/contenido/ideas.json` passes `parseIdeaQueue` (scenario "Valid queue in the repository").
3. `tests/seo-brief-ideas.test.js` and `tests/blog-pipeline-skill.test.js` cases first (task 1.3): brief names `scripts/blog-ideas-refresh.mjs`, "once a week", `maxCallsPerRun`, "at most 6" and "Ideas para el blog" (scenario "Brief instruction"); SKILL.md names `## Step 0`, `seo/contenido/ideas.json`, `scripts/blog-idea-status.mjs` and "aprobada" in the topic step (scenario "Topic from the queue").

**Real-browser / e2e checks.** No page changes. QA runs the refresh on fixtures and on one real saved export with a temporary `--queue`, checks the report section reads well in Spanish and that a second run is a no-op.

**Owner-account actions (executed by the orchestrator).**

- Search Console query export for the weekly refresh: executable owner action (configured service account API, read-only; done by the SEO run, never by the developer).

**ADRs relied on.** ADR 0012 (keyword ownership), ADR 0020 (queue path, scripts rule, owner gates).

## Risks / Trade-offs

- The unattended SEO run cannot commit, so after each weekly refresh `seo/contenido/ideas.json` is modified in the main checkout until the next post branch (skill step 0) or the owner commits it. A pull of `develop` touching the same file could conflict. Alternative for the owner: a weekly `chore` PR for the queue; not chosen because it adds a PR per week for a data file. Flagged to the human in the TL report.
- Scores are heuristics; they only order proposals. Weights live in one function with exact-value tests.
- PAA questions in Spanish vary in wording; NRD-347 coverage catches shorter or longer forms, not paraphrases, so the owner may occasionally see a near-duplicate and reject it (the rejection then blocks its variants).
- The 6-call budget is taken from the existing 30-call cap; on refresh days the daily analysis has 24 calls.

## Dependencies

- Blocked by NRD-345 (folder and README), NRD-347 (reader and de-duplication, which itself needs NRD-346) and NRD-349 (skill). Last story of the chain.
