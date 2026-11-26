import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  HOUR_MS,
  pruneLog,
  waitUntil,
  parseRetryAfter,
  planRequests,
  describePlan,
  waitMessage,
  createRateLimiter,
  createFileStore,
} from "../scripts/lib/rate-limit.mjs";

const T0 = Date.parse("2026-11-24T10:00:00Z");
const MIN = 60_000;

test("pruneLog keeps only the entries inside the rolling window, sorted", () => {
  const log = [T0 - 61 * MIN, T0 - 5 * MIN, T0 - 59 * MIN, T0 - HOUR_MS];
  assert.deepEqual(pruneLog(log, T0), [T0 - 59 * MIN, T0 - 5 * MIN]);
  assert.deepEqual(pruneLog(undefined, T0), []);
  assert.deepEqual(pruneLog(["junk", T0 - MIN], T0), [T0 - MIN]);
});

test("waitUntil is null while the window has room, else when its oldest entry leaves plus the margin", () => {
  const log = [T0 - 50 * MIN, T0 - 40 * MIN, T0 - 30 * MIN];
  assert.equal(waitUntil(log, { now: T0, limit: 4 }), null);
  assert.equal(
    waitUntil(log, { now: T0, limit: 3, marginMs: 1000 }),
    T0 + 10 * MIN + 1000,
  );
  // With more entries than the limit (another tool spent it), the slot frees when enough of them leave.
  assert.equal(
    waitUntil(log, { now: T0, limit: 2, marginMs: 0 }),
    T0 + 20 * MIN,
  );
});

test("parseRetryAfter reads seconds or an HTTP date, else null", () => {
  assert.equal(parseRetryAfter("120", T0), 120_000);
  assert.equal(
    parseRetryAfter(new Date(T0 + 90_000).toUTCString(), T0),
    90_000,
  );
  assert.equal(parseRetryAfter(new Date(T0 - 5000).toUTCString(), T0), 0);
  assert.equal(parseRetryAfter(null, T0), null);
  assert.equal(parseRetryAfter("soon", T0), null);
});

test("planRequests fits a run in the remaining budget or spreads it across hours", () => {
  const log = Array.from({ length: 25 }, (_, i) => T0 - 50 * MIN + i * MIN);
  const fits = planRequests({ log, now: T0, limit: 30, count: 5 });
  assert.deepEqual(fits, {
    limit: 30,
    used: 25,
    remaining: 5,
    count: 5,
    batches: 1,
    finishAt: null,
  });
  const split = planRequests({
    log,
    now: T0,
    limit: 30,
    count: 40,
    marginMs: 0,
  });
  assert.equal(split.remaining, 5);
  // 5 now and 25 as the old entries leave (10:10..10:34): one hour-long batch; then 5 at 11:00 when this
  // run's first ones leave and 5 at 11:10..11:14: a second batch.
  assert.equal(split.batches, 2);
  assert.equal(split.finishAt, T0 + HOUR_MS + 14 * MIN);
  assert.equal(
    planRequests({ log: [], now: T0, limit: 30, count: 0 }).batches,
    0,
  );
});

test("describePlan says the count, the budget and, when over it, the batches and the finish time", () => {
  const fmt = (ms) => new Date(ms).toISOString().slice(11, 16);
  assert.equal(
    describePlan(
      {
        limit: 30,
        used: 25,
        remaining: 5,
        count: 5,
        batches: 1,
        finishAt: null,
      },
      fmt,
    ),
    "Postiz requests planned: 5 (25/30 used in the last hour, 5 left); fits in the current budget.",
  );
  assert.match(
    describePlan(
      {
        limit: 30,
        used: 25,
        remaining: 5,
        count: 40,
        batches: 2,
        finishAt: T0 + HOUR_MS + 14 * MIN,
      },
      fmt,
    ),
    /planned: 40 .*over the budget: 2 batches, finishing around 11:14 \(local\).*background/,
  );
});

test("waitMessage names the usage and the local time it continues", () => {
  const fmt = () => "18:42";
  assert.equal(
    waitMessage({ reason: "window", used: 30, limit: 30, until: 0 }, fmt),
    "Postiz rate limit: 30/30 used, waiting until 18:42 (local) to continue",
  );
  assert.match(
    waitMessage({ reason: "429", used: 3, limit: 30, until: 0 }, fmt),
    /HTTP 429 from Postiz, waiting until 18:42 \(local\) to retry/,
  );
});

