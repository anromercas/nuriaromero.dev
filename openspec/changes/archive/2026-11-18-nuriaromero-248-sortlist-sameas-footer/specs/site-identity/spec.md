## ADDED Requirements

### Requirement: Official profiles are verified and valid

The site's official profile list SHALL contain only public profiles the brand owns, each as an absolute `https` URL, with no duplicates, and SHALL include the public Sortlist profile `https://www.sortlist.es/agency/nuria-romero`. Every JSON-LD node that carries `sameAs` and `/ai/summary.json` SHALL publish this same list.

#### Scenario: Sortlist profile is published in structured data

- **WHEN** the site is built and the home page JSON-LD is read
- **THEN** the node with `@id` "https://nuriaromero.dev/#business" has a `sameAs` list equal to LinkedIn, GitHub, the Google Business Profile and "https://www.sortlist.es/agency/nuria-romero", in that order
- **AND** `/ai/summary.json` lists the same profiles

#### Scenario: Unverified profile fails the build check

- **WHEN** a URL that is not in the verified-profile allowlist of the structured-data build check is added to the profile list
- **THEN** the build check fails naming the page whose business `sameAs` differs

#### Scenario: Invalid or duplicate profile fails the tests

- **WHEN** the profile list contains a non-`https` URL, a URL that does not parse, or the same profile twice (ignoring case, a leading `www.` and a trailing slash)
- **THEN** the unit tests fail

#### Scenario: Profiles without a real listing are absent

- **WHEN** the profile list is read
- **THEN** it has no URL on `clutch.co`, `crunchbase.com`, `wikipedia.org` or `wikidata.org`

### Requirement: Visible profile links are resolved by network

Visible links to a profile (footer LinkedIn and GitHub, contact page LinkedIn) SHALL be chosen by the profile's network, not by its position in the profile list. A missing profile MUST fail the build instead of rendering a wrong or empty link.

#### Scenario: Footer and contact links survive a new profile

- **WHEN** a profile is added to the list or the list is reordered
- **THEN** the footer still links "LinkedIn" to "https://linkedin.com/in/nuria-romero-castillo" and "GitHub" to "https://github.com/anromercas", and the contact page still links "LinkedIn" to the LinkedIn profile, opening in a new tab with `rel="noopener noreferrer"`

#### Scenario: Missing profile fails the build

- **WHEN** the LinkedIn or GitHub profile is removed from the list
- **THEN** resolving that network throws and the build fails instead of rendering the link
