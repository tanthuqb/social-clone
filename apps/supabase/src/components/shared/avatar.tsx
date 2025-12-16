"use client";
import { ReactionState } from "@/lib/supabase/database.types";
import {
  Avatar as AvatarComponent,
  AvatarImage,
  AvatarFallback,
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  toast,
} from "@suzu/ui";
import { UserRound } from "lucide-react";
import { BaseIconBTN } from "../master-layout";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { FollowButton } from "../userFollows/follow-btn";
import Link from "next/link";

const Avatar = ({
  user,
  className,
  session,
  notification,
  feed,
  type,
}: {
  user: Profile;
  className?: string;
  session?: Session;
  feed?: Feed_Detail;
  notification?: Notifications_Detail;
  type?: string;
}) => {
  const pathname = usePathname();
  const isUserPathname = pathname === `/u/${user?.full_name}`;
  const [followingUser, setFollowingUser] = useState<UserFollows | null>(null);
  const [following, setFollowing] = useState<number>(0);
  const [follower, setFollower] = useState<number>(0);
  const [showPlus, setShowPlus] = useState<boolean>(true);
  const [followingState, setFollowingState] = useState<boolean>(false);
  const supabase = createClient();
  useEffect(() => {
    const fetchData = async () => {
      if (session?.user?.id && user?.id != session?.user?.id) {
        const { data: follow, error } = await supabase
          .from("user_follows")
          .select("*")
          .eq("following_id", feed?.user_id?.id ?? user?.id)
          .eq("user_id", session?.user?.id)
          .maybeSingle();
        if (follow) {
          setFollowingUser(follow);
          setFollowingState(true);
        }
      }
      if (user?.id && session?.user?.id && user?.id !== session?.user?.id) {
        const { count: follower, error } = await supabase
          .from("user_follows")
          .select("*!following_id!left(*)", { count: "exact", head: true })
          .eq("following_id", user?.id);
        const { count: following, error: errorFollowing } = await supabase
          .from("user_follows")
          .select("*!user_id!left(*)", { count: "exact", head: true })
          .eq("user_id", user?.id);
        if (following) setFollowing(following);
        if (follower) setFollower(follower);
      }
    };
    fetchData();
  }, [feed?.user_id?.id, session?.user?.id]);
  const followHandler = async (user: Profile) => {
    if (session?.user?.id && user?.id && user?.id !== session?.user?.id) {
      if (!followingUser) {
        const { data, error } = await supabase
          .from("user_follows")
          .insert({
            user_id: session?.user?.id,
            following_id: user?.id,
          })
          .select();
        if (error) {
          console.log(error);
          toast.error("Theo dõi thất bại");
        } else {
          setShowPlus(false);
          setFollowingState(true);
          toast.success("Theo dõi thành công");
        }
      }
    }
  };

  useEffect(() => {
    const channel = supabase.channel(`avatar_${user?.id}`);
    channel
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_follows" },
        (payload: any) => {
          switch (payload?.eventType) {
            case "INSERT":
              if (payload && payload?.new && payload?.new?.following_id == user?.id) {
                setFollowingState(true);
                setShowPlus(false);
              }
              break;
            case "DELETE":
              if (payload && payload?.old && payload?.old?.following_id == user?.id) {
                setFollowingState(false);
                setShowPlus(true);
              }
              break;
            default:
              break;
          }
        },
      )
      .subscribe();
      return () => {
        supabase.realtime.removeChannel(channel);
      };
  }, [supabase]);

  return session?.user?.id === user?.id || isUserPathname ? (
    <AvatarComponent className={className}>
      <Link
        className="flex items-center space-x-2"
        href={`/u/${user?.full_name}`}
      >
        <AvatarImage src={user?.avatar_url ?? ""} />
      </Link>
      <AvatarFallback>
        <div className="flex size-10 items-center justify-center">
          <UserRound />
        </div>
      </AvatarFallback>
    </AvatarComponent>
  ) : notification ? (
    <AvatarComponent className={className}>
      <div className="avatar relative flex h-10 w-10 flex-col self-stretch">
        <Link
          className="flex items-center space-x-2"
          href={`/u/${user?.full_name}`}
        >
          <AvatarImage src={user?.avatar_url ?? ""} />
        </Link>
        {notification?.type === "user_follows" ? (
          <div className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 flex-col items-start rounded-full border-[2px] border-[#fff] bg-slate-50 p-0.5">
            <BaseIconBTN
              width={24}
              height={24}
              src="/assets/icons/eyes-icon-24.png"
            />
          </div>
        ) : notification?.type === "feed_engagement" ? (
          notification?.state === ReactionState.LIKE ? (
            <div className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 flex-col items-start rounded-full border-[2px] border-[#fff] bg-slate-50 p-0.5">
              <BaseIconBTN
                width={24}
                height={24}
                src="/assets/icons/sparkling-active-icon-24.png"
              />
            </div>
          ) : (
            <div className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 flex-col items-start rounded-full border-[2px] border-[#fff] bg-slate-50 p-0.5">
              <BaseIconBTN
                width={24}
                height={24}
                src="/assets/icons/mendling-active-icon-24.png"
              />
            </div>
          )
        ) : notification?.type == "comment_engagement" ? (
          <div className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 flex-col items-start rounded-full border-[2px] border-[#fff] bg-slate-50 p-0.5">
            <BaseIconBTN
              width={24}
              height={24}
              src="/assets/icons/sparkling-active-icon-24.png"
            />
          </div>
        ) : notification?.type == "comments" ? (
          <div className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 flex-col items-start rounded-full border-[2px] border-[#fff] bg-slate-50 p-0.5">
            <BaseIconBTN
              width={24}
              height={24}
              src="/assets/icons/forum-icon-24.png"
            />
          </div>
        ) : notification?.type == "feed" ? (
          <div className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 flex-col items-start rounded-full border-[2px] border-[#fff] bg-slate-50 p-0.5">
            <BaseIconBTN
              width={24}
              height={24}
              src="/assets/icons/new-feed-icon-24.png"
            />
          </div>
        ) : followingUser?.following_id === feed?.user_id?.id &&
          showPlus ? null : (
          <div
            className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 flex-col items-start rounded-full border-[2px] border-[#fff] bg-slate-50 p-0.5"
            onClick={async () => followHandler(user)}
          >
            <BaseIconBTN
              width={24}
              height={24}
              src="/assets/icons/plus-icon-24.png"
            />
          </div>
        )}
      </div>
      <AvatarFallback>
        <div className="flex size-10 items-center justify-center">
          <UserRound />
        </div>
      </AvatarFallback>
    </AvatarComponent>
  ) : type == "search" ? (
    <AvatarComponent className={className}>
      <div className="avatar relative flex h-10 w-10 flex-col self-stretch">
        <Link
          className="flex items-center space-x-2"
          href={`/u/${user?.full_name}`}
        >
          <AvatarImage src={user?.avatar_url ?? ""} />
        </Link>
        {followingUser?.following_id === user?.id && showPlus ? null : (
          <div
            className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 flex-col items-start rounded-full border-[2px] border-[#fff] bg-slate-50 p-0.5"
          // onClick={async () => followHandler(user)}
          >
            <BaseIconBTN
              width={24}
              height={24}
              src="/assets/icons/plus-icon-24.png"
            />
          </div>
        )}
      </div>
      <AvatarFallback>
        <div className="flex size-10 items-center justify-center">
          <UserRound />
        </div>
      </AvatarFallback>
    </AvatarComponent>
  ) : (
    <HoverCard openDelay={300}>
      <HoverCardTrigger asChild>
        {/* TODO
        Check lại điều kiện này khi vào trang cá nhân của người khác
        */}
        <AvatarComponent className={className}>
          <div className="avatar relative flex h-10 w-10 flex-col self-stretch">
            {!session && (
              <div
                className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 flex-col items-start rounded-full border-[2px] border-[#fff] bg-slate-50 p-0.5"
                onClick={async () => followHandler(user)}
              >
                <BaseIconBTN
                  width={24}
                  height={24}
                  src="/assets/icons/plus-icon-24.png"
                />
              </div>
            )}
            <Link
              className="flex items-center space-x-2"
              href={`/u/${user?.full_name}`}
            >
              <AvatarImage src={user?.avatar_url ?? ""} />
            </Link>

            {followingUser?.following_id ===
              (type === "list-reaction-user" ? user?.id : feed?.user_id?.id) ||
              (showPlus && (
                <div
                  className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 flex-col items-start rounded-full border-[2px] border-[#fff] bg-slate-50 p-0.5"
                  onClick={async () => followHandler(user)}
                >
                  <BaseIconBTN
                    width={24}
                    height={24}
                    src="/assets/icons/plus-icon-24.png"
                  />
                </div>
              ))}
          </div>
          <AvatarFallback>
            <div className="flex size-10 items-center justify-center">
              <UserRound />
            </div>
          </AvatarFallback>
        </AvatarComponent>
      </HoverCardTrigger>
      <HoverCardContent className="w-96 rounded-[20px]">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-start gap-4 self-stretch">
            <div className="flex flex-1 flex-col items-start gap-2">
              <div className="flex flex-col items-start">
                <div className="self-stretch text-[29px] font-normal leading-[130%] text-slate-900">
                  {user?.display_name ?? "username"}
                </div>
                <div className="text-m self-stretch font-normal leading-[150%] text-slate-900">
                  @{user?.full_name ?? "username"}
                </div>
              </div>
              <div className="row flex items-start gap-4 self-stretch">
                <div className="row-item flex items-baseline gap-1">
                  <div className="text-m font-semibold leading-[150%] text-slate-900">
                    {follower ?? 0}
                  </div>
                  <div className="text-xs font-normal leading-[150%] text-slate-900">
                    Người theo dõi
                  </div>
                </div>
                <div className="row-item flex items-baseline gap-1">
                  <div className="text-m font-semibold leading-[150%] text-slate-900">
                    {following ?? 0}
                  </div>
                  <div className="text-xs font-normal leading-[150%] text-slate-900">
                    Đang theo dõi
                  </div>
                </div>
              </div>
            </div>

            <div className="flex h-[61px] w-[61px] flex-col items-center justify-center gap-2.5 rounded-bl-[4px] rounded-br-[10px] rounded-tl-[10px] rounded-tr-[4px] bg-slate-200">
              <img
                src={user?.avatar_url ?? ""}
                alt=""
                className="h-full w-full rounded-bl-[4px] rounded-br-[10px] rounded-tl-[10px] rounded-tr-[4px]"
              />
            </div>
          </div>

          <div className="text-m self-stretch font-normal leading-[150%] text-slate-900">
            All good things are wild and free..
          </div>
          <FollowButton
            userId={session?.user?.id as string}
            followingId={feed?.user_id?.id ?? (user.id as string)}
            followingState={followingState}
            setShowPlus={setShowPlus}
            showPlus={showPlus}
            setFollowingState={setFollowingState}
          />
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export { Avatar };
