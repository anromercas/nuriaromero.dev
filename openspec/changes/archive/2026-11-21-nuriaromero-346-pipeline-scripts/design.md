## Context

- Script pattern: pure helpers in `scripts/lib/*.mjs` that take already-read data, thin CLIs in `scripts/*.mjs` that do the IO (`scripts/lib/keyword-ownership.mjs`, `scripts/check-seo-25.mjs` over `scripts/lib/blog-cover-contract.mjs`). Tests are `tests/*.test.js` with node:test, fixtures under `tests/fixtures/` (ADR 0006). Node 24 strips TypeScript types, so tests import `.ts` files from `src/` directly (`tests/page-freshness.test.js:6`).
- `normaliseTerm(text)` in `scripts/lib/keyword-ownership.mjs:4` lowercases, folds diacritics and collapses non letter/digit runs; it is the project's term normaliser and is reused here.
- Blog schema: `blogSchema(image)` in `src/content/blog-schema.ts` (title, description, `pubDate` coerced date, optional `updatedDate`, optional strict `cover { src: image(), alt: non-blank }`, `tags` default `[]`, `draft` default `false`). `tests/blog-cover-schema.test.js` validates it with a stub image helper. Cover files live in `src/assets/blog/` and are referenced from a post as `../../assets/blog/<file>` (`tests/blog-cover-render.test.js:55`).
- Recorded keyword data today: hand-condensed DataForSEO extracts in `.claude/state/seo/raw/` and question lists in `.claude/state/seo/questions/2026-11-16.md` (untracked runtime state). Their shape is not stable, so the scripts accept a documented normalized format plus the raw DataForSEO API envelope and the raw Search Console response; anything else fails loudly.
- Pillars are the owner's decision of 2026-11-21 (NRD-350 description): SEO (local and GEO), web design and online stores, artificial intelligence, other services (custom software, automations). Target routes come from `keywordOwners` / service pages in `src/data/seo-intents.ts`.

## Goals / Non-Goals

**Goals:** four deterministic, dependency-free scripts with fixture tests; a normalized keyword-data contract the later stories (NRD-347, NRD-350) extend; a scaffold that cannot emit `draft: false`.

**Non-Goals:** de-duplication (NRD-347); the idea queue (NRD-350); the approval gate on `--write` (NRD-349); any API call; `package.json` aliases.

## Decisions

**Approach.** Each script is a pure helper plus a CLI, following the `scripts/lib` pattern, so tests feed fixtures to pure functions and run the CLI with `spawnSync(process.execPath, [...])` on temporary paths. The shortlist only keeps question-shaped topics because the owner wants posts that answer real questions; non-question keywords are counted, not shown. Ordering is a total order with a text tie-break so output is byte-stable. The outline format is a small, line-oriented Spanish markdown file (the owner reads and approves it), parsed with regular expressions outside fenced code. The scaffold returns both the data object (validated against the real `blogSchema` in tests) and the text, rejects any `draft` input and hard-codes `draft: true`. The word count strips markdown syntax and counts Unicode word tokens; it exits non-zero outside a 10 percent band so the skill can gate on it.

**Files (all layer `app`).**

- Create `scripts/lib/outline-lint.mjs`, `scripts/blog-outline-lint.mjs` (task 1.1).
- Create `scripts/lib/word-count.mjs`, `scripts/blog-word-count.mjs` (task 1.2).
- Create `scripts/lib/post-frontmatter.mjs`, `scripts/blog-scaffold.mjs` (task 1.3).
- Create `scripts/lib/keyword-data.mjs`, `scripts/lib/blog-pillars.mjs`, `scripts/lib/topic-shortlist.mjs`, `scripts/blog-shortlist.mjs` (task 1.4).
- Create `tests/blog-outline-lint.test.js`, `tests/blog-word-count.test.js`, `tests/blog-scaffold.test.js`, `tests/blog-shortlist.test.js`.
- Create fixtures under `tests/fixtures/blog-pipeline/`: `esquema-ok.md`, `esquema-two-h1.md`, `esquema-no-h1.md`, `esquema-no-h2.md`, `esquema-no-target.md`, `esquema-no-sources.md`, `esquema-no-answer.md`, `post-sample.md`, `keywords-normalized.json`, `dataforseo-ads-volume.json`, `dataforseo-labs.json`, `dataforseo-serp-paa.json`, `gsc-queries.json`, `unknown-shape.json`.

