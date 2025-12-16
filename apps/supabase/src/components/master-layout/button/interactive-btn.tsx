"use client";

import { ReactionState } from "@/lib/supabase/database.types";
import { BaseCommonBTN } from "./base-common-btn";
import { cn } from "@suzu/ui";

interface InteractiveBTNProps {
  className: string;
  text?: string;
  isButton: boolean;
  inFeed: boolean;
  type: number;
  state?: ReactionState;
  srcImageHover?: string;
  action?: () => void;
}

const InteractiveBTN = ({
  className,
  text,
  isButton,
  type,
  state,
  srcImageHover,
  inFeed,
  action,
}: InteractiveBTNProps) => {
  let srcImage = "/assets/icons/bookmarks-icon-24.png";
  if (type === 1 && state === ReactionState.NEUTRAL) {
    srcImage = "/assets/icons/sparkling-icon-24.png";
  } else if (type === 1 && state === ReactionState.LIKE) {
    srcImage = "/assets/icons/sparkling-active-icon-24.png";
  } else if (type === 2 && state === ReactionState.NEUTRAL) {
    srcImage = "/assets/icons/mendling-icon-24.png";
  } else if (type === 2 && state === ReactionState.DISLIKE) {
    srcImage = "/assets/icons/mendling-active-icon-24.png";
  } else if (type === 3) {
    srcImage = "/assets/icons/comment-icon-24.png";
  } else if (type === 4) {
    srcImage = "/assets/icons/share-icon-24.png";
  } else if (type === 5) {
    srcImage = "/assets/icons-24/reply.png";
  } else if (type === 1 && state === ReactionState.ACTIVE) {
    srcImage = "/assets/icons/sparkling-active-icon-24.png";
  } else if (type === 2 && state === ReactionState.ACTIVE) {
    srcImage = "/assets/icons/mendling-active-icon-24.png";
  }

  return (
    <div
      className={cn("flex items-start", className, {
        "rounded-l-full": type === 1,
        "rounded-r-full": type === 2,
        "rounded-full": type === 3 || type === 4 || type === 5,
      })}
    >
      <BaseCommonBTN
        text={text}
        srcImgLeft={srcImageHover ? srcImageHover : srcImage}
        isButton={isButton}
        onClick={action}
        className={`flex items-center ${inFeed ? "gap-1 p-2" : ""}`}
        inFeed={inFeed}
      />
    </div>
  );
};

export { InteractiveBTN };
