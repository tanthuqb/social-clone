"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { FEATURE_UNAVAILABLE, isMissingSchemaError } from "@/lib/supabase/schema-errors";
import {
  CommentPermission,
  FeedPrivacy,
  ProfileVisibility,
} from "@/lib/supabase/database.types";

const privacySchema = z.object({
  default_post_privacy: z.nativeEnum(FeedPrivacy),
  profile_visibility: z.nativeEnum(ProfileVisibility),
  comment_permission: z.nativeEnum(CommentPermission),
});

export type PrivacySettingsInput = z.input<typeof privacySchema>;

export async function updatePrivacySettingsAction(
  input: PrivacySettingsInput,
): Promise<{ error: string | null }> {
  const parsed = privacySchema.safeParse(input);
  if (!parsed.success) return { error: "Invalid privacy settings" };

  const supabase = await createClient();
  const { data: session } = await supabase.auth.getUser();
  if (!session?.user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("profiles")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", session.user.id);
  if (error) {
    return { error: isMissingSchemaError(error) ? FEATURE_UNAVAILABLE : error.message };
  }

  revalidatePath("/", "layout");
  return { error: null };
}
