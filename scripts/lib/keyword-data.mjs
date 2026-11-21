// Normalised keyword-data contract for the blog pipeline.
// Adapters: normalised format, DataForSEO API envelope, Search Console response.
import { normaliseTerm } from "./keyword-ownership.mjs";

const KINDS = ["paa", "keyword", "gsc", "client-question"];
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const QUESTION_STARTS = [
  "que",
  "como",
  "cuanto",
  "cuanta",
  "cuantos",
  "cuantas",
  "cual",
  "cuales",
  "cuando",
  "donde",
  "por que",
  "quien",
  "quienes",
  "para que",
  "es",
  "se puede",
  "puedo",
  "merece la pena",
  "vale la pena",
];

export function isQuestion(text) {
  if (/[¿?]/.test(text)) return true;
  const norm = normaliseTerm(text);
  return QUESTION_STARTS.some((s) => norm === s || norm.startsWith(`${s} `));
}

const num = (value) => (typeof value === "number" ? value : null);
const str = (value) =>
  typeof value === "string" && value.trim() ? value : null;

function unknown(file) {
  return new Error(`unknown keyword-data shape: ${file ?? "<input>"}`);
}

function fromNormalized(json, file) {
  const items = json.items.map((raw, index) => {
    const question = str(raw?.question);
    const keyword =
      str(raw?.keyword) ?? (question ? normaliseTerm(question) : null);
    if (!keyword)
      throw new Error(
        `invalid keyword-data item ${index}: needs keyword or question: ${file ?? "<input>"}`,
      );
    if (!KINDS.includes(raw.kind))
      throw new Error(
        `invalid keyword-data item ${index}: kind must be one of ${KINDS.join(", ")}: ${file ?? "<input>"}`,
      );
    const item = {
      kind: raw.kind,
      keyword,
      question,
      volume: num(raw.volume),
      difficulty: num(raw.difficulty),
      intent: str(raw.intent),
    };
    if (raw.impressions !== undefined) item.impressions = num(raw.impressions);
    return item;
  });
  return { source: json.source, date: json.date, items };
}

function fromDataForSeo(json, options) {
  const task = json.tasks[0];
  const results = Array.isArray(task?.result) ? task.result : [];
  const items = [];
  for (const entry of results) {
    if (typeof entry?.keyword === "string" && "search_volume" in entry) {
      items.push({
        kind: "keyword",
        keyword: entry.keyword,
        question: null,
        volume: num(entry.search_volume),
        difficulty: null,
        intent: null,
      });
    } else if (Array.isArray(entry?.items)) {
      for (const it of entry.items) {
        if (it?.type === "people_also_ask") {
          for (const q of it.items ?? []) {
            const title = str(q?.title);
            if (!title) continue;
            items.push({
              kind: "paa",
              keyword: normaliseTerm(title),
              question: title,
              volume: null,
              difficulty: null,
              intent: null,
            });
          }
        } else if (typeof it?.keyword === "string") {
          items.push({
            kind: "keyword",
            keyword: it.keyword,
            question: null,
            volume: num(it.keyword_info?.search_volume),
            difficulty: num(it.keyword_properties?.keyword_difficulty),
            intent: str(it.search_intent_info?.main_intent),
          });
        }
        // other SERP item types (organic, ads, ...) carry no topic: ignored
      }
    } else {
      throw unknown(options.file);
    }
  }
  const datetime = str(results[0]?.datetime);
  const date = options.date ?? (datetime ? datetime.slice(0, 10) : null);
  if (!date || !DATE.test(date))
    throw new Error(
      `DataForSEO export needs a date (pass the date option): ${options.file ?? "<input>"}`,
    );
  const fn = str(task?.data?.function);
  return { source: fn ? `dataforseo:${fn}` : "dataforseo", date, items };
}

function fromSearchConsole(json, options) {
  if (!options.date || !DATE.test(options.date))
    throw new Error(
      `Search Console export needs a date (pass the date option): ${options.file ?? "<input>"}`,
    );
  const items = json.rows.map((row) => {
    const query = str(row?.keys?.[0]);
    if (!query) throw unknown(options.file);
    return {
      kind: "gsc",
      keyword: normaliseTerm(query),
      question: null,
      volume: null,
      difficulty: null,
      intent: null,
      impressions: num(row.impressions),
    };
  });
  return { source: "gsc", date: options.date, items };
}

export function normaliseKeywordData(json, options = {}) {
  if (json === null || typeof json !== "object" || Array.isArray(json))
    throw unknown(options.file);
  if (
    typeof json.source === "string" &&
    typeof json.date === "string" &&
    DATE.test(json.date) &&
    Array.isArray(json.items)
  )
    return fromNormalized(json, options.file);
  if (Array.isArray(json.tasks) && json.tasks.length > 0)
    return fromDataForSeo(json, options);
  if (Array.isArray(json.rows)) return fromSearchConsole(json, options);
  throw unknown(options.file);
}
