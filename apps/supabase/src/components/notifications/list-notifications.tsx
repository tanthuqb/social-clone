"use client";
import { LoadingSpinner, ScrollArea } from "@suzu/ui";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { NotiDetail } from "./noti-detail";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRealtimeTable } from "@/hooks/useRealtimeTable";
import { BaseText } from "@/components/master-layout/base-text";
import { BaseIconBTN } from "@/components/master-layout";
import { NotificationAction } from "@/modules/notifications/notifications.action";

type UserNotiProps = {
  notifications: Notifications_Detail[];
  session: Session;
  PAGECOUNT?: number;
};
export const ListNotifications = ({
  notifications,
  session,
}: UserNotiProps) => {
  const router = useRouter();
  const supabase = createClient();
  const { datas, setData, scrollTrigger, loading } = NotificationAction().PagingNotifications(session,notifications);

  // New notifications for this user appear live at the top of the list.
  useRealtimeTable({
    table: "notifications",
    event: "INSERT",
    filter: `user_noti_id=eq.${session?.user?.id ?? "00000000-0000-0000-0000-000000000000"}`,
    onChange: async (payload: any) => {
      const id = payload?.new?.id;
      if (!id || payload?.new?.user_id === session?.user?.id) return;
      const { data } = await supabase
        .from("notifications")
        .select("*,user_id!left(*),feed_id!left(*),comment_id!left(*)")
        .eq("id", id)
        .maybeSingle();
      if (!data) return;
      setData((prev: any) =>
        prev?.some((noti: any) => noti?.id === id) ? prev : [data, ...(prev ?? [])],
      );
    },
  });

  useRealtimeTable({
    table: "notifications",
    event: "DELETE",
    onChange: (payload: any) => {
      setData(
        (prev: any) =>
          prev?.filter((noti: any) => noti?.id !== payload.old.id) || [],
      );
      router.refresh();
    },
  });
  return (
    <ScrollArea className="border-l-trans-black-10 h-custom relative flex flex-1 flex-col items-start self-stretch overflow-hidden border-l sm:ml-[82px]">
      {datas?.map((notification: Notifications_Detail) => {
        return (
          <NotiDetail
            notification={notification}
            key={notification?.id}
            session={session}
          />
        );
      })}

      {loading == true ? (
        <div className="absolute bottom-96 left-40">
          <LoadingSpinner />
        </div>
      )
        : datas?.length == 0 && (
          <div className="fixed inset-0 flex items-center justify-center">
            <div className="">
              <div className="sm:ml-[82px] flex flex-col items-center justify-center">
                <BaseIconBTN
                  src="/assets/icons-104/notifications-paused.png"
                  alt="notifications-paused"
                  width={104}
                  height={104}
                />
              </div>
              <BaseText
                text={"No notifications yet"}
                className="sz-label-m-reg sm:ml-[82px] p-3 text-center"
                textColor="neutral-500"
              />
            </div>
          </div>
        )}

      <div
        className="flex justify-center gap-2 py-4 pb-20 md:pb-0"
        ref={scrollTrigger}
      >
      </div>
    </ScrollArea >
  );
};
