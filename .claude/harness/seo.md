# SEO brief

Read by the SEO strategist and the Product Owner on every SEO run.

## Business goal

Win local organic visibility in Seville (Google, Google Maps and AI answers) for Nuria Romero's services, page by page, so that each service page outranks the agencies that rank today.

## Focus now

- **In focus:** local SEO in Seville (`/seo-local-sevilla/`, home `/`), GEO / AI visibility, web design (`/diseno-web-sevilla/`), online stores (`/tienda-online-sevilla/`), custom software (`/desarrollo-software-medida/`), automations (`/automatizaciones/`), AI for businesses (`/inteligencia-artificial/`) and the blog posts that feed them.
- **Out of focus for now (do not propose work on them):** niche pages `/web-para-restaurantes-sevilla/`, `/web-para-clinicas-sevilla/`, `/web-para-comercios-sevilla/`, `/web-para-abogados-gestorias-sevilla/` and `/seo-para-clinicas-capilares-sevilla/`. The user will reopen them later.
- Improve one section at a time: prefer candidates that concentrate on the current priority page over many scattered small changes.

## What every run must do

1. **Find the real competitors.** Do not rely only on `seo.competitors`: read the live SERPs at Seville for the in-focus terms and list who actually ranks (organic and local pack). Add new competitors to the report with the evidence (keyword and position) and say why.
2. **Explain why they rank.** For the top competitors of each in-focus page: page type and structure (H1-H3), content depth and FAQs, local signals (NAP, Google Business Profile, reviews, location pages), structured data, internal linking, backlinks and presence in AI answers (AI Overviews, ChatGPT, Perplexity). Separate verified facts from inferences.
3. **Extract their keywords.** The terms they rank for and target in titles and headings, with volume and difficulty when DataForSEO data is available.
4. **Propose better keywords.** Alternatives where we can win: less competition, clearer intent, local long tail (neighborhoods, "cerca de mí", questions), and terms no competitor covers (GEO / AI search). Map each one to the in-focus page that should own it, without cannibalising another page.
5. **Turn it into candidates** for the Product Owner: what to do, on which page, the evidence and the expected effect. Copy and headings stay in Spanish.

## Rules

- Never invent numbers, positions or competitor facts; cite the SERP, tool or page.
- No promises of concrete rankings in proposed copy.
- Compare with the previous report: say what changed (new competitors, moved positions, new opportunities) instead of repeating it.
- Respect `seo.dataforseo.maxCallsPerRun`: it runs daily, so plan calls carefully and report the calls used.

## Pending checks

- Check whether ChatGPT and Perplexity cite nuriaromero.dev (or the Sortlist profile `https://www.sortlist.es/agency/nuria-romero`) when answering `aplicaciones web a medida sevilla` and `desarrollo de software a medida sevilla`. Baseline 2026-11-15: not cited (NRD-124). The Sortlist profile was confirmed public in a real browser on 2026-11-18 (NRD-160 QA). Origin: NRD-160 and the Sortlist citation of 2026-11-18. Report the result once, without promising any, and remove this entry.

## Weekly blog idea refresh

Feeds the blog idea queue `seo/contenido/ideas.json` with real questions (NRD-350). Target: 4 posts a month, minimum 2, across the pillars SEO (local and GEO), web design and online stores, AI, and other services.

1. Do it once a week, on the first run on or after Monday (Europe/Madrid), and only then.
2. Budget: at most 6 of the run's `seo.dataforseo.maxCallsPerRun` calls: up to 4 live SERP calls (one seed question per pillar, Seville, es) for People Also Ask, and up to 2 Labs keyword-suggestion calls filtered to question keywords. Report these calls in the run's call table. No paid service beyond DataForSEO.
3. Save each response, unedited, as JSON under `.claude/state/seo/ideas/<date>/`. Save the Search Console queries of the last 28 days (configured service account, when available) as `gsc-<date>.json`. Save the recorded client questions of `docs/research/NRD-323-faq-gap-report.md` as the normalized file `.claude/state/seo/ideas/nrd-323-questions.json` (`kind: "client-question"`); create it once and reuse it.
4. Run `node scripts/blog-ideas-refresh.mjs --date <today> .claude/state/seo/ideas/<date>/*.json .claude/state/seo/ideas/nrd-323-questions.json [gsc file]`.
5. Copy its "Ideas para el blog" section into the report and summarise it in `latest.md` for the owner to approve or reject (she replies in a session with "aprueba idea <id>" or "rechaza idea <id>").
6. The run does not commit: `seo/contenido/ideas.json` stays modified in the checkout until the blog-pipeline skill's step 0 commits it on the next post branch.
