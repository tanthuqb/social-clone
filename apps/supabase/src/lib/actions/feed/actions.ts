"use server";

import { revalidatePath } from "next/cache";
import { createFeed, updateFeed } from "@/lib/api/feeds/mutations";
import {
    FeedId,
    NewFeedParams,
    UpdateFeedParams,
    feedIdSchema,
    insertFeedParams,
    updateFeedParams,
} from "@/lib/db/schema/feeds";
import { createClient } from "@/lib/supabase/server";
import { FeedPrivacy } from "@/lib/supabase/database.types";
import { sanitizeContent, validateContentLength } from "@/lib/sanitize";
import { isPolicyViolation } from "@/lib/supabase/schema-errors";

const handleErrors = (e: unknown) => {
    const errMsg = "Error, please try again.";
    if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
    if (e && typeof e === "object" && "error" in e) {
        const errAsStr = e.error as string;
        return errAsStr.length > 0 ? errAsStr : errMsg;
    }
    return errMsg;
};

// Feeds appear on the home page, profile pages and feed detail pages.
const revalidateFeeds = () => revalidatePath("/", "layout");

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

/** Deletes a feed/comment owned by the current user. Throws on failure. */
export const deleteFeedAction = async (input: FeedId) => {
    const payload = feedIdSchema.parse({ id: input });
    const supabase = await createClient();
    const { data: session } = await supabase.auth.getUser();
    if (!session?.user) throw new Error("Not authenticated");

    const { data, error } = await supabase
        .from("feeds")
        .delete()
        .eq("id", payload.id)
        .eq("user_id", session.user.id)
        .select("id");
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) throw new Error("Post not found or not yours");
    revalidateFeeds();
    return { error: null };
};

export const togglePinAction = async (feedId: string, pin: boolean) => {
    const supabase = await createClient();
    const { data: session } = await supabase.auth.getUser();
    if (!session?.user) return { data: null, error: "Not authenticated" };

    const { data, error } = await supabase
        .from("feeds")
        .update({ pin })
        .eq("id", feedId)
        .eq("user_id", session.user.id)
        .select("id");
    if (error) return { data: null, error: error.message };
    if (!data || data.length === 0) {
        return { data: null, error: "Post not found or not yours" };
    }

    revalidateFeeds();
    return { data: null, error: null };
};

export const createFeedEntryAction = async (input: {
    content: string | null;
    type: "feed" | "comment";
    parent_id?: string | null;
    privacy?: FeedPrivacy;
}) => {
    const supabase = await createClient();
    const { data: session } = await supabase.auth.getUser();
    if (!session?.user) return { data: null, error: "Not authenticated" };

    const content = sanitizeContent(input.content);
    const lengthError = validateContentLength(content);
    if (lengthError) return { data: null, error: lengthError };

    const isComment = input.type === "comment";
    if (isComment && !input.parent_id) {
        return { data: null, error: "Missing post to comment on" };
    }
    // Comments follow the visibility of the post they belong to; only posts
    // carry their own audience.
    const privacy =
        !isComment && Object.values(FeedPrivacy).includes(input.privacy as FeedPrivacy)
            ? (input.privacy as FeedPrivacy)
            : FeedPrivacy.PUBLIC;

    // Whitelist the columns a client may set (no status/id/user_id spoofing).
    const { data, error } = await supabase
        .from("feeds")
        .insert({
            content,
            type: isComment ? "comment" : "feed",
            parent_id: isComment ? input.parent_id : null,
            privacy,
            user_id: session.user.id,
        })
        .select("*")
        .single();
    if (error) {
        // RLS rejects comments between blocked users or when the author's
        // comment setting does not allow it.
        if (isComment && isPolicyViolation(error)) {
            return { data: null, error: "You can't comment on this post." };
        }
        return { data: null, error: error.message };
    }

    revalidateFeeds();
    return { data, error: null };
};

export const updateFeedEntryAction = async (
    id: string,
    input: { content: string | null; type?: "feed" | "comment" },
) => {
    const supabase = await createClient();
    const { data: session } = await supabase.auth.getUser();
    if (!session?.user) return { data: null, error: "Not authenticated" };

    const content = sanitizeContent(input.content);
    const lengthError = validateContentLength(content);
    if (lengthError) return { data: null, error: lengthError };

    const { data, error } = await supabase
        .from("feeds")
        .update({ content, updated_at: new Date().toISOString() })
        .eq("id", id)
        .eq("user_id", session.user.id)
        .select("*, feed_images(*)")
        .single();
    if (error) return { data: null, error: error.message };

    revalidateFeeds();
    return { data, error: null };
};

export const getFeedsAction = async (offset: number, limit: number) => {
  try {
    const supabase = await createClient();
    const { data: feeds, error } = await supabase.from("feeds")
    .select("*,feed_images(*),user_id!left(*)")
    .eq("type", "feed")
    .range(offset, offset + limit - 1)
    .order("created_at", { ascending: false })
    if (error) {
      throw new Error(`An error happened: ${JSON.stringify(error)}`)
    }
    return feeds as Comment_Detail_Full[];
  } catch (error) {
    console.log(error)
    throw error instanceof Error
      ? error
      : new Error(`An error happened: ${JSON.stringify(error)}`)
  }
};

export const getFeedsProfileAction = async (offset: number, limit: number, user_id: string|null) => {
    try {
      const supabase = await createClient();
      if(user_id === null) return getFeedsAction(offset, limit)
      const { data: feeds, error } = await supabase.from("feeds")
      .select("*,feed_images(*),user_id!left(*)")
      .eq("type", "feed")
      .eq("user_id",user_id)
      // Same order as the first page (getFeedsPrepared): pinned first.
      .order("pin", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)
      if (error) {
        throw new Error(`An error happened: ${JSON.stringify(error)}`)
      }
      return feeds as Comment_Detail_Full[];
    } catch (error) {
      console.log(error)
      throw error instanceof Error
        ? error
        : new Error(`An error happened: ${JSON.stringify(error)}`)
    }
  };