**Outline format (`esquema.md`).** Every pipeline outline follows it; NRD-349 ships it as a template.

```markdown
# ¿Qué es una ficha de Google y cómo se completa?

- Slug: que-es-una-ficha-de-google
- Palabra clave: que es una ficha de google
- Pregunta: ¿Qué es una ficha de Google?
- Objetivo de palabras: 900
- Estado: pendiente de aprobación

## Respuesta directa

Una o dos frases que responden la pregunta por sí solas.

## Estructura

- H2: Qué es una ficha de Google
- H2: Qué datos debe tener
- H2: Errores frecuentes

## Palabras clave secundarias

- perfil de empresa de google

## Fuentes

- [Ayuda de Perfil de Empresa](https://support.google.com/business/) (consultado 2026-11-21)
```

Rules: exactly one `# ` line outside fences (the post H1); fields are `- Etiqueta: valor` lines before the first `## `; at least one `- H2: <non-empty>` item under `## Estructura`; `Objetivo de palabras` is a positive integer; at least one list item under `## Fuentes` that contains an `http(s)://` URL or a backticked repository path; `## Respuesta directa` has non-blank text. `Estado` is parsed (approval gate in NRD-349) but not linted here.

**Normalized keyword-data format** (the contract NRD-347 and NRD-350 reuse):

```json
{
  "source": "dataforseo:serp-paa",
  "date": "2026-11-16",
  "items": [
    { "kind": "paa", "keyword": "que es el seo local", "question": "¿Qué es el SEO local?", "volume": null, "difficulty": null, "intent": null }
  ]
}
```

`kind` is one of `paa`, `keyword`, `gsc`, `client-question`. Adapters in `normaliseKeywordData(json, { date, file })`:

- normalized: top-level `source` (string), `date` (`YYYY-MM-DD`) and `items` array; items need `keyword` or `question`.
- DataForSEO API envelope `{ tasks: [{ data?, result: [...] }] }`: result entries with `keyword` and `search_volume` (Google Ads volume, `kind: "keyword"`); result entries with `items[]` holding `keyword_info.search_volume`, `keyword_properties.keyword_difficulty`, `search_intent_info.main_intent` (Labs, `kind: "keyword"`); result entries with `items[]` of `type: "people_also_ask"` whose `items[].title` are questions (SERP, `kind: "paa"`, keyword = `normaliseTerm(title)`). `source` = `dataforseo:` + `tasks[0].data.function` when present, else `dataforseo`; `date` = the `date` option, else the first 10 characters of `result[0].datetime`; neither: throw.
- Search Console response `{ rows: [{ keys: [query, ...], impressions }] }`: `kind: "gsc"`, `volume: null`, `impressions` kept; requires the `date` option, else throw.
- Anything else: throw `Error("unknown keyword-data shape: <file>")`.

`isQuestion(text)`: true when the text contains `¿` or `?`, or its normalized form starts with one of `que`, `como`, `cuanto`, `cuanta`, `cuantos`, `cuantas`, `cual`, `cuales`, `cuando`, `donde`, `por que`, `quien`, `quienes`, `para que`, `es`, `se puede`, `puedo`, `merece la pena`, `vale la pena`. A question-shaped keyword without marks gets `question = "¿" + capitalised keyword + "?"`.

**Pillar rules** (`PILLAR_RULES`, ordered, first match wins; terms match whole normalized words or word sequences):

| # | Pillar | Target | Terms |
| --- | --- | --- | --- |
| 1 | `seo` | `/seo-para-ia/` | geo, aeo, chatgpt, gemini, perplexity, copilot, ai overview, ai overviews, seo para ia, posicionamiento en ia, respuestas de ia, buscadores de ia |
| 2 | `seo` | `/seo-local-sevilla/` | seo, posicionamiento, posicionar, google maps, ficha de google, perfil de empresa, google business, resenas, buscador, buscadores |
| 3 | `web` | `/tienda-online-sevilla/` | tienda online, tiendas online, ecommerce, comercio electronico, woocommerce, shopify, vender por internet, vender online |
| 4 | `servicios` | `/automatizaciones/` | automatizar, automatizacion, automatizaciones, automatico, flujos de trabajo, n8n, zapier |
| 5 | `servicios` | `/desarrollo-software-medida/` | software a medida, aplicacion a medida, aplicacion web, aplicaciones web, app a medida, crm, erp, programa a medida |
| 6 | `ia` | `/inteligencia-artificial/` | inteligencia artificial, ia, chatbot, chatbots, asistente virtual, agente de ia, agentes de ia |
| 7 | `web` | `/diseno-web-sevilla/` | pagina web, paginas web, web, sitio web, diseno web, dominio, hosting, landing |

