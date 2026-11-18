## MODIFIED Requirements

### Requirement: The post text is unchanged by the layout

The visible text and the links of the body of every post SHALL be identical to those in the post baseline, measured on the element that wraps the rendered Markdown and excluding header, related links and closing. The layout SHALL never change them; a story that edits a post's Markdown on purpose SHALL regenerate the baseline in the same commit, and only the edited post's entry may change.

#### Scenario: Body text and links match the baseline

- **WHEN** the post contract check compares each built post with the baseline
- **THEN** the visible body text and the list of body link destinations and texts are identical for every post

#### Scenario: Markdown sources untouched

- **WHEN** a change modifies only the layout or its components
- **THEN** no file under `src/content/blog/` is modified by that change

#### Scenario: Intentional post edit regenerates the baseline

- **WHEN** a story changes the Markdown of a post
- **THEN** the same commit regenerates the baseline, and the baseline diff touches only that post's entry

### Requirement: Search signals and structured data are unchanged

Each post SHALL keep its title, meta description, canonical, Article and BreadcrumbList JSON-LD identical to the post baseline unless a story edits that post on purpose and regenerates its baseline entry in the same commit, SHALL have exactly one H1 and SHALL use trailing-slash internal links.

#### Scenario: Metadata and JSON-LD match the baseline

- **WHEN** the post contract check compares each built post with the baseline
- **THEN** title, meta description, canonical and the Article and BreadcrumbList entities are identical

#### Scenario: Ownership and link checks pass

- **WHEN** the SEO build checks run
- **THEN** each post has one H1, no internal href without trailing slash and no title, H1 or H2 targeting a term owned by another page
