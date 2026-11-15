export const METRIC_PATTERN =
  /(?:\b(?:DA|DR|authority score)\s*[:=]\s*\d|\b\d+\s+backlinks?\b|\b\d+\s+dominios?\s+referentes?\b)/gi;

export const KPI_METRIC_PATTERN =
  /(?:\b\d+\s+(?:clics|impresiones|conversiones|consultas|backlinks?)\b|posición\s*[:=]\s*\d)/gi;

const DATED_BASELINE_HEADING = /^## Línea base (\d{4}-\d{2}-\d{2})/;
const SOURCE_LINE = /^[ \t]*(?:[-*][ \t]*)?(?:\*\*)?Fuente:(?:\*\*)?[ \t]*\S/m;
const CAPTURE_LINE =
  /^[ \t]*(?:[-*][ \t]*)?(?:\*\*)?Fecha de captura:(?:\*\*)?[ \t]*(\d{4}-\d{2}-\d{2})(?!\d)/m;

function isRealDate(value) {
  const date = new Date(`${value}T00:00:00Z`);
  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}

/**
 * Returns metric mentions that are not inside a dated, sourced baseline
 * section ("## Línea base YYYY-MM-DD" with a non-empty "Fuente:" and a valid
 * "Fecha de captura: YYYY-MM-DD").
 * @param {string} markdown
 * @param {RegExp} [pattern=METRIC_PATTERN] global regex
 * @returns {{ section: string, match: string }[]}
 */
export function findUnsourcedMetrics(markdown, pattern = METRIC_PATTERN) {
  const sections = markdown.split(/^(?=## )/m);
  const found = [];

  for (const body of sections) {
    const heading = body.startsWith("## ") ? body.split("\n", 1)[0].trim() : "";
    const headingDate = DATED_BASELINE_HEADING.exec(heading);
    const captureDate = CAPTURE_LINE.exec(body);
    const sourced =
      headingDate !== null &&
      isRealDate(headingDate[1]) &&
      SOURCE_LINE.test(body) &&
      captureDate !== null &&
      isRealDate(captureDate[1]);
    if (sourced) continue;

    for (const match of body.matchAll(pattern)) {
      found.push({ section: heading, match: match[0] });
    }
  }

  return found;
}
