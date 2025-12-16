"use client";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn, toast } from "@suzu/ui";
import { ModalContext } from "@/components/modals/provider";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "node_modules/@suzu/ui/src/components/hooks";
import { BaseIconBTN } from "@/components/master-layout";
import { toastFeed } from "@/app/(app)/(outside)/toast/toast";

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

  useEffect(() => {
    async function getData() {
      if (user?.user?.id) {
        const { count: totalCount, error } = await supabase
          .from("notifications")
          .select("*", { count: "exact" })
          .eq("status", false)
          .eq("user_noti_id", user?.user?.id)
          .neq("user_id", user?.user?.id);
        setCount(totalCount ?? 0);
      }
    }
    getData();
  }, [count]);
  useEffect(() => {
    if (user) {
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
      const channel = supabase.channel(`notifications_${user?.user?.id}`);
      channel
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "notifications" },
          async (payload: any) => {
            switch (payload.eventType) {
              case "INSERT":
                if (
                  payload?.new?.user_noti_id == user?.user?.id ||
                  user?.user?.id == null
                ) {
                  setCount((count) => count + 1);
                  if (payload?.new?.user_id != payload?.new?.user_noti_id) {
                    if (payload?.new?.type == "feed") {
                      const followingName = await getName(
                        payload?.new?.user_id,
                      );
                      toastFeed(
                        `${followingName?.display_name} đã đăng bài viết mới `,
                        "checkIcon",
                        "Xem",
                        `/p/${payload?.new?.feed_id}`,
                      );
                    } else toast.success("New notification");
                  }
                  router.refresh();
                }
                break;
              case "UPDATE":
                if (payload.new.user_noti_id == user?.user?.id) {
                  setCount(0);
                  router.refresh();
                }
                break;
              case "DELETE":
                if (payload.old.user_noti_id == user?.user?.id)
                  setCount((count) => count - 1);
                router.refresh();
                break;
              default:
                break;
            }
          },
        )
        .subscribe();
      return () => {
        supabase.realtime.removeChannel(channel);
      };
    }
  }, [count]);

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
          <a href="/">
            <BaseIconBTN
              src={routerActive ? srcActive : src}
              alt=""
              className={`cursor-pointer ${isMobile ? "px-[22px] py-2" : "p-4"} transition-all duration-300 group-hover:rounded-full group-hover:bg-[rgba(31,31,31,0.05)]`}
              width={isMobile ? 24 : 32}
              height={isMobile ? 24 : 32}
            />
          </a>
        ) : href === "/search" || href === "/notifications" ? (
          <BaseIconBTN
            src={routerActive ? srcActive : src}
            alt=""
            className={`cursor-pointer ${isMobile ? "px-[22px] py-2" : "p-4"} transition-all duration-300 group-hover:rounded-full group-hover:bg-[rgba(31,31,31,0.05)]`}
            width={isMobile ? 24 : 32}
            height={isMobile ? 24 : 32}
          />
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
