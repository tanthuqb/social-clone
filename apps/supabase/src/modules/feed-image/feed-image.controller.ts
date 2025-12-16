import {
  BaseController,
  ControllerResponse,
  ResponseStatus,
} from "@/lib/base/controller";
import { FeedImageProvider } from "./feed-image.provider";

export class FeedImageController extends BaseController<FeedImageProvider> {
  constructor() {
    super(new FeedImageProvider());
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

  async findAll(): Promise<ControllerResponse<any>> {
    const { error, data } = await this.provider.findMany();
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
    feedId: string;
    content: string;
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
