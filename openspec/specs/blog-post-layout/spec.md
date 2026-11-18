# blog-post-layout Specification

## Purpose
Defines what every blog post page `/blog/<slug>/` must show and guarantee on the `/seo-local-sevilla/` template: the post text unchanged, a header with the title as H1, author and dates, readable ink prose, the related links, the booking call and unchanged search signals.

## Requirements

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

### Requirement: The post header keeps title, author and dates

Each post SHALL open, inside its `article`, with the post title as the only H1, the post description, the author linked to `/sobre-mi/`, the publication date and, when present, the update date, each date in a `time` element with its ISO `datetime`.

#### Scenario: Header content

- **WHEN** a built post is read
- **THEN** its `article` holds exactly one H1 equal to the frontmatter title, the description, a link to `/sobre-mi/` reading "Nuria Romero Castillo" and "Publicado el" followed by a `time` element with the publication datetime

#### Scenario: Update date shown only when set

- **WHEN** a post has `updatedDate` in its frontmatter
- **THEN** the header also shows "Actualizado el" with a `time` element for that date, and a post without it shows no update line

### Requirement: The post renders in the ink world

The post page SHALL use the template ground, SHALL style every body element (headings, paragraphs, lists, tables, links, emphasis, rules, block quotes, inline code, code blocks and images) with the template tokens only, and MUST NOT use the old gray styles or `CTASection`.

#### Scenario: Legacy styles removed

- **WHEN** the layout source is inspected
- **THEN** it uses no `CTASection`, `InternalLinks`, `EntryContentStyles` or gray Tailwind class

#### Scenario: Prose readable on mobile

- **WHEN** a post with a table is viewed at 375 px
- **THEN** the page has no horizontal overflow and body text and links meet WCAG 2.2 AA contrast

#### Scenario: Post text untouched

- **WHEN** the change is applied
- **THEN** no file under `src/content/blog/` is modified and the post contract baseline still matches

### Requirement: Related links keep their destinations

Each post SHALL show, after the article, the links mapped for its URL in `internalLinksBySource`, with the same destinations and anchors, through the template related links section.

#### Scenario: Mapped links inside main

- **WHEN** the internal link check runs on a built post
- **THEN** every mapped link of that post is an `a` with the same `href` and anchor text inside `<main>`

### Requirement: The post ends with the booking call

Each post SHALL end with the template closing band holding the booking button, without invented figures or promises of results.

#### Scenario: Closing band with booking

- **WHEN** the end of a built post `<main>` is read
- **THEN** the last section is the closing band with a link to the booking schedule

### Requirement: Search signals and structured data are unchanged

Each post SHALL keep its title, meta description, canonical, Article and BreadcrumbList JSON-LD identical to the post baseline unless a story edits that post on purpose and regenerates its baseline entry in the same commit, SHALL have exactly one H1 and SHALL use trailing-slash internal links.

#### Scenario: Metadata and JSON-LD match the baseline

- **WHEN** the post contract check compares each built post with the baseline
- **THEN** title, meta description, canonical and the Article and BreadcrumbList entities are identical

#### Scenario: Ownership and link checks pass

- **WHEN** the SEO build checks run
- **THEN** each post has one H1, no internal href without trailing slash and no title, H1 or H2 targeting a term owned by another page

### Requirement: Post table borders are visible

Table cell borders of the post body SHALL reach at least 3:1 contrast against the ground and the header cell surface, through a shared token.

#### Scenario: Table borders visible

- **WHEN** the table cell border token is compared with the ink ground and the card surface
- **THEN** both pairs reach at least 3:1, and the table stays readable at 320 px

### Requirement: Post code and images stay inside the column

Code blocks SHALL scroll horizontally inside the column, images SHALL never be wider than the column, and quote and code text SHALL meet AA contrast, so the page never overflows horizontally.

#### Scenario: Quote, code and image in the ink world

- **WHEN** a post body holds a block quote, inline code, a code block and an image
- **THEN** each is styled with template tokens only, its text (including every syntax-highlight colour of the code block) meets AA contrast, the code block scrolls horizontally inside the column and the image is at most the column width with its aspect ratio kept, with no horizontal page overflow at 320 px

### Requirement: The post contract checks the post structure

The post contract check SHALL fail for any built post that does not have exactly one H1, that lacks the related links block with at least one link, or whose closing section does not link to the booking schedule, naming the failed rule.

#### Scenario: Valid post passes

- **WHEN** the contract is computed for a post with one H1, a related links block with links and a closing section linking to the booking schedule
- **THEN** it returns the same contract fields as before (title, description, canonical, Article and BreadcrumbList, body text and links)

#### Scenario: H1 count is wrong

- **WHEN** a post has no H1 or more than one
- **THEN** the check fails reporting that exactly one H1 is required

#### Scenario: Related links block missing

- **WHEN** a post has no related links block, or the block has no link
- **THEN** the check fails reporting the related links block is not found

#### Scenario: Closing without booking link

- **WHEN** a post has no closing section, or its closing section has no link to the booking schedule
- **THEN** the check fails reporting the closing booking link is not found
