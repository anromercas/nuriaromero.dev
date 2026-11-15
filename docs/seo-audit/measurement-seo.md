# Protocolo de medición SEO

**Fecha de configuración:** 2026-09-21
**Propiedad:** `https://nuriaromero.dev/`
**Responsable:** Nuria Romero
**Estado:** base local preparada; acceso y validación de producción pendientes

## Fuentes, permisos y límites

| Fuente | Propiedad o configuración | Permiso mínimo | Estado local | Pendiente |
| --- | --- | --- | --- | --- |
| Google Search Console | Dominio `nuriaromero.dev` o propiedad URL-prefix `https://nuriaromero.dev/` | Propietaria o usuaria completa para inspección, sitemap y exportes | No se guardan tokens ni exportes en el repositorio | Verificar propiedad, sitemap y permisos humanos |
| Google Analytics 4 | Stream web de `https://nuriaromero.dev/` | Editora para configuración; lectora para informes | Código consent-gated y eventos allowlisted | Confirmar stream, retención y recepción en producción |
| GTM | No habilitado por defecto | Solo tras decisión y container autorizado | No se incluye `GTM-*` ni script de Tag Manager | Decidir si hace falta; documentar container y consentimiento antes de instalarlo |
| PSI / CrUX | URLs públicas y origen | Sin credenciales para PSI web; CrUX depende de disponibilidad de campo | Se puede ejecutar manualmente fuera del repo | Capturar fecha, estrategia, URL y disponibilidad real |

No se almacenan credenciales, tokens, cookies exportadas, datos personales, consultas identificables ni capturas de cuentas en el repositorio. Un ID de medición GA4 es un identificador público de configuración, no una credencial; el despliegue puede sobrescribirlo con `PUBLIC_GA4_MEASUREMENT_ID` sin modificar el código.

## Consentimiento y privacidad

- Antes de cargar la librería de Google, se envía `analytics_storage: denied`, junto con `ad_storage`, `ad_user_data` y `ad_personalization` en `denied`.
- GA4 solo se carga y solo recibe eventos después de aceptar la analítica. Rechazar guarda la preferencia y no activa eventos.
- No se envían nombres, emails, teléfonos, textos de formularios, URLs con query strings, identificadores de usuario ni contenido de mensajes.
- Los parámetros permitidos son contextuales y mínimos: `page_path`, `placement`, `contact_method` (`booking`, `phone`, `email`) y, cuando proceda, un `service_slug` no identificable.
- El formulario sigue siendo una conversión funcional de Formspree; su contenido no se replica en Analytics.
- El consentimiento debe poder revocarse desde la interfaz de cookies. Cambiar la configuración de medición requiere revisar la política de cookies y privacidad.

## Taxonomía de eventos

Los nombres son lower_snake_case y no se crean eventos ad hoc desde componentes.

| Evento | Cuándo | Parámetros permitidos | KPI relacionado |
| --- | --- | --- | --- |
| `page_view` | Cambio de ruta tras `astro:page-load` y consentimiento | `page_path` | Sesiones y páginas vistas |
| `contact_click` | Click en el CTA de reserva, en un enlace `tel:` o en un enlace `mailto:` | `contact_method` (`booking`, `phone` o `email`), `placement`, `service_slug` | Intención de contacto |
| `whatsapp_click` | Click en el CTA de WhatsApp | `placement` | Intención de contacto |
| `form_submit` | Respuesta exitosa de Formspree | `placement` (`contact_form`) | Lead enviado |
| `form_error` | Error de validación, red o proveedor | `placement`, `error_type` genérico | Salud del formulario |
| `generate_lead` | Solo si se decide usar una conversión GA4 separada | `placement`, `service_slug` | Lead atribuido |

