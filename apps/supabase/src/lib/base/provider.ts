import { createClient } from "@/lib/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";

export class BaseProvider {
  private supabasePromise: Promise<SupabaseClient<Database, "public", any>>;
  protected dbName?: string = undefined;
  constructor(databaseName?: string) {
    this.supabasePromise = createClient();
    this.dbName = databaseName;
  }
  protected async auth() {
    const supabase = await this.supabasePromise;
    return supabase.auth;
  }

  protected async database() {
    if (!this.dbName) {
      throw Error("DATABASE_EMPTY: " + this.constructor.name);
    }
    const supabase = await this.supabasePromise;
    return supabase.from(this.dbName || "profile");
  }
}
