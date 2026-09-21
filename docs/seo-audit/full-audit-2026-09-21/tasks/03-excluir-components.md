# Excluir `/components/` del build público
- **ID:** SEO-03
- **Prioridad:** P1
- **Estado:** pendiente
- **Fuente:** [technical.md](../findings/technical.md), resumen de severidad; [sitemap.md](../findings/sitemap.md), secciones 2 y 6
- **Scope:** Ruta `/components/` y cualquier mecanismo de exclusión de páginas demo del build/publicación.

## Problema
`/components/` sigue publicado con 200 aunque lleva `noindex`. El sitemap ya lo excluye, por lo que existe una diferencia entre higiene de publicación y señal de indexación.

## Objetivo
**Riesgo operativo:** Mantener una ruta interna pública aumenta superficie indexable y confunde el inventario de producción.

Evitar que la galería o ruta interna `/components/` se publique en producción, manteniendo la exclusión del sitemap y sin romper las herramientas de desarrollo que la necesiten.

## Criterios de aceptación
- En producción, `/components/` deja de devolver 200 público o queda explícitamente bloqueado según la decisión técnica documentada.
- `/components/` no aparece en ningún sitemap generado.
- Las páginas de producción y el proceso de build no pierden componentes usados por rutas públicas.
- Se conserva una vía local/previsualización si el equipo la necesita, documentada en la implementación.

## Dependencias y decisiones abiertas
Decidir si la exclusión se hará eliminando la página, condicionando su generación por entorno o aplicando una regla de hosting. La auditoría no prescribe una única opción. Confirmar si existe uso legítimo de la ruta en previews.

## Checks sugeridos
- Build de producción y listado de rutas generadas.
- `curl -I https://nuriaromero.dev/components/` y comprobación de sitemap.
- Prueba de las páginas públicas que importan componentes compartidos.

## No hacer
No convertir `noindex` en sustituto de una decisión de publicación, no bloquear componentes reutilizados y no tocar robots.txt para ocultar una ruta que ya no deba existir.
