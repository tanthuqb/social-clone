"use client";

import { Button, toast } from "@suzu/ui";
import { useContext, useTransition } from "react";
import { ModalContext } from "../provider";
import { deleteFeedAction } from "@/lib/actions/feed/actions";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

function FeedDeleteForm({ feedDelete }: { feedDelete: Feed_Detail }) {
  const { setShowFeedDeleteModal } = useContext(ModalContext);
  const supabase = createClient();
  const router = useRouter();

  const [pending, startMutation] = useTransition();

  const handleDeleteFeed = async () => {
    try {
      await deleteFeedAction(feedDelete?.id!);
      if ((feedDelete?.feed_images?.length ?? 0) > 0) {
        feedDelete?.feed_images?.map(async (imageUrl) => {
          const url: string = imageUrl?.image!;
          const parts: string[] = url?.split("/");
          if (url && parts.length > 0) {
            const filename: string = parts[parts?.length - 1];
            const { data, error } = await supabase.storage
              .from("suzu")
              .remove([filename!]);
          }
        });
        toast.success("Xóa bài viết với ảnh thành công !");
        setShowFeedDeleteModal(false);
        if (feedDelete?.type === "feed") {
          router.push("/")
        }
        router.refresh();
      } else {
        toast.success("Xóa bài viết thành công!");
        setShowFeedDeleteModal(false);
        if (feedDelete?.type === "feed") {
          router.push("/")
        }
        router.refresh();
      }
    } catch (error) {
      toast.error("Xóa bài viết không thành công!");
    }
  };
  return (
    <div className="flex flex-col gap-2.5">
      <div className="text-[18px] font-semibold text-slate-900">
        Xóa bài viết
      </div>
      <div className="text-[15px] font-normal text-slate-900">
        Bạn có chắc chắn là bạn muốn xóa bài viết này không?
      </div>
      <div className="flex justify-end gap-2">
        <Button
          variant="ghost"
          className="rounded-full border"
          onClick={() => setShowFeedDeleteModal(false)}
        >
          Hủy bỏ
        </Button>
        <Button
          className="rounded-full"
          onClick={handleDeleteFeed}
          disabled={pending}
        >
          Xóa bỏ
        </Button>
      </div>
    </div>
  );
}

export default FeedDeleteForm;