"use client";

import { BaseText } from "@/components/master-layout/base-text";
import { BackButton, cn } from "@suzu/ui";
import { ContentDrawer } from "@/components/search/content-drawer";

interface HeaderSectionCommonProps {
  text: string;
  session: Session;
  profile: Profile;
  searchData: Profile[];
}

const HeaderSectionSearch = ({
  text,
  session,
  profile,
  searchData,
}: HeaderSectionCommonProps) => {
  return (
    <div className="">
      {searchData?.length > 0 ? (
        <div
          className={cn(
            "flex h-16 items-center justify-between py-2 pl-4 pr-2",
          )}
        >
          <BackButton currentResource={`/`} />
          <div className="flex items-center justify-center gap-2.5">
            <BaseText
              text={text}
              className="sz-label-m-semi"
              textColor="neutral-700"
            />
          </div>
          <div className="w-10 opacity-0"></div>
        </div>
      ) : (
        <ContentDrawer user={session} profile={profile} />
      )}
    </div>
  );
};

export { HeaderSectionSearch };
