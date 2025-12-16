"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  cn,
} from "@suzu/ui";
import { Comment, MainNavbar, Notifications } from "./content";

import { Feed } from "./content/feed";
import { BaseIconBTN } from "@/components/master-layout";
import { useState } from "react";
import { ForYou } from "./content/for-you";
import { useMediaQuery } from "node_modules/@suzu/ui/src/components/hooks";

export type DropdownTrigger = "menu" | "dots" | "arrowDown";

const DropdownMenuComponent = ({
  iconTrigger,
  feed,
  user,
  comments,
  notification,
  notificationData,
  forYou,
  session,
  className
}: {
  iconTrigger: DropdownTrigger;
  feed?: Feed_Detail;
  user?: Profile | Session;
  comments?: boolean;
  notification?: boolean;
  forYou?: boolean;
  notificationData?: Notifications_Detail;
  session?: Session;
  className?: string
}) => {
  const [open, setOpen] = useState(false);

  const { isMobile } = useMediaQuery();

  return (
    <DropdownMenu onOpenChange={(open) => setOpen(open)}>
      <DropdownMenuTrigger
        className={cn("hover:bg-trans-black-5 rounded-full flex items-center justify-center border-none p-2 transition-all duration-300 hover:rounded-full focus:border-none",
          { "bg-trans-black-5 rounded-full": open },
          className
        )}
      >
        {iconTrigger === "menu" && (
          <BaseIconBTN
            src="/assets/icons-32/menu.png"
            width={isMobile ? 24 : 32}
            height={isMobile ? 24 : 32}
            className="sm:p-2"
          />
        )}
        {iconTrigger === "arrowDown" && (
          <BaseIconBTN
            src="/assets/icons-24/arrow-drop-down.png"
            width={24}
            height={24}
          />
        )}
        {iconTrigger === "dots" && (
          <BaseIconBTN
            src="/assets/icons/dots-icon-24.png"
            width={24}
            height={24}
            className="w-6"
          />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56 shadow-xl sm:mr-0 mr-2">
        {iconTrigger === "menu" ? (
          <MainNavbar user={user as Profile} />
        ) : iconTrigger === "dots" &&
          comments === false &&
          notification === false ? (
          <Feed
            user={user as Profile}
            userFeed={feed?.user_id?.id}
            feed={feed}
            session={session}
          />
        ) : iconTrigger === "dots" && comments === true ? (
          <Comment userFeed={feed?.user_id?.id} user={user} feed={feed} />
        ) : iconTrigger === "dots" && notification === true ? (
          <Notifications
            user={user}
            feed={feed}
            notificationData={notificationData}
          />
        ) : iconTrigger === "arrowDown" && forYou === true ? (
          <ForYou />
        ) : (
          ""
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownMenuComponent;
