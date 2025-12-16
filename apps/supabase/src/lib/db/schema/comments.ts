
import { z } from "zod";



// Schema for comments - used to validate API requests
const commentSchema = z.object({
    id:z.string().uuid(),
    parent_id:z.string().uuid().nullable(),
    content:z.string(),
    feed_id:z.string().uuid(),
    user_id:z.string().uuid(),
})

export const insertCommentSchema = commentSchema
export const insertCommentParams = insertCommentSchema.omit({
    id:true,
    user_id:true,
})


export const updateCommentSchema = commentSchema;
export const updateCommentParams = commentSchema
  .omit({
    user_id: true,
  });
export const commentIdSchema = commentSchema.pick({ id: true });

// Types for comments - used to type API request params and within Components
export type Comment = z.infer<typeof commentSchema>;
export type NewComment = z.infer<typeof insertCommentSchema>;
export type NewCommentParams = z.infer<typeof insertCommentParams>;
export type UpdateCommentParams = z.infer<typeof updateCommentParams>;
export type CommentId = z.infer<typeof commentIdSchema>["id"];


