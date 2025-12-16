"use client";
import { BaseIconBTN } from "@/components/master-layout";
import { useParams } from "next/navigation";

export default async function Page() {
  const path = useParams();
  const { errorMessage } = path;

  return (
    <main className="mx-auto flex h-dvh max-w-xl flex-col justify-center">
      <div className="rounded-3xl bg-neutral-50 shadow-[0px_1px_2px_0px_#1018280F,_0px_1px_3px_0px_#1018281A]">
        <div className="flex flex-col items-center gap-4 px-4 py-6 text-center">
          <img src="/assets/error.png" alt="" />
          <div className="flex flex-col">
            <h2 className="text-[23px] font-semibold">Đã có lỗi xảy ra</h2>
            <p className="text-neutral-500">
              {errorMessage
                ? errorMessage
                : "Xin lỗi, máy chủ của chúng tôi gặp sự cố và không thể xử lý yêu cầucủa bạn.\nChúng tôi đang làm việc để khắc phục vấn đề này."}
            </p>
          </div>
          <div className="block">
            <button
              type="submit"
              className="btn btn-default inline-block h-10 w-full py-0 pr-0"
              disabled={!true}
            >
              <div className="flex items-center gap-2">
                <span>Quay về trang chủ</span>
                <BaseIconBTN
                  src="/assets/icons-24/arrow_white.png"
                  className="hover:bg-trans-black-5 rounded-full p-2"
                  width={24}
                  height={24}
                />
              </div>
            </button>
          </div>
        </div>
        {/* <h2>Not Found</h2>
              <p>Could not find requested resource</p>
              <Link href="/">Return Home</Link> */}
      </div>
    </main>
  );
}
