## REMOVED Requirements

### Requirement: The guide adds no price figure

**Reason**: The owner answered decision S-2026-11-13-1 YES on 2026-11-19 (NRD-298): the post may show the published web design rates as a price answer and a table, from the single price source.

**Migration**: Replaced by "The guide answers with my published web design rates" and "Published rates come from the single price source". The NRD-128 guards "no number outside today's set" and "no euro sign or currency word" in `tests/price-post-intent.test.js` become a drift test against `disenoWeb.pricing` in `src/data/services.ts`.

## ADDED Requirements

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
