## ADDED Requirements

### Requirement: llms.txt links the AI discovery files

`public/llms.txt` SHALL contain a section `## Datos para asistentes de IA` that links, in order, `https://nuriaromero.dev/ai/summary.json`, `https://nuriaromero.dev/ai/faq.json` and `https://nuriaromero.dev/.well-known/ai.txt` as exact file URLs without a trailing slash, each with a short Spanish description. The section MUST NOT promise reading, citation, ranking or special treatment, and the rest of `llms.txt` MUST stay unchanged.

#### Scenario: Section with the three links

- **WHEN** `public/llms.txt` is read
- **THEN** it has the heading `## Datos para asistentes de IA` and, up to the next `## ` heading, exactly the links to `/ai/summary.json`, `/ai/faq.json` and `/.well-known/ai.txt` on `https://nuriaromero.dev`, in that order, without a trailing slash, each with a description

#### Scenario: No promises

- **WHEN** the lines of the section are checked
- **THEN** none mentions a guarantee, citation, ranking position, priority or special treatment

#### Scenario: Every linked file exists in the build

- **WHEN** the site is built and each URL of the section is mapped to a path under `dist/`
- **THEN** every file exists

#### Scenario: Existing llms.txt guards keep passing

- **WHEN** `pnpm check:seo:dist` and the unit suite run after the change
- **THEN** `check-seo-09` (absolute public links, readable sections, no-promise notice, no private URLs) and the price and identity tests over `llms.txt` pass
