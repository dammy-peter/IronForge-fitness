/* ==========================================================================
   CONFIG — single source of truth for gym brand data.
   Replace these values to re-brand the entire template for a new client.
   Every page includes this file first, before any other script.
   ========================================================================== */

const gymConfig = {
  name: "IRONFORGE FITNESS",
  shortName: "IronForge",
  tagline: "Train Hard. Live Strong.",
  description:
    "Premium fitness, expert coaching and a community built to help you become stronger.",
  location: "Lekki, Lagos, Nigeria",
  address: "12 Admiralty Way, Lekki Phase 1, Lagos, Nigeria",
  phone: "+234 812 147 0593",
  phoneHref: "tel:+2348121470593",
  whatsapp: "+234 812 147 0593",
  whatsappHref: "https://wa.me/2348121470593",
  whatsappMessage:
    "https://wa.me/2348121470593?text=Hi%20IronForge%2C%20I%27d%20like%20to%20know%20more%20about%20membership.",
  email: "hello@ironforgefitness.com",
  hours: [
    { days: "Monday – Friday", time: "5:30 AM – 10:00 PM" },
    { days: "Saturday", time: "7:00 AM – 8:00 PM" },
    { days: "Sunday", time: "8:00 AM – 6:00 PM" },
  ],
  social: {
    instagram: "https://instagram.com/ironforgefitness",
    facebook: "https://facebook.com/ironforgefitness",
    tiktok: "https://tiktok.com/@ironforgefitness",
    youtube: "https://youtube.com/@ironforgefitness",
  },
};

/**
 * Populates every element carrying a data-gym-* attribute with the matching
 * value from gymConfig, and wires up data-gym-href-* attributes (for
 * tel:/mailto:/WhatsApp links). This lets brand data live in one place
 * instead of being hard-coded on every page.
 */
function applyGymConfig() {
  document.querySelectorAll("[data-gym-text]").forEach((el) => {
    const key = el.getAttribute("data-gym-text");
    if (gymConfig[key] !== undefined) el.textContent = gymConfig[key];
  });

  document.querySelectorAll("[data-gym-href]").forEach((el) => {
    const key = el.getAttribute("data-gym-href");
    if (gymConfig[key] !== undefined) el.setAttribute("href", gymConfig[key]);
  });

  const yearEls = document.querySelectorAll("[data-current-year]");
  const year = new Date().getFullYear();
  yearEls.forEach((el) => (el.textContent = year));
}

document.addEventListener("DOMContentLoaded", applyGymConfig);