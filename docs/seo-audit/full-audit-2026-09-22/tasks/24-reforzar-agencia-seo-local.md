# Reforzar "agencia" en /seo-local-sevilla/ sin tocar el H1 de marca
- **ID:** SEO-24
- **Prioridad:** High
- **Estado:** hecho (2026-09-22)
- **Fuente:** [sxo.md](../findings/sxo.md), sección "Detalle: /seo-local-sevilla/ — mismatch de framing"
- **Scope:** `/seo-local-sevilla/` (copy de página, H2 de apoyo)

## Problema
La auditoría 2026-09-21 verificó con WebSearch real que **9 de 9** resultados orgánicos para "agencia SEO Sevilla" (5.000 búsquedas/mes) usan literalmente la palabra "Agencia" en título o dominio. El `<title>` y H1 de `/seo-local-sevilla/` usan solo "SEO local en Sevilla" (keyword secundaria, 500/mes) — verificado en vivo hoy (2026-09-22), sin cambios: title sigue siendo "SEO local en Sevilla | Auditoría SEO/GEO desde 299 €", sin la palabra "agencia" ni variante semántica cercana. Es el mismo hallazgo, sigue vigente.

**Restricción de negocio explícita** (`.agents/product-marketing-context.md`): Nuria es freelance, no agencia; el H1 recomendado evita literalmente "agencia" por decisión de posicionamiento de marca, con "experta/consultora SEO" como vocabulario de apoyo en el cuerpo.

## Impacto
Medio-Alto: mismatch de framing (no de tipo de página) para la keyword de mayor volumen del negocio (10x más búsquedas que la secundaria); un usuario que escanea el SERP buscando "agencia" no ve el término reflejado.

## Objetivo
Añadir un H2 o primer párrafo tipo "SEO local en Sevilla sin agencia: trato directo con quien hace el trabajo" — usa la palabra "agencia" en contexto (para captar el término y explicar la diferenciación) sin convertirla en el posicionamiento de marca del H1.

## Criterios de aceptación
- La palabra "agencia" (o una construcción que la contenga explícitamente, p. ej. "sin agencia", "no soy una agencia") aparece en un H2 o en el primer párrafo visible de `/seo-local-sevilla/`.
- El H1 de marca ("SEO local en Sevilla" o equivalente) no se sustituye por "agencia SEO Sevilla" — se mantiene el posicionamiento freelance ya decidido.
- Sin claims de posición en Google ni promesas de ranking (restricción de contenido no negociable).
- `npm run check:seo-05`/`check:seo-07` (o el checker que valide title/H1/copy de esta página) siguen en verde.

## Checks sugeridos
- Verificación visual del `<title>`/H1/H2 en vivo tras el cambio.
- Revisión de que no se ha introducido ningún claim prohibido.

## No hacer
No cambiar el H1 a "Agencia SEO Sevilla" ni renombrar el negocio como agencia en ningún punto del sitio — contradiría la decisión de posicionamiento de marca ya documentada en `.agents/product-marketing-context.md`.

## Evidencia de implementación (2026-09-22)

Añadido en `src/pages/seo-local-sevilla.astro` como el primer H2 de la página (dentro del fragment `before-benefits`, justo después del H1/hero, antes del H2 "¿Sales en Google...?" preexistente, que se mantiene sin cambios):

- H2: *"SEO local en Sevilla sin agencia: trato directo con quien hace el trabajo"*
- Párrafo: *"No soy una agencia con varios departamentos y comerciales entre medias: hablas conmigo, la misma persona que audita tu negocio, configura tu ficha de Google Business Profile y programa los datos estructurados de tu web. Precio cerrado desde el principio, sin cuotas ocultas ni intermediarios."*

H1 confirmado sin cambios tras build: *"SEO local en Sevilla para negocios que quieren clientes, no solo aparecer en Google"* (sin la palabra "agencia"). `npm run build` + `check:seo-02` a `check:seo-14` (11 checks) en verde sobre `dist` fresco — ninguno de los checkers existentes valida específicamente la presencia de "agencia", como anticipaba este documento. Sin claims de ranking/posición ni promesas. Detalle completo en `odd/tasks/seo-audit-backlog-2026-09-22.md`.
