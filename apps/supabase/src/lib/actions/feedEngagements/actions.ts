"use server";

import { revalidatePath } from "next/cache";
import {
  createFeedReaction,
  deleteFeedReaction,
  updateFeedReaction,
} from "@/lib/api/feedEngagements/mutations";
import {
  FeedReactionId,
  NewFeedReactionParams,
  UpdateFeedReactionParams,
  UpsertFeedReactionParams,
  feedReactionIdSchema,
  insertFeedReactionParams,
  updateFeedReactionParams,
  upsertFeedReactionParams,
} from "@/lib/db/schema/feedReactions";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateFeedReactions = () => revalidatePath("/feed-reactions");

export const createFeedReactionAction = async (
  input: UpsertFeedReactionParams,
) => {
  try {
    const payload = upsertFeedReactionParams.parse(input);
    await createFeedReaction(payload);
    revalidateFeedReactions();
    return true
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateFeedReactionAction = async (
  input: UpdateFeedReactionParams,
) => {
  try {
    const payload = updateFeedReactionParams.parse(input);
    await updateFeedReaction(payload.id, payload);
    revalidateFeedReactions();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteFeedReactionAction = async (input: FeedReactionId) => {
  try {
    const payload = feedReactionIdSchema.parse({ id: input });
    await deleteFeedReaction(payload.id);
    revalidateFeedReactions();
  } catch (e) {
    return handleErrors(e);
  }
};
