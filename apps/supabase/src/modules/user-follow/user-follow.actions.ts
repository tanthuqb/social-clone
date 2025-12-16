import { ResponseStatus } from "@/lib/base/controller";
import { toast } from "@suzu/ui";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const UserFollowAction = () => {
    const GetUserFollow = (
        user: Profile,
        session: Session,
        feed:Feed_Detail
    ) => {
    const [followingUser, setFollowingUser] = useState<UserFollows | null>(null);
    const [following, setFollowing] = useState<number>(0);
    const [follower, setFollower] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            if (session?.user?.id && user?.id != session?.user?.id) {
                const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/userFollows?userId=${session?.user?.id}&followId=${feed?.user_id?.id ?? user?.id}&action=find`, {
                    method: "GET"
                });
                if (data.ok) {
                    const { status, message, result } = await data.json();
                    if (status !== ResponseStatus.Success) {
                        toast.error(message!);
                    }
                    else setFollowingUser(result);
                }
            }
            if (user?.id && session?.user?.id && user?.id !== session?.user?.id) {
                const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/userFollows?userId=${session?.user?.id}&action=countFollowers`, {
                    method: "GET"
                });
                if (data.ok) {
                    const { status, message, result } = await data.json();
                    if (status !== ResponseStatus.Success) {
                        toast.error(message!);
                    }
                    else setFollower(result);
                }

                const dataFollowing = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/userFollows?userId=${session?.user?.id}&action=countFollowing`, {
                    method: "GET"
                });
                if (dataFollowing.ok) {
                    const { status, message, result } = await dataFollowing.json();  
                    if (status !== ResponseStatus.Success) {
                        toast.error(message!);
                    }
                    else setFollowing(result);
                }
            }
        };
        fetchData();
    }, [feed?.user_id?.id, session?.user?.id]);
    return {following,follower,followingUser}
}
    //   const followHandler = async (user: Profile) => {
    //     if (session?.user?.id && user?.id && user?.id !== session?.user?.id) {
    //       if (!followingUser) {
    //         const { data, error } = await supabase
    //           .from("user_follows")
    //           .insert({
    //             user_id: session?.user?.id,
    //             following_id: user?.id,
    //           })
    //           .select();
    //         if (error) {
    //           console.log(error);
    //           toast.error("Theo dõi thất bại");
    //         } else {
    //           setShowPlus(false);
    //           toast.success("Theo dõi thành công");
    //         }
    //       }
    //     }
    //   };
    const CreateFollow = async (userId: string, followId: string) => {
        const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/userFollows`, {
            method: "POST",
            body: JSON.stringify({ userId: userId, followId: followId }),
        });
        if (data.ok) {
            const { status, message, result } = await data.json();
            if (status !== ResponseStatus.Success) {
                toast.error(message!);
            }
            return { status, message, result };
        }
    };
    const UnFollow = async (userId: string, followId: string) => {
        const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/userFollows?userId=${userId}&followId=${followId}`, {
            method: "DELETE"
        });
        if (data.ok) {
            const { status, message, result } = await data.json();
            if (status !== ResponseStatus.Success) {
                toast.error(message!);
            }
            return { status, message, result };
        }
    }
    // const CountFollowers = async (userId: string) => {
    //     const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/userFollows?userId=${userId}&action=countFollowers`, {
    //         method: "GET"
    //     });
    //     if (data.ok) {
    //         const { status, message, result } = await data.json();
    //         if (status !== ResponseStatus.Success) {
    //             toast.error(message!);
    //         }
    //         else {
    //             setFollower(result);
    //         }
    //     }
    //     return { follower };
    // }
    // const CountFollowing = async (userId: string) => {
    //     const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/userFollows?userId=${userId}&action=countFollowers`, {
    //         method: "GET"
    //     });
    //     if (data.ok) {
    //         const { status, message, result } = await data.json();
    //         if (status !== ResponseStatus.Success) {
    //             toast.error(message!);
    //         }
    //         else {
    //             setFollowing(result);
    //         }

    //     }
    //     return { following };
    // }
    return {
        CreateFollow, UnFollow, GetUserFollow
    };
}