"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createCommentAction(input: {
  feed_id: string;
  content: string;
  parent_id?: string | null;
}) {
  const supabase = await createClient();
  const { data: session } = await supabase.auth.getUser();
  if (!session?.user) return { data: null, error: "Not authenticated" };

  const { data, error } = await supabase
    .from("comments")
    .insert({ ...input, user_id: session.user.id })
    .select()
    .single();
  if (error) return { data: null, error: error.message };

  revalidatePath(`/p/${input.feed_id}`);
  return { data, error: null };
}

export async function updateCommentAction(id: string, content: string) {
  const supabase = await createClient();
  const { data: session } = await supabase.auth.getUser();
  if (!session?.user) return { data: null, error: "Not authenticated" };

  const { data, error } = await supabase
    .from("comments")
    .update({ content })
    .eq("id", id)
    .select()
    .single();
  if (error) return { data: null, error: error.message };

  if (data?.feed_id) revalidatePath(`/p/${data.feed_id}`);
  return { data, error: null };
}

export async function deleteCommentAction(id: string) {
  const supabase = await createClient();
  const { data: session } = await supabase.auth.getUser();
  if (!session?.user) return { data: null, error: "Not authenticated" };

  const { error } = await supabase.from("comments").delete().eq("id", id);
  if (error) return { data: null, error: error.message };

  revalidatePath("/");
  return { data: null, error: null };
}
