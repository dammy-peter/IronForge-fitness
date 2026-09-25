/* ==========================================================================
   BLOG RENDER — featured post, filters, search and article grid.
   ========================================================================== */

(function () {
  const featured = getFeaturedPost();

  const featuredEl = document.querySelector("[data-featured-post]");
  const filterGroup = document.querySelector("[data-blog-filters]");
  const grid = document.querySelector("[data-blog-grid]");
  const emptyState = document.querySelector("[data-blog-empty]");
  const searchInput = document.querySelector("[data-blog-search]");

  /* ------------------------------------------------------------------------
     Featured article
     ------------------------------------------------------------------------ */

  if (featuredEl && featured) {
    featuredEl.innerHTML = `
      <div class="featured-post__media">
        <img
          src="${featured.image}"
          alt="${featured.title}"
          loading="eager"
        >
      </div>

      <div class="featured-post__body">
        <span class="card__tag">
          Featured · ${featured.categoryLabel}
        </span>

        <h2>${featured.title.toUpperCase()}</h2>

        <p class="lead">
          ${featured.excerpt}
        </p>

        <div class="article__meta" style="margin-top:0.5rem;">
          <span>${featured.formattedDate}</span>
          <span>·</span>
          <span>${featured.readingTime}</span>
        </div>

        <a
          href="blog-detail.html?post=${featured.slug}"
          class="btn btn--primary"
          style="margin-top:1.5rem;"
        >
          Read Article
        </a>
      </div>
    `;
  }

  /* ------------------------------------------------------------------------
     Category filters
     ------------------------------------------------------------------------ */

  if (filterGroup) {
    filterGroup.innerHTML = getBlogCategories()
      .map(
        (category, index) => `
          <button
            class="filter-btn${index === 0 ? " is-active" : ""}"
            data-filter="${category.value}"
            type="button"
          >
            ${category.label}
          </button>
        `
      )
      .join("");
  }

  /* ------------------------------------------------------------------------
     Article grid
     ------------------------------------------------------------------------ */

  const posts = getLatestPosts(
    featured ? featured.slug : null
  );

  function renderCard(post) {
    return `
      <article
        class="card"
        data-category="${post.category}"
        data-search-title="${post.title.toLowerCase()}"
        data-search-excerpt="${post.excerpt.toLowerCase()}"
        data-search-category="${post.categoryLabel.toLowerCase()}"
      >
        <div class="card__media">
          <img
            src="${post.image}"
            alt="${post.title}"
            loading="lazy"
          >
        </div>

        <div class="card__body">
          <span class="card__tag">
            ${post.categoryLabel} · ${post.formattedDate}
          </span>

          <h3 class="card__title">
            ${post.title}
          </h3>

          <p class="card__desc">
            ${post.excerpt}
          </p>

          <div class="article__meta" style="margin-bottom:0.9rem;">
            <span>${post.readingTime}</span>
          </div>

          <a
            href="blog-detail.html?post=${post.slug}"
            class="card__link"
          >
            Read Article
          </a>
        </div>
      </article>
    `;
  }

  if (grid) {
    grid.innerHTML = posts.map(renderCard).join("");
  }

  /* ------------------------------------------------------------------------
     Combined category + search filtering
     ------------------------------------------------------------------------ */

  let activeCategory = "all";
  let searchQuery = "";

  function applyFilters() {
    if (!grid) return;

    const cards = Array.from(
      grid.querySelectorAll("[data-category]")
    );

    let visibleCount = 0;

    cards.forEach((card) => {
      const category =
        card.getAttribute("data-category") || "";

      const title =
        card.getAttribute("data-search-title") || "";

      const excerpt =
        card.getAttribute("data-search-excerpt") || "";

      const categoryLabel =
        card.getAttribute("data-search-category") || "";

      const categoryMatch =
        activeCategory === "all" ||
        category === activeCategory;

      const searchMatch =
        !searchQuery ||
        title.includes(searchQuery) ||
        excerpt.includes(searchQuery) ||
        categoryLabel.includes(searchQuery);

      const visible =
        categoryMatch && searchMatch;

      card.style.display = visible ? "" : "none";

      if (visible) {
        visibleCount += 1;
      }
    });

    if (emptyState) {
      emptyState.hidden = visibleCount !== 0;
    }
  }

  /* ------------------------------------------------------------------------
     Category buttons
     ------------------------------------------------------------------------ */

  if (filterGroup) {
    filterGroup.addEventListener("click", (event) => {
      const button =
        event.target.closest("[data-filter]");

      if (!button) return;

      activeCategory =
        button.getAttribute("data-filter") || "all";

      filterGroup
        .querySelectorAll("[data-filter]")
        .forEach((item) => {
          item.classList.remove("is-active");
        });

      button.classList.add("is-active");

      applyFilters();
    });
  }

  /* ------------------------------------------------------------------------
     Search
     ------------------------------------------------------------------------ */

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      searchQuery =
        searchInput.value.trim().toLowerCase();

      /*
       * When searching, reset the category to All
       * so search results are never hidden by a previous filter.
       */

      if (searchQuery && filterGroup) {
        activeCategory = "all";

        filterGroup
          .querySelectorAll("[data-filter]")
          .forEach((item) => {
            item.classList.remove("is-active");
          });

        const allButton =
          filterGroup.querySelector(
            '[data-filter="all"]'
          );

        if (allButton) {
          allButton.classList.add("is-active");
        }
      }

      applyFilters();
    });
  }

  applyFilters();
})();