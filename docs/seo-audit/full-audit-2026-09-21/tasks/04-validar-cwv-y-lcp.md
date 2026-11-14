# Validar CWV de campo y priorización LCP
- **ID:** SEO-04
- **Prioridad:** P1
- **Estado:** parcial — baseline de laboratorio en producción medida el 2026-11-14 (NRD-18): las 7 URLs en foco cumplen umbrales; datos de campo (CrUX) sin obtener por cuota de PSI agotada
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
- [x] LCP y CLS medidos con Lighthouse de laboratorio y TBT como proxy de INP (2026-11-14, ver «Medición 2026-11-14»). INP de campo: pendiente (sin datos de campo; PSI devolvió 429).
- [x] Elemento LCP real de home y de las 6 páginas de servicio identificado (ver «Medición 2026-11-14»).
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

## Medición 2026-11-14 (NRD-18, baseline de producción antes de NRD-15)

Esta sección reemplaza, para las 7 URLs en foco, la «Baseline verificada» local de 2026-09-21, que se conserva arriba como histórico. Solo medición: no se ha modificado código ni se ha aplicado ninguna optimización. TDD no aplica (medición, sin cambio de comportamiento).

### Condiciones

- **Fecha:** 2026-11-14.
- **Producción:** `https://nuriaromero.dev/` (Netlify, se publica desde `main`). Commit de `main` en el momento: `f4f6bfe` (`origin/main`, tras `git fetch`). Comprobación del paso 1 del plan: el `<title>` de la home en producción («Consultor SEO en Sevilla | Nuria Romero, SEO local y para IA») coincide con el de `git show origin/main:src/pages/index.astro`. No se puede afirmar el commit exacto desplegado más allá de esa coincidencia.
- **Herramienta:** Lighthouse CLI 12.8.2 (`npx -y lighthouse@12.8.2 <url> --form-factor=mobile --output=json --chrome-flags="--headless=new" --quiet`), modo navegación, perfil de Chrome limpio.
- **Navegador:** Google Chrome 157.0.8103.51 (headless nuevo), Node v24.22.0, macOS (Darwin 25.5.0), misma máquina, sin otra carga deliberada.
- **Dispositivo / throttling:** móvil (emulación Moto G Power por defecto de Lighthouse), throttling simulado por defecto (RTT 150 ms, CPU x4, ancho de banda 1,6 Mbps).
- **Muestra:** 3 ejecuciones por URL, secuenciales; se registra la mediana.
- **Umbrales:** LCP <= 2,5 s, CLS <= 0,1, INP <= 200 ms (campo), TBT <= 200 ms (proxy de laboratorio).
- **Informes JSON:** guardados fuera del repo (no se commitean); se adjuntan a NRD-18.
- **Datos de campo:** PageSpeed Insights API v5 sin clave, `strategy=mobile`. Las 7 llamadas devolvieron HTTP 429 (`Quota exceeded for quota metric 'Queries' and limit 'Queries per day'`), por lo que no se obtuvo ni `loadingExperience` ni `originLoadingExperience`. No se inventa ningún dato: figura «sin datos de campo» y se indica el motivo.

### Resultados (medianas de 3 ejecuciones, móvil)

