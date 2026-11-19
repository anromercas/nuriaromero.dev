# web-price-guide-post Specification

## Purpose

Defines what the web prices guide `/blog/cuanto-cuesta-una-pagina-web-en-sevilla/` guarantees as the owner of the term `cuanto cuesta una pagina web en sevilla`: the term in title, H1 and description, direct answers that open each section, no price figure while the published price lives only on `/diseno-web-sevilla/`, a pointer to that page, a real update date, and measured SERP and competitor evidence behind any content change.

## Requirements

### Requirement: The guide works its registered term

The post `/blog/cuanto-cuesta-una-pagina-web-en-sevilla/` SHALL keep its title and H1 working `cuanto cuesta una pagina web en sevilla` and SHALL have a meta description of at most 160 characters that also works the term. Its `intentMatrix` signals (title, description, H1 and the content headings "Qué debo revisar en una propuesta económica" and "Qué preguntas debo hacer antes de contratar") SHALL appear in the built post.

#### Scenario: Term in title, H1 and description

- **WHEN** the intent test reads the post frontmatter
- **THEN** the normalised title and description each contain "cuanto cuesta una pagina web" and "sevilla", and the description has at most 160 characters and contains the row's `descriptionSignal`
- **AND** the test fails on the description published before this change

#### Scenario: Intent signals in the built post

- **WHEN** the intent check runs on the built site
- **THEN** the post title, description, H1 and both content headings contain their signals

### Requirement: Every section opens with a direct answer

Each H2 section of the post SHALL open with a paragraph (not a list or table) of one or two sentences and 15 to 45 words that answers the heading's question on its own.

#### Scenario: Leads measured on the Markdown

- **WHEN** the intent test reads each H2 section of the post
- **THEN** its first block is a paragraph of one or two sentences and 15 to 45 words
- **AND** the test fails on the post published before this change

### Requirement: New sections close a measured gap

The post SHALL add at most two new H2 sections, each only for a subtopic listed as a gap in the recorded competitor sample (covered by at least two measured competitors, or present in the People Also Ask) and not answered by the post; new sections SHALL be qualitative and SHALL NOT be added to reach a word count.

#### Scenario: Gap section added

- **WHEN** a new H2 appears in the post
- **THEN** its subtopic is in the gap list of the "Dato observado (NRD-128)" entry and the section contains no price figure

#### Scenario: No measured sample

- **WHEN** the competitor sample could not be measured
- **THEN** no new H2 section is added and no length target is set

### Requirement: The guide links to its hub and makes no promise

The post body SHALL keep a contextual link to `/diseno-web-sevilla/` with the trailing slash, the reciprocal pair with `/diseno-web-sevilla/` SHALL hold, and every sentence that mentions a guarantee SHALL be negated.

#### Scenario: Hub link and pair

- **WHEN** the intent test reads the post and the link map
- **THEN** the body links to exactly `/diseno-web-sevilla/` and the pair holds in both directions

#### Scenario: Guarantees only in negative form

- **WHEN** the intent test scans each sentence of the body containing "garantiz"
- **THEN** the sentence also contains a negation ("no", "ninguna", "ningún", "nadie" or "sin")

### Requirement: The update date reflects the real content change

The post SHALL carry an `updatedDate` equal to the date of the commit that changes its content, not earlier than `pubDate` and not later than the build date; the "Actualizado el" label, `Article.dateModified` and the sitemap `lastmod` SHALL show it.

#### Scenario: Update date set and coherent

- **WHEN** the intent test reads the frontmatter
- **THEN** `updatedDate` exists, is on or after `pubDate` and is not in the future

#### Scenario: Built dates agree

- **WHEN** the freshness check runs on the built post
- **THEN** the "Actualizado el" `time` element, `Article.dateModified` and the sitemap `lastmod` carry the same date

### Requirement: The edit is backed by recorded evidence

Before the content changes, the keyword cluster study SHALL hold a dated, measured competitor sample for `cuanto cuesta una pagina web en sevilla`, and figures that could not be measured SHALL be recorded as "sin dato" with their reason.

#### Scenario: Evidence committed first

