import { NextRequest, NextResponse } from "next/server";
import { NotificationsController } from "./notifications.controller";
import { revalidatePath } from "next/cache";
const revalidateNotificationsReactions = () => revalidatePath("/notifications");
export const Notification_API = () => {
    const controller = new NotificationsController();
    async function GetNotifications(request: NextRequest) {
        const { searchParams} = new URL(request.url)
        const userId = searchParams.get('userId')
        const result = await controller.GetNotifications(userId!);
        revalidateNotificationsReactions();
        return NextResponse.json(result);
    }
    async function UpdateStatusNotifications(request: NextRequest){
        const { searchParams } = new URL(request.url)
        const notificationId = searchParams.get('notificationId')
        const result = await controller.UpdateStatusNotifications(notificationId!);
        revalidateNotificationsReactions();
        return NextResponse.json(result);
    }
    async function PagingNotifications(request: NextRequest){
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')
        const start = parseInt(searchParams.get('start')!,10)
        const end = parseInt(searchParams.get('end')!,10)
        const result = await controller.PagingNotifications(userId!,start!,end!);
        revalidateNotificationsReactions();
        return NextResponse.json(result);
    }
    return { GetNotifications, UpdateStatusNotifications, PagingNotifications};
}