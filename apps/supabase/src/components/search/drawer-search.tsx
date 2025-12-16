"use client";

// @ts-ignore
import { Drawer } from "vaul";

import { NavItem } from "@/components/shared/navbar/nav-item";
import { Dispatch, SetStateAction, useState } from "react";
import { ContentDrawer } from "./content-drawer";
interface DrawerSearchProps {
  preventDefaultClose?: boolean;
  user?: Session;
  notification?: number;
  profile: Profile;
  userFeatured?: Profile[];
  openSearch?: boolean;
  setDrawerActive: Dispatch<{ [key: string]: boolean }>;
  drawerActive: boolean;
  src: string;
  srcActive?: string;
  drawerKey: string;
}

function DrawerSearch({
  profile,
  openSearch,
  setDrawerActive,
  drawerActive = false,
  drawerKey,
  src,
  srcActive,
  user,
}: DrawerSearchProps) {
  return (
    <Drawer.Root
      direction="left"
      onOpenChange={(open: boolean) => {
        setDrawerActive({ [drawerKey]: open });
      }}
    >
      <Drawer.Trigger asChild={false}>
        <NavItem
          href="/search"
          title="Search"
          openSearch={openSearch}
          src={src}
          srcActive={srcActive}
          statusLogin={true}
          routerActive={drawerActive}
        />
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0" />
        <Drawer.Content className="shadow-common-lg bg-trans-neutral-60 fixed bottom-0 z-0 flex h-full w-full overflow-hidden backdrop-blur-sm sm:max-w-[472px]">
          <ContentDrawer user={user as Session} profile={profile} />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

export { DrawerSearch };
