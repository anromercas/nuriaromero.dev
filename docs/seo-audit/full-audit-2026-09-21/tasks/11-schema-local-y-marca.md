# Corregir schema local y resolver naming de marca
- **ID:** SEO-11
- **Prioridad:** P2
- **Estado:** parcial
- **Fuente:** [local.md](../findings/local.md), sección 3; [technical.md](../findings/technical.md), sección 8; [geo.md](../findings/geo.md), sección 4
- **Scope:** `ProfessionalService`/schema local, `openingHours`, `geo`, `areaServed`, `sameAs` y consistencia del nombre de marca en datos estructurados, metadata y copy.

## Problema
El schema local es válido como base pero mejorable en precisión y completitud. También existe discrepancia de naming de marca entre superficies. Algunos campos dependen de datos reales aún no decididos.

## Objetivo
**Riesgo operativo:** Datos locales inventados o nombres contradictorios pueden degradar la confianza y la validez de la entidad.

Alinear la entidad representada y enriquecer el schema solo con información real, coherente y verificable.

## Criterios de aceptación
- Se elige y documenta un nombre público principal y sus variantes permitidas.
- `ProfessionalService`/entidad local usa `areaServed`, `geo`, `openingHours` y `sameAs` solo cuando los datos son verdaderos y aprobados.
- La precisión geográfica no excede la evidencia disponible para un SAB.
- JSON-LD, title/description, footer y perfiles no presentan nombres contradictorios.
- El schema pasa validación sintáctica y no introduce propiedades no soportadas.

## Dependencias y decisiones abiertas
Decisiones humanas obligatorias: naming oficial, horarios, área de servicio y perfiles externos oficiales. Depende de SEO-10 para GBP/sameAs. No inventar coordenadas ni dirección pública.

## Checks sugeridos
- Validador de Schema.org y Rich Results Test cuando proceda.
- Comparativa de NAP/naming entre sitio, perfiles y legal.
- Inspección de JSON-LD renderizado en páginas representativas.
- Crawl de canonicals y breadcrumbs.

## No hacer
No afirmar que el schema por sí solo produce rich results, no poner horarios ficticios, no usar coordenadas aproximadas como si fueran exactas y no cambiar el naming comercial sin decisión humana.

## Implementación local (2026-09-21)

- Nombre público principal elegido para las superficies públicas: **Nuria Romero**.
- Variantes permitidas y acotadas: `nuriaromero.dev` como dominio/marca digital y `Nuria Romero Castillo` únicamente cuando el contexto legal o la autoría verificable lo requiera.
- `ProfessionalService` se expresa también como `Organization`, con `@id` estable, `alternateName`, `founder` y `sameAs` compartidos; `Person`, `WebSite` y `Service` referencian la misma entidad de negocio.
- `areaServed` distingue `Sevilla` y `Área metropolitana de Sevilla`, reflejando el área ya comunicada públicamente sin inventar barrios, radio ni coordenadas.
- Se retiraron del grafo las coordenadas existentes porque no hay evidencia humana aprobada de precisión suficiente para publicarlas. También siguen ausentes `openingHoursSpecification`, `aggregateRating` y `review` hasta disponer de datos verificables.
- Footer, `og:site_name`, contacto y JSON-LD usan el nombre público principal; los enlaces `sameAs` se mantienen limitados a LinkedIn y GitHub ya declarados como perfiles oficiales.

## Evidencia local y pendientes

- `npm run check:seo-11` pasa con build Astro de 22 páginas y validación de 22 HTML/10 schemas `Service`; Astro informa 0 errores, 0 warnings y 1 hint preexistente en `src/components/seo/Schema.astro`.
- Pendiente de decisión/datos humanos: horarios reales de atención, precisión geográfica aprobada, nombre exacto si se crea/reclama GBP, área comercial definitiva y cualquier nuevo perfil oficial para `sameAs`.
- Pendiente de validación de producción: inspección del JSON-LD desplegado, Schema Markup Validator/Rich Results Test y comparativa con NAP/legal una vez aprobados los datos humanos.

