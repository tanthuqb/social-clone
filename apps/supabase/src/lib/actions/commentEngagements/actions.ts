"use server";

import { revalidatePath } from "next/cache";
import {
  createCommentReaction,
  deleteCommentReaction,
  updateCommentReaction,
} from "@/lib/api/commentEngagements/mutations";
import {
  CommentReactionId,
  NewCommentReactionParams,
  UpdateCommentReactionParams,
  commentReactionIdSchema,
  insertCommentReactionParams,
  updateCommentReactionParams,
  upsertCommentReactionParams,
  UpsertCommentReactionParams
} from "@/lib/db/schema/commentReactions";
import { createClient } from "@/lib/supabase/server";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateCommentReactions = () => revalidatePath("/comment-reactions");

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

export const createCommentReactionAction = async (input: UpsertCommentReactionParams) => {
  try {
    const payload = insertCommentReactionParams.parse(input);
    await createCommentReaction(payload);
    revalidateCommentReactions();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateCommentReactionAction = async (input: UpdateCommentReactionParams) => {
  try {
      const payload = updateCommentReactionParams.parse(input);
      if (payload.id) {
        await updateCommentReaction(payload.id, payload);
        revalidateCommentReactions();
      } else {
        throw new Error('Comment Raction Id is undefined');
      }
      revalidateCommentReactions();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteCommentReactionAction = async (input: CommentReactionId) => {
  try {
    const payload = commentReactionIdSchema.parse({ id: input });
    await deleteCommentReaction(payload.id);
    revalidateCommentReactions();
  } catch (e) {
    return handleErrors(e);
  }
};