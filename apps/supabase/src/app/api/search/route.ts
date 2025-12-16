import { createClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";
import _ from 'lodash';
export async function GET(req: NextRequest, res: NextResponse) {
  const supabase = createClient();
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");
  const offset = parseInt(searchParams.get("offset")!);
  const limit = parseInt(searchParams.get("limit")!);
  try {
    let { data, error } = await supabase.from("profiles")
    .select("*")
    .textSearch("display_name", search!, {
      type: "websearch",
      config: "english"
    })
    let feedList = [] as any; 
    await Promise.all(data!.map(async (element) => {
      const {data: feeds } = await supabase.from("feeds")
      .select("*,feed_images(*),user_id!left(*)")
      .eq("user_id", element.id)
      .eq("type", "feed")
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false });
      feedList.push(...feeds!);
  }));
    if (error) {
      return NextResponse.json(error, { status: 500 });
    }
    return NextResponse.json(feedList, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
 
  
}