| URL | Fecha | Herramienta y versión | Dispositivo / throttling | LCP | CLS | TBT | Score | Elemento LCP | Campo LCP / INP / CLS (p75) | Veredicto |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | 2026-11-14 | Lighthouse 12.8.2, Chrome 157 | móvil, simulado 150 ms / CPU x4 | 2,08 s | 0,000 | 2 ms | 99 | `img` de perfil del hero (`section#home-hero img`, `perfil-home.*.webp`) | sin datos de campo (PSI 429) | Cumple |
| `/seo-local-sevilla/` | 2026-11-14 | Lighthouse 12.8.2, Chrome 157 | móvil, simulado 150 ms / CPU x4 | 1,78 s | 0,000 | 72 ms | 99 | `p.hero-subtitle` (texto) | sin datos de campo (PSI 429) | Cumple |
| `/diseno-web-sevilla/` | 2026-11-14 | Lighthouse 12.8.2, Chrome 157 | móvil, simulado 150 ms / CPU x4 | 1,78 s | 0,000 | 12 ms | 100 | `h1.text-4xl` (texto) | sin datos de campo (PSI 429) | Cumple |
| `/tienda-online-sevilla/` | 2026-11-14 | Lighthouse 12.8.2, Chrome 157 | móvil, simulado 150 ms / CPU x4 | 1,78 s | 0,000 | 0 ms | 100 | `p.text-xl` (texto) | sin datos de campo (PSI 429) | Cumple |
| `/desarrollo-software-medida/` | 2026-11-14 | Lighthouse 12.8.2, Chrome 157 | móvil, simulado 150 ms / CPU x4 | 1,74 s | 0,000 | 0 ms | 100 | `p.text-xl` (texto) | sin datos de campo (PSI 429) | Cumple |
| `/automatizaciones/` | 2026-11-14 | Lighthouse 12.8.2, Chrome 157 | móvil, simulado 150 ms / CPU x4 | 0,94 s | 0,001 | 0 ms | 100 | `p.text-xl` (texto) | sin datos de campo (PSI 429) | Cumple |
| `/inteligencia-artificial/` | 2026-11-14 | Lighthouse 12.8.2, Chrome 157 | móvil, simulado 150 ms / CPU x4 | 0,93 s | 0,000 | 0 ms | 100 | `p.text-xl` (texto) | sin datos de campo (PSI 429) | Cumple |

Ejecuciones individuales (LCP en s, 3 runs): `/` 2,33 / 2,08 / 2,08; `/seo-local-sevilla/` 1,79 / 1,78 / 1,78; `/diseno-web-sevilla/` 1,68 / 1,79 / 1,78; `/tienda-online-sevilla/` 1,78 / 1,06 / 1,78; `/desarrollo-software-medida/` 1,68 / 1,79 / 1,74; `/automatizaciones/` 0,93 / 0,94 / 1,71; `/inteligencia-artificial/` 0,93 / 0,93 / 1,68. El peor run individual (2,33 s en la home) sigue dentro del umbral.

### Observaciones para comparar con NRD-15

- El elemento LCP de la home es una imagen (retrato del hero); en las seis páginas de servicio es texto, así que no hay recurso de imagen candidato a `fetchpriority`/preload (coherente con la baseline local de 2026-09-21).
- Desglose LCP de la home (run mediano): TTFB 732 ms, retraso de carga 488 ms, carga 570 ms, retraso de render 292 ms. Lighthouse señala `uses-responsive-images` (ahorro estimado 300 ms) y `server-response-time` (43 ms); ninguna supera el umbral, por lo que no se abre seguimiento.
- Las páginas de servicio muestran retraso de render de ~1 050 ms con 0 ms de carga: es el coste simulado de FCP/CSS bloqueante en móvil lento, sin recurso a priorizar.
- CLS máximo observado en una ejecución: 0,009 (`/desarrollo-software-medida/`).
- Limitación: el laboratorio simulado no sustituye al campo; INP real y LCP/CLS p75 de usuarios reales siguen sin conocerse (requiere cuota de PSI, CrUX API con clave o GA4/web-vitals, NRD-17).

## Seguimientos (NRD-37)

Todas las URLs en foco están dentro de los umbrales de laboratorio (LCP <= 2,5 s, CLS <= 0,1, TBT <= 200 ms) el 2026-11-14. No se requiere ningún issue de seguimiento ni ninguna optimización. Salvedad: INP de campo y p75 de LCP/CLS no evaluables hoy (sin datos de campo por cuota de PSI); conviene repetir la consulta de PSI/CrUX más adelante y compararla con la medición posterior a NRD-15.
