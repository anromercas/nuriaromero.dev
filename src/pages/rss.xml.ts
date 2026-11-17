import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { SITE } from "@/data/site";
import { buildRssFeed } from "@/lib/rss";

// Prerendered at build time (static output): emits dist/rss.xml. ADR 0018.
export const GET: APIRoute = async () => {
  const posts = await getCollection("blog", ({ data }) => !data.draft);

  const xml = buildRssFeed(
    {
      title: "Blog de Nuria Romero",
      link: `${SITE.url}/blog/`,
      description:
        "Artículos sobre SEO local, webs y GEO para negocios locales.",
      language: "es-ES",
      selfUrl: `${SITE.url}/rss.xml`,
    },
    posts.map((post) => ({
      title: post.data.title,
      link: new URL(`/blog/${post.slug}/`, SITE.url).href,
      description: post.data.description,
      pubDate: post.data.pubDate,
    })),
  );

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
};
