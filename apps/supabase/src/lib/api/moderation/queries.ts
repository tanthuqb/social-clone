import { createClient } from "@/lib/supabase/server";
import { isMissingSchemaError } from "@/lib/supabase/schema-errors";
import {
  CommentPermission,
  FeedPrivacy,
  ProfileVisibility,
} from "@/lib/supabase/database.types";

/*
 * Server-side reads for hide / block / privacy. Every function degrades
 * gracefully when migration 20260925100000 is not applied: missing tables or
 * columns are treated as "nothing hidden / nobody blocked / default settings"
 * and `available: false` lets pages show a short notice.
 */

type Supabase = Awaited<ReturnType<typeof createClient>>;

export type BlockRelation = {
  available: boolean;
  blockedByMe: boolean;
  blockedMe: boolean;
};

/** Block state between the signed-in user and `otherId` (both directions). */
export async function getBlockRelation(
  viewerId: string | null | undefined,
  otherId: string,
  supabase?: Supabase,
): Promise<BlockRelation> {
  const none = { available: true, blockedByMe: false, blockedMe: false };
  if (!viewerId || viewerId === otherId) return none;
  const client = supabase ?? (await createClient());
  const { data, error } = await client
    .from("user_blocks")
    .select("blocker_id, blocked_id")
    .or(
      `and(blocker_id.eq.${viewerId},blocked_id.eq.${otherId}),and(blocker_id.eq.${otherId},blocked_id.eq.${viewerId})`,
    );
  if (error) return { ...none, available: !isMissingSchemaError(error) };
  return {
    available: true,
    blockedByMe: (data ?? []).some((row) => row.blocker_id === viewerId),
    blockedMe: (data ?? []).some((row) => row.blocker_id === otherId),
  };
}

/** Ids of users the viewer blocked or is blocked by (empty before the migration). */
export async function getBlockedUserIds(
  viewerId: string | null | undefined,
  supabase?: Supabase,
): Promise<Set<string>> {
  if (!viewerId) return new Set();
  const client = supabase ?? (await createClient());
  const { data, error } = await client
    .from("user_blocks")
    .select("blocker_id, blocked_id");
  if (error) return new Set();
  return new Set(
    (data ?? []).map((row) => (row.blocker_id === viewerId ? row.blocked_id : row.blocker_id)),
  );
}

export type BlockedUser = {
  id: string;
  display_name: string | null;
  full_name: string | null;
  avatar_url: string | null;
  blocked_at: string;
};

/** Users blocked by the viewer, newest first. */
export async function getBlockedUsers(
  viewerId: string,
): Promise<{ available: boolean; users: BlockedUser[] }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_blocks")
    .select(
      "created_at, blocked:profiles!user_blocks_blocked_id_fkey(id, display_name, full_name, avatar_url)",
    )
    .eq("blocker_id", viewerId)
    .order("created_at", { ascending: false });
  if (error) return { available: !isMissingSchemaError(error), users: [] };
  const users = (data ?? []).flatMap((row) =>
    row.blocked ? [{ ...row.blocked, blocked_at: row.created_at }] : [],
  );
  return { available: true, users };
}

/** Whether the viewer hid this post (used by the post page to offer "Unhide"). */
export async function isFeedHiddenByViewer(
  viewerId: string | null | undefined,
  feedId: string,
): Promise<boolean> {
  if (!viewerId) return false;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hidden_feeds")
    .select("feed_id")
    .eq("user_id", viewerId)
    .eq("feed_id", feedId)
    .maybeSingle();
  if (error) return false;
  return !!data;
}

export type PrivacySettings = {
  default_post_privacy: FeedPrivacy;
  profile_visibility: ProfileVisibility;
  comment_permission: CommentPermission;
};

export const DEFAULT_PRIVACY_SETTINGS: PrivacySettings = {
  default_post_privacy: FeedPrivacy.PUBLIC,
  profile_visibility: ProfileVisibility.PUBLIC,
  comment_permission: CommentPermission.EVERYONE,
};

export async function getPrivacySettings(
  userId: string,
): Promise<{ available: boolean; settings: PrivacySettings }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("default_post_privacy, profile_visibility, comment_permission")
    .eq("id", userId)
    .maybeSingle();
  if (error || !data) {
    return {
      available: !isMissingSchemaError(error),
      settings: DEFAULT_PRIVACY_SETTINGS,
    };
  }
  return {
    available: true,
    settings: {
      default_post_privacy: data.default_post_privacy as FeedPrivacy,
      profile_visibility: data.profile_visibility as ProfileVisibility,
      comment_permission: data.comment_permission as CommentPermission,
    },
  };
}

/**
 * Why the viewer can't comment on a post, or null when they can. Mirrors the
 * RLS rule (private.can_comment_on) so the UI can explain it up front; the
 * database still enforces it.
 */
export async function getCommentRestriction(
  viewerId: string | null | undefined,
  authorId: string,
): Promise<string | null> {
  if (!viewerId || viewerId === authorId) return null;
  const supabase = await createClient();
  const relation = await getBlockRelation(viewerId, authorId, supabase);
  if (relation.blockedByMe) return "You blocked this user. Unblock them to comment.";
  if (relation.blockedMe) return "You can't comment on this post.";

  const { data: author, error } = await supabase
    .from("profiles")
    .select("comment_permission")
    .eq("id", authorId)
    .maybeSingle();
  if (error || !author) return null;
  if (author.comment_permission === CommentPermission.NOBODY) {
    return "The author turned off comments.";
  }
  if (author.comment_permission === CommentPermission.FOLLOWERS) {
    const { data: follow } = await supabase
      .from("user_follows")
      .select("user_id")
      .eq("user_id", viewerId)
      .eq("following_id", authorId)
      .maybeSingle();
    if (!follow) return "Only followers of the author can comment.";
  }
  return null;
}
