"use client";

import { createClient } from "@/lib/supabase/client";
import { BaseText } from "../master-layout/base-text";
import { ListNotifications } from "./list-notifications";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import React from "react";
import { toast } from "@suzu/ui";
import { NotificationAction } from "@/modules/notifications/notifications.action";
type ContentDrawerProps = {
  user: Session;
};

const ContentDrawer = React.forwardRef<HTMLDivElement, ContentDrawerProps>(({ user }) => {
  const { notificationsArray, session } =  NotificationAction().GetNotifications(user);

  return (
    <div className="flex flex-col items-start w-full ">
      <div className="border-b-trans-black-10 border-l-trans-black-10 flex w-full sm:max-w-[390px] flex-col items-start gap-2 border-b-[1px] border-l-[1px] px-4 pb-4 pt-5 sm:ml-[82px]">
        {/* Header */}
        <div className="flex justify-center h-10">
          <div className="flex flex-col items-start justify-center gap-2.5">
            <BaseText
              text={"Thông báo"}
              textColor="neutral-700"
              className="sz-text-h5-semi"
            />
          </div>
        </div>
      </div>

      {/* List notifications */}
      <ListNotifications notifications={notificationsArray!} session={session!} />

    </div>
  );
})

export { ContentDrawer };
