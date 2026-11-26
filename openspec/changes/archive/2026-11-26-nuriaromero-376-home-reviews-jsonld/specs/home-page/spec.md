## ADDED Requirements

### Requirement: The home reviews structured data mirrors the visible proof

With Google review data, the home SHALL emit one reviews node on the shared business `@id` whose `aggregateRating` matches the visible rating stat, and whose `review` holds at most one `Review`: the quoted review, with the same author, text and rating, chosen by the same rule as the quote. It MUST NOT declare any other review. Without review data, the home SHALL emit no reviews JSON-LD.

#### Scenario: Production build with several reviews

- **WHEN** a production build receives review data with a 4.8 rating, 7 ratings and two reviews, and the home quotes the first review
- **THEN** the home JSON-LD has one node with `aggregateRating` `ratingValue` 4.8 and `reviewCount` 7, the visible stat reads "4,8 en Google" and "7 opiniones", and the node's `review` holds exactly one `Review` whose author, text and rating equal the quoted review

#### Scenario: The second review is not declared

- **WHEN** the same build renders the home
- **THEN** the text of the second review appears neither in the home JSON-LD nor in the home HTML

#### Scenario: Review data without a quotable review

- **WHEN** the review data has a rating but no review to quote
- **THEN** the reviews node carries `aggregateRating` and no `review` key

#### Scenario: No review data

- **WHEN** the build has no Google review data
- **THEN** the home emits no node with `aggregateRating` or `Review`, and shows no rating stat and no review quote

### Requirement: The reviews check passes when the JSON-LD declares only what is visible

`scripts/check-google-reviews.mjs <html>` SHALL exit 0 when every declared `aggregateRating` and `Review` matches the visible rating stat and a visible quote (author, text and rating, after decoding HTML entities and collapsing whitespace), and when the page has JSON-LD without any `aggregateRating` or `Review`. It SHALL NOT depend on the copy of a removed component.

#### Scenario: Production home agrees

- **WHEN** the check runs on the home of the production build with stub reviews
- **THEN** it exits 0

#### Scenario: Quote text with escaped characters

- **WHEN** the quoted review text contains quotes, an apostrophe and an ampersand, escaped as HTML entities in the page and plain in the JSON-LD
- **THEN** it exits 0

#### Scenario: Non-production build

- **WHEN** the check runs on a home built without review data
- **THEN** it exits 0

### Requirement: The reviews check fails when the JSON-LD and the page disagree

The check SHALL exit 1 with a line starting `GOOGLE-REVIEWS:` when the page has no JSON-LD, when more than one node carries `aggregateRating`, when the visible rating stat is missing or shows another average or count, when a `Review` matches no visible quote, or when there are more `Review` entries than visible quotes.

#### Scenario: A not-visible review is declared

- **WHEN** the check runs on a copy of the production home whose JSON-LD `review` array also holds the second, not-quoted review
- **THEN** it exits 1 and the message says the review is not visible on the page

#### Scenario: Rating mismatch

- **WHEN** the JSON-LD `ratingValue` is 4.5 and the visible stat reads "4,8 en Google"
- **THEN** it exits 1 naming both values

#### Scenario: Page without JSON-LD

- **WHEN** the page has no JSON-LD block
- **THEN** it exits 1 with `GOOGLE-REVIEWS: no JSON-LD found`
