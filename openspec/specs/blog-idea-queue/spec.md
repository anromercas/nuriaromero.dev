# blog-idea-queue Specification

## Purpose
A single, versioned blog idea queue (`seo/contenido/ideas.json`) fed weekly from real question and keyword data by a deterministic refresh script: ideas are deduplicated against owned intents and published posts, scored and spread across the service pillars, proposed four at a time for the owner to approve or reject, and used as the input of the blog-pipeline topic step.

## Requirements

### Requirement: One structured idea queue

The repository SHALL hold one idea queue at `seo/contenido/ideas.json` with `version` 1 and an `ideas` array. Each idea MUST have `id`, `question`, `keyword`, `intent`, `volume` (number or null), `difficulty` (number or null), `target`, `pillar`, `score`, `source` with `name` and `date`, `status` and `added`. `status` MUST be one of `propuesta`, `aprobada`, `rechazada`, `en curso`, `publicada`.

#### Scenario: Valid queue in the repository

- **WHEN** the unit suite validates `seo/contenido/ideas.json`
- **THEN** the file parses and every entry has all fields and a known status

#### Scenario: Entry without a source

- **WHEN** an entry has no `source.date`
- **THEN** validation fails naming the entry and the field

### Requirement: The refresh adds only new ideas

`scripts/blog-ideas-refresh.mjs` SHALL add a question-shaped candidate from the saved exports as a `propuesta` idea only when no queued idea of any status, no owned intent and no published post covers it (NRD-347 coverage rule), and only when it fits a pillar. The script SHALL NOT call any API.

#### Scenario: Duplicate idea

- **WHEN** an export holds a question already queued as `rechazada`
- **THEN** the queue does not gain a new entry for it

#### Scenario: New idea

- **WHEN** an export holds a pillar-fitting question that nothing covers
- **THEN** the queue gains one `propuesta` entry with that question, its keyword, pillar, target and dated source

### Requirement: The queue order and output are deterministic

Ideas SHALL be scored with a fixed formula over volume, difficulty, service fit and GEO citability, and the queue file SHALL be serialized in a fixed order, so two refreshes with the same inputs and date produce byte-identical files. The run date SHALL be an argument, never the clock.

#### Scenario: Repeated refresh

- **WHEN** the refresh runs twice with the same exports, queue and `--date`
- **THEN** the second run leaves the queue file byte-identical

### Requirement: Each refresh reports at least four proposals or says why not

The refresh SHALL print a section "Ideas para el blog" with the four best `propuesta` ideas, spread across pillars when possible, each with its question, pillar, volume, target page and source. When fewer than four exist it SHALL say how many there are and that no idea is invented.

#### Scenario: Enough data

- **WHEN** the queue holds six `propuesta` ideas across three pillars
- **THEN** the section lists four, at least one from each of the three pillars

#### Scenario: Not enough data

- **WHEN** the exports and queue yield two `propuesta` ideas
- **THEN** the section lists two and states that there are only two ideas with data and none is invented

### Requirement: The owner's decisions are recorded in the queue

`scripts/blog-idea-status.mjs <id> <status>` SHALL change the status of exactly that idea and SHALL fail for an unknown id or status.

#### Scenario: Approve an idea

- **WHEN** the owner approves idea `que-es-un-chatbot-clinica`
- **THEN** only that entry's status becomes `aprobada`

### Requirement: The refresh runs weekly inside the scheduled SEO run

`.claude/harness/seo.md` SHALL instruct the scheduled SEO run to refresh the queue once a week within `seo.dataforseo.maxCallsPerRun` (at most 6 calls for ideas, no paid service added) and to put the top four proposals in the run report for the owner to approve or reject.

#### Scenario: Brief instruction

- **WHEN** the brief test reads `.claude/harness/seo.md`
- **THEN** it names `scripts/blog-ideas-refresh.mjs`, the weekly cadence, the call budget and the "Ideas para el blog" section

### Requirement: The blog pipeline skill takes its topics from the queue

The `blog-pipeline` skill SHALL start with a step 0 that records the owner's decisions with `scripts/blog-idea-status.mjs`, and its topic step SHALL start from `aprobada` ideas of `seo/contenido/ideas.json`, setting the chosen idea to `en curso` and, after the owner's merge, to `publicada`.

#### Scenario: Topic from the queue

- **WHEN** the skill test reads `SKILL.md`
- **THEN** it finds step 0, `seo/contenido/ideas.json`, `scripts/blog-idea-status.mjs` and the rule that the topic step starts from `aprobada` ideas
