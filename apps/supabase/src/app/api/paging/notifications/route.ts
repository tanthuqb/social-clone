import { Notification_API } from "@/modules/notifications/notifications.api";
import { NextRequest } from "next/server";

export const GET =  (req: NextRequest) => Notification_API().PagingNotifications(req);