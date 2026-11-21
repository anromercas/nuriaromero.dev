// Drops shortlist candidates the site already owns, answers or has settled.
// Pure functions: callers pass all data in. Coverage is deterministic token
// containment, not semantic similarity.
import { normaliseTerm } from "./keyword-ownership.mjs";

export const STOPWORDS = new Set(
  "a al con de del el en la las lo los mi mis o para por se su sus te tu tus u un una unas unos y".split(
    " ",
  ),
);

const MIN_CONTAINED_TOKENS = 2;

export function topicTokens(text) {
  const tokens = normaliseTerm(text)
    .split(" ")
    .filter((token) => token && !STOPWORDS.has(token));
  return [...new Set(tokens)].sort();
}

const containsAll = (outer, inner) =>
  inner.length >= MIN_CONTAINED_TOKENS && inner.every((t) => outer.includes(t));

export function coveredBy(candidateText, referenceText) {
  const candidate = topicTokens(candidateText);
  const reference = topicTokens(referenceText);
  return containsAll(candidate, reference) || containsAll(reference, candidate);
}

const covers = (candidate, reference) =>
  coveredBy(candidate.question, reference) ||
  coveredBy(candidate.keyword, reference);

function firstReason(candidate, { owners, intents, posts }) {
  for (const owner of owners) {
    if (covers(candidate, owner.keyword))
      return { kind: "owned-intent", ref: owner.url, detail: owner.keyword };
  }
  for (const intent of intents) {
    if (covers(candidate, intent.topic))
      return { kind: "owned-intent", ref: intent.url, detail: intent.topic };
  }
  for (const post of posts) {
    if (!post.draft && covers(candidate, post.title))
      return {
        kind: "published-post",
        ref: `/blog/${post.slug}/`,
        detail: post.title,
      };
  }
  return null;
}

export function dedupeCandidates(candidates, context) {
  const kept = [];
  const dropped = [];
  for (const candidate of candidates) {
    const reason = firstReason(candidate, context);
    if (reason) dropped.push({ candidate, reason });
    else kept.push(candidate);
  }
  return { kept, dropped };
}
