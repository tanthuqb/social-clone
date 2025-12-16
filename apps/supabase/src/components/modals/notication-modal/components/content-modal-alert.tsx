"use client";

import { useContext } from "react";
import { ModalContext } from "../../provider";
import { CommonButton } from "@suzu/ui";

const ContentModalAlert = () => {
  const { setShowCancelFeedModal, setShowFeedCreateModal } =
    useContext(ModalContext);
  return (
    <div className="flex transform flex-col items-start gap-2.5 rounded-t-2xl bg-white p-4 transition-all">
      <div className="flex flex-col gap-2.5 self-stretch text-left">
        <div className="text-left text-[23px] font-semibold text-slate-700">
          Hủy bỏ bài viết?
        </div>
        <div className="text-[15px] font-normal text-slate-900">
          Nếu bạn bỏ mô tả bài viết ngay bây giờ, bạn sẻ bị mất nội dung trong
          bài viết.
        </div>
      </div>
      <div className="flex items-start gap-1 self-stretch">
        <div
          className="mt-2.5 w-full cursor-pointer items-center self-stretch text-center"
          onClick={() => {
            setShowCancelFeedModal(false), setShowFeedCreateModal(false);
          }}
        >
          <div className="rounded-full border border-slate-100 text-slate-900">
            <CommonButton text="Hủy bỏ" states="default" activeButton={false} />
          </div>
        </div>
        <div
          className="mt-2.5 w-full cursor-pointer items-center self-stretch text-center"
          onClick={() => setShowCancelFeedModal(false)}
        >
          <div className="rounded-full bg-slate-900">
            <CommonButton
              text="Tiếp tục"
              states="default"
              activeButton={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export { ContentModalAlert };
