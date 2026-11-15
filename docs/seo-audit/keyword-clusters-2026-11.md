# Keyword clusters per service, November 2026 (NRD-73)

SEO method phase 2 (epic NRD-4). Real Seville queries per in-focus service, grouped by SERP intent so that one cluster maps to one page. Input for phase 3 (NRD-74). This document records observations and proposals only; no page, copy, URL, link, `src/data/seo-intents.ts` or `keywordOwners` entry was changed. Analysis is in English; queries are in Spanish, verbatim.

In scope: diseño web, tienda online, SEO local, software a medida, IA / automatizaciones, GEO. Out of scope: parked niche pages and `/seo-para-clinicas-capilares-sevilla/`.

## How to read this document

- **Dato observado**: a figure or fact taken from a named source with its data date. **Inferencia**: a reading of those facts. The two are never mixed in one cell; where a section needs both, they are labelled.
- **gap** means "not measured". It is never 0 and never an estimate. No volume, difficulty or ranking in this document is invented or estimated.
- Volumes are Spain-level (Labs and Keyword Planner are country-level); SERPs are read at Seville (city level). A Labs volume is therefore not a Seville volume.

### Run status: no DataForSEO access in this run

The run that wrote this study had no DataForSEO tools. Applying the design scenario "no DataForSEO access":

- The study uses reused data only (the inputs listed in "Fuentes reutilizadas").
- Every volume that no input measured reads **gap**; volumes are never estimated.
- Every cluster head whose SERP was not read in a reused input carries "intent: inferred from query wording, SERP not read" and is listed in "Huecos".
- The call plan below is kept as the plan for a later run (an agent with DataForSEO tools); the call ledger at the end records **0 calls made** in this run.

## Fuentes reutilizadas

All inputs are read in place. The `.claude/state/seo/*.md` reports, `seo/ranks/history.jsonl` and `docs/seo-audit/keywords/*.csv` are untracked or gitignored and live only in the main checkout; they are cited here and never copied into the repository. Source ids (S1 to S9) are used in every table below.

| Id  | Source file                                                                                        | What it provides                                                                                                                                                                                                                | Data date                                                                                                  |
| --- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| S1  | `.claude/state/seo/2026-11-13.md`                                                                  | Labs keyword overview (Spain, 20 keywords), Labs domain-intersection volumes, 6 live Seville SERPs (features, page types, local pack), competitor names, GEO/AI findings                                                        | Calls 2026-11-13; Google Ads volume months 2026-09 to 2026-11 as reported (per-keyword dates quoted below) |
| S2  | `.claude/state/seo/2026-11-14.md`                                                                  | Delta SERPs for `seo local sevilla` and `agencia seo sevilla` (pack, organic list, AI Overview)                                                                                                                                 | Calls 2026-11-14                                                                                           |
| S3  | `.claude/state/seo/2026-11-15.md`                                                                  | Delta SERPs for `diseño web sevilla` and `posicionamiento en ia` (pack, AI Overview, organic list); national SERP signal for GEO                                                                                                | Calls 2026-11-15                                                                                           |
| S4  | `.claude/state/seo/latest.md`                                                                      | Plain-language summary of S3; adds no figure                                                                                                                                                                                    | 2026-11-15                                                                                                 |
| S5  | `seo/ranks/history.jsonl`                                                                          | Rank capture, mobile, Seville: top 3 domains and local-pack presence for 11 keywords; our own position is `null` (not found) for all of them                                                                                    | Capture 2026-11-13 (`calledAt` 08:56 to 08:57 UTC)                                                         |
| S6  | `docs/seo-audit/keywords/*.csv` (4 root exports, plus `home/` and `seo-local-sevilla/` subfolders) | Google Ads Keyword Planner exports, Spain, window 2025-09 to 2026-08. Volumes come in coarse buckets (0, 50, 500, 5000), so they are a cross-check, not a measurement                                                           | Export dates 2026-09-19, 2026-09-20, 2026-10-08, 2026-10-09                                                |
| S7  | `docs/seo-audit/inventory-2026-11.md` (NRD-22, tracked)                                            | Search Console page-query rows (impressions and average position, web, Spain, all devices) and the cannibalization table                                                                                                        | Window 2026-10-16 to 2026-11-12; exported and inspected 2026-11-15; 69 rows, 1,156 impressions in total    |
| S8  | `.claude/state/seo/2026-11-14-NRD-21-competitor-gap.md`, `2026-11-14-NRD-21-backlinks.md`          | Backlink and outreach research (NRD-21). Consulted: it holds no keyword volume or SERP intent, so no figure is taken from it                                                                                                    | 2026-11-14                                                                                                 |
| S9  | `src/data/seo-intents.ts` (`keywordOwners`, `intentMatrix`) and ADR 0012                           | Registered owner per head term: `consultor seo sevilla` -> `/`; `seo local sevilla`, `agencia seo sevilla`, `posicionamiento web sevilla` -> `/seo-local-sevilla/`; `diseño tienda online sevilla` -> `/tienda-online-sevilla/` | Repository state at commit `60b2630`                                                                       |

