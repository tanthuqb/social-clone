"use server";


import {
  createFeedImage,
  updateFeedImage,
  deleteFeedImage,
} from "@/lib/api/feedImages/mutations";

import {
  insertFeedImageSchema,
  updateFeedImageSchema,
  feedImageIdSchema,
  FeedImageId,
  NewFeedImageParams,
  UpdateFeedImageParams,
  insertFeedImageParams,
} from "@/lib/db/schema/feedImages";


const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

export const createFeedImageAction = async (input: NewFeedImageParams) => {
  try {
    const payload = insertFeedImageParams.parse(input);
    await createFeedImage(payload);
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateFeedImageAction = async (input: UpdateFeedImageParams) => {
  try {
    const payload = updateFeedImageSchema.parse(input);
    await updateFeedImage(input.id, payload);
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteFeedImageAction = async (input: FeedImageId) => {
  try {
    const payload = feedImageIdSchema.parse({ id: input });
    await deleteFeedImage(payload.id);
  } catch (e) {
    return handleErrors(e);
  }
};