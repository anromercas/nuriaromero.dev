import { readFileSync } from "node:fs";

const POSTS_DIR = new URL("../../src/content/blog/", import.meta.url);

const parseValue = (raw) => {
  const value = raw.trim();
  if (value.startsWith("[") && value.endsWith("]")) {
    return [...value.matchAll(/"((?:\\.|[^"\\])*)"|'([^']*)'/g)].map(
      (m) => m[1] ?? m[2],
    );
  }
  if (value.startsWith('"') && value.endsWith('"')) {
    return value.slice(1, -1).replace(/\\(["\\])/g, "$1");
  }
  if (value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1);
  return value;
};

/** Parse a blog post: frontmatter fields as strings, body without frontmatter. */
export function readPost(slug) {
  const source = readFileSync(new URL(`${slug}.md`, POSTS_DIR), "utf8");
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) throw new Error(`${slug}: frontmatter not found`);
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (field) data[field[1]] = parseValue(field[2]);
  }
  return { data, body: match[2] };
}

/** Strip Markdown links to their text and remove ** markers. */
export function plainText(markdown) {
  return markdown.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/\*\*/g, "");
}

/** H2 sections in order: heading text and first block (trimmed, up to the first blank line). */
export function sections(body) {
  const result = [];
  const parts = body.split(/^## +(.+)$/m);
  for (let i = 1; i < parts.length; i += 2) {
    const heading = parts[i].trim();
    const lead = parts[i + 1]
      .trim()
      .split(/\r?\n[ \t]*\r?\n/)[0]
      .trim();
    result.push({
      heading,
      lead,
      isParagraph: !/^(?:[-*] |\d+\. |\||>)/.test(lead),
    });
  }
  return result;
}

/** Sentences of a text, split on . ! ? followed by space or end. */
export function sentences(text) {
  return text
    .split(/(?<=[.!?])(?:\s+|$)/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Direct-answer rule (NRD-245): paragraph, 1-2 sentences, 15-45 words. */
export function isDirectAnswer({ lead, isParagraph }) {
  if (!isParagraph) return false;
  const text = plainText(lead);
  const count = sentences(text).length;
  const words = text.split(/\s+/).filter(Boolean).length;
  return count >= 1 && count <= 2 && words >= 15 && words <= 45;
}

const isTableLine = (line) => /^\s*\|.*\|\s*$/.test(line);
const cellsOf = (line) =>
  line
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((cell) => cell.trim());
const isDelimiter = (cells) => cells.every((c) => /^:?-{3,}:?$/.test(c));

const tableLines = (markdown) => {
  const lines = markdown.split(/\r?\n/);
  const start = lines.findIndex(isTableLine);
  if (start === -1) return [];
  const block = [];
  for (let i = start; i < lines.length && isTableLine(lines[i]); i++) {
    block.push(lines[i]);
  }
  return block;
};

/** First GFM table in a Markdown fragment: data rows as arrays of trimmed cells ([] when none). */
export function markdownTable(markdown) {
  return tableLines(markdown).slice(2).map(cellsOf);
}

/** Header row and delimiter row of the first GFM table, as arrays of cells ([] when none). */
export function markdownTableHead(markdown) {
  const [header, delimiter] = tableLines(markdown);
  return header && delimiter && isDelimiter(cellsOf(delimiter))
    ? { header: cellsOf(header), delimiter: cellsOf(delimiter) }
    : { header: [], delimiter: [] };
}

/** Body of the H2 section with this heading, up to the next H2 (trimmed). */
export function sectionText(body, heading) {
  const parts = body.split(/^## +(.+)$/m);
  for (let i = 1; i < parts.length; i += 2) {
    if (parts[i].trim() === heading) return parts[i + 1].trim();
  }
  return "";
}

/** Text before the first H2, trimmed, first block only. */
export function firstParagraph(body) {
  return body
    .split(/^## /m)[0]
    .trim()
    .split(/\r?\n[ \t]*\r?\n/)[0]
    .trim();
}