### Discrepancies between inputs (recorded, not resolved)

- **Local pack for `seo local sevilla`.** S1 and S2 record a local pack of 3 (live Seville SERP, 2026-11-13 and 2026-11-14). S5 records `localPack.present: false` for the same keyword (mobile capture, 2026-11-13). The two inputs disagree on a point of fact; the cause (device, capture depth or parser) is not known. The cluster tables use S1/S2 for features and S5 only for the top 3 domains, and flag the disagreement.
- **Volume of `seo local sevilla`.** Labs overview says 50 per month (range 10 to 90, S1); the Labs domain intersection quotes 70 (S1, same call date); Keyword Planner shows the 500 bucket (S6, 2026-09-20 and 2026-10-08). Three figures, three methods, none estimated or averaged here.
- **Volume of `agencia seo sevilla`.** Labs overview 1,000 (S1); Keyword Planner bucket 5000 (S6, 2026-09-20).
- **Rank capture size.** The design speaks of 12 tracked keywords; `seo/ranks/history.jsonl` holds 11 rows for 2026-11-13. `diseño tienda online sevilla` is in `seo.rankTracking.keywords` but has no row in the capture.

## Plan de llamadas

Plan for a later run with DataForSEO tools. **Nothing in this table was executed in this run** (see the ledger). Budget: at most 30 calls for the whole story (`seo.dataforseo.maxCallsPerRun`). The calls of 2026-11-13 (19), 2026-11-14 (5) and 2026-11-15 (6) belong to the daily SEO reports and are not charged to this story; their results are reused instead.

Rules for the later run:

- Reuse first. A query already measured in S1 (volume) or with a full Seville SERP in S1, S2 or S3 is not queried again: `seo local sevilla`, `agencia seo sevilla`, `diseño web sevilla`, `tienda online sevilla`, `posicionamiento en ia`, `geo posicionamiento ia` have SERPs; `agencia seo sevilla`, `diseño web sevilla`, `consultor seo sevilla`, `posicionamiento web sevilla`, `seo local sevilla`, `tienda online sevilla`, `posicionamiento en ia`, `geo posicionamiento ia`, `como aparecer en google maps`, `seo para chatgpt`, `posicionamiento en chatgpt` have a Labs volume.
- The four queries that Labs returned as absent from its database on 2026-11-13 (`inteligencia artificial para empresas sevilla`, `cuanto cuesta una pagina web en sevilla`, `desarrollo de software a medida sevilla`, `posicionamiento en ia para empresas`) are not sent to the overview endpoint again; a result of "absent" is the measurement. They get a SERP read where they are cluster heads.
- Volume and difficulty at location Spain, language `es`. SERPs at `Seville,Andalusia,Spain`, language `es`, mobile, depth 10.
- If the 30 calls run out before every cluster head has a SERP, stop: the remaining clusters keep "intent: inferred from query wording, SERP not read" and stay in "Huecos". No extra call.

