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