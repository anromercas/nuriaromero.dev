## Why

Tracker: [NRD-326](https://nuriaromerodev.atlassian.net/browse/NRD-326).

Google released an embeddable "Preferred Sources" button (August 2026) that lets readers add a site as a preferred source; Google says it applies to Top Stories, AI Overviews and AI Mode. A short video claims it also boosts Discover and is a three-step setup; neither is confirmed. Before anyone adds a third-party element to the blog we need the official facts, the privacy and CSP cost, and a go/no-go.

## What Changes

- New research document `docs/research/NRD-326-google-preferred-sources.md` (new folder `docs/research/`): official sources with URL and date read, exact embed mechanism, requirements, Spanish/Spain availability, Discover coverage (confirmed, denied or undocumented), what it loads (scripts, cookies, network calls) against the CSP in `public/_headers` and the analytics consent, the video claims marked confirmed/unconfirmed, a one-paragraph go/no-go and, if go, a ready-to-file follow-up story.

## Out of scope

- Any change under `src/`, `public/` or the PRD; adding the button; any CSP change.
- Filing the follow-up story (PO) or deciding on a third-party script (owner, PRD section 9).

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- None. Documentation only (`skip_specs: true`).

## Impact

- One new file `docs/research/NRD-326-google-preferred-sources.md` (layer `app`, `docs/**`).
- No dependency, URL, copy, schema or data change; nothing radical.
