"use client";
import { toast, DropdownMenuItem } from "@suzu/ui";
import { useState } from "react";
import { useContext } from "react";
import { ModalContext } from "@/components/modals/provider";
import { useRouter } from "next/navigation";


function DeletedComment({
  animated = true,
  className,
  feed,
  userId,
}: {
  animated?: boolean;
  className?: string;
  feed?: Feed_Detail;
  userId?: string;
}) {
  const {
    setShowLoginModal,
    setShowFeedDeleteModal,
    setFeedDelete,
  } = useContext(ModalContext);
  const router = useRouter();
  async function handleDeleteFeed(feedId: string) {

    if (!userId) {
      setShowLoginModal(true);
    }
    if (!feedId) toast.error("Không tìm thấy bài viết");
    if (userId !== feed?.user_id?.id) {
      toast.error("Bạn không có quyền về bài viết này");
    } else {
      setShowFeedDeleteModal(true);
      setFeedDelete(feed);
      router.refresh();
    }
  }

  return (
    <DropdownMenuItem
      onClick={() => handleDeleteFeed(feed?.id!)}
      className="cursor-pointer text-[15px] text-[#0F172A]"
    >
      Xóa thảo luận
    </DropdownMenuItem>
  );
}


export { DeletedComment };
