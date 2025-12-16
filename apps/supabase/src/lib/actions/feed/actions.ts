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

export const createFeedAction = async (input: NewFeedParams) => {
    try {
        const payload = insertFeedParams.parse(input);
        const { feed } = await createFeed(payload);
        revalidateFeeds();
        return { feed, error: null };
    } catch (e) {
        return handleErrors(e);
    }
};

export const updateFeedAction = async (input: UpdateFeedParams) => {
    try {
        const payload = updateFeedParams.parse(input);
        const { feed } = await updateFeed(payload.id, input);
        revalidateFeeds();
        return { feed, error: null };
    } catch (e) {
        return handleErrors(e);
    }
};

export const deleteFeedAction = async (input: FeedId) => {
    try {

        const payload = feedIdSchema.parse({ id: input });
        await deleteFeed(payload.id);
        revalidateFeeds();
    } catch (e) {
      console.log('error',e);
        return handleErrors(e);
    }
};

export const getFeedsAction = async (offset: number, limit: number) => {
  try {
    const supabase = createClient();
    const { data: feeds, error } = await supabase.from("feeds")
    .select("*,feed_images(*),user_id!left(*)")
    .eq("type", "feed")
    .range(offset, offset + limit - 1)
    .order("created_at", { ascending: false })
    if (error) {
      throw new Error(`An error happened: ${error}`)
    }
    return feeds as Comment_Detail_Full[];
  } catch (error) {
    console.log(error)
    throw new Error(`An error happened: ${error}`)
  }
};

export const getFeedsProfileAction = async (offset: number, limit: number, user_id: string|null) => {
    try {
      const supabase = createClient();
      if(user_id === null) return getFeedsAction(offset, limit)
      const { data: feeds, error } = await supabase.from("feeds")
      .select("*,feed_images(*),user_id!left(*)")
      .eq("type", "feed")
      .eq("user_id",user_id)
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false })
      if (error) {
        throw new Error(`An error happened: ${error}`)
      }
      return feeds as Comment_Detail_Full[];
    } catch (error) {
      console.log(error)
      throw new Error(`An error happened: ${error}`)
    }
  };