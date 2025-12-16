"use client";

import { BaseText } from "@/components/master-layout/base-text";
import { useContentTiptap } from "@/components/tiptap/providers/content-provider";
import { useCountCharacters } from "@/components/tiptap/providers/count-character-provider";
import { LoadingSpinner } from "@suzu/ui";
import { memo } from "react";

interface FooterModalProps {
  files: File[];
  editing: boolean;
  parentFeedId: string | undefined;
  type: boolean;
  loading: boolean;
}
const FooterModal = memo(
  ({ files, editing, parentFeedId, type, loading }: FooterModalProps) => {
    const { content } = useContentTiptap();
    const { countCharacters } = useCountCharacters();

    // regex presents whole charaters are spaces
    const contentRegex = /^<p>\s*<\/p>$/;

    /**
     * fucntion "getCurrentState"
     * Check state to allow post a feed:
     *    - no character and check whole charaters are spaces
     *    - file images is less than 10 files
     */
    function getCurrentState() {
      if (content) {
        //
        const isContentRegex = contentRegex.test(content) ? true : false;
        if (
          (countCharacters === 0 && files.length === 0) ||
          (files.length === 0 && isContentRegex) ||
          files.length > 10
        ) {
          return true;
        }
      }

      return false;
    }
    // end getCurrentState

    // if true: no feed or comment disallow posted
    const currentState = getCurrentState();

    const getTextSubmit = type
      ? editing === true && parentFeedId === undefined
        ? "Cập nhật"
        : parentFeedId === undefined && editing === false
          ? "Bình luận"
          : "Bình luận"
      : editing
        ? "Cập nhật"
        : loading
          ? "Đăng bài..."
          : "Đăng bài";

    return (
      <div className="flex items-center justify-end gap-2.5 self-stretch p-4">
        {countCharacters >= 250 && (
          <BaseText
            text={`${countCharacters}/300`}
            className="sz-parag-reg"
            textColor="neutral-500"
          />
        )}
        <button
          type="submit"
          title="post"
          className={`rounded-full flex gap-2 px-4 py-2 transition-all duration-300 ${currentState || loading ? "bg-trans-black-5" : "bg-neutral-900"}`}
          disabled={currentState || loading}
        >
          {loading && <LoadingSpinner />}
          <BaseText
            className="sz-label-m-semi"
            textColor={`${currentState ? "neutral-300" : "white"}`}
            text={getTextSubmit}
          />
        </button>
      </div>
    );
  },
);

export { FooterModal };
