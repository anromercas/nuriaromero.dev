// Pure RSS 2.0 builder. No imports from astro:* so node --test can load it.

export interface RssChannel {
  title: string;
  link: string;
  description: string;
  language: string;
  selfUrl: string;
}

export interface RssItem {
  title: string;
  link: string;
  description: string;
  pubDate: Date;
}

export function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** RSS 2.0 string; items sorted by pubDate descending; no lastBuildDate. */
export function buildRssFeed(
  channel: RssChannel,
  items: readonly RssItem[],
): string {
  const sorted = [...items].sort(
    (a, b) => b.pubDate.valueOf() - a.pubDate.valueOf(),
  );
  const itemXml = sorted
    .map(
      (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="true">${escapeXml(item.link)}</guid>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${item.pubDate.toUTCString()}</pubDate>
    </item>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(channel.title)}</title>
    <link>${escapeXml(channel.link)}</link>
    <description>${escapeXml(channel.description)}</description>
    <language>${escapeXml(channel.language)}</language>
    <atom:link href="${escapeXml(channel.selfUrl)}" rel="self" type="application/rss+xml"/>
${itemXml}
  </channel>
</rss>
`;
}
