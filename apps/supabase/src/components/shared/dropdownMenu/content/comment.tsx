"use client";
import { DropdownMenuItem, DropdownMenuSeparator, cn } from "@suzu/ui";
import { AuthenticationFeedButton } from "./authentication-feed-button";
import { EditComment } from "@/components/comments/edit-comment";
import { DeletedComment } from "@/components/comments/deleted-comment";
import { ReplyComment } from "@/components/comments/reply-comment";

function Comment({
  className,
  user,
  feed,
  userFeed,
}: {
  className?: string;
  user?: any;
  feed?: any;
  userFeed?: any;
}) {
  return user !== null ? (
    <>
      {/* Nếu là author của Comment */}
      {user?.id === userFeed ? (
        <>
          <EditComment userId={user?.id} feed={feed} />
          <DeletedComment userId={user?.id} feed={feed} />
        </>
      ) : (
        <>
          {/* Nếu là guest */}
          <ReplyComment feed={feed} userId={user?.id} />
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className={cn(
              "cursor-pointer text-[15px] text-red-500 hover:text-red-500",
              {
                //   "text-slate-500": state === "default",
              },
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
export { Comment };
