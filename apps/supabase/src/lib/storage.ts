import type { SupabaseClient } from "@supabase/supabase-js";

export const FEED_MEDIA_BUCKET = "suzu";
export const AVATAR_BUCKET = "avatars";

/**
 * Object key for a user upload. The first folder is the user id, which the
 * storage RLS policies use to check ownership.
 */
export function userObjectPath(userId: string, fileName: string): string {
  const ext = fileName.includes(".")
    ? fileName.slice(fileName.lastIndexOf(".")).toLowerCase().replace(/[^.a-z0-9]/g, "")
    : "";
  const random = Math.random().toString(36).slice(2, 10);
  return `${userId}/${Date.now()}-${random}${ext}`;
}

/** Extract the object key from a public storage URL of the given bucket. */
export function objectPathFromPublicUrl(
  url: string | null | undefined,
  bucket: string,
): string | null {
  if (!url) return null;
  const marker = `/object/public/${bucket}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(url.slice(index + marker.length).split("?")[0]);
}

/** Upload a file for the given user and return its public URL. */
export async function uploadUserFile(
  supabase: SupabaseClient<any, any, any>,
  bucket: string,
  userId: string,
  file: File,
): Promise<string> {
  const path = userObjectPath(userId, file.name);
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error(error.message);
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
