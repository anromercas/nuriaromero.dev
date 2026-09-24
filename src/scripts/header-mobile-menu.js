// SEO-27: extraído de Header.astro (era `<script is:inline>`) para eliminar
// 'unsafe-inline' de script-src en la CSP. Comportamiento idéntico: menú
// móvil (abrir/cerrar, acordeón de "Servicios", cierre por click fuera /
// Escape / navegación).
function setAccordion(panel, btn, open) {
  if (!panel || !btn) return;
  btn.setAttribute("aria-expanded", String(open));
  if (open) {
    panel.classList.add("open");
  } else {
    panel.classList.remove("open");
  }
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

function setMobileMenu(open) {
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
}

if (!window.__mobileMenuInit) {
  window.__mobileMenuInit = true;

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const menu = document.getElementById("mobile-menu");
    if (!menu) return;

    if (target.closest("#mobile-menu-btn")) {
      setMobileMenu(!menu.classList.contains("open"));
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
      setMobileMenu(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMobileMenu(false);
  });

  document.addEventListener("astro:after-swap", () => setMobileMenu(false));
}
