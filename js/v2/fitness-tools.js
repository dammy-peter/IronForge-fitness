/* Version 2 fitness estimators and weekday-aware local workout planner. */
(function () {
  const bmiForm = document.querySelector("[data-bmi-form]");
  const calorieForm = document.querySelector("[data-calorie-form]");
  const workoutForm = document.querySelector("[data-workout-form]");
  const planOutput = document.querySelector("[data-plan-output]");
  const planActions = document.querySelector("[data-plan-actions]");
  const storageKey = "ironforgeWorkoutPlanV2";
  const number = (form, name) => Number(new FormData(form).get(name));
  const validRange = (value, min, max) => Number.isFinite(value) && value >= min && value <= max;

  if (bmiForm) bmiForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const height = number(bmiForm, "height");
    const weight = number(bmiForm, "weight");
    const output = document.querySelector("[data-bmi-result]");
    if (!validRange(height, 120, 230) || !validRange(weight, 25, 300)) {
      output.textContent = "Enter a height between 120–230 cm and weight between 25–300 kg.";
      return;
    }
    const bmi = weight / ((height / 100) ** 2);
    const category = bmi < 18.5 ? "Below the standard adult reference range" : bmi < 25 ? "Within the standard adult reference range" : bmi < 30 ? "Above the standard adult reference range" : "Well above the standard adult reference range";
    output.innerHTML = `<span class="v2-tool-result__value">${bmi.toFixed(1)}</span><strong>${category}</strong><small>This is a screening estimate only. BMI is not a diagnosis and does not account for muscle mass or body composition.</small>`;
  });

  if (calorieForm) calorieForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(calorieForm);
    const sex = data.get("sex");
    const age = number(calorieForm, "age");
    const height = number(calorieForm, "height");
    const weight = number(calorieForm, "weight");
    const activity = number(calorieForm, "activity");
    const output = document.querySelector("[data-calorie-result]");
    if (!["male", "female"].includes(sex) || !validRange(age, 18, 100) || !validRange(height, 120, 230) || !validRange(weight, 25, 300) || ![1.2, 1.375, 1.55, 1.725, 1.9].includes(activity)) {
      output.textContent = "Check your details. This estimator is intended for adults aged 18–100.";
      return;
    }
    const base = (10 * weight) + (6.25 * height) - (5 * age) + (sex === "male" ? 5 : -161);
    const maintenance = Math.round(base * activity);
    output.innerHTML = `<span class="v2-tool-result__value">${maintenance.toLocaleString("en-NG")} kcal</span><strong>Estimated daily maintenance energy</strong><small>This Mifflin–St Jeor estimate is approximate, not a prescribed calorie target. Actual needs can differ.</small>`;
  });

  const plans = {
    general: ["Full-body strength + easy cardio", "Low-impact cardio + mobility", "Full-body strength + core", "Full-body circuit", "Steady cardio + mobility", "Full-body strength + balance"],
    strength: ["Lower-body strength", "Upper-body strength", "Full-body compound lifts", "Accessory strength + core", "Lower-body technique + power", "Upper-body volume + stability"],
    muscle: ["Upper body — push focus", "Lower body — squat focus", "Upper body — pull focus", "Lower body — hinge focus", "Arms + shoulders", "Full-body accessory session"],
    "fat-loss": ["Full-body resistance training", "Moderate cardio + mobility", "Full-body resistance training", "Low-impact intervals", "Full-body circuit", "Steady cardio + core"],
    mobility: ["Full-body mobility flow", "Light cardio + joint control", "Mobility + balance", "Stretch and movement practice", "Controlled range-of-motion work", "Recovery-focused movement"],
  };
  const goalLabels = { general: "General fitness", strength: "Build strength", muscle: "Build muscle", "fat-loss": "Fitness and fat loss", mobility: "Mobility and recovery" };
  const levelLabels = { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" };
  const levelNotes = {
    beginner: "Keep the effort comfortable, learn technique and start with 1–2 working sets per exercise.",
    intermediate: "Use controlled progressions and leave recovery time between demanding sessions.",
    advanced: "Adjust volume and intensity to your recovery, training history and coaching plan.",
  };

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    })[char]);
  }

  function renderPlan(plan) {
    if (!planOutput || !plan || !Array.isArray(plan.sessions) || !goalLabels[plan.goal] || !levelLabels[plan.level]) return;
    planOutput.innerHTML = `<p class="eyebrow">Your weekly outline</p><h2>${goalLabels[plan.goal].toUpperCase()}.</h2><p class="v2-plan-summary">${plan.days} training days · ${levelLabels[plan.level]} · Example weekly structure</p><div class="v2-plan-days">${plan.sessions.map((item) => `<article class="v2-plan-day"><span>${escapeHtml(item.day.slice(0, 3).toUpperCase())}</span><strong>${escapeHtml(item.workout)}</strong></article>`).join("")}</div><p class="v2-plan-note">${levelNotes[plan.level]}</p>`;
    planActions.hidden = false;
  }

  function safeStorage(action, value) {
    try {
      if (action === "get") return localStorage.getItem(storageKey);
      if (action === "set") localStorage.setItem(storageKey, value);
      if (action === "remove") localStorage.removeItem(storageKey);
      return true;
    } catch {
      return action === "get" ? null : false;
    }
  }

  if (workoutForm) {
    const dayInputs = [...workoutForm.querySelectorAll("[data-workout-day]")];
    const daysValue = workoutForm.querySelector("[data-days-value]");
    const updateDayCount = () => {
      const count = dayInputs.filter((input) => input.checked).length;
      daysValue.textContent = `${count} day${count === 1 ? "" : "s"} selected`;
      dayInputs.forEach((input) => { input.disabled = !input.checked && count >= 6; });
    };
    dayInputs.forEach((input) => input.addEventListener("change", updateDayCount));
    updateDayCount();

    workoutForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(workoutForm);
      const goal = data.get("goal");
      const level = data.get("level");
      const selectedDays = dayInputs.filter((input) => input.checked).map((input) => input.value);
      if (!goalLabels[goal] || !levelLabels[level] || selectedDays.length < 2 || selectedDays.length > 6) {
        daysValue.textContent = "Please select between 2 and 6 training days.";
        return;
      }
      const workouts = plans[goal].slice(0, selectedDays.length);
      const plan = {
        goal, level, days: selectedDays.length,
        sessions: selectedDays.map((day, index) => ({ day, workout: workouts[index] })),
        createdAt: new Date().toISOString(),
      };
      renderPlan(plan);
      planOutput.dataset.plan = JSON.stringify(plan);
    });

    const saveButton = document.querySelector("[data-save-plan]");
    const printButton = document.querySelector("[data-print-plan]");
    const clearButton = document.querySelector("[data-clear-plan]");
    if (saveButton) saveButton.addEventListener("click", () => {
      const raw = planOutput.dataset.plan;
      if (!raw) return;
      if (!safeStorage("set", raw)) {
        alert("Your browser could not save this plan. You can print it instead.");
        return;
      }
      saveButton.textContent = "Plan Saved";
      window.setTimeout(() => { saveButton.textContent = "Save Plan"; }, 1600);
    });
    if (printButton) printButton.addEventListener("click", () => window.print());
    if (clearButton) clearButton.addEventListener("click", () => {
      safeStorage("remove");
      planOutput.removeAttribute("data-plan");
      planOutput.innerHTML = '<p class="eyebrow">Your weekly outline</p><h2>READY WHEN YOU ARE.</h2><p class="v2-tool-result__placeholder">Complete the planner to generate your week.</p>';
      planActions.hidden = true;
    });

    const saved = safeStorage("get");
    if (saved) {
      try {
        const plan = JSON.parse(saved);
        const valid = goalLabels[plan.goal] && levelLabels[plan.level] && Array.isArray(plan.sessions) && plan.sessions.length >= 2 && plan.sessions.length <= 6 && plan.sessions.every((item) => typeof item.day === "string" && typeof item.workout === "string");
        if (valid) {
          dayInputs.forEach((input) => { input.checked = plan.sessions.some((item) => item.day === input.value); });
          updateDayCount();
          workoutForm.elements.goal.value = plan.goal;
          workoutForm.elements.level.value = plan.level;
          renderPlan(plan);
          planOutput.dataset.plan = JSON.stringify(plan);
        } else safeStorage("remove");
      } catch { safeStorage("remove"); }
    }
  }
})();
