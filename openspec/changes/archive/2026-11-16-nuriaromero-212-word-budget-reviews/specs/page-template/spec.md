## ADDED Requirements

### Requirement: Word budget excludes live third-party content

The template page word count in `<main>` MUST NOT include the text inside any element marked with the attribute `data-word-budget="exclude"`, so a page measures the same with and without that live third-party content. The live Google review quote of the real proof section SHALL carry that marker on its whole block.

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