`form_submit` y `generate_lead` no deben dispararse juntos para el mismo envío salvo que se documente explícitamente la deduplicación en GA4. La implementación local mantiene la lista de eventos permitidos en `src/scripts/analytics-consent.js`; el cableado (NRD-82) es un único listener delegado en `AnalyticsConsent.astro` que traduce los enlaces de reserva, `tel:`, `mailto:` y `https://wa.me/` a estos eventos, más un evento DOM `site:analytics` que emite el formulario al enviarse correctamente. `placement` es el landmark más cercano del enlace (`header`, `nav`, `main`, `footer`, `aside`) o `page`. Nunca se envían el teléfono, el email, el `href` ni campos del formulario.

## KPIs y línea base

La primera captura debe usar una ventana fija, fecha/hora, zona horaria, filtros, segmentos, propiedad y fuente. Hasta disponer del exporte correspondiente, cada celda permanece como **N/D**, no como cero.

| Área | KPI | Fuente | Ventana inicial | Frecuencia | Estado |
| --- | --- | --- | --- | --- | --- |
| Visibilidad | Clicks, impresiones, CTR, posición media | Search Console | 28 días antes de cada cambio | Semanal; comparativa mensual | Línea base 2026-11-14 (ver abajo) |
| Cobertura | Páginas indexadas, excluidas y motivos | Search Console | Fecha de captura | Semanal tras cambios técnicos | Parcial 2026-11-14: sitemap y URLs `/servicios/` (ver abajo) |
| Demanda | Consultas, páginas y dispositivos | Search Console | Misma ventana que visibilidad | Mensual | Línea base 2026-11-14 (ver abajo) |
| Experiencia | Core Web Vitals: LCP, INP, CLS y disponibilidad de CrUX | CrUX / PSI | Fecha, URL y estrategia documentadas | Tras cambios de plantilla; mensual si hay campo | N/D: ejecución externa pendiente |
| Adquisición | Usuarios/sesiones consentidas y landing pages | GA4 | 28 días antes/después | Mensual | Bloqueado: GA4 no recibe datos (bug NRD-17, ver abajo) |
| Conversión | `contact_click`, `whatsapp_click`, `form_submit`, leads confirmados | GA4 + Formspree | Misma ventana y atribución declarada | Semanal para alertas; mensual | N/D: consentimiento y definición pendientes |

La posición media nunca se usa como KPI único. Los informes distinguen **dato observado**, **estimación**, **limitación** y **decisión**; no se atribuye causalidad a un deploy sin comparación temporal y contexto suficiente.

## Línea base 2026-11-14 (Search Console)

Fuente: Search Console API, propiedad `sc-domain:nuriaromero.dev`, búsqueda web, todos los países y dispositivos, consultada con una cuenta de servicio de solo lectura.
Fecha de captura: 2026-11-14

Ventana pedida: 28 días; la API devolvió datos del 2026-10-17 al 2026-11-11 (26 días con datos; los últimos días aún no están consolidados). CTR en porcentaje.

**Total del sitio:** 1.199 impresiones, 2 clics.

| Página | Clics | Impresiones | CTR | Posición media |
| --- | --- | --- | --- | --- |
| `/diseno-web-sevilla/` | 1 | 570 | 0,18 % | 60,8 |
| `/seo-local-sevilla/` | 0 | 459 | 0 % | 47,6 |
| `/automatizaciones/` | 0 | 41 | 0 % | 27,3 |
| `/sobre-mi/` | 0 | 31 | 0 % | 10,5 |
| `/` | 0 | 30 | 0 % | 27,5 |
| `/desarrollo-software-medida/` | 0 | 16 | 0 % | 28,8 |
| `/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/` | 1 | 13 | 7,69 % | 12,5 |
| `/web-para-restaurantes-sevilla/` | 0 | 8 | 0 % | 8,2 |
| `/web-para-abogados-gestorias-sevilla/` | 0 | 5 | 0 % | 10,6 |
| `/contacto/` | 0 | 5 | 0 % | 5,0 |
| `/web-para-clinicas-sevilla/` | 0 | 1 | 0 % | 7,0 |
| `/inteligencia-artificial/`, `/tienda-online-sevilla/` | 0 | 0 | N/D | N/D: sin impresiones en la ventana |

