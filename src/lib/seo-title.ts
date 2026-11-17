import { SITE } from "../data/site.ts";

export const TITLE_SEPARATOR = " | ";

/** Page title with the canonical brand as the only suffix (ADR 0016). */
export function brandedTitle(title: string): string {
  return title.endsWith(SITE.name)
    ? title
    : `${title}${TITLE_SEPARATOR}${SITE.name}`;
}
