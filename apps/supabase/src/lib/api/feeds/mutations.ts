import {
    FeedId,
    NewFeedParams,
    UpdateFeedParams,
    updateFeedSchema,
    insertFeedSchema,

    feedIdSchema,
} from "@/lib/db/schema/feeds";
import { createClient } from "@/lib/supabase/server";


export const createFeed = async (feed: NewFeedParams) => {
    const supabase = createClient();
    const { data: session } = await supabase.auth.getUser()

    try {
        const newFeed = insertFeedSchema.parse({
            content: feed.content,
            user_id: session?.user?.id!,
        });
        // const [f] = await db.insert(feeds).values(newFeed).returning();
        const { data: f, error } = await supabase.from('feeds').insert([newFeed]).select().maybeSingle();
        if (error) throw { error: error }
        // adminClient
        //   .collections("feeds")
        //   .documents()
        //   .create({
        //     id: f.id,
        //     content: f.content,
        //     user_id: f.userId,
        //     createdAt: parseInt((f.createdAt.getTime() / 1000).toFixed(0)),
        //     updatedAt: parseInt((f.updatedAt.getTime() / 1000).toFixed(0)),
        //     user: {
        //       id: f.userId,
        //       email: session?.user.email,
        //       name: session?.user.name,
        //       username: session?.user.username,
        //       image: session?.user.image,
        //       createdAt: parseInt(
        //         (new Date(session?.user?.createdAt!).getTime()! / 1000).toFixed(0),
        //       ),
        //       updatedAt: parseInt(
        //         (new Date(session?.user?.updatedAt!).getTime()! / 1000).toFixed(0),
        //       ),
        //     },
        //   });
        return { feed: f };
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again";
        console.error(message);
        throw { error: message };
    }
};

export const updateFeed = async (id: FeedId, feed: UpdateFeedParams) => {
    const supabase = createClient();
    const { data: session } = await supabase.auth.getUser()

    try {
        const { id: feedId } = feedIdSchema.parse({ id });
        const { data: f, error } = await supabase.from('feeds')
            .update({ 
                content: feed.content,
                user_id: session?.user?.id!,
             })
            .eq('user_id', session?.user?.id!)
            .eq('id', feedId)            
            .select(`*, feed_images(*)`)
            .single()
        if (error) throw { error: error }
        return { feed: f };
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again";
        console.error(message);
        throw { error: message };
    }
};

export const deleteFeed = async (id: FeedId) => {

    try {
        const supabase = createClient();
        const { data: session } = await supabase.auth.getUser()
        const { id: feedId } = feedIdSchema.parse({ id });
        const { data: f, error } = await supabase.from('feeds').delete()
            .eq('id', feedId)
            .eq('user_id', session?.user?.id as string)
      console.log('detele',  error);
        return { feed: f };
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again";
        console.error(message);
        throw { error: message };
    }
};
