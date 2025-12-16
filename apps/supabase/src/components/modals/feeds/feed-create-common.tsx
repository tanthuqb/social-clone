"use client";
import { memo, useContext } from "react";
import { ModalContext } from "@/components/modals/provider";
import { Avatar } from "@/components/shared/avatar";
import { cn } from "@suzu/ui";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BaseIconBTN } from "@/components/master-layout";
import { BaseText } from "@/components/master-layout/base-text";
import { useMediaQuery } from "node_modules/@suzu/ui/src/components/hooks";

const FeedCreateCommon = memo(
  ({
    user,
    feed,
    comment,
    session,
    inFeed,
  }: {
    user: Profile;
    feed?: Feed_Detail;
    comment?: any;
    session?: Session;
    inFeed?: boolean;
  }) => {
    const {
      setShowLoginModal,
      setType,
      setShowFeedCreateModal,
      setParentFeedId,
      setUserProfile,
      setSession,
    } = useContext(ModalContext);
    const pathname = usePathname();
    const checkPathName = pathname === `/p/${feed?.id}`;
    const { isMobile } = useMediaQuery();

    const handleCreateFeed = async () => {
      const supabase = createClient();
      const { data: session } = await supabase.auth.getUser();

      // Check user login
      if (session.user === null) {
        setShowLoginModal(true);
      } else {
        if (checkPathName) {
          setShowFeedCreateModal(true);
          setType(true);
          setUserProfile(user);
          setSession(session);
          setParentFeedId(undefined);
        } else {
          setShowFeedCreateModal(true);
          setUserProfile(user);
          setSession(session);
          setType(false);
          setParentFeedId(undefined);
        }
      }
    };

    return (
      <div
        className={`flex cursor-pointer flex-col bg-white p-4 ${checkPathName ? "border-b-trans-black-10 border-b" : "mb-2 shadow sm:rounded-xl"}`}
        onClick={handleCreateFeed}
      >
        <div className="flex items-center gap-2">
          <Avatar user={user!} session={session} />
          <span className="flex flex-1 items-center">
            <BaseText
              className="sz-parag-reg line-clamp-1"
              text={
                checkPathName
                  ? "Viết bình luận bây giờ"
                  : "Chia sẻ cảm nghĩ của bạn ngay bây giờ..."
              }
              textColor="slate-500"
            />
          </span>
          <BaseIconBTN
            className={cn("p-2", { hidden: checkPathName || isMobile })}
            src={"/assets/icons-24/add-photo-alternate.png"}
            width={24}
            height={24}
          />
          <div className="rounded-full border border-neutral-300 bg-white px-4 py-2">
            <BaseText
              className="sz-label-m-semi"
              text={`${checkPathName ? "Bình luận" : "Đăng"}`}
              textColor="neutral-900"
            />
          </div>
        </div>
      </div>
    );
  },
);

export default FeedCreateCommon;
