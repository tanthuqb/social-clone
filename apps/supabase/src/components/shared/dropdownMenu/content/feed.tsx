"use client";
import { DropdownMenuItem, DropdownMenuSeparator, cn } from "@suzu/ui";
import { FeedEdit } from "@/components/feeds/components";
import { FeedDelete } from "@/components/feeds/components/feed-delete";

import { AuthenticationFeedButton } from "./authentication-feed-button";
import { FeedSave } from "@/components/feeds/components/feed-save";
import { FeedPin } from "@/components/feeds/components/feed-pin";
import { useFeedCard } from "@/components/feeds/feed-card-context";
import { useModeration } from "@/components/moderation/moderation-provider";

const itemClass = "cursor-pointer text-[15px] text-slate-900";
const dangerClass = "cursor-pointer text-[15px] text-red-500 hover:text-red-500";

function Feed({
  className,
  user,
  feed,
  userFeed,
  session,
}: {
  className?: string;
  user?: Profile;
  feed?: Feed_Detail;
  userFeed?: string;
  session?: Session;
}) {
  const feedCard = useFeedCard();
  const { openBlock, openReport } = useModeration();
  const author = feed?.user_id;
  const authorName = author?.display_name ?? author?.full_name ?? "this user";

  if (!session?.user) return <AuthenticationFeedButton />;

  // The feed author gets management actions.
  if (session.user.id === userFeed) {
    return (
      <>
        <FeedEdit user={user} feed={feed} />
        <DropdownMenuSeparator />
        <FeedSave feed={feed} />
        <DropdownMenuSeparator />
        <FeedPin userId={user?.id!} feed={feed} />
        <DropdownMenuSeparator />
        <FeedDelete feed={feed} />
      </>
    );
  }

  return (
    <>
      <FeedSave feed={feed} />
      {feedCard && (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className={cn(itemClass, className)}
            onSelect={() => void feedCard.hidePost()}
          >
            Hide post
          </DropdownMenuItem>
        </>
      )}
      {author?.id && (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className={cn(dangerClass, className)}
            onSelect={() => openBlock({ userId: author.id, name: authorName })}
          >
            <span className="text-red-500 hover:text-red-500">Block</span>
          </DropdownMenuItem>
        </>
      )}
      {feed?.id && (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className={cn(dangerClass, className)}
            onSelect={() => openReport({ target: "post", targetId: feed.id })}
          >
            <span className="text-red-500 hover:text-red-500">Report</span>
          </DropdownMenuItem>
        </>
      )}
    </>
  );
}
export { Feed };
