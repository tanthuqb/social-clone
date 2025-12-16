"use client";
import { getCommentByFeedId } from "@/lib/api/comments/queries";
import { createClient } from "@/lib/supabase/client";
import { useCallback, useEffect, useRef, useState } from "react";
export const useInfiniteScroll = ({
  data,
  PAGE_COUNT,
  type,
  user,
  session,
  feedId,
}: {
  data: any;
  PAGE_COUNT: number;
  type: string;
  user?: Profile;
  session?: Session;
  feedId?: string;
}) => {
  const [datas, setData] = useState(data);
  const [page, setPage] = useState(1);
  const supabase = createClient();

  const [hasMoreData, setHasMoreData] = useState(true);
  const scrollTrigger = useRef(null);

  const loadMoreData = useCallback(async () => {
    if (hasMoreData) {
      const start = (page - 1) * PAGE_COUNT;
      const end = start + PAGE_COUNT - 1;

      let newItems = [] as any[] | null;
      let error = null;

      switch (type) {
        case "feed":
          ({ data: newItems, error } = await supabase
            .from("feeds")
            .select("*,feed_images(*),user_id!left(*)")
            .eq("type", "feed")
            .order("created_at", { ascending: false })
            .range(start, end));
          break;

        case "feed-profiles":
          if (user?.id) {
            ({ data: newItems, error } = await supabase
              .from("feeds")
              .select("*,feed_images(*),user_id!left(*)")
              .eq("type", "feed")
              .eq("user_id", user?.id)
              .order("pin", { ascending: false })
              .order("created_at", { ascending: false })
              .range(start, end));
          }
          break;

        case "feed-collections":
          if (user?.id) {
            ({ data: newItems, error } = await supabase
              .from("feed_collections")
              .select("*, feed_id!left(*,user_id!left(*))")
              .eq("user_id", session?.user?.id as string)
              .order("created_at", { ascending: false })
              .range(start, end));
          }
          break;

        case "notifications":
          ({ data: newItems, error } = await supabase
            .from("notifications")
            .select("*,user_id!left(*),feed_id!left(*),comment_id!left(*)")
            .eq("user_noti_id", session?.user?.id)
            .neq("user_id", session?.user?.id)
            .order("created_at", { ascending: false })
            .range(start, end));
          break;
        
        default:
          console.error("Invalid type");
          return;
      }

      if (error) {
        console.error("error", error);
        return;
      }

      if (!newItems?.length) {
        setHasMoreData(false);
        return;
      }

      setData((prev: any) => {
        const uniqueNewItems = newItems.filter(
          (newItem) =>
            !prev.some((prevItem: any) => prevItem.id === newItem.id),
        );
        return [...prev, ...uniqueNewItems];
      });

      setPage((prev) => prev + 1);
    }
  }, [hasMoreData, page, type, session?.user?.id]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.IntersectionObserver) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreData();
        }
      },
      { threshold: 0.5 },
    );

    if (scrollTrigger.current) {
      observer.observe(scrollTrigger.current);
    }

    return () => {
      if (scrollTrigger.current) {
        observer.unobserve(scrollTrigger.current);
      }
    };
  }, [loadMoreData]);

  return { datas, loadMoreData, hasMoreData, scrollTrigger };
};
