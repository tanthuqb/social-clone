"use client";
import { UpsertFeedReactionParams } from "@/lib/db/schema/feedReactions";
import { toast } from "@suzu/ui";
import { Avatar } from "@/components/shared/avatar";
import React, { useContext, useEffect, useState, useTransition } from "react";
import { ModalContext } from "@/components/modals/provider";
import Progress from "./progress";
import { createClient } from "@/lib/supabase/client";
import { upsertFeedReactionAction } from "@/lib/actions/feedEngagements/actions";
import { useRealtimeTable } from "@/hooks/useRealtimeTable";
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
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const { count: countLike } = await supabase
        .from("feed_engagement")
        .select("*", { count: "exact" })
        .eq("feed_id", feed?.id as string)
        .eq("state", ReactionState.LIKE);
      const { count: countDisLike } = await supabase
        .from("feed_engagement")
        .select("*", { count: "exact" })
        .eq("feed_id", feed?.id as string)
        .eq("state", ReactionState.DISLIKE);
      if (userId) {
        const { data } = await supabase
          .from("feed_engagement")
          .select("*")
          .eq("feed_id", feed?.id as string)
          .eq("user_id", userId)
          .maybeSingle();
        if (data) setStateReaction(data?.state! as ReactionState);
      }
      const responeFeedRactionUser = await fetch(
        `/api/feedReactionUser?ID=${feed?.id}`,
      );
      const FeedReactionUser = await responeFeedRactionUser.json();
      if (setFeedReactionUser) {
        setFeedReactionUser(FeedReactionUser!);
      }
      // 0 is a valid count (e.g. after the last reaction is removed).
      setCountLikeState(countLike ?? 0);
      setCountDisLikeState(countDisLike ?? 0);
    };
    fetchData();
  }, [refreshTick, feed?.id]);

  useRealtimeTable({
    table: "feed_engagement",
    filter: `feed_id=eq.${feed?.id}`,
    onChange: () => {
      setRefreshTick((t) => t + 1);
      router.refresh();
    },
  });

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
        const { error } = await upsertFeedReactionAction(
          feed.id,
          params.state as "like" | "dislike" | "neutral",
        );
        if (error) {
          toast.error(error);
          return;
        }
        // Reflect the change right away; Realtime delivery is best-effort.
        setStateReaction(params.state as ReactionState);
        setRefreshTick((t) => t + 1);
        router.refresh();
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
            <div
              className="group"
              data-testid="widget-react-like"
              data-state={
                countLikeState > 0 && state === ReactionState.LIKE ? "like" : "neutral"
              }
            >
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

            <div
              className="font-sans text-sm font-semibold leading-6 text-black"
              data-testid="widget-like-count"
            >
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
      {/* Only show 5 avatars here; if there are more than 5, show a + sign */}
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
                  <div>reactions</div>
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex h-10 items-center gap-2 self-stretch px-4">
          <BaseText
            text={"Be the first to react to this post..."}
            textColor="neutral-500"
            className="sz-label-m-reg"
          />
        </div>
      )}
    </div>
  );
};
