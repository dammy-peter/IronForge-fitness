/* ==========================================================================
   MEMBERSHIP RENDER — builds pricing, comparison and add-on UI from the
   centralized membership data so future pricing changes stay in one file.
   ========================================================================== */

(function () {
  const plansGrid = document.querySelector("[data-membership-plans]");
  const comparisonHead = document.querySelector("[data-membership-comparison-head]");
  const comparisonBody = document.querySelector("[data-membership-comparison-body]");
  const addOnsGrid = document.querySelector("[data-membership-addons]");

  if (!plansGrid || !comparisonHead || !comparisonBody || !addOnsGrid) return;

  const check = '<span class="comparison-mark comparison-mark--yes" aria-label="Included">✓</span>';
  const dash = '<span class="comparison-mark comparison-mark--no" aria-label="Not included">—</span>';

  plansGrid.innerHTML = membershipPlans
    .map(
      (plan) => `
        <article class="plan-card${plan.popular ? " plan-card--featured" : ""}" id="plan-${plan.slug}" data-reveal>
          ${plan.popular ? '<span class="plan-card__badge">Most Popular</span>' : ""}
          <div class="plan-card__top">
            <div class="plan-card__name">${plan.name}</div>
            <p class="plan-card__duration">${plan.duration}</p>
            <div class="plan-card__price">${plan.price}<span>${plan.period}</span></div>
            <p class="plan-card__description">${plan.description}</p>
          </div>
          <ul class="plan-card__list" aria-label="${plan.name} membership benefits">
            ${plan.features.map((feature) => `<li>${feature}</li>`).join("")}
          </ul>
          <a href="contact.html" class="btn ${plan.popular ? "btn--primary" : "btn--outline"} btn--block">${plan.cta}</a>
        </article>`
    )
    .join("");

  comparisonHead.innerHTML = `
    <tr>
      <th scope="col">Benefit</th>
      ${membershipPlans.map((plan) => `<th scope="col">${plan.name}</th>`).join("")}
    </tr>`;

  comparisonBody.innerHTML = membershipComparison
    .map(
      (row) => `
        <tr>
          <th scope="row">${row.feature}</th>
          <td>${renderComparisonValue(row.starter)}</td>
          <td>${renderComparisonValue(row.pro)}</td>
          <td>${renderComparisonValue(row.elite)}</td>
        </tr>`
    )
    .join("");

  addOnsGrid.innerHTML = membershipAddOns
    .map(
      (item) => `
        <article class="addon-card" data-reveal>
          <h3>${item.name}</h3>
          <div class="addon-card__price">${item.price}<span>${item.period}</span></div>
          <p>${item.description}</p>
        </article>`
    )
    .join("");

  // Re-run reveal setup for content inserted after main.js would otherwise
  // have collected its [data-reveal] elements.
  const revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el) => {
      if (!el.classList.contains("is-visible")) observer.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  function renderComparisonValue(value) {
    if (value === true) return check;
    if (value === false) return dash;
    return `<span class="comparison-text">${value}</span>`;
  }
})();