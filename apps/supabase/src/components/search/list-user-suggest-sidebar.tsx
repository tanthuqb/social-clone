"use client";
import Link from "next/link";
import { Avatar } from "../shared/avatar";
import { BaseIconBTN, BaseUserInfo } from "../master-layout";
import { FollowButton } from "../userFollows/follow-btn";
import { LoadingSpinner, PlusFollowIcon, ScrollArea, cn } from "@suzu/ui";
import { BaseText } from "../master-layout/base-text";

type ListUserSuggestProps = {
  searchUser: UserFeatured[];
  profile: Profile | null;
  session: Session;
  isLoading?: boolean;
};

const ListUserSuggestSidebar = ({
  searchUser,
  profile,
  session,
  isLoading,
}: ListUserSuggestProps) => {
  return (
    <ScrollArea
      className={cn(
        "border-l-trans-black-10 h-custom bg-trans-neutral-60 relative flex flex-1 flex-col items-start self-stretch overflow-hidden border-l-[1px] sm:ml-[82px]",
      )}
    >
      {searchUser &&
        searchUser?.map((user: UserFeatured, index: number) => {
          return (
            <div
              className="item-start flex gap-2 self-stretch rounded-[16px] p-4"
              key={index}
            >
              <Link
                href={`/u/${user?.full_name}`}
                className="flex flex-1 items-start gap-2"
              >
                <div className="avatar relative flex h-10 w-10 flex-col self-stretch">
                  <Avatar
                    // @ts-ignore
                    user={user}
                    session={session}
                    type="search"
                  />
                  {/* <div className="absolute -bottom-0.5 -right-0.5 flex flex-col items-start rounded-full border-[2px] border-[#fff] bg-slate-50 p-0.5">
                    <div className="flex flex-col items-center justify-center w-full h-full">
                      <PlusFollowIcon />
                    </div>
                  </div> */}
                </div>
                <div className="user-info flex flex-1 flex-col items-start justify-center">
                  <BaseUserInfo
                    displayName={user?.display_name!}
                    username={user?.full_name!}
                    message={`${user?.countFollowing!} người theo dõi`}
                  />
                </div>
              </Link>

              <div className="flex flex-col items-start">
                {!user?.user_follower?.following_id && (
                  <FollowButton
                    userId={profile?.id!}
                    followingId={user?.user_follower?.following_id! || user?.id}
                    followingState={
                      user?.user_follower?.following_id ? true : false
                    }
                  />
                )}
              </div>
            </div>
          );
        })}

      {/* Check lại điều kiện: Khi user bấm vào input => ktra nếu k có kq mới hiện phần này */}
      {!isLoading && (
        <div className="absolute bottom-96 left-40">
          <LoadingSpinner />
        </div>
      )}

      {searchUser?.length === 0 && isLoading ? (
        <>
          <div className="mr-5 mt-64 flex items-center justify-center">
            <div className="">
              <div className="flex flex-col items-center justify-center">
                <BaseIconBTN
                  src="/assets/icons-104/search-off.png"
                  alt="search-off"
                  width={104}
                  height={104}
                />
              </div>
              <BaseText
                text={
                  "Nội dung bạn đang kiếm không tồn tại, hãy thử từ khoá khác nhé"
                }
                className="sz-label-m-reg p-3 text-center"
                textColor="neutral-500"
              />
            </div>
          </div>
        </>
      ) : (
        ""
      )}
    </ScrollArea>
  );
};

export { ListUserSuggestSidebar };
