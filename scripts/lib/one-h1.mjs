/**
 * Number of <h1> start tags outside comments and <script>/<style>/<template> bodies.
 * @param {string} html
 * @returns {number}
 */
export function countH1(html) {
  const stripped = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|template)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "");
  return (stripped.match(/<h1(?=[\s>/])/gi) ?? []).length;
}
