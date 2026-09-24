import { createClient } from "@/lib/supabase/server";

/** Strip characters that have special meaning in PostgREST filter strings / LIKE patterns. */
const sanitizeTerm = (term: string) =>
  term.replace(/[%_\,()"'.:*]/g, " ").replace(/\s+/g, " ").trim();

/**
 * Search feeds whose content matches the term OR whose author's display
 * name / username matches it. Results are paginated as one ordered list
 * (newest first), so `offset`/`limit` behave consistently across pages.
 */
export async function searchFeeds(
  search: string | null | undefined,
  offset: number,
  limit: number,
) {
  const term = sanitizeTerm(search ?? "");
  if (!term) return [];

  const supabase = await createClient();

  const { data: profiles, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .or(`display_name.ilike.%${term}%,full_name.ilike.%${term}%`)
    .limit(100);
  if (profileError) throw new Error(profileError.message);

  const ids = (profiles ?? []).map((p) => p.id);
  const filters = [`content.ilike.%${term}%`];
  if (ids.length > 0) filters.push(`user_id.in.(${ids.join(",")})`);

  const { data: feeds, error } = await supabase
    .from("feeds")
    .select("*,feed_images(*),user_id!left(*)")
    .eq("type", "feed")
    .or(filters.join(","))
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw new Error(error.message);

  return feeds ?? [];
}
