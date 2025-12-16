"use client";
import { DropdownMenuItem } from "@suzu/ui";
import { useContext } from "react";
import { ModalContext } from "@/components/modals/provider";

function FeedDelete({ feed }: { className?: string; feed?: any }) {
  const { setShowFeedDeleteModal, setFeedDelete } = useContext(ModalContext);

  function handleDeleteFeed() {
    setShowFeedDeleteModal(true);
    setFeedDelete(feed);
  }

  return (
    <DropdownMenuItem
      // @ts-ignore
      onClick={handleDeleteFeed}
      className="cursor-pointer text-[15px] text-red-500 hover:text-red-500"
    >
      <span className="text-red-500 hover:text-red-500">Xóa bài viết</span>
    </DropdownMenuItem>
  );
}

export { FeedDelete };
