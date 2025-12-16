export const revalidate = 60

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
export async function GET(req: Request) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(req.url);
    const feedId = searchParams.get("ID");
    const { data: FeedReactionUser } = await supabase
        .from("feed_engagement")
        .select("*,user_id!left(*)")
        .eq("feed_id", feedId);
    return NextResponse.json(FeedReactionUser, { status: 200 });
  } catch (err) {
      return NextResponse.json(err, { status: 500 });
  }
}