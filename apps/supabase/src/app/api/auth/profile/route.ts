import { UserController } from "@/modules/user/user.controller";
import { NextResponse } from "next/server";

export async function GET() {
  const controller = new UserController();
  const result = await controller.getUser();
  return NextResponse.json(result);
}
