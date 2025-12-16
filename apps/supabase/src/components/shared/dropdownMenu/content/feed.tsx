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
  return user !== null ? (
    <>
      {/* Nếu là author của Feed */}
      {session?.user?.id === userFeed ? (
        <>
          <FeedEdit user={user} feed={feed} />
          <DropdownMenuSeparator />
          {/* lưu bài viết */}
          <FeedSave feed={feed} />
          <DropdownMenuSeparator />
          {/* ghim bài viết */}
          <FeedPin userId={user?.id!} feed={feed} />
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className={cn(
              "cursor-pointer text-[15px] text-slate-900",
              className,
            )}
          >
            Ẩn bài viết
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <FeedDelete feed={feed} />
        </>
      ) : (
        <>
          {/* Nếu là guest */}
          <FeedSave feed={feed} />
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className={cn(
              "cursor-pointer text-[15px] text-slate-900",
              className,
            )}
          >
            Ẩn bài viết
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className={cn(
              "cursor-pointer text-[15px] text-red-500 hover:text-red-500",
              className,
            )}
          >
            <span className="text-red-500 hover:text-red-500">Chặn</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className={cn(
              "cursor-pointer text-[15px] text-red-500 hover:text-red-500",
              className,
            )}
          >
            <span className="text-red-500 hover:text-red-500">Báo cáo</span>
          </DropdownMenuItem>
        </>
      )}
    </>
  ) : (
    <AuthenticationFeedButton />
  );
}
export { Feed };
