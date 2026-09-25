/* ==========================================================================
   HOMEPAGE RENDER
   Uses trainersData as the single source of truth for featured coaches.
   ========================================================================== */

(function () {
  const trainerGrid = document.querySelector("[data-home-trainers]");

  if (!trainerGrid || typeof trainersData === "undefined") {
    return;
  }

  /*
   * These are only the selected featured trainer slugs.
   * All names, roles, images, specialties and other information
   * continue to come from trainersData.
   */
  const featuredTrainerSlugs = [
    "david-okafor",
    "sarah-williams",
    "michael-adeyemi",
  ];

  const featuredTrainers = featuredTrainerSlugs
    .map((slug) => trainersData.find((trainer) => trainer.slug === slug))
    .filter(Boolean);

  trainerGrid.innerHTML = featuredTrainers
    .map(
      (trainer) => `
        <article class="card trainer-card" data-reveal>
          <div class="card__media trainer-card__media">
            <img
              src="${trainer.image}"
              alt="${trainer.name}, ${trainer.role} at IronForge Fitness"
              loading="lazy"
            >
          </div>

          <div class="card__body">
            <span class="trainer-card__specialty">
              ${trainer.specialties.slice(0, 2).join(" • ")}
            </span>

            <h3 class="card__title">
              ${trainer.name}
            </h3>

            <p class="card__desc">
              ${trainer.role}
            </p>

            <a
              href="trainer-detail.html?trainer=${trainer.slug}"
              class="card__link"
            >
              View Profile
            </a>
          </div>
        </article>
      `
    )
    .join("");
})();