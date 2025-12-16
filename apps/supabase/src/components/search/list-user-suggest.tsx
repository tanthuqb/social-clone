"use client";
import Link from "next/link";
import { Avatar } from "../shared/avatar";
import { BaseIconBTN, BaseUserInfo } from "../master-layout";
import { FollowButton } from "../userFollows/follow-btn";
import { PlusFollowIcon, ScrollArea } from "@suzu/ui";
import { BaseText } from "../master-layout/base-text";

type ListUserSuggestProps = {
  searchUser: UserFeatured[];
  profile: Profile | null;
};

const ListUserSuggest = ({ searchUser, profile }: ListUserSuggestProps) => {

  return (
    <ScrollArea className="flex flex-col items-start self-stretch flex-1 overflow-auto">
      {
        searchUser && searchUser.map((user: UserFeatured, index: number) => {
          return (
            <div
              className="item-start flex gap-2 self-stretch rounded-[16px] p-4"
              key={index}
            >
              <Link
                href={`/u/${user?.full_name}`}
                className="flex items-start flex-1 gap-2"
              >
                <div className="relative flex flex-col self-stretch w-10 h-10 avatar">
                  <Avatar
                    // @ts-ignore
                    user={user}
                    session={undefined}
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 flex flex-col items-start rounded-full border-[2px] border-[#fff] bg-slate-50 p-0.5">
                    <div className="flex flex-col items-center justify-center w-full h-full">
                      <PlusFollowIcon />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-start justify-center flex-1 user-info">
                  <BaseUserInfo
                    displayName={user?.display_name!}
                    username={user?.full_name!}
                    message={`${user?.countFollowing!} người theo dõi`}
                  />
                </div>
              </Link>

              <div className="flex flex-col items-start">
                {!user?.user_follower?.following_id &&
                  <FollowButton userId={profile?.id!} followingId={user?.id!} followingState={user?.user_follower?.following_id ? true : false} />
                }
              </div>
            </div>
          )
        })
      }
      { /** thêm cái ref vào cho khi nhìn thấy nó scroll chỉnh lại đẹp chút  */}
      {/* <div ref={ref}></div> */}

      {/* Check lại điều kiện: Khi user bấm vào input => ktra nếu k có kq mới hiện phần này */}
      {searchUser?.length === 0 ? (
        <div className="flex items-center justify-center mr-10 mt-36">
          <div className="">
            <div className="ml-[82px] flex flex-col items-center justify-center">
              <BaseIconBTN
                src="/assets/icons-104/search-off.png"
                alt="search-off"
                width={104}
                height={104}
              />
            </div>
            <BaseText
              text={"Nội dung bạn đang kiếm không tồn tại, hãy thử từ khoá khác nhé"}
              className="sz-label-m-reg ml-[82px] p-3 text-center"
              textColor="neutral-500"
            />
          </div>
        </div>
      ) : ""}

    </ScrollArea>

  );
};

export { ListUserSuggest };