| Group                                                      | Step                                | Endpoint (suggested)                                                          | Target                                                                                                                                                                                                                                                                                | Calls  |
| ---------------------------------------------------------- | ----------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| A: SEO local, GEO, diseño web                              | Candidates                          | `dataforseo_labs/google/keyword_suggestions` or `keyword_ideas` (Spain, `es`) | 3 calls: seed `consultor seo sevilla` / `seo local sevilla`; seed `diseño web sevilla` / `diseñador web sevilla`; seed `posicionamiento en ia` / `seo para chatgpt` with a volume and Seville/IA term filter (the unfiltered ideas call of 2026-11-13 returned irrelevant head terms) | 3      |
| A                                                          | Volume and difficulty               | `dataforseo_labs/google/keyword_overview` or `bulk_keyword_difficulty`        | 1 batched call: the group A candidates not in S1                                                                                                                                                                                                                                      | 1      |
| A                                                          | Seville SERPs for cluster heads     | `serp/google/organic/live/advanced` (Seville, `es`, mobile)                   | `posicionamiento web sevilla`, `consultor seo sevilla`, `plan seo sevilla`, `experto seo sevilla`, `agencia geo sevilla`, `diseñador web sevilla`, `cuanto cuesta una pagina web en sevilla`, `diseño paginas web sevilla`                                                            | 8      |
| A                                                          | Subtotal                            |                                                                               |                                                                                                                                                                                                                                                                                       | 12     |
| B: tienda online, software a medida, IA / automatizaciones | Candidates                          | `keyword_suggestions` or `keyword_ideas` (Spain, `es`)                        | 3 calls: seed `diseño tienda online sevilla` / `crear tienda online sevilla`; seed `desarrollo de software a medida sevilla` / `aplicaciones web a medida sevilla`; seed `automatización de procesos sevilla` / `inteligencia artificial para empresas sevilla`                       | 3      |
| B                                                          | Volume and difficulty               | `keyword_overview` or `bulk_keyword_difficulty`                               | 1 batched call: the group B candidates not in S1                                                                                                                                                                                                                                      | 1      |
| B                                                          | Seville SERPs for cluster heads     | `serp/google/organic/live/advanced`                                           | `diseño tienda online sevilla`, `crear tienda online sevilla`, `desarrollo de software a medida sevilla`, `aplicaciones web a medida sevilla`, `apps a medida sevilla`, `inteligencia artificial para empresas sevilla`, `automatización de procesos sevilla`                         | 7      |
| B                                                          | Subtotal                            |                                                                               |                                                                                                                                                                                                                                                                                       | 11     |
| Shared                                                     | Follow-up volume for new candidates | `keyword_overview` or `bulk_keyword_difficulty`                               | 1 call for candidates that the six candidate calls surface and that have no volume yet                                                                                                                                                                                                | 1      |
| Shared                                                     | Reserve                             | any of the above                                                              | Retries (the 2026-11-15 run had one Labs endpoint fail twice with HTTP 500) and SERPs for heads that the candidate calls surface                                                                                                                                                      | 6      |
| **Total**                                                  |                                     |                                                                               |                                                                                                                                                                                                                                                                                       | **30** |

Breakdown by step: candidates 6, volume and difficulty 3 (A 1, B 1, shared 1), SERP reads 15, reserve 6. Total 6 + 3 + 15 + 6 = 30, which is within the limit of 30. Group A is listed first so that it can land alone if group B slips (design risk "Size").

## Datos reutilizados por servicio

One table per service. Columns: query, figure, source id and data date. Volumes are Spain-level monthly searches from Labs unless the cell says otherwise. Impressions are Search Console impressions in the 28-day window 2026-10-16 to 2026-11-12, not search volume. Cells that read **gap** have no measurement in any input.

### SEO local

