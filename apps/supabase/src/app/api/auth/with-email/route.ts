import { User_API } from "@/modules/user/user.api";
import { NextRequest } from "next/server";
export const POST = (req: NextRequest) => User_API().withEmail(req);
