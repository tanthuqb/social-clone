import { NextResponse, type NextRequest } from "next/server";
import { searchFeeds } from "@/lib/api/search/queries";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");
  const offset = Number.parseInt(searchParams.get("offset") ?? "0", 10) || 0;
  const limit = Math.min(
    Number.parseInt(searchParams.get("limit") ?? "10", 10) || 10,
    50,
  );
  try {
    const feeds = await searchFeeds(search, offset, limit);
    return NextResponse.json(feeds, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Search failed" },
      { status: 500 },
    );
  }
}
