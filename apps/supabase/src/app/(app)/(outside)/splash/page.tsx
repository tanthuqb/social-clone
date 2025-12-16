import React from "react";
import Image from "next/image";

export default function SplashPage() {
  return (
    <>
      <div className="fixed left-0 top-0 z-50 overflow-hidden bg-[#f1f1f1]">
        <div className="flex h-dvh w-screen flex-col items-center justify-center">
          <img
            src="/assets/img_logo.png"
            className="size-[128px] md:size-[164px]"
            alt="logo"
          />
          <div className="relative z-10 mt-10 md:mt-14">
            <span className="absolute bottom-0 left-0 text-6xl font-bold uppercase tracking-[5px] text-neutral-200 md:-bottom-1 md:text-7xl">
              suzu
            </span>
            <p className="relative z-10 bg-white p-1 uppercase tracking-[5px] md:tracking-[8px]">
              mạng xã hội
            </p>
            <span className="absolute left-0 top-0 text-6xl font-bold uppercase tracking-[5px] text-neutral-200 md:-top-1 md:text-7xl">
              suzu
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
