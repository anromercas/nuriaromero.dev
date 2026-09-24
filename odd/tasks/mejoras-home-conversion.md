# Feature: mejoras de conversión y confianza en la home

## Objetivo
Mejorar la homepage y el flujo de contacto para presentar mejor la experiencia de Nuria, aumentar la confianza y facilitar que potenciales clientes agenden una primera llamada.

## Problema / por qué
La home todavía depende demasiado de texto, no muestra suficientes señales visuales de experiencia, no tiene un CTA destacado en el header y el contacto obliga a enviar un formulario en lugar de reservar directamente una conversación. Además, la sección de reseñas no está mostrando contenido y hay que aclarar el alcance de eliminar “Sevilla” sin perjudicar las páginas de SEO local.

## Alcance autorizado
- Añadir una imagen profesional nueva y diferenciada en la home.
- Añadir un CTA visible en el header.
- Sustituir el formulario de contacto por un flujo de reserva de primera llamada mediante calendario.
- Acortar el bloque “quién soy” de la home, sin modificar automáticamente la página “Sobre mí”.
- Revisar y retirar “Sevilla” de los textos incluidos en el alcance que se confirme, sin eliminar menciones necesarias en páginas locales o datos SEO sin validación.
- Diagnosticar y resolver la ausencia de reseñas en la home.
- Añadir más recursos visuales en la home, incluyendo gráficas cuando exista contenido real que representar.
- Añadir una sección de hitos inmediatamente debajo del hero.

## Fuera de alcance por defecto
- No borrar “Sevilla” de todo el sitio de forma global: existen páginas y datos de SEO local que pueden necesitarlo.
- No inventar hitos, métricas, resultados, testimonios ni gráficas.
- No eliminar la página “Sobre mí” ni sustituir su imagen sin una decisión específica.
- No elegir un proveedor de calendario ni publicar enlaces de reserva sin confirmar cuenta, disponibilidad, duración y política de cancelación.
- No mostrar reseñas falsas, incompletas o sin fuente verificable.

## Criterios generales
- Mantener el tono cercano, profesional y honesto del sitio.
- Priorizar móvil y no empeorar el espacio reservado del header fijo ni el rendimiento del hero.
- Toda imagen nueva debe tener licencia/autoría confirmada, `alt` útil, formato optimizado y no provocar CLS.
- Toda promesa comercial debe estar respaldada por evidencia disponible.
- Verificar con `npm run build`, revisión responsive y comprobación de los flujos afectados.

## Dependencias y decisiones pendientes
- **Imagen profesional:** Nuria debe facilitar o aprobar el nuevo recurso, o autorizar una generación/selección concreta.
- **Calendario:** hay que confirmar proveedor, URL/embed, duración de la llamada, zona horaria, disponibilidad, datos solicitados y consentimiento.
- **Hitos:** hay que confirmar qué hitos son publicables y qué fechas, proyectos o experiencias pueden mencionarse.
- **Gráficas:** hay que confirmar qué datos reales se pueden visualizar; no usar gráficas decorativas que parezcan métricas de negocio.
- **“Sevilla”:** empezar por la home y textos no locales; revisar después cada aparición antes de modificar datos estructurados, páginas de servicio o páginas de nicho.
- **Reseñas:** confirmar credenciales/configuración de Google Places y el identificador correcto del perfil; si no se dispone de fuente verificable, mostrar una alternativa honesta o dejar la sección fuera.

## TDD y verificación
El modo estricto de TDD está activo a nivel de sesión, pero estas tareas son principalmente de presentación, contenido e integración externa. No existe un test runner de componentes para estos casos. Cada tarea debe usar primero una comprobación reproducible cuando exista (script SEO, build o prueba del flujo), seguida de revisión visual responsive. Las tareas de calendario, reseñas e imágenes requieren además validación de CSP, privacidad, accesibilidad y rendimiento según corresponda.

## Checklist de tareas

- [ ] **T1 — Definir recursos y decisiones bloqueantes antes de editar**
  - **Archivos:** actualizar este documento; no tocar código.
  - **Ruta:** inline, investigación y coordinación; no requiere escritor.
  - Confirmar la imagen profesional nueva, proveedor y configuración del calendario, hitos publicables, fuentes de datos para gráficas y alcance exacto de “Sevilla”.
  - Confirmar si el CTA del header enlazará a calendario, contacto o WhatsApp mientras el calendario no esté disponible.
  - **Aceptación:** las decisiones quedan registradas en este documento antes de ejecutar T2, T4, T6 o T7.
  - **Check:** revisión de dependencias y ausencia de placeholders.

