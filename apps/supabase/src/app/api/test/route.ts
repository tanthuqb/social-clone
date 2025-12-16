import { NextRequest, NextResponse } from "next/server";
import { TestController } from "./test.controller";

export async function POST(req: NextRequest, res: NextResponse) {
  const controller = new TestController();
  const body = await req.json();
  const result = await controller.signInWithPassword(body);
  // const url = new URL(req.url);
  // const result = await controller.signInWithOAuth(
  //   "google",
  //   url.origin + "/api/auth/callback",
  // );

  // return NextResponse.json({
  //   ...result,
  //   domain: url.origin + "/api/auth/callback",
  // });
  return NextResponse.json(result);
}
