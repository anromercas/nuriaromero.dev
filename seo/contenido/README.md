# Carpeta de trabajo del blog

Aquí viven los ficheros de trabajo del pipeline de contenido del blog (ideas, temas y esquemas). Esta carpeta está versionada para que las aprobaciones viajen con la PR.

## Estructura

- `ideas.json`: la cola única de ideas (la crea NRD-350). Cada entrada lleva `id`, `question` (la pregunta que responde), `keyword`, `intent`, `volume`, `difficulty`, `target` (página o clúster destino), `pillar` (`seo`, `web`, `ia` o `servicios`), `score`, `source` (`name` y `date`), `status` y `added`.
  - Estados de `status`:
    - `propuesta`: la deja el pipeline al añadir la idea.
    - `aprobada`: la pone la dueña cuando da el visto bueno.
    - `rechazada`: la pone la dueña cuando descarta la idea.
    - `en curso`: la pone el pipeline al empezar tema y esquema.
    - `publicada`: la pone el pipeline cuando la dueña fusiona la PR del artículo.
- `<slug>/tema.md`: tema elegido, pregunta que responde, datos de demanda con fuente y fecha, intención, página destino y `Estado`.
- `<slug>/esquema.md`: H1, lista de H2, palabras clave secundarias, respuesta directa, objetivo de palabras, fuentes y `Estado`. El formato lo valida `scripts/blog-outline-lint.mjs` (NRD-346).

## Qué no va aquí

- Los borradores van a `src/content/blog/<slug>.md` con `draft: true`.
- Las portadas van a `src/assets/blog/`.
- Los exports crudos de DataForSEO y Search Console van a `.claude/state/seo/` (no se versionan).
- El resto de `seo/` (`seo/estudios/`, `seo/ranks/`) no se versiona.

## Reglas

- Nada se publica sin que la dueña fusione la PR.
- Cada afirmación de un borrador cita una fuente listada en `esquema.md`.
- Una sola keyword propietaria por intención (ADR 0012).
- Se hace commit solo de rutas exactas (`git add seo/contenido/<ruta>`), nunca `git add seo/`.
