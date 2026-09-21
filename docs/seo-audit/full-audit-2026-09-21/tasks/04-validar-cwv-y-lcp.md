# Validar CWV de campo y priorización LCP
- **ID:** SEO-04
- **Prioridad:** P1
- **Estado:** parcial — baseline local documentada; medición real de CWV/LCP pendiente por tooling/acceso faltante
- **Fuente:** auditoría SEO 2026-09-21; evidencia local verificada aportada para este cierre; [technical.md](../findings/technical.md), sección 6 y limitaciones; [visual.md](../findings/visual.md), sección 6
- **Fecha de verificación:** 2026-09-21
- **Scope:** Medición real de LCP/INP/CLS y revisión del elemento LCP de home y páginas de servicio.

## Baseline verificada
- `npm run build`: OK; 22 páginas generadas, 0 errores, 0 warnings y 1 hint preexistente.
- Preview local: home y 10 plantillas de servicio/nicho respondieron `HTTP 200`.
- URLs/contexto revisados: `https://nuriaromero.dev/`, `/diseno-web-sevilla/`, `/desarrollo-software-medida/`, `/automatizaciones/`, `/inteligencia-artificial/`, `/seo-local-sevilla/`, `/tienda-online-sevilla/`, `/web-para-restaurantes-sevilla/`, `/web-para-clinicas-sevilla/`, `/web-para-comercios-sevilla/` y `/web-para-abogados-gestorias-sevilla/`. El contexto de preview fue local y no representa datos de campo de usuarios reales.
- El hero de servicios es textual. No existe evidencia suficiente para declarar un recurso `fetchpriority="high"`, `loading="eager"` o `preload` como candidato LCP.

## Métricas no disponibles y limitaciones
- LCP: no disponible; no se ejecutaron Lighthouse, Playwright ni PSI porque no están instalados en el entorno.
- INP: no disponible por la misma limitación de tooling.
- CLS: no disponible por la misma limitación de tooling.
- Datos de campo CrUX/PSI/GA4: no disponibles; no hay acceso o exportación autorizada en este cierre.
- No se identificó el elemento LCP real de home ni de las plantillas mediante medición de laboratorio o de campo.

## Decisión
No se cambia código en SEO-04. No se añaden `fetchpriority="high"`, `loading="eager"`, `<link rel="preload">` ni otras optimizaciones de imágenes/fuentes por intuición. El baseline local queda documentado como completado; la medición real de CWV/LCP permanece pendiente hasta disponer de PSI/CrUX/GA4 o de un entorno con Lighthouse/Playwright y una metodología reproducible.

## Criterios de aceptación
- [x] Fuente, fecha, URLs y contexto quedan registrados.
- [ ] LCP, INP y CLS medidos con tooling de laboratorio o datos de campo: pendiente; no hay métricas disponibles porque faltan Lighthouse/Playwright/PSI y acceso a CrUX/GA4.
- [ ] Elemento LCP real de home y plantillas identificado: pendiente de medición.
- [x] No se aplican prioridades ni preload sin evidencia.
- [x] No se modifica el código ni el lazy loading/dimensiones existentes.

## Reproducibilidad y checks ejecutados
- Build exacto: `npm run build` (OK; 22 páginas, 0 errores, 0 warnings y 1 hint preexistente).
- Preview exacto: `BROWSER=none netlify dev --offline --no-open --dir dist --port 8888`.
- Host/puerto: `localhost:8888`.
- Petición exacta: `curl -sSIL --max-redirs 0 http://localhost:8888<ruta>`; se comprobó la home y las 10 rutas listadas arriba, con `HTTP 200`.
- URLs: `http://localhost:8888/`, `/diseno-web-sevilla/`, `/desarrollo-software-medida/`, `/automatizaciones/`, `/inteligencia-artificial/`, `/seo-local-sevilla/`, `/tienda-online-sevilla/`, `/web-para-restaurantes-sevilla/`, `/web-para-clinicas-sevilla/`, `/web-para-comercios-sevilla/` y `/web-para-abogados-gestorias-sevilla/`. No se usaron URLs públicas para esta medición.
- Viewport/dispositivo/conexión: N/A; solo se verificó disponibilidad HTTP local, sin emulación ni medición de rendimiento.
- Runtime harness: N/A; no hay harness de CWV configurado y no se ejecutaron Lighthouse, Playwright ni web-vitals.
- PSI/CrUX/GA4: N/A por falta de acceso o exportación autorizada.
- No se registran métricas LCP/INP/CLS ni se identifica el elemento LCP: quedan pendientes.

## Próximo paso bloqueado por acceso
Obtener acceso o exportación autorizada de PSI/CrUX/GA4, o ejecutar medición de laboratorio móvil y desktop con tooling instalado, registrar LCP/INP/CLS y el elemento LCP por URL, y solo entonces decidir si procede una optimización puntual.
