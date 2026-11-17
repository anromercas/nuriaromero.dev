// NRD-236: pure og:url / canonical rule for built pages.
const strip = (html) =>
  html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "");

const attr = (tag, name) => {
  const m = tag.match(
    new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"),
  );
  return m ? (m[1] ?? m[2] ?? m[3]) : null;
};

const tags = (html, name) =>
  html.match(new RegExp(`<${name}\\b[^>]*>`, "gi")) ?? [];

/** True when a robots meta has the token noindex or none (comma/space separated). */
export function isNoindex(html) {
  return tags(strip(html), "meta").some(
    (t) =>
      (attr(t, "name") ?? "").toLowerCase() === "robots" &&
      (attr(t, "content") ?? "")
        .toLowerCase()
        .split(/[\s,]+/)
        .some((token) => token === "noindex" || token === "none"),
  );
}

/**
 * Problems of one built page with its og:url and canonical; [] when valid.
 * @param {string} html
 * @returns {string[]}
 */
export function ogUrlProblems(html) {
  const s = strip(html);
  const og = tags(s, "meta")
    .filter((t) => (attr(t, "property") ?? "").toLowerCase() === "og:url")
    .map((t) => attr(t, "content") ?? "");
  const canonicals = tags(s, "link")
    .filter((t) => (attr(t, "rel") ?? "").toLowerCase() === "canonical")
    .map((t) => attr(t, "href") ?? "");
  const problems = [];

  if (isNoindex(html)) {
    if (og.length > 0) problems.push("noindex page must not declare og:url");
    if (canonicals.length > 0)
      problems.push("noindex page must not declare a canonical");
    return problems;
  }

  if (og.length === 0) problems.push("missing og:url");
  if (og.length > 1) problems.push(`expected one og:url, found ${og.length}`);
  if (canonicals.length === 0) problems.push("missing canonical");
  if (canonicals.length > 1)
    problems.push(`expected one canonical, found ${canonicals.length}`);
  if (og.length === 1 && canonicals.length === 1) {
    if (og[0] !== canonicals[0]) problems.push("og:url differs from canonical");
    if (!og[0].startsWith("https://"))
      problems.push("og:url is not absolute https");
    if (!og[0].endsWith("/")) problems.push("og:url lacks trailing slash");
  }
  return problems;
}
