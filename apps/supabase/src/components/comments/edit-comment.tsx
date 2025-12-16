"use client";
import { toast, cn, DropdownMenuItem } from '@suzu/ui';
import { useState } from 'react';
import { useContext } from "react";
import { ModalContext } from "@/components/modals/provider";


function EditComment({
  feed,
  userId,
}: {
  animated?: boolean;
  className?: string;
  feed?: any;
  userId?: string;
}) {
  const { setShowFeedCreateModal, setShowLoginModal, setFeed, setType, setParentFeedId } =
    useContext(ModalContext);

  function handleEditComment() {
    if (!userId) {
      setShowLoginModal(true)
    } else {
      setShowFeedCreateModal(true)
      setFeed(feed)
      setType(true)
      setParentFeedId(undefined)
    }
  }

  return (

    <DropdownMenuItem
      // @ts-ignore
      onClick={handleEditComment}
      className="cursor-pointer text-[15px] text-[#0F172A]">
      Chỉnh sửa thảo luận
    </DropdownMenuItem>
  );
}

export { EditComment };
