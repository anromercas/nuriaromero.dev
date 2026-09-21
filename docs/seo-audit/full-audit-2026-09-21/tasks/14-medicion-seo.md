# Establecer medición SEO y línea base
- **ID:** SEO-14
- **Prioridad:** P1
- **Estado:** parcial
- **Fuente:** [technical.md](../findings/technical.md), introducción y sección 182; [backlinks.md](../findings/backlinks.md), limitaciones; [sitemap.md](../findings/sitemap.md), fuente; [sxo.md](../findings/sxo.md), limitaciones
- **Scope:** Configuración y protocolo de GSC, GA4/consentimiento, CrUX/PSI cuando proceda, inspección de URLs, sitemap y registro de cambios.

## Problema
La auditoría carece de datos suficientes de GSC/GA4/CrUX para medir impacto, y varias áreas solo pueden expresarse como riesgos o no verificados. Sin línea base no se puede distinguir una mejora técnica de una fluctuación de demanda.

## Objetivo
**Riesgo operativo:** Sin baseline no se pueden atribuir cambios ni detectar regresiones con rigor.

Crear una medición mínima, consentida y reproducible para evaluar indexación, consultas, experiencia y conversiones sin prometer rankings.

## Criterios de aceptación
- Se documentan propiedades, permisos y fuentes disponibles, sin guardar credenciales en el repo.
- Se registra línea base de clicks, impresiones, CTR, posición, páginas indexadas, consultas, conversiones y CWV cuando cada métrica esté disponible.
- Se define una ventana y frecuencia de seguimiento antes y después de cada cambio.
- Se anotan cambios de deploy, redirects, sitemap, contenidos y campañas.
- Los informes distinguen dato observado, estimación, limitación y decisión.

## Dependencias y decisiones abiertas
Decisiones humanas: qué herramientas autorizar, objetivos de negocio, eventos de conversión, consentimiento analítico y frecuencia de revisión. Depende de SEO-01/02/03 para monitorizar cambios técnicos y de SEO-10/13 para campañas externas.

## Checks sugeridos
- Verificación de propiedad GSC y sitemap.
- Inspección de URLs representativas.
- Revisión de GA4/consent mode y eventos autorizados.
- Export periódico con fecha, filtros y segmentación documentados.
- Comparativas antes/después sin atribución causal no demostrada.

## No hacer
No guardar tokens ni datos personales en documentación pública, no usar posición como único KPI, no inventar datos faltantes y no prometer ranking como criterio de aceptación.

## Implementación local SEO-14

**Estado:** parcial. Se preparó el protocolo reproducible y la configuración local; la validación de propiedades, consentimiento real y recepción en producción sigue pendiente.

- `docs/seo-audit/measurement-seo.md` documenta propiedades, permisos, límites, KPIs, ventana de 28 días, cadencia, anotaciones, eventos y protocolo de validación sin guardar credenciales ni inventar métricas.
- `src/scripts/analytics-consent.js` aplica defaults de consentimiento denegado antes de cualquier carga, mantiene un allowlist de eventos y evita emitir eventos sin consentimiento.
- `src/components/AnalyticsConsent.astro` acepta `PUBLIC_GA4_MEASUREMENT_ID` como override de despliegue y no habilita ningún container GTM.
- `public/_headers` permite únicamente los endpoints de Analytics documentados, además de los ya necesarios para Formspree.
- `scripts/check-seo-14.mjs` y `npm run check:seo-14` validan la base de medición local, la política de consentimiento, la taxonomía y los guards contra métricas inventadas.

### Evidencia y pendientes

- RED: `node scripts/check-seo-14.mjs` falló antes de la implementación por ausencia del protocolo, script npm, allowlist, configuración por entorno y endpoints CSP.
- GREEN: `npm run check:seo-14` completó `astro check` + `astro build` (23 páginas, 0 errores, 0 warnings y 1 hint preexistente en `Schema.astro`) y el checker SEO-14 pasó; también pasó `git diff --check`.
- Runtime unit check: el controlador de consentimiento se ejecutó con almacenamiento/dataLayer falsos; confirmó default denegado, no emisión antes de aceptar, allowlist de eventos y no emisión después de rechazar.
- No se ejecutó acceso a Search Console, GA4, GTM, PSI o CrUX desde este worker; no se declara propiedad verificada, recepción de eventos, indexación ni ranking.
- Quedan pendientes las decisiones humanas sobre herramientas autorizadas, objetivos/eventos de conversión, retención y frecuencia final, además de la validación desplegada con consentimiento.
