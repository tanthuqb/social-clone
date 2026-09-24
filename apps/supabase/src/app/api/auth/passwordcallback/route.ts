import { type NextRequest } from "next/server";
import { handleAuthCallback } from "@/lib/auth/callback";

// Password recovery link target: lands on the "set a new password" page.
export async function GET(request: NextRequest) {
  return handleAuthCallback(request, { defaultNext: "/update-password" });
}