| Query                                       | Volume (Spain)                                          | Search Console (impressions, avg. position, URL)                     | Source and date                                    |
| ------------------------------------------- | ------------------------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------- |
| `seo local sevilla`                         | 50 (range 10-90); 70 in domain intersection; bucket 500 | 76, 32.5, `/seo-local-sevilla/`                                      | S1 2026-11-13; S6 2026-09-20 and 2026-10-08; S7    |
| `agencia seo sevilla`                       | 1,000 (range 320-2,900; yearly trend -70%); bucket 5000 | none in the window                                                   | S1 2026-11-13; S6 2026-09-20; S7                   |
| `posicionamiento web sevilla`               | 320 (range 40-720; tool KD 1); bucket 500               | none in the window                                                   | S1 2026-11-13; S6 2026-09-20; S7                   |
| `consultor seo sevilla`                     | 590 (August 2026 peak 1,600); bucket 500                | 3, 6.3, `/`                                                          | S1 2026-11-13; S6 2026-09-20; S7                   |
| `seo sevilla`                               | 210; bucket 500                                         | not in the window                                                    | S1 2026-11-13 (domain intersection); S6 2026-09-20 |
| `posicionamiento seo sevilla`               | 110 (domain intersection); bucket 50                    | not in the window                                                    | S1 2026-11-13; S6 2026-09-20                       |
| `plan seo sevilla`                          | gap                                                     | 45, 40.5, `/seo-local-sevilla/`                                      | S7                                                 |
| `presupuesto seo sevilla`                   | gap (bucket 50 in S6)                                   | 37, 48.7, `/seo-local-sevilla/`                                      | S6 2026-09-20; S7                                  |
| `experto seo sevilla`                       | gap (bucket 500 in S6)                                  | 25, 52.8, `/seo-local-sevilla/`                                      | S6 2026-09-20; S7                                  |
| `consultor seo provincia de sevilla`        | gap                                                     | 24, 76.3, `/seo-local-sevilla/`                                      | S7                                                 |
| `consultor seo`                             | gap                                                     | 1, 18, `/`                                                           | S7                                                 |
| `consultor seo local`                       | bucket 500 (national, no Sevilla in the query)          | not in the window                                                    | S6 2026-09-20                                      |
| `precio seo local`, `freelance seo sevilla` | 10 each (negligible)                                    | not in the window                                                    | S1 2026-11-13                                      |
| `como aparecer en google maps`              | 110 (informational, CPC 4.97)                           | not in the window                                                    | S1 2026-11-13                                      |
| `seo para tiendas woocommerce en sevilla`   | gap                                                     | 17, 58.3, `/diseno-web-sevilla/` and 13, 46.3, `/seo-local-sevilla/` | S7 (cannibalization table)                         |

SERP observations already available (all at Seville):

- `seo local sevilla`, S1 2026-11-13: local pack of 3 (Slocal 4 reviews, Wolf Sevilla 12, Posiciona Tu Web Sevilla 27), compare-sites block, AI Overview (async), 4 "People also ask", related searches; winning page types: agency home and service pages plus listicles (Starenlared, Balboa Media, SEO Web Sevilla) and consultant pages (`jrgonzalez.es`, `antoniocastromk.site`). S2 2026-11-14: pack #3 changed to Antonio Castro (68 reviews), 10 organic results listed, none is nuriaromero.dev. S5 2026-11-13 (mobile): top 3 `balboamedia.es`, `starenlared.net`, `seowebsevilla.com`; local pack reported absent (see discrepancies).
- `agencia seo sevilla`, S1 2026-11-13 and S2 2026-11-14: local pack Starenlared (77), Posiciona Tu Web Sevilla (27), Slocal (4); AI Overview with 5 agencies; organic: agency pages (Momo & Cía, Prismalia "desde 199 €", Omnia Soluciones, Mora Estudio Creativo) and listicles (Sortlist, Benowu, Growwer, DocSEO, `seosevilla.net`). S5 top 3: `dobuss.es`, `sortlist.es`, `neuromarketingstrategy.com`.
- `posicionamiento web sevilla`: S5 2026-11-13 only (top 3 `seosevilla.net`, `sevillaagenciaseo.com`, `nubeseo.es`; local pack reported absent). S1 adds that `starenlared.net` is organic #2 with the title "Posicionamiento Web Sevilla [ Agencia SEO ]" and that `posicionatuwebsevilla.com` ranks 4 in Labs (country-level, data 2026-10-16/18). Features and page types: not read.
- `consultor seo sevilla`: S5 2026-11-13 only (top 3 `seowolf.es`, `agenciaseo.eu`, `consultoriaseosevilla.es`; local pack reported absent). S1: `soyrafaramos.com` uses the H1 "Consultor SEO Sevilla". Features and page types: not read.
- `como aparecer en google maps`: S5 2026-11-13 only (top 3 `blog.mareaalcalina.com`, `seonet.com.ar`, `palbin.com`; local pack not applicable).