## Validación de producción (2026-11-14, NRD-19 / NRD-40)

**Herramientas.** El Schema Markup Validator y el Rich Results Test de Google son herramientas web y esta ejecución no tuvo navegador: **no verificado (sin navegador)**. No se afirma que pasen. Queda pendiente repetirlas en navegador real (QA/PO) sobre las tres URLs.

**Validación realizada en su lugar** (no equivale a las herramientas de Google):

1. `curl` del HTML de producción de `https://nuriaromero.dev/`, `/seo-local-sevilla/` y `/diseno-web-sevilla/` (los tres HTTP 200, `content-type: text/html`).
2. Extracción de cada `<script type="application/ld+json">` y `JSON.parse` de todos: **0 errores de sintaxis** (2 bloques por página).
3. Script de Node propio (no es una librería de validación) que comprueba propiedades requeridas y recomendadas por tipo y que cada `@id` referenciado se resuelve dentro de la página. Es una revisión estructural, no una validación contra el vocabulario completo de schema.org.
4. Comparación con `dist/` generado con `pnpm astro build` desde el HEAD de la rama (develop fusionado): el JSON-LD de producción es **idéntico** al del build en las tres URLs. Producción coincide con `main` (`<title>` de `/` igual al de `src/pages/index.astro`; `origin/main` = `f4f6bfe`, y está contenido en el HEAD usado). No hay diferencias producción/build.

### Tipos detectados y errores

| URL | Tipos detectados | Errores (estructura) |
| --- | --- | --- |
| `/` | `ProfessionalService`+`Organization` (`#business`), `WebSite`, `Person`, `FAQPage` (6 preguntas), `ProfessionalService`+`Organization` (`#business`, solo `aggregateRating` + `review`: 1 `Review`) | 0 |
| `/seo-local-sevilla/` | `ProfessionalService`+`Organization`, `WebSite`, `Service` (2 `Offer`), `FAQPage` (9 preguntas), `BreadcrumbList` (Inicio > SEO local en Sevilla) | 0 |
| `/diseno-web-sevilla/` | `ProfessionalService`+`Organization`, `WebSite`, `Service` (1 `Offer`), `FAQPage` (10 preguntas), `BreadcrumbList` (Inicio > Diseño web en Sevilla) | 0 |

`AggregateRating` (ratingValue 5, reviewCount 1) y `Review` (author, reviewRating) están presentes en `/` con las propiedades requeridas. No hay `BreadcrumbList` en `/` (la home no lo emite, es lo esperado).

### Avisos (texto literal de mi script, no de Google)

- `/`, `/seo-local-sevilla/`, `/diseno-web-sevilla/`: `ProfessionalService+Organization: sin geo (decisión documentada)` y `ProfessionalService+Organization: sin openingHoursSpecification (decisión documentada)` (ambas ausencias son decisión recogida arriba, en "Implementación local").
- `/seo-local-sevilla/` y `/diseno-web-sevilla/`: `@id sin resolver: https://nuriaromero.dev/#person` (el `founder` del negocio referencia el `Person`, que solo se emite en `/`). Referencia entre páginas válida en JSON-LD, pero no resoluble desde la propia página.
- `/`: el nodo `#business` aparece dos veces (uno con los datos y otro con solo `aggregateRating`/`review`). Se fusionan por `@id`; no es un error.
- Previsible en Google (no comprobado): `aggregateRating`/`review` sobre la propia empresa y `FAQPage` pueden figurar como "no elegibles para resultados enriquecidos". Se registrarían como "no elegible", no como error.

### Defecto detectado

- `Person.url` es `https://nuriaromero.dev/sobre-mi` (sin barra final, `src/lib/schema.ts:84`), y producción responde `301` a `https://nuriaromero.dev/sobre-mi/` (comprobado con `curl --max-redirs 0`). Resto de URLs del JSON-LD usan barra final. Bug a registrar por separado (no se corrige en esta historia).

### Pendiente

- Schema Markup Validator y Rich Results Test (Googlebot smartphone) sobre las tres URLs: no verificado (sin navegador).
