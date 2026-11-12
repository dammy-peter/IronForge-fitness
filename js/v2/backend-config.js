/*
 * IronForge Fitness — public Supabase browser configuration.
 * The publishable key is designed for frontend use. Never place a Supabase
 * secret/service-role key or Resend API key in this file.
 */
window.IRONFORGE_BACKEND = Object.freeze({
  supabaseUrl: "https://sjyabrutzqsfifboduzu.supabase.co",
  supabaseAnonKey: "sb_publishable_LKa44uex4-vVfG_Um5V4aA_mGEsHLpw",
  intakeFunction: "public-intake",
});

window.ironForgeBackendReady = function () {
  const config = window.IRONFORGE_BACKEND;
  return Boolean(
    config &&
    /^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(config.supabaseUrl) &&
    config.supabaseAnonKey &&
    config.supabaseAnonKey.startsWith("sb_publishable_")
  );
};
