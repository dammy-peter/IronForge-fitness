/* ==========================================================================
   FORMS — contact form validation (frontend-only demo, no backend submission)
   NOTE: This is a Version 1 frontend template. There is no server to send
   this data to. On successful validation we simply show a confirmation
   message and reset the form. Wire this up to a real backend / form
   service (e.g. your own API, Formspree, etc.) in a later version.
   ========================================================================== */

(function () {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const messageBox = form.querySelector(".form-message");

  function setError(field, message) {
    const wrapper = field.closest(".field");
    if (!wrapper) return;
    wrapper.classList.add("has-error");
    const errorEl = wrapper.querySelector(".field-error");
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add("is-visible");
    }
  }

  function clearError(field) {
    const wrapper = field.closest(".field");
    if (!wrapper) return;
    wrapper.classList.remove("has-error");
    const errorEl = wrapper.querySelector(".field-error");
    if (errorEl) errorEl.classList.remove("is-visible");
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function isValidPhone(value) {
    return /^[0-9+()\s-]{7,20}$/.test(value);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let isValid = true;

    const name = form.querySelector("#name");
    const email = form.querySelector("#email");
    const phone = form.querySelector("#phone");
    const message = form.querySelector("#message");

    [name, email, phone, message].forEach((f) => f && clearError(f));

    if (!name.value.trim()) {
      setError(name, "Please tell us your full name.");
      isValid = false;
    }

    if (!email.value.trim() || !isValidEmail(email.value.trim())) {
      setError(email, "Enter a valid email address.");
      isValid = false;
    }

    // Phone is optional — only validate format if the person entered one.
    if (phone.value.trim() && !isValidPhone(phone.value.trim())) {
      setError(phone, "Enter a valid phone number.");
      isValid = false;
    }

    if (!message.value.trim() || message.value.trim().length < 10) {
      setError(message, "Message should be at least 10 characters.");
      isValid = false;
    }

    if (!isValid) {
      messageBox.textContent =
        "Please fix the highlighted fields and try again.";
      messageBox.classList.remove("form-message--success");
      messageBox.classList.add("form-message--error", "is-visible");
      return;
    }

    // Demo-only success path — no data is actually sent anywhere.
    messageBox.textContent =
      "Thanks! Your message has been received. Our team will get back to you shortly.";
    messageBox.classList.remove("form-message--error");
    messageBox.classList.add("form-message--success", "is-visible");
    form.reset();
  });

  // Clear field error as the user types
  form.querySelectorAll("input, textarea, select").forEach((field) => {
    field.addEventListener("input", () => clearError(field));
  });
})();