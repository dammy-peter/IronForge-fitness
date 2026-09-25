/* ==========================================================================
   FILTERS — generic frontend filtering for trainers.html and blog.html
   Works on any container that has:
     - buttons with [data-filter] holding a category value ("all" = show all)
     - cards with [data-category] holding their category value
   ========================================================================== */

(function () {
  document.querySelectorAll("[data-filter-group]").forEach((group) => {
    const targetSelector = group.getAttribute("data-filter-group");
    const container = document.querySelector(targetSelector);

    if (!container) return;

    const buttons = group.querySelectorAll("[data-filter]");
    const cards = Array.from(
      container.querySelectorAll("[data-category]")
    );

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => {
          b.classList.remove("is-active");
          b.setAttribute("aria-pressed", "false");
        });

        btn.classList.add("is-active");
        btn.setAttribute("aria-pressed", "true");

        const value = btn.getAttribute("data-filter");

        cards.forEach((card) => {
          const match =
            value === "all" ||
            card.getAttribute("data-category") === value;

          card.style.display = match ? "" : "none";
        });
      });
    });
  });
})();