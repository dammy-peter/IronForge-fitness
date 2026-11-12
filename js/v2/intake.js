/* Version 2: free-trial and personal-training request flow. */
(function () {
  if (!window.IronForgeAPI) return;

  const todayInLagos = () => new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Lagos", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());

  let activeTrigger = null;
  let modal = null;
  let previousFocus = null;

  function getModal() {
    if (modal) return modal;
    modal = document.createElement("div");
    modal.className = "v2-modal";
    modal.dataset.v2IntakeModal = "";
    modal.innerHTML = `
      <div class="v2-modal__backdrop" data-v2-intake-close></div>
      <section class="v2-modal__panel" role="dialog" aria-modal="true" aria-labelledby="v2-intake-title" tabindex="-1">
        <button class="v2-modal__close" type="button" aria-label="Close request form" data-v2-intake-close>&times;</button>
        <p class="eyebrow" data-v2-intake-eyebrow>Get started</p>
        <h2 id="v2-intake-title" data-v2-intake-title>REQUEST A FREE TRIAL.</h2>
        <p class="v2-modal__session" data-v2-intake-description>Tell us when you would like to visit. Our team will contact you to confirm.</p>
        <form data-v2-intake-form>
          <div class="field"><label for="v2-intake-name">Full name *</label><input id="v2-intake-name" name="fullName" autocomplete="name" required minlength="2" maxlength="120"></div>
          <div class="field"><label for="v2-intake-email">Email address *</label><input id="v2-intake-email" name="email" type="email" autocomplete="email" required maxlength="254"></div>
          <div class="field"><label for="v2-intake-phone">Phone number *</label><input id="v2-intake-phone" name="phone" type="tel" autocomplete="tel" required minlength="7" maxlength="30" placeholder="+234..."></div>
          <div class="form-row form-row--2">
            <div class="field"><label for="v2-intake-date">Preferred date *</label><input id="v2-intake-date" name="preferredDate" type="date" required></div>
            <div class="field"><label for="v2-intake-time">Preferred time *</label><select id="v2-intake-time" name="preferredTime" required><option value="">Choose a time</option><option>Early morning (6 AM–9 AM)</option><option>Late morning (9 AM–12 PM)</option><option>Afternoon (12 PM–4 PM)</option><option>Evening (4 PM–8 PM)</option></select></div>
          </div>
          <div class="field"><label for="v2-intake-goal">Your fitness goal</label><select id="v2-intake-goal" name="fitnessGoal"><option value="">Select a goal (optional)</option><option>Build strength</option><option>Build muscle</option><option>Improve endurance</option><option>Improve mobility</option><option>General fitness</option><option>Weight management</option></select></div>
          <div class="field"><label for="v2-intake-level">Training experience</label><select id="v2-intake-level" name="experienceLevel"><option value="">Select experience (optional)</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div>
          <div class="field"><label for="v2-intake-notes">Additional notes (optional)</label><textarea id="v2-intake-notes" name="notes" rows="3" maxlength="2000" placeholder="Anything you would like our team to know?"></textarea></div>
          <label class="v2-honeypot" aria-hidden="true">Leave this field empty<input name="website" tabindex="-1" autocomplete="off"></label>
          <button class="btn btn--primary btn--block" type="submit" data-v2-intake-submit>Send request</button>
          <p class="form-message" role="status" aria-live="polite" data-v2-intake-message></p>
          <p class="v2-modal__fineprint">This is a request, not a confirmed appointment. The IronForge team will contact you to confirm availability.</p>
        </form>
      </section>`;
    document.body.append(modal);
    modal.querySelector("[name='preferredDate']").min = todayInLagos();
    modal.addEventListener("click", (event) => {
      if (event.target.closest("[data-v2-intake-close]")) closeModal();
    });
    modal.querySelector("form").addEventListener("submit", submitRequest);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.classList.contains("is-open")) closeModal();
      if (event.key === "Tab" && modal.classList.contains("is-open")) trapFocus(event);
    });
    return modal;
  }

  function openModal(trigger) {
    activeTrigger = trigger;
    previousFocus = document.activeElement;
    const panel = getModal();
    const type = trigger.dataset.v2Intake || "free_trial";
    const isPT = type === "personal_training";
    panel.dataset.requestType = type;
    panel.querySelector("[data-v2-intake-eyebrow]").textContent = isPT ? "One-on-one coaching" : "Your first visit";
    panel.querySelector("[data-v2-intake-title]").textContent = isPT ? "REQUEST PERSONAL TRAINING." : "REQUEST A FREE TRIAL.";
    panel.querySelector("[data-v2-intake-description]").textContent = isPT
      ? `Choose a preferred time to meet${trigger.dataset.trainerName ? ` ${trigger.dataset.trainerName}` : " one of our coaches"}. Our team will confirm availability.`
      : "Tell us when you would like to visit. Our team will contact you to confirm.";
    panel.querySelector("[data-v2-intake-message]").textContent = "";
    panel.querySelector("[data-v2-intake-message]").className = "form-message";
    panel.querySelector("form").reset();
    panel.querySelector("[name='preferredDate']").min = todayInLagos();
    const submit = panel.querySelector("[data-v2-intake-submit]");
    submit.disabled = false;
    submit.textContent = isPT ? "Request a coaching session" : "Request my free trial";
    panel.classList.add("is-open");
    document.body.classList.add("v2-modal-open");
    panel.querySelector("#v2-intake-name").focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("is-open");
    document.body.classList.remove("v2-modal-open");
    if (previousFocus && typeof previousFocus.focus === "function") previousFocus.focus();
  }

  function trapFocus(event) {
    const focusable = [...modal.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
      .filter((element) => element.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  async function submitRequest(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const panel = form.closest("[data-v2-intake-modal]");
    const button = form.querySelector("[data-v2-intake-submit]");
    const message = form.querySelector("[data-v2-intake-message]");
    const values = Object.fromEntries(new FormData(form).entries());
    if (values.website) return;
    if (values.preferredDate < todayInLagos()) {
      message.textContent = "Choose today or a future date.";
      message.classList.add("form-message--error", "is-visible");
      return;
    }
    const type = panel.dataset.requestType;
    const trigger = activeTrigger;
    button.disabled = true;
    button.textContent = "Sending request…";
    message.textContent = "";
    try {
      const result = await window.IronForgeAPI.submitIntake({
        type,
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        preferredDate: values.preferredDate,
        preferredTime: values.preferredTime,
        fitnessGoal: values.fitnessGoal,
        experienceLevel: values.experienceLevel,
        trainerSlug: trigger?.dataset.trainerSlug || "",
        trainerName: trigger?.dataset.trainerName || "",
        notes: values.notes,
        sourcePage: location.pathname.split("/").pop() || "index.html",
      }, { idempotencyKey: window.crypto?.randomUUID ? window.crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}` });
      message.textContent = `Your request has been received. Reference: ${result.reference}. It remains pending until our team confirms your appointment.`;
      message.classList.add("form-message--success", "is-visible");
      form.reset();
      button.textContent = "Request received";
    } catch (error) {
      const errors = {
        BACKEND_NOT_CONFIGURED: "Online requests are not configured yet. Please contact the gym by phone or WhatsApp.",
        RATE_LIMITED: "Too many requests. Please wait a few minutes and try again.",
        INVALID_PREFERRED_DATE: "Choose today or a future date.",
        PREFERRED_TIME_REQUIRED: "Choose a preferred time.",
      };
      message.textContent = errors[error.message] || "We couldn't send your request. Please try again or contact the gym.";
      message.classList.add("form-message--error", "is-visible");
      button.disabled = false;
      button.textContent = type === "personal_training" ? "Request a coaching session" : "Request my free trial";
    }
  }

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-v2-intake]");
    if (!trigger) return;
    event.preventDefault();
    openModal(trigger);
  });
})();
