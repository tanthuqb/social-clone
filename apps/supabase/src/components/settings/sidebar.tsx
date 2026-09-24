"use client";

import { createClient } from "@/lib/supabase/client";
import { usePathname } from "next/navigation";
import { BaseCommonBTN } from "@/components/master-layout";
import Link from "next/link";
import { BaseText } from "@/components/master-layout/base-text";
import { Ban, Shield } from "lucide-react";

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
            text={"Settings"}
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
              text="Edit profile"
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
              text="Edit profile"
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
              text="Account management"
              className="flex gap-2 rounded-full p-2"
            />
          </Link>

          <Link
            href="/settings/privacy"
            className="hover:bg-trans-black-5 rounded-full transition-all duration-300 active:scale-90"
          >
            <div className="flex items-center gap-2 rounded-full p-2">
              <Shield
                aria-hidden
                className={`h-6 w-6 ${pathname === "/settings/privacy" ? "text-neutral-900" : "text-neutral-500"}`}
              />
              <BaseText text="Privacy" className="sz-label-m-semi" textColor="neutral-700" />
            </div>
          </Link>

          <Link
            href="/settings/blocked-users"
            className="hover:bg-trans-black-5 rounded-full transition-all duration-300 active:scale-90"
          >
            <div className="flex items-center gap-2 rounded-full p-2">
              <Ban
                aria-hidden
                className={`h-6 w-6 ${pathname === "/settings/blocked-users" ? "text-neutral-900" : "text-neutral-500"}`}
              />
              <BaseText text="Blocked users" className="sz-label-m-semi" textColor="neutral-700" />
            </div>
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
              text="Language"
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
              text="Support"
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
            text="Log out"
            className="flex gap-2 rounded-full p-2"
          />
        </div>
      </div>
    </div>
  );
}

export default SidebarSetings;
