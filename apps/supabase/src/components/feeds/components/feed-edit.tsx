"use client";
import { toast, DropdownMenuItem } from "@suzu/ui";
import { useContext } from "react";
import { ModalContext } from "@/components/modals/provider";

function FeedEdit({
  feed,
  user,
}: {
  animated?: boolean;
  className?: string;
  feed?: Feed_Detail;
  user?: Profile | Session;
}) {
  const {
    setShowFeedCreateModal,
    setShowLoginModal,
    setFeed,
    setType,
    setUserProfile,
    setParentFeedId,
  } = useContext(ModalContext);

  const handleEditFeed = () => {
    if (!user) {
      setShowLoginModal(true);
    } else {
      setShowFeedCreateModal(true);
      setFeed(feed);
      setType(false);
      // @ts-ignore
      setUserProfile(user);
      setParentFeedId(undefined);
    }
  };

  return (
    <DropdownMenuItem
      // @ts-ignore
      onClick={handleEditFeed}
      className="cursor-pointer text-[15px] text-[#0F172A]"
    >
      Chỉnh sửa bài viết
    </DropdownMenuItem>
  );
}

export { FeedEdit };