`PILLARS = [{ id: "seo", label: "SEO local y GEO" }, { id: "web", label: "Diseño web y tiendas online" }, { id: "ia", label: "Inteligencia artificial" }, { id: "servicios", label: "Software a medida y automatizaciones" }]`.

**Interfaces.**

```js
// scripts/lib/outline-lint.mjs
export function parseOutline(markdown: string): {
  h1: string[]; fields: Record<string, string>;
  slug: string | null; keyword: string | null; question: string | null;
  wordTarget: number | null; status: string | null;
  directAnswer: string; h2: string[]; sources: string[];
};
export function lintOutline(markdown: string): { ok: boolean; errors: string[] };
// CLI: node scripts/blog-outline-lint.mjs <esquema.md>
//   exit 0 + "blog-outline-lint: OK <path>"; exit 1 + one "blog-outline-lint: <error>" line per error; exit 2 on usage errors.

// scripts/lib/word-count.mjs
export function stripFrontmatter(markdown: string): string;
export function countWords(markdown: string): number; // body only; tokens /[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu
export function compareToTarget(count: number, target: number, tolerance = 0.1):
  { count: number; target: number; min: number; max: number; status: "under" | "within" | "over" };
  // min = Math.round(target * (1 - tolerance)), max = Math.round(target * (1 + tolerance)), inclusive
// CLI: node scripts/blog-word-count.mjs <post.md> (--outline <esquema.md> | --target <n>)
//   prints "blog-word-count: 812 words, target 900 (810-990): within"; exit 1 when under/over; exit 2 on usage errors.

// scripts/lib/post-frontmatter.mjs
export const COVER_EXTENSIONS: readonly string[]; // ["jpg", "jpeg", "png", "webp", "avif"]
export function buildPostFrontmatter(input: {
  slug: string; title: string; description: string; pubDate: string; // YYYY-MM-DD, a real date
  tags?: string[]; cover: { file: string; alt: string }; // file = basename under src/assets/blog/
}): { data: { title; description; pubDate; tags; cover: { src: string; alt: string }; draft: true }; text: string };
// throws on: slug not /^[a-z0-9]+(?:-[a-z0-9]+)*$/, blank title/description, invalid pubDate,
// missing cover, cover.file with a slash or unsupported extension, blank alt, any "draft" key in input.
// text: "---\n" + title/description/pubDate/tags/cover lines (strings via JSON.stringify,
// cover as a nested block "cover:\n  src: ...\n  alt: ...") + "draft: true\n---\n"
// CLI: node scripts/blog-scaffold.mjs --slug <s> --title <t> --description <d> --date <YYYY-MM-DD>
//        --cover <file> --alt <text> [--tags a,b] [--write] [--root <dir>]
//   without --write: prints text + "\n" to stdout, writes nothing.
//   with --write: requires <root>/src/assets/blog/<file>; refuses if <root>/src/content/blog/<slug>.md exists;
//   writes text + "\n" and prints "blog-scaffold: wrote src/content/blog/<slug>.md". Errors exit 1.

// scripts/lib/keyword-data.mjs
export type KeywordItem = { kind: "paa" | "keyword" | "gsc" | "client-question"; keyword: string;
  question: string | null; volume: number | null; difficulty: number | null; intent: string | null;
  impressions?: number | null };
export function normaliseKeywordData(json: unknown, options?: { date?: string; file?: string }):
  { source: string; date: string; items: KeywordItem[] };
export function isQuestion(text: string): boolean;

// scripts/lib/blog-pillars.mjs
export const PILLARS: readonly { id: "seo" | "web" | "ia" | "servicios"; label: string }[];
export const PILLAR_RULES: readonly { pillar: string; target: string; terms: readonly string[] }[];
export function classifyTopic(text: string): { pillar: string; target: string } | null;

// scripts/lib/topic-shortlist.mjs
export type Candidate = { key: string; question: string; keyword: string; kind: KeywordItem["kind"];
  volume: number | null; difficulty: number | null; intent: string | null;
  pillar: string | null; target: string | null; fit: 0 | 1; sources: { name: string; date: string }[] };
export function shortlistTopics(datasets: ReturnType<typeof normaliseKeywordData>[], options?: { limit?: number }):
  { candidates: Candidate[]; skipped: { notQuestion: number } };
// key = normaliseTerm(question); merge keeps max volume, min difficulty, first non-null intent,
// kind priority client-question > paa > gsc > keyword, sources sorted by date then name.
// order: fit desc, volume desc (null last), difficulty asc (null last), question localeCompare("es").
// CLI: node scripts/blog-shortlist.mjs <export.json>... [--date YYYY-MM-DD] [--limit 10] [--json]
//   markdown table: | # | Pregunta | Palabra clave | Volumen | Dificultad | Pilar | Página destino | Fuente |
//   then "Sin forma de pregunta: N"; "sin dato" for null numbers. Exit 1 on any unreadable or unknown export.
```

