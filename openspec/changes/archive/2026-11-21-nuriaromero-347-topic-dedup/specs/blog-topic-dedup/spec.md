## ADDED Requirements

### Requirement: Topics owned by a page are dropped

The shortlist SHALL drop a candidate whose question or keyword is covered by a `keywordOwners` keyword or an `intentMatrix` topic in `src/data/seo-intents.ts` (ADR 0012). Coverage SHALL be decided by `coveredBy` on normalized tokens without stopwords: the reference's tokens are all in the candidate, or the candidate's tokens are all in the reference, each direction requiring at least two tokens on the contained side.

#### Scenario: Owned head term

- **WHEN** a candidate is "¿Cuánto cuesta el SEO local en Sevilla?" and `keywordOwners` has `seo local sevilla` owned by `/seo-local-sevilla/`
- **THEN** the candidate is dropped with reason `owned-intent` referencing `/seo-local-sevilla/` and the keyword

### Requirement: Topics already answered by a published post are dropped

The shortlist SHALL drop a candidate covered by the title of a post in `src/content/blog/` whose frontmatter does not set `draft: true`. Draft posts SHALL NOT cause a drop.

#### Scenario: Published post

- **WHEN** a candidate is "¿Cuánto cuesta una página web?" and the published post `cuanto-cuesta-una-pagina-web-en-sevilla` is titled "¿Cuánto cuesta una página web en Sevilla? ..."
- **THEN** the candidate is dropped with reason `published-post` referencing `/blog/cuanto-cuesta-una-pagina-web-en-sevilla/`

#### Scenario: Draft post does not block

- **WHEN** the only post covering a candidate has `draft: true`
- **THEN** the candidate is kept

### Requirement: Settled queued ideas are dropped

The shortlist SHALL drop a candidate covered by the question or keyword of an idea in the queue (`seo/contenido/ideas.json` by default) whose status is `rechazada`, `en curso` or `publicada`. Ideas with status `propuesta` or `aprobada` SHALL NOT cause a drop. A missing queue file SHALL count as an empty queue; a malformed queue SHALL fail naming the entry.

#### Scenario: Rejected idea

- **WHEN** the queue holds "¿Cuánto cobra un SEO al mes?" with status `rechazada` and a candidate asks the same question
- **THEN** the candidate is dropped with reason `queued-idea` referencing the idea id and status

#### Scenario: Approved idea is not a drop

- **WHEN** the matching queued idea has status `aprobada`
- **THEN** the candidate is kept

#### Scenario: Malformed queue

- **WHEN** a queue entry has the status `pendiente`
- **THEN** the shortlist exits non-zero naming the entry index

### Requirement: Every drop states its reason and free topics are kept

The shortlist output SHALL list every dropped candidate with its reason in Spanish (owner page, published post or queued idea with its status), and SHALL keep every candidate that no rule covers.

#### Scenario: Free idea kept

- **WHEN** a candidate "¿Qué es un chatbot para una clínica?" is not covered by any owner, post or settled idea
- **THEN** it stays in the candidate list and the "Descartadas" table does not mention it

#### Scenario: Reasons printed

- **WHEN** the shortlist drops three candidates, one per rule
- **THEN** the "Descartadas" table has three rows, each with the question and its reason
