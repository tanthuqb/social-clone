"use client";

import { ModalContext } from "@/components/modals/provider";
import { Divider, cn, toast } from "@suzu/ui";
import React, { memo, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import FeedCreateCommon from "../modals/feeds/feed-create-common";
import {
  BaseCommonBTN,
  BaseIconBTN,
  ContentCard,
  FooterCard,
  HeaderCard,
} from "../master-layout";
import { BaseText } from "../master-layout/base-text";

function CommentForm({
  feed,
  profiles,
  feedId,
  session,
  inFeed,
}: {
  className: string;
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

    const { data: replies, count: countReplies } = await supabase
      .from("feeds")
      .select("*,user_id!left(*), parent_id!left(*)", { count: "exact" })
      .eq("type", "comment")
      .order("created_at", { ascending: false })
      .in("parent_id", commentIds);

    const commentsWithRepliesPromises = rows.map(async (r: any) => {
      const { data: reactions } = await supabase
        .from("feed_engagement")
        .select("*")
        .eq("feed_id", r.id)
        .maybeSingle();

      const { count: countTotalRectionComment } = await supabase
        .from("feed_engagement")
        .select("feed_id", { count: "exact" })
        .eq("feed_id", r.id);

      const commentRepliesPromises = replies!
        .filter((reply: any) => reply?.parent_id?.id === r.id)
        .map(async (reply: any) => {
          const { data: replyReactions } = await supabase
            .from("feed_engagement")
            .select("*")
            .eq("feed_id", reply.id)
            .maybeSingle();

          const { count: countTotalRectionReplyComment } = await supabase
            .from("feed_engagement")
            .select("feed_id", { count: "exact" })
            .eq("feed_id", reply.id);

          return {
            ...reply,
            reactions: replyReactions,
            totalReactions: countTotalRectionReplyComment,
          };
        });

      const commentReplies = await Promise.all(commentRepliesPromises);
      const countComment = commentReplies.length;

      return {
        ...r,
        replies: commentReplies,
        reactions: reactions,
        countComment: countComment,
        totalReactions: countTotalRectionComment,
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
  }, [NewComment, isDelete]);

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

  useEffect(() => {
    const channel = supabase.channel(`feed_${feedId}`);
    channel
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "feeds" },
        (payload: any) => {
          switch (payload?.eventType) {
            case "INSERT":
              if (payload && payload?.new) {
                setIsDelete(false);
                const newComment = payload.new;
                setNewComment(newComment);
                router.refresh();
              }
              break;
            case "UPDATE":
              if (payload && payload?.new) {
                setIsDelete(false);
                const updateComment = payload.new;
                setNewComment(updateComment);
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
              toast.error("Có lỗi xảy ra, vui lòng thử lại sau");
              break;
          }
        },
      )
      .subscribe();

    return () => {
      supabase.realtime.removeChannel(channel);
    };
  }, [supabase]);

  const handleLogin = () => {
    setShowLoginModal(true);
  };

  return (
    <div className="w-full">
      {/* Header comment */}
      {profiles === null ? (
        <>
          <div className="flex gap-1 p-4">
            <button
              type="button"
              onClick={handleLogin}
              className="text-[15px] font-semibold leading-[22.5px] text-slate-900 underline"
            >
              Tham gia
            </button>
            <div className="text-[15px] font-normal leading-[22.5px] text-slate-500">
              vào SuZu để thảo luận liền tay...
            </div>
          </div>
          <div className="my-2.5">
            <Divider />
          </div>
        </>
      ) : (
        <FeedCreateCommon
          user={profiles}
          feed={feed}
          session={session}
          inFeed={false}
        />
      )}

      {/* END Header comment */}
      {/* ==========   START Component comment gốc và có thể có nhiều comment bên trong    =============*/}
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
                  comment={true} // dùng để check hiện content dropdown comment
                  notifications={false} // dùng để check hiện content dropdown notifications
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
                        ? "Xem thêm bình luận"
                        : "Ẩn bình luận"
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

              {/* List comment - trả lời comment */}
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
                              userId={reply?.user_id?.id}
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
              "Chưa có bình luận nào ở đây.Hãy trở thành người đầu tiên bình luận bài viết."
            }
            className="sz-label-m-reg mx-auto flex w-96 px-2 text-center"
            textColor="neutral-500"
          />
        </div>
      )}
      {/* ==========   END Component comment gốc và có thể có nhiều comment bên trong    =============*/}
      {isLoading ? (
        <div className="px-4">
          <button
            className="bg-trans-black-5 flex w-full justify-center gap-1 self-stretch rounded-full"
            onClick={handleLoadMoreComment}
          >
            <div className="rounded-full px-4 py-2">
              <BaseText
                text={`Xem thêm thảo luận (${CommentScroll.length}/${totalComments} thảo luận)`}
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
