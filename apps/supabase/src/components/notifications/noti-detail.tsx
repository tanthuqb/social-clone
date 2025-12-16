"use client";
import { Divider, toast } from "@suzu/ui";
import DropdownMenuComponent from "../shared/dropdownMenu/dropdown-menu";
import { FollowButton } from "../userFollows/follow-btn";
import Link from "next/link";
import { ReactionState } from "@/lib/supabase/database.types";
import { BaseUserInfo } from "../master-layout";
import { createClient } from "@/lib/supabase/client";
import { Suspense, useEffect, useState } from "react";
import { Avatar } from "../shared/avatar";
import { BaseText } from "../master-layout/base-text";
import { redirect, useRouter } from "next/navigation";
type NotiDetailProps = {
  notification?: Notifications_Detail;
  session?: Session;
};
const NotiDetail = ({ notification, session }: NotiDetailProps) => {
  const supabase = createClient();
  const [userFollow, setUserFollow] = useState<UserFollows | null>(null);
  const [following_user, setFollowingUser] = useState<Profile | null>(null);
  const [href, setHref] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [indicator, setIndicator] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      //update đã vào thông báo
      // if (notification?.status == false) {
      //   const { data: notiUpdate } = await supabase
      //     .from("notifications")
      //     .update({ status: true })
      //     .eq("id", notification?.id)
      //     .single();
      // }
      //lấy thông tin người theo dõi
      const { data: following_userData } = await supabase
        .from("user_follows")
        .select("*")
        .eq("user_id", notification?.user_noti_id)
        .eq("following_id", notification?.user_id?.id)
        .maybeSingle();
      setFollowingUser(following_userData);
      //lấy thông tin người được theo dõi
      if (notification?.following_id) {
        const { data: rows } = await supabase
          .from("user_follows")
          .select("*")
          .eq("user_id", notification?.following_id)
          .eq("following_id", notification?.user_id?.id)
          .maybeSingle();
        if (rows) {
          const { data: userFollowData, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", rows?.following_id as string)
            .single();
          if (userFollowData) {
            setUserFollow(userFollowData);
          }
        }
      }
      switch (notification?.type) {
        case "user_follows":
          setHref(`/u/${notification?.user_id?.full_name}`);
          break;
        case "feed_engagement":
          setHref(`/p/${notification?.feed_id?.id}`);
          break;
        case "comment_engagement":
          setHref(`/p/${notification?.feed_id?.id}`);
          break;
        case "comments":
          setHref(`/p/${notification?.feed_id?.id}`);
          break;
        case "feed":
          setHref(`/p/${notification?.feed_id?.id}`);
          break;
        default:
          setHref(``);
          break;
      }
      setLoading(false);
    }
    fetchData();
  }, [notification]);

  async function handleClickNoti() {
    const { data, error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notification?.id);
    setIndicator(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Đang chuyển hướng");
      window.location.href = `${href}`;
    }
  }

  return (
    <Suspense fallback={<></>}>
      <div className="group">
        <div className="group-hover:bg-trans-black-10 relative flex flex-col items-start gap-2 p-4 transition-all duration-300">
          <div className="flex items-start gap-2 self-stretch">
            <div className="avatar relative flex h-10 w-10 flex-col self-stretch">
              <Avatar
                user={(notification?.user_id as Profile) ?? null}
                notification={notification}
              />
            </div>
            <div
              className="flex flex-1 cursor-pointer flex-col items-start justify-center"
              onClick={handleClickNoti}
            >
              <BaseText
                text={notification?.user_id?.display_name ?? "username"}
                className="sz-parag-semi"
                textColor="neutral-900"
              />
              <BaseText
                text={`${
                  notification?.type == "user_follows"
                    ? "Đã theo dõi bạn"
                    : notification?.type == "feed_engagement"
                      ? notification?.state === ReactionState.LIKE
                        ? "Đã thích bài viết của bạn"
                        : "Đã không thích bài viết của bạn"
                      : notification?.type == "comment_engagement"
                        ? notification?.state === ReactionState.LIKE
                          ? "Đã thích thảo luận của bạn"
                          : "Đã không thích thảo luận của bạn"
                        : notification?.type == "comments"
                          ? notification?.type == "comments" &&
                            notification?.feed_id?.parent_id
                            ? "Đã thảo luận trong bình luận của bạn"
                            : "Đã thảo luận trong bài viết của bạn"
                          : notification?.type == "feed"
                            ? "Đã đăng tải bài viết mới"
                            : ""
                }`}
                className="sz-parag-reg"
                textColor="neutral-900"
              />
              <BaseText
                created_at={
                  notification ? new Date(notification.created_at) : undefined
                }
                text={""}
                className="sz-label-s-reg"
                textColor="neutral-500"
              />
            </div>

            <DropdownMenuComponent
              iconTrigger="dots"
              notification={true}
              notificationData={notification}
              className="group-hover:bg-white"
            />
          </div>

          <div className="flex w-full items-start pl-12">
            {!loading && !following_user && (
              <FollowButton
                userId={notification?.user_noti_id as string}
                followingId={notification?.user_id?.id as string}
                followingState={false}
              />
            )}
          </div>

          {!notification?.read && indicator && (
            <div className="absolute left-[6px] top-[29px] h-4 w-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="4"
                height="15"
                viewBox="0 0 4 15"
                fill="none"
              >
                <rect width="4" height="15" rx="2" fill="#0F172A" />
              </svg>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-start rounded-full px-4">
        <div className="bg-trans-black-10 flex h-[1px] flex-1"></div>
      </div>
    </Suspense>
  );
};
export { NotiDetail };
