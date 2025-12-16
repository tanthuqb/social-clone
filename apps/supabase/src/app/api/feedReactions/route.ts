import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createFeedReaction,
  deleteFeedReaction,
  updateFeedReaction,
} from "@/lib/api/feedEngagements/mutations";
import {
  feedReactionIdSchema,
  insertFeedReactionParams,
  updateFeedReactionParams,
} from "@/lib/db/schema/feedReactions";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const validatedData = insertFeedReactionParams.parse(await req.json());
    const { feedReaction } = await createFeedReaction(validatedData);

    revalidatePath("/feedReactions"); // optional - assumes you will have named route same as entity

    return NextResponse.json(feedReaction, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json({ error: err }, { status: 500 });
    }
  }
}

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const validatedData = updateFeedReactionParams.parse(await req.json());
    const validatedParams = feedReactionIdSchema.parse({ id });

    const { feedReaction } = await updateFeedReaction(
      validatedParams.id,
      validatedData,
    );

    return NextResponse.json(feedReaction, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const validatedParams = feedReactionIdSchema.parse({ id });
    const { feedReaction } = await deleteFeedReaction(validatedParams.id);

    return NextResponse.json(feedReaction, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}

export async function GET(req: Request) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const {data : session} = await supabase.auth.getUser();
    const { data: feedReaction } = await supabase
        .from("feed_engagement")
        .select("*,user_id!left(*)")
        .eq("feed_id", id)
        .eq("user_id", session?.user?.id as string)
        .maybeSingle();
    return NextResponse.json(feedReaction, { status: 200 });
  } catch (err) {
      return NextResponse.json(err, { status: 500 });
    
  }
}
