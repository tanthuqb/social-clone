"use client";
import { DropdownMenuItem, toast } from "@suzu/ui";
import { useContext } from "react";
import { ModalContext } from "@/components/modals/provider";
import { createClient } from "@/lib/supabase/client";

function FeedSave({ feed }: { className?: string; feed?: any }) {
  //   const { setShowFeedDeleteModal, setFeedDelete } = useContext(ModalContext);

  async function handleSave() {
    // setShowFeedDeleteModal(true);
    // setFeedDelete(feed);
    const supabase = createClient();
    const { data: session, error } = await supabase.auth.getUser();
    if (error) {
      toast.error(error.message);
    }
    const { data: feed_collections, error: errorFeedCollections } =
      await supabase
        .from("feed_collections")
        .insert({
          user_id: session?.user?.id,
          feed_id: feed.id,
        })
        .single();
    // console.log(feed_collections);

    if (errorFeedCollections) {
      toast.error(errorFeedCollections.message);
    } else {
      toast.success("Lưu bài viết thành công");
    }
  }

  return (
    <DropdownMenuItem
      onClick={handleSave}
      className="cursor-pointer text-[15px] text-[#0F172A]"
    >
      Lưu bài viết
    </DropdownMenuItem>
  );
}

export { FeedSave };
