// NRD-259: desktop "Servicios" disclosure. The panel is shown by state
// (`data-open` on the <li> plus `aria-expanded` on the button), never by
// :hover/:focus-within, so assistive tech sees the real state.
function initServicesMenu() {
  const item = document.querySelector("[data-services-menu]");
  if (!item || item.dataset.servicesMenuReady) return;
  item.dataset.servicesMenuReady = "true";
  const button = item.querySelector("button[aria-controls]");
  if (!button) return;

  const setOpen = (open) => {
    button.setAttribute("aria-expanded", String(open));
    if (open) item.setAttribute("data-open", "");
    else item.removeAttribute("data-open");
  };
  const isOpen = () => button.getAttribute("aria-expanded") === "true";

  // Click covers Enter and Space on a <button>.
  button.addEventListener("click", () => setOpen(!isOpen()));

  // The `pt-2` gap between button and panel is inside the <li>, so moving
  // the pointer across it does not close the panel (WCAG 1.4.13).
  item.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse") setOpen(true);
  });
  item.addEventListener("pointerleave", (event) => {
    if (event.pointerType === "mouse") setOpen(false);
  });

  item.addEventListener("focusout", (event) => {
    if (!item.contains(event.relatedTarget)) setOpen(false);
  });

  item.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !isOpen()) return;
    event.stopPropagation();
    setOpen(false);
    button.focus();
  });
}

document.addEventListener("astro:page-load", initServicesMenu);
