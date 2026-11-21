## Context

- NRD-346 (merged before this story) provides `scripts/blog-shortlist.mjs` over `shortlistTopics(datasets)` in `scripts/lib/topic-shortlist.mjs`, whose `Candidate` has `key`, `question`, `keyword`, `pillar`, `target`, `sources` (see `openspec/changes/nuriaromero-346-pipeline-scripts/design.md` on its branch, or the archived change).
- Ownership data: `keywordOwners` (12 rows `{ keyword, url }`) and `intentMatrix` (rows with `url`, `topic`, `h1Signal`) in `src/data/seo-intents.ts`, ADR 0012. The file has only erasable TypeScript (interfaces and consts), so scripts and tests import it directly under Node 24 type stripping.
- `normaliseTerm` in `scripts/lib/keyword-ownership.mjs:4` is the project normaliser (lowercase, no diacritics, punctuation collapsed).
- Published posts: 4 files in `src/content/blog/`, none with `draft: true` today. Titles are the most specific statement of the question each post answers. Draft detection follows `tests/blog-index-template.test.js:77` (`/^draft:\s*true\s*$/m` on the frontmatter).
- Queue: `seo/contenido/ideas.json` is fixed by NRD-345/ADR 0020 and created by NRD-350. This story needs only to read it; it defines the minimal reader so the shortlist does not depend on NRD-350.

## Goals / Non-Goals

**Goals:** deterministic, explainable drops for the three rules of the story; a reason for each drop the owner can read; a minimal queue reader that NRD-350 extends without breaking.

