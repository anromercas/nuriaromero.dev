// Minimal reader for the blog idea queue (seo/contenido/ideas.json).
// NRD-350 extends it with the full entry shape and the writers; it must keep
// id, question, keyword and status, which the de-duplication requires.
import { readFile } from "node:fs/promises";

export const IDEA_STATUSES = [
  "propuesta",
  "aprobada",
  "rechazada",
  "en curso",
  "publicada",
];
export const DEFAULT_QUEUE_PATH = "seo/contenido/ideas.json";

export function parseIdeaQueue(json) {
  if (json?.version !== 1) throw new Error("idea queue: version must be 1");
  if (!Array.isArray(json.ideas))
    throw new Error("idea queue: ideas must be an array");
  const ideas = json.ideas.map((entry, index) => {
    for (const field of ["id", "question", "keyword"]) {
      if (typeof entry?.[field] !== "string" || entry[field].trim() === "")
        throw new Error(
          `idea queue: entry ${index}: ${field} must be a non-empty string`,
        );
    }
    if (!IDEA_STATUSES.includes(entry.status))
      throw new Error(
        `idea queue: entry ${index}: status must be one of ${IDEA_STATUSES.join(", ")}`,
      );
    return {
      id: entry.id,
      question: entry.question,
      keyword: entry.keyword,
      status: entry.status,
    };
  });
  return { version: 1, ideas };
}

export async function readIdeaQueue(path) {
  let text;
  try {
    text = await readFile(path, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return { version: 1, ideas: [] };
    throw error;
  }
  return parseIdeaQueue(JSON.parse(text));
}
