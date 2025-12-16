import {
  BaseController,
  ControllerResponse,
  ResponseStatus,
} from "@/lib/base/controller";
import { FeedEngagementProvider } from "./feed-engagement.provider";
import { ReactionState } from "@/lib/supabase/database.types";

export class FeedEngagementController extends BaseController<FeedEngagementProvider> {
  constructor() {
    super(new FeedEngagementProvider());
  }

  async findAll(): Promise<ControllerResponse<any>> {
    const { error, data } = await this.provider.findAll();
    if (error) {
      return {
        status: Number(error) || ResponseStatus.Unauthorized,
        message: error.message,
      };
    }
    return {
      status: ResponseStatus.Success,
      result: data,
    };
  }

  async find(feedId: string): Promise<ControllerResponse<any>> {
    const { error, data } = await this.provider.findOne(feedId);
    if (error) {
      return {
        status: Number(error) || ResponseStatus.Unauthorized,
        message: error.message,
      };
    }
    return {
      status: ResponseStatus.Success,
      result: data,
    };
  }

  async create(body: {
    userId: string;
    feedId: string;
    state: ReactionState;
  }): Promise<ControllerResponse<any>> {
    const { error, data } = await this.provider.create(body);
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

  async update(
    id: string,
    body: { content: string },
  ): Promise<ControllerResponse<any>> {
    const { error, data } = await this.provider.update(id, body);
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

  async delete(id: string): Promise<ControllerResponse<any>> {
    const { error, data } = await this.provider.delete(id);
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
