# Feature: agenda de primera reunión con Google Calendar

## Objetivo
Permitir que potenciales clientes reserven una primera reunión de 30 minutos desde cualquier página comercial mediante un CTA global que abre Google Calendar Appointment Schedule en una pestaña nueva, respetando los bloqueos manuales creados en el calendario principal de `nuriaromero.dev@gmail.com`.

## Problema / por qué
La cuenta personal de Google no permite seleccionar directamente el calendario laboral compartido de BBVA. La disponibilidad laboral se mantendrá mediante eventos espejo marcados como `Ocupado` en el calendario principal de la cuenta de reservas. La reserva de la primera llamada pasa a ser el canal principal para conocer el caso y preparar después un presupuesto.

## Alcance autorizado
- Añadir una única URL de reserva compartida desde la configuración del sitio y reutilizarla en todos los CTAs.
- Abrir la booking page oficial de Google Calendar en una pestaña nueva mediante un enlace accesible.
- Convertir el CTA de reserva en la acción principal de la home, contacto, `/seo-local-sevilla/` y las páginas que usan plantillas de servicios/nichos.
- Retirar los CTAs inline de WhatsApp y mantener únicamente el botón flotante global de WhatsApp.
- Mantener la duración inicial en 30 minutos, con Google Meet y el margen configurado en Google Calendar.
- Eliminar el iframe, la ruta `/reserva/` y los cambios de CSP/privacidad que solo fueran necesarios para incrustarlo.
- Verificar accesibilidad, build, navegación externa y que el botón flotante de WhatsApp sigue funcionando.

## Fuera de alcance
- No automatizar la sincronización entre el calendario de BBVA y Gmail.
- No publicar una agenda de 15 minutos en esta primera versión.
- No implementar la API de Google Calendar en esta iteración.
- No sustituir el formulario de contacto completo hasta comprobar que la agenda funciona.
- No añadir dominios de Google a CSP ni documentación de iframe si la integración final es un enlace externo.
- No hacer push ni desplegar; el cambio quedará commiteado localmente en `develop`.

## Decisiones
- Cuenta de reservas: `nuriaromero.dev@gmail.com`.
- Calendario laboral: se bloquea manualmente mediante eventos espejo en Gmail.
- Duración inicial: 30 minutos.
- Integración aprobada: enlace directo a la booking page oficial en una pestaña nueva; no se creará una página `/reserva/` propia en esta iteración.
- La URL oficial recibida queda centralizada en la configuración del sitio; no se duplicará en cada página.

## Ruta y delegación
- Exploración: delegada; confirmó `src/pages/reserva.astro`, patrones de Layout/CTA, CSP, privacidad y checks existentes.
- Implementación: delegada a un único escritor porque afecta a varias rutas/componentes, CSP y posiblemente privacidad.
- Verificación: build, tests existentes, inspección del HTML generado y prueba responsive del flujo.
- TDD efectivo: habilitado; no existe runner de componentes, así que se añadirá primero una comprobación estática enfocada si el patrón existente lo permite y después se ejecutarán build y checks.

## Checklist
- [x] GCR-01 — Recibir el booking URL o snippet oficial de Google Calendar y confirmar el comportamiento del iframe. URL recibida: `https://calendar.google.com/calendar/appointments/schedules/AcZssZ3MCaXahzt3LtR0JLmotWCaTlTd2NAYgMsbewkRE-Kd7Zl-AuRcaI9gb8x1u_CGhGgEiTNQ0Xaq?gv=true`; iframe oficial con `width="100%"`, `height="600"` y sin estilos adicionales.
- [x] GCR-02 — Reemplazar la implementación parcial del iframe por una URL de reserva centralizada y eliminar la ruta `/reserva/` si solo sirve al iframe.
- [x] GCR-03 — Convertir los CTAs globales de home, contacto, servicios y nichos a reserva; retirar CTAs inline de WhatsApp y mantener el botón flotante.
- [x] GCR-04 — Revisar el guard responsive del botón flotante, el menú móvil y los enlaces del footer para que la reserva sea el canal principal sin perder la alternativa flotante.
- [x] GCR-05 — Actualizar copy solo donde describa el proceso comercial: primera llamada para conocer el caso y presupuesto posterior; conservar menciones funcionales de WhatsApp.
- [x] GCR-06 — Añadir regresiones estáticas, ejecutar build/checks y verificar HTML generado en home, SEO local, servicio, nicho y contacto.
- [x] GCR-07 — Commitear el work unit localmente en `develop` con Conventional Commit, sin push. Commit: `639bd6e` (`feat(conversion): make booking the primary CTA`).
- [x] GCR-08 — Corrección acotada: retirar el CTA inline de WhatsApp del footer y conservar exclusivamente `WhatsAppButton.astro` como enlace flotante global; RED y GREEN verificados con el test enfocado.

