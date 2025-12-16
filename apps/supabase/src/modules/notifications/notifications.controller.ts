import {
    BaseController,
    ControllerResponse,
    ResponseStatus,
} from "@/lib/base/controller";
import { NotificationsProvider } from "./notifications.provider";

export class NotificationsController extends BaseController<NotificationsProvider> {
    constructor() {
        super(new NotificationsProvider());
    }
    async GetNotifications(userId: string): Promise<ControllerResponse<any>> {
        const { data, error } = await this.provider.find(userId);
        if (error) {
            return {
                status: Number(error.code) || ResponseStatus.Unauthorized,
                message: error.message,
            };
        }
        return {
            status: ResponseStatus.Success,
            result: data,
        };
    }
    async UpdateStatusNotifications(notificationId: string): Promise<ControllerResponse<any>> {
        const { data, error } = await this.provider.update(notificationId);
        if (error) {
            return {
                status: Number(error.code) || ResponseStatus.Unauthorized,
                message: error.message,
            };
        }
        return {
            status: ResponseStatus.Success,
            result: data,
        };
    }
    async PagingNotifications(userId: string, start: number, end: number): Promise<ControllerResponse<any>> {
        const { data, error } = await this.provider.paging(userId, start, end);
        if (error) {
            return {
                status: Number(error.code) || ResponseStatus.Unauthorized,
                message: error.message,
            };
        }
        return {
            status: ResponseStatus.Success,
            result: data,
        };
    }
}