- [x] **T2 — Añadir imagen profesional diferenciada en la home**
  - **Archivos:** modificar `src/pages/index.astro` o crear un componente específico si la composición lo requiere; añadir el recurso aprobado en `public/` o `src/assets/` según el patrón elegido.
  - **Ruta:** delegado, porque implica diseño y más de un archivo si se incorpora un asset nuevo.
  - Usar una imagen distinta de `public/perfil-profesional.webp` y `public/me.jpg`; integrarla en una composición que refuerce la propuesta sin desplazar el H1 ni competir con el CTA.
  - Añadir `alt` descriptivo, dimensiones/aspect ratio y carga optimizada.
  - **Aceptación:** la home muestra la imagen aprobada en desktop y móvil, sin CLS visible, overflow ni pérdida de legibilidad del hero.
  - **Check:** `npm run build`; revisión visual responsive; inspección de formato, `alt`, dimensiones y peso.
  - **Hecho:** se eliminó el fondo ajedrezado con `rembg`, se generó `src/assets/perfil-home.webp` (RGBA, 1157 × 1359, 70 KB) y se integró con `astro:assets` a la derecha del texto en desktop y debajo en móvil. También se relinkearon los logos y la imagen de “Sobre mí” desde `src/assets/`; `git diff --check` y `npm run build` pasan.

- [ ] **T3 — Acortar el bloque “quién soy” de la home**
  - **Archivos:** modificar el bloque de presentación inline de `src/pages/index.astro`; no modificar `src/components/AboutMe.astro` salvo autorización posterior.
  - **Ruta:** inline, un archivo y copy acotada una vez aprobado el texto.
  - Reducir el bloque a una presentación breve que explique quién es Nuria, su experiencia relevante y el resultado que busca para el negocio, evitando repetir el hero.
  - **Aceptación:** el bloque ocupa menos líneas, mantiene información verificable y conserva una ruta clara hacia contacto/servicios.
  - **Check:** `npm run build`; revisión de legibilidad móvil y de ausencia de claims no respaldados.

- [ ] **T4 — Incorporar CTA destacado en el header**
  - **Archivos:** modificar `src/components/Header.astro`; revisar `src/components/Header.astro` y cualquier script de menú móvil asociado.
  - **Ruta:** delegado, porque afecta navegación desktop y móvil y puede tocar más de un archivo.
  - Añadir un único CTA visualmente prioritario con el destino decidido en T1, mantener navegación accesible y asegurar que el CTA funciona dentro del menú móvil.
  - No duplicar varios botones competidores ni romper el header fijo existente.
  - **Aceptación:** el CTA es visible en desktop, accesible en móvil, tiene foco visible, nombre accionable y no provoca overflow ni solapamiento.
  - **Check:** `npm run build`; revisión responsive; prueba de teclado y apertura/cierre del menú móvil.

- [ ] **T5 — Revisar y retirar “Sevilla” con alcance controlado**
  - **Archivos candidatos:** `src/pages/index.astro`, `src/components/Header.astro`, `src/pages/contacto.astro`, `src/pages/sobre-mi.astro`, `src/components/Hero.astro`, `src/components/Projects.astro`, `src/data/site.ts`, `src/lib/schema.ts` y datos de servicios/nichos.
  - **Ruta:** delegado para el inventario y el cambio coordinado; no hacer reemplazo global ciego.
  - Crear un inventario de apariciones clasificadas como: home/copy general, navegación, SEO local intencionado, datos estructurados, páginas de servicio/nicho y contenido editorial. Eliminar solo las apariciones aprobadas; conservar las necesarias para posicionamiento local.
  - **Aceptación:** no quedan menciones no deseadas en el alcance aprobado y se mantienen las menciones locales intencionadas.
  - **Check:** búsqueda reproducible con `rg`; `npm run build`; revisión de `title`, descripciones, schema, enlaces y páginas locales.

- [ ] **T6 — Diagnosticar y resolver la ausencia de reseñas en la home**
  - **Archivos:** revisar `src/components/GoogleReviews.astro`, `src/lib/google-reviews.ts`, `src/data/local-trust.ts`, `src/pages/index.astro`, `.env*`/configuración de despliegue si existe y `public/_headers` si cambia la política de red.
  - **Ruta:** delegado, integración externa y posible configuración de runtime.
  - Verificar por qué faltan `GOOGLE_PLACES_API_KEY`, `GOOGLE_PLACE_ID` o datos de reseñas; comprobar permisos/API, identificador de ficha, respuesta de Google Places y condiciones que hacen que el componente no renderice. Resolver la causa o documentar el bloqueo y dejar una presentación honesta sin datos inventados.
  - **Aceptación:** en producción o entorno de verificación la home muestra reseñas reales con fuente y estado de error controlado, o la sección explica/oculta correctamente la falta de datos sin dejar un bloque vacío.
  - **Check:** script/build; prueba con configuración válida y ausente; validación de CSP, privacidad y manejo de errores.

