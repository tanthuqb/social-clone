import { type NextRequest } from "next/server";
import { handleAuthCallback } from "@/lib/auth/callback";

// OAuth (Google / Facebook) redirect target.
export async function GET(request: NextRequest) {
  return handleAuthCallback(request, { setUsername: true });
}
