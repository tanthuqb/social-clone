"use server";

import { revalidatePath } from "next/cache";
import { createFeed, deleteFeed, updateFeed } from "@/lib/api/feeds/mutations";
import {
    FeedId,
    NewFeedParams,
    UpdateFeedParams,
    feedIdSchema,
    insertFeedParams,
    updateFeedParams,
} from "@/lib/db/schema/feeds";
import { createClient } from "@/lib/supabase/server";

const handleErrors = (e: unknown) => {
    const errMsg = "Error, please try again.";
    if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
    if (e && typeof e === "object" && "error" in e) {
        const errAsStr = e.error as string;
        return errAsStr.length > 0 ? errAsStr : errMsg;
    }
    return errMsg;
};

const revalidateFeeds = () => revalidatePath("/");

export const saveFeedAction = async (feedId: string) => {
    const supabase = await createClient();
    const { data: session } = await supabase.auth.getUser();
    if (!session?.user) return { data: null, error: "Not authenticated" };

    const { error } = await supabase
        .from("feed_collections")
        .insert({ user_id: session.user.id, feed_id: feedId });
    if (error) return { data: null, error: error.message };

    revalidateFeeds();
    return { data: null, error: null };
};

export const unsaveFeedAction = async (feedId: string) => {
    const supabase = await createClient();
    const { data: session } = await supabase.auth.getUser();
    if (!session?.user) return { data: null, error: "Not authenticated" };

    const { error } = await supabase
        .from("feed_collections")
        .delete()
        .eq("user_id", session.user.id)
        .eq("feed_id", feedId);
    if (error) return { data: null, error: error.message };

    revalidateFeeds();
    return { data: null, error: null };
};

export const getFeedCollectionsAction = async (offset: number, limit: number, user_id: string) => {
    try {
      const supabase = await createClient();
      const { data: feed_collections, error } = await supabase
      .from("feed_collections")
      .select("*, feed_id!left(*,feed_images(*),user_id!left(*))")
      .eq("user_id", user_id as string)
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false })
      if (error) {
        throw new Error(`An error happened: ${error}`)
      }
      return feed_collections as unknown as Comment_Detail_Full[];
    } catch (error) {
      console.log(error)
      throw new Error(`An error happened: ${error}`)
    }
  };