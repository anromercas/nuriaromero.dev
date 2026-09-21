# Validar CWV de campo y priorización LCP
- **ID:** SEO-04
- **Prioridad:** P1
- **Estado:** pendiente
- **Fuente:** [technical.md](../findings/technical.md), sección 6 y limitaciones; [visual.md](../findings/visual.md), sección 6
- **Scope:** Medición real de LCP/INP/CLS y revisión de la imagen/elemento LCP de home y páginas de servicio.

## Problema
No hay datos de campo de CrUX/PSI/GA4 disponibles. La inspección estática no detecta `fetchpriority="high"` ni preload explícito para un posible hero LCP; es un riesgo no confirmado. Las dimensiones de imágenes sí mitigan CLS.

## Objetivo
**Riesgo operativo:** Actuar sin medición puede empeorar el rendimiento o priorizar un recurso que no es el LCP real.

Obtener una línea base verificable de CWV y, solo si la evidencia lo justifica, priorizar el elemento LCP correcto sin sobrecargar el resto de imágenes.

## Criterios de aceptación
- Se registra la fuente, fecha, URLs y dispositivo/conexión de la medición.
- LCP, INP y CLS quedan medidos o marcados como no disponibles con la razón exacta.
- Se identifica el elemento LCP de home y de las plantillas relevantes.
- `fetchpriority="high"`/`loading="eager"`/preload solo se aplican al recurso que la medición identifique como LCP, si procede.
- Las imágenes no críticas mantienen lazy loading y dimensiones explícitas.

## Dependencias y decisiones abiertas
Requiere acceso o exportación de Search Console/CrUX/PSI/GA4 y decidir qué fuente será la referencia operativa. No asumir que la imagen hero es el LCP sin medirla.

## Checks sugeridos
- PSI/Lighthouse o datos de campo autorizados.
- Medición de laboratorio móvil y desktop como complemento, no como sustituto de campo.
- Revisión del HTML final, waterfall y warnings de rendimiento.
- Comparación antes/después solo para las URLs medidas.

## No hacer
No prometer umbrales o mejoras de ranking, no añadir prioridad alta a todas las imágenes y no optimizar AVIF/fuentes por intuición sin evidencia de impacto.
