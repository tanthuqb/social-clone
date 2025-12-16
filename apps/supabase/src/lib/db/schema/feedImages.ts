
import { z } from "zod";
import { baseSchema } from "./feeds"
import { getFeedImages } from "@/lib/api/feedImages/queries";

export const feedImages = z.object({
  id: z.string().uuid(),
  feed_id: z.string().uuid(),
  image: z.string(),
})

// Schema for feedImages - used to validate API requests
export const insertFeedImageSchema = feedImages.omit({
  id: true,
});

export const insertFeedImageParams = insertFeedImageSchema

export const updateFeedImageSchema = feedImages.omit({
  feed_id: true,
});

export const updateFeedImageParams = feedImages.omit({
  feed_id: true,
})
  ;


export const feedImageIdSchema = feedImages.pick({ id: true });

// Types for feedImages - used to type API request params and within Components
export type FeedImage = z.infer<typeof updateFeedImageSchema>;
export type NewFeedImage = z.infer<typeof insertFeedImageSchema>;
export type NewFeedImageParams = z.infer<typeof insertFeedImageParams>;
export type UpdateFeedImageParams = z.infer<typeof updateFeedImageParams>;
export type FeedImageId = z.infer<typeof feedImageIdSchema>["id"];


