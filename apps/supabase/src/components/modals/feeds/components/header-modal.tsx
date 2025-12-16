"use client";

import { BaseIconBTN } from "@/components/master-layout";
import { BaseText } from "@/components/master-layout/base-text";
import { memo, useContext } from "react";
import { ModalContext } from "../../provider";
import { useRouter } from "next/navigation";
import { useCountCharacters } from "@/components/tiptap/providers/count-character-provider";

const HeaderModal = memo(({
  type,
  editing,
  parentFeedId,
}: {
  type: boolean;
  editing: boolean;
  parentFeedId: string | undefined;
}) => {
  const { setShowFeedCreateModal, setShowCancelFeedModal, setFeed } =
    useContext(ModalContext);
  const router = useRouter();
  const { countCharacters } = useCountCharacters();

  /**
  * handCloseFeed
  */
  const handCloseFeed = () => {
    if (countCharacters > 0) {
      setShowCancelFeedModal(true);
      setFeed(undefined);
      router.refresh();
    } else {
      setShowFeedCreateModal(false);
      setFeed(undefined);
      router.refresh();
    }
  };
  // end "handCloseFeed"

  const getTitle = type
    ? editing === true && parentFeedId === undefined
      ? "Chỉnh sửa thảo luận"
      : parentFeedId === undefined && editing === false
        ? "Bình luận bài viết"
        : "Trả lời bình luận"
    : editing
      ? "Chỉnh sửa bài viết"
      : "Bài viết mới";
  return (
    <div className="flex w-full flex-shrink-0 items-center justify-between gap-2">
      <BaseIconBTN
        className="h-10 w-10 opacity-0"
        src=""
        width={24}
        height={24}
      />
      <BaseText className="sz-h6-m-semi" text={getTitle} />
      <button
        type="button"
        title="close"
        onClick={handCloseFeed}
      >
        <BaseIconBTN
          className="p-2"
          width={24}
          height={24}
          src={"/assets/icons/close-icon-24.png"}
        />
      </button>
    </div>
  );
})

export { HeaderModal };
