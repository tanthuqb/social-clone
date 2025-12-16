import {
    FeedImageId,
    NewFeedImageParams,
    UpdateFeedImageParams,
    updateFeedImageSchema,
    insertFeedImageSchema,
    feedImages,
    feedImageIdSchema
} from "@/lib/db/schema/feedImages";
import { createClient } from "@/lib/supabase/server";

export const createFeedImage = async (feedImage: NewFeedImageParams) => {
    const supabase = createClient()
    try {
        const newFeedImage = insertFeedImageSchema.parse(feedImage);
        const {data:f,error} = await supabase.from('feed_images').upsert([newFeedImage]).select()
        if(error) throw {error:error}
        return { feedImage: f };
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again";
        console.error(message);
        return { error: message };
    }
};

export const updateFeedImage = async (id: FeedImageId, feedImage: UpdateFeedImageParams) => {
    const supabase = createClient()
    const { id: feedImageId } = feedImageIdSchema.parse({ id });
    const newFeedImage = updateFeedImageSchema.parse(feedImage);
    try {
        const {data:f,error} = await supabase.from('feed_images').update([newFeedImage]).eq('id',feedImageId).select()
      
        if(error) throw {error:error}
        return { feedImage: f };
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again";
        console.error(message);
        return { error: message };
    }
};

export const deleteFeedImage = async (id: FeedImageId) => {
    const supabase = createClient()
    const { id: feedImageId } = feedImageIdSchema.parse({ id });
    try {
        const {data:f,error} = await supabase.from('feed_images').delete().eq('id',id).select()
        return { feedImage: f };
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again";
        console.error(message);
        return { error: message };
    }
};

