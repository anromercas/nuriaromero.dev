// NRD-242: pure build-contract helpers for page freshness (dateModified in
// JSON-LD, the visible update label, blog post dates and sitemap lastmod).
// Each function takes already-read data so tests can feed synthetic pages.
import { jsonLdEntities } from "./page-contract.mjs";

const ISO_8601 =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;
const MTIME_TOLERANCE_MS = 5 * 60 * 1000;
const LEGAL_ROUTES = new Set(["/aviso-legal/", "/privacidad/", "/cookies/"]);
const DATED_TYPES = new Set(["WebPage", "Article", "BlogPosting"]);

const isPost = (route) => /^\/blog\/[^/]+\/$/.test(route);

function timeDatetimes(html, marker) {
  return [
    ...html.matchAll(
      new RegExp(`<time\\b[^>]*\\s${marker}(?=[\\s>=])[^>]*>`, "gi"),
    ),
  ].map((m) => m[0].match(/\sdatetime="([^"]*)"/i)?.[1]);
}

const isNoindex = (html) =>
  /<meta\b[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(html);

/**
 * @param {{ pages: { route: string, html: string, mtimeMs: number }[],
 *           sitemap: { route: string, lastmod?: string }[] }} input
 * @returns {{ failures: string[], dated: number }}
 */
export function freshnessFailures({ pages, sitemap }) {
  const failures = [];
  const articleModified = new Map();
  let dated = 0;

  for (const { route, html, mtimeMs } of pages) {
    const entities = jsonLdEntities(html);
    const webPage = entities.find((e) => e["@type"] === "WebPage");
    const article = entities.find(
      (e) => e["@type"] === "Article" || e["@type"] === "BlogPosting",
    );

    for (const entity of entities.filter((e) => DATED_TYPES.has(e["@type"]))) {
      for (const key of ["dateModified", "datePublished"]) {
        const value = entity[key];
        if (value === undefined) continue;
        if (!ISO_8601.test(value)) {
          failures.push(
            `${route}: ${key} "${value}" is not ISO 8601 with a time zone`,
          );
        } else if (Date.parse(value) > mtimeMs + MTIME_TOLERANCE_MS) {
          failures.push(
            `${route}: ${key} ${value} is later than the build output`,
          );
        }
      }
    }

    if (webPage?.dateModified) dated += 1;

    if (isNoindex(html) && webPage) {
      failures.push(`${route}: noindex page publishes a WebPage node`);
    }

    const labels = timeDatetimes(html, "data-page-updated");
    if (LEGAL_ROUTES.has(route) && labels.length > 0) {
      failures.push(`${route}: legal page shows the update label`);
    }
    for (const datetime of labels) {
      if (!webPage?.dateModified) {
        failures.push(`${route}: update label without WebPage dateModified`);
      } else if (datetime !== webPage.dateModified) {
        failures.push(
          `${route}: update label datetime "${datetime}" differs from dateModified "${webPage.dateModified}"`,
        );
      }
    }

    if (isPost(route) && article) {
      articleModified.set(route, article.dateModified);
      const [published] = timeDatetimes(html, "data-post-published");
      const [updated] = timeDatetimes(html, "data-post-updated");
      if (published !== article.datePublished) {
        failures.push(
          `${route}: "Publicado el" datetime "${published}" differs from Article datePublished "${article.datePublished}"`,
        );
      }
      if (updated !== undefined) {
        if (updated !== article.dateModified) {
          failures.push(
            `${route}: "Actualizado el" datetime "${updated}" differs from Article dateModified "${article.dateModified}"`,
          );
        }
      } else if (article.dateModified !== article.datePublished) {
        failures.push(
          `${route}: Article dateModified differs from datePublished but no "Actualizado el" is shown`,
        );
      }
    }
  }

  for (const { route, lastmod } of sitemap) {
    if (lastmod === undefined) continue;
    if (!isPost(route)) {
      failures.push(`${route}: sitemap lastmod on a non-blog URL`);
    } else if (
      articleModified.has(route) &&
      lastmod !== articleModified.get(route)
    ) {
      failures.push(
        `${route}: sitemap lastmod "${lastmod}" differs from Article dateModified "${articleModified.get(route)}"`,
      );
    }
  }

  return { failures, dated };
}
