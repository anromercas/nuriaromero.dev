// Preloaded with `node --import` into the isolated build child (NRD-372).
// Answers Places API (New) Place Details from a fixture and logs one line per
// request to the file named by PLACES_STUB_LOG, so a test can count requests
// without ever reaching the real API. Any other URL goes to the original fetch.
import { appendFileSync } from "node:fs";

const PLACES_PREFIX = "https://places.googleapis.com/v1/places/";
const originalFetch = globalThis.fetch;

const fixture = {
  rating: 4.8,
  userRatingCount: 7,
  reviews: [
    {
      rating: 5,
      authorAttribution: { displayName: "Cliente de prueba" },
      originalText: { text: "Reseña de prueba NRD-372" },
      publishTime: "2026-11-01T10:00:00Z",
    },
    {
      rating: 4,
      authorAttribution: { displayName: "Segunda clienta de prueba" },
      originalText: { text: "Segunda reseña NRD-376 que no se cita" },
      publishTime: "2026-10-20T10:00:00Z",
    },
  ],
};

globalThis.fetch = async (input, init) => {
  const url = typeof input === "string" ? input : (input?.url ?? String(input));
  if (!url.startsWith(PLACES_PREFIX)) return originalFetch(input, init);
  if (process.env.PLACES_STUB_LOG) {
    appendFileSync(process.env.PLACES_STUB_LOG, `${url}\n`);
  }
  return new Response(JSON.stringify(fixture), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
