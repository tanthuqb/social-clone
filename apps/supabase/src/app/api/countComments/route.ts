import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getCommentByFeedId, getCountCommentsById } from "@/lib/api/comments/queries";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const feedId = searchParams.get("feed_id");
        const count = await getCountCommentsById(feedId!);
        
        return NextResponse.json(count, { status: 200 });
      } catch (err) {
        if (err instanceof z.ZodError) {
          return NextResponse.json({ error: err.issues }, { status: 400 });
        } else {
          return NextResponse.json(err, { status: 500 });
        }
      }
}