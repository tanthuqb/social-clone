"use server"
import { updateUser } from "@/lib/api/user/mutations";
import { UpdateProfileParams, updateProfileParams } from "@/lib/db/schema/profile";
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
    const supabase = createClient();
    let query = supabase.rpc('get_users_with_most_posts', { limitdata : 30 }).range(offset, offset + limit - 1);
    try {
      if (userId) {
        query = query.neq("id", userId);
      }   
      const { data : userFeatured, error } = await query;
      await Promise.all(userFeatured.map(async (user: UserFeatured) => {
        const {count, error } = await supabase
        .from("user_follows")
        .select("*", { count: "exact" })
        .eq("following_id", user.id);
        const { data: rows } = await supabase
        .from("user_follows")
        .select("*")
        .eq("user_id",  userId)
        .eq("following_id", user?.id)
        .maybeSingle();
        user.countFollowing = count!;
        user.user_follower = rows;
      }));
      if(error) throw error;
      return userFeatured;
    } catch (error) {
      return handleErrors(error);
    }
}

export const  fetchSearchDataAction = async (search: string | null, offset: number, limit: number) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/search?search=${search}&offset=${offset}&limit=${limit}`, {
    next: {
      revalidate: 0
    }
  });
  const data = await res.json();
  return data;
}