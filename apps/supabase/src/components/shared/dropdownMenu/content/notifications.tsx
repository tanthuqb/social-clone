"use client";
import { DropdownMenuItem, DropdownMenuSeparator, cn, toast } from "@suzu/ui";
import Link from "next/link";
import {
  deleteNotificationAction,
  markNotificationReadAction,
} from "@/lib/actions/notifications/actions";
import { useState, useEffect } from "react";

function Notifications({
  feed,
  userFeed,
  notificationData,
}: {
  className?: string;
  user?: Session | Profile;
  feed?: Feed_Detail;
  userFeed?: Profile;
  notificationData?: any;
}) {
  const [href, setHref] = useState<string>("");
  useEffect(() => {
    switch (notificationData?.type) {
      case "user_follows":
        setHref(`/u/${notificationData?.user_id?.full_name ?? notificationData?.user_id?.id}`);
        break;
      case "feed_engagement":
        setHref(`/p/${notificationData?.feed_id?.id}`);
        break;
      case "comment_engagement":
        setHref(`/p/${notificationData?.feed_id?.id}`);
        break;
      case "comments":
        setHref(`/p/${notificationData?.feed_id?.id}`);
        break;
      default:
        break;
    }
  });
  const handleDeleteNoti = async () => {
    const { error } = await deleteNotificationAction(notificationData?.id);
    if (error) {
      toast.error(error);
    } else {
      toast.success("deleted successfully");
    }
  };
  const handleWatchNoti = async () => {
    const { error } = await markNotificationReadAction(notificationData?.id);
    if (error) {
      toast.error(error);
    } else {
      toast.success("update successfully");
    }
  };
  const handleErrorNoti = () => {
    // Show the report dialog
    console.log("error noti");
  };
  return (
    <>
      <Link href={`${href}`}>
        <DropdownMenuItem
          className="cursor-pointer text-[15px] text-[#0F172A]"
          onClick={() => handleWatchNoti()}
        >
          View notification
        </DropdownMenuItem>
      </Link>
      <DropdownMenuItem
        // @ts-ignore
        onClick={() => handleDeleteNoti(feed?.id!)}
        className="cursor-pointer text-[15px] text-[#0F172A]"
      >
        Delete notification
      </DropdownMenuItem>
      <DropdownMenuItem
        // @ts-ignore
        onClick={() => handleErrorNoti(feed?.id!)}
        className="cursor-pointer text-[15px] text-red-500 hover:text-red-500"
      >
        <span className="text-red-500 hover:text-red-500">Report</span>
      </DropdownMenuItem>
    </>
  );
}
export { Notifications };
