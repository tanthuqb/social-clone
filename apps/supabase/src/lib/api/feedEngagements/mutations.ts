
import {
  FeedReactionId,
  UpdateFeedReactionParams,
  UpsertFeedReactionParams,
  updateFeedReactionSchema,
  upsertFeedReactionSchema,
  feedReactions,
  feedReactionIdSchema,
} from "@/lib/db/schema/feedReactions";

import { FeedId } from "@/lib/db/schema/feeds";
import { createClient } from "@/lib/supabase/server";

export const createFeedReaction = async (
  feedReaction: UpsertFeedReactionParams,
) => {

  const supabase = createClient();
  const {data:session} = await supabase.auth.getUser()
  const newFeedReaction = upsertFeedReactionSchema.parse({
    ...feedReaction,
    user_id: session?.user?.id!,
  });
  try {
    const {data:f,error} = await supabase.from('feed_engagement')
    .upsert([newFeedReaction]).select()    
    if(error){
      throw {error:error}
    }
    return { feedReaction: f };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateFeedReaction = async (
  feedId: FeedId,
  feedReaction: UpdateFeedReactionParams,
) => {
  const supabase = createClient();
  const {data:session} = await supabase.auth.getUser()

  const { id: feedReactionId } = feedReactionIdSchema.parse({ feedId });
  const newFeedReaction = updateFeedReactionSchema.parse({
    ...feedReaction,
    userId: session?.user?.id!,
  });
  try {
    // const [f] = await db
    //   .update(feedReactions)
    //   .set({ ...newFeedReaction, updatedAt: new Date() })
    //   .where(
    //     and(
    //       eq(feedReactions.feedId, feedReactionId!),
    //       eq(feedReactions.userId, session?.user.id!),
    //     ),
    //   )
    //   .returning();
      const {data:f,error} = await supabase.from('feed_engagement').update([feedReaction])
      .eq('feed_id',feedReactionId)
      .eq('user_id',session?.user?.id)
      .select()
      if(error){
        throw {error:error}
      }
    return { feedReaction: f };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteFeedReaction = async (id: FeedReactionId) => {
  const supabase = createClient();
  const {data:session} = await supabase.auth.getUser()
  const { id: feedReactionId } = feedReactionIdSchema.parse({ id });
  try {
    // const [f] = await db
    //   .delete(feedReactions)
    //   .where(
    //     and(
    //       eq(feedReactions.id, feedReactionId!),
    //       eq(feedReactions.userId, session?.user.id!),
    //     ),
    //   )
    //   .returning();
    const {data:f,error} = await supabase.from('feed_engagement').delete()
    .eq('feed_id',feedReactionId)
    .eq('user_id',session?.user?.id)
    .select()
    if(error){
      throw {error:error}
    }
    return { feedReaction: f };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
