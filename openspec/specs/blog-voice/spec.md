# blog-voice Specification

## Purpose
A short, guarded voice guide (`docs/blog-voice.md`) with a 5-10 item checklist that the blog draft step and the review apply, so every post keeps the brand voice and never promises rankings, results or AI mentions.

## Requirements

### Requirement: A voice guide for blog posts exists and is guarded

The repository SHALL contain `docs/blog-voice.md`, based on `PRODUCT.md`, `.agents/product-marketing-context.md` and the PRD principles. It MUST state these rules: `tú`, value before mechanism, jargon explained, no invented or promised figures, testimonials, rankings or AI mentions, direct answer first, one brand string "Nuria Romero" (`SITE.name`) and a close that leads to booking a call.

#### Scenario: Guide present

- **WHEN** the unit suite runs
- **THEN** the voice guide test finds `docs/blog-voice.md` with every rule heading of the guide

#### Scenario: Guide removed

- **WHEN** `docs/blog-voice.md` is deleted
- **THEN** the voice guide test fails

### Requirement: The guide keeps the never-promise-rankings rule

The guide SHALL contain a section `## Never promise rankings` stating that a post never promises a Google position, a guaranteed result or a mention by an AI assistant. A unit test SHALL fail when that section or its rule is removed.

#### Scenario: Rule removed

- **WHEN** the `## Never promise rankings` section is deleted or no longer mentions positions
- **THEN** the voice guide test fails naming the missing rule

### Requirement: The guide ends with a 5 to 10 item checklist

The guide SHALL contain a `## Checklist` section with between 5 and 10 numbered items, each checkable as meets or does not meet on a draft, which the draft step and the review apply.

#### Scenario: Checklist size

- **WHEN** the voice guide test counts the numbered items under `## Checklist`
- **THEN** there are at least 5 and at most 10

### Requirement: A published post is reviewed against the guide without changes

The story's pull request SHALL include the review of one of the published posts against the checklist, with meets or does not meet and a short quote per item, and SHALL NOT modify that post.

#### Scenario: Review in the PR

- **WHEN** the PR is opened
- **THEN** its description holds a table with one row per checklist item for `que-es-geo-posicionamiento-ia-negocios-sevilla`, and the diff does not touch `src/content/blog/`
