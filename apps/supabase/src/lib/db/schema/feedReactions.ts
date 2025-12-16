
import { z } from "zod";
export enum ReactionState {
  LIKE = "like",
  NEUTRAL = "neutral",
  DISLIKE = "dislike",
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


export const feedReactions = z.object({
  id: z.string().uuid(),
  feed_id: z.string().uuid(),
  user_id: z.string().uuid(),
  state: z.enum(convertEnumToArray(ReactionState)),
})




export const insertFeedReactionSchema = feedReactions
export const insertFeedReactionParams = feedReactions.omit({
  user_id: true,
});

export const updateFeedReactionSchema = feedReactions;
export const updateFeedReactionParams = feedReactions
  .omit({
    user_id: true,
  });

export const upsertFeedReactionSchema = feedReactions.omit({ id: true })
export const upsertFeedReactionParams = upsertFeedReactionSchema
  .omit({
    user_id: true,
  });

export const feedReactionIdSchema = feedReactions.pick({ id: true });


// Types for feedReactions - used to type API request params and within Components
export type FeedReaction = z.infer<typeof feedReactions>;
export type NewFeedReaction = z.infer<typeof insertFeedReactionSchema>;
export type NewFeedReactionParams = z.infer<typeof insertFeedReactionParams>;
export type UpdateFeedReactionParams = z.infer<typeof updateFeedReactionParams>;
export type UpsertFeedReactionParams = z.infer<typeof upsertFeedReactionParams>;
export type FeedReactionId = z.infer<typeof feedReactionIdSchema>["id"];