### GEO

| Query                                 | Volume (Spain)                      | Search Console (impressions, avg. position, URL)                 | Source and date                                     |
| ------------------------------------- | ----------------------------------- | ---------------------------------------------------------------- | --------------------------------------------------- |
| `posicionamiento en ia`               | 70 (CPC 6.63, informational)        | none                                                             | S1 2026-11-13 (Ads data 2026-09-17 as quoted in S3) |
| `geo posicionamiento ia`              | 30 (CPC 5.29)                       | none                                                             | S1 2026-11-13                                       |
| `seo para chatgpt`                    | 50 (CPC 5.42)                       | none                                                             | S1 2026-11-13                                       |
| `posicionamiento en chatgpt`          | 30 (CPC 3.53)                       | none                                                             | S1 2026-11-13                                       |
| `geo generative engine optimization`  | 110 (KD 52, English-language query) | none                                                             | S1 2026-11-13                                       |
| `posicionamiento en ia para empresas` | gap (absent from the Labs database) | none                                                             | S1 2026-11-13                                       |
| `agencia geo sevilla`                 | gap                                 | 4, 15.5, `/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/` | S7                                                  |
| `consultoría geo en sevilla`          | gap                                 | 1, 37, `/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/`   | S7                                                  |

SERP observations already available:

