// Wraps tables that hold right-aligned (no-wrap) cells in a keyboard-focusable,
// horizontally scrollable region, so the table scrolls instead of the page
// (WCAG 1.4.10). Tables without aligned columns are left untouched.

const isElement = (node, tagName) =>
  node?.type === "element" && (!tagName || node.tagName === tagName);

const hasRightAlignedCell = (node) =>
  isElement(node) &&
  (((node.tagName === "th" || node.tagName === "td") &&
    node.properties?.align === "right") ||
    (node.children ?? []).some(hasRightAlignedCell));

const textOf = (node) =>
  node.type === "text"
    ? node.value
    : (node.children ?? []).map(textOf).join("");

const isWrapper = (node) =>
  isElement(node, "div") &&
  (node.properties?.className ?? []).includes("table-scroll");

export default function rehypeTableScroll() {
  return (tree) => {
    let heading = "";

    const visit = (parent) => {
      const children = parent.children ?? [];
      for (let i = 0; i < children.length; i++) {
        const node = children[i];
        if (isElement(node, "h2")) {
          heading = textOf(node).trim();
        } else if (isElement(node, "table") && !isWrapper(parent)) {
          if (!hasRightAlignedCell(node)) continue;
          children[i] = {
            type: "element",
            tagName: "div",
            properties: {
              className: ["table-scroll"],
              role: "region",
              tabIndex: 0,
              ariaLabel: heading ? `Tabla: ${heading}` : "Tabla",
            },
            children: [node],
          };
        } else if (isElement(node)) {
          visit(node);
        }
      }
    };

    visit(tree);
  };
}