- [ ] **T7 — Añadir recursos visuales y gráficas basadas en datos reales**
  - **Archivos:** modificar `src/pages/index.astro` y/o crear un componente de sección; añadir assets en `src/assets/` o `public/` según el tipo de recurso.
  - **Ruta:** delegado, porque requiere diseño, contenido y potencialmente varios assets/componentes.
  - Primero definir qué información visual aporta cada recurso. Añadir imágenes o gráficas que expliquen experiencia, proceso, visibilidad o evolución solo cuando existan datos verificables; no usar dashboards genéricos ni porcentajes decorativos.
  - Cuidar contraste, `alt`/texto equivalente, carga diferida fuera del primer viewport y responsive.
  - **Aceptación:** la home gana apoyo visual sin parecer un informe ficticio, mantiene rendimiento y cada gráfica tiene fuente o explicación comprensible.
  - **Check:** `npm run build`; revisión visual móvil/desktop; inspección de peso, accesibilidad y CLS.

- [~] **T8 — Añadir sección de hitos debajo del hero**
  - **Archivos:** crear un componente de hitos si es reutilizable; modificar `src/pages/index.astro`; añadir datos en `src/data/` si el contenido se separa del markup.
  - **Ruta:** delegado, por nueva sección de UI y contenido; un único escritor para implementar en `src/pages/index.astro`.
  - Insertar la sección inmediatamente después de `SectionContainer id="home-hero"`. La usuaria aprobó cuatro hitos cualitativos, presentados como icono y texto, sin cifras inventadas: diseño personalizado, SEO desde la base, experiencia responsive y trato directo.
  - Presentarlos sin cajas: icono destacado arriba, título y subtítulo debajo; en móvil, cuadrícula de dos columnas con iconos y texto compactos. Reducir el espacio entre el hero y la sección.
  - Añadir jerarquía semántica, navegación accesible y comportamiento responsive.
  - **Aceptación:** los hitos se entienden sin contexto adicional, no contienen cifras o logros inventados y la sección no desplaza de forma desproporcionada el CTA principal.
  - **Check:** `npm run build`; revisión visual responsive; comprobación de semántica, enlaces y accesibilidad.
  - **Copy aprobada:** “Diseño personalizado — Cada web parte de tus objetivos, no de una plantilla”; “SEO desde la base — Estructura y contenidos pensados para ser encontrados”; “Experiencia responsive — Una web cuidada en móvil, tablet y ordenador”; “Trato directo — Comunicación cercana durante todo el proyecto”.
  - **Progreso:** sección implementada en `src/pages/index.astro`, con lista semántica, iconos decorativos ocultos a lectores de pantalla y grid responsive. `npm run build` pasó (0 errores; queda el hint existente de `Schema.astro`); verificación del HTML generado confirmó el orden hero → hitos → servicios y los cuatro títulos. La revisión visual en navegador queda pendiente: la conexión CUA agotó el tiempo.
  - **Refinamiento aprobado:** eliminar el aspecto de tarjetas, colocar iconos grandes encima del texto, mantener los cuatro elementos en dos columnas compactas en móvil y acercar los hitos al hero.
  - **Refinamiento implementado:** sin fondos ni bordes de tarjeta; iconos superiores de 36–40 px, tipografía más compacta y dos columnas en móvil/cuatro en pantallas grandes. Se redujo el padding inferior del hero. `npm run build` y comprobación del HTML generado pasan; la revisión visual en navegador sigue pendiente.
  - **Commit de implementación:** `20ba8e46e3a81a7e71c2ef239493196b959956a9` (`feat(home): add trust milestones below hero`).
  - **Commit de refinamiento visual:** `f0db643613ed291758fe6f36b3124118fbc3e562` (`style(home): simplify milestone layout`).
  - **Nota de build ajena a T8:** Google Places devolvió HTTP 403 y Astro omitió el bloque de reseñas, sin impedir el build; diagnosticar en T6.

## Orden recomendado
1. T1 — decisiones y recursos bloqueantes.
2. T6 — diagnóstico de reseñas, porque puede resolverse con configuración antes de tocar UI.
3. T3 — copy corta.
4. T5 — inventario controlado de “Sevilla”.
5. T4 — CTA del header.
6. T2 — imagen profesional.
7. T8 — hitos.
8. T7 — gráficas y recursos visuales.
9. Verificación integrada de home, header, contacto, reseñas y rendimiento.

## Entrega y commits
- Feature sustancial: mantener esta lista como documento de recuperación y actualizarla después de cada tarea.
- Estrategia inicial: `ask-on-risk`; si el alcance supera aproximadamente 400 líneas modificadas, decidir entre `stacked-to-main` y `feature-branch-chain` antes del siguiente commit.
- Cada tarea completada debe cerrar con un commit convencional independiente en una rama de feature; no incluir `Co-Authored-By`.

## Estado
**T2 completada; T8 implementada con revisión visual responsive pendiente.** T1 sigue pendiente para resolver calendario, gráficas, alcance de “Sevilla” y destino del CTA. Rama activa: `feat/home-trust-milestones`.
