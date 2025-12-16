"use client";
import { InteractiveBTN } from "../button/interactive-btn";

import { useEffect, useState } from "react";
import { useContext } from "react";
import { ModalContext } from "@/components/modals/provider";
import { UpsertFeedReactionParams } from "@/lib/db/schema/feedReactions";

import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ReactionState } from "@/lib/supabase/database.types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  cn,
  toast,
} from "@suzu/ui";
import Link from "next/link";
import { useMediaQuery } from "node_modules/@suzu/ui/src/components/hooks";
import { BaseText } from "../base-text";

interface FooterCardProps {
  feedId: string;
  userId: string;
  id?: string;
  inFeed: boolean;
  totalReactions?: number;
  countComments?: number;
  isReply?: boolean;
}
export const fetchCountCommentDataAction = async (feedId: string | null) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/countComments?feed_id=${feedId}`,
    {
      next: {
        revalidate: 0,
      },
    },
  );
  const data = await res.json();
  return data;
};

const FooterCard = ({
  feedId,
  userId,
  id,
  inFeed,
  countComments,
  totalReactions,
  isReply,
}: FooterCardProps) => {
  const router = useRouter();
  const supabase = createClient();
  const pathname = usePathname();
  const {
    setShowLoginModal,
    setType,
    setShowFeedCreateModal,
    setParentFeedId,
    setUserProfile,
  } = useContext(ModalContext);
  const { isMobile } = useMediaQuery();
  const [state, setReactionState] = useState<ReactionState>();
  const [totalCount, setTotalCount] = useState<number>(totalReactions!);
  const [newComment, setNewComment] = useState<any>(null);
  const [countComment, setCountComment] = useState<number>(countComments!);
  const [isDelete, setIsDelete] = useState<boolean>(false);

  useEffect(() => {
    setTotalCount(totalReactions!);
    setCountComment(countComments!);
  }, [totalReactions, countComments]);
  useEffect(() => {
    const fetchFeedReaction = async () => {
      if (userId) {
        const { data } = await supabase
          .from("feed_engagement")
          .select("*")
          .eq("feed_id", feedId)
          .eq("user_id", userId)
          // .eq("id", id)
          .maybeSingle();
        if (data) setReactionState(data?.state);
      }
      const { count: totalCount } = await supabase
        .from("feed_engagement")
        .select("*", { count: "exact" })
        .eq("feed_id", feedId!);
      setTotalCount(totalCount!);

      const countComments = await fetchCountCommentDataAction(feedId);
      if (countComments) {
        setCountComment(countComments);
      }
    };
    fetchFeedReaction();
  }, [newComment, isDelete]);

  useEffect(() => {
    const channel = supabase.channel(`feed_engagement_infeed_${feedId}`);
    channel
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "feed_engagement" },
        (payload) => {
          switch (payload.eventType) {
            case "INSERT":
              if (payload && payload.new && payload.new.feed_id == feedId) {
                if (payload.new.user_id == userId) {
                  setReactionState(payload.new.state);
                  setNewComment(payload.new);
                }
                setTotalCount((count: number) => count + 1);
                setIsDelete(false);
              }
              break;
            case "DELETE":
              if (payload && payload.old && payload.old.feed_id == feedId) {
                if (payload.old.user_id == userId) {
                  setReactionState(ReactionState.NEUTRAL);
                }
                if (totalCount > 0) {
                  setTotalCount((count: number) => count - 1);
                }
                setIsDelete(true);
              }
              router.refresh();
            default:
              break;
          }
        },
      )
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, [supabase, feedId]);

  const handleClap = async ({ action }: { action: ReactionState }) => {
    if (!userId) {
      setShowLoginModal(true);
      return;
    }
    if (feedId) {
      try {
        let params = {
          feed_id: feedId,
          state: state === action ? ReactionState.NEUTRAL : action,
        } satisfies UpsertFeedReactionParams;
        if (id) {
          params = {
            ...params,
            ...{ id: id },
          };
        }
        const { data: session } = await supabase.auth.getUser();
        const { data: reaction, error: reactionError } = await supabase
          .from("feed_engagement")
          .select("*")
          .eq("user_id", session?.user?.id as string)
          .eq("feed_id", params.feed_id)
          .maybeSingle();
        if (reaction && !reactionError) {
          if (reaction.state === action) {
            // If the current action is the same as the existing reaction state, delete the row
            const { data, error } = await supabase
              .from("feed_engagement")
              .delete()
              .eq("user_id", session?.user?.id as string)
              .eq("feed_id", params.feed_id);
            setReactionState(ReactionState.NEUTRAL);
          } else {
            // If the current action is different from the existing reaction state, update the row
            const { data: update, error } = await supabase
              .from("feed_engagement")
              .update({ state: action })
              .eq("user_id", session?.user?.id as string)
              .eq("feed_id", params.feed_id)
              .select()
              .maybeSingle();
            setReactionState(action);
          }
        } else {
          try {
            const { data: insertData, error: insertError } = await supabase
              .from("feed_engagement")
              .insert([
                {
                  user_id: session?.user?.id as string,
                  feed_id: params.feed_id,
                  state: action,
                },
              ]);
            setReactionState(action);
          } catch (error) {
            console.log("Error creating feed reaction", error);
          }
        }
        router.refresh();
      } catch (error) {
        console.error("Error creating feed reaction", error);
      }
    }
  };

  const handleShare = async (feedId: string) => {
    try {
      await navigator.clipboard.writeText(window.location.href + "p/" + feedId);
      toast.success("Đã sao chép liên kết");
    } catch (err) {
      toast.error("Sao chép liên kết thất bại");
    }
  };

  const handleComment = async (feedId: string) => {
    const supabase = createClient();
    const { data: user } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (user === null) {
      setShowLoginModal(true);
    } else {
      setShowFeedCreateModal(true);
      setType(true);
      setParentFeedId(feedId);
      setUserProfile(user);
    }
  };

  return (
    <div className="flex flex-col items-start self-stretch">
      {/* Result of reaction buttons */}
      <Link href={`/p/${feedId}`} className="flex items-start gap-2 px-4">
        {totalCount! > 0 ? (
          <div
            className={`${inFeed ? "mt-2.5" : "mt-[1.5px]"} flex items-start gap-1`}
          >
            <BaseText
              text={totalCount}
              className="sz-parag-reg"
              textColor="neutral-500"
            />
            <BaseText
              text={"tương tác"}
              className="sz-parag-reg"
              textColor="neutral-500"
            />
          </div>
        ) : null}
        {totalCount! > 0 && countComment! > 0 ? (
          <BaseText
            text={"·"}
            className={`${inFeed ? "mt-2.5" : "mt-[1.5px]"} sz-parag-reg`}
            textColor="neutral-500"
          />
        ) : null}

        {countComment! > 0 ? (
          <div
            className={`${inFeed ? "mt-2.5" : "mt-[1.5px]"} flex items-start gap-1`}
          >
            <BaseText
              text={countComment!}
              className="sz-parag-reg"
              textColor="neutral-500"
            />
            <BaseText
              text={"Bình luận"}
              className="sz-parag-reg"
              textColor="neutral-500"
            />
          </div>
        ) : null}
      </Link>

      {/* Reaction buttons */}
      <div
        className={`flex items-start justify-between self-stretch ${inFeed === false ? "mt-0.5 pl-2 pr-4" : "mt-2.5 px-4"}`}
      >
        <div className="flex items-start gap-2">
          {/* Heart button */}
          <div className="flex items-start">
            {/* Like */}
            <div className="group">
              <div className="cursor-pointer group-hover:hidden">
                <InteractiveBTN
                  className={cn("bg-trans-black-5", { "bg-white": !inFeed })}
                  text="Thích"
                  type={1}
                  state={
                    state === ReactionState.LIKE
                      ? ReactionState.LIKE
                      : ReactionState.NEUTRAL
                  }
                  action={() => handleClap({ action: ReactionState.LIKE })}
                  isButton={true}
                  inFeed={inFeed}
                />
              </div>
              <div className="hidden cursor-pointer group-hover:block">
                <InteractiveBTN
                  className={cn("bg-trans-black-5", {
                    "bg-white": !inFeed,
                    "hover:bg-trans-black-10": inFeed,
                  })}
                  text="Thích"
                  type={1}
                  state={
                    state === ReactionState.LIKE
                      ? ReactionState.LIKE
                      : ReactionState.NEUTRAL
                  }
                  srcImageHover="/assets/icons/sparkling-hover-icon-24.png"
                  isButton={true}
                  action={() => handleClap({ action: ReactionState.LIKE })}
                  inFeed={inFeed}
                />
              </div>
            </div>

            <div
              className={cn(
                "flex w-[1px] flex-col self-stretch rounded-full bg-white py-4",
                { "bg-trans-black-5 ml-2 mt-2 h-6 py-0": !inFeed },
              )}
            ></div>

            {/* Dislike */}
            <div className="group">
              <div className="cursor-pointer group-hover:hidden">
                <InteractiveBTN
                  className={cn("bg-trans-black-5", { "bg-white": !inFeed })}
                  text=""
                  type={2}
                  state={
                    state === ReactionState.DISLIKE
                      ? ReactionState.DISLIKE
                      : ReactionState.NEUTRAL
                  }
                  action={() => handleClap({ action: ReactionState.DISLIKE })}
                  isButton={true}
                  inFeed={inFeed}
                />
              </div>
              <div className="hidden cursor-pointer group-hover:block">
                <InteractiveBTN
                  className={cn("bg-trans-black-5", {
                    "bg-white": !inFeed,
                    "hover:bg-trans-black-10": inFeed,
                  })}
                  text=""
                  type={2}
                  state={
                    state === ReactionState.DISLIKE
                      ? ReactionState.DISLIKE
                      : ReactionState.NEUTRAL
                  }
                  srcImageHover="/assets/icons/mendling-hover-icon-24.png"
                  action={() => handleClap({ action: ReactionState.DISLIKE })}
                  isButton={true}
                  inFeed={inFeed}
                />
              </div>
            </div>
          </div>
          {/* Comment btton */}
          {pathname === "/" || pathname.includes("/u/") == true ? (
            <Link href={`/p/${feedId}`} passHref className="group">
              <InteractiveBTN
                className={cn(
                  `bg-trans-black-5 ${isMobile ? "px-1" : "pr-1"} hover:bg-trans-black-10`,
                )}
                text={isMobile ? "" : "Bình luận"}
                isButton={false}
                type={3}
                inFeed={inFeed}
              />
            </Link>
          ) : (
            <InteractiveBTN
              className={cn(`bg-trans-black-5 ${isMobile ? "px-1" : "pr-1"}`, {
                "bg-white": !inFeed,
              })}
              text={isMobile ? "" : "Trả lời"}
              type={5}
              isButton={true}
              action={() => handleComment(feedId)}
              inFeed={inFeed}
            />
          )}

          {/* Share btton */}
          {inFeed ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <InteractiveBTN
                  className={`bg-trans-black-5 ${isMobile ? "px-1" : "pr-1"} hover:bg-trans-black-10`}
                  text={isMobile ? "" : "Chia sẻ"}
                  type={4}
                  isButton={false}
                  inFeed={inFeed}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                  // @ts-ignore
                  onClick={() => {
                    handleShare(feedId!);
                  }}
                  className="cursor-pointer text-[15px] text-[#0F172A]"
                >
                  Sao chép liên kết
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
        {/* Check toggle bookmark button */}
        {false && (
          <div className="bg-trans-black-5 hover:bg-trans-black-10 flex flex-col items-start">
            <InteractiveBTN
              className={`bg-trans-black-5 ${isMobile ? "px-1" : "pr-1"}`}
              type={5}
              isButton={true}
              inFeed={inFeed}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export { FooterCard };
