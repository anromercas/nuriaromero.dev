# NRD-323 FAQ gap report

Audit of the published FAQs against the questions people search for. Analysis in English; questions and proposed answers in Spanish. Written for story NRD-323 (design: `openspec/changes/nuriaromero-323-faq-gap-audit/`). Report date: 2026-11-21.

## 1. Summary

- **Published FAQ inventory:** 91 entries on 14 pages (home, contact, 7 services, 5 niche pages), read from `faqPages()` in `src/lib/ai-discovery.ts`. It is the same list `/ai/faq.json` publishes.
- **Question table:** 89 questions from recorded search data, each with source, source date, volume when known, coverage (yes / partial / no) and the covering entry (section 3). Coverage is judged by intent: "yes" means an existing entry answers the question directly, "partial" means the answer is incomplete or sits on another page, "no" means no entry answers it.
- **Result of the comparison:** 58 questions are covered, 18 are partial and 13 are not covered. Of the 31 partial or uncovered questions, 8 are recurring (two or more sources, or a known monthly volume of 10 or more: 4 on in-focus pages, 4 on parked niche pages) and 23 are one-off (listed, no proposal). Proposals and rejections are in section 4 (filled in by subtask NRD-337).
- **Data sources:** no DataForSEO call was made for this report (0 by design). All questions come from recorded, earlier SEO-strategist runs (2026-11-13 to 2026-11-16) and the repo study `docs/seo-audit/keyword-clusters-2026-11.md`. The optional story data step (`.claude/state/seo/<date>-NRD-323-calls.md`) did not run in this cycle, so `/contacto/` has no recorded question data and `/seo-para-ia/` only has the GEO block of 2026-11-16 (section 3.1).
- **What the report does not contain:** owner questions (section 6 is empty on purpose), estimated volumes, or any claim that a question is asked "in Seville" when the volume is Spain-level.

Conventions used in every table:

- Volumes are monthly searches. **Scope is Spain** unless stated: none of the recorded volumes is a Seville volume.
- **sin dato** means the tool was asked and returned no value; it is not 0. A dash means the question has no volume because it came from a SERP element (PAA, AI Overview, snippet) and not from a keyword.
- Source labels are the ones of the original report: `PAA` (Google "Más preguntas", live SERP at `Seville,Andalusia,Spain`, `es`), `KW-Labs` (DataForSEO Labs `keyword_suggestions`), `KW-Ads` (Google Ads `search_volume`), `RS` (related searches), `AIO` (topic answered by the Google AI Overview, not a literal user question), `snippet/ad` (competitor result title, snippet or ad text).
- A covering entry is written as `page #n` (entry number from section 2).

## 2. Published FAQ inventory

Generated on 2026-11-21 by reading `faqPages()` (a throwaway script, nothing committed). 91 entries, 14 pages. Page order is the order of `faqPages()`.

