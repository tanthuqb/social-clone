import { BaseProvider } from "@/lib/base/provider";
import { ReactionState } from "@/lib/supabase/database.types";
export class FeedEngagementProvider extends BaseProvider {
  constructor() {
    super("feed_engagement");
  }

  async findAll() {
    return await (await this.database()).select("*");
  }

  async findOne(feedId: string) {
    return await (await this.database()).select().eq("feedId", feedId);
  }

  async create(body: { userId: string; feedId: string; state: ReactionState }) {
    return await (await this.database()).insert(body);
  }

  async update(id: string, body: { content: string }) {
    return await (await this.database()).update({ id, body });
  }

  async delete(id: string) {
    return await (await this.database()).delete().eq("id", id);
  }
}
