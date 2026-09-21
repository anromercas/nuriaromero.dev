# Establecer medición SEO y línea base
- **ID:** SEO-14
- **Prioridad:** P1
- **Estado:** pendiente
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
