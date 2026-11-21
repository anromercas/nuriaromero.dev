import { z } from "astro/zod";

/**
 * Frontmatter schema of the `blog` collection. The image helper is injected
 * so node tests can build the schema without `astro:content`.
 */
export function blogSchema(image: () => z.ZodTypeAny) {
  return z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    cover: z
      .object({
        src: image(),
        alt: z.string().trim().min(1),
      })
      .strict()
      .optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  });
}
