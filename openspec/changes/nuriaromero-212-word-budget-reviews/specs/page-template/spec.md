## MODIFIED Requirements

### Requirement: Template pages meet their contract at build time

Every page registered as a template page SHALL pass a build-time check of its contract: visible word count in `<main>` inside its declared range when one is declared, visible FAQ questions equal to the FAQPage questions in the same order, and a Service entity present or absent as declared. The word count MUST NOT include the text inside any element marked as live third-party content with the attribute `data-word-budget="exclude"`, so a page measures the same with and without that content; the live Google review quote of the real proof section SHALL carry that marker on its whole block (quote text, stars, author, date and link to Google).

#### Scenario: FAQ and structured data diverge

- **WHEN** a registered page shows a question that the FAQPage does not list, or the reverse
- **THEN** the template page check fails naming the page and the question

#### Scenario: Word count over the target

- **WHEN** a registered page has more visible words in `<main>` than its declared maximum
- **THEN** the template page check fails with the measured count and the range

#### Scenario: Unexpected Service entity

- **WHEN** a page declared without Service emits a Service entity
- **THEN** the template page check fails

#### Scenario: Same count with and without the review quote

- **WHEN** the word count of a page `<main>` that holds the marked review quote is compared with the count of the same `<main>` without the quote
- **THEN** both counts are identical

#### Scenario: Text outside the marker is counted

- **WHEN** a page `<main>` holds text before and after a marked element
- **THEN** every word outside the marked element is counted and none inside it

#### Scenario: Review quote carries the marker

- **WHEN** the real proof section renders a live Google review
- **THEN** the review quote block, including its text, stars, author, relative date and link to Google, carries the `data-word-budget="exclude"` marker

#### Scenario: Delivered pages keep their ranges

- **WHEN** the site is built without Google Places variables and the template page check runs
- **THEN** every registered page passes with its range and copy unchanged and the reference page renders unchanged
