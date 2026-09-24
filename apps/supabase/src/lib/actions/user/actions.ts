"use server"
import { revalidatePath } from "next/cache";
import { updateUser } from "@/lib/api/user/mutations";
import { UpdateProfileParams, updateProfileParams } from "@/lib/db/schema/profile";
import { createClient } from "@/lib/supabase/server";
import { searchFeeds } from "@/lib/api/search/queries";
import { getBlockedUserIds } from "@/lib/api/moderation/queries";

const handleErrors = (e: unknown) => {
    const errMsg = "Error, please try again.";
    if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
    if (e && typeof e === "object" && "error" in e) {
      const errAsStr = e.error as string;
      return errAsStr.length > 0 ? errAsStr : errMsg;
    }
    return errMsg;
  };
  
export const updateProfileAction = async (input: {
  display_name?: string;
  full_name?: string;
  description?: string;
  gender?: string;
  avatar_url?: string;
  birthday?: string;
  website?: string;
}) => {
  const supabase = await createClient();
  const { data: session } = await supabase.auth.getUser();
  if (!session?.user) return { data: null, error: "Not authenticated" };

  // Whitelist editable columns (no trial_end/email/privacy mass assignment).
  const allowed = ["display_name", "full_name", "description", "gender", "avatar_url", "birthday", "website"] as const;
  const patch: Record<string, string> = {};
  for (const key of allowed) {
    const value = input[key];
    if (typeof value === "string") patch[key] = value.trim();
  }
  if (patch.avatar_url && !patch.avatar_url.startsWith(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "")) {
    return { data: null, error: "Invalid avatar URL" };
  }
  if (patch.full_name !== undefined && !/^[\w.-]{5,50}$/.test(patch.full_name)) {
    return { data: null, error: "Username must be 5-50 letters, numbers, dots, dashes or underscores" };
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", session.user.id)
    .select()
    .single();
  if (error) {
    const message = error.code === "23505" ? "That username is already taken" : error.message;
    return { data: null, error: message };
  }

  revalidatePath("/", "layout");
  return { data, error: null };
};

export const updateUserAction = async (input: UpdateProfileParams) => {
    try {

      const payload =  updateProfileParams .parse(input);
      const data = await updateUser(payload);
      
      return {data}
    } catch (e) {
      return handleErrors(e);
    }
  };

export const getFeaturedUserAction = async (userId : Profile['id'] | null , offset: number, limit: number) => {
    const supabase = await createClient();
    let query = supabase.rpc('get_users_with_most_posts', { limitdata : 30 }).range(offset, offset + limit - 1);
    try {
      if (userId) {
        query = query.neq("id", userId);
      }   
      const { data: rows, error } = await query;
      if (error) throw error;
      // Never suggest users the viewer blocked or was blocked by.
      const { data: auth } = await supabase.auth.getUser();
      const blocked = await getBlockedUserIds(auth?.user?.id, supabase);
      const userFeatured = (rows ?? []).filter((user) => !blocked.has(user.id));
      await Promise.all(userFeatured.map(async (user: UserFeatured) => {
        const {count, error } = await supabase
        .from("user_follows")
        .select("*", { count: "exact" })
        .eq("following_id", user.id);
        const { data: rows } = await supabase
        .from("user_follows")
        .select("*")
        .eq("user_id",  userId as string)
        .eq("following_id", user?.id)
        .maybeSingle();
        user.countFollowing = count!;
        user.user_follower = rows ?? undefined;
      }));
      return userFeatured;
    } catch (error) {
      return handleErrors(error);
    }
}

export const fetchSearchDataAction = async (search: string | null, offset: number, limit: number) => {
  try {
    return (await searchFeeds(search, offset, limit)) as any[];
  } catch (error) {
    console.error("fetchSearchDataAction", handleErrors(error));
    return [];
  }
}
