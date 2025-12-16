import { BaseProvider } from "@/lib/base/provider";

export class NotificationsProvider extends BaseProvider {
    constructor() {
        super("notifications");
      }
      async find(userId:string) {
        return await this.database.select("*,user_id!left(*),comment_id!left(*),feed_id!left(*)")
        .eq("user_noti_id", userId)
        .neq("user_id", userId)
        .order("created_at", { ascending: false })
      }
      async update(notificationId:string) {
        return this.database
        .update({ status: true })
        .eq("id", notificationId)
        .single()
      }
      async paging(userId:string, start:number, end:number){
        return this.database
        .select("*,user_id!left(*),feed_id!left(*),comment_id!left(*)")
        .eq("user_noti_id", userId)
        .neq("user_id", userId)
        .order("created_at", { ascending: false })
        .range(start, end);
      }
}
