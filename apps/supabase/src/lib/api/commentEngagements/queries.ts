
import { type CommentReactionId, commentReactionIdSchema } from "@/lib/db/schema/commentReactions";
import { CommentId } from "@/lib/db/schema/comments";

import { createClient } from "@/lib/supabase/server";
import { User } from "@supabase/supabase-js";

export const getCommentReactions = async () => {
  const supabase = createClient()
  const { data: session } = await supabase.auth.getUser();

  // const rows = await db.select({ commentReaction: commentReactions, comment: comments }).from(commentReactions).
  // leftJoin(comments, eq(commentReactions.commentId, comments.id))
  // .where(eq(commentReactions.userId, session?.user.id!));
  const { data: rows, error } = await supabase.from('comment_engagement')
    .select('*,parent_id!left(*)')
    .eq('user_id', session?.user?.id!)
  if (error) throw { error: error }
  const c = rows.map((r: any) => ({ ...r, commentReaction: r.commentReactions, comment: r.comments }));
  return { commentReactions: c };
};

export const getCommentReactionById = async (id: CommentReactionId) => {
  const supabase = createClient()
  const { data: session } = await supabase.auth.getUser();
  const { id: commentReactionId } = commentReactionIdSchema.parse({ id });
  // const [row] = await db.select()
  //   .from(commentReactions)
  //   .leftJoin(comments, eq(commentReactions.commentId, comments.id))
  //   .where(and(eq(commentReactions.id, commentReactionId), eq(commentReactions.userId, session?.user.id!)))
  const { data: row, error } = await supabase.from('comment_engagement')
    .select('*,parent_id!left(*)')
    .eq('id', commentReactionId)
    .eq('user_id', session?.user?.id!)
    .maybeSingle()
  if (error) throw { error: error }
  return { commentReaction: row };
};

export const getCommentReactionByCommentId = async (id: CommentId) => {
  const supabase = createClient()
  const { id: CommentId } = commentReactionIdSchema.parse({ id });
  // const [row] = await db.select()
  //   .from(commentReactions)
  //   .where(
  //     eq(commentReactions.commentId, CommentId),
  //   );
  const { data: row, error } = await supabase.from('comment_engagement')
    .select()
    .eq('parent_id', CommentId)
  if (error) throw { error: error }
  return { commentReaction: row };
};

export const getCountCommentReactionByCommentId = async (id: CommentId) => {
  const { id: CommentId } = commentReactionIdSchema.parse({ id });
  const supabase = createClient()
  // const row = await db.select()
  //   .from(commentReactions)
  //   .where(
  //     eq(commentReactions.commentId, CommentId),
  //   );
  const { data: row, error } = await supabase.from('comment_engagement')
    .select('*').eq('parent_id', CommentId)
  if (error) throw { error: error }
  if (row === undefined) return 0;
  return row.length;
};



export const getCommentReactionsNoti = async () => {
  const supabase = createClient()
  const { data: session } = await supabase.auth.getUser();

  // const rows = await db.select({ commentReaction: commentReactions, comment: comments, users: users })
  //   .from(commentReactions)
  //   .leftJoin(comments, eq(commentReactions.commentId, comments.id))
  //   .leftJoin(users, eq(commentReactions.userId, users.id))
  //   .where(eq(commentReactions.userId, session?.user.id!));
  const {data:rows,error} = await supabase.from('comment_engagement')
  .select('*,comment_id!left(*),user_id!left(*)')
  .eq('user_id', session?.user?.id!)
  if (error) throw {error:error}
  return { commentReactions: rows };
};