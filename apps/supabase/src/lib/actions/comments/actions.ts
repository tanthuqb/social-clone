import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createComment,
  deleteComment,
  updateComment,
} from "@/lib/api/comments/mutations";
import { 
  NewComment,
  NewCommentParams,
  UpdateCommentParams,
  commentIdSchema,
  insertCommentParams,
  updateCommentParams 
} from "@/lib/db/schema/comments";
import { getCommentByFeedId } from "@/lib/api/comments/queries";

export async function POST(req: Request) {
  try {
    const validatedData = insertCommentParams.parse(await req.json());
    const { comment } = await createComment(validatedData);

    revalidatePath("/comments"); // optional - assumes you will have named route same as entity

    return NextResponse.json(comment, { status: 201 });
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

    const validatedData = updateCommentParams.parse(await req.json());
    const validatedParams = commentIdSchema.parse({ id });

    const { comment } = await updateComment(validatedParams.id, validatedData);

    return NextResponse.json(comment, { status: 200 });
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

    const validatedParams = commentIdSchema.parse({ id });
    const { comment } = await deleteComment(validatedParams.id);

    return NextResponse.json(comment, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}


export const updateCommentAction = async (input: UpdateCommentParams) => {
  try {
      const payload = updateCommentParams.parse(input);
      const { comment } = await updateComment(input.id, input);
      // revalidatePath("/");
      return { comment, error: null };
  } catch (e) {
      return handleErrors(e);
  }
};

export const insertCommentAction = async (input: NewCommentParams) => {
  try {
      const payload = insertCommentParams.parse(input);
      const { comment , error } = await createComment(payload);
      // revalidatePath("/");
      return { comment:  comment, error: error };
  } catch (e) {
      return handleErrors(e);
  }
};

export const getFullCommentWithFeedIdAction = async ( offset: number, limit: number , feedId: Feed['id']) => {
  try {
      const { commentUser , totalComments  } = await getCommentByFeedId(offset, limit, feedId );
      return { commentUser: commentUser, totalComments: totalComments };
  } catch (error) {
      return { error: error };
  }
}