| Page URL | # | Question |
| --- | --- | --- |
| `/` | 1 | ¿Qué hace un consultor SEO? |
| `/` | 2 | ¿Cuánto cobra un SEO al mes? |
| `/` | 3 | ¿Quién es el mejor consultor SEO? |
| `/` | 4 | ¿Qué es el SEO? |
| `/` | 5 | ¿El SEO se paga? |
| `/` | 6 | ¿Qué diferencia hay entre SEO y SEM? |
| `/contacto/` | 1 | ¿Cuánto cobra un SEO al mes? |
| `/contacto/` | 2 | ¿Cuánto cuesta hacer una página web? |
| `/contacto/` | 3 | ¿Cuánto se tarda? |
| `/contacto/` | 4 | ¿Mejor un freelance o una agencia? |
| `/seo-local-sevilla/` | 1 | ¿Para qué tipo de negocio encaja este servicio? |
| `/seo-local-sevilla/` | 2 | ¿Cómo puede aparecer mi negocio en Google Maps? |
| `/seo-local-sevilla/` | 3 | ¿Qué diferencia hay entre Local y Local Pro? |
| `/seo-local-sevilla/` | 4 | ¿Qué ocurre en la llamada? |
| `/seo-local-sevilla/` | 5 | ¿Qué se mide y cómo se informa? |
| `/seo-local-sevilla/` | 6 | ¿Necesito tener web? |
| `/seo-local-sevilla/` | 7 | ¿Hay una puesta en marcha separada o una permanencia? |
| `/seo-local-sevilla/` | 8 | ¿Qué papel tienen los sistemas de IA? |
| `/seo-local-sevilla/` | 9 | ¿Eres una agencia de SEO local? |
| `/seo-para-ia/` | 1 | ¿Qué es el SEO para IA o GEO? |
| `/seo-para-ia/` | 2 | ¿En qué se diferencia el SEO para IA del SEO tradicional? |
| `/seo-para-ia/` | 3 | ¿Es lo mismo GEO que AEO? |
| `/seo-para-ia/` | 4 | ¿Cómo hago que ChatGPT recomiende mi negocio? |
| `/seo-para-ia/` | 5 | ¿Qué hay que trabajar para aparecer en las respuestas de IA? |
| `/seo-para-ia/` | 6 | ¿Cuánto cuesta el SEO para IA? |
| `/seo-para-clinicas-capilares-sevilla/` | 1 | ¿CAPILAR LOCAL está dirigido a pacientes? |
| `/seo-para-clinicas-capilares-sevilla/` | 2 | ¿Qué diferencia hay entre Local y Local Pro? |
| `/seo-para-clinicas-capilares-sevilla/` | 3 | ¿Hay permanencia? |
| `/seo-para-clinicas-capilares-sevilla/` | 4 | ¿Quién valida las FAQs y el contenido médico? |
| `/seo-para-clinicas-capilares-sevilla/` | 5 | ¿Se pueden medir los contactos sin tratar datos de salud? |
| `/seo-para-clinicas-capilares-sevilla/` | 6 | ¿Garantiza CAPILAR LOCAL más solicitudes? |
| `/diseno-web-sevilla/` | 1 | ¿Cuánto cuesta hacer una página web? |
| `/diseno-web-sevilla/` | 2 | ¿Cuánto se tarda en hacer una web? |
| `/diseno-web-sevilla/` | 3 | ¿Puedo hacer yo mi web gratis? |
| `/diseno-web-sevilla/` | 4 | ¿WordPress o web a medida? |
| `/diseno-web-sevilla/` | 5 | ¿La web incluye SEO? |
| `/diseno-web-sevilla/` | 6 | ¿Qué presupuesto necesito? |
| `/desarrollo-software-medida/` | 1 | ¿Qué es un software a medida? |
| `/desarrollo-software-medida/` | 2 | ¿Cuánto cuesta un software a medida? |
| `/desarrollo-software-medida/` | 3 | ¿Qué se puede desarrollar a medida: aplicación web, app móvil, ERP o API? |
| `/desarrollo-software-medida/` | 4 | ¿De quién es el código? |
| `/desarrollo-software-medida/` | 5 | ¿Qué empresas de desarrollo de software a medida hay en Sevilla? |
| `/automatizaciones/` | 1 | ¿Qué es la automatización de procesos? |
| `/automatizaciones/` | 2 | ¿Cuál es la mejor IA para automatizar procesos? |
| `/automatizaciones/` | 3 | ¿Qué ejemplos de automatización hay en una empresa? |
| `/automatizaciones/` | 4 | ¿Cómo se automatizan los mensajes de WhatsApp? |
| `/automatizaciones/` | 5 | ¿Se pueden automatizar las facturas y las tareas administrativas? |
| `/automatizaciones/` | 6 | ¿Cómo empiezo a automatizar los procesos de mi empresa? |
| `/inteligencia-artificial/` | 1 | ¿Cuál es la mejor IA para empresas? |
| `/inteligencia-artificial/` | 2 | ¿Qué diferencia hay entre ChatGPT y una IA para mi negocio? |
| `/inteligencia-artificial/` | 3 | ¿Cómo implantar IA en mi empresa? |
| `/inteligencia-artificial/` | 4 | ¿Qué es un agente de IA para empresas? |
| `/inteligencia-artificial/` | 5 | ¿Un chatbot puede atender a mis clientes? |
| `/inteligencia-artificial/` | 6 | ¿Cuánto cuesta y cuánto se tarda en poner IA en marcha? |
| `/tienda-online-sevilla/` | 1 | ¿Cuánto cuesta una tienda online en Sevilla? |
| `/tienda-online-sevilla/` | 2 | ¿Cómo se crea o se monta una tienda online? |
| `/tienda-online-sevilla/` | 3 | ¿WooCommerce, Shopify o una tienda a medida? |
| `/tienda-online-sevilla/` | 4 | ¿Qué plataforma conviene para un catálogo grande o con stock en varios almacenes? |
| `/tienda-online-sevilla/` | 5 | ¿Qué requisitos legales y técnicos tiene una tienda online? |
| `/web-para-restaurantes-sevilla/` | 1 | ¿Cuánto cuesta una página web para un restaurante? |
| `/web-para-restaurantes-sevilla/` | 2 | ¿Puedo actualizar la carta yo mismo? |
| `/web-para-restaurantes-sevilla/` | 3 | ¿De verdad necesito web si ya estoy en Google Maps y TripAdvisor? |
| `/web-para-restaurantes-sevilla/` | 4 | ¿Me ayudas también con las reseñas de Google? |
| `/web-para-restaurantes-sevilla/` | 5 | ¿Cómo consigo que mi restaurante aparezca cuando alguien busca «restaurante cerca de mí» o «dónde comer en mi barrio»? |
| `/web-para-restaurantes-sevilla/` | 6 | ¿Tengo que indicar los alérgenos en la carta digital? |
| `/web-para-restaurantes-sevilla/` | 7 | ¿Puedo tener menú del día y carta normal en la misma web? |
| `/web-para-restaurantes-sevilla/` | 8 | ¿Necesito hacer fotos profesionales de los platos para la web? |
| `/web-para-clinicas-sevilla/` | 1 | ¿Por qué mi clínica necesita una página por cada tratamiento? |
| `/web-para-clinicas-sevilla/` | 2 | ¿Cuánto cuesta la web de una clínica? |
| `/web-para-clinicas-sevilla/` | 3 | ¿Puede integrarse con Doctoralia o mi programa de citas? |
| `/web-para-clinicas-sevilla/` | 4 | ¿Cómo tratáis los datos de los pacientes? |
| `/web-para-clinicas-sevilla/` | 5 | ¿Cómo consigo que aparezca mi clínica cuando alguien busca mi especialidad cerca de su casa? |
| `/web-para-clinicas-sevilla/` | 6 | ¿Puedo mostrar reseñas de pacientes en la web de mi clínica? |
| `/web-para-clinicas-sevilla/` | 7 | Tengo varios especialistas en mi clínica, ¿cómo se refleja eso en la web? |
| `/web-para-clinicas-sevilla/` | 8 | ¿Puedo tener un formulario para que el paciente cuente su caso antes de la primera cita? |
| `/web-para-comercios-sevilla/` | 1 | ¿Necesito una tienda online o me basta con un catálogo? |
| `/web-para-comercios-sevilla/` | 2 | Catálogo o tienda online completa: ¿qué precio tiene cada opción? |
| `/web-para-comercios-sevilla/` | 3 | ¿Podré gestionar los productos yo mismo? |
| `/web-para-comercios-sevilla/` | 4 | ¿Y si vendo en Amazon o Wallapop, para qué quiero web? |
| `/web-para-comercios-sevilla/` | 5 | ¿Cómo consigo que me encuentren los clientes de mi barrio cuando buscan en Google? |
| `/web-para-comercios-sevilla/` | 6 | ¿Qué pasarela de pago se usa en la tienda online y cuánto cobra? |
| `/web-para-comercios-sevilla/` | 7 | ¿Puedo conectar mi tienda online con Instagram o Facebook Shop? |
| `/web-para-comercios-sevilla/` | 8 | ¿Cómo se gestiona el stock si vendo también en tienda física? |
| `/web-para-abogados-gestorias-sevilla/` | 1 | ¿Por qué necesita web mi despacho si los clientes llegan por recomendación? |
| `/web-para-abogados-gestorias-sevilla/` | 2 | ¿Cuánto cuesta la web de un despacho o gestoría? |
| `/web-para-abogados-gestorias-sevilla/` | 3 | ¿Quién escribe los textos legales de la web? |
| `/web-para-abogados-gestorias-sevilla/` | 4 | ¿Merece la pena un blog jurídico? |
| `/web-para-abogados-gestorias-sevilla/` | 5 | ¿Cómo consigo que me encuentren cuando alguien busca «abogado [especialidad] Sevilla» o «gestoría cerca de mí»? |
| `/web-para-abogados-gestorias-sevilla/` | 6 | ¿Es seguro que un cliente rellene el formulario de consulta con datos de su caso? |
| `/web-para-abogados-gestorias-sevilla/` | 7 | ¿Hay límites para la publicidad de un despacho de abogados? |
| `/web-para-abogados-gestorias-sevilla/` | 8 | Somos varios socios o áreas en el despacho, ¿cómo se organiza eso en la web? |

