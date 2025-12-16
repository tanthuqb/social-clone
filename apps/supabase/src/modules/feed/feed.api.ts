import { NextRequest, NextResponse } from "next/server";
import { FeedController } from "./feed.controller";
import { revalidatePath } from "next/cache";

const revalidateFeed = () => revalidatePath("/");
export const Feed_API = () => {
  const controller = new FeedController();
  async function GetFeeds(request: NextRequest) {
    const result = await controller.findAll();
    revalidateFeed();
    return NextResponse.json(result);
  }

  async function GetFeedById(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const feedId = searchParams.get("feedId");
    const result = await controller.find(feedId!);
    revalidateFeed();
    return NextResponse.json(result);
  }

  async function CreateFeed(request: NextRequest) {
    const body = await request.json();
    const result = await controller.create(body);
    revalidateFeed();
    return NextResponse.json(result);
  }

  async function UpdateFeed(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const feedId = searchParams.get("feedId");
    const body = await request.json();
    const result = await controller.update(feedId!, body);
    revalidateFeed();
    return NextResponse.json(result);
  }

  return {
    GetFeeds,
    GetFeedById,
    CreateFeed,
    UpdateFeed,
  };
};
