"use client";

import { useContext } from "react";
import { cn } from "@suzu/ui";
import { ModalContext } from "@/components/modals/provider";
import { createClient } from "@/lib/supabase/client";
import { BaseIconBTN } from "../master-layout";
import { useMediaQuery } from "node_modules/@suzu/ui/src/components/hooks";

const FeedCreateButton = ({
  className,
  user,
  profile,
}: {
  className?: string;
  user?: Session | null;
  profile?: Profile | null;
}) => {
  const {
    setShowFeedCreateModal,
    setShowLoginModal,
    setFeed,
    setType,
    setSession,
    setParentFeedId,
    setUserProfile,
  } = useContext(ModalContext);

  const { isMobile } = useMediaQuery();

  const handleCreatePost = async () => {
    const supabase = createClient();
    const { data: session } = await supabase.auth.getUser();

    if (session && session?.user) {
      setShowFeedCreateModal(true);
      setType(false);
      setSession(session!);
      setUserProfile(profile!);
      setFeed(undefined);
      setParentFeedId(undefined);
    } else {
      setShowLoginModal(true);
      setType(false);
      setParentFeedId(undefined);
    }
  };

  return (
    <button
      className={cn("block transition-all sm:p-1", className)}
      onClick={handleCreatePost}
      title="Create Post"
    >
      <BaseIconBTN
        src="/assets/icons-32/plus.png"
        alt=""
        className={`shadow-common-xl rounded-bl-[4px] rounded-br-[12px] rounded-tl-[12px] rounded-tr-[4px] bg-white ${isMobile ? "px-3 py-2" : "p-3"} hover:bg-trans-black-10 transition-all duration-300 hover:rounded-full hover:rounded-bl-[4px] hover:rounded-br-[12px] hover:rounded-tl-[12px] hover:rounded-tr-[4px]`}
        width={isMobile ? 24 : 32}
        height={isMobile ? 24 : 32}
      />
    </button>
  );
};

export { FeedCreateButton };
