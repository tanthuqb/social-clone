"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isPolicyViolation } from "@/lib/supabase/schema-errors";

export const upsertFeedReactionAction = async (
  feedId: string,
  state: "like" | "dislike" | "neutral",
) => {
  const supabase = await createClient();
  const { data: session } = await supabase.auth.getUser();
  if (!session?.user) return { data: null, error: "Not authenticated" };

  if (state === "neutral") {
    const { error } = await supabase
      .from("feed_engagement")
      .delete()
      .eq("user_id", session.user.id)
      .eq("feed_id", feedId);
    if (error) return { data: null, error: error.message };
  } else {
    const { error } = await supabase
      .from("feed_engagement")
      .upsert(
        { feed_id: feedId, user_id: session.user.id, state },
        { onConflict: "user_id,feed_id" },
      );
    // RLS rejects reactions on posts the user can't see (blocked, private).
    if (isPolicyViolation(error)) return { data: null, error: "You can't react to this post" };
    if (error) return { data: null, error: error.message };
  }

  revalidatePath("/");
  return { data: null, error: null };
};
