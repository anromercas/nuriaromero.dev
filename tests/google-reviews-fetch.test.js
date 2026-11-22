// Behavioral test of src/lib/google-reviews.ts outside the production context
// (NRD-372): credentials set, no Place Details request, one shared promise.
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";

const KEYS = ["CONTEXT", "GOOGLE_PLACES_API_KEY", "GOOGLE_PLACE_ID"];

describe("getGoogleReviews outside production", () => {
  const savedEnv = {};
  const savedFetch = globalThis.fetch;
  const calls = [];
  let getGoogleReviews;

  before(async () => {
    for (const key of KEYS) savedEnv[key] = process.env[key];
    process.env.CONTEXT = "deploy-preview";
    process.env.GOOGLE_PLACES_API_KEY = "test-key";
    process.env.GOOGLE_PLACE_ID = "test-place-id";
    globalThis.fetch = async (...args) => {
      calls.push(args);
      throw new Error("unexpected network request");
    };
    ({ getGoogleReviews } = await import("../src/lib/google-reviews.ts"));
  });

  after(() => {
    for (const key of KEYS) {
      if (savedEnv[key] === undefined) delete process.env[key];
      else process.env[key] = savedEnv[key];
    }
    globalThis.fetch = savedFetch;
  });

  it("returns the same promise, resolves to null and makes no request", async () => {
    const first = getGoogleReviews();
    const second = getGoogleReviews();
    assert.equal(first, second);
    assert.equal(await first, null);
    assert.equal(await second, null);
    assert.equal(calls.length, 0);
  });
});
