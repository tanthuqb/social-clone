import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/ultis";

/** Only allow same-site relative redirects ("/path"), never "//host" or URLs. */
export function safeNextPath(next: string | null, fallback = "/"): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) {
    return fallback;
  }
  return next;
}

/**
 * Give a freshly signed-in user a unique username (`profiles.full_name`)
 * derived from their provider name or email, if they do not have one yet.
 */
async function ensureUsername(
  supabase: Awaited<ReturnType<typeof createClient>>,
  user: { id: string; email?: string; user_metadata?: Record<string, any> },
) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();
  // Keep usernames that are already slug-shaped (chosen by the user).
  if (profile?.full_name && /^[\w.-]{5,50}$/.test(profile.full_name)) return;

  const source =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "user";
  let base = slugify(String(source), { replacement: "." }) || "user";
  if (base.length < 5) base = `${base}.user`;
  base = base.slice(0, 40);

  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate =
      attempt === 0 ? base : `${base}.${Math.random().toString(36).slice(2, 6)}`;
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: candidate })
      .eq("id", user.id);
    if (!error) return;
    if (error.code !== "23505") return; // not a uniqueness conflict: give up quietly
  }
}

/**
 * Shared handler for the PKCE `?code=` callbacks (OAuth, email confirmation,
 * password recovery): exchanges the code for a session cookie and redirects.
 */
export async function handleAuthCallback(
  request: NextRequest,
  { defaultNext = "/", setUsername = false } = {},
) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNextPath(searchParams.get("next"), defaultNext);

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data?.user) {
      if (setUsername) {
        await ensureUsername(supabase, data.user);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }
  return NextResponse.redirect(`${origin}/error`);
}
