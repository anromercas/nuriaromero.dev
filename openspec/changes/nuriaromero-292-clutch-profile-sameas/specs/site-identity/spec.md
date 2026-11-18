## MODIFIED Requirements

### Requirement: Official profiles are verified and valid

The site's official profile list SHALL contain only public profiles the brand owns, each as a unique absolute `https` URL, including the verified Sortlist and Clutch profiles. A directory profile SHALL enter the list only after its real-browser citation record matches `SITE`. Every JSON-LD node that carries `sameAs` and `/ai/summary.json` SHALL publish this same list.

#### Scenario: Sortlist profile is published in structured data

- **WHEN** the site is built and the home page JSON-LD is read
- **THEN** the node with `@id` "https://nuriaromero.dev/#business" has a `sameAs` list equal to LinkedIn, GitHub, the Google Business Profile, "https://www.sortlist.es/agency/nuria-romero" and "https://clutch.co/profile/nuria-romero", in that order
- **AND** the `#person` node and `/ai/summary.json` list the same profiles

#### Scenario: Clutch profile is recorded as a citation

- **WHEN** the "Citas de terceros" table of the citation record (`docs/seo-audit/local-signals-2026-11.md`) is read
- **THEN** the Clutch row has the URL "https://clutch.co/profile/nuria-romero", the name, address and phone as observed in a real browser (or "not shown publicly (observed)"), the reading date, and a status saying the outgoing link goes through the `r.clutch.co` redirect, so it is a citation and not a direct backlink
- **AND** no row or line of the record still describes Clutch as pending review

#### Scenario: A profile whose NAP differs is not published

- **WHEN** the Clutch profile shows a name, city or phone that differs from `SITE`
- **THEN** its URL is not added to the profile list and the story is flagged for the owner to correct the profile

#### Scenario: Unverified profile fails the build check

- **WHEN** a URL that is not in the verified-profile allowlist of the structured-data build check is added to the profile list
- **THEN** the build check fails naming the page whose business `sameAs` differs

#### Scenario: Invalid or duplicate profile fails the tests

- **WHEN** the profile list contains a non-`https` URL, a URL that does not parse, or the same profile twice (ignoring case, a leading `www.` and a trailing slash)
- **THEN** the unit tests fail

#### Scenario: Profiles without a real listing are absent

- **WHEN** the profile list is read
- **THEN** it has no URL on `crunchbase.com`, `wikipedia.org` or `wikidata.org`
