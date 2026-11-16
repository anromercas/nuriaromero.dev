import { decodeEntities } from "./seo-inventory.mjs";

/** Concatenated inner HTML of every <main> element; "" when none. */
export function mainContent(html) {
  return [...html.matchAll(/<main\b[^>]*>([\s\S]*?)<\/main>/gi)]
    .map((match) => match[1])
    .join("\n");
}

/** Visible text: tags stripped, entities decoded, whitespace collapsed, trimmed. */
export function visibleText(html) {
  return decodeEntities(html.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

/** [{ href, text }] for every <a ...>...</a>; href null when absent. */
export function anchorsIn(html) {
  return [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map(
    ([, attrs, inner]) => {
      const href = attrs.match(/\shref\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
      return {
        href: href ? decodeEntities(href[1] ?? href[2]) : null,
        text: visibleText(inner),
      };
    },
  );
}

/** true when <main> holds an <a> whose href === path and whose text includes anchor. */
export function linkInMain(html, path, anchor) {
  return anchorsIn(mainContent(html)).some(
    (link) => link.href === path && link.text.includes(anchor),
  );
}
