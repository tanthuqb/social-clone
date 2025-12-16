import {
  BaseController,
  ControllerResponse,
  ResponseStatus,
} from "@/lib/base/controller";
import { UserProvider } from "./user.provider";
import { Provider } from "@supabase/supabase-js";

export class UserController extends BaseController<UserProvider> {
  constructor() {
    super(new UserProvider());
  }

  async checkUser(): Promise<ControllerResponse<any>> {
    const { error } = await this.provider.checkToken();
    if (error) {
      return {
        status: Number(error) || ResponseStatus.Unauthorized,
        message: error.message,
      };
    }
    return {
      status: ResponseStatus.Success,
    };
  }

  async getUser(): Promise<ControllerResponse<any>> {
    const { error, data } = await this.provider.getUser();
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

  async signInWithPassword(
    body: {
      email: string;
      password: string;
    },
    id?: string,
  ): Promise<ControllerResponse<any>> {
    const { error, data } = await this.provider.signInWithPassword(body);
    if (error) {
      return {
        status: Number(error.code) || ResponseStatus.Unauthorized,
        message: error.message,
      };
    }
    if (!error) {
      const { error: profileError, data: dataProfile } =
        await this.provider.getUser();
      if (profileError) {
        return {
          status: Number(profileError.code) || ResponseStatus.Unauthorized,
          message: profileError.message,
        };
      }
    }
    return {
      status: ResponseStatus.Success,
      result: data,
    };
  }

  async signInWithOAuth(
    provider: Provider,
    redirectTo: string,
  ): Promise<ControllerResponse<any>> {
    const { error, data } = await this.provider.signInWithOAuth(
      provider,
      redirectTo,
    );
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

  async signOut(): Promise<ControllerResponse<undefined>> {
    const { error } = await this.provider.signOut();
    if (error) {
      return {
        status: Number(error.code) || ResponseStatus.BadRequest,
        message: error.message,
      };
    }
    return {
      status: ResponseStatus.Success,
    };
  }
}
