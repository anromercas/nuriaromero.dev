// Turns normalised keyword-data exports into a deterministic shortlist of
// question-shaped blog topics.
import { normaliseTerm } from "./keyword-ownership.mjs";
import { isQuestion } from "./keyword-data.mjs";
import { classifyTopic } from "./blog-pillars.mjs";

const KIND_PRIORITY = ["client-question", "paa", "gsc", "keyword"];
const DEFAULT_LIMIT = 10;

const rank = (kind) => KIND_PRIORITY.indexOf(kind);

function questionOf(item) {
  if (item.question) return item.question;
  const text = item.keyword.trim();
  return `¿${text.charAt(0).toUpperCase()}${text.slice(1)}?`;
}

const isCandidate = (item) =>
  item.kind === "paa" ||
  item.kind === "client-question" ||
  isQuestion(item.question ?? item.keyword);

const maxOf = (a, b) => (a === null ? b : b === null ? a : Math.max(a, b));
const minOf = (a, b) => (a === null ? b : b === null ? a : Math.min(a, b));

function compareNullsLast(a, b, direction) {
  if (a === b) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return direction === "desc" ? b - a : a - b;
}

export function shortlistTopics(datasets, options = {}) {
  const limit = options.limit ?? DEFAULT_LIMIT;
  const merged = new Map();
  const skipped = new Set();

  for (const dataset of datasets) {
    for (const item of dataset.items) {
      if (!isCandidate(item)) {
        skipped.add(normaliseTerm(item.keyword));
        continue;
      }
      const question = questionOf(item);
      const key = normaliseTerm(question);
      const source = { name: dataset.source, date: dataset.date };
      const current = merged.get(key);
      if (!current) {
        merged.set(key, {
          key,
          question,
          keyword: item.keyword,
          kind: item.kind,
          volume: item.volume,
          difficulty: item.difficulty,
          intent: item.intent,
          sources: [source],
        });
        continue;
      }
      if (rank(item.kind) < rank(current.kind)) {
        current.kind = item.kind;
        current.question = question;
        current.keyword = item.keyword;
      }
      current.volume = maxOf(current.volume, item.volume);
      current.difficulty = minOf(current.difficulty, item.difficulty);
      current.intent ??= item.intent;
      if (
        !current.sources.some(
          (s) => s.name === source.name && s.date === source.date,
        )
      )
        current.sources.push(source);
    }
  }

  const candidates = [...merged.values()].map((c) => {
    const fit = classifyTopic(`${c.question} ${c.keyword}`);
    return {
      ...c,
      pillar: fit?.pillar ?? null,
      target: fit?.target ?? null,
      fit: fit ? 1 : 0,
      sources: [...c.sources].sort(
        (a, b) => a.date.localeCompare(b.date) || a.name.localeCompare(b.name),
      ),
    };
  });

  candidates.sort(
    (a, b) =>
      b.fit - a.fit ||
      compareNullsLast(a.volume, b.volume, "desc") ||
      compareNullsLast(a.difficulty, b.difficulty, "asc") ||
      a.question.localeCompare(b.question, "es"),
  );

  return {
    candidates: candidates.slice(0, limit),
    skipped: { notQuestion: skipped.size },
  };
}
