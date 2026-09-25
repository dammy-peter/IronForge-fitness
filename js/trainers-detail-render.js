/* ==========================================================================
   TRAINER DETAIL RENDER — populates trainer-detail.html from the slug in
   ?trainer=<slug>, using js/trainers-data.js and js/trainer-program-data.js.
   Runs before main.js so dynamically-added FAQ buttons and [data-reveal]
   elements are wired up correctly by main.js's existing listeners.
   ========================================================================== */

(function () {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("trainer");
  const trainer = slug ? getTrainerBySlug(slug) : null;

  const contentEl = document.getElementById("trainer-content");
  const notFoundEl = document.getElementById("trainer-not-found");

  if (!trainer) {
    if (contentEl) contentEl.hidden = true;
    if (notFoundEl) notFoundEl.hidden = false;
    return;
  }

  if (notFoundEl) notFoundEl.hidden = true;
  if (contentEl) contentEl.hidden = false;

  /* ---- SEO ---- */
  const pageTitle = `${trainer.name} | ${trainer.role} | IRONFORGE FITNESS Lagos`;
  const pageDesc = `Meet ${trainer.name}, ${trainer.role} at IRONFORGE FITNESS in Lekki, Lagos, specializing in ${trainer.specialties[0]}.`;
  const pageUrl = `https://www.ironforgefitness.com/trainer-detail.html?trainer=${trainer.slug}`;
  document.title = pageTitle;
  setMeta('meta[name="description"]', "content", pageDesc);
  setMeta('link[rel="canonical"]', "href", pageUrl);
  setMeta('meta[property="og:title"]', "content", pageTitle);
  setMeta('meta[property="og:description"]', "content", pageDesc);
  setMeta('meta[property="og:url"]', "content", pageUrl);
  setMeta('meta[property="og:image"]', "content", trainer.image);
  setMeta('meta[name="twitter:title"]', "content", pageTitle);
  setMeta('meta[name="twitter:description"]', "content", pageDesc);

  function setMeta(selector, attr, value) {
    const el = document.querySelector(selector);
    if (el) el.setAttribute(attr, value);
  }

  /* ---- Breadcrumb ---- */
  const breadcrumb = document.getElementById("breadcrumb-trainer-name");
  if (breadcrumb) breadcrumb.textContent = trainer.name;

  /* ---- Hero ---- */
  const photo = document.getElementById("trainer-photo");
  if (photo) {
    photo.src = trainer.image;
    photo.alt = `${trainer.name}, ${trainer.role} at IRONFORGE FITNESS`;
  }

  setText("trainer-role-eyebrow", trainer.role);
  setText("trainer-name", trainer.name.toUpperCase());
  setText("trainer-short-bio", trainer.shortBio);

  const tagsEl = document.getElementById("trainer-tags");
  if (tagsEl) {
    const tags = [...trainer.specialties.slice(0, 2), `${trainer.experience} Experience`];
    tagsEl.innerHTML = tags
      .map((t) => `<span class="badge"><span class="badge__dot"></span>${t}</span>`)
      .join("");
  }

  setText("cta-train-with", `Train with ${trainer.name.split(" ")[0]}`);

  /* ---- Quick facts ---- */
  const factsEl = document.getElementById("quick-facts");
  if (factsEl) {
    const facts = [
      ["Experience", trainer.experience],
      ["Specialty", trainer.specialties[0]],
      ["Certifications", `${trainer.certifications.length} Held`],
      ["Location", trainer.location],
    ];

    factsEl.innerHTML = facts
      .map(
        ([label, value]) => `
        <div class="stat">
          <p class="stat__num" style="font-size:1.1rem;">${value}</p>
          <p class="stat__label">${label}</p>
        </div>`
      )
      .join("");
  }

  /* ---- About the coach ---- */
  const bioEl = document.getElementById("trainer-bio");
  if (bioEl) bioEl.innerHTML = trainer.bio.map((p) => `<p>${p}</p>`).join("");

  /* ---- Specialties ---- */
  const specialtiesEl = document.getElementById("specialties-list");
  if (specialtiesEl) {
    specialtiesEl.innerHTML = trainer.specialties
      .map((s) => `<li>${s}</li>`)
      .join("");
  }

  /* ---- Coaching philosophy ---- */
  setText("philosophy-text", trainer.philosophy);

  /* ---- Training approach ---- */
  setText("training-style-text", trainer.trainingStyle);

  const principlesEl = document.getElementById("training-principles");

  if (principlesEl) {
    if (trainer.trainingPrinciples && trainer.trainingPrinciples.length) {
      principlesEl.hidden = false;
      principlesEl.innerHTML = trainer.trainingPrinciples
        .map(
          (p) =>
            `<div class="benefit"><h3 style="font-size:0.95rem;">${p}</h3></div>`
        )
        .join("");
    } else {
      principlesEl.hidden = true;
    }
  }

  /* ---- Who they work with ---- */
  const whoEl = document.getElementById("who-they-help-list");

  if (whoEl) {
    whoEl.innerHTML = trainer.whoTheyHelp
      .map((w) => `<span class="badge"><span class="badge__dot"></span>${w}</span>`)
      .join("");
  }

  /* ---- Programs & classes ---- */
  const programsSection = document.getElementById("programs-section");
  const programsEl = document.getElementById("programs-grid");

  const trainerPrograms = (trainer.programs || [])
    .map((slugId) => getProgramBySlug(slugId))
    .filter(Boolean);

  if (programsEl) {
    if (trainerPrograms.length) {
      if (programsSection) programsSection.hidden = false;

      programsEl.innerHTML = trainerPrograms
        .map(
          (p) => `
          <article class="card" data-reveal>
            <div class="card__media">
              <img src="${p.image}" alt="${p.name} program at IronForge Fitness" loading="lazy">
            </div>
            <div class="card__body">
              <span class="card__tag">${p.category}</span>
              <h3 class="card__title">${p.name}</h3>
              <p class="card__desc">${p.description}</p>
              <a href="class-detail.html?program=${p.slug}" class="card__link">View Program</a>
            </div>
          </article>`
        )
        .join("");
    } else if (programsSection) {
      programsSection.hidden = true;
    }
  }

  /* ---- Availability ---- */
  setText("availability-text", trainer.availability);

  /* ---- Testimonial ---- */
  const testimonialSection = document.getElementById("testimonial-section");

  if (testimonialSection) {
    if (trainer.testimonial) {
      testimonialSection.hidden = false;
      setText("testimonial-quote", `“${trainer.testimonial.quote}”`);
      setText("testimonial-author", trainer.testimonial.author);
    } else {
      testimonialSection.hidden = true;
    }
  }

  /* ---- Certifications ---- */
  const certsEl = document.getElementById("certifications-list");

  if (certsEl) {
    certsEl.innerHTML = trainer.certifications
      .map((c) => `<li>${c}</li>`)
      .join("");
  }

  /* ---- FAQ ---- */
  const faqSection = document.getElementById("faq-section");
  const faqListEl = document.getElementById("faq-list");

  if (faqListEl) {
    const firstName = trainer.name.split(" ")[0];

    const faqs = [
      {
        q: "What type of training do you specialize in?",
        a: `${firstName} specializes in ${trainer.specialties.join(", ")}.`,
      },
      {
        q: "Who is your coaching best suited for?",
        a: `${firstName} works particularly well with ${trainer.whoTheyHelp
          .join(", ")
          .toLowerCase()}.`,
      },
      {
        q: "Which programs do you coach?",
        a: trainerPrograms.length
          ? `${firstName} currently coaches ${trainerPrograms
              .map((p) => p.name)
              .join(" and ")} at IRONFORGE.`
          : `${firstName} coaches one-on-one sessions tailored to individual member goals.`,
      },
      {
        q: "How can I train with you?",
        a: `Get started by joining IRONFORGE or booking a free trial, and let the team know you'd like to train with ${firstName}.`,
      },
    ];

    if (faqSection) faqSection.hidden = false;

    faqListEl.innerHTML = faqs
      .map(
        (f, i) => `
        <div class="faq-item">
          <button class="faq-item__q" aria-expanded="false" aria-controls="faq-a-${i}">
            <span>${f.q}</span>
            <span class="faq-item__icon" aria-hidden="true"></span>
          </button>
          <div class="faq-item__a" id="faq-a-${i}">
            <p>${f.a}</p>
          </div>
        </div>`
      )
      .join("");
  }

  /* ---- Related trainers ---- */
  const relatedEl = document.getElementById("related-trainers-grid");

  if (relatedEl) {
    const related = getRelatedTrainers(trainer, 3);

    relatedEl.innerHTML = related
      .map(
        (t) => `
        <article class="card trainer-card" data-reveal>
          <div class="card__media trainer-card__media">
            <img src="${t.image}" alt="${t.name}, ${t.role} at IRONFORGE FITNESS" loading="lazy">
          </div>
          <div class="card__body">
            <span class="trainer-card__specialty">${t.specialties[0]}</span>
            <h3 class="card__title">${t.name}</h3>
            <p class="card__desc">${t.role}</p>
            <a href="trainer-detail.html?trainer=${t.slug}" class="card__link">View Profile</a>
          </div>
        </article>`
      )
      .join("");
  }

  /* ---- Final CTA ---- */
  setText(
    "final-cta-heading",
    `READY TO TRAIN WITH ${trainer.name.toUpperCase()}?`
  );

  setText(
    "final-cta-text",
    `Join IRONFORGE, meet ${trainer.name.split(" ")[0]} and take the first step toward your next level.`
  );

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }
})();