Otras URLs con impresiones: `/aviso-legal/` (9), `/servicios/automatizaciones/` (4), `/servicios/` (3), `https://n8n.nuriaromero.dev/` (3), `http://nuriaromero.dev/` (1).

**Consultas con más impresiones:** "diseñador web sevilla" (134, pos. 58,4), "diseño paginas web sevilla" (88, pos. 59,7), "seo local sevilla" (84, pos. 31,3), "aplicaciones web a medida sevilla" (61, pos. 70,6), "diseño de paginas web en sevilla" (56, pos. 56,3), "plan seo sevilla" (41, pos. 41,1), "presupuesto seo sevilla" (35, pos. 47,8). Ninguna con clics.

**Clics en reservar (GA4):** N/D. GA4 no ha recibido ningún dato (informe vacío del 2026-10-17 al 2026-11-13). Causa verificada el 2026-11-14 en producción: `src/components/AnalyticsConsent.astro` define `gtag` empujando un array (`dataLayer.push(args)`); gtag.js solo procesa objetos `arguments`, así que ignora `consent`, `js`, `config` y los eventos. Tras aceptar cookies se carga `gtag/js` pero no sale ninguna petición `/g/collect`; con el formato correcto (`function gtag(){dataLayer.push(arguments)}`) la misma página envía `POST region1.google-analytics.com/g/collect` (204). La línea base de GA4 empieza cuando el arreglo esté publicado.

**Sitemap:** Search Console solo tiene enviado `https://nuriaromero.dev/sitemap-0.xml` (2026-07-09, 24 URLs, 0 errores, 0 avisos). `sitemap-index.xml` no está enviado; enviarlo es una acción en la interfaz de Search Console.

**URLs antiguas `/servicios/*`:** en producción todas responden 301 a su ruta nueva (comprobado con `curl` el 2026-11-14). En la inspección de URLs, Google aún muestra estados de rastreos anteriores a la redirección: `/servicios/diseno-web-sevilla/` "Página con redirección"; `/servicios/desarrollo-software-medida/`, `/servicios/automatizaciones/`, `/servicios/inteligencia-artificial/` y `/servicios/` "Rastreada: actualmente sin indexar" (últimos rastreos entre 2026-08-19 y 2026-10-13). Ninguna está indexada. Revisar de nuevo en la próxima captura.

## Línea base 2026-11-15 (verificación de GA4)

Fuente: navegador automatizado (Chromium de Playwright, perfil limpio por prueba) contra `https://nuriaromero.dev/` y contra `pnpm preview` de la rama `feat/NRD-17-measurement-baseline` en `127.0.0.1`, con el mismo ID de medición `G-NCV98R3HW7`; registro de red del navegador (peticiones a `googletagmanager.com` y `google-analytics.com`).
Fecha de captura: 2026-11-15

**Producción, tras carga completa de `/` (el arreglo NRD-67 está publicado desde la promoción del 2026-11-15):**

| Estado | Resultado observado |
| --- | --- |
| Rechazar | Ninguna petición a `googletagmanager.com` ni a `google-analytics.com`. |
| Aceptar (estado limpio) | Carga `www.googletagmanager.com/gtag/js`; `POST region1.google-analytics.com/g/collect` con `en=page_view` responde 204. |
| Aceptar y revocar desde el pie (`#cookie-settings`, desmarcar, guardar) | Tras revocar no sale ninguna petición más; al recargar con la preferencia guardada como rechazada no hay ninguna petición a Google. |

**Eventos de conversión (build de la rama, no en producción todavía):** el cableado de NRD-82 llega a producción con la próxima promoción de `develop` a `main`. Hasta entonces se verificó con `pnpm preview` en localhost enviando a la propiedad real. **Eventos de prueba (2026-11-15, origen `127.0.0.1`): excluir de la línea base.** Cada clic con consentimiento generó un único evento en `/g/collect` (204); sin consentimiento no salió ninguna petición.

