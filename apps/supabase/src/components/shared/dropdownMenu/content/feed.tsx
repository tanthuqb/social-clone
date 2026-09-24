"use client";
import { DropdownMenuItem, DropdownMenuSeparator, cn } from "@suzu/ui";
import { FeedEdit } from "@/components/feeds/components";
import { FeedDelete } from "@/components/feeds/components/feed-delete";

import { AuthenticationFeedButton } from "./authentication-feed-button";
import { FeedSave } from "@/components/feeds/components/feed-save";
import { FeedPin } from "@/components/feeds/components/feed-pin";

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
  return session?.user ? (
    <>
      {/* If the user is the feed author */}
      {session?.user?.id === userFeed ? (
        <>
          <FeedEdit user={user} feed={feed} />
          <DropdownMenuSeparator />
          {/* save post */}
          <FeedSave feed={feed} />
          <DropdownMenuSeparator />
          {/* pin post */}
          <FeedPin userId={user?.id!} feed={feed} />
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className={cn(
              "cursor-pointer text-[15px] text-slate-900",
              className,
            )}
          >
            Hide post
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <FeedDelete feed={feed} />
        </>
      ) : (
        <>
          {/* If the user is a guest */}
          <FeedSave feed={feed} />
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className={cn(
              "cursor-pointer text-[15px] text-slate-900",
              className,
            )}
          >
            Hide post
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className={cn(
              "cursor-pointer text-[15px] text-red-500 hover:text-red-500",
              className,
            )}
          >
            <span className="text-red-500 hover:text-red-500">Block</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className={cn(
              "cursor-pointer text-[15px] text-red-500 hover:text-red-500",
              className,
            )}
          >
            <span className="text-red-500 hover:text-red-500">Report</span>
          </DropdownMenuItem>
        </>
      )}
    </>
  ) : (
    <AuthenticationFeedButton />
  );
}
export { Feed };
