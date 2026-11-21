// Blog idea queue (seo/contenido/ideas.json): entry validation, scoring,
// de-duplicated merge, pillar-balanced pick, status changes and stable
// serialization. Pure functions except readIdeaQueue; callers pass all data in.
import { readFile } from "node:fs/promises";
import { normaliseTerm } from "./keyword-ownership.mjs";
import { PILLARS } from "./blog-pillars.mjs";
import { dedupeCandidates } from "./topic-dedup.mjs";

export const IDEA_STATUSES = [
  "propuesta",
  "aprobada",
  "rechazada",
  "en curso",
  "publicada",
];
export const DEFAULT_QUEUE_PATH = "seo/contenido/ideas.json";

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_ID_LENGTH = 60;
const FIELD_ORDER = [
  "id",
  "question",
  "keyword",
  "intent",
  "volume",
  "difficulty",
  "target",
  "pillar",
  "score",
  "source",
  "status",
  "added",
];
const STATUS_ORDER = [
  "en curso",
  "aprobada",
  "propuesta",
  "rechazada",
  "publicada",
];
const INTENT_LABEL = {
  informational: "informacional",
  commercial: "comercial",
  transactional: "transaccional",
  navigational: "navegacional",
};
const PRICE_TERMS = [
  "precio",
  "cuanto cuesta",
  "cuanto cobra",
  "presupuesto",
  "contratar",
  "tarifa",
];

export function ideaId(keyword) {
  const tokens = normaliseTerm(keyword).split(" ").filter(Boolean);
  let id = "";
  for (const token of tokens) {
    const next = id ? `${id}-${token}` : token;
    if (next.length > MAX_ID_LENGTH) break;
    id = next;
  }
  return id || tokens.join("-").slice(0, MAX_ID_LENGTH);
}

const isText = (value) => typeof value === "string" && value.trim() !== "";
const isNumberOrNull = (value) =>
  value === null || (typeof value === "number" && Number.isFinite(value));

export function validateIdea(idea) {
  if (idea === null || typeof idea !== "object" || Array.isArray(idea))
    return ["entry: must be an object"];
  const messages = [];
  const bad = (field, problem) => messages.push(`entry ${field}: ${problem}`);
  for (const field of ["id", "question", "keyword", "intent", "target"])
    if (!isText(idea[field])) bad(field, "required");
  for (const field of ["volume", "difficulty"])
    if (!isNumberOrNull(idea[field])) bad(field, "must be a number or null");
  if (!PILLARS.some((p) => p.id === idea.pillar))
    bad("pillar", `must be one of ${PILLARS.map((p) => p.id).join(", ")}`);
  if (typeof idea.score !== "number" || !Number.isFinite(idea.score))
    bad("score", "must be a number");
  if (!isText(idea.source?.name)) bad("source.name", "required");
  if (!isText(idea.source?.date)) bad("source.date", "required");
  else if (!DATE.test(idea.source.date))
    bad("source.date", "must be YYYY-MM-DD");
  if (!IDEA_STATUSES.includes(idea.status))
    bad("status", `must be one of ${IDEA_STATUSES.join(", ")}`);
  if (!isText(idea.added) || !DATE.test(idea.added))
    bad("added", "must be YYYY-MM-DD");
  return messages;
}

export function parseIdeaQueue(json) {
  if (json?.version !== 1) throw new Error("idea queue: version must be 1");
  if (!Array.isArray(json.ideas))
    throw new Error("idea queue: ideas must be an array");
  const ideas = json.ideas.map((entry, index) => {
    const messages = validateIdea(entry);
    if (messages.length > 0)
      throw new Error(
        `idea queue: entry ${index}: ${messages.map((m) => m.replace(/^entry /, "")).join("; ")}`,
      );
    return entry;
  });
  return { version: 1, ideas };
}

