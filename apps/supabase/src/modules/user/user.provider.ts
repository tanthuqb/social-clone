import { BaseProvider } from "@/lib/base/provider";
import { Provider } from "@supabase/supabase-js";

export class UserProvider extends BaseProvider {
  constructor() {
    super("profile");
  }
  async getUser() {
    return await (await this.auth()).getUser();
  }

  async signInWithPassword(body: { email: string; password: string }) {
    return await (await this.auth()).signInWithPassword(body);
  }

  async signInWithOAuth(provider: Provider, redirectTo: string) {
    return await (await this.auth()).signInWithOAuth({
      provider,
      options: {
        skipBrowserRedirect: true,
        redirectTo: redirectTo,
      },
    });
  }

  async signOut() {
    return await (await this.auth()).signOut();
  }

  async checkToken() {
    return await (await this.auth()).getSession();
  }
}
