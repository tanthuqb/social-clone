import { type FeedImageId, feedImageIdSchema, feedImages } from "@/lib/db/schema/feedImages";
import { createClient } from "@/lib/supabase/server";

export const getFeedImages = async () => {
    const supabase = createClient()
    //   const f = await db.select({ feedImage: feedImages, feed: feeds }).from(feedImages).leftJoin(feeds, eq(feedImages.feedId, feeds.id));
    const {data:f,error} = await supabase.from('feed_images').select('*,feed_id!left(*)');
    if (error) {
        return { error: error};
    }
    return { feedImages: f };
};

export const getFeedImageById = async (id: FeedImageId) => {
    const supabase = createClient()

    const { id: feedImageId } = feedImageIdSchema.parse({ id });
    // const [f] = await db.select().from(feedImages).where(eq(feedImages.id, feedImageId)).leftJoin(feeds, eq(feedImages.feedId, feeds.id));
    const {data:f,error} = await supabase.from('feed_images')
    .select('*,feed_id!left(*)')
    .eq('id',id)

    return { feedImage: f };
};

