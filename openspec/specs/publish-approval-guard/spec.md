# publish-approval-guard Specification

## Purpose

Blocks a pull request that publishes a blog post of `src/content/blog/` unless it carries the GitHub label `publish-approved`, which only the owner applies. The guard runs from the trusted base copy of the script and fails closed on any missing input or git error.

## Requirements

### Requirement: The guard lists posts a pull request makes published

`scripts/check-publish-approval.mjs` SHALL list every `src/content/blog/<name>.md` or `.mdx` that is published at the PR head and was not published at the merge base (or did not exist). A post is a draft when its frontmatter has the line `draft: true`, otherwise published. A renamed post SHALL be compared with its previous path; deletions and other folders never count.

#### Scenario: Draft flipped to published

- **WHEN** a PR changes `draft: true` to `draft: false` in `src/content/blog/a.md`
- **THEN** the guard lists `src/content/blog/a.md`

#### Scenario: Draft line removed

- **WHEN** a PR removes the `draft: true` line of `src/content/blog/a.md`
- **THEN** the guard lists `src/content/blog/a.md`

#### Scenario: New post arrives published

- **WHEN** a PR adds `src/content/blog/b.md` without `draft: true`
- **THEN** the guard lists `src/content/blog/b.md`

#### Scenario: No draft change

- **WHEN** a PR adds a post with `draft: true`, edits the body of a draft or of a published post, or renames a published post
- **THEN** the guard lists nothing

### Requirement: Publishing needs the owner's label

The guard SHALL exit with code 1 when it lists at least one post and the PR labels do not include `publish-approved`, printing each listed post path and the missing label name `publish-approved`. It SHALL exit 0 when it lists nothing or when the label is present. It SHALL exit with a non-zero code and a usage message when the base or head commit is missing, so a misconfigured run never passes silently. No script, skill or workflow in the repository SHALL add the `publish-approved` label.

#### Scenario: Published without the label

- **WHEN** the guard lists `src/content/blog/a.md` and the labels are `["pr-approved"]`
- **THEN** it exits 1 and its output names `src/content/blog/a.md` and `publish-approved`

#### Scenario: Published with the label

- **WHEN** the guard lists `src/content/blog/a.md` and the labels include `publish-approved`
- **THEN** it exits 0

#### Scenario: Nothing published, no labels

- **WHEN** the guard lists nothing and the PR has no labels
- **THEN** it exits 0

#### Scenario: Missing commits

- **WHEN** the guard runs without a base or head commit
- **THEN** it exits non-zero with a usage message
