"use client";

import { BackButton } from "@/components/master-layout/button/back-button";
import { BaseText } from "@/components/master-layout/base-text";
import DropdownMenuComponent from "../../dropdownMenu/dropdown-menu";

interface HeaderSectionCommonProps {
  text: string;
  session?: Session;
  user?: Profile;
  feed: Feed_Detail;
}

const HeaderCommonIcon = ({
  text,
  session,
  user,
  feed,
}: HeaderSectionCommonProps) => {
  return (
    <div
      className={`flex h-16 items-center justify-between bg-white py-2 pl-4 pr-2 backdrop-blur-sm sm:bg-neutral-100`}
    >
      <BackButton currentResource={`/`} />
      <div className="flex items-center justify-center gap-2.5">
        <BaseText
          text={text}
          className="sz-label-m-semi"
          textColor="neutral-700"
        />
      </div>

      <div className="flex-gap-2 items-center justify-center rounded-full">
        <DropdownMenuComponent
          iconTrigger={"dots"}
          comments={false}
          notification={false}
          user={user}
          session={session}
          feed={feed}
        />
      </div>
    </div>
  );
};

export { HeaderCommonIcon };
