
import {
    type UserFollowId,
    userFollowIdSchema,
    UserFollows,
    userIdParams
} from "@/lib/db/schema/userFollows";
import { createClient } from "@/lib/supabase/server";
export const getUserFollows = async () => {
    const supabase = createClient();    
    let { data: rows, error } = await supabase.from('user_follows').select('*, user_id!left(*),following_id!left(*)')
    return { userFollows: rows };

};

export const getUserFollowsByUserId = async (id: User['id']) => {
    const supabase = createClient();
    const { user_id } = userIdParams.parse({ userId: id });
    // const rows = await db
    //     .select()
    //     .from(userFollows)
    //     .leftJoin(users, eq(userFollows.userId, users.id))
    //     .leftJoin(following, eq(userFollows.followingId, following.id))
    //     .where(eq(userFollows.userId, userId));
    const {data:rows} = await supabase.from('user_follows')
    .select('*, user_id!left(*),following_id!left(*)')
    .eq('user_id', user_id)
    return { userFollowsByUserId: rows };
};

export const getUserFollowById = async (id: UserFollowId) => {
    const { user_id, following_id } = userFollowIdSchema.parse({ ...id });
    const supabase = createClient();
    const {data:rows,error} = await supabase.from('user_follows')
    .select('*')
    .eq('user_id', user_id)
    .eq('following_id', following_id)
    const {data:row} = await supabase.from('profiles')
    .select('*')
    .maybeSingle()
    if (row === undefined) return {};
    return { userFollow: row };
};

export const getUserFollowingCountPrepared = (
    userId: string | undefined = undefined,
) => {
    const supabase = createClient();
        const prepared =  supabase.from('user_follows')
        .select('*', { count: 'exact', head: true })

    if (userId) {
        prepared.eq('user_id', userId);
    }
    return prepared;
};

export const getUserFollowsCountPrepared = (
    userId: string | undefined = undefined,
) => {
    const supabase = createClient();
    const prepared = supabase.from('user_follows')
    .select('*!following_id!left(*)', { count: 'exact', head: true })
    if (userId) {
        prepared.eq('following_id', userId);
    }
    return prepared;
};