Entries per page: `/` 6, `/contacto/` 4, `/seo-local-sevilla/` 9, `/seo-para-ia/` 6, `/seo-para-clinicas-capilares-sevilla/` 6, `/diseno-web-sevilla/` 6, `/desarrollo-software-medida/` 5, `/automatizaciones/` 6, `/inteligencia-artificial/` 6, `/tienda-online-sevilla/` 5, `/web-para-restaurantes-sevilla/` 8, `/web-para-clinicas-sevilla/` 8, `/web-para-comercios-sevilla/` 8, `/web-para-abogados-gestorias-sevilla/` 8.

Page status (ADR 0013, PRD section 5): the five niche pages (`/web-para-restaurantes-sevilla/`, `/web-para-clinicas-sevilla/`, `/web-para-comercios-sevilla/`, `/web-para-abogados-gestorias-sevilla/`, `/seo-para-clinicas-capilares-sevilla/`) are **parked**: public but out of focus, and reopening them is a user decision.

## 3. Question table

Sources, with the original call date, are kept per row. Recorded question data does not exist for every page (3.1). "Recurring" = two or more distinct sources (a PAA, a keyword, an AI Overview topic and a snippet count as distinct) or a known monthly volume of 10 or more. Only partial and uncovered questions get a recurring flag that matters; covered rows say "n/a".

Source files (all dates are the original call dates; the files are untracked recorded outputs, cited by relative path, and each figure used is copied into this report):

- R16 = `.claude/state/seo/questions/2026-11-16.md` (SEO-strategist run of 2026-11-16, 23 calls).
- KC = `docs/seo-audit/keyword-clusters-2026-11.md` (tracked; source ids S1, S3, S10 inside it).
- S1 = `.claude/state/seo/2026-11-13.md` (calls 2026-11-13). S3 = `.claude/state/seo/2026-11-15.md`.
- N97 = `.claude/state/seo/2026-11-15-NRD-97-calls.md` (S10 in KC; calls 2026-11-15).

### 3.1 Pages with no or thin question data

- `/contacto/`: **no recorded question data** (no live SERP or question-form keyword was read for the intents of this page, such as `presupuesto pagina web sevilla` or `contratar diseñador web sevilla`; the optional data step that would cover it did not run in this cycle). Its four entries are matched against the cross-page questions in 3.2 only.
- `/seo-para-ia/`: no SERP of its own was read (the page was not live when R16 was run; the GEO block of R16 is the closest data, section 3.2 rows G1 to G8). `seo para ia` has no recorded volume.
- `/web-para-comercios-sevilla/`: no SERP of its own was read (R16 prioritised budget); its questions are borrowed from the `tienda online` and `pagina web` seeds and are marked as such.

### 3.2 Questions by page

Columns: ID, question, source (file, label, date), monthly volume (scope), covered, covering entry, recurring (for partial or uncovered only).

#### Home `/`

| ID | Question | Source | Volume | Covered | Covering entry | Recurring |
| --- | --- | --- | --- | --- | --- | --- |
| H1 | ¿Cuánto cobra un SEO al mes? | R16, PAA, 2026-11-16 (also in 2 other SERPs) | - | yes | `/` #2, `/contacto/` #1 | n/a |
| H2 | ¿Cuánto se cobra por SEO? | R16, PAA, 2026-11-16 | - | yes | `/` #2 | n/a |
| H3 | ¿Qué hace un consultor SEO? | R16, PAA, 2026-11-16 | - | yes | `/` #1 | n/a |
| H4 | ¿Quién es el mejor consultor SEO en España? | R16, PAA, 2026-11-16 | - | yes | `/` #3 | n/a |
| H5 | ¿Qué es SEO y se paga? | R16, PAA, 2026-11-16 | - | yes | `/` #4, `/` #5 | n/a |
| H6 | ¿Qué es el SEO? | R16, KW-Labs `que es seo`, `que significa seo`, 2026-11-16 | 1.600 and 590 (Spain) | yes | `/` #4 | n/a |
| H7 | ¿Qué diferencia hay entre SEO y SEM? | R16, KW-Labs `que es el seo y el sem`, 2026-11-16 | 320 (Spain) | yes | `/` #6 | n/a |
| H8 | ¿Cuánto cuesta el SEO? | R16, KW-Ads `precio seo` 170, `cuanto cuesta el seo` 30, `cuanto cobra un seo` 10, 2026-11-16 | 170 / 30 / 10 (Spain) | yes | `/` #2, `/contacto/` #1 | n/a |

