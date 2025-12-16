"use client";

import { BackButton } from "@/components/master-layout/button/back-button";
import { BaseText } from "@/components/master-layout/base-text";
import { useMediaQuery } from "node_modules/@suzu/ui/src/components/hooks";

interface HeaderSectionCommonProps {
  text: string;
}

const HeaderCommonSettings = ({ text }: HeaderSectionCommonProps) => {
  const { isMobile } = useMediaQuery();

  return (
    <div
      className={`flex h-14 items-center bg-white sm:h-16 sm:bg-neutral-100 ${isMobile ? "justify-between" : "justify-center"} px-2 py-2`}
    >
      {isMobile && <BackButton currentResource={`/`} />}
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
};

export { HeaderCommonSettings };
