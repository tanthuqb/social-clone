import { type FeedId, feedIdSchema } from "@/lib/db/schema/feeds";
import { createClient } from "@/lib/supabase/server";

export const getFeeds = async () => {
  const supabase = createClient();
  const { data: rows, error } = await supabase
    .from("feeds")
    .select("*,comments(*),feed_images(*),user_id!left(*)")
    .order("created_at", { ascending: false });
  if (error) throw { error: error };
  return { feeds: rows };
};

export const getFeedsWithOutComment = async () => {
  const supabase = createClient();
  const { data: rows, error } = await supabase
    .from("feeds")
    .select("*,feed_images(*),user_id!left(*)")
    .order("created_at", { ascending: false });
  if (error) throw { error: error };
  return { feeds: rows };
};

export const getFeedsPrepared = async (
  userId: string | undefined = undefined,
) => {
  const supabase = createClient();

  let prepared = supabase
    .from("feeds")
    .select("*,feed_images(*),user_id!left(*)")
    .eq("type", "feed");

  if (userId) {
    // prepared.where(eq(feeds.userId, userId));
    prepared
      .eq("user_id", userId)
      .eq("type", "feed")
      .order("pin", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(5);
  }
  prepared = prepared.order("created_at", { ascending: false });
  return prepared;
};

export const getFeedById = async (id: FeedId) => {
  const supabase = createClient();

  const { id: feedId } = feedIdSchema.parse({ id });
  const { data: row, error } = await supabase
    .from("feeds")
    .select("*,comments(*),feed_images(*),user_id!left(*)")
    .eq("id", feedId)
    .maybeSingle();
  if (error) throw { error: error };
  return {
    feed: row,
  };
};

export const getFeedByIdWithComments = async (id: FeedId) => {
  const { id: feedId } = feedIdSchema.parse({ id });
  const supabase = createClient();
  const { data: row, error } = await supabase
    .from("feeds")
    .select("*,comments(*),feed_images(*),user_id!left(*)")
    .eq("id", feedId)
    .single();
  if (error) throw { error: error };
  return row;
};


const getCommentByFeedId = async (
  page: number = 1,
  pageSize: number ,
  feedId: Feed["id"],
) => {
  const supabase = createClient();
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  const commentsResponse = await supabase
    .from("feeds")
    .select("*,user_id!left(*), parent_id!left(*)", { count: "exact" })
    .eq("type", "comment")
    .eq("parent_id", feedId)
    .order("created_at", { ascending: false })
    .range(start, end);
  if (commentsResponse.error) throw commentsResponse.error;

  const totalComments = commentsResponse.count;
  const totalPages = Math.ceil(totalComments ? totalComments / pageSize : 0);
  const rows = commentsResponse.data;
  const commentIds = rows.map((comment) => comment.id);

  const repliesResponse = await supabase
    .from("feeds")
    .select("*,user_id!left(*), parent_id!left(*)")
    .eq("type", "comment")
    .in("parent_id", commentIds);

  if (repliesResponse.error) throw repliesResponse.error;
  const replies = repliesResponse.data;

  const commentsWithRepliesPromises = rows.map(async (r) => {
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
    data: commentsWithReplies,
  };
};