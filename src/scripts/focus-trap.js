// Pure helpers for the mobile menu focus trap (NRD-259). No DOM globals, so
// they can be unit-tested with `node --test`.
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button",
  "input",
  "select",
  "textarea",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

/** Focusable elements inside `root`, skipping disabled, inert and unrendered ones. */
export function focusableIn(root) {
  return Array.from(root.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
    (el) =>
      !el.disabled &&
      !el.closest("[inert]") &&
      // null offsetParent: display:none / not rendered (undefined in tests).
      el.offsetParent !== null,
  );
}

/**
 * Index to focus after Tab (or Shift+Tab when `shift`), wrapping at both
 * ends. `current` is -1 when focus is outside the list. -1 for an empty list.
 */
export function nextFocusIndex(length, current, shift) {
  if (length <= 0) return -1;
  if (current < 0) return shift ? length - 1 : 0;
  return (current + (shift ? -1 : 1) + length) % length;
}
