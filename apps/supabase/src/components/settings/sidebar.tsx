"use client";

import { createClient } from "@/lib/supabase/client";
import { usePathname } from "next/navigation";
import { BaseCommonBTN } from "../master-layout";
import Link from "next/link";
import { BaseText } from "../master-layout/base-text";

function SidebarSetings() {
  const supabase = createClient();
  const pathname = usePathname();

  const handleSignout = async () => {
    const { error } = await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="relative h-full w-[280px] px-2 pb-5 pt-4 z-0">
      <div className="flex h-full flex-col">
        <div className="relative z-10 hidden h-16 items-center gap-2.5 self-stretch px-2 sm:flex">
          <BaseText
            text={"Cài đặt"}
            textColor="neutral-700"
            className="sz-text-h5-semi"
          />
        </div>

        <div className="flex flex-1 flex-col gap-2">
          {/* Profile */}
          <Link
            href="/settings"
            className="hover:bg-trans-black-5 hidden rounded-full transition-all duration-300 active:scale-90 sm:block"
          >
            <BaseCommonBTN
              isButton={false}
              srcImgLeft={`${pathname === "/settings" ? "/assets/icons-24/person-active.png" : "/assets/icons-24/person.png"}`}
              text="Chỉnh sửa hồ sơ"
              className="flex gap-2 rounded-full p-2"
            />
          </Link>

          <Link
            href="/settings/edit-profile"
            className="hover:bg-trans-black-5 block rounded-full transition-all duration-300 active:scale-90 sm:hidden"
          >
            <BaseCommonBTN
              isButton={false}
              srcImgLeft={`${pathname === "/settings/edit-profile" ? "/assets/icons-24/person-active.png" : "/assets/icons-24/person.png"}`}
              text="Chỉnh sửa hồ sơ"
              className="flex gap-2 rounded-full p-2"
            />
          </Link>

          <Link
            href="/settings/account-management"
            className="hover:bg-trans-black-5 rounded-full transition-all duration-300 active:scale-90"
          >
            <BaseCommonBTN
              isButton={false}
              srcImgLeft={`${pathname === "/settings/account-management" || pathname === "/settings/account-management/change-password" ? "/assets/icons-24/lock-active.png" : "/assets/icons-24/lock.png"}`}
              text="Quản lý tài khoản"
              className="flex gap-2 rounded-full p-2"
            />
          </Link>
          <div className="px-4">
            <div className="h-[1px] bg-black/10"></div>
          </div>

          <Link
            href="/settings/language"
            className="hover:bg-trans-black-5 rounded-full transition-all duration-300 active:scale-90"
          >
            <BaseCommonBTN
              isButton={false}
              srcImgLeft={`${pathname === "/settings/language" ? "/assets/icons-24/translate-active.png" : "/assets/icons-24/translate.png"}`}
              text="Ngôn ngữ"
              className="flex gap-2 rounded-full p-2"
            />
          </Link>
          <div className="px-4">
            <div className="h-[1px] bg-black/10"></div>
          </div>

          <Link
            href="/settings/support"
            className="hover:bg-trans-black-5 rounded-full transition-all duration-300 active:scale-90"
          >
            <BaseCommonBTN
              isButton={false}
              srcImgLeft={`${pathname === "/settings/support" ? "/assets/icons-24/support-active.png" : "/assets/icons-24/support.png"}`}
              text="Hỗ trợ"
              className="flex gap-2 rounded-full p-2"
            />
          </Link>
        </div>

        <div
          onClick={handleSignout}
          className="hover:bg-trans-black-5 rounded-full transition-all duration-300 active:scale-90"
        >
          <BaseCommonBTN
            isButton={false}
            srcImgLeft="/assets/icons-24/logout.png"
            text="Đăng xuất"
            className="flex gap-2 rounded-full p-2"
          />
        </div>
      </div>
    </div>
  );
}

export default SidebarSetings;
