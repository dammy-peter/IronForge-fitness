/* Shared Version 2 API client. All writes go through the Edge Function. */
(function () {
  const config = window.IRONFORGE_BACKEND;

  async function getSessions() {
    if (!window.ironForgeBackendReady || !window.ironForgeBackendReady()) {
      throw new Error("BACKEND_NOT_CONFIGURED");
    }
    const response = await fetch(`${config.supabaseUrl}/functions/v1/${config.intakeFunction}?action=sessions`, {
      method: "GET",
      headers: {
        apikey: config.supabaseAnonKey,
        Authorization: `Bearer ${config.supabaseAnonKey}`,
      },
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(result.error || "SESSIONS_UNAVAILABLE");
      error.status = response.status;
      throw error;
    }
    return result.sessions || [];
  }

  async function submitIntake(payload, options = {}) {
    if (!window.ironForgeBackendReady || !window.ironForgeBackendReady()) {
      throw new Error("BACKEND_NOT_CONFIGURED");
    }

    const headers = {
      "Content-Type": "application/json",
      apikey: config.supabaseAnonKey,
      Authorization: `Bearer ${config.supabaseAnonKey}`,
    };
    if (options.idempotencyKey) headers["x-idempotency-key"] = options.idempotencyKey;

    const response = await fetch(`${config.supabaseUrl}/functions/v1/${config.intakeFunction}`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(result.error || "SUBMISSION_FAILED");
      error.status = response.status;
      throw error;
    }
    return result;
  }

  window.IronForgeAPI = Object.freeze({ getSessions, submitIntake });
})();