function harness({ log = [], limit = 3 } = {}) {
  let now = T0;
  const saved = { log: [...log] };
  const sleeps = [];
  const waits = [];
  const limiter = createRateLimiter({
    limit,
    marginMs: 1000,
    now: () => now,
    sleep: async (ms) => {
      sleeps.push(ms);
      now += ms;
    },
    store: {
      load: () => [...saved.log],
      save: (entries) => {
        saved.log = [...entries];
      },
    },
    onWait: (info) => waits.push(info),
  });
  return {
    limiter,
    saved,
    sleeps,
    waits,
    tick: (ms) => (now += ms),
    now: () => now,
  };
}

test("the limiter records every request and waits for the window instead of dropping one", async () => {
  const h = harness({ log: [T0 - 50 * MIN, T0 - 40 * MIN], limit: 3 });
  const done = [];
  for (const n of [1, 2, 3]) await h.limiter.run(async () => done.push(n));
  assert.deepEqual(done, [1, 2, 3]);
  assert.equal(h.sleeps.length, 2);
  assert.equal(h.sleeps[0], 10 * MIN + 1000);
  assert.equal(h.waits[0].reason, "window");
  assert.equal(h.waits[0].used, 3);
  assert.equal(h.waits[0].limit, 3);
  assert.equal(h.saved.log.length, 3);
  assert.ok(h.saved.log.every((t) => t > h.now() - HOUR_MS));
});

test("the limiter retries the same request after a 429, honouring Retry-After", async () => {
  const h = harness({ limit: 30 });
  let calls = 0;
  const out = await h.limiter.run(async () => {
    calls++;
    if (calls === 1)
      throw Object.assign(new Error("HTTP 429"), {
        status: 429,
        retryAfter: "90",
      });
    return "ok";
  });
  assert.equal(out, "ok");
  assert.equal(calls, 2);
  assert.deepEqual(h.sleeps, [90_000]);
  assert.equal(h.waits[0].reason, "429");
  assert.equal(h.saved.log.length, 2, "the rejected request counts too");
});

test("without Retry-After a 429 waits until the oldest logged request leaves the window, or a full window", async () => {
  const h = harness({ log: [T0 - 45 * MIN], limit: 30 });
  let calls = 0;
  await h.limiter.run(async () => {
    if (++calls === 1)
      throw Object.assign(new Error("HTTP 429"), { status: 429 });
  });
  assert.deepEqual(h.sleeps, [15 * MIN + 1000]);
});

test("the limiter gives up after the maximum retries and rethrows; other errors are not retried", async () => {
  const h = harness({ limit: 30 });
  let calls = 0;
  await assert.rejects(
    h.limiter.run(async () => {
      calls++;
      throw Object.assign(new Error("HTTP 429"), {
        status: 429,
        retryAfter: "1",
      });
    }),
    /HTTP 429/,
  );
  assert.equal(calls, 4, "first try plus 3 retries");
  let other = 0;
  await assert.rejects(
    h.limiter.run(async () => {
      other++;
      throw Object.assign(new Error("HTTP 500"), { status: 500 });
    }),
    /HTTP 500/,
  );
  assert.equal(other, 1);
});

test("plan() reports the run without recording anything", () => {
  const h = harness({ log: [T0 - MIN], limit: 3 });
  const plan = h.limiter.plan(5);
  assert.equal(plan.remaining, 2);
  assert.equal(plan.batches, 2);
  assert.deepEqual(h.saved.log, [T0 - MIN]);
});

test("createFileStore persists the log, creating folders, and reads a missing or broken file as empty", () => {
  const root = mkdtempSync(join(tmpdir(), "rate-limit-"));
  try {
    const path = join(root, "a/b/postiz-requests.json");
    const store = createFileStore(path);
    assert.deepEqual(store.load(), []);
    store.save([T0, T0 + 1]);
    assert.deepEqual(store.load(), [T0, T0 + 1]);
    assert.deepEqual(JSON.parse(readFileSync(path, "utf8")).requests, [
      T0,
      T0 + 1,
    ]);
    writeFileSync(path, "{not json");
    assert.deepEqual(store.load(), []);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