- **WHEN** the change reaches review
- **THEN** a "Dato observado (NRD-128, <date>)" entry is committed before the content commit, with the ranking domains and page types, the People Also Ask questions, the main-content word count of the measured pages and their median, the post's body word count, a subtopic coverage table and a gap list

### Requirement: CWV are measured before and after the edit

The CWV record SHALL hold the median of three Lighthouse mobile runs of the post before the content change and after it.

#### Scenario: CWV before and after

- **WHEN** the change reaches review
- **THEN** the CWV record shows LCP, CLS, TBT and the LCP element of the post before and after the change

### Requirement: The guide answers with my published web design rates

The post's opening paragraph and the lead paragraph of its "Respuesta corta" section SHALL answer the price question with the "desde" price of every tier of `disenoWeb.pricing.tiers`, presented as "mis tarifas" and never as a market price, and SHALL state the date the rates are current as the long Spanish form of the post's `updatedDate`.

#### Scenario: Price answer first

- **WHEN** the intent test reads the opening paragraph of the body and the lead paragraph of "Respuesta corta"
- **THEN** each contains "mis tarifas", the `from` value of every tier of `disenoWeb.pricing.tiers` and the long Spanish form of `updatedDate` (for example "19 de noviembre de 2026")
- **AND** the "Respuesta corta" lead still passes the direct-answer rule (one paragraph, one or two sentences, 15 to 45 words)
- **AND** the test fails on the post published before this change

### Requirement: The short answer holds a rates table and no contradiction

Directly after its lead paragraph, the "Respuesta corta" section SHALL hold a Markdown table with one row per tier of `disenoWeb.pricing.tiers` in source order and the columns tier name, "Desde <from>" and what it includes. The post SHALL NOT contain a sentence claiming that it gives no figures unless the sentence limits the claim to market figures ("cifras de mercado").

#### Scenario: Rates table

- **WHEN** the intent test parses the first Markdown table of the "Respuesta corta" section
- **THEN** it has one data row per tier, in the order of `disenoWeb.pricing.tiers`, whose cells are the tier `name`, `Desde <from>` and the tier `includes` joined with "; "
- **AND** its delimiter row right-aligns the price column and no other column

#### Scenario: No contradiction with the table

- **WHEN** the intent test scans the sentences of the body that say "no da", "no doy" or "no hay" followed by "cifra" or "cifras"
- **THEN** every such sentence contains "de mercado"

#### Scenario: Table readable on a phone

- **WHEN** QA opens the built post at 375 px
- **THEN** the rates table is readable without horizontal page overflow and the "Respuesta corta" heading, lead and table appear in that order
- **AND** each price cell ("Desde 149 €", "Desde 399 €") stays on one line while the name and "Qué incluye" cells wrap

#### Scenario: Right-aligned table cells do not wrap

- **WHEN** a post table has a right-aligned column (`---:`), rendered as `th`/`td` with `align="right"`
- **THEN** `src/layouts/BlogPostLayout.astro` applies `white-space: nowrap` to those cells only, so tables without aligned columns keep wrapping in every cell

### Requirement: Published rates come from the single price source

Every euro amount in the post body SHALL be the `from` value of a tier of `disenoWeb.pricing.tiers` in `src/data/services.ts`, and every number of three or more digits in the body (outside link URLs and list markers) SHALL be the amount of one of those tiers or the year of `updatedDate`. The body SHALL NOT use the words "euro", "euros" or "EUR". A change of a tier price, name or included item in `src/data/services.ts` without the same change in the post SHALL fail the unit tests.

#### Scenario: Drift between post and source fails

- **WHEN** a tier `from`, `name` or `includes` item in `disenoWeb.pricing.tiers` differs from the post's table or price answer
- **THEN** `node --test tests/price-post-intent.test.js` fails naming the differing tier

#### Scenario: Foreign figure fails

- **WHEN** the body contains a euro amount that is not a tier `from` value (for example "800 €"), a currency word, or a number of three or more digits that is neither a tier amount nor the year of `updatedDate` (for example "5.000")
- **THEN** the intent test fails listing the offending figures
