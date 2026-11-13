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

function escapeHtml(value: string) {
  const entities: Record<string, string> = {
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;",
  };
  return value.replace(/[&<>"']/g, (char) => entities[char] ?? char);
}

async function sendIntakeEmails(details: {
  type: string; reference: string; fullName: string; email: string; phone?: string;
  subject?: string; message?: string; preferredDate?: string; preferredTime?: string;
  plan?: string; className?: string;
}) {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  const from = Deno.env.get("EMAIL_FROM");
  const gymEmail = Deno.env.get("GYM_NOTIFICATION_EMAIL");
  if (!apiKey || !from || !gymEmail) return "not_configured";

  const safeName = escapeHtml(details.fullName);
  const safeType = escapeHtml(details.type.replaceAll("_", " "));
  const safeRef = escapeHtml(details.reference);
  const rows = [
    ["Request type", safeType], ["Name", safeName], ["Email", escapeHtml(details.email)],
    ["Phone", escapeHtml(details.phone || "Not provided")], ["Plan / class", escapeHtml(details.plan || details.className || "Not applicable")],
    ["Preferred date", escapeHtml(details.preferredDate || "Not specified")],
    ["Preferred time", escapeHtml(details.preferredTime || "Not specified")],
    ["Subject", escapeHtml(details.subject || "Not provided")],
    ["Message", escapeHtml(details.message || "Not provided").replaceAll("\n", "<br>")],
  ];
  const detailsHtml = rows.map(([label, value]) => `<tr><th align="left" style="padding:8px;border-bottom:1px solid #eee">${label}</th><td style="padding:8px;border-bottom:1px solid #eee">${value}</td></tr>`).join("");
  const html = `<div style="font-family:Arial,sans-serif;color:#171717;max-width:640px;margin:auto"><h2>IRONFORGE FITNESS</h2><p>We received a new ${safeType} request.</p><p><strong>Reference:</strong> ${safeRef}</p><table style="border-collapse:collapse;width:100%">${detailsHtml}</table></div>`;
  const customerHtml = `<div style="font-family:Arial,sans-serif;color:#171717;max-width:600px;margin:auto"><h2>We received your request</h2><p>Hi ${safeName},</p><p>Thank you for contacting IRONFORGE FITNESS. Your ${safeType} request has been received.</p><p><strong>Reference:</strong> ${safeRef}</p><p>Our team will review it and contact you. This message is an acknowledgement, not a booking or membership confirmation.</p><p>IRONFORGE FITNESS</p></div>`;
  const send = async (to: string, subject: string, body: string) => {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], subject, html: body }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Resend email failed", response.status, errorText.slice(0, 500));
      return false;
    }
    return true;
  };
  try {
    const safeSubjectName = details.fullName.replace(/[\r\n]+/g, " ").slice(0, 120);
    const adminSent = await send(gymEmail, `New ${details.type.replaceAll("_", " ")} — ${safeSubjectName}`, html);
    const customerSent = await send(details.email, "We received your IRONFORGE FITNESS request", customerHtml);
    return adminSent && customerSent ? "sent" : "partial_or_failed";
  } catch (error) {
    console.error("Email notification error", error);
    return "failed";
  }
}

Deno.serve(async (req) => {
  const allowedOrigin = Deno.env.get("ALLOWED_ORIGIN");
  const requestOrigin = req.headers.get("origin");
  if (allowedOrigin && requestOrigin && requestOrigin !== allowedOrigin) {
    return json(403, { error: "ORIGIN_NOT_ALLOWED" });
  }
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
    const emailStatus = await sendIntakeEmails({
      type, reference: data.id, fullName, email, phone,
      subject: text(payload.subject, 160), message, plan: text(payload.membershipPlanSlug, 80),
    });
    return json(201, { success: true, reference: data.id, status: "received", emailStatus });
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
    const emailStatus = await sendIntakeEmails({
      type, reference: data.id, fullName, email, phone,
      preferredDate, preferredTime, message: text(payload.notes, 2000),
      plan: text(payload.membershipPlanSlug, 80),
    });
    return json(201, { success: true, reference: data.id, status: "pending", emailStatus });
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
    const reference = String(row?.booking_id ?? "");
    const emailStatus = await sendIntakeEmails({
      type: "class_booking", reference, fullName, email, phone,
      message: text(payload.notes, 2000), className: "Booked class session",
    });
    return json(201, { success: true, reference, status: row?.booking_status ?? "pending", emailStatus });
  }

  return json(400, { error: "UNKNOWN_SUBMISSION_TYPE" });
});

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
