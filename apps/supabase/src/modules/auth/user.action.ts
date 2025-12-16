import { BaseProvider } from "@/lib/base/provider";
import { Provider } from "@supabase/supabase-js";

export class CommentProvider extends BaseProvider {
  constructor() {
    super("comment");
  }
}
