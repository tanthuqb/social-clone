import { createClient } from "@/lib/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";

export class BaseProvider {
  private supabase: SupabaseClient<Database, "public", any>;
  protected dbName?: string = undefined;
  constructor(databaseName?: string) {
    this.supabase = createClient();
    this.dbName = databaseName;
  }
  protected get auth() {
    return this.supabase.auth;
  }

  protected get database() {
    if (!this.dbName) {
      throw Error("DATABASE_EMPTY: " + this.constructor.name);
    }
    return this.supabase.from(this.dbName || "profile");
  }
}
