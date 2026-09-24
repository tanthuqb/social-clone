"use client";
import { DropdownMenuItem, toast } from "@suzu/ui";
import { useContext } from "react";
import { ModalContext } from "@/components/modals/provider";
import { createClient } from "@/lib/supabase/client";
import { togglePinAction } from "@/lib/actions/feed/actions";

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
      const { error: errorFeed_unpin } = await togglePinAction(
        pinned.id,
        false,
      );
      if (errorFeed_unpin) {
        toast.error(errorFeed_unpin);
      } else {
        toast.success("Post unpinned successfully");
        window.location.reload();
      }
    } else {
      toast.error("This post is not pinned");
    }
  }

  return (
    <DropdownMenuItem
      onClick={handlePin}
      className="cursor-pointer text-[15px] text-[#0F172A]"
    >
      Unpin post
    </DropdownMenuItem>
  );
}

export { FeedUnpin };
