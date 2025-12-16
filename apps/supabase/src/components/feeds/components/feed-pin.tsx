"use client";
import { CheckIcon, DropdownMenuItem, toast } from "@suzu/ui";
import { useContext, useState } from "react";
import { ModalContext } from "@/components/modals/provider";
import { createClient } from "@/lib/supabase/client";

function FeedPin({
  feed,
  userId,
}: {
  className?: string;
  feed?: Feed | Feed_Detail;
  userId: string;
}) {
  const { setShowLoginModal } = useContext(ModalContext);
  async function handlePin() {
    if (!userId) {
      setShowLoginModal(true);
    } else {
      const supabase = createClient();
      const { data: session, error } = await supabase.auth.getUser();
      if (error) {
        toast.error(error.message);
      }
      const { data: pinned } = await supabase
        .from("feeds")
        .select("id,user_id")
        .eq("user_id", userId)
        .eq("pin", true)
        .single();
      if (pinned) {
        const { data: feed_unpin, error: errorFeed_unpin } = await supabase
          .from("feeds")
          .update({
            pin: false,
          })
          .eq("id", pinned.id)
          .single();
      }
      if (pinned?.id !== feed?.id) {
        const { data: feed_pin, error: errorFeed_pin } = await supabase
          .from("feeds")
          .update({
            pin: true,
          })
          .eq("id", feed?.id)
          .single();

        if (errorFeed_pin) {
          toast.error(errorFeed_pin.message);
        } else {
          toast("Ghim bài viết thành công", {
            icon: <CheckIcon />,
            duration: 5000,
          });
          window.location.reload();
        }
      } else {
        toast("Bỏ ghim bài viết thành công!", {
          icon: <CheckIcon />,
          duration: 5000,
        });
      }
    }
  }
  return (
    <DropdownMenuItem
      onClick={handlePin}
      className="cursor-pointer text-[15px] text-[#0F172A]"
    >
      {feed?.pin ? "Bỏ ghim bài viết" : "Ghim bài viết"}
    </DropdownMenuItem>
  );
}

export { FeedPin };
