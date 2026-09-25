/* ==========================================================================
   CLASSES PAGE — renders the complete 15-program directory from program.js.
   Must run before filters.js so filter buttons have rendered cards.
   ========================================================================== */

(function () {
  const grid = document.querySelector("[data-programs-grid]");

  if (
    !grid ||
    typeof programsData === "undefined" ||
    typeof programOrder === "undefined"
  ) {
    return;
  }

  grid.innerHTML = programOrder
    .map((slug) => {
      const p = programsData[slug];

      return (
        '<article class="card program-card" data-reveal data-category="' +
        p.categorySlug +
        '">' +
        '<div class="card__media program-card__media">' +
        '<img src="' +
        p.image +
        '" alt="' +
        p.imageAlt +
        '" loading="lazy">' +
        "</div>" +
        '<div class="card__body">' +
        '<span class="card__tag">' +
        p.category +
        "</span>" +
        '<h3 class="card__title">' +
        p.name +
        "</h3>" +
        '<p class="card__desc">' +
        p.shortDescription +
        "</p>" +
        '<p style="font-size:var(--fs-tiny);color:var(--color-muted-dim);margin-bottom:0.9rem;">' +
        p.level +
        " &middot; " +
        p.duration +
        " &middot; Coached by " +
        p.coachName +
        "</p>" +
        '<a href="class-detail.html?program=' +
        slug +
        '" class="card__link" aria-label="View ' +
        p.name +
        ' program">View Program</a>' +
        "</div>" +
        "</article>"
      );
    })
    .join("");
})();