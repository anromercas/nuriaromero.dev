import { getLastModified } from "../lib/freshness.ts";

const SERVICES = "src/data/services.ts";

/**
 * Repo-relative sources whose last commit dates each indexable route.
 * Blog posts are not listed: their dates come from frontmatter.
 */
export const pageSources: Readonly<Record<string, readonly string[]>> = {
  "/": ["src/pages/index.astro", SERVICES],
  "/seo-local-sevilla/": ["src/pages/seo-local-sevilla.astro", SERVICES],
  "/seo-para-ia/": ["src/pages/seo-para-ia.astro", SERVICES],
  "/diseno-web-sevilla/": ["src/pages/diseno-web-sevilla.astro", SERVICES],
  "/desarrollo-software-medida/": [
    "src/pages/desarrollo-software-medida.astro",
    SERVICES,
  ],
  "/automatizaciones/": ["src/pages/automatizaciones.astro", SERVICES],
  "/inteligencia-artificial/": [
    "src/pages/inteligencia-artificial.astro",
    SERVICES,
  ],
  "/seo-para-clinicas-capilares-sevilla/": [
    "src/pages/seo-para-clinicas-capilares-sevilla.astro",
    SERVICES,
  ],
  "/tienda-online-sevilla/": [
    "src/pages/tienda-online-sevilla.astro",
    SERVICES,
    "src/data/store-offer.ts",
  ],
  "/web-para-restaurantes-sevilla/": [
    "src/pages/web-para-restaurantes-sevilla.astro",
    "src/data/niches.ts",
  ],
  "/web-para-clinicas-sevilla/": [
    "src/pages/web-para-clinicas-sevilla.astro",
    "src/data/niches.ts",
  ],
  "/web-para-abogados-gestorias-sevilla/": [
    "src/pages/web-para-abogados-gestorias-sevilla.astro",
    "src/data/niches.ts",
  ],
  "/web-para-comercios-sevilla/": [
    "src/pages/web-para-comercios-sevilla.astro",
    "src/data/niches.ts",
  ],
  "/contacto/": ["src/pages/contacto.astro", SERVICES],
  "/sobre-mi/": ["src/pages/sobre-mi.astro"],
  "/portfolio/": ["src/pages/portfolio.astro"],
  "/recursos/": ["src/pages/recursos.astro"],
  "/aviso-legal/": ["src/pages/aviso-legal.astro"],
  "/privacidad/": ["src/pages/privacidad.astro"],
  "/cookies/": ["src/pages/cookies.astro"],
  "/blog/": ["src/pages/blog/index.astro", "src/content/blog"],
};

/** Normalizes to a trailing slash, looks up pageSources, returns the last commit date or undefined. */
export function getPageDateModified(pathname: string): string | undefined {
  const route = pathname.endsWith("/") ? pathname : `${pathname}/`;
  const sources = pageSources[route];
  return sources ? getLastModified(sources) : undefined;
}
