/// <reference types="https://deno.land/x/deno/cli/types/dts/index.d.ts" />
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("ALLOWED_ORIGIN") ?? "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-idempotency-key",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Content-Type": "application/json",
};

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), { status, headers: corsHeaders });

const text = (value: unknown, max = 4000) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[0-9+()\s.-]{7,30}$/;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST" && req.method !== "GET") return json(405, { error: "METHOD_NOT_ALLOWED" });

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing Supabase server secrets.");
    return json(503, { error: "SERVICE_NOT_CONFIGURED" });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Read-only timetable requests have no JSON body. Handle GET before parsing
  // the submission payload so browsers do not receive INVALID_JSON.
  if (req.method === "GET") {
    const url = new URL(req.url);
    if (url.searchParams.get("action") !== "sessions") return json(400, { error: "UNKNOWN_ACTION" });
    const from = new Date().toISOString();
    const until = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase.rpc("get_public_class_sessions", {
      p_from: from,
      p_until: until,
    });
    if (error) {
      console.error("Session listing failed", error);
      return json(500, { error: "SESSIONS_UNAVAILABLE" });
    }
    return json(200, { sessions: data ?? [] });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return json(400, { error: "INVALID_JSON" });
  }

  // Honeypot: silently accept bot submissions without storing them.
  if (text(payload.website, 200)) return json(200, { success: true });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const fingerprint = await sha256(`${ip}:${text(payload.type, 30)}`);
  const { data: rateAllowed, error: rateError } = await supabase.rpc(
    "consume_intake_rate_limit",
    { p_fingerprint: fingerprint },
  );
  if (rateError) {
    console.error("Rate-limit check failed", rateError);
    return json(503, { error: "TEMPORARILY_UNAVAILABLE" });
  }
  if (!rateAllowed) return json(429, { error: "RATE_LIMITED" });

  const type = text(payload.type, 30);
  const fullName = text(payload.fullName, 120);
  const email = text(payload.email, 254).toLowerCase();
  const phone = text(payload.phone, 30);
  if (fullName.length < 2 || !emailPattern.test(email)) {
    return json(422, { error: "INVALID_NAME_OR_EMAIL" });
  }
  if (phone && !phonePattern.test(phone)) return json(422, { error: "INVALID_PHONE" });

  if (type === "contact" || type === "membership") {
    const message = text(payload.message, 4000);
    if (message.length < 10) return json(422, { error: "MESSAGE_TOO_SHORT" });
    const { data, error } = await supabase.from("enquiries").insert({
      enquiry_type: type,
      full_name: fullName,
      email,
      phone: phone || null,
      subject: text(payload.subject, 160) || (type === "membership" ? "Membership enquiry" : null),
      message,
      membership_plan_slug: type === "membership" ? text(payload.membershipPlanSlug, 80) || null : null,
      source_page: text(payload.sourcePage, 120) || null,
    }).select("id").single();
    if (error) {
      console.error("Enquiry insert failed", error);
      return json(500, { error: "SUBMISSION_FAILED" });
    }
    return json(201, { success: true, reference: data.id, status: "received" });
  }

  if (type === "free_trial" || type === "personal_training") {
    if (!phone || !phonePattern.test(phone)) return json(422, { error: "PHONE_REQUIRED" });
    const preferredDate = text(payload.preferredDate, 10);
    const preferredTime = text(payload.preferredTime, 40);
    const lagosToday = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Africa/Lagos", year: "numeric", month: "2-digit", day: "2-digit",
    }).format(new Date());
    const parsedPreferredDate = /^\d{4}-\d{2}-\d{2}$/.test(preferredDate)
      ? new Date(`${preferredDate}T00:00:00Z`)
      : null;
    const dateIsReal = Boolean(parsedPreferredDate &&
      parsedPreferredDate.toISOString().slice(0, 10) === preferredDate);
    if (!dateIsReal || preferredDate < lagosToday) {
      return json(422, { error: "INVALID_PREFERRED_DATE" });
    }
    if (preferredTime.length < 2) return json(422, { error: "PREFERRED_TIME_REQUIRED" });
    const { data, error } = await supabase.from("bookings").insert({
      booking_type: type,
      full_name: fullName,
      email,
      phone,
      trainer_slug: text(payload.trainerSlug, 100) || null,
      trainer_name: text(payload.trainerName, 120) || null,
      class_slug: text(payload.classSlug, 100) || null,
      class_name: text(payload.className, 120) || null,
      preferred_date: preferredDate || null,
      preferred_time: preferredTime || null,
      experience_level: text(payload.experienceLevel, 60) || null,
      fitness_goal: text(payload.fitnessGoal, 120) || null,
      notes: text(payload.notes, 2000) || null,
      source_page: text(payload.sourcePage, 120) || null,
    }).select("id").single();
    if (error) {
      console.error("Booking insert failed", error);
      return json(500, { error: "SUBMISSION_FAILED" });
    }
    return json(201, { success: true, reference: data.id, status: "pending" });
  }

  if (type === "class") {
    if (!phone || !phonePattern.test(phone)) return json(422, { error: "PHONE_REQUIRED" });
    const sessionId = text(payload.sessionId, 50);
    if (!sessionId) return json(422, { error: "SESSION_REQUIRED" });
    const { data, error } = await supabase.rpc("create_class_booking", {
      p_session_id: sessionId,
      p_full_name: fullName,
      p_email: email,
      p_phone: phone,
      p_notes: text(payload.notes, 2000) || null,
      p_source_page: text(payload.sourcePage, 120) || "classes.html",
      p_idempotency_key: req.headers.get("x-idempotency-key"),
    });
    if (error) {
      const message = error.message ?? "";
      if (message.includes("SESSION_FULL")) return json(409, { error: "SESSION_FULL" });
      if (message.includes("BOOKING_CLOSED") || message.includes("SESSION_NOT_AVAILABLE")) {
        return json(409, { error: "SESSION_UNAVAILABLE" });
      }
      console.error("Class booking failed", error);
      return json(500, { error: "SUBMISSION_FAILED" });
    }
    const row = Array.isArray(data) ? data[0] : data;
    return json(201, { success: true, reference: row?.booking_id, status: row?.booking_status ?? "pending" });
  }

  return json(400, { error: "UNKNOWN_SUBMISSION_TYPE" });
});

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
