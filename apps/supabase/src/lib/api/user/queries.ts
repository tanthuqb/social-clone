import { ProfileIdSchema } from "@/lib/db/schema/profile";
import { createClient } from "@/lib/supabase/server";



export const getUserById = async (id: User['id'] | undefined) => {
  const supabase = createClient()
  if (!id) {
    return { user: null };
  }

  const { id: userId } = ProfileIdSchema.parse({ id });
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();

  if (error) {
    throw error;
  }

  return { user: data };
}
export const getUsers = async (offset : number , limit : number) => {
  const supabase = createClient()
  const { data, error } = await supabase.from('profiles')
  .select('*')
  .range(offset, offset + limit - 1)

  if (error) {
    return {}
  }
  return data
}

