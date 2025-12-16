import {
  BaseController,
  ControllerResponse,
  ResponseStatus,
} from "@/lib/base/controller";
import { BaseProvider } from "@/lib/base/provider";
import { Provider } from "@supabase/supabase-js";

class TestProvider extends BaseProvider {
  constructor() {
    super("profile");
  }
  async getUser() {
    return await this.auth.getUser();
  }

  async signInWithPassword(body: { email: string; password: string }) {
    return await this.auth.signInWithPassword(body);
  }

  async signInWithOAuth(provider: Provider, redirectTo: string) {
    return await this.auth.signInWithOAuth({
      provider,
      options: {
        skipBrowserRedirect: true,
        redirectTo: redirectTo,
      },
    });
  }

  async signOut() {}
}

export class TestController extends BaseController<TestProvider> {
  constructor() {
    super(new TestProvider());
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
  async signOut() {}
}
