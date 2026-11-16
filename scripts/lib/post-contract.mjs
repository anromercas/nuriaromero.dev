// NRD-225: the contract of a built blog post that a layout change must not
// alter: head metadata, Article and BreadcrumbList JSON-LD, and the visible
// text and links of the Markdown body (the element marked data-post-body).
import { decodeEntities, parsePage } from "./seo-inventory.mjs";
import { anchorsIn, visibleText } from "./main-links.mjs";
import { jsonLdEntities } from "./page-contract.mjs";

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

/** Inner HTML of the element marked data-post-body; throws when absent. */
export function postBodyHtml(html) {
  const open = /<([a-z][\w-]*)\b[^>]*\sdata-post-body(?=[\s=>])[^>]*>/i.exec(
    html,
  );
  if (!open) throw new Error("post body marker not found");
  const tag = open[1].toLowerCase();
  const start = open.index + open[0].length;
  const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, "gi");
  re.lastIndex = start;
  let depth = 1;
  for (let m = re.exec(html); m; m = re.exec(html)) {
    depth += m[1] ? -1 : 1;
    if (depth === 0) return html.slice(start, m.index);
  }
  throw new Error("post body marker not closed");
}

/** Frozen contract of a built post page. */
export function postContract(html) {
  const body = postBodyHtml(html);
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
