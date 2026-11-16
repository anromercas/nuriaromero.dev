## Purpose

Defines what the site publishes about the online store offer: one source for its starting price, options and scope lists, and the guarantees that every page, FAQ, structured data and llms.txt entry agree with it.

## ADDED Requirements

### Requirement: The store offer has one source

The store starting price ("499 €"), the three options, the included list and the quoted-separately list SHALL live in exactly one place of the site data, and every page, component, FAQ, structured data entry and other data file that shows them MUST read them from that place instead of writing them by hand.

#### Scenario: No hand-written store figure

- **WHEN** the site data, pages and components are searched for the store starting price
- **THEN** the literal "499 €" appears only in the store offer source and every other use reads it from there

#### Scenario: Lists read from the source

- **WHEN** the store page renders its included and quoted-separately lists
- **THEN** each list item equals, in order, an item of the corresponding list in the store offer source

### Requirement: The store page presents three options at one starting price

`/tienda-online-sevilla/` SHALL show "desde 499 €" and present WooCommerce, Shopify and a custom-coded store (for example Next.js + Supabase) as the client's choice at that same starting price, each with one sentence on its recurring cost, and MUST NOT publish the Shopify fee or any other third-party amount.

#### Scenario: Three options with their recurring cost

- **WHEN** the built page `<main>` is read
- **THEN** it shows "desde 499 €", the three options, and for Shopify a sentence saying the platform's monthly fee is paid to Shopify, and for WooCommerce and the custom store a sentence saying hosting and domain are in the client's name

#### Scenario: No third-party amounts

- **WHEN** the visible text and the store data are checked for figures
- **THEN** the only figures about the store are "499 €", "unos 20 productos" and "un mes", with no fee, gateway, shipping, lead-time, discount or percentage amount

### Requirement: The included scope is listed exactly

The store page SHALL list as included exactly: the store set up on the client's website with design adapted to the brand; one card payment gateway such as Stripe; simple shipping (flat rate and/or local pickup); up to about 20 products loaded by Nuria with simple size or colour variants; a training session to upload products and manage orders from the panel; one month of support.

#### Scenario: Included list

- **WHEN** the store page renders the included list
- **THEN** it holds those six items and no other

### Requirement: The quoted-separately scope is listed with the closing note

The store page SHALL list as quoted separately exactly: Redsys/Bizum; large catalogues or bulk imports; weight or zone shipping and carrier integrations; automatic invoicing or stock sync with other systems, linking to `/automatizaciones/`; and SHALL state that the final price is closed in writing after learning the project, before starting.

#### Scenario: Quoted-separately list and note

- **WHEN** the store page renders the quoted-separately list
- **THEN** it holds those four items, the last one links to `/automatizaciones/`, and the note about the written final price is visible

### Requirement: Store FAQ and copy agree with the offer

The store page FAQ, benefits and process SHALL agree with the offer: the price answer gives "desde 499 €" with the panel and basic scope included and the written final price; the platform answer helps choose among the three options; a card gateway is included and Redsys/Bizum are quoted separately; the initial load of up to about 20 products is included; no copy says the 399 € website is the store price or claims no monthly fee for Shopify.

#### Scenario: Price answer

- **WHEN** the FAQ "¿Cuánto cuesta una tienda online en Sevilla?" is read
- **THEN** it states "desde 499 €", that the management panel and the basic scope are included, and that the final price is closed in writing, and it does not mention "399 €"

#### Scenario: Platform answer

- **WHEN** the FAQ that mentions Shopify is read
- **THEN** it compares WooCommerce, Shopify and the custom store as options offered at the same starting price and does not present Shopify as something not offered

#### Scenario: No contradicting sentence

- **WHEN** every store copy string is split into sentences
- **THEN** each sentence mentioning Redsys or Bizum says it is quoted separately, no sentence says the initial product load is outside the price, and no sentence claims "sin cuota mensual" or an equivalent for Shopify

### Requirement: The Service offer equals the visible starting price

The Service structured data of `/tienda-online-sevilla/` SHALL publish exactly one offer with price "499" and currency EUR, derived from the store offer source, and no other structured data entry of the site MUST publish a different store price.

#### Scenario: One store offer

- **WHEN** the JSON-LD of the built store page is parsed
- **THEN** the Service has exactly one offer, its price is "499" and its currency is "EUR", with no offer per option

### Requirement: llms.txt describes the current store offer

The `/tienda-online-sevilla/` line of `public/llms.txt` SHALL say "desde 499 €", that the management panel is included and that the store comes in WooCommerce, Shopify or custom, and a test MUST compare it with the store offer source.

#### Scenario: llms.txt line follows the source

- **WHEN** the llms.txt test runs
- **THEN** the store line contains the starting price from the source, "panel de gestión" and the three option names, and it no longer says the store is quoted by catalogue

### Requirement: Other pages mention the store price from the source

Every mention of the online store on `/diseno-web-sevilla/` and `/web-para-comercios-sevilla/` that said the store is quoted separately SHALL instead give "desde 499 €" read from the store offer source and mention or link `/tienda-online-sevilla/`; the niche page panel sentences MUST NOT change.

#### Scenario: Design-web plan note

- **WHEN** the full-website plan of `/diseno-web-sevilla/` renders its note
- **THEN** it gives the store price from the source and mentions the store page, and contains no "se presupuesta aparte" about the store

#### Scenario: Commerce niche page

- **WHEN** the commerce niche pricing note and its price FAQ are read
- **THEN** they give the store price from the source and point to `/tienda-online-sevilla/`, and the panel sentences of the niche data are unchanged
