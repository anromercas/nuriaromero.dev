// Rolling-window request limiter for the Postiz public API (30 requests per hour for the whole API).
// Rule from the owner: a run over the limit waits for the window and continues; no request is ever dropped.
// Every request (including a rejected one) is recorded in a persisted log, so separate runs share the budget.
// Clock, sleep and storage are injected; everything except createFileStore is pure or works on its inputs.

import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

export const HOUR_MS = 3_600_000;
/** Extra wait after the oldest entry leaves the window, against clock skew with the server. */
export const DEFAULT_MARGIN_MS = 5_000;
/** Retries of one request after HTTP 429 before it fails as any other error. */
export const DEFAULT_MAX_RETRIES = 3;

/** Numeric timestamps still inside the window ending at `now`, oldest first. */
export function pruneLog(log, now, windowMs = HOUR_MS) {
  return (Array.isArray(log) ? log : [])
    .filter((t) => Number.isFinite(t) && t > now - windowMs)
    .sort((a, b) => a - b);
}

/**
 * Null when one more request fits in the window at `now`; otherwise the time it fits: when enough of the oldest
 * entries have left the window, plus the margin.
 */
export function waitUntil(
  log,
  { now, limit, windowMs = HOUR_MS, marginMs = DEFAULT_MARGIN_MS },
) {
  const live = pruneLog(log, now, windowMs);
  if (live.length < limit) return null;
  return live[live.length - limit] + windowMs + marginMs;
}

/** Retry-After as a delay in ms: delta seconds or an HTTP date; null when absent or unreadable. */
export function parseRetryAfter(value, now) {
  if (value === null || value === undefined || value === "") return null;
  const text = String(value).trim();
  if (/^\d+$/.test(text)) return Number(text) * 1000;
  const at = Date.parse(text);
  return Number.isNaN(at) ? null : Math.max(0, at - now);
}

/**
 * How `count` requests fit from `now`: used and remaining budget, the number of hour-long batches the run spans
 * and, when it has to wait, the time of its last request (finishAt). Simulates the limiter without sleeping.
 */
export function planRequests({
  log,
  now,
  limit,
  count,
  windowMs = HOUR_MS,
  marginMs = DEFAULT_MARGIN_MS,
}) {
  const live = pruneLog(log, now, windowMs);
  const sim = [...live];
  let t = now;
  let waited = false;
  let batches = 0;
  let batchStart = -Infinity;
  for (let i = 0; i < count; i++) {
    const at = waitUntil(sim, { now: t, limit, windowMs, marginMs });
    if (at !== null) {
      t = at;
      waited = true;
    }
    if (t >= batchStart + windowMs) {
      batches++;
      batchStart = t;
    }
    sim.push(t);
  }
  return {
    limit,
    used: live.length,
    remaining: Math.max(0, limit - live.length),
    count,
    batches,
    finishAt: waited ? t : null,
  };
}

/** Local HH:MM of a timestamp. */
export function formatLocalTime(ms) {
  return new Date(ms).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** One line for the dry run: planned requests, current budget and, when over it, batches and finish time. */
export function describePlan(plan, format = formatLocalTime) {
  const head = `Postiz requests planned: ${plan.count} (${plan.used}/${plan.limit} used in the last hour, ${plan.remaining} left)`;
  if (plan.finishAt === null) return `${head}; fits in the current budget.`;
  return `${head}; over the budget: ${plan.batches} batches, finishing around ${format(plan.finishAt)} (local). A real run waits for the window, so run it in the background.`;
}

/** The line printed before each wait. */
export function waitMessage(
  { reason, used, limit, until },
  format = formatLocalTime,
) {
  return reason === "429"
    ? `Postiz rate limit: HTTP 429 from Postiz, waiting until ${format(until)} (local) to retry`
    : `Postiz rate limit: ${used}/${limit} used, waiting until ${format(until)} (local) to continue`;
}

/**
 * run(fn): waits until the window has room, records the request, calls fn; on HTTP 429 waits (Retry-After, else
 * until the oldest logged request leaves the window) and calls fn again, up to maxRetries, then rethrows.
 * plan(count): planRequests over the stored log, recording nothing.
 * store: { load() -> timestamps, save(timestamps) }; reloaded before each request so concurrent runs share it.
 */
export function createRateLimiter({
  limit,
  windowMs = HOUR_MS,
  marginMs = DEFAULT_MARGIN_MS,
  maxRetries = DEFAULT_MAX_RETRIES,
  now = Date.now,
  sleep = (ms) => new Promise((done) => setTimeout(done, ms)),
  store,
  onWait = () => {},
}) {
  const load = () => pruneLog(store.load(), now(), windowMs);

  async function acquire() {
    for (;;) {
      const log = load();
      const until = waitUntil(log, { now: now(), limit, windowMs, marginMs });
      if (until === null) {
        store.save([...log, now()]);
        return;
      }
      onWait({ reason: "window", used: log.length, limit, until });
      await sleep(Math.max(0, until - now()));
    }
  }

  async function run(fn) {
    for (let attempt = 0; ; attempt++) {
      await acquire();
      try {
        return await fn();
      } catch (error) {
        if (error?.status !== 429 || attempt >= maxRetries) throw error;
        const log = load();
        const delay =
          parseRetryAfter(error.retryAfter, now()) ??
          (log.length ? log[0] + windowMs + marginMs - now() : windowMs);
        const until = now() + Math.max(0, delay);
        onWait({ reason: "429", used: log.length, limit, until });
        await sleep(until - now());
      }
    }
  }

  return {
    run,
    plan: (count) =>
      planRequests({
        log: store.load(),
        now: now(),
        limit,
        count,
        windowMs,
        marginMs,
      }),
  };
}

/** JSON file store { requests: [timestamps] }; a missing or unreadable file reads as an empty log. */
export function createFileStore(path) {
  return {
    load() {
      try {
        const data = JSON.parse(readFileSync(path, "utf8"));
        return Array.isArray(data?.requests) ? data.requests : [];
      } catch {
        return [];
      }
    },
    save(requests) {
      mkdirSync(dirname(path), { recursive: true });
      const tmp = `${path}.${process.pid}.tmp`;
      writeFileSync(tmp, `${JSON.stringify({ requests }, null, 2)}\n`);
      renameSync(tmp, path);
    },
  };
}