export function classifyIntent(candidate) {
  if (candidate.intent && INTENT_LABEL[candidate.intent])
    return INTENT_LABEL[candidate.intent];
  const padded = ` ${normaliseTerm(`${candidate.keyword} ${candidate.question ?? ""}`)} `;
  if (PRICE_TERMS.some((term) => padded.includes(` ${term} `)))
    return "comercial";
  return "informacional";
}

const round3 = (n) => Math.round(n * 1000) / 1000;

export function scoreIdea(candidate) {
  const volume = candidate.volume ?? null;
  const difficulty = candidate.difficulty ?? null;
  const volumeScore =
    volume === null ? 0 : Math.min(1, Math.log10(volume + 1) / 4);
  const easeScore = difficulty === null ? 0.5 : (100 - difficulty) / 100;
  const fit = candidate.pillar ? 1 : 0;
  const citability =
    candidate.kind === "paa" || candidate.kind === "client-question" ? 1 : 0.5;
  return round3(
    0.4 * volumeScore + 0.2 * easeScore + 0.25 * fit + 0.15 * citability,
  );
}

function uniqueId(base, taken) {
  if (!taken.has(base)) return base;
  for (let n = 2; ; n++) if (!taken.has(`${base}-${n}`)) return `${base}-${n}`;
}

export function mergeIdeas(queue, candidates, context) {
  const { kept, dropped: covered } = dedupeCandidates(candidates, {
    owners: context.owners,
    intents: context.intents,
    posts: context.posts,
    queue,
    blockingStatuses: IDEA_STATUSES,
  });
  const dropped = [...covered];
  const taken = new Set(queue.ideas.map((idea) => idea.id));
  const added = [];
  for (const candidate of kept) {
    if (!candidate.pillar) {
      dropped.push({ candidate, reason: { kind: "no-pillar" } });
      continue;
    }
    const source = candidate.sources[0];
    const id = uniqueId(ideaId(candidate.keyword), taken);
    taken.add(id);
    added.push({
      id,
      question: candidate.question,
      keyword: candidate.keyword,
      intent: classifyIntent(candidate),
      volume: candidate.volume ?? null,
      difficulty: candidate.difficulty ?? null,
      target: candidate.target,
      pillar: candidate.pillar,
      score: scoreIdea(candidate),
      source: { name: source.name, date: source.date },
      status: "propuesta",
      added: context.date,
    });
  }
  return {
    queue: { version: 1, ideas: [...queue.ideas, ...added] },
    added,
    dropped,
  };
}

const byScoreThenId = (a, b) => b.score - a.score || a.id.localeCompare(b.id);

export function pickProposals(ideas, n = 4) {
  const sorted = ideas
    .filter((i) => i.status === "propuesta")
    .sort(byScoreThenId);
  const groups = new Map();
  for (const idea of sorted) {
    if (!groups.has(idea.pillar)) groups.set(idea.pillar, []);
    groups.get(idea.pillar).push(idea);
  }
  const lists = [...groups.values()];
  const picked = [];
  for (let round = 0; picked.length < n; round++) {
    let any = false;
    for (const list of lists) {
      if (round < list.length && picked.length < n) {
        picked.push(list[round]);
        any = true;
      }
    }
    if (!any) break;
  }
  return picked;
}

export function setIdeaStatus(queue, id, status) {
  if (!IDEA_STATUSES.includes(status))
    throw new Error(`unknown status "${status}"`);
  if (!queue.ideas.some((idea) => idea.id === id))
    throw new Error(`unknown idea "${id}"`);
  return {
    version: 1,
    ideas: queue.ideas.map((idea) =>
      idea.id === id ? { ...idea, status } : idea,
    ),
  };
}

export function serializeQueue(queue) {
  const ordered = [...queue.ideas]
    .sort(
      (a, b) =>
        STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status) ||
        byScoreThenId(a, b),
    )
    .map((idea) => {
      const out = {};
      for (const field of FIELD_ORDER)
        out[field] =
          field === "source"
            ? { name: idea.source.name, date: idea.source.date }
            : idea[field];
      return out;
    });
  return JSON.stringify({ version: 1, ideas: ordered }, null, 2) + "\n";
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