## Criterios de aceptación
- Todos los CTAs comerciales principales abren la booking page oficial en una pestaña nueva con `noopener noreferrer`.
- La booking page muestra solo disponibilidad configurada en Google y bloquea los eventos espejo marcados como `Ocupado`.
- La home, contacto, SEO local y plantillas comerciales presentan la llamada como primer paso antes del presupuesto.
- No quedan botones inline de WhatsApp; el botón flotante global sigue visible y accesible.
- No se añaden orígenes CSP, proveedores de cookies ni claims comerciales sin evidencia.
- Build y checks aplicables pasan; el cambio queda en un commit local independiente.

## Evidencia de implementación
- El worktree contiene una implementación parcial previa del iframe en `src/pages/reserva.astro`, CTAs en home/contacto, cambios de CSP y documentación de privacidad; debe reconducirse al alcance aprobado de enlace externo antes del commit.
- Test RED y GREEN del iframe existen, pero deberán reemplazarse por regresiones de URL centralizada, CTAs globales y conservación del botón flotante.

## Evidencia de implementación final
- `bookingUrl` queda definido una sola vez en `src/data/site.ts` y es consumido por `src/components/BookingButton.astro`.
- `BookingButton` abre la agenda oficial en pestaña nueva con `target="_blank"` y `rel="noopener noreferrer"`; incorpora icono de calendario decorativo y texto visible.
- Home, contacto, `ServiceLayout` (servicios/nichos), precios, SEO local y CAPILAR LOCAL usan la reserva como CTA de conversión principal; el menú móvil también la expone.
- Se eliminaron los CTAs inline comerciales de WhatsApp/contacto y se conserva `WhatsAppButton.astro` como botón flotante global, sin el guard responsive que podía ocultarlo.
- Corrección posterior: `src/components/Footer.astro` ya no importa ni enlaza `whatsappUrl`; conserva teléfono, LinkedIn y GitHub, mientras `WhatsAppButton.astro` mantiene el único enlace flotante global a WhatsApp.
- Se eliminó `src/pages/reserva.astro`, `src/scripts/whatsapp-button.js`, el `frame-src` de `public/_headers` y las menciones iframe-only de privacidad/cookies.
- Se actualizaron las regresiones estáticas en `tests/google-calendar-reserva.test.js` y el check SEO-12 para validar la agenda en vez de WhatsApp.

## Evidencia de verificación
- RED TDD: `node --test tests/google-calendar-reserva.test.js` falló con 5 subtests antes de la implementación: faltaban `bookingUrl`, `BookingButton` y la eliminación de `/reserva/`/iframe.
- GREEN TDD: `node --test tests/google-calendar-reserva.test.js` pasó: 5/5 tests, 0 fallos.
- Build: `npm run build` terminó con exit 0; Astro reportó 0 errores y 1 hint preexistente en `src/components/seo/Schema.astro:24`.
- SEO: `npm run check:seo-12:dist` pasó; `npm run check:capilar-local` pasó.
- HTML generado: las rutas comerciales revisadas contienen enlaces a `calendar.google.com` con `target="_blank"`/`rel="noopener noreferrer"`, conservan `whatsapp-floating-button` y no generan iframe ni `/reserva/`.
- Higiene: `git diff --check` pasó.
- Corrección footer (TDD): tras añadir la aserción enfocada, `node --test tests/google-calendar-reserva.test.js` falló como se esperaba por `whatsappUrl` en el footer (4/5 OK, 1 fallo); después de retirar el CTA y su import, pasó 5/5, 0 fallos.

## Rutas autorizadas modificadas
`src/data/site.ts`, `src/components/BookingButton.astro`, `src/components/icons/Calendar.astro`, `src/components/services/ServiceHero.astro`, `src/components/services/CTASection.astro`, `src/components/services/PricingCard.astro`, `src/components/Header.astro`, `src/components/Footer.astro`, `src/components/WhatsAppButton.astro`, `src/pages/index.astro`, `src/pages/contacto.astro`, `src/pages/seo-para-clinicas-capilares-sevilla.astro`, `src/pages/privacidad.astro`, `src/pages/cookies.astro`, `src/scripts/whatsapp-button.js` (eliminado), `public/_headers`, `scripts/check-seo-12.mjs`, `tests/google-calendar-reserva.test.js`, `odd/tasks/google-calendar-reserva.md`.

## Próximo paso
Mantener el commit local en `develop` y no hacer push todavía; probar manualmente el enlace de reserva y la experiencia móvil antes de acumular el siguiente lote.

## Revisión final de CTA aprobada
- En cada página comercial debe existir **un único CTA principal de conversión**: reservar la primera sesión.
- El botón de reserva debe tener una jerarquía visual equivalente a la del CTA de WhatsApp actual: color de marca/acento, tamaño y foco claramente visibles, sin competir con otro botón de contacto.
- El botón de reserva debe incluir un icono de calendario coherente con el sistema visual existente, con el icono marcado como decorativo y un texto visible que mantenga el nombre accesible.
- No se añadirán CTAs inline a `/contacto/`, WhatsApp ni formularios como alternativas dentro de los bloques comerciales.
- El WhatsApp se conserva únicamente como botón flotante global y como mención descriptiva cuando forme parte del servicio del cliente, no como canal de captación paralelo.
- La navegación informativa a `/contacto/` puede mantenerse solo donde sea necesaria como página del sitio, pero no como CTA de conversión junto al botón de reserva.
