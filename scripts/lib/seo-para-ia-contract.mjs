// NRD-26: pure build contract of /seo-para-ia/ (page, sitemap, llms.txt).
import { countH1 } from "./one-h1.mjs";
import { jsonLdEntities } from "./page-contract.mjs";
import { mainContent, visibleText } from "./main-links.mjs";

export const SEO_PARA_IA_URL = "https://nuriaromero.dev/seo-para-ia/";
export const PROMISE_PATTERN =
  /garantiz|primeras posiciones|te sale en|te recomendar|asegur/i;

const OWN_TYPES = ["Service", "FAQPage", "BreadcrumbList"];

const attr = (tag, name) => {
  const m = tag.match(
    new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"),
  );
  return m ? (m[1] ?? m[2] ?? m[3]) : null;
};

const tags = (html, name) =>
  html.match(new RegExp(`<${name}\\b[^>]*>`, "gi")) ?? [];

const countMatches = (text, re) => (text.match(re) ?? []).length;

/** Text of every answer of every FAQPage entity. */
function faqAnswers(entities) {
  return entities
    .filter((e) => e["@type"] === "FAQPage")
    .flatMap((e) => e.mainEntity ?? [])
    .map((q) => q?.acceptedAnswer?.text ?? "");
}

/**
 * Failures of the built /seo-para-ia/ page, sitemap and llms.txt; [] when the
 * contract holds. Never throws: missing inputs are failures.
 * @param {{ html?: string, sitemap?: string, llms?: string }} input
 * @returns {string[]}
 */
export function seoParaIaFailures({ html, sitemap, llms } = {}) {
  const failures = [];
  if (typeof html === "string") pageFailures(html, failures);
  else failures.push("missing page html");
  if (typeof sitemap === "string") {
    if (!sitemap.includes(`<loc>${SEO_PARA_IA_URL}</loc>`))
      failures.push(`sitemap does not list ${SEO_PARA_IA_URL}`);
  } else failures.push("missing sitemap");
  if (typeof llms === "string") llmsFailures(llms, failures);
  else failures.push("missing llms.txt");
  return failures;
}

function llmsFailures(llms, failures) {
  const lines = llms.split(/\r?\n/);
  const start = lines.findIndex((l) => /^##\s+Servicios\s*$/.test(l));
  let found = false;
  if (start >= 0) {
    for (let i = start + 1; i < lines.length && !/^##\s/.test(lines[i]); i++) {
      if (lines[i].includes(`(${SEO_PARA_IA_URL})`)) found = true;
    }
  }
  if (!found)
    failures.push(
      `llms.txt has no line with (${SEO_PARA_IA_URL}) under "## Servicios"`,
    );
}

function pageFailures(html, failures) {
  const h1Count = countH1(html);
  if (h1Count !== 1) failures.push(`expected 1 <h1>, found ${h1Count}`);
  else {
    const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "";
    if (!visibleText(h1).includes("SEO para IA"))
      failures.push(
        `<h1> must contain "SEO para IA", found "${visibleText(h1)}"`,
      );
  }

  const canonicals = tags(html, "link")
    .filter((t) => (attr(t, "rel") ?? "").toLowerCase() === "canonical")
    .map((t) => attr(t, "href"));
  if (canonicals.length !== 1 || canonicals[0] !== SEO_PARA_IA_URL)
    failures.push(
      `canonical must be exactly ${SEO_PARA_IA_URL}, found ${
        canonicals.length ? canonicals.join(", ") : "none"
      }`,
    );

  let entities = [];
  try {
    entities = jsonLdEntities(html);
  } catch (error) {
    failures.push(`invalid JSON-LD: ${error.message}`);
  }
  for (const type of OWN_TYPES)
    if (!entities.some((e) => e["@type"] === type))
      failures.push(`missing ${type} JSON-LD`);
  for (const e of entities)
    if (e["@type"] === "Service" && "offers" in e)
      failures.push("Service JSON-LD must not declare offers");

  const main = mainContent(html);
  const title = visibleText(
    html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "",
  );
  const description =
    tags(html, "meta")
      .filter((t) => (attr(t, "name") ?? "").toLowerCase() === "description")
      .map((t) => attr(t, "content") ?? "")[0] ?? "";
  const own = entities.filter((e) => OWN_TYPES.includes(e["@type"]));

  const consultor =
    countMatches(main, /consultor/gi) +
    countMatches(title, /consultor/gi) +
    countMatches(description, /consultor/gi) +
    countMatches(JSON.stringify(own), /consultor/gi);
  if (consultor !== 1)
    failures.push(
      `expected 1 "consultor" (main, title, description, own JSON-LD), found ${consultor}`,
    );
  const bylines = countMatches(
    main,
    /<a\b(?=[^>]*\shref\s*=\s*["']\/["'])[^>]*>\s*consultor SEO en Sevilla\s*<\/a>/gi,
  );
  if (bylines !== 1)
    failures.push(
      `expected 1 byline <a href="/">consultor SEO en Sevilla</a> in <main>, found ${bylines}`,
    );

  const scopes = {
    main: visibleText(main),
    title,
    "meta description": description,
    "FAQ answer": faqAnswers(entities).join(" "),
  };
  for (const [where, text] of Object.entries(scopes)) {
    const hit = text.match(PROMISE_PATTERN);
    if (hit) failures.push(`promise wording "${hit[0]}" in ${where}`);
  }
}
