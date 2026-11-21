// NRD-328: contract for the optional blog cover. Pure string parsing over built
// HTML so it runs against fixtures in tests and against dist/ in check-seo-25.

const DEFAULT_MAX_BYTES = 102400;

const attr = (tag, name) => {
  const m = new RegExp(
    `\\s${name}(?:\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+)))?(?=[\\s>/])`,
    "i",
  ).exec(tag);
  if (!m) return undefined;
  return m[1] ?? m[2] ?? m[3] ?? "";
};

const srcsetUrls = (value) =>
  value
    .split(",")
    .map((part) => part.trim().split(/\s+/)[0])
    .filter(Boolean);

const positiveInt = (value) =>
  value !== undefined && /^[1-9]\d*$/.test(value.trim());

function ogImagePath(html) {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    if (attr(tag, "property") !== "og:image") continue;
    const content = attr(tag, "content");
    if (!content) return undefined;
    try {
      const { pathname } = new URL(content, "https://placeholder.invalid");
      return pathname.startsWith("/_astro/") ? pathname : undefined;
    } catch {
      return undefined;
    }
  }
  return undefined;
}

/**
 * @param {{ pages: { route: string, html: string }[],
 *           fileSize: (url: string) => number | undefined,
 *           maxBytes?: number }} input
 * @returns {{ failures: string[], covers: number }}
 */
export function blogCoverFailures({
  pages,
  fileSize,
  maxBytes = DEFAULT_MAX_BYTES,
}) {
  const failures = [];
  let covers = 0;

  for (const { route, html } of pages) {
    const figure =
      /<figure\b[^>]*\bclass="[^"]*\bpost-cover\b[^"]*"[^>]*>([\s\S]*?)<\/figure>/i.exec(
        html,
      );
    if (!figure) continue;
    covers += 1;

    const imgs = (figure[1].match(/<img\b[^>]*>/gi) ?? []).filter(
      (tag) => attr(tag, "data-post-cover") !== undefined,
    );
    if (imgs.length !== 1) {
      failures.push(
        `${route}: empty cover figure (expected exactly one <img data-post-cover>, found ${imgs.length})`,
      );
      continue;
    }
    const img = imgs[0];

    if (!(attr(img, "alt") ?? "").trim())
      failures.push(`${route}: cover img has a missing or blank alt`);
    for (const dim of ["width", "height"]) {
      if (!positiveInt(attr(img, dim)))
        failures.push(`${route}: cover img needs a positive integer ${dim}`);
    }

    const urls = new Set();
    for (const tag of figure[1].match(/<(?:source|img)\b[^>]*>/gi) ?? []) {
      const srcset = attr(tag, "srcset");
      if (srcset) srcsetUrls(srcset).forEach((u) => urls.add(u));
    }
    const src = attr(img, "src");
    if (src) urls.add(src);
    const og = ogImagePath(html);
    if (og) urls.add(og);

    let largest = { url: "", size: -1 };
    for (const url of urls) {
      const size = fileSize(url);
      if (size === undefined) {
        failures.push(`${route}: missing file ${url}`);
        continue;
      }
      if (size > largest.size) largest = { url, size };
    }
    if (largest.size > maxBytes)
      failures.push(
        `${route}: ${largest.url} is ${largest.size} bytes, over the ${maxBytes} byte limit`,
      );
  }

  return { failures, covers };
}
