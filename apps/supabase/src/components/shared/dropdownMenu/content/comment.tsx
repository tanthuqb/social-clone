"use client";
import { DropdownMenuItem, DropdownMenuSeparator, cn } from "@suzu/ui";
import { AuthenticationFeedButton } from "./authentication-feed-button";
import { EditComment } from "@/components/comments/edit-comment";
import { DeletedComment } from "@/components/comments/deleted-comment";
import { ReplyComment } from "@/components/comments/reply-comment";
import { useContext } from "react";
import { ModalContext } from "@/components/modals/provider";
import { useModeration } from "@/components/moderation/moderation-provider";

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
  const { openReport } = useModeration();
  const { setShowLoginModal } = useContext(ModalContext);
  return user !== null ? (
    <>
      {/* If the user is the comment author */}
      {user?.id === userFeed ? (
        <>
          <EditComment userId={user?.id} feed={feed} />
          <DeletedComment userId={user?.id} feed={feed} />
        </>
      ) : (
        <>
          {/* If the user is a guest */}
          <ReplyComment feed={feed} userId={user?.id} />
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className={cn(
              "cursor-pointer text-[15px] text-red-500 hover:text-red-500",
              className,
            )}
            onSelect={() =>
              user?.id
                ? openReport({ target: "comment", targetId: feed?.id })
                : setShowLoginModal(true)
            }
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
export { Comment };
