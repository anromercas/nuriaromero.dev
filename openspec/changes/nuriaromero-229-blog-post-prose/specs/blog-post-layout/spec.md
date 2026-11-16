## MODIFIED Requirements

### Requirement: The post renders in the ink world

The post page SHALL use the template ground, SHALL style headings, paragraphs, lists, tables, links, emphasis, rules, block quotes, inline code, code blocks and images of the body with the template tokens only, and MUST NOT use the old gray styles or `CTASection`. Table cell borders SHALL reach at least 3:1 contrast against the ground and the header cell surface through a shared token. Code blocks SHALL scroll horizontally inside the column and images SHALL never be wider than the column, so the page never overflows horizontally.

#### Scenario: Legacy styles removed

- **WHEN** the layout source is inspected
- **THEN** it uses no `CTASection`, `InternalLinks`, `EntryContentStyles` or gray Tailwind class

#### Scenario: Prose readable on mobile

- **WHEN** a post with a table is viewed at 375 px
- **THEN** the page has no horizontal overflow and body text and links meet WCAG 2.2 AA contrast

#### Scenario: Table borders visible

- **WHEN** the table cell border token is compared with the ink ground and the card surface
- **THEN** both pairs reach at least 3:1, and the table stays readable at 320 px

#### Scenario: Quote, code and image in the ink world

- **WHEN** a post body holds a block quote, inline code, a code block and an image
- **THEN** each is styled with template tokens only, its text (including every syntax-highlight colour of the code block) meets AA contrast, the code block scrolls horizontally inside the column and the image is at most the column width with its aspect ratio kept, with no horizontal page overflow at 320 px

#### Scenario: Post text untouched

- **WHEN** the change is applied
- **THEN** no file under `src/content/blog/` is modified and the post contract baseline still matches

## ADDED Requirements

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
