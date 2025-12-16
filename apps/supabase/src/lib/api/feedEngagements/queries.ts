
import {
  type FeedReactionId,
  feedReactionIdSchema,
  feedReactions,
  ReactionState,
} from "@/lib/db/schema/feedReactions";
import { FeedId } from "@/lib/db/schema/feeds";

import { createClient } from "@/lib/supabase/server";

export const getFeedReactions = async () => {
  const supabase = createClient()
  const { data: session } = await supabase.auth.getUser()
  // const rows = await db
  //   .select({ feedReaction: feedReactions, feed: feeds })
  //   .from(feedReactions)
  //   .leftJoin(feeds, eq(feedReactions.feedId, feeds.id))
  //   .where(eq(feedReactions.userId, session?.user.id!))
  //   .orderBy(desc(feedReactions.createdAt));
  const { data: rows, error } = await supabase.from('feed_engagement')
    .select('*,feed_id!left(*)')
    .eq('user_id', session?.user?.id!)
    .order('create_at', { ascending: false })
  if (error) throw { error: error }
  return { feedReactions: rows};
};

export const getFeedReactionByReactionId = async (id: FeedReactionId) => {
  const supabase = createClient()
  const { data: session } = await supabase.auth.getUser()
  const { id: feedReactionId } = feedReactionIdSchema.parse({ id });
  const { data: row, error } = await supabase.from('feed_engagement')
    .select('*,feed_id!left(*)')
    .eq('id', feedReactionId)
    .eq('user_id', session?.user?.id!)
    .maybeSingle();
  if (error) throw { error: error }

  return { feedReaction: row };
};

export const getFeedReactionByFeedId = async (feedId: FeedId) => {
  
  const supabase = createClient()
  const { data: session } = await supabase.auth.getUser()
  if(!session?.user?.id){
    return { feedReaction: null}
  }
  
  const { id: feedReactionId } = feedReactionIdSchema.parse({ feed_id:feedId });


  // const [row] = await db
  //   .select({ feedReaction: feedReactions })
  //   .from(feedReactions)
  //   .where(
  //     and(
  //       eq(feedReactions.feedId, feedReactionId),
  //       eq(feedReactions.userId, session?.user.id!),
  //     ),
  //   )
  //   .limit(1);
  const { data: row, error } = await supabase.from('feed_engagement')
    .select('*').eq('feed_id', feedReactionId).eq('user_id', session?.user?.id)
    .limit(1)

  if (error) throw { error: error }
  const f = row[0];
  return { feedReaction: f };
};

export const countFeedReactionByFeedId = async (feedId: FeedId, state: ReactionState | undefined) => {
  let rows = [];
  const supabase = createClient()
  if (state === null) {
    const { data, error } = await supabase.from('feed_engagement')
      .select('*')
      .eq('feed_id', feedId)
    if (error) throw { error: error }
    rows = data as any[]
  } else {
    const { data, count, error } = await supabase.from('feed_engagement')
      .select('*', { count: 'exact' })
      .eq('feed_id', feedId)
      .eq('state', state!)
    if (error) throw { error: error }
    rows = count as any
  }
  return rows;
};


type FeedReactionsNoti = FeedReaction & {
  users: Session
}
export const getFeedReactionsNoti = async () => {
  const supabase = createClient()
  const { data: session } = await supabase.auth.getUser()
  const { data: rows, error } = await supabase.from('feed_engagement')
    .select('*,feed_id!left(*),user_id!left(*)')
    .eq('user_id', session?.user?.id!)
  if (error) throw { error: error }
  // console.log(rows);

  const f: FeedReactionsNoti[] = rows.map((r) => ({ ...r, feed: r.feed_id, users: r.user_id! }));
  return { feedReactions: f };
};
export const countFeedDisLikeByFeedId = async (feedId: FeedId) => {
  const supabase = createClient()
  const { data: rows, error } = await supabase.from('feed_engagement')
    .select('*').eq('feed_id', feedId).eq('state', ReactionState.DISLIKE)
  if (error) throw { error: error }

  return rows.length;
};

export const countFeedLikeByFeedId = async (feedId: FeedId) => {
  const supabase = createClient()
  const { data: rows, error } = await supabase.from('feed_engagement')
    .select('*').eq('feed_id', feedId).eq('state', ReactionState.LIKE)
  if (error) throw { error: error }
  return rows.length;
};