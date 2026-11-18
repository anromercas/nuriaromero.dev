// Crawler rules shared by robots.txt (astro.config.mjs) and /.well-known/ai.txt.
export interface CrawlerRule {
  userAgent: string;
  allow?: string | string[];
  disallow?: string | string[];
}

export const CRAWLER_POLICY: CrawlerRule[] = [
  { userAgent: "*", allow: "/" },
  { userAgent: "GPTBot", allow: "/" },
  { userAgent: "OAI-SearchBot", allow: "/" },
  { userAgent: "ClaudeBot", allow: "/" },
  { userAgent: "Claude-Web", allow: "/" },
  { userAgent: "anthropic-ai", allow: "/" },
  { userAgent: "PerplexityBot", allow: "/" },
  { userAgent: "Google-Extended", allow: "/" },
];
