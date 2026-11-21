import { defineCollection } from "astro:content";
import { blogSchema } from "./blog-schema";

const blog = defineCollection({
  type: "content",
  schema: ({ image }) => blogSchema(image),
});

export const collections = { blog };