**Data.** No schema, storage or settings change. No migration. Fixtures only under `tests/fixtures/blog-pipeline/`.

**Test plan (TDD order).** Each test file is written first and observed RED before its implementation.

1. `tests/blog-outline-lint.test.js` (task 1.1): `esquema-ok.md` passes; each broken fixture yields its error (scenarios "Two H1", "No H1", "No sources", "No H2 list or word target"; plus empty direct answer); a `#` line inside a fenced block is not an H1; `parseOutline` returns slug, wordTarget 900 and status; CLI exit codes 0/1 via `spawnSync` (scenario "Valid outline").
2. `tests/blog-word-count.test.js` (task 1.2): frontmatter ignored (scenario "Frontmatter ignored"); code fence, link URL and image excluded, link text counted; "página-web" and "información" one word each; `compareToTarget` 812/900 within, 700 under, 1000 over (scenarios "Within range", "Under target"); CLI with `--outline tests/fixtures/blog-pipeline/esquema-ok.md` and with `--target`.
3. `tests/blog-scaffold.test.js` (task 1.3): `blogSchema(() => z.string())` parses `data` (import `z` from `astro/zod` like `tests/blog-cover-schema.test.js`); text matches `/^draft: true$/m` and not `/draft:\s*false/` (scenario "Valid scaffold"); `draft: false` and `draft: true` inputs both throw (scenario "Draft false requested"); invalid slug, blank alt, `.gif` cover, bad date throw; CLI without `--write` writes nothing in a temp `--root` (scenario "Print only"); with `--write` writes the file when the cover exists, refuses when the post exists (scenario "Write refused over an existing post") or the cover is missing.
4. `tests/blog-shortlist.test.js` (task 1.4): each fixture shape normalizes (source, date, items); `unknown-shape.json` throws and the CLI exits 1 (scenario "Unknown export shape"); Search Console without date throws; non-question keyword skipped and counted (scenario "Non-question keyword"); duplicate merged with max volume and two sources (scenario "Duplicate across exports"); mixed exports produce the expected order and fields (scenario "Candidates from mixed exports"); two CLI runs give identical stdout (scenario "Deterministic order"); `classifyTopic` cases for every rule row, including "¿Cómo hago que ChatGPT recomiende mi negocio?" -> `seo` `/seo-para-ia/`, "¿Qué es una aplicación web?" -> `servicios`, and "¿Qué tiempo hace en Sevilla?" -> null (scenarios "GEO question", "Unrelated question").

Fakes/fixtures: JSON and markdown fixtures only; temp directories via `mkdtemp(join(tmpdir(), "nrd-blog-"))` removed in `after`.

**Real-browser / e2e checks.** None: no page, layout or asset changes. QA runs each CLI once on the fixtures and on the real `.claude/state/seo/questions` data converted to the normalized format, and checks `pnpm build`.

**ADRs relied on.** ADR 0006 (node:test, TDD), ADR 0012 (target routes are owner pages), ADR 0019 (cover path convention), ADR 0020 (scripts over model steps; written in NRD-345's branch).

## Risks / Trade-offs

- The real DataForSEO MCP responses may differ from the documented API envelope. Mitigation: unknown shapes fail loudly; the SEO strategist can always save the normalized format, which is the stable contract.
- Keyword pillar rules are heuristic (for example "web" is broad and placed last). They only order candidates and suggest a target; the owner still picks the topic. Rule changes are data edits in `scripts/lib/blog-pillars.mjs` with a test row each.
- The scaffold's YAML is emitted by hand for a fixed set of keys; `JSON.stringify` strings are valid YAML double-quoted scalars, so titles with quotes or colons stay safe.
- Tests import `astro/zod` (already used by `tests/blog-cover-schema.test.js`); no new dependency.
