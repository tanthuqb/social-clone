"use client";
import { Divider } from "@suzu/ui";
import { InteractiveWidget } from "./components";
import CommentForm from "../comments/comment-form";

import { ContentCard, FooterCard, HeaderCard } from "../master-layout";

type FeedDetailProps = {
  className?: string;
  inFeed: boolean;
  feed?: Feed_Detail | Comment_Detail_Full | null;
  userIdByParams?: string;
  profiles?: Profile;
  session: Session;
};

const FeedDetail = ({ inFeed, feed, profiles, session }: FeedDetailProps) => {
  if (!feed?.id) return <></>;

  // Phase 2: Realtime - tạm comment vì chưa xử lý realtime

  return (
    <div
      className={`${inFeed ? "shadow-common-sm bg-white py-4" : "p-0 sm:p-4"} flex w-full flex-col sm:rounded-2xl`}
    >
      <div
        className={`flex flex-col items-start sm:rounded-2xl ${inFeed ? null : "shadow-common-sm bg-white py-4"}`}
      >
        {/* HEADER CARD
        - Profiles: If user is logged in, profiles will be fetched;
      */}
        <HeaderCard
          feed={feed}
          session={session}
          inFeed={inFeed}
          iconTrigger="dots"
          comment={false} // dùng để check hiện content dropdown comment
          notifications={false} // dùng để check hiện content dropdown notification
          user={profiles!}
        />

        {/* CONTENT CARD
        - Type1: only text
        - Type2: only image
        - Type3: only link
        - Type4: only image and text
        - Type5: on image and text and link
      */}
        <ContentCard feed={feed} inFeed={inFeed} />
      </div>

      {/* FOOTER CARD
        - Comment form: only in feed-detail
        - Result of reaction buttons
        - Reaction buttons
      */}
      {!inFeed ? (
        <>
          <Divider />
          <div className="flex flex-col items-center py-4">
            {/** Header */}
            <div className="items-center gap-2.5 self-stretch px-4">
              <div className="flex-1 text-[18px] font-semibold not-italic leading-[23.4px] text-slate-900">
                Tương tác
              </div>
            </div>

            {/* INTERACTIVE WiDGET
            - ReactionButton
            - ProgressIndicator
            - Thumbnail
            */}
            <InteractiveWidget
              className=""
              userId={session?.user?.id as string}
              feed={feed}
              inFeed={inFeed}
              session={session}
            />
          </div>

          <Divider />

          {/**Comment */}
          <div className="shadow-common-sm flex flex-col items-center bg-white py-4 sm:rounded-2xl">
            {/* header */}
            <div className="flex items-center gap-2.5 self-stretch px-4 pb-2.5">
              <div className="text-[18px] font-semibold not-italic leading-[23.4px] text-slate-900">
                Thảo luận
              </div>
            </div>
            {/* col - component create,.... comment */}
            <div className="flex w-full flex-col items-center">
              {/** comment form */}
              <CommentForm
                className=""
                feed={feed}
                feedId={feed?.id}
                profiles={profiles!}
                session={session}
                inFeed={inFeed}
              />
              {/** comment form */}
              <Divider />
            </div>
          </div>
        </>
      ) : (
        <FooterCard
          feedId={feed?.id}
          userId={session?.user?.id as string}
          inFeed={inFeed}
        />
      )}
    </div>
  );
};

export { FeedDetail };
