/* ==========================================================================
   CLASS DETAIL PAGE
   --------------------------------------------------------------------------
   Loads one program from js/program.js using:

   class-detail.html?program=<slug>

   Example:
   class-detail.html?program=strength-training
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------------
     CHECK PROGRAM DATA
     ------------------------------------------------------------------------ */

  if (
    typeof programsData === "undefined" ||
    !programsData ||
    typeof programsData !== "object"
  ) {
    console.error(
      "class-detail.js: programsData is not available. Make sure js/program.js loads before js/class-detail.js.",
    );
    return;
  }

  /* ------------------------------------------------------------------------
     READ PROGRAM SLUG
     ------------------------------------------------------------------------ */

  const params = new URLSearchParams(window.location.search);

  let slug = params.get("program");

  /*
   * Support old links that may still exist somewhere in the project.
   */
  const legacySlugs = {
    strength: "strength-training",
    functional: "functional-training",
    "mobility-recovery": "mobility",
  };

  if (slug && legacySlugs[slug]) {
    slug = legacySlugs[slug];
  }

  /*
   * If no valid program was requested, use the first program.
   */
  if (!slug || !programsData[slug]) {
    if (
      typeof programOrder !== "undefined" &&
      Array.isArray(programOrder) &&
      programOrder.length > 0 &&
      programsData[programOrder[0]]
    ) {
      slug = programOrder[0];
    } else {
      slug = Object.keys(programsData)[0];
    }
  }

  const program = programsData[slug];

  if (!program) {
    console.error(
      "class-detail.js: No valid program was found for slug:",
      slug,
    );
    return;
  }

  // Keep the primary conversion CTA connected to the program currently viewed.
  const programRequestCta = document.getElementById("program-trial-cta");
  if (programRequestCta) {
    programRequestCta.dataset.programSlug = slug;
    programRequestCta.dataset.programName = program.name;
    programRequestCta.setAttribute("aria-label", `Request a free trial for ${program.name}`);
  }

  /* ------------------------------------------------------------------------
     HELPERS
     ------------------------------------------------------------------------ */

  function setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
      element.textContent = value || "";
    }
  }

  function setAttribute(id, attribute, value) {
    const element = document.getElementById(id);

    if (element && value) {
      element.setAttribute(attribute, value);
    }
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /* ------------------------------------------------------------------------
     PAGE TITLE + SEO
     ------------------------------------------------------------------------ */

  document.title = program.name + " | IronForge Fitness Lekki, Lagos";

  const description =
    program.name +
    " is a " +
    program.duration +
    " " +
    program.category.toLowerCase() +
    " program at IronForge Fitness in Lekki, Lagos. " +
    program.shortDescription;

  const descriptionMeta = document.querySelector('meta[name="description"]');

  if (descriptionMeta) {
    descriptionMeta.setAttribute("content", description);
  }

  const ogTitle = document.querySelector('meta[property="og:title"]');

  if (ogTitle) {
    ogTitle.setAttribute("content", program.name + " | IronForge Fitness");
  }

  const ogDescription = document.querySelector(
    'meta[property="og:description"]',
  );

  if (ogDescription) {
    ogDescription.setAttribute("content", description);
  }

  const ogImage = document.querySelector('meta[property="og:image"]');

  if (ogImage) {
    ogImage.setAttribute("content", program.image);
  }

  const ogUrl = document.querySelector('meta[property="og:url"]');

  if (ogUrl) {
    ogUrl.setAttribute("content", window.location.href);
  }

  const twitterTitle = document.querySelector('meta[name="twitter:title"]');

  if (twitterTitle) {
    twitterTitle.setAttribute("content", program.name + " | IronForge Fitness");
  }

  const twitterDescription = document.querySelector(
    'meta[name="twitter:description"]',
  );

  if (twitterDescription) {
    twitterDescription.setAttribute("content", description);
  }

  const twitterImage = document.querySelector('meta[name="twitter:image"]');

  if (twitterImage) {
    twitterImage.setAttribute("content", program.image);
  }

  const canonical = document.querySelector('link[rel="canonical"]');

  if (canonical) {
    canonical.setAttribute("href", window.location.href);
  }

  /* ------------------------------------------------------------------------
     BREADCRUMB
     ------------------------------------------------------------------------ */

  setText("breadcrumb-current", program.name);

  /* ------------------------------------------------------------------------
     MAIN PROGRAM IMAGE
     ------------------------------------------------------------------------ */

  setAttribute("program-image", "src", program.image);

  setAttribute("program-image", "alt", program.imageAlt);

  /* ------------------------------------------------------------------------
     PROGRAM HEADER
     ------------------------------------------------------------------------ */

  setText("program-category", program.category);

  setText("program-name", program.name.toUpperCase());

  setText("program-lead", program.shortDescription);

  /* ------------------------------------------------------------------------
     PROGRAM BADGES
     ------------------------------------------------------------------------ */

  const badges = document.getElementById("program-badges");

  if (badges) {
    badges.innerHTML = `
      <span class="badge">
        <span class="badge__dot"></span>
        ${escapeHtml(program.level)}
      </span>

      <span class="badge">
        <span class="badge__dot"></span>
        ${escapeHtml(program.duration)}
      </span>

      <span class="badge">
        <span class="badge__dot"></span>
        ${escapeHtml(program.category)}
      </span>
    `;
  }

  /* ------------------------------------------------------------------------
     WHAT TO EXPECT
     ------------------------------------------------------------------------ */

  setText("program-expect", program.whatToExpect);

  /* ------------------------------------------------------------------------
     BENEFITS
     ------------------------------------------------------------------------ */

  const benefits = document.getElementById("program-benefits");

  if (benefits && Array.isArray(program.benefits)) {
    benefits.innerHTML = program.benefits
      .map(function (benefit) {
        return `
          <li>${escapeHtml(benefit)}</li>
        `;
      })
      .join("");
  }

  /* ------------------------------------------------------------------------
     WHO IT IS FOR
     ------------------------------------------------------------------------ */

  setText("program-who", program.whoFor);

  /* ------------------------------------------------------------------------
     WHAT TO BRING
     ------------------------------------------------------------------------ */

  const bring = document.getElementById("program-bring");

  if (bring && Array.isArray(program.whatToBring)) {
    bring.innerHTML = program.whatToBring
      .map(function (item) {
        return `
          <li>${escapeHtml(item)}</li>
        `;
      })
      .join("");
  }

  /* ------------------------------------------------------------------------
     SIDEBAR
     ------------------------------------------------------------------------ */

  setText("side-level", program.level);

  setText("side-duration", program.duration);

  setText("side-schedule", program.schedule);

  setText(
    "side-coach",
    "Coached by " + program.coachName + ", " + program.coachRole + ".",
  );

  /* ------------------------------------------------------------------------
     COACH PROFILE LINK
     ------------------------------------------------------------------------ */

  const coachLink = document.getElementById("side-coach-link");

  if (coachLink) {
    let coachSlug = "";

    if (typeof trainersData !== "undefined" && Array.isArray(trainersData)) {
      const trainer = trainersData.find(function (item) {
        return item.name === program.coachName;
      });

      if (trainer) {
        coachSlug = trainer.slug;
      }
    }

    if (coachSlug) {
      coachLink.href =
        "trainer-detail.html?trainer=" + encodeURIComponent(coachSlug);
    } else {
      coachLink.href = "trainers.html";
    }
  }

  /* ------------------------------------------------------------------------
   PROGRAM FAQs
   ------------------------------------------------------------------------ */

  const faqGrid = document.querySelector("[data-program-faqs]");

  if (faqGrid) {
    const faqs = [
      {
        question: "Who is " + program.name + " suitable for?",
        answer: program.whoFor,
      },

      {
        question: "How long is each session?",
        answer:
          "Each " +
          program.name +
          " session lasts approximately " +
          program.duration +
          ". The current schedule is " +
          program.schedule +
          ".",
      },

      {
        question: "When is " + program.name + " available?",
        answer:
          "The current " +
          program.name +
          " schedule is " +
          program.schedule +
          ". Please contact the IronForge team if you need help choosing a suitable session.",
      },

      {
        question: "What should I bring?",
        answer: Array.isArray(program.whatToBring)
          ? program.whatToBring.join(", ") + "."
          : "Bring comfortable training clothes, suitable training shoes, water and a towel.",
      },

      {
        question: "What can I expect from the program?",
        answer: program.whatToExpect,
      },
    ];

    /*
     * Build the FAQ markup.
     *
     * Unique class names are intentionally used here so existing
     * .faq-item styles cannot interfere with this accordion.
     */
    faqGrid.innerHTML = faqs
      .map(function (faq, index) {
        return `
        <div class="program-faq-item">

          <button
            type="button"
            class="program-faq-button"
            aria-expanded="false"
            aria-controls="program-faq-answer-${index}"
            id="program-faq-button-${index}"
          >
            <span class="program-faq-question">
              ${escapeHtml(faq.question)}
            </span>

            <span
              class="program-faq-icon"
              aria-hidden="true"
            >+</span>
          </button>

          <div
            class="program-faq-answer"
            id="program-faq-answer-${index}"
            role="region"
            aria-labelledby="program-faq-button-${index}"
            hidden
          >
            <p>
              ${escapeHtml(faq.answer)}
            </p>
          </div>

        </div>
      `;
      })
      .join("");

    /*
     * FAQ accordion interaction
     */
    const faqButtons = faqGrid.querySelectorAll(".program-faq-button");

    faqButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        const currentItem = button.closest(".program-faq-item");

        const answer = currentItem.querySelector(".program-faq-answer");

        const icon = button.querySelector(".program-faq-icon");

        const isOpen = button.getAttribute("aria-expanded") === "true";

        /*
         * Close every FAQ first.
         */
        faqButtons.forEach(function (otherButton) {
          const otherItem = otherButton.closest(".program-faq-item");

          const otherAnswer = otherItem.querySelector(".program-faq-answer");

          const otherIcon = otherButton.querySelector(".program-faq-icon");

          otherButton.setAttribute("aria-expanded", "false");

          otherAnswer.hidden = true;

          otherItem.classList.remove("program-faq-item--open");

          otherIcon.textContent = "+";
        });

        /*
         * If the clicked FAQ was previously closed,
         * open it.
         */
        if (!isOpen) {
          button.setAttribute("aria-expanded", "true");

          answer.hidden = false;

          currentItem.classList.add("program-faq-item--open");

          icon.textContent = "−";
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     RELATED PROGRAMS
     ------------------------------------------------------------------------ */

  const relatedGrid = document.querySelector("[data-related-grid]");

  if (
    relatedGrid &&
    typeof programOrder !== "undefined" &&
    Array.isArray(programOrder)
  ) {
    const otherPrograms = programOrder.filter(function (programSlug) {
      return programSlug !== slug && programsData[programSlug];
    });

    /*
     * Show programs from the same category first.
     */
    const sameCategory = otherPrograms.filter(function (programSlug) {
      return programsData[programSlug].categorySlug === program.categorySlug;
    });

    /*
     * Then fill remaining spaces with other programs.
     */
    const otherCategories = otherPrograms.filter(function (programSlug) {
      return programsData[programSlug].categorySlug !== program.categorySlug;
    });

    const relatedPrograms = sameCategory.concat(otherCategories).slice(0, 3);

    relatedGrid.innerHTML = relatedPrograms
      .map(function (programSlug) {
        const related = programsData[programSlug];

        return `
          <article class="card" data-reveal>

            <div class="card__media">
              <img
                src="${escapeHtml(related.image)}"
                alt="${escapeHtml(related.imageAlt)}"
                loading="lazy"
              >
            </div>

            <div class="card__body">

              <span class="card__tag">
                ${escapeHtml(related.category)}
                &middot;
                ${escapeHtml(related.duration)}
              </span>

              <h3 class="card__title">
                ${escapeHtml(related.name)}
              </h3>

              <p class="card__desc">
                ${escapeHtml(related.shortDescription)}
              </p>

              <a
                href="class-detail.html?program=${encodeURIComponent(
                  programSlug,
                )}"
                class="card__link"
              >
                View Program
              </a>

            </div>
          </article>
        `;
      })
      .join("");
  }

  /* ------------------------------------------------------------------------
     DEBUG INFORMATION
     ------------------------------------------------------------------------ */

  console.log("IronForge program loaded:", program.name, "(" + slug + ")");
})();