| Clic con consentimiento | `en` observado | Parámetros `ep.*` observados |
| --- | --- | --- |
| CTA de reserva (zona de contenido) | `contact_click` | `contact_method=booking`, `placement=nav` |
| CTA de reserva (cabecera) | `contact_click` | `contact_method=booking`, `placement=nav` |
| Teléfono del pie | `contact_click` | `contact_method=phone`, `placement=footer` |
| Email del pie | `contact_click` | `contact_method=email`, `placement=footer` |
| Botón flotante de WhatsApp | `whatsapp_click` | `placement=page` |
| Formulario de contacto (respuesta simulada `ok` de Formspree) | `form_submit` | `placement=contact_form` |
| Reserva tras navegar con View Transitions | `contact_click` | `contact_method=booking`, `placement=nav` (un solo evento) |

Observaciones: no aparece ningún teléfono, email, `href` ni campo del formulario en `ep.*`. Un enlace interno no genera evento de conversión. La medición mejorada de GA4 envía además `scroll` y `form_start`; `form_start` incluye `form_id` y el identificador y nombre del primer campo (no sus valores), ver "Pendientes de la usuaria". `ep.page_path` no aparece en las peticiones observadas (el diseño lo esperaba); no se ha investigado el motivo y la ruta de página no se ha verificado como parámetro del evento.

**Llegada a los informes de GA4:** `ga4_report` (Data API, propiedad `554924129`) devuelve sin filas el periodo 2026-11-12 a 2026-11-14, anterior a la publicación del arreglo; los informes estándar aún no incluyen el 2026-11-15. DebugView es una interfaz que el agente no abre: confirmación de la usuaria pendiente.

## Cadencia y registro de cambios

- **Antes del cambio:** guardar fecha, commit/deploy, rutas afectadas, objetivo, hipótesis y baseline disponible.
- **Después del cambio:** revisar errores de rastreo, sitemap, inspección de URLs representativas, eventos y métricas en la misma ventana; separar dato observado de interpretación.
- **Seguimiento:** revisión semanal de alertas técnicas y mensual de visibilidad, demanda, experiencia y conversiones.
- **Anotaciones:** registrar deploys, redirects, cambios de sitemap, contenidos, campañas y cambios de consentimiento. Las campañas se identifican con UTM solo cuando exista una campaña autorizada; nunca se usan UTMs como evidencia de ranking orgánico.

Plantilla mínima de anotación:

```text
Fecha/hora (Europe/Madrid):
Commit/deploy:
Rutas y sistemas afectados:
Cambio realizado:
Ventana baseline / post-cambio:
Fuente y filtros:
Dato observado:
Estimación (si aplica):
Limitación:
Decisión / siguiente revisión:
```

## Validación reproducible

1. Ejecutar `npm run check:seo-14` para comprobar la política local, el allowlist de eventos, la ausencia de GTM no autorizado y el CSP.
2. Ejecutar `npm run build` y servir `dist/` localmente para comprobar que las rutas generan HTML sin secretos ni scripts de GTM.
3. En producción, con consentimiento de prueba, comprobar en DevTools que el `dataLayer` contiene `consent` y que los eventos autorizados no incluyen PII; repetir con rechazo y confirmar ausencia de carga/eventos GA4.
4. En Search Console, inspeccionar home, sitemap, una página de servicio, una página de nicho y un artículo; guardar solo resultados agregados y fecha, no credenciales.
5. Para PSI/CrUX, anotar URL, dispositivo/estrategia, fecha, disponibilidad y si el dato es laboratorio o campo. Un 404 o ausencia de datos es un resultado válido, no un cero.

## Pendientes humanos y de producción

- Confirmar la propiedad y permisos de Search Console, sitemap activo y URLs representativas.
- Confirmar el stream GA4, la variable de despliegue opcional y la retención compatible con la política de privacidad.
- Decidir objetivos de negocio, eventos de conversión definitivos y frecuencia de revisión.
- Ejecutar validación desplegada con consentimiento real y registrar la primera línea base.
- Autorizar o descartar GTM; mientras no exista la decisión, no se añade container ni se afirma que GTM esté configurado.
