"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export const markNotificationReadAction = async (id: string) => {
  const supabase = await createClient();
  const { data: session } = await supabase.auth.getUser();
  if (!session?.user) return { data: null, error: "Not authenticated" };

  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", id);
  if (error) return { data: null, error: error.message };

  revalidatePath("/notifications");
  return { data: null, error: null };
};

export const deleteNotificationAction = async (id: string) => {
  const supabase = await createClient();
  const { data: session } = await supabase.auth.getUser();
  if (!session?.user) return { data: null, error: "Not authenticated" };

  const { error } = await supabase.from("notifications").delete().eq("id", id);
  if (error) return { data: null, error: error.message };

  revalidatePath("/notifications");
  return { data: null, error: null };
};
