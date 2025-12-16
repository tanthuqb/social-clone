import { NextRequest, NextResponse } from "next/server";
import { UserController } from "./user.controller";
import { BaseController, ResponseStatus } from "@/lib/base/controller";

export const User_API = () => {
  const controller = new UserController();

  async function withEmail(req: NextRequest) {
    const body = await req.json();
    const result = await controller.signInWithPassword(body);
    return NextResponse.json(result);
  }

  async function withOAuth(req: NextRequest) {
    const url = new URL(req.url);
    const { provider } = await req.json();
    if (!provider) {
      return NextResponse.json({
        status: ResponseStatus.NotAcceptable,
        messeger: "The provider not exist!",
      });
    }
    const result = await controller.signInWithOAuth(
      provider,
      url.origin + "/api/auth/callback",
    );

    return NextResponse.json(result);
  }

  return {
    withEmail,
    withOAuth,
  };
};
