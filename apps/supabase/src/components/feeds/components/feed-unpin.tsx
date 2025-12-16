"use client";
import { DropdownMenuItem, toast } from "@suzu/ui";
import { useContext } from "react";
import { ModalContext } from "@/components/modals/provider";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/router";

function FeedUnpin({
  feed,
  userId,
}: {
  className?: string;
  feed?: any;
  userId: string;
}) {
  //   const { setShowFeedDeleteModal, setFeedDelete } = useContext(ModalContext);
  async function handlePin() {
    // setShowFeedDeleteModal(true);
    // setFeedDelete(feed);
    const supabase = createClient();
    const { data: session, error } = await supabase.auth.getUser();
    if (error) {
      toast.error(error.message);
    }
    const { data: pinned } = await supabase
      .from("feeds")
      .select("id,user_id")
      .eq("user_id", userId)
      .eq("id", feed?.id)
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
      if (errorFeed_unpin) {
        toast.error(errorFeed_unpin.message);
      } else {
        toast.success("Bỏ ghim bài viết thành công");
        window.location.reload();
      }
    } else {
      toast.error("Bài viết chưa được ghim");
    }
  }

  return (
    <DropdownMenuItem
      onClick={handlePin}
      className="cursor-pointer text-[15px] text-[#0F172A]"
    >
      Ghim bài viết
    </DropdownMenuItem>
  );
}

export { FeedUnpin };
