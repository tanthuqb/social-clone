
import { UpdateProfileParams, updateProfileParams ,  ProfileIdSchema } from "@/lib/db/schema/profile";

import { createClient } from "@/lib/supabase/server";

export const updateUser = async (

  user: UpdateProfileParams,
) => {
  const supabase = createClient()
  const { data: session, error } = await supabase.auth.getUser();
  if (error) {
    return { error: error.message };
  }

//   const { id : profileId } = ProfileIdSchema.parse({ session?.user?.id!});

//   const NewProfile = updateProfileParams.parse({
//     ...user,
// });

  
  // try {
  //   const { data, error } = await supabase.from('profiles').update(
  //     [NewProfile]
  //   ).eq('id', user.id).select();
  //   if (!error) {
  //     return { data }
  //   }
  //   else
  //     return { error: error };
  // } catch (err) {
  //   const message = (err as Error).message ?? "Error, please try again";
  //   console.error(message);
  //   throw { error: message };
  // }
};