/* ==========================================================================
   GALLERY — data-driven render + category filtering + lightbox (gallery.html)
   ========================================================================== */

(function () {
  const grid = document.querySelector("[data-gallery-grid]");
  if (!grid) return;

  const data = window.GALLERY_DATA || [];

  /* ---- Render grid from gallery-data.js ---- */
  grid.innerHTML = data
    .map(
      (item) =>
        `<div class="gallery-item" data-id="${item.id}" data-category="${item.category}">` +
        `<img src="${item.image}" alt="${item.alt}" loading="lazy"></div>`
    )
    .join("");

  /* ---- Render filter buttons from category list in data ---- */
  const filterRow = document.querySelector("[data-gallery-filters]");
  if (filterRow) {
    const seen = new Set();
    const categories = [{ value: "all", label: "All" }];
    data.forEach((item) => {
      if (!seen.has(item.category)) {
        seen.add(item.category);
        categories.push({ value: item.category, label: item.categoryLabel });
      }
    });
    filterRow.innerHTML = categories
      .map(
        (c, i) =>
          `<button class="filter-btn${i === 0 ? " is-active" : ""}" data-gallery-filter="${c.value}">${c.label}</button>`
      )
      .join("");
  }

  const filterBtns = document.querySelectorAll("[data-gallery-filter]");
  const items = Array.from(grid.querySelectorAll(".gallery-item"));

  /* ---- Filtering ---- */
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const category = btn.getAttribute("data-gallery-filter");

      items.forEach((item) => {
        const match =
          category === "all" || item.getAttribute("data-category") === category;
        item.hidden = !match;
      });

      buildActiveList();
    });
  });

  /* ---- Lightbox ---- */
  const lightbox = document.querySelector(".lightbox");
  const lightboxImg = lightbox ? lightbox.querySelector("img") : null;
  const lightboxCaption = lightbox ? lightbox.querySelector(".lightbox__caption") : null;
  const closeBtn = lightbox ? lightbox.querySelector(".lightbox__close") : null;
  const prevBtn = lightbox ? lightbox.querySelector(".lightbox__prev") : null;
  const nextBtn = lightbox ? lightbox.querySelector(".lightbox__next") : null;

  let activeList = items;
  let currentIndex = 0;

  function buildActiveList() {
    // Lightbox navigation is always scoped to the currently visible/filtered items only.
    activeList = items.filter((item) => !item.hidden);
  }
  buildActiveList();

  function openLightbox(item) {
    if (!lightbox || !lightboxImg) return;
    currentIndex = activeList.indexOf(item);
    updateLightbox();
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("menu-open");
    closeBtn && closeBtn.focus();
  }

  function updateLightbox() {
    const item = activeList[currentIndex];
    if (!item) return;
    const img = item.querySelector("img");
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    if (lightboxCaption) lightboxCaption.textContent = img.alt;
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("menu-open");
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % activeList.length;
    updateLightbox();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + activeList.length) % activeList.length;
    updateLightbox();
  }

  items.forEach((item) => {
    const img = item.querySelector("img");
    item.setAttribute("tabindex", "0");
    item.setAttribute("role", "button");
    item.setAttribute("aria-label", "Open image: " + (img ? img.alt : "gallery photo"));
    item.addEventListener("click", () => openLightbox(item));
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(item);
      }
    });
  });

  closeBtn && closeBtn.addEventListener("click", closeLightbox);
  nextBtn && nextBtn.addEventListener("click", showNext);
  prevBtn && prevBtn.addEventListener("click", showPrev);

  lightbox &&
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });

  document.addEventListener("keydown", (e) => {
    if (!lightbox || !lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showNext();
    if (e.key === "ArrowLeft") showPrev();
  });
})();