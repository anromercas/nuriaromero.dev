// SEO-27: extraído de Header.astro (era `<script is:inline>`) para eliminar
// 'unsafe-inline' de script-src en la CSP. Comportamiento idéntico: menú
// móvil (abrir/cerrar, acordeón de "Servicios", cierre por click fuera /
// Escape / navegación).
import { focusableIn, nextFocusIndex } from "./focus-trap.js";

function setAccordion(panel, btn, open) {
  if (!panel || !btn) return;
  btn.setAttribute("aria-expanded", String(open));
  // `inert` keeps the closed panel's links out of the tab order (NRD-259).
  panel.toggleAttribute("inert", !open);
  panel.classList.toggle("open", open);
}

function closeAllAccordions() {
  document
    .querySelectorAll("#mobile-menu .mobile-accordion-btn")
    .forEach((btn) => {
      const panelId = btn.getAttribute("aria-controls");
      const panel = panelId ? document.getElementById(panelId) : null;
      setAccordion(panel, btn, false);
    });
}

// `returnFocus`: send focus back to the toggle button (Escape, close button,
// overlay). Navigation passes false because the page is being replaced.
function setMobileMenu(open, returnFocus = false) {
  const menu = document.getElementById("mobile-menu");
  const overlay = document.getElementById("mobile-menu-overlay");
  const btn = document.getElementById("mobile-menu-btn");
  if (!menu || !btn) return;
  menu.classList.toggle("open", open);
  overlay?.classList.toggle("open", open);
  btn.setAttribute("aria-expanded", String(open));
  // Bloquea el scroll de fondo mientras el drawer está abierto para que
  // hacer scroll dentro del menú no arrastre también la página de fondo.
  document.documentElement.classList.toggle("overflow-hidden", open);
  document.body.classList.toggle("overflow-hidden", open);
  if (!open) closeAllAccordions();
  if (open) {
    focusableIn(menu)[0]?.focus();
  } else if (returnFocus) {
    btn.focus();
  }
}

function trapTab(event, menu) {
  const items = focusableIn(menu);
  if (items.length === 0) return;
  const current = items.indexOf(document.activeElement);
  const wraps = event.shiftKey ? current <= 0 : current === items.length - 1;
  if (current !== -1 && !wraps) return;
  event.preventDefault();
  items[nextFocusIndex(items.length, current, event.shiftKey)].focus();
}

if (!window.__mobileMenuInit) {
  window.__mobileMenuInit = true;

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const menu = document.getElementById("mobile-menu");
    if (!menu) return;

    if (target.closest("#mobile-menu-btn")) {
      const open = !menu.classList.contains("open");
      setMobileMenu(open, !open);
      return;
    }

    if (target.closest("#mobile-menu-close")) {
      setMobileMenu(false, true);
      return;
    }

    const accordionBtn = target.closest(".mobile-accordion-btn");
    if (accordionBtn && menu.contains(accordionBtn)) {
      const panelId = accordionBtn.getAttribute("aria-controls");
      const panel = panelId ? document.getElementById(panelId) : null;
      const isOpen = accordionBtn.getAttribute("aria-expanded") === "true";
      setAccordion(panel, accordionBtn, !isOpen);
      return;
    }

    if (!target.closest("#mobile-menu") && menu.classList.contains("open")) {
      setMobileMenu(false, true);
    }
  });

  document.addEventListener("keydown", (event) => {
    const menu = document.getElementById("mobile-menu");
    if (!menu?.classList.contains("open")) return;
    if (event.key === "Escape") setMobileMenu(false, true);
    else if (event.key === "Tab") trapTab(event, menu);
  });

  document.addEventListener("astro:after-swap", () => setMobileMenu(false));
}
