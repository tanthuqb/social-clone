import { Avatar } from "../shared/avatar";
import {
  getUserFollowById,
  getUserFollowingCountPrepared,
  getUserFollowsCountPrepared,
} from "@/lib/api/userFollows/queries";
import { FollowButton } from "../userFollows/follow-btn";
import { createClient } from "@/lib/supabase/server";

export const UserHeader = async ({
  user,
  userIdByParams,
  session,
}: {
  user?: any;
  userIdByParams: string;
  session: any;
}) => {
  const supbase = createClient();
  // const { data: session } = await supbase.auth.getUser();
  const { count: following, error } = await getUserFollowingCountPrepared(
    user?.id,
  );

  const { count: follows } = await getUserFollowsCountPrepared(user?.id);

  let followingState = false;
  let userFollow = null;
  if (session?.user?.id && user?.id !== session?.user?.id) {
    const { data: rows, error } = await supbase
      .from("user_follows")
      .select("*")
      .eq("user_id", session?.user?.id)
      .eq("following_id", user?.id)
      .maybeSingle();

    const { data: rowsName } = await supbase
      .from("profiles")
      .select("*")
      .eq("id", rows?.following_id as string);
    const currentState = rowsName;
    followingState = !!currentState;
    userFollow = currentState ?? null;
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-1 flex-col items-stretch gap-2">
        <div className="flex items-start gap-4 self-stretch">
          <div className="flex flex-1 flex-col items-start gap-2">
            <div className="cols flex flex-col items-start self-stretch">
              <div className="text-[29px] font-normal not-italic leading-[37.7px] text-slate-900">
                {user?.display_name ?? "username"}
              </div>
              <div className="text-[15px] font-normal not-italic leading-[22.5px] text-slate-500">
                @{user?.full_name ?? "full_name"}
              </div>
            </div>
            <div className="rows flex items-start gap-4 self-stretch">
              <div className="flex items-baseline gap-1">
                <div className="text-[15px] font-semibold not-italic leading-[22.5px] text-slate-900">
                  {follows}
                </div>
                <div className="text-[12px] font-normal not-italic leading-[18px] text-[#000]">
                  Người theo dõi
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <div className="text-[15px] font-semibold not-italic leading-[22.5px] text-slate-900">
                  {following}
                </div>
                <div className="text-[12px] font-normal not-italic leading-[18px] text-[#000]">
                  Đang theo dõi
                </div>
              </div>
            </div>
          </div>
          <div className="flex h-[94px] w-[94px] flex-col">
            <img
              src={user?.avatar_url ?? ""}
              alt=""
              className="h-full w-full rounded-bl-[8px] rounded-br-3xl rounded-tl-3xl rounded-tr-[8px]"
            />
          </div>
        </div>
      </div>
      {user?.description && (
        <div className="text-left font-sans text-[15px] font-normal leading-[23.25px]">
          {user?.description}
        </div>
      )}
      <div className="">
        {user?.id === session?.user?.id ? null : (
          <FollowButton
            userId={session?.user?.id!}
            followingId={user?.id as string}
            followingState={followingState}
          />
        )}
      </div>
    </div>
  );
};
