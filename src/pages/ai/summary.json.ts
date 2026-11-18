import type { APIRoute } from "astro";
import { buildAiSummary } from "@/lib/ai-discovery";

// Prerendered at build time (static output): emits dist/ai/summary.json. ADR 0018.
export const GET: APIRoute = () =>
  new Response(JSON.stringify(buildAiSummary(), null, 2), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
