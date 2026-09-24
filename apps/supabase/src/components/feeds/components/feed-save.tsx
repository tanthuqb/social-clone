"use client";
import { DropdownMenuItem, toast } from "@suzu/ui";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  isFeedSavedAction,
  saveFeedAction,
  unsaveFeedAction,
} from "@/lib/actions/feedCollections/actions";

/** Menu item that saves a post to, or removes it from, the user's collection. */
function FeedSave({ feed }: { className?: string; feed?: Feed_Detail }) {
  const router = useRouter();
  const [saved, setSaved] = useState<boolean | null>(null);
  const feedId = feed?.id;

  useEffect(() => {
    if (!feedId) return;
    let cancelled = false;
    isFeedSavedAction(feedId).then((value) => {
      if (!cancelled) setSaved(value);
    });
    return () => {
      cancelled = true;
    };
  }, [feedId]);

  async function handleToggle() {
    if (!feedId) return;
    const { error } = saved
      ? await unsaveFeedAction(feedId)
      : await saveFeedAction(feedId);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success(saved ? "Removed from saved" : "Post saved successfully");
    setSaved(!saved);
    router.refresh();
  }

  return (
    <DropdownMenuItem
      onClick={handleToggle}
      disabled={saved === null}
      className="cursor-pointer text-[15px] text-[#0F172A]"
      data-testid="feed-save-toggle"
    >
      {saved ? "Remove from saved" : "Save post"}
    </DropdownMenuItem>
  );
}

export { FeedSave };
