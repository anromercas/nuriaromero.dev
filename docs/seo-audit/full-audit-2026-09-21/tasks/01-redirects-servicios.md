# Resolver la doble redirección de servicios migrados
- **ID:** SEO-01
- **Prioridad:** P0
- **Estado:** pendiente
- **Fuente:** [technical.md](../findings/technical.md), secciones 2.2 y resumen de severidad
- **Scope:** Reglas de redirección de las cuatro rutas antiguas `/servicios/<slug>` y sus destinos canónicos con barra final. No incluye otras migraciones.

## Problema
Las cuatro rutas migradas responden como `/servicios/<slug>` → 301 `/<slug>` → 301 `/<slug>/` → 200. La causa documentada es que `public/_redirects` dirige a una URL sin barra final mientras Astro publica en formato directory. La verificación adicional confirma el patrón en `/servicios/diseno-web-sevilla`.

## Objetivo
**Riesgo operativo:** Mantener la cadena desperdicia un salto en URLs de negocio y conserva una inconsistencia de migración.

Hacer que cada URL antigua de servicio llegue directamente con un único 301 a su URL canónica con trailing slash, sin cambiar el contenido ni crear nuevas rutas.

## Criterios de aceptación
- Cada una de las cuatro rutas `/servicios/<slug>` devuelve un único 301 hacia `/<slug>/`.
- La URL final devuelve 200 y conserva canonical, contenido y metadatos esperados.
- No queda una respuesta intermedia 301 hacia la variante sin barra final.
- Las reglas existentes no relacionadas permanecen sin cambios.
- Se documentan las cuatro comprobaciones URL → código → Location en la evidencia de la tarea.

## Dependencias y decisiones abiertas
No hay una decisión de producto abierta. Depende de conservar como canónicas las URLs con barra final y de identificar exactamente las cuatro reglas actuales antes de editar. Coordinar con SEO-02 para que los enlaces internos apunten al mismo destino final.

## Checks sugeridos
- `curl -sSIL` para cada ruta antigua, con seguimiento limitado a dos saltos.
- Comprobar `Location` de cada 301 y código final 200.
- Revisar diff de `public/_redirects` para confirmar alcance exclusivo.

## No hacer
No cambiar la estructura de URLs canónicas, no eliminar redirects útiles, no redirigir a páginas temáticamente distintas y no declarar mejora de ranking.
