// Frontmatter scaffold for a new blog post. A post is always created as a
// draft: the owner publishes it by editing the flag by hand after approval.

export const COVER_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "avif"];

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function validDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

const nonBlank = (value) => typeof value === "string" && value.trim() !== "";

export function buildPostFrontmatter(input) {
  if (Object.hasOwn(input, "draft"))
    throw new Error(
      "the scaffold always sets draft itself: remove the draft input",
    );
  const { slug, title, description, pubDate, cover } = input;
  const tags = input.tags ?? [];
  if (typeof slug !== "string" || !SLUG.test(slug))
    throw new Error(`invalid slug: ${slug}`);
  if (!nonBlank(title)) throw new Error("title must not be blank");
  if (!nonBlank(description)) throw new Error("description must not be blank");
  if (!validDate(pubDate))
    throw new Error(`pubDate must be a real YYYY-MM-DD date: ${pubDate}`);
  if (!cover || typeof cover !== "object") throw new Error("cover is required");
  const file = cover.file;
  if (!nonBlank(file) || /[\\/]/.test(file))
    throw new Error(`cover.file must be a basename: ${file}`);
  const extension = file.split(".").pop().toLowerCase();
  if (!file.includes(".") || !COVER_EXTENSIONS.includes(extension))
    throw new Error(`cover.file needs one of: ${COVER_EXTENSIONS.join(", ")}`);
  if (!nonBlank(cover.alt)) throw new Error("cover.alt must not be blank");
  if (!Array.isArray(tags) || tags.some((t) => !nonBlank(t)))
    throw new Error("tags must be a list of non-blank strings");

  const src = `../../assets/blog/${file}`;
  const data = {
    title,
    description,
    pubDate,
    tags,
    cover: { src, alt: cover.alt },
    draft: true,
  };
  const q = JSON.stringify;
  const text = [
    "---",
    `title: ${q(title)}`,
    `description: ${q(description)}`,
    `pubDate: ${pubDate}`,
    `tags: [${tags.map(q).join(", ")}]`,
    "cover:",
    `  src: ${q(src)}`,
    `  alt: ${q(cover.alt)}`,
    "draft: true",
    "---",
    "",
  ].join("\n");
  return { data, text };
}
