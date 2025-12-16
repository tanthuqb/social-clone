"use client";
import { toast, cn, DropdownMenuItem } from '@suzu/ui';
import { useState } from 'react';
import { useContext } from "react";
import { ModalContext } from "@/components/modals/provider";
import { deleteFeedAction, updateFeedAction } from '@/lib/actions/feed/actions';


function ReplyComment({
    animated = true,
    className,
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

    function handleReplyComment() {
        if (!userId) {
            setShowLoginModal(true)
        } else {
            setShowFeedCreateModal(true)
            setFeed(feed)
            setType(true)
            setParentFeedId(feed?.id)
        }
    }

    return (

        <DropdownMenuItem
            // @ts-ignore
            onClick={handleReplyComment}
            className="cursor-pointer text-[15px] text-[#0F172A]">
            Trả lời
        </DropdownMenuItem>
    );
}

export { ReplyComment };
