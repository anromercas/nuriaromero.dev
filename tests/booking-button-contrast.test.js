import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync("src/components/BookingButton.astro", "utf8");

// Tailwind 3 default palette hex values for the fills the button may use.
const FILLS = {
  "blue-600": "#2563eb",
  "blue-700": "#1d4ed8",
};

function luminance(hex) {
  const channels = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastWithWhite(hex) {
  return 1.05 / (luminance(hex) + 0.05);
}

test("BookingButton defines its classes once with a blue-600 fill", () => {
  const classStrings = source.match(/"[^"\n]*\bbg-blue-600\b[^"\n]*"/g) ?? [];
  assert.equal(classStrings.length, 1);
  assert.match(source, /\bhover:bg-blue-700\b/);
  assert.match(source, /\btext-white\b/);
});

test("BookingButton has no low-contrast or dark: colour variants", () => {
  for (const forbidden of [
    "dark:bg-",
    "dark:hover:bg-",
    "bg-blue-500",
    "hover:bg-blue-500",
    "hover:bg-blue-400",
  ]) {
    assert.ok(
      !source.includes(forbidden),
      `found forbidden class: ${forbidden}`,
    );
  }
});

test("white text meets WCAG AA (4.5:1) on every fill the button uses", () => {
  const used = [...source.matchAll(/(?:hover:)?bg-(blue-\d{3})\b/g)].map(
    (m) => m[1],
  );
  assert.ok(used.length > 0);
  for (const token of new Set(used)) {
    assert.ok(FILLS[token], `unmapped fill token: ${token}`);
    const ratio = contrastWithWhite(FILLS[token]);
    assert.ok(ratio >= 4.5, `${token} contrast ${ratio.toFixed(2)} < 4.5`);
  }
});
