# Substantiate client case studies

**Priority:** Medium
**Evidence:** The audit found client case studies need clearer substantiation and dated methods/results.
**Dependencies:** Client-approved facts, permissions, and access to source records where applicable.

## Steps

1. Inventory the published case studies and identify every stated outcome, metric, client attribution, and project method.
2. Confirm which facts can be substantiated and publicly disclosed. Seek client approval where attribution or permission is required.
3. Add context to retained results: baseline or comparison, measurement period/date, scope, and method. Distinguish observed results from estimates and avoid implying causality beyond the evidence.
4. Remove, qualify, or anonymize unsupported or unapproved details.
5. Check that each case study explains the client challenge, work performed, and evidence-backed result.

## Acceptance criteria

- [x] Every quantitative result has a source, date/period, and understandable measurement context. (No quantitative results are stated in `src/components/Projects.astro` — nothing to source.)
- [x] Methods and scope are described accurately; causal claims are proportionate to the evidence. (Descriptions only state the tech stack and work scope, e.g. "Optimizada para SEO Local"; no outcome or ranking is claimed.)
- [x] Client names, logos, quotes, and confidential details have appropriate approval or are removed/anonymized. Confirmed 2026-09-18: Arkady Celebraciones and Adf Sevilla both belong to the same family-owned business; the site owner confirmed consent is assured.
- [x] Unsupported claims are removed or clearly qualified. (None present; a code comment in `Projects.astro` already blocks adding a testimonial/metric until confirmed by the client.)

## Verification

- Reviewed `src/components/Projects.astro` (2026-09-18): no unsupported metrics, no client quotes, existing guard comment against adding either without proof.
- Client attribution consent for Arkady Celebraciones and Adf Sevilla confirmed directly by the site owner on 2026-09-18 (family-owned business).
- Maintain a private evidence/approval record for each published case study going forward. Re-check public pages for consistency with approved records. Do not publish sensitive client evidence in this checklist.
