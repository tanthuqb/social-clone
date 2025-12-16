import {
  type CommentId,
  commentIdSchema,
  Comment,
} from "@/lib/db/schema/comments";
import { FeedId } from "@/lib/db/schema/feeds";
import { createClient } from "@/lib/supabase/server";

export const getComments = async () => {
  const supabase = createClient();

  const { data: session } = await supabase.auth.getUser();

  const { data: rows, error } = await supabase
    .from("comments")
    .select("*,feeds(*),user_id!left(*),feed_id!left(*)");
  const c = rows?.map((r: any) => ({ ...r.comments, feeds: r.feed }));
  return { comments: c };
};

export const getCountCommentsByFeedId = async (feedId: FeedId) => {
  const supabase = createClient();
  // const rows = await db
  //   .select({ comment: comments, feed: feeds })
  //   .from(comments)
  //   .leftJoin(feeds, eq(comments.feedId, feeds.id))
  //   .where(eq(comments.feedId, feedId));
  const { data: rows, error } = await supabase
    .from("comments")
    .select("*,user_id!left(*),feed_id!left(*)")
    .eq("feed_id", feedId);
  if (rows === undefined) return 0;
  return rows?.length;
};

export const getCommentById = async (id: CommentId) => {
  const supabase = createClient();
  const { data: session } = await supabase.auth.getUser();
  const { id: commentId } = commentIdSchema.parse({ id });
  // const [row] = await db
  //   .select({ comment: comments, feed: feeds })
  //   .from(comments)
  //   .where(
  //     and(eq(comments.id, commentId), eq(comments.userId, session?.user.id!))
  //   )
  //   .leftJoin(feeds, eq(comments.feedId, feeds.id));
  const { data: row, error } = await supabase
    .from("comments")
    .select("*,feed_id!left(*)")
    .eq("id", commentId)
    .eq("userId", session?.user?.id!);
  if (error) {
    return { error: error };
  }
  // const c = { ...row?.comments, feed: row?.feeds };
  return { comment: row };
};

export const getCommentChildren = async (parentId: CommentId) => {
  const { id: commentId } = commentIdSchema.parse({ id: parentId });
  const supabase = createClient();

  const { data: rows } = await supabase
    .from("comments")
    .select("*")
    .eq("id", commentId);
  if (rows === undefined) return {};
  return rows;
};

export const getCountCommentByCommentId = async (id: CommentId) => {
  const { id: commentId } = commentIdSchema.parse({ id: id });
  const supabase = createClient();
  const { data: rows } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("id", commentId);
  if (rows === undefined) return 0;
  return rows?.length;
};

export const getCommentsNoti = async () => {
  const supabase = createClient();
  const { data: session } = await supabase.auth.getUser();
  const { data: rows, error } = await supabase
    .from("comments")
    .select("*,feed_id!left(*),user_id!left(*)");
  if (error) {
    return { error: error };
  }
  if (rows === undefined) return {};
  return { comments: rows };
};

export const getCommentsNotiWithParentId = async (parentId: CommentId) => {
  const supabase = createClient();
  const { data: session } = await supabase.auth.getUser();

  const { id: commentId } = commentIdSchema.parse({ id: parentId });

  const { data: rows, error } = await supabase
    .from("comments")
    .select("*,feed_id!left(*),user_id!left(*)")
    .eq("parent_id", commentId);

  return { commentChilds: rows };
};

export const countFeedsAndReplies = async (
  feedId: Feed["id"],
): Promise<number> => {
  const supabase = createClient();
  const { data: feedData, error: feedError } = await supabase
    .from("feeds")
    .select("id")
    .eq("parent_id", feedId);

  if (feedError) {
    throw feedError;
  }

  let count = feedData.length;

  for (const reply of feedData) {
    count += await countFeedsAndReplies(reply.id);
  }

  return count;
};



export const getCommentByFeedId = async (
  page: number,
  PAGE_COUNT: number,
  feedId: Feed["id"],
) => {
  const supabase = createClient();
  const totalCommentsResponse = await supabase
    .from("feeds")
    .select("id", { count: "exact" })
    .eq("type", "comment")
    .eq("parent_id", feedId);
  if (totalCommentsResponse.error) throw totalCommentsResponse.error;

  const totalComments = totalCommentsResponse.count;
  const validPage = page > 0 ? page : 1;
  let start = (validPage - 1) * PAGE_COUNT;
  if (start >= totalComments!) {
    start = Math.max(0, totalComments! - PAGE_COUNT);
  }
  const end = start + PAGE_COUNT - 1;

  const commentsResponse = await supabase
    .from("feeds")
    .select("*,user_id!left(*), parent_id!left(*)", { count: "exact" })
    .eq("type", "comment")
    .eq("parent_id", feedId)
    .order("created_at", { ascending: false })
    .range(start, end);
  if (commentsResponse.error) throw commentsResponse.error;

  const totalPages = Math.ceil(
    totalComments ? totalComments / PAGE_COUNT : 0,
  );
  const rows = commentsResponse.data;
  const commentIds = rows.map((comment: any) => comment.id);

  const repliesResponse = await supabase
    .from("feeds")
    .select("*,user_id!left(*), parent_id!left(*)")
    .eq("type", "comment")
    .in("parent_id", commentIds);

  if (repliesResponse.error) throw repliesResponse.error;
  const replies = repliesResponse.data;

  const commentsWithRepliesPromises = rows.map(async (r: any) => {
    const { data: reactions } = await supabase
      .from("feed_engagement")
      .select("*")
      .eq("feed_id", r.id)
      .maybeSingle();

    const { count: countTotalRectionComment } = await supabase
      .from("feed_engagement")
      .select("feed_id", { count: "exact" })
      .eq("feed_id", r.id);

    const commentRepliesPromises = replies
      .filter((reply: any) => reply?.parent_id?.id === r.id)
      .map(async (reply: any) => {
        const { data: replyReactions } = await supabase
          .from("feed_engagement")
          .select("*")
          .eq("feed_id", reply.id)
          .maybeSingle();

        const { count: countTotalRectionReplyComment } = await supabase
          .from("feed_engagement")
          .select("feed_id", { count: "exact" })
          .eq("feed_id", reply.id);

        return {
          ...reply,
          reactions: replyReactions,
          totalReactions: countTotalRectionReplyComment,
        };
      });

    const commentReplies = await Promise.all(commentRepliesPromises);
    const countComment = commentReplies.length;

    return {
      ...r,
      replies: commentReplies,
      reactions: reactions,
      countComment: countComment,
      totalReactions: countTotalRectionComment,
    };
  });

  const commentsWithReplies = await Promise.all(commentsWithRepliesPromises);
  return {
    commentUser: commentsWithReplies,
    totalComments: totalComments,
  };
};
export const getCountCommentsById = async (
  feed_id: string,
): Promise<string> => {
  const supabase = createClient();
  const { data: count, error: feedError } = await supabase
  .rpc('count_descendant_feeds', {
    feed_id
  })
  if (feedError) {
    throw feedError;
  }

  return count;
};