**Non-Goals:** writing the queue; semantic similarity; editing ownership rows; drops based on `propuesta`/`aprobada` ideas (those are the owner's live choices).

## Decisions

**Approach.** Coverage works on token sets: `topicTokens(text)` = `normaliseTerm(text)` split on spaces, minus a fixed Spanish stopword list (articles, prepositions, conjunctions, possessives and clitics; interrogatives and verbs are kept because "qué es" and "cuánto cuesta" change the question), unique and sorted. `coveredBy(candidate, reference)` is true when every reference token is in the candidate (the reference is a head term inside a longer question) or every candidate token is in the reference (the candidate is a shorter form of an owned or answered topic), with at least two tokens on the contained side so a one-word overlap never drops anything. The candidate is tested with both its question and its keyword. Checks run in a fixed order (owned intent, published post, queued idea) and the first match is the reason, so output is stable. Pure functions take all data as arguments; the CLI does the IO.

**Stopwords** (`STOPWORDS`): a, al, con, de, del, el, en, la, las, lo, los, mi, mis, o, para, por, se, su, sus, te, tu, tus, u, un, una, unas, unos, y.

**Files (all layer `app`).**

- Create `scripts/lib/topic-dedup.mjs` (task 1.1; `queued-idea` added in task 1.2).
- Create `scripts/lib/blog-posts.mjs` (task 1.1).
- Create `scripts/lib/idea-queue.mjs` (task 1.2; NRD-350 extends it).
- Modify `scripts/blog-shortlist.mjs` (task 1.2).
- Create `tests/blog-topic-dedup.test.js` (task 1.1) and `tests/blog-shortlist-dedup.test.js` (task 1.2).
- Create fixtures `tests/fixtures/blog-pipeline/dedup/owners.json` (`{ keywordOwners, intentMatrix }` subset), `tests/fixtures/blog-pipeline/dedup/posts/` (`publicado.md`, `borrador.md` with `draft: true`), `tests/fixtures/blog-pipeline/dedup/ideas.json`, `tests/fixtures/blog-pipeline/dedup/keywords.json` (normalized export with one candidate per rule plus a free one).

**Interfaces.**

```js
// scripts/lib/topic-dedup.mjs
export const STOPWORDS: ReadonlySet<string>;
export function topicTokens(text: string): string[];
export function coveredBy(candidateText: string, referenceText: string): boolean;
export type DropReason =
  | { kind: "owned-intent"; ref: string /* owner url */; detail: string /* keyword or topic */ }
  | { kind: "published-post"; ref: string /* /blog/<slug>/ */; detail: string /* post title */ }
  | { kind: "queued-idea"; ref: string /* idea id */; detail: string /* idea status */ };
export const BLOCKING_STATUSES: readonly string[]; // ["rechazada", "en curso", "publicada"]
export function dedupeCandidates(candidates: Candidate[], context: {
  owners: { keyword: string; url: string }[];
  intents: { url: string; topic: string }[];
  posts: { slug: string; title: string; draft: boolean }[];
  queue?: { ideas: { id: string; question: string; keyword: string; status: string }[] };
  blockingStatuses?: readonly string[]; // default BLOCKING_STATUSES; NRD-350 passes all statuses
}): { kept: Candidate[]; dropped: { candidate: Candidate; reason: DropReason }[] };
export function describeReason(reason: DropReason): string; // Spanish, for the CLI
// "Intención con página propietaria: /seo-local-sevilla/ («seo local sevilla»)"
// "Ya respondida por el post publicado /blog/<slug>/"
// "Ya en la cola como «rechazada» (<id>)"

// scripts/lib/blog-posts.mjs
export async function readPosts(dir: string): Promise<{ slug: string; title: string; draft: boolean }[]>;
// .md/.mdx files, frontmatter /^---\r?\n([\s\S]*?)\r?\n---/, title from /^title:\s*(.+)$/m (quotes stripped), sorted by slug

// scripts/lib/idea-queue.mjs (minimal contract; NRD-350 adds the full entry shape and writers)
export const IDEA_STATUSES: readonly string[]; // ["propuesta", "aprobada", "rechazada", "en curso", "publicada"]
export const DEFAULT_QUEUE_PATH: "seo/contenido/ideas.json";
export function parseIdeaQueue(json: unknown): { version: 1; ideas: { id: string; question: string; keyword: string; status: string }[] };
// throws "idea queue: version must be 1" or "idea queue: entry <i>: <field> ..." (id, question, keyword non-empty strings; status in IDEA_STATUSES)
export async function readIdeaQueue(path: string): Promise<ReturnType<typeof parseIdeaQueue>>; // ENOENT -> { version: 1, ideas: [] }

// scripts/blog-shortlist.mjs (modified)
// node scripts/blog-shortlist.mjs <export.json>... [--date D] [--limit N] [--json]
//   [--queue seo/contenido/ideas.json] [--posts src/content/blog]
// imports { keywordOwners, intentMatrix } from "../src/data/seo-intents.ts";
// after the candidate table prints "### Descartadas" + "| Pregunta | Motivo |" (or "Ninguna"); --json adds "dropped".
```

**Data.** No schema, storage or settings change; no migration. The queue file is read only.

**Test plan (TDD order).**

1. `tests/blog-topic-dedup.test.js` first (task 1.1, RED: module missing):
   - `topicTokens("¿Cuánto cuesta el SEO local en Sevilla?")` equals `["cuanto", "cuesta", "local", "seo", "sevilla"]`.
   - `coveredBy` true for head term inside question, true for short candidate inside a title, false for a one-token overlap, false for unrelated topics.
   - Owned head term dropped with `owned-intent` and `/seo-local-sevilla/` (scenario "Owned head term"); an `intentMatrix` topic drop.
   - Published post dropped with `published-post` (scenario "Published post"), using real titles via `readPosts("src/content/blog")` for one case and the fixture posts for the draft case (scenario "Draft post does not block").
   - Free idea kept (scenario "Free idea kept").
2. `tests/blog-shortlist-dedup.test.js` first (task 1.2):
   - `parseIdeaQueue` accepts the fixture, throws on version 2 and on status `pendiente` with the entry index (scenario "Malformed queue"); `readIdeaQueue` on a missing path returns an empty queue.
   - `dedupeCandidates` drops for `rechazada`, `en curso`, `publicada` (scenario "Rejected idea") and keeps for `propuesta`, `aprobada` (scenario "Approved idea is not a drop").
   - CLI on `dedup/keywords.json` with `--queue` and `--posts` fixtures: candidate table holds the free idea; "Descartadas" has one row per rule with the Spanish reason (scenario "Reasons printed"); `--json` has `dropped` with three entries; malformed queue exits non-zero.

**Real-browser / e2e checks.** None: no page changes. QA runs `node scripts/blog-shortlist.mjs` on the fixtures and on one real export, and checks the reasons read naturally in Spanish.

**ADRs relied on.** ADR 0012 (keyword ownership), ADR 0020 (pipeline rules; NRD-345 branch), ADR 0006 (tests).

## Risks / Trade-offs

- Token coverage can miss paraphrases ("precio de una web" vs "cuánto cuesta una página web") and keep a near-duplicate; the owner still approves each topic, and NRD-350 de-duplicates the queue with the same function. Over-dropping is limited by the two-token minimum.
- `intentMatrix` topics of out-of-focus niche pages also drop candidates; that is intended (they are owned pages even if parked).
- If NRD-350 renames queue fields, it must keep `id`, `question`, `keyword`, `status`, which this reader requires.

## Dependencies

- Blocked by NRD-346 (shortlist, `Candidate`). Blocks NRD-349 (skill topic step) and NRD-350 (queue merge uses `dedupeCandidates` with all statuses).
