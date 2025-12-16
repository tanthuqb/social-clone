import { BaseProvider } from "@/lib/base/provider";

export class UserFollowProvider extends BaseProvider {
  constructor() {
    super("user_follows");
  }

  async findOne(userId: string, followId: string) {
    return await this.database.select().eq('user_id', userId).eq('following_id', followId).single();
  }


  async findAll(skip: number = 0, take: number = 10) {
    const { error: errorCount, count: total } = await this.database.select(
      "*",
      {
        count: "exact",
      },
    );

    if (errorCount) return { error: errorCount };

    const result = await this.database
      .select("*")
      .range(take * skip, (skip + 1) * take - 1);

    return { ...result, total };
  }

  async countFollower(user_id: string) {
    return await this.database.select(
      "*",
      {
        count: "exact",
      },
    ).eq('following_id', user_id);
  }

  async countFollowing(user_id: string) {
    return await this.database.select(
      "*",
      {
        count: "exact",
      },
    ).eq('user_id', user_id);
  }

  async create(body: { userId: string; followId: string }) {
    return await this.database.insert(body);
  }

  async delete(userId: string, followId: string) {
    return await this.database.delete().eq('user_id', userId).eq('following_id', followId);
  }
}
