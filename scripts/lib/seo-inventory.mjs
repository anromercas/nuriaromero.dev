// Pure helpers for the URL inventory (NRD-22). Dependency-free: regex parsing
// over built HTML, same approach as scripts/check-seo-06.mjs and check-seo-07.mjs.

const ENTITIES = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

export function decodeEntities(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, body) => {
    if (body[0] === "#") {
      const code =
        body[1].toLowerCase() === "x"
          ? parseInt(body.slice(2), 16)
          : parseInt(body.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }
    return ENTITIES[body.toLowerCase()] ?? match;
  });
}

function withTrailingSlash(pathname) {
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

/** @returns {string[]} pathnames with trailing slash, in sitemap order */
export function parseSitemapPaths(xml, origin = "https://nuriaromero.dev") {
  const paths = [];
  for (const match of xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)) {
    const url = new URL(decodeEntities(match[1]), origin);
    paths.push(withTrailingSlash(url.pathname));
  }
  return paths;
}

function stripTags(html) {
  return decodeEntities(
    html
      .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<[^>]+>/g, " "),
  );
}

function attr(tag, name) {
  const m = tag.match(
    new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i"),
  );
  return m ? (m[2] ?? m[3]) : null;
}

function normaliseInternal(href, origin) {
  if (!href || href.startsWith("#")) return null;
  let url;
  try {
    url = new URL(decodeEntities(href), `${origin}/`);
  } catch {
    return null;
  }
  if (url.origin !== origin) return null;
  return withTrailingSlash(url.pathname);
}

/**
 * mainLinks: internal pathnames found in <main>, normalised (no query/fragment, trailing slash)
 */
export function parsePage(html, origin = "https://nuriaromero.dev") {
  const title = (html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "")
    .replace(/\s+/g, " ")
    .trim();

  const metaTag = [...html.matchAll(/<meta\b[^>]*>/gi)]
    .map((m) => m[0])
    .find((tag) => attr(tag, "name")?.toLowerCase() === "description");
  const description = metaTag
    ? decodeEntities(attr(metaTag, "content") ?? "")
    : "";

  const canonicalTag = [...html.matchAll(/<link\b[^>]*>/gi)]
    .map((m) => m[0])
    .find((tag) => attr(tag, "rel")?.toLowerCase() === "canonical");
  const canonical = canonicalTag ? attr(canonicalTag, "href") : null;

  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? "";

  const h1 = [...main.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) =>
    stripTags(m[1]).replace(/\s+/g, " ").trim(),
  );

  const text = stripTags(main).trim();
  const mainWordCount = text ? text.split(/\s+/).length : 0;

  const mainLinks = [];
  for (const m of main.matchAll(/<a\b[^>]*>/gi)) {
    const path = normaliseInternal(attr(m[0], "href"), origin);
    if (path) mainLinks.push(path);
  }

  return {
    title: decodeEntities(title),
    h1,
    metaDescriptionLength: [...description].length,
    canonical,
    mainWordCount,
    mainLinks,
  };
}

/** Distinct other pages whose <main> links to each page; self links ignored. */
export function countInboundLinks(pages) {
  const inbound = new Map([...pages.keys()].map((path) => [path, new Set()]));
  for (const [source, { mainLinks }] of pages) {
    for (const target of mainLinks) {
      if (target !== source && inbound.has(target))
        inbound.get(target).add(source);
    }
  }
  return new Map([...inbound].map(([path, set]) => [path, set.size]));
}

const LEGAL_ROUTES = ["/aviso-legal/", "/privacidad/", "/cookies/"];
const PARKED_EXTRA = ["/seo-para-clinicas-capilares-sevilla/"];

/** @param {{ keywordOwners, intentMatrix, nicheRoutes, serviceRoutes }} intents */
export function classifyPath(path, intents) {
  const {
    keywordOwners = [],
    intentMatrix = [],
    nicheRoutes = [],
    serviceRoutes = [],
  } = intents;

  let status = "support";
  if (nicheRoutes.includes(path) || PARKED_EXTRA.includes(path))
    status = "parked";
  else if (LEGAL_ROUTES.includes(path)) status = "legal";
  else if (path === "/" || serviceRoutes.includes(path)) status = "in-focus";

  const owned = keywordOwners
    .filter((o) => o.url === path)
    .map((o) => o.keyword);
  const topic = intentMatrix.find((row) => row.url === path)?.topic;
  const targetQuery = owned.length ? owned.join("; ") : (topic ?? "none");

  return { status, targetQuery };
}

/**
 * @param {{ page: string, query: string, clicks: number, impressions: number, position: number }[]} rows
 * @returns {{ query: string, pages: typeof rows }[]} queries with >= 2 distinct pages, by total impressions desc
 */
export function findCannibalization(rows) {
  const byQuery = new Map();
  for (const row of rows) {
    if (!byQuery.has(row.query)) byQuery.set(row.query, []);
    byQuery.get(row.query).push(row);
  }
  const total = (pages) => pages.reduce((sum, r) => sum + r.impressions, 0);
  return [...byQuery]
    .map(([query, pages]) => ({
      query,
      pages: pages.sort((a, b) => b.impressions - a.impressions),
    }))
    .filter(({ pages }) => new Set(pages.map((r) => r.page)).size >= 2)
    .sort((a, b) => total(b.pages) - total(a.pages));
}

/** @returns {Map<string, typeof rows>} top N queries per page by impressions */
export function topQueriesByPage(rows, n = 3) {
  const byPage = new Map();
  for (const row of rows) {
    if (!byPage.has(row.page)) byPage.set(row.page, []);
    byPage.get(row.page).push(row);
  }
  return new Map(
    [...byPage].map(([page, list]) => [
      page,
      [...list].sort((a, b) => b.impressions - a.impressions).slice(0, n),
    ]),
  );
}

function toPath(url, origin = "https://nuriaromero.dev") {
  return withTrailingSlash(new URL(url, origin).pathname);
}

/** Adapter for `run.sh gsc_query --dimensions page,query --json`. */
export function fromGscExport(json) {
  return (json.rows ?? []).map((r) => ({
    page: toPath(r.page ?? r.keys?.[0]),
    query: r.query ?? r.keys?.[1],
    clicks: r.clicks,
    impressions: r.impressions,
    position: r.position,
  }));
}

/** Adapter for `run.sh gsc_inspect --batch ... --json`: path -> coverage state and last crawl date. */
export function fromInspectExport(json) {
  const map = new Map();
  for (const item of json.results ?? []) {
    if (!item.url) continue;
    map.set(toPath(item.url), {
      coverageState: item.index_status?.coverage_state ?? "N/D",
      lastCrawl: item.index_status?.last_crawl_time?.slice(0, 10) ?? null,
    });
  }
  return map;
}
