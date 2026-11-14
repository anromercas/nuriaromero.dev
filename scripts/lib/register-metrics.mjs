export const METRIC_PATTERN =
  /(?:\b(?:DA|DR|authority score)\s*[:=]\s*\d|\b\d+\s+backlinks?\b|\b\d+\s+dominios?\s+referentes?\b)/gi;

const DATED_BASELINE_HEADING = /^## Línea base \d{4}-\d{2}-\d{2}/;
const SOURCE_LINE = /^\s*(?:[-*]\s*)?(?:\*\*)?Fuente:/im;
const CAPTURE_LINE = /^\s*(?:[-*]\s*)?(?:\*\*)?Fecha de captura:/im;

/**
 * Returns metric mentions that are not inside a dated, sourced baseline
 * section ("## Línea base YYYY-MM-DD" with "Fuente:" and "Fecha de captura:").
 * @param {string} markdown
 * @returns {{ section: string, match: string }[]}
 */
export function findUnsourcedMetrics(markdown) {
  const sections = markdown.split(/^(?=## )/m);
  const found = [];

  for (const body of sections) {
    const heading = body.startsWith("## ") ? body.split("\n", 1)[0].trim() : "";
    const sourced =
      DATED_BASELINE_HEADING.test(heading) &&
      SOURCE_LINE.test(body) &&
      CAPTURE_LINE.test(body);
    if (sourced) continue;

    for (const match of body.matchAll(METRIC_PATTERN)) {
      found.push({ section: heading, match: match[0] });
    }
  }

  return found;
}
