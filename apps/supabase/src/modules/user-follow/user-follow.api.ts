import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { UserFollowController } from "./user-follow.controller";
const revalidateUserFollowReactions = () => revalidatePath("/userFollow");
export const Userfollow_API = () => {
    const controller = new UserFollowController();
    async function CreateFollow(request: NextRequest) {
        const body = await request.json();
        const result = await controller.CreateFollow(body);
        revalidateUserFollowReactions();
        return NextResponse.json(result);
    }
    async function FindFollow(request: NextRequest) {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')
        const followId = searchParams.get('followId')
        const result = await controller.FindFollow(userId!, followId!);
        revalidateUserFollowReactions();
        return NextResponse.json(result);
    }
    async function UnFollow(request: NextRequest) {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')
        const followId = searchParams.get('followId')
        const result = await controller.UnFollow(userId!, followId!);
        revalidateUserFollowReactions();
        return NextResponse.json(result);
    }
    async function CountFollowers(request: NextRequest) {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')
        const result = await controller.CountFollowers(userId!);
        revalidateUserFollowReactions();
        return NextResponse.json(result);
    }
    async function CountFollowing(request: NextRequest) {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')
        const result = await controller.CountFollowing(userId!);
        revalidateUserFollowReactions();
        return NextResponse.json(result);
    }
    return { CreateFollow, UnFollow, CountFollowers, CountFollowing, FindFollow };
}