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

export const getFeedCollectionsAction = async (offset: number, limit: number, user_id: string) => {
    try {
      const supabase = createClient();
      const { data: feed_collections, error } = await supabase
      .from("feed_collections")
      .select("*, feed_id!left(*,feed_images(*),user_id!left(*))")
      .eq("user_id", user_id as string)
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false })
      if (error) {
        throw new Error(`An error happened: ${error}`)
      }
      return feed_collections as Comment_Detail_Full[];
    } catch (error) {
      console.log(error)
      throw new Error(`An error happened: ${error}`)
    }
  };