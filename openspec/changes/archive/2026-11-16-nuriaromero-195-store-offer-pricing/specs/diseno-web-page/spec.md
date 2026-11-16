## MODIFIED Requirements

### Requirement: Plans show only already-published prices

The plans SHALL be the landing and the full website with the prices already published in site data ("desde 149 €" and "desde 399 €"), the full website marked as recommended, and the page MUST NOT publish any new price, price range or competitor figure while decision S-2026-11-13-1 is open. The only other price the plans MAY show is the online store starting price, read from the store offer source, in the full-website note that points to the store page.

#### Scenario: Plan prices from data

- **WHEN** the plans section renders
- **THEN** it shows exactly two plans with the prices from site data and the full website carries the "Recomendado" badge

#### Scenario: No market or competitor figures

- **WHEN** the visible text is checked
- **THEN** it contains no price other than those published in site data and no market range such as "entre 500 y 3.000 €"

#### Scenario: Store mention reads the store offer source

- **WHEN** the full-website plan note is rendered
- **THEN** it gives the store starting price from the store offer source, mentions the store page, and does not mention a panel
