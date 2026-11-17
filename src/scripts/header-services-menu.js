// NRD-259: desktop "Servicios" disclosure. The panel is shown by state
// (`data-open` on the <li> plus `aria-expanded` on the button), never by
// :hover/:focus-within, so assistive tech sees the real state.
import {
  escapeAction,
  nextOpenOnClick,
  shouldCloseOnOutsidePointer,
  shouldCloseOnPointerLeave,
} from "./menu-logic.js";

const getItem = () => document.querySelector("[data-services-menu]");
const getButton = (item) => item?.querySelector("button[aria-controls]");
const isOpen = (item) => item.hasAttribute("data-open");

function setOpen(item, open) {
  const button = getButton(item);
  if (!button) return;
  button.setAttribute("aria-expanded", String(open));
  item.toggleAttribute("data-open", open);
}

function initServicesMenu() {
  const item = getItem();
  const button = getButton(item);
  if (!item || !button || item.dataset.servicesMenuReady) return;
  item.dataset.servicesMenuReady = "true";

  button.addEventListener("click", (event) =>
    setOpen(item, nextOpenOnClick(isOpen(item), event.pointerType)),
  );

  // The `pt-2` gap between button and panel is inside the <li>, so moving
  // the pointer across it does not close the panel (WCAG 1.4.13).
  item.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse") setOpen(item, true);
  });
  item.addEventListener("pointerleave", (event) => {
    if (
      event.pointerType === "mouse" &&
      shouldCloseOnPointerLeave(item.contains(document.activeElement))
    ) {
      setOpen(item, false);
    }
  });

  item.addEventListener("focusout", (event) => {
    if (!item.contains(event.relatedTarget)) setOpen(item, false);
  });
}

// Document-level dismissal, registered once: the header is replaced on each
// ViewTransitions swap, so handlers look the current item up on every event.
if (!window.__servicesMenuInit) {
  window.__servicesMenuInit = true;

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const item = getItem();
    if (!item) return;
    const action = escapeAction(
      isOpen(item),
      item.contains(document.activeElement),
    );
    if (!action.close) return;
    setOpen(item, false);
    if (action.refocus) getButton(item)?.focus();
  });

  document.addEventListener("pointerdown", (event) => {
    const item = getItem();
    if (!item) return;
    const inside = event.target instanceof Node && item.contains(event.target);
    if (shouldCloseOnOutsidePointer(isOpen(item), inside)) setOpen(item, false);
  });
}

document.addEventListener("astro:page-load", initServicesMenu);