- `posicionamiento en ia`, S1 2026-11-13: AI Overview (citing BBVA, GoDaddy, Proment, Digital Nature, iEstrategic), PAA; educational guides and service pages win. S3 2026-11-15: AI Overview defines GEO/AEO; organic `xavimoya.com`, `indexaweb.com`, `danielperez.digital`, `limadigital.pe`, `posicionamientoia.es`, `danielcarogarcia.com`, `ai-semantica.com`, `neozink.com`; 2 paid ads; PAA with 4 questions; **no Seville-local result**. S5 2026-11-13 top 3: `donostik.com`, `agencia2vm.com`, `douscents.es` (this differs from S3's organic list; two different dates and devices).
- `geo posicionamiento ia`, S1 2026-11-13: AI Overview, 3 paid ads, video block, PAA; big-brand guides (BBVA, Telefónica, GoDaddy, Hiberus, IEBS) and agency pages titled "Agencia GEO en España", "Posicionamiento en IA | AEO y GEO", "SEO para IA Generativa". The feature list has no local pack.
- `seo para chatgpt`, `posicionamiento en chatgpt`, `agencia geo sevilla`: SERP not read.
- The owner page candidates today: the blog post `/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/` (indexed, 5 impressions in the window, S7) and the planned `/seo-para-ia/` (HTTP 404 on 2026-11-15, S3; NRD-24). The GEO page decisions D1 to D4 (PRD section 12) stay with the user.

### Diseño web

| Query                                             | Volume (Spain)                                                | Search Console (impressions, avg. position, URL)                            | Source and date                                                       |
| ------------------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `diseño web sevilla`                              | 880 (CPC 3.19; range 390-2,900); bucket 500                   | 4, 60.8, `/diseno-web-sevilla/`                                             | S1 2026-11-13 (Ads data 2026-09-17); S6 2026-09-19 and 2026-10-09; S7 |
| `diseñador web sevilla`                           | gap                                                           | 145, 58.4, `/diseno-web-sevilla/`                                           | S7                                                                    |
| `diseño paginas web sevilla`                      | gap                                                           | 94, 60.2, `/diseno-web-sevilla/` (accent and "de" variants on the same URL) | S7                                                                    |
| `paginas web sevilla`                             | bucket 50                                                     | not in the window                                                           | S6 2026-10-09                                                         |
| `cuanto cuesta una web sevilla`                   | gap                                                           | 2, 36, `/diseno-web-sevilla/`                                               | S7                                                                    |
| `diseño web sevilla precio`                       | gap                                                           | 2, 22.5, `/diseno-web-sevilla/`                                             | S7                                                                    |
| `cuanto cuesta una pagina web en sevilla`         | gap (absent from the Labs database)                           | none                                                                        | S1 2026-11-13                                                         |
| `usabilidad móvil y diseño web adaptable sevilla` | gap                                                           | 24, 97, `/diseno-web-sevilla/`                                              | S7                                                                    |
| `mantenimiento web sevilla`                       | 90 (competitors rank 17 and 20; no page here); bucket 50      | not in the window                                                           | S1 2026-11-13; S6 2026-10-09                                          |
| `agencia marketing digital sevilla`               | 320 (competitor rank 10; off-brief for a freelance developer) | not in the window                                                           | S1 2026-11-13                                                         |

SERP observations already available:

- `diseño web sevilla`, S1 2026-11-13: local pack of 3, compare-sites block, AI Overview with price ranges (800 to 5,000+ EUR, cites `estudiotipo.com`), PAA ("¿Cuánto cuesta el diseño de una web?"), Malt marketplace result; winning page types: studio and agency service pages, a Sortlist ranking, a freelancer marketplace. S3 2026-11-15: pack changed (Gráfica Estudio Creativo 15 reviews, Diseño Web Sevilla 13, Starenlared 77); AI Overview still price-led; organic `designcloud.es`, `creadorpaginaswebsevilla.es`, `agencianewmar.es`, `webdemarketing.net`, `imprentasevilla.net`, `trustlocal.es`, Facebook pages. S5 2026-11-13 top 3: `sortlist.es`, `lsjestudio.com`, `metricweb.es`.
- `cuanto cuesta una pagina web en sevilla`: S5 2026-11-13 only (top 3 `jorgelujan.org`, `marketmovil.es`, `prontopro.es`; no local pack). Features and page types: not read. The query is the target of the existing post `/blog/cuanto-cuesta-una-pagina-web-en-sevilla/` (`Crawled - currently not indexed`, S7).
- `diseñador web sevilla`, `diseño paginas web sevilla`: SERP not read.

### Tienda online

| Query                                     | Volume (Spain)                           | Search Console (impressions, avg. position, URL)                  | Source and date                                     |
| ----------------------------------------- | ---------------------------------------- | ----------------------------------------------------------------- | --------------------------------------------------- |
| `tienda online sevilla`                   | 70 (KD 15, navigational)                 | none                                                              | S1 2026-11-13 (Ads data 2026-10-17 as quoted in S1) |
| `diseño tienda online sevilla`            | 70 (competitor rank 26 on its city page) | none                                                              | S1 2026-11-13 (domain intersection); S7             |
| `crear tienda online sevilla`             | 10 (negligible)                          | none                                                              | S1 2026-11-13                                       |
| `seo para tiendas woocommerce en sevilla` | gap                                      | 17, 58.3, `/diseno-web-sevilla/`; 13, 46.3, `/seo-local-sevilla/` | S7                                                  |

Keyword Planner (S6, 2026-09-19) buckets for national terms without Sevilla (`diseño tienda online`, `diseño web ecommerce`, `tienda online woocommerce`) read 50; they are not used as volumes here.

SERP observations already available:

- `tienda online sevilla`, S1 2026-11-13: image-rich organic only plus PAA; 8 of 10 organic results are `shop.sevillafc.es` or social pages of the club shop, plus a local-shops directory (`secompraonline.com`) and Tripadvisor. S5 2026-11-13 top 3: `shop.sevillafc.es` (twice), `amazon.es`. Intent read in S1: navigational / shopping.
- `diseño tienda online sevilla`, `crear tienda online sevilla`: SERP not read.
- Coverage: `/tienda-online-sevilla/` is `Discovered - currently not indexed` (S7), so no Search Console data exists for its queries.

### Software a medida

| Query                                     | Volume (Spain)                      | Search Console (impressions, avg. position, URL)            | Source and date   |
| ----------------------------------------- | ----------------------------------- | ----------------------------------------------------------- | ----------------- |
| `desarrollo de software a medida sevilla` | gap (absent from the Labs database) | 1, 34, `/desarrollo-software-medida/`                       | S1 2026-11-13; S7 |
| `apps a medida sevilla`                   | gap                                 | 8, 46, `/desarrollo-software-medida/`                       | S7                |
| `aplicaciones web a medida sevilla`       | gap                                 | 67, 70.8, `/diseno-web-sevilla/` (not on the software page) | S7                |

SERP observations already available:

- `desarrollo de software a medida sevilla`: S5 2026-11-13 only (top 3 `10code.es`, `q2bstudio.com`, and a staging-style subdomain of `10code`; local pack reported absent). Features and page types: not read. Note that one of the three captured results is a test host (`10code.test...furanet.com`), which says something about the SERP's quality, not about demand (**Inferencia**).
- `apps a medida sevilla`, `aplicaciones web a medida sevilla`: SERP not read.
- Keyword Planner (S6, 2026-09-19) buckets for national terms (`desarrollo aplicaciones web`, `desarrollo de app web`, `desarrollo web a medida`) read 50.

### IA / automatizaciones

| Query                                           | Volume (Spain)                      | Search Console (impressions, avg. position, URL)        | Source and date   |
| ----------------------------------------------- | ----------------------------------- | ------------------------------------------------------- | ----------------- |
| `inteligencia artificial para empresas sevilla` | gap (absent from the Labs database) | none (`/inteligencia-artificial/` is unknown to Google) | S1 2026-11-13; S7 |
| `automatizacion procesos sevilla`               | gap                                 | 17, 23.9, `/automatizaciones/`                          | S7                |
| `automatización de procesos sevilla`            | gap                                 | 15, 31.9, `/automatizaciones/`                          | S7                |
| `automatización de procesos en sevilla`         | gap                                 | 4, 11.5, `/automatizaciones/`                           | S7                |
| `automatizaciones ia sevilla`                   | gap                                 | 4, 52, `/automatizaciones/`                             | S7                |

SERP observations already available:

- `inteligencia artificial para empresas sevilla`: S5 2026-11-13 only (top 3 `iasevilla.com`, `aslan.es`, `robleragency.com`; no local pack). Features and page types: not read.
- `automatización de procesos sevilla` and its variants: SERP not read.
- Both pages of this service pair have no declared intent or owner in `intentMatrix` / `keywordOwners` (S7, "Intent mismatches").

## Huecos (preliminary, task 1.1)

Services or intents with no data in any input, which the call plan targets. The final list, after the clusters are built, is in the last section.

| Service               | Gap                                                                                                                                                                                                                                    | Planned call                        |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| SEO local             | No SERP features for `posicionamiento web sevilla` and `consultor seo sevilla` (top 3 domains only). No volume for `plan seo sevilla`, `presupuesto seo sevilla`, `experto seo sevilla`. Local-pack disagreement between S1/S2 and S5. | Group A candidates, volume, 4 SERPs |
| GEO                   | No SERP for `seo para chatgpt`, `posicionamiento en chatgpt`, `agencia geo sevilla`. No volume for `agencia geo sevilla`. Whether a Seville qualifier changes the SERP: only `posicionamiento en ia` is known to be national.          | Group A candidates, 1 SERP          |
| Diseño web            | No volume for `diseñador web sevilla` (145 impressions) or `diseño paginas web sevilla` (94); no SERP for them or for `cuanto cuesta una pagina web en sevilla` (features) beyond the top 3 domains.                                   | Group A volume, 3 SERPs             |
| Tienda online         | No SERP for `diseño tienda online sevilla` (the registered owner term) or `crear tienda online sevilla`; no Search Console data (page not indexed).                                                                                    | Group B candidates, 2 SERPs         |
| Software a medida     | No volume for any of the three queries; SERP features not read for any.                                                                                                                                                                | Group B candidates, 3 SERPs         |
| IA / automatizaciones | No volume for `inteligencia artificial para empresas sevilla` or the automation variants; SERP features not read for any. `/inteligencia-artificial/` has no Search Console data (unknown to Google).                                  | Group B candidates, 2 SERPs         |
