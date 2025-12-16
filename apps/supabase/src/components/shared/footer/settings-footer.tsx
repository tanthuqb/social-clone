import { HomeIcon, SearchIcon, BellIcon, UserIcon } from "@suzu/ui";
import { NavItem } from "@/components/shared/navbar/nav-item";
import { FeedCreateButton } from "../feed-create-button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsFooter() {
  const supbase = createClient();
  const { data: user, error } = await supbase.auth.getUser();
  const { data: profiles } = await supbase
    .from("profiles")
    .select("*")
    .eq("id", user?.user?.id as string)
    .maybeSingle();
  return (
    <>
      <div className="fixed inset-x-0 bottom-20">
        <div className="flex justify-between gap-2 px-4 md:hidden">
          <div className="text-[15px] font-normal leading-[22.5px] text-gray-900">
            © 2023
          </div>
          <Link
            href=""
            className="text-[15px] font-normal leading-[22.5px] text-gray-900"
          >
            Điều khoản SuZu
          </Link>
          <Link
            href=""
            className="items-center text-center text-[15px] font-normal leading-[22.5px] text-gray-900"
          >
            Chính sách riêng tư
          </Link>
        </div>
        <Link
          href=""
          className="mt-4 flex w-full items-center justify-center text-[15px] font-normal leading-[22.5px] text-gray-900 md:hidden"
        >
          Chính sách bảo mật
        </Link>
      </div>

      <div className="bg-popover fixed bottom-0 left-0 right-0 w-full px-4 md:hidden">
        <div className="py-2 transition-all duration-300">
          <div className="flex items-center justify-between gap-1">
            {/* <NavItem
              href="/"
              title="Home"
              // Icon={HomeIcon}
              statusLogin={user && user?.user ? true : false}
              className=""
            />
            <NavItem
              href="/search"
              title="Search"
              // Icon={SearchIcon}
              statusLogin={user && user?.user ? true : false}
              className=""
            />
            <div
              className="group relative rounded transition-all hover:cursor-pointer"
              title="Create Post"
            >
              <FeedCreateButton className="relative z-10 px-5 py-0.5 group-hover:scale-110" />
            </div>

            <NavItem
              href="/notifications"
              title="Notifications"
              Icon={BellIcon}
              statusLogin={user && user?.user ? true : false}
              className=""
              notifications={notification as unknown as Notifications[]}
            />
            <NavItem
              href={`/u/${profiles?.full_name ?? profiles?.id}`}
              title="Me"
              Icon={UserIcon}
              statusLogin={user && user?.user ? true : false}
              className="h-10"
            /> */}
          </div>
        </div>
      </div>
    </>
  );
}
