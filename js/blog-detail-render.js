/* ==========================================================================
   BLOG DETAIL RENDER — loads an article from ?post=<slug> and updates SEO.
   ========================================================================== */

(function () {
  const params = new URLSearchParams(
    window.location.search
  );

  const slug = params.get("post");
  const post = slug ? getPostBySlug(slug) : null;

  const contentEl =
    document.getElementById("post-content");

  const notFoundEl =
    document.getElementById("post-not-found");

  function setText(id, value) {
    const el = document.getElementById(id);

    if (el) {
      el.textContent = value;
    }
  }

  function setMeta(selector, attr, value) {
    const el = document.querySelector(selector);

    if (el) {
      el.setAttribute(attr, value);
    }
  }

  /* ------------------------------------------------------------------------
     Invalid article
     ------------------------------------------------------------------------ */

  if (!post) {
    if (contentEl) {
      contentEl.hidden = true;
    }

    if (notFoundEl) {
      notFoundEl.hidden = false;
    }

    document.title =
      "Article Not Found | IRONFORGE FITNESS Lagos";

    return;
  }

  if (notFoundEl) {
    notFoundEl.hidden = true;
  }

  if (contentEl) {
    contentEl.hidden = false;
  }

  /* ------------------------------------------------------------------------
     Dynamic SEO
     ------------------------------------------------------------------------ */

  const pageTitle =
    `${post.title} | IRONFORGE FITNESS Lagos`;

  const pageDesc = post.excerpt;

  const pageUrl =
    `https://www.ironforgefitness.com/blog-detail.html?post=${encodeURIComponent(
      post.slug
    )}`;

  const imageUrl =
    new URL(
      post.image,
      window.location.href
    ).href;

  document.title = pageTitle;

  setMeta(
    'meta[name="description"]',
    "content",
    pageDesc
  );

  setMeta(
    'link[rel="canonical"]',
    "href",
    pageUrl
  );

  setMeta(
    'meta[property="og:title"]',
    "content",
    pageTitle
  );

  setMeta(
    'meta[property="og:description"]',
    "content",
    pageDesc
  );

  setMeta(
    'meta[property="og:url"]',
    "content",
    pageUrl
  );

  setMeta(
    'meta[property="og:image"]',
    "content",
    imageUrl
  );

  setMeta(
    'meta[name="twitter:title"]',
    "content",
    pageTitle
  );

  setMeta(
    'meta[name="twitter:description"]',
    "content",
    pageDesc
  );

  setMeta(
    'meta[name="twitter:image"]',
    "content",
    imageUrl
  );

  /* ------------------------------------------------------------------------
     Article structured data
     ------------------------------------------------------------------------ */

  const structuredData =
    document.getElementById(
      "article-structured-data"
    );

  if (structuredData) {
    structuredData.textContent =
      JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.excerpt,
        image: [imageUrl],

        author: {
          "@type": "Organization",
          name: post.author,
        },

        datePublished: post.date,
        dateModified: post.date,

        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": pageUrl,
        },
      });
  }

  /* ------------------------------------------------------------------------
     Breadcrumb
     ------------------------------------------------------------------------ */

  setText(
    "breadcrumb-post-title",
    post.title
  );

  /* ------------------------------------------------------------------------
     Article header
     ------------------------------------------------------------------------ */

  setText(
    "post-category",
    post.categoryLabel
  );

  setText(
    "post-title",
    post.title.toUpperCase()
  );

  setText(
    "post-author",
    `By ${post.author}`
  );

  setText(
    "post-date",
    post.formattedDate
  );

  setText(
    "post-reading-time",
    post.readingTime
  );

  /* ------------------------------------------------------------------------
     Article image
     ------------------------------------------------------------------------ */

  const coverImg =
    document.getElementById(
      "post-cover-img"
    );

  if (coverImg) {
    coverImg.src = post.image;
    coverImg.alt = post.title;
    coverImg.loading = "eager";
  }

  /* ------------------------------------------------------------------------
     Article body
     ------------------------------------------------------------------------ */

  const bodyEl =
    document.getElementById("post-body");

  if (bodyEl) {
    bodyEl.innerHTML =
      post.content
        .map((block) => {
          if (block.type === "h2") {
            return `<h2>${block.text}</h2>`;
          }

          return `<p>${block.text}</p>`;
        })
        .join("");
  }

  /* ------------------------------------------------------------------------
     Related articles
     ------------------------------------------------------------------------ */

  const relatedEl =
    document.getElementById(
      "related-posts-grid"
    );

  if (relatedEl) {
    const related =
      getRelatedPosts(post, 3);

    relatedEl.innerHTML =
      related
        .map(
          (relatedPost) => `
            <article class="card" data-reveal>
              <div class="card__media">
                <img
                  src="${relatedPost.image}"
                  alt="${relatedPost.title}"
                  loading="lazy"
                >
              </div>

              <div class="card__body">
                <span class="card__tag">
                  ${relatedPost.categoryLabel}
                  ·
                  ${relatedPost.formattedDate}
                </span>

                <h3 class="card__title">
                  ${relatedPost.title}
                </h3>

                <p class="card__desc">
                  ${relatedPost.excerpt}
                </p>

                <a
                  href="blog-detail.html?post=${relatedPost.slug}"
                  class="card__link"
                >
                  Read Article
                </a>
              </div>
            </article>
          `
        )
        .join("");
  }
})();