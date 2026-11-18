## MODIFIED Requirements

### Requirement: The page keeps its intent placement

`/inteligencia-artificial/` SHALL carry the title, the meta description and the single H1 of its intent row ("Inteligencia artificial para empresas en Sevilla" in title and H1, "chatbots que atienden clientes" in the description), so that title, H1 and description each work the registered term `inteligencia artificial para empresas sevilla` (each contains "inteligencia artificial", "empresas" and "Sevilla"), with a title of at most 65 characters and a description of at most 160 characters that keeps "años de experiencia". It SHALL keep the process and pricing keyword headings ("Así es el proceso de implantar IA en tu negocio", "Cuánto cuesta implementar IA en tu negocio"), and MUST NOT use a term owned by another page, nor "posicionamiento en IA" or "GEO", in the title, H1 or any H2. The page copy MUST NOT promise that Google or an AI assistant will rank or recommend the business.

#### Scenario: Intent signals kept

- **WHEN** the page is built
- **THEN** the title, description, only H1 and the process and pricing H2 contain their intent signals

#### Scenario: Title, H1 and description work the registered term

- **WHEN** the intent test reads `inteligenciaArtificial` from the site data
- **THEN** the normalised title, H1 and description each contain "inteligencia artificial", "empresas" and "sevilla", the title has at most 65 characters and the description at most 160 with "años de experiencia"
- **AND** the test fails on the copy published before this change

#### Scenario: Text budget unchanged

- **WHEN** the built page is measured by the template contract check
- **THEN** the visible `<main>` words stay within 750 to 850

#### Scenario: No term of another owner in headings

- **WHEN** the keyword ownership check runs on the built page
- **THEN** no title, H1 or H2 of the page targets a term owned by another page, and no H2 contains "GEO" or "posicionamiento en IA"

#### Scenario: Links to the adjacent services hold

- **WHEN** the intent test reads the internal-link map and the reciprocal pairs
- **THEN** `/inteligencia-artificial/` links to `/desarrollo-software-medida/` and the pair with `/automatizaciones/` exists in both directions

## ADDED Requirements

### Requirement: The intent placement is backed by a recorded SERP reading

The intent of `/inteligencia-artificial/` SHALL be backed by a dated reading of the Seville SERP of `inteligencia artificial para empresas sevilla` recorded in the keyword cluster study, naming the ranking domains with page type and the main-content word count of the ranking service pages, and by a Lighthouse mobile baseline of the page taken before the copy change. A figure that could not be measured SHALL be recorded as "sin dato" with its reason, never estimated.

#### Scenario: Reading recorded before the copy change

- **WHEN** the change reaches review
- **THEN** the cluster study holds a "Dato observado (NRD-126, <date>)" entry with source, task id, local pack, organic domains in order with page type, AI Overview presence and the word counts of the service pages, committed before the copy commit

#### Scenario: CWV measured before and after

- **WHEN** the change reaches review
- **THEN** the CWV record holds the median of three Lighthouse mobile runs of the page before the copy change and after it, with LCP, CLS, TBT and the LCP element

#### Scenario: Measurement unavailable

- **WHEN** DataForSEO or Lighthouse cannot be run
- **THEN** the record says "sin dato (<reason>)" for that figure and no number is written in its place
