import type { APIRoute } from "astro";
import { buildAiTxt } from "@/lib/ai-discovery";

// Prerendered at build time (static output): emits dist/.well-known/ai.txt. ADR 0018.
export const GET: APIRoute = () =>
  new Response(buildAiTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
