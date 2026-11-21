// Word count of a blog post body compared with the outline target.

const TOKEN = /[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu;

export function stripFrontmatter(markdown) {
  const m = markdown.match(/^---\r?\n[\s\S]*?\r?\n---[ \t]*(?:\r?\n|$)/);
  return m ? markdown.slice(m[0].length) : markdown;
}

function stripFences(text) {
  const out = [];
  let fence = null;
  for (const line of text.split(/\r?\n/)) {
    const f = line.match(/^\s*(```|~~~)/);
    if (f) {
      if (fence === null) fence = f[1];
      else if (f[1] === fence) fence = null;
      continue;
    }
    if (fence === null) out.push(line);
  }
  return out.join("\n");
}

export function countWords(markdown) {
  const text = stripFences(stripFrontmatter(markdown))
    .replace(/<[^>]*>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/^\s*\d+[.)]\s+/gm, "");
  return (text.match(TOKEN) ?? []).length;
}

export function compareToTarget(count, target, tolerance = 0.1) {
  const min = Math.round(target * (1 - tolerance));
  const max = Math.round(target * (1 + tolerance));
  const status = count < min ? "under" : count > max ? "over" : "within";
  return { count, target, min, max, status };
}
