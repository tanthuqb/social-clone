"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isPolicyViolation } from "@/lib/supabase/schema-errors";

export const followAction = async (followingId: string) => {
  const supabase = await createClient();
  const { data: session } = await supabase.auth.getUser();
  if (!session?.user) return { data: null, error: "Not authenticated" };

  const { error } = await supabase
    .from("user_follows")
    .insert({ user_id: session.user.id, following_id: followingId });
  // RLS rejects follows between blocked users.
  if (isPolicyViolation(error)) return { data: null, error: "You can't follow this user" };
  if (error) return { data: null, error: error.message };

  revalidatePath("/");
  return { data: null, error: null };
};

export const unfollowAction = async (followingId: string) => {
  const supabase = await createClient();
  const { data: session } = await supabase.auth.getUser();
  if (!session?.user) return { data: null, error: "Not authenticated" };

  const { error } = await supabase
    .from("user_follows")
    .delete()
    .eq("user_id", session.user.id)
    .eq("following_id", followingId);
  if (error) return { data: null, error: error.message };

  revalidatePath("/");
  return { data: null, error: null };
};
