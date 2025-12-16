
import { z } from "zod";


export enum FeedPrivacy {
  PUBLIC = "public",
  FOLLOW = "follow",
  PRIVATE = "private",
}

export enum FeedStatus {
  ACTIVE = "active",
  HIDE = "hide",
  DELETED = "deleted",
  REPORTED = "reported",
}


type Enum<E> = Record<keyof E, number | string> & { [k: number]: string };

export function convertEnumToArray<E extends Enum<E>>(enumObject: E) {
  const arrayObjects = [];
  // Retrieve key and values using Object.entries() method.
  for (const [propertyKey, propertyValue] of Object.entries(enumObject)) {
    // Ignore keys that are not numbers
    if (!Number.isNaN(Number(propertyKey))) {
      continue;
    }

    // Add values to array
    arrayObjects.push(propertyValue);
  }

  return arrayObjects as [string, ...string[]];
}

// Schema for feeds - used to validate API requests
export const feeds = z.object({
  content: z.string().nullable(),
  id: z.string().uuid(),
  privacy: z.enum(convertEnumToArray(FeedPrivacy)),
  status: z.enum(convertEnumToArray(FeedStatus)),
  user_id: z.string().uuid(),
  user_id_public: z.string().uuid(),
  create_at: z.string().date(),
  update_at: z.string().date(),
})

export const baseSchema = feeds.omit({
  create_at: true,
  update_at: true,
});

export const insertFeedSchema = baseSchema.omit({
  id: true,
});
export const insertFeedParams = insertFeedSchema.omit({
  user_id: true,
  user_id_public: true,
});

export const updateFeedSchema = baseSchema.omit({
  id: true,
});;
export const updateFeedParams = baseSchema.omit({
    // id: true,
});
export const feedIdSchema = baseSchema.pick({ id: true });

// Types for feeds - used to type API request params and within Components
export type Feed = z.infer<typeof baseSchema>;
export type NewFeed = z.infer<typeof insertFeedSchema>;
export type NewFeedParams = z.infer<typeof insertFeedParams>;
export type UpdateFeedParams = z.infer<typeof updateFeedParams>;
export type FeedId = z.infer<typeof feedIdSchema>["id"];



