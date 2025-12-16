"use client";
import { UpsertFeedReactionParams } from "@/lib/db/schema/feedReactions";
import { toast } from "@suzu/ui";
import { Avatar } from "@/components/shared/avatar";
import React, { useContext, useEffect, useState, useTransition } from "react";
import { ModalContext } from "@/components/modals/provider";
import Progress from "./progress";
import { createClient } from "@/lib/supabase/client";
import { createFeedReactionAction } from "@/lib/actions/feedEngagements/actions";
import { useRouter } from "next/navigation";
import { InteractiveBTN } from "@/components/master-layout";
import { ReactionState } from "@/lib/supabase/database.types";
import { BaseText } from "@/components/master-layout/base-text";

type InteractiveWidgetProps = {
  className?: string;
  userId?: string;
  feed?: Feed_Detail;
  state?: ReactionState;
  id?: string;
  commentUserDuplicace?: any;
  session?: Session;
  inFeed: boolean;
};

export const InteractiveWidget = ({
  userId,
  feed,
  id,
  session,
  inFeed,
}: InteractiveWidgetProps) => {
  const { setShowLoginModal } = useContext(ModalContext);
  const [feedReactionUser, setFeedReactionUser] = useState<
    FeedReaction_Detail[] | null
  >(null);
  const supabase = createClient();
  const router = useRouter();
  const [countLikeState, setCountLikeState] = useState<number>(0!);
  const [countDisLikeState, setCountDisLikeState] = useState<number>(0!);
  const [state, setStateReaction] = useState<ReactionState | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { count: countLike } = await supabase
        .from("feed_engagement")
        .select("*", { count: "exact" })
        .eq("feed_id", feed?.id)
        .eq("state", ReactionState.LIKE);
      const { count: countDisLike } = await supabase
        .from("feed_engagement")
        .select("*", { count: "exact" })
        .eq("feed_id", feed?.id)
        .eq("state", ReactionState.DISLIKE);
      if (userId) {
        const { data } = await supabase
          .from("feed_engagement")
          .select("*")
          .eq("feed_id", feed?.id)
          .eq("user_id", userId)
          .maybeSingle();
        if (data) setStateReaction(data?.state!);
      }
      const responeFeedRactionUser = await fetch(
        `/api/feedReactionUser?ID=${feed?.id}`,
      );
      const FeedReactionUser = await responeFeedRactionUser.json();
      if (setFeedReactionUser) {
        setFeedReactionUser(FeedReactionUser!);
      }
      if (countLike) setCountLikeState(countLike);
      if (countDisLike) setCountDisLikeState(countDisLike);
    };
    fetchData();
  }, [countLikeState, countDisLikeState]);

  useEffect(() => {
    const channel = supabase.channel(`feed_engagement_${feed?.id}_widget`);
    channel
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "feed_engagement" },
        (payload) => {
          switch (payload.eventType) {
            case "INSERT":
              if (payload && payload.new && payload.new.feed_id == feed?.id) {
                // setFeedReactionUser((prev: FeedReaction_Detail[] | null) => [
                //   ...(prev || []),
                //   payload.new as FeedReaction,
                // ]);
                if (payload.new.state == ReactionState.LIKE) {
                  setCountLikeState(countLikeState + 1);
                }
                if (payload.new.state == ReactionState.DISLIKE) {
                  setCountDisLikeState(countDisLikeState + 1);
                }
                router.refresh();
              }
              break;
            case "UPDATE":
              if (payload && payload.new && payload.new.feed_id == feed?.id) {
                if (
                  payload.new.state == ReactionState.LIKE &&
                  payload.old.state == ReactionState.DISLIKE
                ) {
                  setCountLikeState(countLikeState + 1);
                  if (countLikeState > 0)
                    setCountDisLikeState(countDisLikeState - 1);
                }
                if (
                  payload.new.state == ReactionState.DISLIKE &&
                  payload.old.state == ReactionState.LIKE
                ) {
                  setCountDisLikeState(+1);
                  if (countLikeState > 0)
                    setCountLikeState(countDisLikeState - 1);
                }
                router.refresh();
              }
            case "DELETE":
              if (payload && payload.old && payload.old.feed_id == feed?.id) {
                setFeedReactionUser(
                  (prev) =>
                    prev?.filter(
                      (reaction) => reaction?.id !== payload.old.id,
                    ) || [],
                );
                if (
                  payload.old.state == ReactionState.LIKE &&
                  countLikeState > 0
                ) {
                  setCountLikeState(countLikeState - 1);
                }
                if (
                  payload.old.state == ReactionState.DISLIKE &&
                  countDisLikeState > 0
                ) {
                  setCountDisLikeState(countDisLikeState - 1);
                }
                setStateReaction(ReactionState.NEUTRAL);
                router.refresh();
              }

            default:
              break;
          }
        },
      )
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, [countLikeState, countDisLikeState]);

  const handleClap = async ({ action }: { action: ReactionState }) => {
    if (!userId) {
      setShowLoginModal(true);
      return;
    }

    if (feed?.id) {
      try {
        let params = {
          feed_id: feed?.id,
          state: state === action ? ReactionState.NEUTRAL : action,
        } satisfies UpsertFeedReactionParams;
        if (id) {
          params = {
            ...params,
            ...{ id: id },
          };
        }
        const { data: session } = await supabase.auth.getUser();
        if (!session) {
          toast.error("chưa đăng nhập");
        }
        const { data: reaction, error: reactionError } = await supabase
          .from("feed_engagement")
          .select("*")
          .eq("user_id", session?.user?.id as string)
          .eq("feed_id", params.feed_id)
          .maybeSingle();
        if (reaction && !reactionError) {
          if (reaction.state === action) {
            // If the current action is the same as the existing reaction state, delete the row
            const { data: deleteData, error: deleteError } = await supabase
              .from("feed_engagement")
              .delete()
              .eq("user_id", session?.user?.id as string)
              .eq("feed_id", params.feed_id);
            // if (action === ReactionState.LIKE) {
            //   setCountLikeState(countLikeState - 1);
            // }
            // if (action === ReactionState.DISLIKE) {
            //   setCountDisLikeState(countDisLikeState - 1);
            // }
          } else {
            // If the current action is different from the existing reaction state, update the row
            const { data: update, error } = await supabase
              .from("feed_engagement")
              .update({ state: action })
              .eq("user_id", session?.user?.id as string)
              .eq("feed_id", params.feed_id)
              .select();
          }
        } else {
          await createFeedReactionAction(params);
          // if (action === ReactionState.LIKE) {
          //   setCountLikeState(countLikeState + 1);
          // }
          // if (action === ReactionState.DISLIKE) {
          //   setCountDisLikeState(countDisLikeState + 1);
          // }
        }
      } catch (error) {
        console.error("Error creating feed reaction", error);
      }
    }
  };

  // console.log("state:", state);
  // console.log("countLikeState:", countLikeState);
  // console.log("countDisLikeState:", countDisLikeState);
  return (
    <div className="flex flex-col items-center self-stretch">
      <div className="flex flex-col items-start self-stretch">
        <div className="flex items-center self-stretch">
          {/* Row1 */}
          <div className="flex flex-1 items-center pl-2">
            <div className="group">
              <InteractiveBTN
                className="rounded-full hover:bg-[rgba(31,31,31,0.05)] group-hover:hidden"
                type={1}
                isButton={true}
                state={
                  countLikeState === 0
                    ? ReactionState.NEUTRAL
                    : state === ReactionState.LIKE
                      ? ReactionState.LIKE
                      : ReactionState.NEUTRAL
                }
                action={() => handleClap({ action: ReactionState.LIKE })}
                inFeed={inFeed}
              />

              <InteractiveBTN
                className="hidden rounded-full hover:bg-[rgba(31,31,31,0.05)] group-hover:block"
                type={1}
                isButton={true}
                srcImageHover="/assets/icons/sparkling-hover-icon-24.png"
                action={() => handleClap({ action: ReactionState.LIKE })}
                inFeed={inFeed}
              />
            </div>

            <div className="font-sans text-sm font-semibold leading-6 text-black">
              {countLikeState}
            </div>
          </div>
          {/* Row2 */}
          <div className="flex flex-1 items-center justify-end pr-2">
            <div className="font-sans text-sm font-semibold leading-6 text-black">
              {countDisLikeState}
            </div>

            <div className="group">
              <InteractiveBTN
                className="rounded-full hover:bg-[rgba(31,31,31,0.05)] group-hover:hidden"
                type={2}
                isButton={true}
                state={
                  countDisLikeState === 0
                    ? ReactionState.NEUTRAL
                    : state === ReactionState.DISLIKE
                      ? ReactionState.DISLIKE
                      : ReactionState.NEUTRAL
                }
                action={() => handleClap({ action: ReactionState.DISLIKE })}
                inFeed
              />

              <InteractiveBTN
                className="hidden rounded-full hover:bg-[rgba(31,31,31,0.05)] group-hover:block"
                type={2}
                isButton={true}
                srcImageHover="/assets/icons/mendling-hover-icon-24.png"
                action={() => handleClap({ action: ReactionState.DISLIKE })}
                inFeed={inFeed}
              />
            </div>
          </div>
        </div>
        {/* Thanh Col bar */}
        <div className="mb-4 mt-2 flex items-start self-stretch rounded-full px-4">
          <Progress
            countLike={countLikeState}
            countDislike={countDisLikeState}
          />
        </div>
      </div>
      {/** list avatar */}
      {/* Chỗ này chỉ hiển thị 5 mạng giùm em nha anh Lộc ơi, nếu hơn 5 mạng thì cố dấu + */}
      {feedReactionUser && feedReactionUser?.length > 0 ? (
        <div className="flex h-10 items-center gap-2 self-stretch px-4">
          {feedReactionUser?.slice(0, 5).map((result, index) => (
            <div key={index}>
              <Avatar
                key={result?.user_id?.id}
                user={result?.user_id as Profile}
                session={session}
                // feed={feed}
                type="list-reaction-user"
              />
            </div>
          ))}
          {countLikeState + countDisLikeState > 0 && (
            <div className="mt-2.5 flex gap-1 text-[15px] font-normal leading-[22.5px] text-slate-500">
              {countLikeState + countDisLikeState > 5 && "+"}

              {countLikeState + countDisLikeState <= 5 ? null : (
                <>
                  <div>{countLikeState + countDisLikeState - 5}</div>
                  <div>tương tác</div>
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex h-10 items-center gap-2 self-stretch px-4">
          <BaseText
            text={"Hãy là người tương tác bài viết đầu tiên..."}
            textColor="neutral-500"
            className="sz-label-m-reg"
          />
        </div>
      )}
    </div>
  );
};
