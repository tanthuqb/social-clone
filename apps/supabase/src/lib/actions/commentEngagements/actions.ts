"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// comment_engagement has no unique (user_id, comment_id) index, so upsert is
// implemented as update-then-insert instead of ON CONFLICT.
export const upsertCommentReactionAction = async (
  commentId: string,
  state: "like" | "dislike" | "neutral",
) => {
  const supabase = await createClient();
  const { data: session } = await supabase.auth.getUser();
  if (!session?.user) return { data: null, error: "Not authenticated" };

  if (state === "neutral") {
    const { error } = await supabase
      .from("comment_engagement")
      .delete()
      .eq("user_id", session.user.id)
      .eq("comment_id", commentId);
    if (error) return { data: null, error: error.message };
  } else {
    const { data: updated, error } = await supabase
      .from("comment_engagement")
      .update({ state })
      .eq("user_id", session.user.id)
      .eq("comment_id", commentId)
      .select();
    if (error) return { data: null, error: error.message };
    if (!updated?.length) {
      const { error: insertError } = await supabase
        .from("comment_engagement")
        .insert({ comment_id: commentId, user_id: session.user.id, state });
      if (insertError) return { data: null, error: insertError.message };
    }
  }

  revalidatePath("/");
  return { data: null, error: null };
};
