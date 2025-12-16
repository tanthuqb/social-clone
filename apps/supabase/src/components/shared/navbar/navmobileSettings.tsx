import Link from "next/link";
import { BackButton } from "@suzu/ui";

import { Logo } from "@suzu/ui";
import NavTitleMbSettings from "./navTitleMobileSettings";
import { createClient } from "@/lib/supabase/server";
import DropdownMenuComponent from "../dropdownMenu/dropdown-menu";

export default async function NavbarMbSetings({ inFeed }: { inFeed: boolean }) {
  const supbase = createClient();
  const { data: user, error } = await supbase.auth.getUser();
  const { data: profile } = await supbase
    .from("profiles")
    .select("*")
    .eq("id", user?.user?.id as string)
    .single();
  let notification = undefined;
  if (user?.user?.id) {
    const { count: totalCount, error } = await supbase
      .from("notifications")
      .select("*", { count: "exact" })
      .eq("status", false)
      .eq("user_noti_id", user?.user?.id)
      .neq("user_id", user?.user?.id);
    if (totalCount) notification = totalCount;
  }
  return (
    <div className="px-0 mb-2 md:px-4">
      <nav className="flex items-center justify-between max-w-6xl py-2 mx-auto transition-all duration-300">
        <h1 className="hidden font-semibold transition-all cursor-pointer group active:scale-90 md:block">
          <Link href="/" className="">
            <Logo className="group-hover:scale-110" />
          </Link>
        </h1>
        <div className="md:hidden">
          <BackButton currentResource="settings" />
        </div>
        <div className="items-center justify-between hidden gap-1 md:flex"></div>
        <NavTitleMbSettings />
        <div className="flex items-center space-x-2">
          {/* <ModeToggle /> */}
          <DropdownMenuComponent user={user} iconTrigger="menu" />
        </div>
      </nav>
    </div>
  );
}
