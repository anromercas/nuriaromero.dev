import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createPostizClient,
  PostizError,
  DEFAULT_POSTIZ_URL,
} from "../scripts/lib/postiz-client.mjs";

const KEY = "test-key-123";

function fakeFetch(responses) {
  const calls = [];
  const fetch = async (url, init) => {
    calls.push({ url, init });
    const r = responses.shift();
    return {
      ok: r.status >= 200 && r.status < 300,
      status: r.status,
      headers: new Headers(r.headers ?? {}),
      text: async () =>
        typeof r.body === "string" ? r.body : JSON.stringify(r.body),
    };
  };
  return { fetch, calls };
}

test("default base URL is the owner's self-hosted Postiz", () => {
  assert.equal(DEFAULT_POSTIZ_URL, "https://postiz.nuriaromero.dev");
});

test("listIntegrations sends the raw API key, no Bearer", async () => {
  const { fetch, calls } = fakeFetch([
    { status: 200, body: [{ id: "a", identifier: "x" }] },
  ]);
  const client = createPostizClient({ apiKey: KEY, fetch });
  assert.deepEqual(await client.listIntegrations(), [
    { id: "a", identifier: "x" },
  ]);
  assert.equal(
    calls[0].url,
    "https://postiz.nuriaromero.dev/api/public/v1/integrations",
  );
  assert.equal(calls[0].init.method, "GET");
  assert.equal(calls[0].init.headers.Authorization, KEY);
});

test("upload posts multipart field file and returns id, path and status", async () => {
  const { fetch, calls } = fakeFetch([
    {
      status: 200,
      body: { id: "m1", path: "https://p/u/a.jpg", status: "ready" },
    },
  ]);
  const client = createPostizClient({
    baseUrl: "https://p.example/",
    apiKey: KEY,
    fetch,
  });
  const out = await client.upload({
    name: "01.jpg",
    bytes: new Uint8Array([1, 2, 3]),
    type: "image/jpeg",
  });
  assert.deepEqual(out, {
    id: "m1",
    path: "https://p/u/a.jpg",
    status: "ready",
  });
  assert.equal(calls[0].url, "https://p.example/api/public/v1/upload");
  assert.equal(calls[0].init.method, "POST");
  assert.ok(calls[0].init.body instanceof FormData);
  const file = calls[0].init.body.get("file");
  assert.equal(file.name, "01.jpg");
  assert.equal(file.size, 3);
});

test("createPost sends JSON and returns the Postiz post ids", async () => {
  const { fetch, calls } = fakeFetch([
    { status: 200, body: [{ postId: "p1", integration: "ig1" }] },
  ]);
  const client = createPostizClient({ apiKey: KEY, fetch });
  const out = await client.createPost({ type: "schedule" });
  assert.deepEqual(out, [{ postId: "p1", integration: "ig1" }]);
  assert.equal(
    calls[0].url,
    "https://postiz.nuriaromero.dev/api/public/v1/posts",
  );
  assert.equal(calls[0].init.headers["Content-Type"], "application/json");
  assert.equal(calls[0].init.body, '{"type":"schedule"}');
});

test("an HTTP error is one attempt, carries the status and never the API key", async () => {
  const { fetch, calls } = fakeFetch([
    { status: 429, body: `rate limited for key ${KEY}` },
  ]);
  const client = createPostizClient({ apiKey: KEY, fetch });
  await assert.rejects(client.createPost({}), (e) => {
    assert.ok(e instanceof PostizError);
    assert.equal(e.status, 429);
    assert.match(e.message, /POST \/posts failed with HTTP 429/);
    assert.ok(!e.message.includes(KEY));
    assert.match(e.message, /\[redacted\]/);
    return true;
  });
  assert.equal(calls.length, 1);
});

test("a network failure is reported without the key and without retrying", async () => {
  let n = 0;
  const client = createPostizClient({
    apiKey: KEY,
    fetch: async () => {
      n++;
      throw new Error(`socket closed ${KEY}`);
    },
  });
  await assert.rejects(
    client.listIntegrations(),
    (e) => !e.message.includes(KEY) && e.status === null,
  );
  assert.equal(n, 1);
});

test("the client refuses to start without an API key", () => {
  assert.throws(
    () => createPostizClient({ apiKey: "", fetch: async () => {} }),
    /Postiz API key is missing/,
  );
});

test("a failed call carries the Retry-After header for the rate limiter", async () => {
  const { fetch } = fakeFetch([
    {
      status: 429,
      body: "Too Many Requests",
      headers: { "Retry-After": "120" },
    },
    { status: 500, body: "boom" },
  ]);
  const client = createPostizClient({ apiKey: KEY, fetch });
  await assert.rejects(client.listIntegrations(), (error) => {
    assert.ok(error instanceof PostizError);
    assert.equal(error.status, 429);
    assert.equal(error.retryAfter, "120");
    return true;
  });
  await assert.rejects(client.listIntegrations(), (error) => {
    assert.equal(error.retryAfter, null);
    return true;
  });
});
