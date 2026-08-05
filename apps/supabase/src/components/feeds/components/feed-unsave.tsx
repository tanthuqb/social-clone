"use client";
import { DropdownMenuItem, toast } from "@suzu/ui";
import { useContext } from "react";
import { ModalContext } from "@/components/modals/provider";
import { createClient } from "@/lib/supabase/client";
import { unsaveFeedAction } from "@/lib/actions/feedCollections/actions";

function FeedSave({ feed }: { className?: string; feed?: any }) {
  //   const { setShowFeedDeleteModal, setFeedDelete } = useContext(ModalContext);

  async function handleUnsave() {
    // setShowFeedDeleteModal(true);
    // setFeedDelete(feed);
    const supabase = createClient();
    const { data: session, error } = await supabase.auth.getUser();
    if (error) {
      toast.error(error.message);
    }
    const { error: errorFeedCollections } = await unsaveFeedAction(feed.id);

    if (errorFeedCollections) {
      toast.error(errorFeedCollections);
    } else {
      toast.success("Xóa bài lưu thành công");
    }
  }

  return (
    <DropdownMenuItem
      onClick={handleUnsave}
      className="cursor-pointer text-[15px] text-[#0F172A]"
    >
      Lưu bài viết
    </DropdownMenuItem>
  );
}

export { FeedSave };
