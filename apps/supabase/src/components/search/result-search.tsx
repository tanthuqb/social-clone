"use client";
import { BaseIconBTN } from "../master-layout";
import { FeedList } from "../feeds/feed-list";
import { BaseText } from "../master-layout/base-text";
import { ScrollArea, cn } from "@suzu/ui";

const ResultSearch = ({
  searchParams,
  searchData,
  profile,
  session,
}: {
  searchData: Profile[];
  profile: Profile;
  session: Session;
  searchParams: string;
}) => {
  return (
    <ScrollArea
      className={cn(
        "sm:shadow-common-sm flex flex-col items-center overflow-hidden pb-5 sm:rounded-3xl sm:bg-neutral-50 sm:pb-0",
        {
          "h-custom": searchData?.length > 0,
          "h-full": searchData?.length === 0,
        },
      )}
    >
      <div className={cn("flex w-full flex-col items-center gap-4 sm:p-4")}>
        {searchData?.length === 0 ? (
          <>
            <div className="mr-10 mt-36 hidden items-center justify-center">
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
                  text={
                    "Nội dung bạn đang kiếm không tồn tại, hãy thử từ khoá khác nhé"
                  }
                  className="sz-label-m-reg ml-[82px] p-3 text-center"
                  textColor="neutral-500"
                />
              </div>
            </div>
          </>
        ) : (
          <FeedList
            type="search"
            inFeed
            user={profile}
            feeds={searchData!}
            session={session}
            searchParams={searchParams}
          />
        )}
      </div>
    </ScrollArea>
  );
};

export { ResultSearch };
