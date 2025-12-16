import { BaseProvider } from "@/lib/base/provider";

export class FeedProvider extends BaseProvider {
  constructor() {
    super("feeds");
  }

  async findOne(feedId: string) {
    return await this.database.select().eq("feedId", feedId);
  }

  async findMany() {
    return await this.database.select("*");
  }

  async create(body: { userId: string; content: string }) {
    return await this.database.insert(body);
  }

  async update(id: string, body: { content: string }) {
    return await this.database.update({ id, body });
  }

  async delete(id: string) {
    return await this.database.delete().eq("id", id);
  }
}
