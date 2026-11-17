// Pure decision helpers for the header menus (NRD-259), unit-tested in node.

/** Desktop panel state after a click on the "Servicios" button. */
export function nextOpenOnClick(isOpen, pointerType) {
  // A mouse click lands after pointerenter already opened the panel; toggling
  // would close it again (flash). Keyboard ("") and touch still toggle.
  if (pointerType === "mouse") return true;
  return !isOpen;
}

/** pointerleave must not close the panel while keyboard focus is inside. */
export function shouldCloseOnPointerLeave(focusInside) {
  return !focusInside;
}

/** Escape: close an open panel; refocus the button only from inside it. */
export function escapeAction(isOpen, focusInside) {
  return { close: isOpen, refocus: isOpen && focusInside };
}

/** A pointerdown outside the item closes an open panel (touch, Safari). */
export function shouldCloseOnOutsidePointer(isOpen, insideItem) {
  return isOpen && !insideItem;
}

/** Close the mobile drawer when the viewport grows to the desktop layout. */
export function shouldCloseDrawerOnResize(isDrawerOpen, matchesDesktop) {
  return isDrawerOpen && matchesDesktop;
}
