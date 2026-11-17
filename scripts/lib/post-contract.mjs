// NRD-225: the contract of a built blog post that a layout change must not
// alter: head metadata, Article and BreadcrumbList JSON-LD, and the visible
// text and links of the Markdown body (the element marked data-post-body).
import { decodeEntities, parsePage } from "./seo-inventory.mjs";
import { anchorsIn, visibleText } from "./main-links.mjs";
import { jsonLdEntities } from "./page-contract.mjs";
import { bookingUrl as siteBookingUrl } from "../../src/data/site.ts";

const CONTRACT_TYPES = new Set(["Article", "BreadcrumbList"]);

function metaDescription(html) {
  for (const [tag] of html.matchAll(/<meta\b[^>]*>/gi)) {
    if (/\sname\s*=\s*["']description["']/i.test(tag)) {
      const content = tag.match(/\scontent\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
      return decodeEntities(content ? (content[1] ?? content[2]) : "");
    }
  }
  return "";
}

/**
 * Inner HTML of the first element whose opening tag matches openTagRe (the
 * regex must capture the tag name in group 1); closes by balanced same-tag
 * counting. Returns null when no element matches.
 */
export function elementInnerHtml(html, openTagRe) {
  const open = openTagRe.exec(html);
  if (!open) return null;
  const tag = open[1].toLowerCase();
  const start = open.index + open[0].length;
  const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, "gi");
  re.lastIndex = start;
  let depth = 1;
  for (let m = re.exec(html); m; m = re.exec(html)) {
    depth += m[1] ? -1 : 1;
    if (depth === 0) return html.slice(start, m.index);
  }
  throw new Error(`element <${tag}> not closed`);
}

/** Inner HTML of the element marked data-post-body; throws when absent. */
export function postBodyHtml(html) {
  let body;
  try {
    body = elementInnerHtml(
      html,
      /<([a-z][\w-]*)\b[^>]*\sdata-post-body(?=[\s=>])[^>]*>/i,
    );
  } catch {
    throw new Error("post body marker not closed");
  }
  if (body === null) throw new Error("post body marker not found");
  return body;
}

/**
 * Structure every post must keep: one h1, a related links block with a link
 * and a closing section linking to the booking URL.
 */
export function assertPostStructure(html, bookingUrl) {
  const h1 = (html.match(/<h1[\s>]/gi) ?? []).length;
  if (h1 !== 1) throw new Error(`post must have exactly one h1 (found ${h1})`);

  const related = elementInnerHtml(
    html,
    /<(nav)\b[^>]*\saria-label\s*=\s*["']Contenido relacionado["'][^>]*>/i,
  );
  if (related === null || !/<a\b[^>]*\shref\s*=/i.test(related)) {
    throw new Error("related links block not found");
  }

  const closing = elementInnerHtml(
    html,
    /<(section)\b[^>]*\saria-labelledby\s*=\s*["']post-cierre-title["'][^>]*>/i,
  );
  if (
    closing === null ||
    !anchorsIn(closing).some((a) => a.href === bookingUrl)
  ) {
    throw new Error("closing booking link not found");
  }
}

/** Frozen contract of a built post page. */
export function postContract(html, { bookingUrl = siteBookingUrl } = {}) {
  const body = postBodyHtml(html);
  assertPostStructure(html, bookingUrl);
  const page = parsePage(html);
  return {
    title: page.title,
    description: metaDescription(html),
    canonical: page.canonical,
    jsonld: jsonLdEntities(html).filter((entity) =>
      CONTRACT_TYPES.has(entity["@type"]),
    ),
    bodyText: visibleText(body),
    bodyLinks: anchorsIn(body),
  };
}
