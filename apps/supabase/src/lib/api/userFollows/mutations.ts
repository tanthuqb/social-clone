
import {
    UserFollowId,
    NewUserFollowParams,
    UpdateUserFollowParams,
    updateUserFollowSchema,
    insertUserFollowSchema,
    userFollowIdSchema,
} from "@/lib/db/schema/userFollows";
import { createClient } from "@/lib/supabase/server";


export const createUserFollow = async (userFollow: NewUserFollowParams) => {

    const supabase = createClient()
    const newUserFollow = insertUserFollowSchema.parse(
        userFollow,
    );
    try {        
        const { data, error } = await supabase.from('user_follows').insert([newUserFollow])
        console.log(error);
        return { userFollow: error };

    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again";
        console.error(message);
        throw { error: message };
    }
};

export const updateUserFollow = async (
    id: UserFollowId,
    userFollow: UpdateUserFollowParams,
) => {
    const supabase = createClient()
    const { user_id, following_id } = userFollowIdSchema.parse({ id });
    const newUserFollow = updateUserFollowSchema.parse(userFollow);
    try {

        const { data, error } = await supabase.from('user_follows').update({
            user_id: user_id,
            following_id: following_id
        }).eq('user_id', userFollow.user_id).eq('following_id', userFollow.following_id).select()
        console.log(data);
        return { userFollow: data };
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again";
        console.error(message);
        throw { error: message };
    }
};

export const deleteUserFollow = async (id: UserFollowId) => {
    const supabase = createClient()
    const { user_id, following_id } = userFollowIdSchema.parse(id);
    try {
        const { data, error } = await supabase.from('user_follows').delete().eq('user_id', user_id).eq('following_id', following_id)
        console.log(data);
        return { userFollow: error };
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again";
        console.error(message);
        throw { error: message };
    }
};
