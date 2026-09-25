/* ==========================================================================
   TRAINERS RENDER — builds the filter row and trainer grid on trainers.html
   from js/trainers-data.js. Runs before filters.js so the filter system
   (data-filter-group / data-filter / data-category) works on the freshly
   rendered markup without any competing logic.
   ========================================================================== */

(function () {
  const filterGroup = document.querySelector("[data-trainer-filters]");
  const grid = document.querySelector("[data-trainers-grid]");
  if (!grid) return;

  /* ---- Filters, generated from categories actually present in the data ---- */
  if (filterGroup) {
    const categories = getTrainerCategories();
    filterGroup.innerHTML = categories
      .map(
        (c, i) =>
          `<button class="filter-btn${i === 0 ? " is-active" : ""}" data-filter="${c.value}">${c.label}</button>`
      )
      .join("");
  }

  /* ---- Trainer cards ---- */
  grid.innerHTML = trainersData
    .map(
      (t) => `
        <article class="card trainer-card" data-reveal data-category="${t.category}">
          <div class="card__media trainer-card__media">
            <img src="${t.image}" alt="${t.name}, ${t.role} at IRONFORGE FITNESS" loading="lazy">
          </div>
          <div class="card__body">
            <span class="trainer-card__specialty">${t.specialties[0]}</span>
            <h3 class="card__title">${t.name}</h3>
            <p class="card__desc">${t.role} &middot; ${t.experience}</p>
            <p class="card__desc" style="margin-top:-0.6rem;">${t.specialties.slice(1, 3).join(" · ")}</p>
            <a href="trainer-detail.html?trainer=${t.slug}" class="card__link">View Profile</a>
          </div>
        </article>`
    )
    .join("");

  /* ---- "Find the right coach" goal links reuse the same filter system ---- */
  document.querySelectorAll("[data-goal-filter]").forEach((link) => {
    link.addEventListener("click", (e) => {
      const value = link.getAttribute("data-goal-filter");
      const targetBtn = filterGroup && filterGroup.querySelector(`[data-filter="${value}"]`);
      if (targetBtn) {
        e.preventDefault();
        targetBtn.click();
        document.querySelector("#trainer-directory").scrollIntoView({ behavior: "smooth", block: "start" });
      }
      /* If the category has no matching trainer/filter, the link's normal
         href (#trainer-directory) still takes the visitor to the grid. */
    });
  });
})();