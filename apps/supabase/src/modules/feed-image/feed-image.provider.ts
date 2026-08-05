import { BaseProvider } from "@/lib/base/provider";

export class FeedImageProvider extends BaseProvider {
  constructor() {
    super("feed_images");
  }

  async findOne(feedId: string) {
    return await (await this.database()).select("*").eq("feedId", feedId);
  }

  async findMany() {
    return await (await this.database()).select("*");
  }

  async create(body: { feedId: string; content: string }) {
    return await (await this.database()).insert(body);
  }

  async update(id: string, body: { content: string }) {
    return await (await this.database()).update({ id, body });
  }

  async delete(id: string) {
    return await (await this.database()).delete().eq("id", id);
  }
}
