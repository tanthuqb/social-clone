"use client"
import { NavItem } from "@/components/shared/navbar/nav-item";
import { FeedCreateButton } from "../feed-create-button";;
import { BgdCommonBadges } from "@/components/master-layout/badges/bgd_commonBadges";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function NavbarMobile({ user, notifications, profile }: { user: Session, notifications: number, profile: Profile }) {
  const pathname = usePathname();
  return (
    <div className="fixed bottom-0 left-0 right-0 w-full bg-trans-white-80 backdrop-blur-sm sm:hidden">
      <div className="flex items-center justify-between gap-1 px-4 py-2 transition-all duration-300">
        <NavItem
          href="/"
          title="Home"
          src="/assets/icons-32/home.png"
          srcActive="/assets/icons-32/home-active.png"
          statusLogin={true}
          routerActive={pathname === "/"}
        />

        <Link href={"/search"}>
          <NavItem
            href="/search"
            title="Search"
            src="/assets/icons-32/search.png"
            srcActive="/assets/icons-32/search-active.png"
            statusLogin={true}
            routerActive={pathname === "/search"}
          />
        </Link>

        <FeedCreateButton profile={profile} user={user} />

        <Link href={"/notifications"} className="relative">
          <NavItem
            href="/notifications"
            title="Notifications"
            src="/assets/icons-32/notifications.png"
            srcActive="/assets/icons-32/notifications-active.png"
            statusLogin={user && user?.user ? true : false}
            notifications={notifications!}
            user={user}
            routerActive={pathname === "/notifications"}
          />
          <div className="absolute left-[34px] top-0.5 flex items-start shadow-sm">
            {notifications != 0 && notifications && (
              <BgdCommonBadges
                text={notifications >= 100 ? 99 : notifications}
                plus={notifications >= 100 ? true : false}
              />
            )}
          </div>
        </Link>


        <NavItem
          href={`/u/${profile?.full_name ?? profile?.id}`}
          title="Me"
          src={"/assets/icons-32/person.png"}
          srcActive={"/assets/icons-32/person-active.png"}
          statusLogin={user && user?.user ? true : false}
          routerActive={pathname === `/u/${profile?.full_name ?? profile?.id}`}
        />
      </div>
    </div>
  );
}
