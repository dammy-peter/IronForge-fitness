/* Version 2 contact form: validated browser input, secure Edge Function write. */
(function () {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;
  const messageBox = form.querySelector(".form-message");
  const submitButton = form.querySelector("[data-contact-submit]");

  function setError(field, message) {
    const wrapper = field.closest(".field");
    if (!wrapper) return;
    wrapper.classList.add("has-error");
    const errorEl = wrapper.querySelector(".field-error");
    if (errorEl) { errorEl.textContent = message; errorEl.classList.add("is-visible"); }
  }
  function clearError(field) {
    const wrapper = field.closest(".field");
    if (!wrapper) return;
    wrapper.classList.remove("has-error");
    const errorEl = wrapper.querySelector(".field-error");
    if (errorEl) errorEl.classList.remove("is-visible");
  }
  const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validPhone = (value) => /^[0-9+()\s.-]{7,30}$/.test(value);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = form.querySelector("#name");
    const email = form.querySelector("#email");
    const phone = form.querySelector("#phone");
    const subject = form.querySelector("#subject");
    const message = form.querySelector("#message");
    [name, email, phone, message].forEach((field) => field && clearError(field));
    let valid = true;
    if (!name.value.trim() || name.value.trim().length < 2) { setError(name, "Enter your full name (at least 2 characters)."); valid = false; }
    if (!validEmail(email.value.trim())) { setError(email, "Enter a valid email address."); valid = false; }
    if (phone.value.trim() && !validPhone(phone.value.trim())) { setError(phone, "Enter a valid phone number."); valid = false; }
    if (message.value.trim().length < 10) { setError(message, "Message should be at least 10 characters."); valid = false; }
    if (!valid) {
      messageBox.textContent = "Please fix the highlighted fields and try again.";
      messageBox.className = "form-message form-message--error is-visible";
      return;
    }
    const values = Object.fromEntries(new FormData(form).entries());
    if (values.website) return;
    submitButton.disabled = true;
    submitButton.textContent = "Sending message…";
    messageBox.textContent = "";
    messageBox.className = "form-message";
    try {
      const result = await window.IronForgeAPI.submitIntake({
        type: subject.value === "Membership" ? "membership" : "contact",
        fullName: name.value.trim(), email: email.value.trim(), phone: phone.value.trim(),
        subject: subject.value || "General Enquiry", message: message.value.trim(),
        sourcePage: location.pathname.split("/").pop() || "contact.html",
      }, { idempotencyKey: window.crypto?.randomUUID ? window.crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}` });
      messageBox.textContent = `Thank you. Your message has been received. Reference: ${result.reference}. Our team will get back to you.`;
      messageBox.className = "form-message form-message--success is-visible";
      form.reset();
      submitButton.textContent = "Message sent";
    } catch (error) {
      const errors = {
        BACKEND_NOT_CONFIGURED: "Online enquiries are not configured. Please contact the gym by phone or WhatsApp.",
        RATE_LIMITED: "Too many requests. Please wait a few minutes and try again.",
        MESSAGE_TOO_SHORT: "Please enter a message of at least 10 characters.",
      };
      messageBox.textContent = errors[error.message] || "We couldn't send your message. Please try again.";
      messageBox.className = "form-message form-message--error is-visible";
      submitButton.disabled = false;
      submitButton.textContent = "Send Message";
    }
  });
  form.querySelectorAll("input, textarea, select").forEach((field) => field.addEventListener("input", () => clearError(field)));
})();
