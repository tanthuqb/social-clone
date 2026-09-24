"use client";

import { Button, toast } from "@suzu/ui";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { unhideFeedAction } from "@/lib/actions/moderation/actions";

/** Post page placeholder for a post the viewer hid. */
export function HiddenFeedNotice({ feedId }: { feedId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const unhide = () =>
    startTransition(async () => {
      const { error } = await unhideFeedAction(feedId);
      if (error) {
        toast.error(error);
        return;
      }
      toast.success("Post unhidden");
      router.refresh();
    });

  return (
    <div
      className="flex flex-col items-center gap-3 bg-white p-8 text-center sm:rounded-2xl"
      data-testid="feed-hidden-page"
    >
      <div className="text-[18px] font-semibold text-slate-900">You hid this post</div>
      <div className="text-[15px] text-slate-500">
        Hidden posts don&apos;t appear in your feed, on profiles or in search.
      </div>
      <Button className="rounded-full" onClick={unhide} disabled={pending}>
        Unhide
      </Button>
    </div>
  );
}
