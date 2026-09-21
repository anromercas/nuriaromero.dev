# Corregir schema local y resolver naming de marca
- **ID:** SEO-11
- **Prioridad:** P2
- **Estado:** pendiente
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
