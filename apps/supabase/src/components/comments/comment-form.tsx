"use client";

import { ModalContext } from "@/components/modals/provider";
import { Divider, cn, toast } from "@suzu/ui";
import React, { memo, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRealtimeTable } from "@/hooks/useRealtimeTable";
import { COMMENT_CHANGED_EVENT } from "@/lib/comment-events";
import { useRouter } from "next/navigation";
import FeedCreateCommon from "@/components/modals/feeds/feed-create-common";
import {
  BaseCommonBTN,
  BaseIconBTN,
  ContentCard,
  FooterCard,
  HeaderCard,
} from "@/components/master-layout";
import { BaseText } from "@/components/master-layout/base-text";

function CommentForm({
  feed,
  profiles,
  feedId,
  session,
  inFeed,
  commentRestriction,
}: {
  className: string;
  commentRestriction?: string | null;
  feed: Feed_Detail;
  profiles: Profile;
  session: Session;
  inFeed: boolean;
  feedId?: Feed["id"];
  feedReaction?: FeedReaction_Detail;
}) {
  const PAGE_COUNT = 10;
  const { setShowLoginModal } = useContext(ModalContext);
  const [toggleComments, setToggleComments] = useState<{
    [key: number]: boolean;
  }>({});
  const [CommentScroll, setCommentScroll] = useState<Comment_Detail_Full[]>([]);
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [NewComment, setNewComment] = useState<Comment_Detail>();
  const [isDelete, setIsDelete] = useState(false);
  // Bumped when the composer reports a comment change (see lib/comment-events).
  const [refreshTick, setRefreshTick] = useState(0);
  const [totalComments, setTotalComments] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const supabase = createClient();

  const getCommentByFeedId = async (
    page: number,
    PAGE_COUNT: number,
    feedId: Feed["id"],
  ) => {
    const totalCommentsResponse = await supabase
      .from("feeds")
      .select("*", { count: "exact" })
      .eq("type", "comment")
      .eq("parent_id", feedId);
    if (totalCommentsResponse.error) throw totalCommentsResponse.error;

    const totalComments = totalCommentsResponse.count;
    const validPage = page > 0 ? page : 1;
    let start = (validPage - 1) * PAGE_COUNT;
    if (start >= totalComments!) {
      start = Math.max(0, totalComments! - PAGE_COUNT);
    }
    const end = start + PAGE_COUNT - 1;

    const commentsResponse = await supabase
      .from("feeds")
      .select("*,user_id!left(*), parent_id!left(*)", { count: "exact" })
      .eq("type", "comment")
      .eq("parent_id", feedId)
      .order("created_at", { ascending: false })
      .range(start, end);
    if (commentsResponse.error) throw commentsResponse.error;

    const totalPages = Math.ceil(
      totalComments ? totalComments / PAGE_COUNT : 0,
    );
    const rows = commentsResponse.data;
    const commentIds = rows.map((c: any) => c.id);

    // Load every descendant (replies to replies too) and group them under
    // their top-level comment, so deep replies are not silently hidden.
    const viewerId = session?.user?.id;
    const rootOf = new Map<string, string>();
    commentIds.forEach((id: string) => rootOf.set(id, id));
    const replies: any[] = [];
    let frontier: string[] = commentIds;
    for (let depth = 0; depth < 10 && frontier.length > 0; depth++) {
      const { data: level, error: levelError } = await supabase
        .from("feeds")
        .select("*,user_id!left(*), parent_id!left(*)")
        .eq("type", "comment")
        .in("parent_id", frontier)
        .order("created_at", { ascending: true });
      if (levelError) throw levelError;
      (level ?? []).forEach((reply: any) => {
        const parentId = reply?.parent_id?.id;
        rootOf.set(reply.id, rootOf.get(parentId) ?? parentId);
        replies.push(reply);
      });
      frontier = (level ?? []).map((reply: any) => reply.id);
    }
    const countReplies = replies.length;

    const withReactions = async (row: any) => {
      const [{ data: reactions }, { count: totalReactions }] = await Promise.all([
        viewerId
          ? supabase
              .from("feed_engagement")
              .select("*")
              .eq("feed_id", row.id)
              .eq("user_id", viewerId)
              .maybeSingle()
          : Promise.resolve({ data: null }),
        supabase
          .from("feed_engagement")
          .select("feed_id", { count: "exact", head: true })
          .eq("feed_id", row.id),
      ]);
      return { ...row, reactions, totalReactions };
    };

    const commentsWithRepliesPromises = rows.map(async (r: any) => {
      const commentReplies = await Promise.all(
        replies
          .filter((reply: any) => rootOf.get(reply.id) === r.id)
          .map(withReactions),
      );
      const base = await withReactions(r);
      return {
        ...base,
        replies: commentReplies,
        countComment: commentReplies.length,
      };
    });

    const commentsWithReplies = await Promise.all(commentsWithRepliesPromises);

    return {
      commentUser: commentsWithReplies,
      totalComments: totalComments! + countReplies!,
      totalPages: totalPages,
    };
  };

  const handleLoadMoreComment = () => {
    setToggleComments((prevState) => {
      const newState = { ...prevState };
      CommentScroll.forEach((_, index) => {
        newState[index] = true;
      });
      return newState;
    });
    LoadMoreComment();
  };

  const handleToggleComments = (comment: any, index: any) => {
    setToggleComments((prevState: any) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  useEffect(() => {
    setIsDelete(false);
    async function CommentInit() {
      const { commentUser, totalComments } = await getCommentByFeedId(
        0,
        PAGE_COUNT,
        feedId!,
      );
      if (commentUser.length < PAGE_COUNT) {
        setIsLoading(false);
      }

      if (totalComments) {
        setTotalComments(totalComments);
      }
      setCommentScroll(commentUser);
      setToggleComments((prevState) => {
        const newState = { ...prevState };
        commentUser.forEach((_: any, index: any) => {
          newState[index] = false;
        });
        return newState;
      });
    }
    CommentInit();
  }, [NewComment, isDelete, refreshTick]);

  // Realtime delivery is best-effort; the composer also announces changes
  // in-page so a freshly posted comment shows up without a reload.
  useEffect(() => {
    const onCommentChanged = () => {
      setIsDelete(false);
      setRefreshTick((tick) => tick + 1);
    };
    window.addEventListener(COMMENT_CHANGED_EVENT, onCommentChanged);
    return () => window.removeEventListener(COMMENT_CHANGED_EVENT, onCommentChanged);
  }, []);

  const LoadMoreComment = async () => {
    try {
      if (isLoading) {
        const { commentUser } = await getCommentByFeedId(
          page + 1,
          PAGE_COUNT,
          feedId!,
        );
        setToggleComments((prevState) => {
          const newState = { ...prevState };
          commentUser.forEach((_: any, index: any) => {
            newState[index] = true;
          });
          return newState;
        });
        if (commentUser.length < PAGE_COUNT) {
          setIsLoading(false);
        }

        setCommentScroll((prev: any) => {
          const uniqueNewItems = commentUser.filter(
            (newItem: any) =>
              !prev.some((prevItem: any) => prevItem.id === newItem.id),
          );
          return [...prev, ...uniqueNewItems];
        });
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error loading more comments", error);
    }
  };

  useRealtimeTable({
    table: "feeds",
    filter: "type=eq.comment",
    onChange: (payload: any) => {
      switch (payload?.eventType) {
        case "INSERT":
          if (payload && payload?.new) {
            setIsDelete(false);
            setNewComment(payload.new);
            router.refresh();
          }
          break;
        case "UPDATE":
          if (payload && payload?.new) {
            setIsDelete(false);
            setNewComment(payload.new);
            router.refresh();
          }
          break;
        case "DELETE":
          if (payload && payload?.old.id) {
            setIsDelete(true);
            router.refresh();
          }
          break;
        default:
          break;
      }
    },
  });

  const handleLogin = () => {
    setShowLoginModal(true);
  };

  return (
    <div className="w-full">
      {/* Header comment */}
      {!session?.user ? (
        <>
          <div className="flex gap-1 p-4">
            <button
              type="button"
              onClick={handleLogin}
              className="text-[15px] font-semibold leading-[22.5px] text-slate-900 underline"
            >
              Join
            </button>
            <div className="text-[15px] font-normal leading-[22.5px] text-slate-500">
              SuZu to join the discussion...
            </div>
          </div>
          <div className="my-2.5">
            <Divider />
          </div>
        </>
      ) : commentRestriction ? (
        <div
          className="border-b-trans-black-10 border-b p-4 text-[15px] text-slate-500"
          data-testid="comment-restriction"
        >
          {commentRestriction}
        </div>
      ) : (
        <FeedCreateCommon
          user={profiles}
          feed={feed}
          session={session}
          inFeed={false}
        />
      )}

      {/* END Header comment */}
      {/* ==========   START Root comment component, may contain nested comments    =============*/}
      {CommentScroll?.length > 0 ? (
        CommentScroll?.map((comment: Comment_Detail_Full, index: number) => {
          return (
            <div key={index} id={`comment-${index}`}>
              <div className={`flex flex-col self-stretch py-4`}>
                <HeaderCard
                  iconTrigger="dots"
                  feed={comment}
                  session={session}
                  user={profiles}
                  comment={true} // used to decide whether to show the comment dropdown content
                  notifications={false} // used to decide whether to show the notifications dropdown content
                />
                <div className="flex flex-col items-start self-stretch pl-12 pr-4">
                  <ContentCard
                    feed={comment!}
                    isComment={true}
                    inFeed={inFeed}
                  />
                  <FooterCard
                    feedId={comment?.id!}
                    userId={session?.user?.id as string}
                    id={comment?.reactions?.id}
                    totalReactions={comment?.totalReactions!}
                    countComments={comment?.countComment!}
                    inFeed={false}
                  />
                </div>
              </div>

              {comment?.replies?.length! > 0 ? (
                <div
                  className="flex items-center gap-2 self-stretch pl-12"
                  key={index}
                >
                  <BaseCommonBTN
                    isButton={true}
                    text={
                      toggleComments[index]
                        ? "View more comments"
                        : "Hide comments"
                    }
                    srcImgLeft="/assets/icons-24/subdirectory-arrow-right.png"
                    className={cn(
                      "flex items-center gap-2 rounded-full p-2 px-4 transition-all duration-300",
                    )}
                    onClick={() => handleToggleComments(comment, index)}
                    inFeed={inFeed}
                  />
                </div>
              ) : null}

              {/* Comment list - comment replies */}
              <div
                className={cn("flex-col items-start self-stretch pl-12", {
                  hidden: toggleComments[index],
                })}
              >
                {comment?.replies?.length! > 0 &&
                  comment?.replies?.map((reply: any, indexReply: number) => {
                    return (
                      <div key={indexReply}>
                        <div className={`flex flex-col self-stretch py-4`}>
                          <HeaderCard
                            iconTrigger="dots"
                            feed={reply}
                            session={session}
                            user={profiles}
                            comment={true}
                            notifications={false}
                          />
                          <div className="flex flex-col items-start self-stretch pl-12 pr-4">
                            <ContentCard feed={reply!} inFeed={inFeed} />
                            <FooterCard
                              feedId={reply?.id!}
                              userId={session?.user?.id as string}
                              id={reply?.reactions?.id!}
                              inFeed={inFeed}
                              // stateProp={comment?.reactions?.state}
                              totalReactions={reply?.totalReactions!}
                              countComments={reply?.countComment!}
                              isReply={true}
                              // comment={reply}
                            />
                          </div>
                        </div>
                        {indexReply < comment?.replies?.length! - 1 && (
                          <Divider />
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })
      ) : (
        <div className="flex h-96 flex-col items-center justify-center">
          <BaseIconBTN
            src="/assets/icons-104/forum.png"
            alt="forum"
            width={104}
            height={104}
          />
          <BaseText
            text={
              "No comments yet. Be the first to comment on this post."
            }
            className="sz-label-m-reg mx-auto flex w-96 px-2 text-center"
            textColor="neutral-500"
          />
        </div>
      )}
      {/* ==========   END Root comment component, may contain nested comments    =============*/}
      {isLoading ? (
        <div className="px-4">
          <button
            className="bg-trans-black-5 flex w-full justify-center gap-1 self-stretch rounded-full"
            onClick={handleLoadMoreComment}
          >
            <div className="rounded-full px-4 py-2">
              <BaseText
                text={`View more comments (${CommentScroll.length}/${totalComments} comments)`}
                className="label-m-semi text-center"
                textColor="slate-700"
              />
            </div>
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default memo(CommentForm);
