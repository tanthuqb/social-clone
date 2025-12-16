import { BaseController, ControllerResponse, ResponseStatus } from "@/lib/base/controller";
import { UserFollowProvider } from "./user-follow.provider";

export class UserFollowController extends BaseController<UserFollowProvider> {
    constructor() {
        super(new UserFollowProvider());
    }
    async CreateFollow(body: { userId: string; followId: string; }): Promise<ControllerResponse<any>>{
        const { data, error } = await this.provider.create(body);
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
    async UnFollow (userId: string,followId: string): Promise<ControllerResponse<any>>{
        const { data, error } = await this.provider.delete(userId,followId);
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
    async CountFollowers (userId: string) : Promise<ControllerResponse<any>>{
        const { count, error } = await this.provider.countFollower(userId);
        if (error) {
            return {
                status: Number(error.code) || ResponseStatus.Unauthorized,
                message: error.message,
            };
        }
        return {
            status: ResponseStatus.Success,
            result: count,
        };
    }
    async CountFollowing (userId: string) : Promise<ControllerResponse<any>>{
        const { count, error } = await this.provider.countFollowing(userId);
        if (error) {
            return {
                status: Number(error.code) || ResponseStatus.Unauthorized,
                message: error.message,
            };
        }
        return {
            status: ResponseStatus.Success,
            result: count,
        };
    }
    async FindFollow (userId: string,followId: string) : Promise<ControllerResponse<any>>{
        const { data, error } = await this.provider.findOne(userId,followId);
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