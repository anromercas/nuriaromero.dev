import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  STOPWORDS,
  topicTokens,
  coveredBy,
  dedupeCandidates,
} from "../scripts/lib/topic-dedup.mjs";
import { readPosts } from "../scripts/lib/blog-posts.mjs";

const dir = new URL("./fixtures/blog-pipeline/dedup/", import.meta.url);
const owners = JSON.parse(readFileSync(new URL("owners.json", dir), "utf8"));
const candidate = (question, keyword = question) => ({
  key: question,
  question,
  keyword,
});
const context = (extra = {}) => ({
  owners: owners.keywordOwners,
  intents: owners.intentMatrix,
  posts: [],
  ...extra,
});

test("topicTokens drops stopwords, folds accents, sorts and dedupes", () => {
  assert.deepEqual(topicTokens("¿Cuánto cuesta el SEO local en Sevilla?"), [
    "cuanto",
    "cuesta",
    "local",
    "seo",
    "sevilla",
  ]);
  assert.ok(STOPWORDS.has("del") && !STOPWORDS.has("que"));
});

test("coveredBy: head term inside question, short form inside title", () => {
  assert.equal(
    coveredBy("¿Cuánto cuesta el SEO local en Sevilla?", "seo local sevilla"),
    true,
  );
  assert.equal(
    coveredBy(
      "¿Cuánto cuesta una página web?",
      "¿Cuánto cuesta una página web en Sevilla? Qué influye en el precio",
    ),
    true,
  );
});

test("coveredBy: one-token overlap and unrelated topics are not covered", () => {
  assert.equal(coveredBy("¿Qué es SEO?", "seo local sevilla"), false);
  assert.equal(
    coveredBy("¿Cómo funciona un chatbot?", "seo local sevilla"),
    false,
  );
});

test("owned head term is dropped with owned-intent", () => {
  const c = candidate("¿Cuánto cuesta el SEO local en Sevilla?");
  const { kept, dropped } = dedupeCandidates([c], context());
  assert.equal(kept.length, 0);
  assert.deepEqual(dropped[0].reason, {
    kind: "owned-intent",
    ref: "/seo-local-sevilla/",
    detail: "seo local sevilla",
  });
});

test("intentMatrix topic is dropped with owned-intent", () => {
  const c = candidate("¿Qué es el GEO?");
  const { dropped } = dedupeCandidates([c], context());
  assert.equal(dropped[0].reason.kind, "owned-intent");
  assert.equal(
    dropped[0].reason.ref,
    "/blog/que-es-geo-posicionamiento-ia-negocios-sevilla/",
  );
});

test("published post drops a candidate (real titles)", async () => {
  const posts = await readPosts(
    new URL("../src/content/blog", import.meta.url).pathname,
  );
  assert.ok(posts.length >= 4);
  const c = candidate("¿Cuánto cuesta una página web?");
  const { dropped } = dedupeCandidates([c], context({ posts }));
  assert.equal(dropped[0].reason.kind, "published-post");
  assert.equal(
    dropped[0].reason.ref,
    "/blog/cuanto-cuesta-una-pagina-web-en-sevilla/",
  );
});

test("readPosts reads title and draft flag, sorted by slug", async () => {
  const posts = await readPosts(new URL("posts", dir).pathname);
  assert.deepEqual(posts, [
    {
      slug: "borrador",
      title: "Qué es un chatbot para una clínica",
      draft: true,
    },
    {
      slug: "publicado",
      title: "¿Cuánto cuesta mantener una web al año?",
      draft: false,
    },
  ]);
});

test("draft post does not block; free idea is kept", async () => {
  const posts = await readPosts(new URL("posts", dir).pathname);
  const c = candidate("¿Qué es un chatbot para una clínica?");
  const { kept, dropped } = dedupeCandidates([c], context({ posts }));
  assert.equal(dropped.length, 0);
  assert.deepEqual(kept, [c]);
});
