"use client";

import { CommonButton, Facebook, Google, Input, Pencil } from "@suzu/ui";
import Link from "next/link";
import { useState } from "react";
import { redirect } from "next/navigation";
function AccountManagement({ session }: { session: Session }) {
  const [activeButton, setActiveButton] = useState(false);
  if (!session?.user?.id) {
    redirect(`/`);
  }
  const handleChangeValue = (value: string) => {
    if (value !== "") {
      setActiveButton(true);
    } else {
      setActiveButton(false);
    }
  };

  return (
    <div className="h-full max-h-full overflow-y-auto">
      <div className="flex min-h-full max-w-xl flex-col gap-2.5">
        <div className="flex w-full flex-col items-start gap-5 rounded-[20px] px-4">
          <div className="flex flex-col items-start gap-1 self-stretch">
            <div className="mb-1 flex items-start justify-between">
              <p className="flex-basis-0 leading-150 text-text-neutral-300 flex-shrink-0 font-sans text-[15px] font-semibold">
                Email của bạn
              </p>
            </div>
            <Input
              className="items-center gap-2 rounded-[8px] border-0 bg-neutral-100 p-2 placeholder:text-neutral-300"
              placeholder="camkhuc99@gmail.com"
              name="mail"
              required
              defaultValue={session?.user?.email as string}
              disabled
            />
          </div>

          {/* {  && (
          )} */}
          <div className="flex flex-col items-start gap-1 self-stretch">
            <div className="mb-1 flex items-start justify-between">
              <p className="flex-shrink-0 font-sans text-[15px] font-semibold text-[#334155]">
                Mật khẩu
              </p>
            </div>
            <PasswordEnabeld session={session} />
          </div>
        </div>

        <div className="flex items-start gap-1 self-stretch px-4">
          <div className="h-[1px] w-full bg-slate-100"></div>
        </div>

        <div className="flex gap-2 self-stretch px-4 py-[5px]">
          <div className="text-[23px] font-semibold">Liên kết tài khoản</div>
        </div>

        <div className="flex w-full max-w-xl justify-between px-4">
          <div className="flex items-center space-x-2 text-center">
            <div className="rounded-full border p-2">
              <Google className="h-4 w-4" />
            </div>
            <div className="text-[15px] font-normal">Google</div>
          </div>

          <div
            className={`rounded-full text-neutral-700 ${session?.user?.app_metadata?.providers?.some(
              (provider: string) => provider == "google",
            )
              ? "border border-black/10"
              : "bg-black/5"
              }`}
          >
            <CommonButton
              text={
                session?.user?.app_metadata?.providers?.some(
                  (provider: string) => provider == "google",
                )
                  ? "Đã kết nối"
                  : "Kết nối"
              }
              states="default"
              activeButton={true}
            />
          </div>
        </div>

        <div className="flex w-full max-w-xl justify-between px-4">
          <div className="flex items-center space-x-2 text-center">
            <div className="rounded-full border p-2">
              <Facebook className="h-4 w-4" />
            </div>
            <div className="text-[15px] font-normal">Facebook</div>
          </div>

          <div
            className={`rounded-full text-neutral-700 ${session?.user?.app_metadata?.providers?.some(
              (provider: string) => provider == "facebook",
            )
              ? "border border-black/10"
              : "bg-black/5"
              }`}
          >
            <CommonButton
              text={
                session?.user?.app_metadata?.providers?.some(
                  (provider: string) => {
                    provider == "facebook";
                  },
                )
                  ? "Đã kết nối"
                  : "Kết nối"
              }
              states="default"
              activeButton={true}
            />
          </div>
        </div>

        <div className="flex-grow border-b border-b-[#1f1f1f/1]"></div>
        <div
          className={`w-full items-center gap-1 self-stretch px-4 text-center md:text-right ${activeButton ? "cursor-pointer" : ""}`}
        >
          <button
            type="submit"
            className="btn btn-default block w-full md:inline-block md:w-auto"
            disabled={!activeButton}
          >
            Cập nhật thông tin
          </button>
        </div>
      </div>
    </div>
  );
}

function PasswordEnabeld({ session }: { session: Session }) {
  const enable = session?.user?.app_metadata?.providers?.some(
    (provider: string) => provider == "email",
  );
  if (enable) {
    return (
      <div className="border-[1F1F1F]/10 relative flex gap-2 self-stretch overflow-hidden rounded-[8px] border bg-white">
        <div className="flex-grow items-center gap-2 rounded-md border-0 p-2 focus:ring-0 md:max-w-[400px]">
          •••••••••
        </div>
        <div className="border-[1F1F1F]/10 flex min-w-[95px] items-center justify-center border-l">
          <CommonButton
            text="Thay đổi"
            href="/settings/account-management/change-password"
          />
        </div>
      </div>
    );
  }
  return (
    <div className="relative flex h-[40px] cursor-not-allowed gap-2 self-stretch overflow-hidden rounded border-0 bg-neutral-100 text-neutral-300">
      <div className="flex-grow items-center gap-2 rounded-md border-0 p-2 focus:ring-0">
        •••••••••
      </div>
      <div className="border-[1F1F1F]/50 flex min-w-[95px] items-center justify-center border-l">
        <span>Thay đổi</span>
      </div>
    </div>
  );
}

export default AccountManagement;
