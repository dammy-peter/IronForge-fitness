/* Version 2: live class timetable and class booking request UI. */
(function () {
  const scheduleSections = document.querySelectorAll("[data-v2-schedule]");
  if (!scheduleSections.length || !window.IronForgeAPI) return;

  const dateFormatter = new Intl.DateTimeFormat("en-NG", {
    timeZone: "Africa/Lagos", weekday: "long", day: "numeric", month: "short",
  });
  const timeFormatter = new Intl.DateTimeFormat("en-NG", {
    timeZone: "Africa/Lagos", hour: "numeric", minute: "2-digit",
  });

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    })[char]);
  }

  function getModal() {
    let modal = document.querySelector("[data-v2-booking-modal]");
    if (modal) return modal;
    modal = document.createElement("div");
    modal.className = "v2-modal";
    modal.dataset.v2BookingModal = "";
    modal.innerHTML = `
      <div class="v2-modal__backdrop" data-v2-close></div>
      <section class="v2-modal__panel" role="dialog" aria-modal="true" aria-labelledby="v2-booking-title" tabindex="-1">
        <button class="v2-modal__close" type="button" aria-label="Close booking form" data-v2-close>&times;</button>
        <p class="eyebrow">Reserve your place</p>
        <h2 id="v2-booking-title">REQUEST A CLASS BOOKING.</h2>
        <p class="v2-modal__session" data-v2-selected-session></p>
        <form data-v2-booking-form>
          <div class="field"><label for="v2-booking-name">Full name *</label><input id="v2-booking-name" name="fullName" autocomplete="name" required minlength="2" maxlength="120"></div>
          <div class="field"><label for="v2-booking-email">Email address *</label><input id="v2-booking-email" name="email" type="email" autocomplete="email" required maxlength="254"></div>
          <div class="field"><label for="v2-booking-phone">Phone number *</label><input id="v2-booking-phone" name="phone" type="tel" autocomplete="tel" required minlength="7" maxlength="30" placeholder="+234..."></div>
          <div class="field"><label for="v2-booking-notes">Anything the coach should know? (optional)</label><textarea id="v2-booking-notes" name="notes" rows="3" maxlength="2000"></textarea></div>
          <label class="v2-honeypot" aria-hidden="true">Leave this field empty<input name="website" tabindex="-1" autocomplete="off"></label>
          <button class="btn btn--primary btn--block" type="submit" data-v2-submit>Send booking request</button>
          <p class="form-message" role="status" aria-live="polite" data-v2-booking-message></p>
          <p class="v2-modal__fineprint">Your request is pending until the IronForge team confirms your place.</p>
        </form>
      </section>`;
    document.body.append(modal);
    modal.addEventListener("click", (event) => {
      if (event.target.closest("[data-v2-close]")) closeModal();
    });
    modal.querySelector("form").addEventListener("submit", submitBooking);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.classList.contains("is-open")) closeModal();
    });
    return modal;
  }

  let selectedSession = null;
  let previousFocus = null;
  function openModal(session) {
    selectedSession = session;
    const modal = getModal();
    previousFocus = document.activeElement;
    modal.querySelector("[data-v2-selected-session]").textContent = `${session.class_name} · ${dateFormatter.format(new Date(session.starts_at))} · ${timeFormatter.format(new Date(session.starts_at))} · Coach ${session.trainer_name || "IronForge team"}`;
    modal.querySelector("[data-v2-booking-message]").textContent = "";
    modal.querySelector("form").reset();
    modal.classList.add("is-open");
    document.body.classList.add("v2-modal-open");
    modal.querySelector(".v2-modal__panel").focus();
    modal.querySelector("#v2-booking-name").focus();
  }
  function closeModal() {
    const modal = document.querySelector("[data-v2-booking-modal]");
    if (!modal) return;
    modal.classList.remove("is-open");
    document.body.classList.remove("v2-modal-open");
    if (previousFocus && previousFocus.focus) previousFocus.focus();
  }

  async function submitBooking(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const button = form.querySelector("[data-v2-submit]");
    const message = form.querySelector("[data-v2-booking-message]");
    const values = Object.fromEntries(new FormData(form).entries());
    if (values.website) return;
    button.disabled = true;
    button.textContent = "Sending request…";
    message.textContent = "";
    message.className = "form-message";
    try {
      const result = await window.IronForgeAPI.submitIntake({
        type: "class",
        sessionId: selectedSession.id,
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        notes: values.notes,
        sourcePage: location.pathname.split("/").pop() || "index.html",
      }, { idempotencyKey: window.crypto?.randomUUID ? window.crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}` });
      message.textContent = `Request received. Your reference is ${result.reference}. The gym will contact you to confirm.`;
      message.classList.add("form-message--success", "is-visible");
      form.reset();
      button.textContent = "Request sent";
    } catch (error) {
      const messages = {
        BACKEND_NOT_CONFIGURED: "Online booking is not configured yet. Please contact the gym directly.",
        SESSION_FULL: "Sorry, this session has just filled up. Please choose another session.",
        SESSION_UNAVAILABLE: "This session is no longer available. Please refresh the timetable.",
        RATE_LIMITED: "Too many requests. Please wait a few minutes and try again.",
      };
      message.textContent = messages[error.message] || "We couldn't send your request. Please try again or contact the gym.";
      message.classList.add("form-message--error", "is-visible");
      button.disabled = false;
      button.textContent = "Send booking request";
    }
  }

  function renderSchedule(section, sessions, isHome) {
    const oldDesktop = section.querySelector(".timetable-desktop");
    const oldMobile = section.querySelector(".timetable-mobile");
    if (!oldDesktop || !oldMobile) return;

    const wrapper = document.createElement("div");
    wrapper.className = "v2-schedule";
    const dayOptions = [...new Set(sessions.map((item) => dateFormatter.format(new Date(item.starts_at))))];
    wrapper.innerHTML = `
      <div class="v2-schedule__toolbar">
        <label>Show sessions <select data-v2-day-filter><option value="all">All upcoming days</option>${dayOptions.map((day) => `<option value="${escapeHtml(day)}">${escapeHtml(day)}</option>`).join("")}</select></label>
        <label>Program <select data-v2-class-filter><option value="all">All programs</option>${[...new Set(sessions.map((item) => item.class_name))].sort().map((name) => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join("")}</select></label>
      </div>
      <div class="v2-schedule__grid" data-v2-session-grid></div>
      <p class="v2-schedule__note">Bookings are requests and remain pending until confirmed by the gym.</p>`;
    oldDesktop.hidden = true;
    oldMobile.hidden = true;
    const legacyNote = section.querySelector("#full-schedule");
    if (legacyNote) legacyNote.hidden = true;
    oldMobile.insertAdjacentElement("afterend", wrapper);

    const grid = wrapper.querySelector("[data-v2-session-grid]");
    const dayFilter = wrapper.querySelector("[data-v2-day-filter]");
    const classFilter = wrapper.querySelector("[data-v2-class-filter]");
    function paint() {
      const filtered = sessions.filter((item) => {
        const day = dateFormatter.format(new Date(item.starts_at));
        return (dayFilter.value === "all" || day === dayFilter.value) &&
          (classFilter.value === "all" || item.class_name === classFilter.value);
      }).slice(0, isHome ? 6 : 60);
      if (!filtered.length) {
        grid.innerHTML = '<p class="v2-schedule__empty">No sessions match those filters. Try another day or program.</p>';
        return;
      }
      grid.innerHTML = filtered.map((item) => {
        const remaining = Number(item.available_spots ?? 0);
        const full = remaining <= 0;
        return `<article class="v2-session-card">
          <div class="v2-session-card__top"><span>${escapeHtml(dateFormatter.format(new Date(item.starts_at)))}</span><span>${escapeHtml(timeFormatter.format(new Date(item.starts_at)))}</span></div>
          <h3>${escapeHtml(item.class_name)}</h3>
          <p>Coach ${escapeHtml(item.trainer_name || "IronForge team")} · ${Number(item.duration_minutes)} min</p>
          <div class="v2-session-card__bottom"><span class="${full ? "is-full" : ""}">${full ? "Fully booked" : `${remaining} places left`}</span><button class="btn btn--primary btn--sm" type="button" data-v2-book="${escapeHtml(item.id)}" ${full ? "disabled" : ""}>${full ? "Unavailable" : "Book a spot"}</button></div>
        </article>`;
      }).join("");
      grid.querySelectorAll("[data-v2-book]").forEach((button) => {
        button.addEventListener("click", () => {
          const session = sessions.find((item) => item.id === button.dataset.v2Book);
          if (session) openModal(session);
        });
      });
    }
    dayFilter.addEventListener("change", paint);
    classFilter.addEventListener("change", paint);
    paint();
  }

  async function init() {
    if (!window.ironForgeBackendReady || !window.ironForgeBackendReady()) return;
    scheduleSections.forEach((section) => {
      const note = document.createElement("p");
      note.className = "v2-schedule__loading";
      note.textContent = "Loading upcoming sessions…";
      const mobile = section.querySelector(".timetable-mobile");
      if (mobile) mobile.insertAdjacentElement("afterend", note);
    });
    try {
      const sessions = await window.IronForgeAPI.getSessions();
      document.querySelectorAll(".v2-schedule__loading").forEach((el) => el.remove());
      if (!sessions.length) {
        scheduleSections.forEach((section) => {
          section.querySelectorAll(".timetable-desktop, .timetable-mobile, #full-schedule").forEach((el) => el.hidden = true);
          const empty = document.createElement("p");
          empty.className = "v2-schedule__empty";
          empty.textContent = "No upcoming sessions have been published yet. Please contact the gym for the latest schedule.";
          section.append(empty);
        });
        return;
      }
      scheduleSections.forEach((section) => renderSchedule(section, sessions, section.hasAttribute("data-v2-schedule-home")));
    } catch (error) {
      document.querySelectorAll(".v2-schedule__loading").forEach((el) => {
        el.textContent = "Live timetable is temporarily unavailable. The published schedule is shown below.";
      });
      console.error("IronForge timetable failed to load", error);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
