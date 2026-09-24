"use client";

import { Button, toast } from "@suzu/ui";
import { ReactNode, createContext, useCallback, useContext, useMemo, useState } from "react";
import { hideFeedAction, unhideFeedAction } from "@/lib/actions/moderation/actions";

const FeedCardContext = createContext<{ hidePost: () => Promise<void> } | null>(null);

/** Card-level actions for menu items rendered inside a feed card. */
export const useFeedCard = () => useContext(FeedCardContext);

/**
 * Wraps one feed card. "Hide post" swaps the card for a small placeholder with
 * Undo (and an Undo toast); the hidden_feeds row keeps it out of later loads.
 */
export function FeedCardProvider({
  feedId,
  className,
  children,
}: {
  feedId: string;
  className?: string;
  children: ReactNode;
}) {
  const [hidden, setHidden] = useState(false);

  const undo = useCallback(async () => {
    const { error } = await unhideFeedAction(feedId);
    if (error) {
      toast.error(error);
      return;
    }
    setHidden(false);
  }, [feedId]);

  const hidePost = useCallback(async () => {
    const { error } = await hideFeedAction(feedId);
    if (error) {
      toast.error(error);
      return;
    }
    setHidden(true);
    toast("Post hidden", {
      duration: 6000,
      action: { label: "Undo", onClick: () => void undo() },
    });
  }, [feedId, undo]);

  const value = useMemo(() => ({ hidePost }), [hidePost]);

  if (hidden) {
    return (
      <div
        className={`shadow-common-sm flex w-full items-center justify-between gap-4 bg-white p-4 sm:rounded-2xl ${className ?? ""}`}
        data-testid="feed-hidden"
        data-feed-id={feedId}
      >
        <div className="flex flex-col">
          <span className="text-[15px] font-semibold text-slate-900">Post hidden</span>
          <span className="text-[13px] text-slate-500">
            You won&apos;t see this post in your feed.
          </span>
        </div>
        <Button variant="ghost" className="rounded-full border" onClick={() => void undo()}>
          Undo
        </Button>
      </div>
    );
  }

  return <FeedCardContext.Provider value={value}>{children}</FeedCardContext.Provider>;
}
