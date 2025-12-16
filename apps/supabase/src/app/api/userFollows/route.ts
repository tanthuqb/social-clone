import { Userfollow_API } from "@/modules/user-follow/user-follow.api";
import { NextRequest } from "next/server";

export const GET =  (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    if (action === 'countFollowers') {
        return Userfollow_API().CountFollowers(req);
    } else if (action === 'countFollowing') {
        return Userfollow_API().CountFollowing(req);
    }
    else if (action === 'find'){
        return Userfollow_API().FindFollow(req);
    }
};

export const DELETE =  (req: NextRequest) => Userfollow_API().UnFollow(req);

export const POST =  (req: NextRequest) => Userfollow_API().CreateFollow(req);

