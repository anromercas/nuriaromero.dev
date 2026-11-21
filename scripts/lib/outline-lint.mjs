// Pure parser and linter for the blog pipeline outline (esquema.md).
// Format documented in openspec/changes/nuriaromero-346-pipeline-scripts/design.md.

const FENCE = /^\s*(```|~~~)/;
const SOURCE_REF = /https?:\/\/\S+|`[^`\s]*\/[^`\s]*`/;

/** Split markdown into non-fenced lines paired with the current "## " section. */
function scan(markdown) {
  const h1 = [];
  const sections = new Map();
  const head = [];
  let current = null;
  let inFence = false;
  let fence = null;
  for (const line of markdown.split(/\r?\n/)) {
    const f = line.match(FENCE);
    if (f) {
      if (!inFence) {
        inFence = true;
        fence = f[1];
      } else if (f[1] === fence) {
        inFence = false;
      }
      continue;
    }
    if (inFence) continue;
    if (/^# /.test(line)) {
      h1.push(line.slice(2).trim());
      continue;
    }
    const h2 = line.match(/^## (.*)$/);
    if (h2) {
      current = h2[1].trim();
      if (!sections.has(current)) sections.set(current, []);
      continue;
    }
    (current === null ? head : sections.get(current)).push(line);
  }
  return { h1, head, sections };
}

export function parseOutline(markdown) {
  const { h1, head, sections } = scan(markdown);
  const fields = {};
  for (const line of head) {
    const m = line.match(/^- ([^:]+):\s*(.*)$/);
    if (m) fields[m[1].trim()] = m[2].trim();
  }
  const target = fields["Objetivo de palabras"];
  const items = (name) =>
    (sections.get(name) ?? [])
      .map((l) => l.match(/^\s*[-*] (.*)$/))
      .filter(Boolean)
      .map((m) => m[1].trim());
  return {
    h1,
    fields,
    slug: fields["Slug"] || null,
    keyword: fields["Palabra clave"] || null,
    question: fields["Pregunta"] || null,
    wordTarget: /^[1-9]\d*$/.test(target ?? "") ? Number(target) : null,
    status: fields["Estado"] || null,
    directAnswer: (sections.get("Respuesta directa") ?? []).join("\n").trim(),
    h2: items("Estructura")
      .map((i) => i.match(/^H2:\s*(.*)$/))
      .filter((m) => m && m[1].trim())
      .map((m) => m[1].trim()),
    sources: items("Fuentes"),
  };
}

export function lintOutline(markdown) {
  const o = parseOutline(markdown);
  const errors = [];
  if (o.h1.length === 0) errors.push("missing H1 (a line starting with '# ')");
  if (o.h1.length > 1)
    errors.push(`exactly one H1 is expected, found ${o.h1.length}`);
  if (o.h2.length === 0)
    errors.push("no '- H2: <text>' item under '## Estructura'");
  if (o.wordTarget === null)
    errors.push("'Objetivo de palabras' must be a positive integer");
  if (!o.sources.some((s) => SOURCE_REF.test(s)))
    errors.push(
      "'## Fuentes' needs at least one list item with a URL or a backticked repository path",
    );
  if (!o.directAnswer) errors.push("'## Respuesta directa' is empty");
  return { ok: errors.length === 0, errors };
}

/** True when the outline `Estado` is `aprobado`, optionally followed by a date. */
export function isApproved(outline) {
  return /^aprobado(\s+\(\d{4}-\d{2}-\d{2}\))?$/.test(outline?.status ?? "");
}
