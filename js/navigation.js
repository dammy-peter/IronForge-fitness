/* ==========================================================================
   NAVIGATION — mobile menu, sticky header shadow, active link highlighting
   ========================================================================== */

(function () {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".mobile-menu");
  const closeBtn = document.querySelector(".mobile-menu__close");
  const menuLinks = document.querySelectorAll(".mobile-menu__link");

  function openMenu() {
    if (!menu) return;
    menu.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
    const firstLink = menu.querySelector(".mobile-menu__link");
    if (firstLink) firstLink.focus();
  }

  function closeMenu() {
    if (!menu) return;
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  }

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.contains("is-open");
      isOpen ? closeMenu() : openMenu();
    });

    closeBtn && closeBtn.addEventListener("click", closeMenu);

    menuLinks.forEach((link) => link.addEventListener("click", closeMenu));

    // Close when clicking outside the menu content
    menu.addEventListener("click", (e) => {
      if (e.target === menu) closeMenu();
    });

    // Close when clicking the dimmed page area beside the panel
    document.addEventListener("click", (e) => {
      if (
        menu.classList.contains("is-open") &&
        !menu.contains(e.target) &&
        !toggle.contains(e.target)
      ) {
        closeMenu();
      }
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.classList.contains("is-open")) {
        closeMenu();
        toggle.focus();
      }
    });
  }

  // Sticky header background intensifies on scroll
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => {
      header.style.boxShadow =
        window.scrollY > 10 ? "0 8px 24px rgba(0,0,0,0.35)" : "none";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Active nav link: mark the link matching the current page
  const currentPage =
    location.pathname.split("/").pop() || "index.html";
  document
    .querySelectorAll(".main-nav__link, .mobile-menu__link")
    .forEach((link) => {
      const href = link.getAttribute("href");
      if (href === currentPage || (currentPage === "" && href === "index.html")) {
        link.setAttribute("aria-current", "page");
      }
    });
})();