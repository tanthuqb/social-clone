"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  FEATURE_UNAVAILABLE,
  isMissingSchemaError,
  isUniqueViolation,
} from "@/lib/supabase/schema-errors";
import { REPORT_DETAILS_MAX, REPORT_REASONS } from "@/lib/moderation";

type ActionResult = { error: string | null };

const uuid = z.string().uuid();

async function currentUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return { supabase, userId: data?.user?.id ?? null };
}

const dbError = (error: { code?: string; message: string }) =>
  isMissingSchemaError(error) ? FEATURE_UNAVAILABLE : error.message;

// ------------------------------------------------------------------ hide post
/**
 * Hides a post for the current user only. Hidden posts are filtered out of
 * the home feed, profiles and search by the feeds RLS policy. No revalidation:
 * the card is replaced in place (with Undo) and later renders are fresh.
 */
export async function hideFeedAction(feedId: string): Promise<ActionResult> {
  if (!uuid.safeParse(feedId).success) return { error: "Invalid post" };
  const { supabase, userId } = await currentUser();
  if (!userId) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("hidden_feeds")
    .insert({ user_id: userId, feed_id: feedId });
  if (error && !isUniqueViolation(error)) return { error: dbError(error) };
  return { error: null };
}

export async function unhideFeedAction(feedId: string): Promise<ActionResult> {
  if (!uuid.safeParse(feedId).success) return { error: "Invalid post" };
  const { supabase, userId } = await currentUser();
  if (!userId) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("hidden_feeds")
    .delete()
    .eq("user_id", userId)
    .eq("feed_id", feedId);
  if (error) return { error: dbError(error) };
  return { error: null };
}

// ----------------------------------------------------------------- block user
/**
 * Blocks a user. A database trigger removes follows both ways; RLS hides
 * posts, comments, reactions and notifications between the two users.
 */
export async function blockUserAction(targetId: string): Promise<ActionResult> {
  if (!uuid.safeParse(targetId).success) return { error: "Invalid user" };
  const { supabase, userId } = await currentUser();
  if (!userId) return { error: "Not authenticated" };
  if (userId === targetId) return { error: "You can't block yourself" };

  const { error } = await supabase
    .from("user_blocks")
    .insert({ blocker_id: userId, blocked_id: targetId });
  if (error && !isUniqueViolation(error)) return { error: dbError(error) };

  revalidatePath("/", "layout");
  return { error: null };
}

export async function unblockUserAction(targetId: string): Promise<ActionResult> {
  if (!uuid.safeParse(targetId).success) return { error: "Invalid user" };
  const { supabase, userId } = await currentUser();
  if (!userId) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("user_blocks")
    .delete()
    .eq("blocker_id", userId)
    .eq("blocked_id", targetId);
  if (error) return { error: dbError(error) };

  revalidatePath("/", "layout");
  return { error: null };
}

// --------------------------------------------------------------------- report
const reportSchema = z
  .object({
    target: z.enum(["post", "comment", "user"]),
    targetId: uuid,
    reason: z.enum(REPORT_REASONS.map((r) => r.value) as [string, ...string[]]),
    details: z.string().trim().max(REPORT_DETAILS_MAX).optional(),
  })
  .refine((input) => input.reason !== "fake_account" || input.target === "user", {
    message: "Choose a reason",
  });

export type ReportInput = z.input<typeof reportSchema>;

const ALREADY_REPORTED: Record<ReportInput["target"], string> = {
  post: "You already reported this post",
  comment: "You already reported this comment",
  user: "You already reported this user",
};

export async function reportAction(input: ReportInput): Promise<ActionResult> {
  const parsed = reportSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid report" };
  }
  const { target, targetId, reason, details } = parsed.data;
  const { supabase, userId } = await currentUser();
  if (!userId) return { error: "Not authenticated" };

  if (target === "user") {
    if (targetId === userId) return { error: "You can't report yourself" };
  } else {
    const { data: feed } = await supabase
      .from("feeds")
      .select("user_id")
      .eq("id", targetId)
      .maybeSingle();
    if (!feed) return { error: "Post not found" };
    if (feed.user_id === userId) return { error: "You can't report your own post" };
  }

  const { error } = await supabase.from("report").insert({
    user_id: userId,
    reason,
    content: details ? details : null,
    ...(target === "user" ? { reported_user_id: targetId } : { feed_id: targetId }),
  });
  if (isUniqueViolation(error)) return { error: ALREADY_REPORTED[target] };
  if (error) return { error: dbError(error) };
  return { error: null };
}
