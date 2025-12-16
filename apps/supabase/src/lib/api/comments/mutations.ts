import {
  CommentId,
  NewCommentParams,
  UpdateCommentParams,
  updateCommentSchema,
  insertCommentSchema,
  commentIdSchema,
} from "@/lib/db/schema/comments";
import { createClient } from "@/lib/supabase/server";


export const createComment = async (comment: NewCommentParams) => {
  const supabase = createClient()
  const { data: session } = await supabase.auth.getUser();
  const newComment = insertCommentSchema.parse({
    ...comment,
    userId: session?.user?.id!,
  });
  try {
    // const [c] = await db.insert(comments).values(newComment).returning();
    const { data, error } = await supabase.from('comments').insert(newComment)

    return { comment: data , error : error };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateComment = async (
  id: CommentId,
  comment: UpdateCommentParams,
) => {

  const supabase = createClient()
  const { data: session } = await supabase.auth.getUser();
  const { id: commentId } = commentIdSchema.parse({ id });
  const newComment = updateCommentSchema.parse({
    ...comment,
    userId: session?.user?.id!,
  });
  try {
    const { data, error } = await supabase.from('comments').update({ comment })
      .eq('id', newComment.id)
      .eq('user_id', session?.user?.id)
      .select()
    if (error) {
      return { error: error }
    } else
      return { comment: data };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteComment = async (id: CommentId) => {
  const supabase = createClient()
  const { data: session } = await supabase.auth.getUser();
  const { id: commentId } = commentIdSchema.parse({ id });
  try {
    const { data, error } = await supabase.from('comments')
      .delete().eq('id', commentId)
      .eq('user_id', session?.user?.id).select()
      if (error) {
        return { error: error }
      } else
        return { comment: data };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
