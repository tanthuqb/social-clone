import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createCommentReaction,
  deleteCommentReaction,
  updateCommentReaction,
} from "@/lib/api/commentEngagements/mutations";
import { 
  commentReactionIdSchema,
  insertCommentReactionParams,
  updateCommentReactionParams 
} from "@/lib/db/schema/commentReactions";

export async function POST(req: Request) {
  try {
    const validatedData = insertCommentReactionParams.parse(await req.json());
    const { commentReaction } = await createCommentReaction(validatedData);

    revalidatePath("/commentReactions"); // optional - assumes you will have named route same as entity

    return NextResponse.json(commentReaction, { status: 201 });
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

    const validatedData = updateCommentReactionParams.parse(await req.json());
    const validatedParams = commentReactionIdSchema.parse({ id });

    const { commentReaction } = await updateCommentReaction(validatedParams.id, validatedData);

    return NextResponse.json(commentReaction, { status: 200 });
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

    const validatedParams = commentReactionIdSchema.parse({ id });
    const { commentReaction } = await deleteCommentReaction(validatedParams.id);

    return NextResponse.json(commentReaction, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
