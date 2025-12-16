import { BaseIconBTN } from "@/components/master-layout";
import ModalProvider from "@/components/modals/provider";
import MainSidebar from "@/components/shared/sidebar/main-sidebar";
import { Toaster } from "@suzu/ui";
import localFont from "next/font/local";
import React from "react";

const inter = localFont({
  src: [
    {
      path: "./InterVariable.woff2",
      style: "normal",
    },
    {
      path: "./InterVariable-Italic.woff2",
      style: "italic",
    },
  ],
  variable: "--font-inter",
  weight: "100 900",
});

export default function NotFound() {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} bg-neutral-100 font-sans`}>
        <ModalProvider>
          <MainSidebar />
          <main className="mx-auto flex h-dvh max-w-xl flex-col justify-center">
            <div className="rounded-3xl bg-neutral-50 shadow-[0px_1px_2px_0px_#1018280F,_0px_1px_3px_0px_#1018281A]">
              <div className="flex flex-col items-center gap-4 px-4 py-6 text-center">
                <img src="/assets/error.png" alt="" />
                <div className="flex flex-col">
                  <h2 className="text-[23px] font-semibold">
                    404 - Trang không tồn tại
                  </h2>
                  <p className="text-neutral-500">
                    Xin lỗi, máy chủ của chúng tôi gặp sự cố và không thể xử lý
                    yêu cầu của bạn. Chúng tôi đang làm việc để khắc phục vấn đề
                    này.
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
        </ModalProvider>
        <Toaster richColors position="bottom-center" />
      </body>
    </html>
  );
}
