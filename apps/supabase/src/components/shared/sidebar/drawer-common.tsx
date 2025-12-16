"use client";

import { NavItem } from "@/components/shared/navbar/nav-item";
import { BaseIconBTN } from "@/components/master-layout";
import { SetStateAction, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { FeedCreateButton } from "../feed-create-button";
import { BgdCommonBadges } from "@/components/master-layout/badges/bgd_commonBadges";
import DropdownMenuComponent from "../dropdownMenu/dropdown-menu";
import { DrawerSearch } from "@/components/search/drawer-search";
import { DrawerNoti } from "@/components/notifications/drawer-noti";
import { cn } from "@suzu/ui";
import { useMediaQuery } from "node_modules/@suzu/ui/src/components/hooks";
import { effect } from "zod";

interface DrawerSearchProps {
  session: Session;
  notifications?: number;
  profile: Profile;
  userFeatured?: UserFeatured[];
}
function DrawerCommon({
  session,
  notifications,
  profile,
  userFeatured,
}: DrawerSearchProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const { isMobile } = useMediaQuery();
  const [drawerOpen, setDrawerOpen] = useState<Record<string, boolean>>({});
  const [withoutDrawer, setWithoutDrawer] = useState<boolean>(false);

  useEffect(() => {
    let timer = setTimeout(() => {
      let val = Object.keys(drawerOpen).filter((v) => drawerOpen[v]).length > 0;
      setWithoutDrawer(val);
    }, 200);

    return () => clearTimeout(timer);
  }, [drawerOpen]);

  function setDrawerStateDeplay(value: Record<string, boolean>) {
    let key = Object.keys(value)[0];
    if (value[key]) {
      setTimeout(() => {
        setDrawerOpen({ ...drawerOpen, ...value });
      }, 50);
    } else {
      setDrawerOpen({ ...drawerOpen, ...value });
    }
  }

  return (
    <div className="bg-trans-neutral-60 pointer-events-auto left-0 top-0 z-10 hidden w-full items-center justify-between px-4 py-2 backdrop-blur-lg sm:fixed sm:flex sm:h-full sm:w-20 sm:flex-col sm:p-2">
      {/* Logo */}
      <div
        className={cn(
          "hover:bg-trans-black-5 cursor-pointer p-0 transition-all duration-300 hover:rounded-full sm:p-3",
          { hidden: !isHomePage && isMobile },
        )}
      >
        <a href="/">
          <BaseIconBTN
            src={"/assets/img_logo.png"}
            alt=""
            width={40}
            height={40}
          />
        </a>
      </div>
      {/* Navbar */}
      {/* <div className="">Chi tiết bài viết</div> */}
      <div className="relative hidden flex-col items-start justify-center gap-2 sm:flex">
        <NavItem
          href="/"
          title="Home"
          src="/assets/icons-32/home.png"
          srcActive="/assets/icons-32/home-active.png"
          statusLogin={true}
          routerActive={pathname === "/" && !withoutDrawer}
        />

        <DrawerSearch
          userFeatured={userFeatured!}
          profile={profile}
          user={session}
          setDrawerActive={setDrawerStateDeplay}
          drawerActive={drawerOpen["search"]}
          src="/assets/icons-32/search.png"
          srcActive="/assets/icons-32/search-active.png"
          drawerKey="search"
        />

        <FeedCreateButton user={session} profile={profile} />
        <div className="relative">
          <DrawerNoti
            user={session}
            setDrawerActive={setDrawerStateDeplay}
            drawerActive={drawerOpen["notification"]}
            src="/assets/icons-32/notifications.png"
            srcActive="/assets/icons-32/notifications-active.png"
            drawerKey="notification"
          />

          <div className="absolute left-8 top-2.5 flex items-start shadow-sm">
            {notifications != 0 && notifications && (
              <BgdCommonBadges
                text={notifications >= 9 ? 9 : notifications}
                plus={notifications >= 9 ? true : false}
              />
            )}
          </div>
        </div>

        <NavItem
          href={`/u/${profile?.full_name ?? profile?.id}`}
          title="Me"
          src={"/assets/icons-32/person.png"}
          srcActive={"/assets/icons-32/person-active.png"}
          statusLogin={session && session.user ? true : false}
          routerActive={
            pathname === `/u/${profile?.full_name ?? profile?.id}` &&
            !withoutDrawer
          }
        />
      </div>
      {/* Menu icon */}
      <div className={cn({ hidden: !isHomePage && isMobile })}>
        <DropdownMenuComponent iconTrigger="menu" user={profile} />
      </div>
    </div>
  );
}

export { DrawerCommon };
