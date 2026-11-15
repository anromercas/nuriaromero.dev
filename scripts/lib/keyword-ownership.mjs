import { visibleText } from "./main-links.mjs";

/** Lowercase, fold diacritics, collapse non letter/digit runs to one space, trim. */
export function normaliseTerm(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

/** Route of a built file relative to dist/: "index.html" -> "/", "a/b/index.html" -> "/a/b/". */
export function routeOf(relativeFile) {
  const dir = relativeFile
    .replace(/\\/g, "/")
    .replace(/(^|\/)index\.html$/, "");
  return dir ? `/${dir}/` : "/";
}

// PO decision 2026-11-15 (NRD-75 "Observations for the PO"): a listing page that
// repeats its posts' titles in card headings does not target those titles.
export const LISTING_CARD_EXEMPTION = {
  route: "/blog/",
  cardHref: /^\/blog\/[^/"']+\/?$/,
};

function withoutListingCards(html) {
  return html.replace(/<a\b([^>]*)>[\s\S]*?<\/a>/gi, (block, attrs) => {
    const href = attrs.match(/\shref\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
    const value = href ? (href[1] ?? href[2]) : "";
    return LISTING_CARD_EXEMPTION.cardHref.test(value) ? "" : block;
  });
}

const headingTexts = (html, tag) =>
  [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, "gi"))]
    .map((match) => visibleText(match[1]))
    .filter(Boolean);

/** { title, h1[], h2[] } as visible text; the /blog/ card exemption applies to h2 on that route only. */
export function targetedTexts(html, route) {
  const title = visibleText(
    html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "",
  );
  const h2Source =
    route === LISTING_CARD_EXEMPTION.route ? withoutListingCards(html) : html;
  return {
    title,
    h1: headingTexts(html, "h1"),
    h2: headingTexts(h2Source, "h2"),
  };
}

/**
 * @param {Map<string, string>} pages route -> html
 * @param {{ keyword: string, url: string }[]} owners
 */
export function findOwnershipViolations(pages, owners) {
  const violations = [];
  for (const [route, html] of pages) {
    const texts = targetedTexts(html, route);
    const targeted = [
      ...(texts.title ? [["title", texts.title]] : []),
      ...texts.h1.map((text) => ["h1", text]),
      ...texts.h2.map((text) => ["h2", text]),
    ];
    for (const { keyword, url } of owners) {
      if (route === url) continue;
      const term = normaliseTerm(keyword);
      for (const [element, text] of targeted) {
        if (normaliseTerm(text).includes(term)) {
          violations.push({ keyword, owner: url, route, element, text });
        }
      }
    }
  }
  return violations;
}
