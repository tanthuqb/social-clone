"use client";

import { Button, toast } from "@suzu/ui";
import { useContext, useTransition } from "react";
import { ModalContext } from "@/components/modals/provider";
import { deleteFeedAction } from "@/lib/actions/feed/actions";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { FEED_MEDIA_BUCKET, objectPathFromPublicUrl } from "@/lib/storage";

function FeedDeleteForm({ feedDelete }: { feedDelete: Feed_Detail }) {
  const { setShowFeedDeleteModal } = useContext(ModalContext);
  const supabase = createClient();
  const router = useRouter();

  const [pending, startMutation] = useTransition();

  const handleDeleteFeed = () => {
    startMutation(async () => {
      try {
        await deleteFeedAction(feedDelete?.id!);
      } catch (error) {
        toast.error((error as Error)?.message || "Failed to delete post!");
        return;
      }
      const paths = (feedDelete?.feed_images ?? [])
        .map((image) => objectPathFromPublicUrl(image?.image, FEED_MEDIA_BUCKET))
        .filter((path): path is string => !!path);
      if (paths.length > 0) {
        await supabase.storage.from(FEED_MEDIA_BUCKET).remove(paths);
      }
      toast.success(
        paths.length > 0
          ? "Post and images deleted successfully!"
          : "Post deleted successfully!",
      );
      setShowFeedDeleteModal(false);
      if (feedDelete?.type === "feed") {
        router.push("/");
      }
      router.refresh();
    });
  };
  return (
    <div className="flex flex-col gap-2.5">
      <div className="text-[18px] font-semibold text-slate-900">
        Delete post
      </div>
      <div className="text-[15px] font-normal text-slate-900">
        Are you sure you want to delete this post?
      </div>
      <div className="flex justify-end gap-2">
        <Button
          variant="ghost"
          className="rounded-full border"
          onClick={() => setShowFeedDeleteModal(false)}
        >
          Cancel
        </Button>
        <Button
          className="rounded-full"
          onClick={handleDeleteFeed}
          disabled={pending}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export default FeedDeleteForm;