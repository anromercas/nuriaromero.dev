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
