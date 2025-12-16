

import { z } from "zod";
import { convertEnumToArray } from "./feeds";

export enum ReactionState {
  LIKE = "like",
  NEUTRAL = "neutral",
  DISLIKE = "dislike",
}

type Enum<E> = Record<keyof E, number | string> & { [k: number]: string };


export const commentReactions = z.object({
  id: z.string().uuid(),
  comment_id: z.string().uuid(),
  user_id: z.string().uuid(),
  state: z.enum(convertEnumToArray(ReactionState)),
})



export const insertCommentReactionSchema = commentReactions.omit({
  id: true,
  user_id: true,
});
export const insertCommentReactionParams = commentReactions
  .omit({
    id: true,
    user_id: true,
  });

export const updateCommentReactionParams = commentReactions
  .omit({
    user_id: true,
  });

export const upsertCommentReactionSchema = commentReactions

export const upsertCommentReactionParams = upsertCommentReactionSchema
  .omit({
    id:true,
    user_id: true,
  });

export const commentReactionIdSchema = commentReactions.pick({ id: true });

// Types for commentReactions - used to type API request params and within Components
export type CommentReaction = z.infer<typeof commentReactions>;
export type NewCommentReaction = z.infer<typeof insertCommentReactionSchema>;
export type NewCommentReactionParams = z.infer<
  typeof insertCommentReactionParams
>;
export type UpdateCommentReactionParams = z.infer<
  typeof updateCommentReactionParams
>;
export type UpsertCommentReactionParams = z.infer<typeof upsertCommentReactionParams>;
export type CommentReactionId = z.infer<typeof commentReactionIdSchema>["id"];

