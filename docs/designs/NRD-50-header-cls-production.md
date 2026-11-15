# NRD-50 - CLS and LCP of the header booking CTA in production against the NRD-18 baseline

## Why

[NRD-50](https://nuriaromerodev.atlassian.net/browse/NRD-50) (M1, epic NRD-2). The header booking CTA ([NRD-15](https://nuriaromerodev.atlassian.net/browse/NRD-15)) merged into `develop` (PR #11, merge `a892e8e`). Its layout-shift impact was only measured on the dev server. Nuria needs to know whether the conversion change degraded Core Web Vitals on the two M1 pages, measured exactly like the [NRD-18](https://nuriaromerodev.atlassian.net/browse/NRD-18) baseline. That baseline is recorded in `docs/seo-audit/full-audit-2026-09-21/tasks/04-validar-cwv-y-lcp.md`, section "Medición 2026-11-14".

The story can only run after the scheduled task promotes `develop` to `main` and Netlify builds production. This design never triggers a deploy (invariant "Branch flow and deploy budget", ADR 0009).

## What changes

- A read-only gate that confirms NRD-15 is live in production before measuring.
- A dated "Medición posterior a NRD-15 (NRD-50)" section appended to audit task 04, with deltas against the baseline.
- A bug if a threshold is exceeded; otherwise an explicit "no follow-up" verdict.
- No product code changes.

## Out of scope

- Any optimisation: a regression gets a bug, and the fix is its own story.
- The other five in-focus URLs of NRD-18; field data (CrUX/PSI) beyond noting availability; INP.
- Triggering, scheduling or requesting a deploy, Netlify settings, build hooks.
- Committing Lighthouse reports (they are attached to the story).

## Requirements and scenarios

### Requirement: promotion gate

Measurement SHALL start only when NRD-15 is in production. The gate is read-only: `git fetch origin main` and `git merge-base --is-ancestor a892e8e origin/main` must succeed, and `https://nuriaromero.dev/` must contain the header bar CTA inside `<nav` (`aria-label="Reservar una primera sesión"` together with the visible label "Reservar").

#### Scenario: not promoted yet

- WHEN either gate check fails
- THEN the developer comments "waiting for the scheduled promotion of develop (NRD-15 not live yet)" on NRD-50, leaves the subtasks in To Do, and changes nothing else. There is no deploy, no push to `main`, and no Netlify CLI or build hook

#### Scenario: promoted

- WHEN both checks pass
- THEN the `origin/main` SHA is recorded, and so is the list of stories it adds over the NRD-18 baseline (from `git log` between the baseline commit and that SHA)

### Requirement: same method as NRD-18

Each URL (`https://nuriaromero.dev/`, `https://nuriaromero.dev/seo-local-sevilla/`) SHALL be measured with `npx -y lighthouse@12.8.2 <url> --form-factor=mobile --output=json --chrome-flags="--headless=new" --quiet`. Each run uses a clean profile, all runs happen on the same machine, there are 3 sequential runs per URL, and the median is reported. The Chrome version is recorded, along with any deviation from NRD-18.

#### Scenario: recorded

- WHEN the runs finish
- THEN the doc has, per URL: date, tool and version, device and throttling, median LCP, CLS, TBT, score, LCP element, the three individual runs, and Δ LCP and Δ CLS against the baseline. Only observed numbers are recorded

### Requirement: verdict

A URL SHALL be a regression when its median CLS > 0.1, or when its median LCP minus the baseline median exceeds the NRD-18 run-to-run range for that URL (`/` 0.25 s, from runs 2.08 to 2.33; `/seo-local-sevilla/` 0.01 s, from runs 1.78 to 1.79).

#### Scenario: LCP rule trips within the good threshold

- WHEN the LCP delta exceeds the range but the median LCP stays at or below 2.5 s
- THEN 3 more runs are taken and the verdict uses the median of all 6

#### Scenario: regression

- WHEN a URL is a regression after confirmation
- THEN an NRD bug exists (Error, `qa-bug`, `app`, `seo`, epic NRD-2, Relates NRD-50 and NRD-15) with the values, deltas, LCP element, Lighthouse `layout-shift-elements` and the reports, and its key is in the doc

#### Scenario: no regression

- WHEN neither URL is a regression
- THEN the section ends with "No se requiere seguimiento" and the reason

## Files (layer `app`)

| Action | Path                                                                 | Notes                                                             |
| ------ | -------------------------------------------------------------------- | ----------------------------------------------------------------- |
| modify | `docs/seo-audit/full-audit-2026-09-21/tasks/04-validar-cwv-y-lcp.md` | append the section, in Spanish; never rewrite the NRD-18 baseline |

## Interfaces

None. Table columns: the same as NRD-18's results table, plus `Δ LCP` and `Δ CLS`.

## Data

None.

## Test plan (TDD order)

No behaviour change, so no `tests/*.test.js` case; the PR states it. Verification:

1. Gate, as in the Requirements.
2. Measure and record, attach the 6 (or more) JSON reports.
3. Apply the verdict rule and file a bug or record "no follow-up".

## Real-browser / e2e checks

The Lighthouse runs are the real-browser check. QA re-reads one URL's median from the attached JSON.

## Risks

- **Confounded promotion.** The promotion that ships NRD-15 may also ship NRD-49 (button colours), NRD-11 (single header logo), NRD-12 (layout CSS) or NRD-33 (longer hero subtitle on `/seo-local-sevilla/`, whose LCP element is `p.hero-subtitle`). The record lists the stories included. A regression bug names them as candidates, and the CLS culprit node from Lighthouse decides which.
- **Tight range.** `/seo-local-sevilla/` had a 0.01 s range in NRD-18, so noise alone can trip the rule. The 6-run confirmation step handles that.
- **Timing.** If the promotion has not happened when the story is picked, the gate stops the work. The story may carry over; that is expected, not a failure.

## ADRs

0001 (static site on Netlify), 0005 (SEO checks), 0009 (production only from `main`, scheduled promotions).

## Tasks

- [x] 1.1 [NRD-58 app] Gate on NRD-15 being live (read-only), then measure `/` and `/seo-local-sevilla/` with the NRD-18 method and append the dated section with deltas to audit task 04; tests: none (measurement only), no deploy.
- [ ] 1.2 [NRD-59 app] Apply the verdict rule (CLS > 0.1 or LCP delta beyond the NRD-18 range, with 6-run confirmation): file a bug or record "No se requiere seguimiento"; tests: none.
