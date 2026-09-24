"use client";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn, toast } from "@suzu/ui";
import { ModalContext } from "@/components/modals/provider";
import { createClient } from "@/lib/supabase/client";
import { useRealtimeTable } from "@/hooks/useRealtimeTable";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@suzu/ui/hooks";
import { BaseIconBTN } from "@/components/master-layout";
import { toastFeed } from "@/components/shared/toast-feed";

type NavItemProps = {
  className?: string;
  href: string;
  title: string;
  statusLogin?: boolean;
  isChange?: boolean;
  user?: Session;
  notifications?: number;
  src: string;
  srcActive?: string;
  openSearch?: boolean;
  routerActive: boolean;
};

export const NavItem = ({
  className,
  href,
  title,
  src,
  srcActive,
  statusLogin,
  notifications,
  user,
  routerActive = false,
}: NavItemProps) => {
  const supabase = createClient();
  const router = useRouter();

  const { setShowLoginModal } = useContext(ModalContext);
  const [count, setCount] = useState<number>(notifications ?? 0);

  const { isMobile } = useMediaQuery();

  if (!srcActive) srcActive = src;
  const srcCustom = routerActive ? srcActive : src;

  const handleClick = () => {
    setShowLoginModal(true);
  };

  const [refreshTick, setRefreshTick] = useState(0);
  const viewerId = user?.user?.id;

  // Unread (unseen) notification count for the badge.
  useEffect(() => {
    if (!viewerId || href !== "/notifications") return;
    let cancelled = false;
    supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("status", false)
      .eq("user_noti_id", viewerId)
      .neq("user_id", viewerId)
      .then(({ count: totalCount }) => {
        if (!cancelled) setCount(totalCount ?? 0);
      });
    return () => {
      cancelled = true;
    };
  }, [viewerId, href, refreshTick]);

  async function getName(user_id: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user_id)
      .single();
    if (error) {
      console.log(error);
    } else {
      return data;
    }
  }

  useRealtimeTable({
    table: "notifications",
    // Only subscribe for the notifications nav item of a signed-in user.
    filter: viewerId ? `user_noti_id=eq.${viewerId}` : "user_noti_id=eq.00000000-0000-0000-0000-000000000000",
    onChange: async (payload: any) => {
      if (!viewerId || href !== "/notifications") return;
      switch (payload.eventType) {
              case "INSERT":
                if (
                  payload?.new?.user_noti_id == user?.user?.id ||
                  user?.user?.id == null
                ) {
                  setRefreshTick((tick) => tick + 1);
                  if (payload?.new?.user_id != payload?.new?.user_noti_id) {
                    if (payload?.new?.type == "feed") {
                      const followingName = await getName(
                        payload?.new?.user_id,
                      );
                      toastFeed(
                        `${followingName?.display_name} published a new post `,
                        "checkIcon",
                        "View",
                        `/p/${payload?.new?.feed_id}`,
                      );
                    } else toast.success("New notification");
                  }
                  router.refresh();
                }
                break;
              case "UPDATE":
                if (payload.new.user_noti_id == user?.user?.id) {
                  setRefreshTick((tick) => tick + 1);
                }
                break;
              case "DELETE":
                setRefreshTick((tick) => tick + 1);
                break;
        default:
          break;
      }
    },
  });

  return (
    <div
      className={cn(
        "group items-center rounded p-0 transition-all hover:cursor-pointer hover:rounded-[8px] active:scale-90",
        className,
      )}
      title={title}
    >
      {statusLogin ? (
        href === "/" ? (
          <Link href="/">
            <BaseIconBTN
              src={routerActive ? srcActive : src}
              alt=""
              className={`cursor-pointer ${isMobile ? "px-[22px] py-2" : "p-4"} transition-all duration-300 group-hover:rounded-full group-hover:bg-[rgba(31,31,31,0.05)]`}
              width={isMobile ? 24 : 32}
              height={isMobile ? 24 : 32}
            />
          </Link>
        ) : href === "/search" || href === "/notifications" ? (
          <div className="relative">
            <BaseIconBTN
              src={routerActive ? srcActive : src}
              alt=""
              className={`cursor-pointer ${isMobile ? "px-[22px] py-2" : "p-4"} transition-all duration-300 group-hover:rounded-full group-hover:bg-[rgba(31,31,31,0.05)]`}
              width={isMobile ? 24 : 32}
              height={isMobile ? 24 : 32}
            />
            {href === "/notifications" && count > 0 && (
              <span
                className="pointer-events-none absolute right-2 top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-semibold leading-none text-white"
                data-testid="notification-badge"
                aria-label={`${count} unread notifications`}
              >
                {count > 99 ? "99+" : count}
              </span>
            )}
          </div>
        ) : (
          // person
          <Link href={href}>
            <BaseIconBTN
              src={routerActive ? srcActive : src}
              alt=""
              className={`cursor-pointer ${isMobile ? "px-[22px] py-2" : "p-4"} transition-all duration-300 group-hover:rounded-full group-hover:bg-[rgba(31,31,31,0.05)]`}
              width={isMobile ? 24 : 32}
              height={isMobile ? 24 : 32}
            />
          </Link>
        )
      ) : (
        <div onClick={handleClick}>
          <BaseIconBTN
            src={srcCustom ? src : src}
            alt=""
            className={`cursor-pointer ${isMobile ? "px-[22px] py-2" : "p-4"} transition-all duration-300 group-hover:rounded-full group-hover:bg-[rgba(31,31,31,0.05)]`}
            width={isMobile ? 24 : 32}
            height={isMobile ? 24 : 32}
          />
        </div>
      )}
    </div>
  );
};
