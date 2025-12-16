"use client";

// @ts-ignore
import { Drawer } from "vaul";

import { NavItem } from "@/components/shared/navbar/nav-item";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ContentDrawer } from "./content-drawer";

function DrawerNoti({
  user,
  drawerActive = false,
  setDrawerActive,
  drawerKey,
  src,
  srcActive,
}: {
  user: Session;
  setDrawerActive: Dispatch<{ [key: string]: boolean }>;
  drawerActive: boolean;
  src: string;
  srcActive?: string;
  drawerKey: string;
}) {
  return (
    <Drawer.Root
      direction="left"
      onOpenChange={(open: boolean) => {
        setDrawerActive({ [drawerKey]: open });
      }}
    >
      <Drawer.Trigger asChild={false}>
        <NavItem
          href="/notifications"
          title="Notifications"
          src={src}
          srcActive={srcActive}
          statusLogin={user.user ? true : false}
          routerActive={drawerActive}
        />
      </Drawer.Trigger>
      {user?.user && (
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0" />
          <Drawer.Content className="shadow-common-lg bg-trans-neutral-60 fixed bottom-0 z-0 flex h-full w-full overflow-hidden backdrop-blur-sm sm:max-w-[472px]">
            <ContentDrawer user={user} />
          </Drawer.Content>
        </Drawer.Portal>
      )}
    </Drawer.Root>
  );
}

export { DrawerNoti };