#### `/seo-local-sevilla/`

| ID | Question | Source | Volume | Covered | Covering entry | Recurring |
| --- | --- | --- | --- | --- | --- | --- |
| L1 | ¿Cuánto cuesta el SEO local? | R16, PAA, 2026-11-16; KC, `precio seo local` 10 (S1, 2026-11-13); KC, `presupuesto seo sevilla` 10 (S10, 2026-11-15) | 10 (Spain, `precio seo local`) | no (the two plan prices are only in `/` #2 and `/contacto/` #1; no entry on the SEO local page states them) | none on the page | yes (3 sources, volume 10) |
| L2 | ¿Qué hace un SEO local? | R16, PAA, 2026-11-16 | - | no | none (`/` #1 answers the general question) | no (1 source) |
| L3 | ¿Cuánto cobra un SEO al mes? | R16, PAA, 2026-11-16 | - | yes | `/` #2, `/contacto/` #1 | n/a |
| L4 | ¿El SEO es pagado? / ¿Es gratuito el SEO? | R16, PAA, 2026-11-16 | - | yes | `/` #5 | n/a |
| L5 | ¿Qué es el SEO local? | R16, KW-Labs `que es el seo local`, 2026-11-16 | 90 (Spain) | partial (`/` #4 defines SEO, no entry defines local SEO) | `/` #4 | yes (volume 90) |
| L6 | ¿Necesito SEO local o SEO nacional? | R16, snippet/ad (a competitor in the top 5), 2026-11-16 | - | no | none | no (1 source) |
| L7 | ¿Cómo aparecer en Google Maps? | R16, citing ADR 0013 / S1 `como aparecer en google maps`, 2026-11-13 | 110 (Spain) | yes | `/seo-local-sevilla/` #2 | n/a |
| L8 | ¿Cómo influye la ficha de Google (Google Business Profile) en el SEO local? | R16, AIO, 2026-11-16; R16, KW-Labs `seo local google my business`, 2026-11-16 | 70 (Spain) | partial (#2 explains the ficha for Maps; no entry says how it feeds local SEO overall) | `/seo-local-sevilla/` #2, #3 | yes (2 sources, volume 70) |
| L9 | ¿Se puede trabajar el SEO por barrios o pueblos (Aljarafe, Dos Hermanas)? | R16, AIO, 2026-11-16 | - | no | none | no (1 source) |

#### `/seo-para-ia/` (GEO block of R16; see 3.1)

| ID | Question | Source | Volume | Covered | Covering entry | Recurring |
| --- | --- | --- | --- | --- | --- | --- |
| G1 | ¿Qué es el GEO / Generative Engine Optimization? | R16, AIO and top title, 2026-11-16; KC, `geo generative engine optimization` 110 (S1, 2026-11-13, English-language query) | 110 (Spain, English query) | yes | `/seo-para-ia/` #1 | n/a |
| G2 | ¿Cómo atraer clientes con IA? | R16, PAA, 2026-11-16 | - | partial | `/seo-para-ia/` #4, #5 | no (1 source) |
| G3 | ¿Qué IA es buena para marketing? | R16, PAA, 2026-11-16 | - | no | none | no (1 source) |
| G4 | ¿Cuáles son las 3 IA más usadas? | R16, PAA, 2026-11-16 | - | no | none | no (1 source) |
| G5 | ¿En qué se diferencia el SEO para IA del SEO tradicional? | R16, snippet/ad (top result), 2026-11-16 | - | yes | `/seo-para-ia/` #2 | n/a |
| G6 | ¿Cómo hago que ChatGPT recomiende mi negocio? | R16, snippet/ad (ads and videos cited in the AI Overview), 2026-11-16; KC, `seo para chatgpt` 50, `posicionamiento en chatgpt` 30 (S1, 2026-11-13) | 50 and 30 (Spain, keywords not questions) | yes | `/seo-para-ia/` #4 | n/a |
| G7 | ¿Es lo mismo GEO que AEO? | R16, AIO (defines GEO and AEO), 2026-11-16; KC, S3 AI Overview of `posicionamiento en ia`, 2026-11-15 | - | yes | `/seo-para-ia/` #3 | n/a |
| G8 | How to GEO-optimize? (English PAA) | N97, PAA of `geo generative engine optimization`, 2026-11-15 | - | yes | `/seo-para-ia/` #5 | n/a |

Keyword context for the GEO page, KC, S1 2026-11-13: `posicionamiento en ia` 70, `geo posicionamiento ia` 30, `seo para chatgpt` 50, `posicionamiento en chatgpt` 30 (Spain); `posicionamiento en ia para empresas` sin dato.

#### `/diseno-web-sevilla/`

| ID | Question | Source | Volume | Covered | Covering entry | Recurring |
| --- | --- | --- | --- | --- | --- | --- |
| D1 | ¿Cuánto cuesta hacer una página web? | R16, KW-Labs `cuanto cuesta hacer una pagina web` 320, `precio pagina web` 320, `cuanto cuesta crear pagina web` 260, KW-Ads `cuanto cuesta una pagina web` 210, 2026-11-16; S1, PAA "¿Cuánto cuesta el diseño de una web?", 2026-11-13 | 320 / 320 / 260 / 210 (Spain) | yes | `/diseno-web-sevilla/` #1, `/contacto/` #2 | n/a |
| D2 | ¿Cuánto cobra un diseñador para hacer una página web? | S1, PAA, 2026-11-13 | - | yes | `/diseno-web-sevilla/` #1 | n/a |
| D3 | ¿Cuánto se tarda en hacer una web? | R16, AIO (gives timelines), 2026-11-16; KW-Ads `cuanto tarda en hacerse una pagina web` sin dato | sin dato | yes | `/diseno-web-sevilla/` #2, `/contacto/` #3 | n/a |
| D4 | ¿Freelance, estudio o agencia para mi web? | R16, AIO, 2026-11-16; R16, KW-Ads `diseñador web freelance`, 2026-11-16 | 260 (Spain, keyword) | partial (answered on `/contacto/` #4 and `/seo-local-sevilla/` #9, not on the design page whose AI Overview raises it) | `/contacto/` #4 | yes (2 sources, volume 260) |
| D5 | ¿Puedo hacer yo mismo la web gratis? | R16, KW-Labs `como hacer una pagina web gratis` 1.000, `como crear una pagina web` 2.400, 2026-11-16 | 1.000 / 2.400 (Spain) | yes | `/diseno-web-sevilla/` #3 | n/a |
| D6 | ¿WordPress o web a medida? | R16, AIO, 2026-11-16 | - | yes | `/diseno-web-sevilla/` #4 | n/a |
| D7 | ¿La web incluye SEO? | R16, AIO and ads, 2026-11-16 | - | yes | `/diseno-web-sevilla/` #5 | n/a |
| D8 | ¿Qué presupuesto necesito? | R16, AIO, 2026-11-16 | - | yes | `/diseno-web-sevilla/` #6 | n/a |

#### `/tienda-online-sevilla/`

| ID | Question | Source | Volume | Covered | Covering entry | Recurring |
| --- | --- | --- | --- | --- | --- | --- |
| T1 | ¿Cuánto cuesta una tienda online? | R16, KW-Labs `tienda online precio` 140, KW-Ads `cuanto cuesta una tienda online` 30, 2026-11-16 | 140 / 30 (Spain) | yes | `/tienda-online-sevilla/` #1 | n/a |
| T2 | ¿Cómo crear una tienda online? | R16, KW-Labs `como crear una tienda online` 320 (variants 320 / 390), 2026-11-16 | 320 (Spain) | yes | `/tienda-online-sevilla/` #2 | n/a |
| T3 | ¿Cómo montar / abrir una tienda online? | R16, KW-Labs `como montar una tienda online` 170, `como abrir una tienda online` 140, 2026-11-16 | 170 / 140 (Spain) | yes | `/tienda-online-sevilla/` #2 | n/a |
| T4 | ¿Shopify o WooCommerce? | R16, KW-Ads `shopify o woocommerce` 30; AIO, 2026-11-16 | 30 (Spain) | yes | `/tienda-online-sevilla/` #3 | n/a |
| T5 | ¿Qué plataforma conviene para un catálogo grande o con stock en varios almacenes? | R16, AIO (PrestaShop), 2026-11-16 | - | yes | `/tienda-online-sevilla/` #4 | n/a |
| T6 | ¿Qué requisitos legales y técnicos tiene abrir una tienda online en España? | R16, AIO, 2026-11-16 | - | yes | `/tienda-online-sevilla/` #5 | n/a |
| T7 | ¿Cuánto se tarda en montar una tienda? | R16, AIO of the web-design SERP (8 to 12 weeks), 2026-11-16 | - | no (no timeline in the entries) | none | no (1 source) |

#### `/automatizaciones/`

| ID | Question | Source | Volume | Covered | Covering entry | Recurring |
| --- | --- | --- | --- | --- | --- | --- |
| A1 | ¿Qué es la automatización de procesos? | R16, PAA, 2026-11-16 (proxy SERP `automatización de procesos empresa`) | proxy `automatizacion de procesos` 480 (KW-Ads, Spain) | yes | `/automatizaciones/` #1 | n/a |
| A2 | ¿Cuál es la mejor IA para automatizar procesos? | R16, PAA; KW-Labs `automatizar procesos con ia` 70, `ia para automatizar procesos` 30, 2026-11-16 | 70 / 30 (Spain) | yes | `/automatizaciones/` #2 | n/a |
| A3 | ¿Me puedes dar 5 ejemplos de automatización en empresas? | R16, PAA, 2026-11-16 | - | yes | `/automatizaciones/` #3 | n/a |
| A4 | ¿Cuáles son los 4 tipos de automatización? | R16, PAA, 2026-11-16 | - | no | none | no (1 source) |
| A5 | ¿Cómo automatizar mensajes de WhatsApp? | R16, KW-Labs `automatizar mensajes whatsapp` 70, `como automatizar mensajes en whatsapp` 40, `automatizar whatsapp business` 40, 2026-11-16 | 70 / 40 / 40 (Spain) | yes | `/automatizaciones/` #4 | n/a |
| A6 | ¿Se pueden automatizar las facturas / tareas administrativas? | R16, KW-Labs `automatizar facturas` 30, `automatizar procesos administrativos` 30, 2026-11-16 | 30 / 30 (Spain) | yes | `/automatizaciones/` #5 | n/a |
| A7 | ¿Qué procesos conviene automatizar primero y cuáles no? | R16, snippet/ad (two top-10 titles: "qué automatizar y qué no", "qué procesos vale la pena automatizar"), 2026-11-16 | - | partial (#6 says to start with one task, not which ones to leave) | `/automatizaciones/` #6 | no (1 source) |
| A8 | ¿Cómo empiezo a automatizar los procesos de mi empresa? | R16, AIO (5 steps), 2026-11-16 | - | yes | `/automatizaciones/` #6 | n/a |

#### `/desarrollo-software-medida/`

| ID | Question | Source | Volume | Covered | Covering entry | Recurring |
| --- | --- | --- | --- | --- | --- | --- |
| S1 | ¿Qué es un software a medida? | R16, KW-Labs `que es un software a medida`, 2026-11-16 | 20 (Spain) | yes | `/desarrollo-software-medida/` #1 | n/a |
| S2 | ¿Cuánto cuesta un software a medida? | R16, KW-Ads `cuanto cuesta un software a medida`, 2026-11-16 | sin dato (not returned by the tool) | yes | `/desarrollo-software-medida/` #2 | n/a |
| S3 | ¿Qué puede desarrollarse a medida: aplicación web, app móvil, ERP, API? | R16, snippet/ad (top results), 2026-11-16 | - | yes | `/desarrollo-software-medida/` #3 | n/a |
| S4 | ¿De quién es el código? | R16, snippet/ad ("el código es siempre suyo"), 2026-11-16 | - | yes | `/desarrollo-software-medida/` #4 | n/a |
| S5 | ¿Software a medida o software estándar para mi empresa? | R16, inference of the intent, **no recorded evidence** (listed for completeness, not counted as a source), 2026-11-16 | - | partial (#1 contrasts custom and generic software) | `/desarrollo-software-medida/` #1 | no (0 recorded sources) |
| S6 | ¿Qué empresas de desarrollo a medida hay en Sevilla? | R16, dominant SERP format (rankings), 2026-11-16 | - | yes | `/desarrollo-software-medida/` #5 | n/a |

#### `/inteligencia-artificial/`

| ID | Question | Source | Volume | Covered | Covering entry | Recurring |
| --- | --- | --- | --- | --- | --- | --- |
| I1 | ¿Cuál es la mejor IA para empresas? | R16, PAA; KW-Labs `mejores ia para empresas`, 2026-11-16 | 50 (Spain) | yes | `/inteligencia-artificial/` #1 | n/a |
| I2 | ¿Qué inteligencia artificial usan las empresas? | R16, PAA, 2026-11-16 | - | partial (#1 names ChatGPT and Gemini in its second sentence) | `/inteligencia-artificial/` #1 | no (1 source) |
| I3 | ¿Qué IA es mejor que ChatGPT? / ¿Diferencia entre IA y ChatGPT? | R16, PAA, 2026-11-16 | - | yes | `/inteligencia-artificial/` #2 | n/a |
| I4 | ¿Cómo implantar IA en mi empresa? | R16, RS `Implementar ia en mi empresa`, 2026-11-16 | - | yes | `/inteligencia-artificial/` #3 | n/a |
| I5 | ¿Qué es un agente de IA para empresas? | R16, KW-Labs `agente de ia para empresas` (peak 390 in 2026-10), 2026-11-16 | 110 (Spain) | yes | `/inteligencia-artificial/` #4 | n/a |
| I6 | ¿Un chatbot puede atender a mis clientes? | R16, KW-Ads `chatbot para empresas` 90; RS `Chatbot de ia`, 2026-11-16 | 90 (Spain) | yes | `/inteligencia-artificial/` #5 | n/a |
| I7 | ¿Cuánto cuesta y cuánto se tarda en poner IA en marcha? | R16, snippet/ad (ads "desde 2.000 €", "3 semanas"; a competitor "4 a 8 semanas"), 2026-11-16 | - | yes | `/inteligencia-artificial/` #6 | n/a |

#### Parked niche pages

`/web-para-comercios-sevilla/` has no SERP of its own (3.1). In the other four, the volumes quoted are for the page's head keyword, not for the question.

| ID | Page | Question | Source | Volume | Covered | Covering entry | Recurring |
| --- | --- | --- | --- | --- | --- | --- | --- |
| N1 | `/web-para-abogados-gestorias-sevilla/` | ¿Qué debe tener la web de un despacho de abogados? | R16, AIO and competitor snippet, 2026-11-16 | `diseño web para abogados` 390 (KW-Ads, Spain, head keyword) | partial (#1, #2 and #8 mention parts: pages per area, team, form) | `/web-para-abogados-gestorias-sevilla/` #1, #2, #5, #8 | yes (2 sources) |
| N2 | `/web-para-abogados-gestorias-sevilla/` | ¿Hago la web yo mismo con una plantilla o contrato a un profesional? | R16, AIO, 2026-11-16 | - | partial (`/diseno-web-sevilla/` #3 answers it for webs in general) | `/diseno-web-sevilla/` #3 | no (1 source) |
| N3 | `/web-para-abogados-gestorias-sevilla/` | ¿Cuánto cuesta la web de un despacho? | R16, AIO and snippet ("desde 550 €, entrega 7-15 días" is a competitor), 2026-11-16 | `pagina web para abogados` 30 (KW-Ads, Spain) | yes | `/web-para-abogados-gestorias-sevilla/` #2 | n/a |
| N4 | `/web-para-abogados-gestorias-sevilla/` | ¿Cómo consigo clientes con la web del despacho? | R16, video cited in the AIO, 2026-11-16 | - | yes | `/web-para-abogados-gestorias-sevilla/` #5 | n/a |
| N5 | `/web-para-abogados-gestorias-sevilla/` | ¿Necesito páginas por especialidad (familia, laboral, penal)? | R16, AIO, 2026-11-16 | - | yes | `/web-para-abogados-gestorias-sevilla/` #5, #8 | n/a |
| N6 | `/web-para-abogados-gestorias-sevilla/` | ¿Cómo genero confianza: equipo, colegiado, reseñas? | R16, AIO, 2026-11-16 | - | yes | `/web-para-abogados-gestorias-sevilla/` #8 | n/a |
| N7 | `/web-para-clinicas-sevilla/` | ¿Qué funciones debe tener la web de una clínica (reserva de citas, mapa, servicios)? | R16, snippet/ad (top result), 2026-11-16 | `pagina web para clinica` sin dato | yes | `/web-para-clinicas-sevilla/` #1, #3, #8 | n/a |
| N8 | `/web-para-clinicas-sevilla/` | ¿Cuánto cuesta la web de una clínica? | R16, snippet/ad ("desde 900 €" is a competitor), 2026-11-16 | sin dato | yes | `/web-para-clinicas-sevilla/` #2 | n/a |
| N9 | `/web-para-clinicas-sevilla/` | ¿Cuánto se tarda? | R16, snippet/ad ("6 semanas", a competitor), 2026-11-16 | - | no (no timeline in the entries) | none | no (1 source) |
| N10 | `/web-para-clinicas-sevilla/` | ¿Cómo promocionar mi consultorio médico? | R16, PAA of `seo para clinicas`, 2026-11-16 | `seo para clinicas` 70 (KW-Ads, Spain, head keyword) | partial (#5 answers being found for a specialty) | `/web-para-clinicas-sevilla/` #5 | no (1 source) |
| N11 | `/web-para-clinicas-sevilla/` | ¿Cómo promocionar una clínica dental? | R16, PAA of `seo para clinicas`, 2026-11-16 | 70 (as N10) | partial (as N10) | `/web-para-clinicas-sevilla/` #5 | no (1 source) |
| N12 | `/web-para-clinicas-sevilla/` | ¿Cómo genera confianza la web en los pacientes? | R16, snippet/ad (top result), 2026-11-16 | - | yes | `/web-para-clinicas-sevilla/` #6, #7 | n/a |
| N13 | `/web-para-comercios-sevilla/` | ¿Cómo crear una tienda online para mi comercio? | R16, KW-Labs `como crear una tienda online` (tienda seed), 2026-11-16 | 320 (Spain) | partial (`/tienda-online-sevilla/` #2 answers it; `/web-para-comercios-sevilla/` #1 and #2 cover catalogue vs shop) | `/tienda-online-sevilla/` #2 | yes (volume 320) |
| N14 | `/web-para-comercios-sevilla/` | ¿Cuánto cuesta una tienda online? | R16, KW-Labs `tienda online precio` (tienda seed), 2026-11-16 | 140 (Spain) | yes | `/web-para-comercios-sevilla/` #2 | n/a |
| N15 | `/web-para-comercios-sevilla/` | ¿Shopify o WooCommerce? | R16, KW-Ads (tienda seed), 2026-11-16 | 30 (Spain) | partial (`/tienda-online-sevilla/` #3; the commerce page's #6 covers payment gateways only) | `/tienda-online-sevilla/` #3 | yes (volume 30) |
| N16 | `/web-para-comercios-sevilla/` | ¿Puedo vender online sin pagar comisión a un marketplace? | R16, copy of the page itself, **no search evidence**, 2026-11-16 | - | yes | `/web-para-comercios-sevilla/` #4 | n/a |
| N17 | `/web-para-comercios-sevilla/` | ¿Cómo hago que me encuentren los del barrio en Google Maps? | R16, citing ADR 0013 `como aparecer en google maps`, 2026-11-16 | 110 (Spain) | yes | `/web-para-comercios-sevilla/` #5 | n/a |
| N18 | `/web-para-restaurantes-sevilla/` | ¿Cómo hacer una página web para un restaurante? | R16, PAA, 2026-11-16 | `pagina web para restaurante` 30 (KW-Ads, Spain, head keyword) | partial (#1 gives price and scope, not the steps) | `/web-para-restaurantes-sevilla/` #1 | no (1 source) |
| N19 | `/web-para-restaurantes-sevilla/` | ¿Qué debe tener la página web de un restaurante? | R16, PAA and snippet ("contacto, mapa y carta actualizada"), 2026-11-16 | 30 (as N18) | partial (carta, reservas and Maps are spread over #1, #2, #5) | `/web-para-restaurantes-sevilla/` #1, #2, #5 | yes (2 sources) |
| N20 | `/web-para-restaurantes-sevilla/` | ¿Cuáles son las mejores páginas web de restaurantes? | R16, PAA, 2026-11-16 | - | no | none | no (1 source) |
| N21 | `/web-para-restaurantes-sevilla/` | ¿Cómo crear una web gratis para un restaurante? | R16, PAA, 2026-11-16 | - | partial (`/diseno-web-sevilla/` #3 answers the free option for webs in general) | `/diseno-web-sevilla/` #3 | no (1 source) |
| N22 | `/web-para-restaurantes-sevilla/` | ¿Cuál es la mejor plataforma para hacer una página web gratis? | R16, PAA, 2026-11-16 | - | no | none | no (1 source) |
| N23 | `/web-para-restaurantes-sevilla/` | ¿Qué páginas web puedo usar para vender comida? | R16, PAA, 2026-11-16 | - | no | none | no (1 source) |
| N24 | `/web-para-restaurantes-sevilla/` | ¿Cuánto cuesta una web de Wix para un restaurante? | R16, RS `Wix página web precio`, 2026-11-16 | - | no | none | no (1 source) |
| N25 | `/seo-para-clinicas-capilares-sevilla/` | ¿Cómo atraer más pacientes a mi clínica con SEO? | R16, snippet/ad (title of top result 1), 2026-11-16 | `seo para clinicas` 70 (KW-Ads, Spain) | partial (#1 to #6 define the service and its limits; none says how SEO brings patients) | `/seo-para-clinicas-capilares-sevilla/` #2, #6 | no (1 source) |
| N26 | `/seo-para-clinicas-capilares-sevilla/` | ¿Cuánto cobra un SEO al mes? | R16, PAA, 2026-11-16 | - | yes | `/` #2 | n/a |
| N27 | `/seo-para-clinicas-capilares-sevilla/` | ¿Hay que tener páginas por tratamiento y contenido con criterio sanitario? | R16, snippet/ad (top results), 2026-11-16 | - | yes | `/seo-para-clinicas-capilares-sevilla/` #4 | n/a |
| N28 | `/seo-para-clinicas-capilares-sevilla/` | ¿Cuánto cuesta captar un paciente y de dónde viene? | R16, snippet/ad (ad text, a business question), 2026-11-16 | - | partial (#5 covers measuring contacts, not cost per patient) | `/seo-para-clinicas-capilares-sevilla/` #5 | no (1 source) |

Not in the table, because they are keyword context, not questions: the patient-side keywords of the capilar page (`clinica capilar sevilla` 480, `injerto capilar sevilla` 390, KW-Ads, Spain, R16) and the secondary keywords listed in R16 and KC.

### 3.3 Cross-page questions (R16, "Preguntas transversales", 2026-11-16)

The recorded cross-page themes map to entries that already exist; no new row is needed beyond the rows above:

- Price of SEO per month: H1, L3, N26; covered at `/` #2 and `/contacto/` #1.
- Price of a web: D1, D2; covered at `/diseno-web-sevilla/` #1 and `/contacto/` #2.
- Timelines ("¿Cuánto se tarda?"): no measured volume; covered for webs (D3, `/contacto/` #3) and AI (I7); not covered for shops (T7) or clinics (N9).
- Freelance or agency: D4 (partial).
- DIY or hire: D5 (covered).
- Which AI to use: I1, I2, G3, G4, A2.
- "Results" (what a SEO does, when results come): L2; the R16 note says no AI Overview consulted gives a result timeline for SEO. No literal question with a source was recorded, so no row is invented here.

### 3.4 Tally

- Questions analysed: 89 (home 8, SEO local 9, GEO 8, diseño web 8, tienda 7, automatizaciones 8, software 6, IA 7, niche pages 28). A question that appears under two pages in the source file is listed once per page it was read for.
- Coverage: 58 yes, 18 partial, 13 no.
- Partial or uncovered: 31. Recurring: 8 (L1, L5, L8, D4 on in-focus pages; N1, N13, N15, N19 on parked niche pages). One-off: 23 (L2, L6, L9, G2, G3, G4, T7, A4, A7, S5, I2, N2, N9, N10, N11, N18, N20, N21, N22, N23, N24, N25, N28).
- `/contacto/` has no recorded question data (3.1), so none of the 89 rows is attributed to it as a source page.

## 4. Proposals and rejections

Filled in by subtask NRD-337 (task 1.2): a Spanish answer, target page, word budget and data used for each recurring partial or uncovered question, or a rejection with reason.

## 5. Data sources and calls

DataForSEO calls made by the developer for this report: **0** (by design: the developer agent has no DataForSEO tools and holds no credentials). Reused calls are listed, not re-charged.

| # | Source type | File | Endpoint / content | Seed | Original call date | Cost |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | recorded report | `.claude/state/seo/questions/2026-11-16.md` (R16) | SERP live (PAA, AI Overview, related searches), Labs `keyword_suggestions`, Google Ads `search_volume`; 23 calls (13 SERP, 6 Labs, 4 Ads), none failed; volumes lost in Ads call 20 (30 keywords, listed in its "Limitaciones") | per page: `consultor seo sevilla`, `seo local sevilla`, `diseño web sevilla`, `diseño tienda online sevilla`, `automatización de procesos empresa`, `desarrollo de software a medida sevilla`, `inteligencia artificial para empresas sevilla`, `posicionamiento en ia`, niche head keywords | 2026-11-16 | not returned in the file |
| 2 | repo doc (tracked) | `docs/seo-audit/keyword-clusters-2026-11.md` (KC) | Volumes and SERP readings quoted from S1, S3, S10 (`precio seo local` 10, `presupuesto seo sevilla` 10, GEO keywords, `geo generative engine optimization` 110) | see file | 2026-11-13 to 2026-11-15 | not returned |
| 3 | recorded report | `.claude/state/seo/2026-11-13.md` (S1) | Labs overview, 6 live Seville SERPs; PAA "¿Cuánto cuesta el diseño de una web?", "¿Cuánto cobra un diseñador para hacer una página web?" | `diseño web sevilla` | 2026-11-13 | not returned |
| 4 | recorded report | `.claude/state/seo/2026-11-15.md` (S3) | Delta SERPs for `diseño web sevilla` and `posicionamiento en ia` (AI Overview defines GEO/AEO; PAA 4, none GEO-specific) | `posicionamiento en ia` | 2026-11-15 | not returned |
| 5 | recorded report | `.claude/state/seo/2026-11-15-NRD-97-calls.md` (N97) | 22 calls (2 failed), 15 live SERPs; English PAA "How to GEO-optimize?" | `geo generative engine optimization` and others | 2026-11-15 | not returned |
| 6 | data step (optional) | `.claude/state/seo/<date>-NRD-323-calls.md` | **not run in this cycle**: would cover `/contacto/` and `/seo-para-ia/` (at most 6 calls) | n/a | n/a | n/a |

Files read and not used: `seo/estudios/2026-11-21-municipios-sevilla-demanda.md` and `seo/estudios/2026-11-21-palo-seco-estructura.md` (owner main checkout, untracked) are about municipality pages, not about the FAQs, and contain no question data used here.

Limits that apply to the whole table: PAA rotates, so every question keeps its original date and none is presented as today's SERP; the recorded data is five to eight days old on 2026-11-21; the AI Overview was asynchronous in five SERPs (software, IA, clinic, restaurant, SEO for clinics), so only its presence is known there; the `seo local sevilla` SERP read has no local pack in R16 while S1/S2 record one (KC, discrepancies), which does not change any question.

## 6. Preguntas de clientes reales (dueña)

Para que la dueña añada preguntas reales de clientes (correo, WhatsApp, llamadas), sin datos personales: solo el texto de la pregunta, anonimizado. El informe no pide ni contiene datos personales.

| Pregunta | Fuente (correo, WhatsApp, llamada) | Fecha | Cubierta (sí/parcial/no) | Página y entrada que la cubre | anonimizada: sí |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

## 7. For the PO

Filled in by subtask NRD-337 (task 1.2): additions grouped by page, ready to file as stories.
