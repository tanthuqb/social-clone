"use client";

import { BaseText } from "@/components/master-layout/base-text";
import DropdownMenuComponent from "../../dropdownMenu/dropdown-menu";
import { useMediaQuery } from "node_modules/@suzu/ui/src/components/hooks";
import { BaseIconBTN } from "@/components/master-layout";
import { BackButton } from "@/components/master-layout/button/back-button";
import { cn } from "@suzu/ui";

interface HeaderSectionCommonProps {
  text: string;
  session: Session;
  user: Profile;
}

const HeaderSectionCommon = ({
  text,
  session,
  user,
}: HeaderSectionCommonProps) => {
  const isMe = session?.user?.id === user?.id;
  const { isMobile } = useMediaQuery();
  if (isMobile) {
    if (isMe) {
      return (
        <div
          className={`flex h-16 items-center justify-between bg-white py-2 pl-4 pr-2`}
        >
          {/* Logo */}
          <div className="hover:bg-trans-black-5 cursor-pointer p-0 transition-all duration-300 hover:rounded-full sm:p-3">
            <a href="/">
              <BaseIconBTN
                src={"/assets/img_logo.png"}
                alt=""
                width={40}
                height={40}
              />
            </a>
          </div>

          <div className="flex-gap-2 items-center justify-center rounded-full">
            <DropdownMenuComponent
              iconTrigger={"menu"}
              comments={false}
              notification={false}
              user={user}
              session={session}
            />
          </div>
        </div>
      );
    }
    // Guest
    return <UserWithIcon text={text} className="bg-white" />;
  }
  // Desktop
  return <UserWithIcon text={text} isMe={isMe} />;
};

export { HeaderSectionCommon };

function UserWithIcon({
  text,
  isMe,
  className,
}: {
  text: string;
  isMe?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-16 items-center justify-between py-2 pl-4 pr-2",
        className,
        {
          "justify-center": isMe,
        },
      )}
    >
      {!isMe && <BackButton currentResource={`/`} />}
      <div className="flex items-center justify-center gap-2.5">
        <BaseText
          text={text}
          className="sz-label-m-semi"
          textColor="neutral-700"
        />
      </div>
      <div className="w-10 opacity-0"></div>
    </div>
  );
}
