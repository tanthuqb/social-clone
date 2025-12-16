import { Notification_API } from "@/modules/notifications/notifications.api";
import { NextRequest } from "next/server";

export const GET =  (req: NextRequest) => Notification_API().GetNotifications(req);

export const PUT = (req: NextRequest) => Notification_API().UpdateStatusNotifications(req);