import type { APIRoute } from "astro";
import { buildAiFaq } from "@/lib/ai-discovery";

// Prerendered at build time (static output): emits dist/ai/faq.json. ADR 0018.
export const GET: APIRoute = () =>
  new Response(JSON.stringify(buildAiFaq(), null, 2), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
