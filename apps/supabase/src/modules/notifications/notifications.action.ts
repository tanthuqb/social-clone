import { useCallback, useEffect, useRef, useState } from "react";

export const NotificationAction = () => {
  const GetNotifications = (user: Session) => {
    const [notificationsArray, setNotificationsArray] = useState<
      Notifications_Detail[]
    >([]);
    const [session, setSession] = useState<Session | undefined>(user);
    useEffect(() => {
      const fetchData = async () => {
        const data = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/notifications?userId=${session?.user?.id}`,
          {
            method: "GET",
          },
        );
        if (data.status == 200) {
          const res = await data.json();
          setNotificationsArray(res.result);

          if (res?.result?.length > 0) {
            for (const notification of res.result) {
              if (notification?.status == false) {
                const data = await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL}/api/notifications?notificationId=${notification.id}`,
                  {
                    method: "PUT",
                  },
                );
              }
            }
          }
        }
      };
      fetchData();
    }, []);
    return {
      notificationsArray,
      session,
    };
  };

  const PagingNotifications = (
    session: Session,
    notifications: Notifications_Detail[],
  ) => {
    const [datas, setData] = useState<Notifications_Detail[]>(notifications);
    const [page, setPage] = useState(1);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [loading, setLoading] = useState(true);
    const scrollTrigger = useRef(null);
    const PAGE_COUNT = 10;
    const loadMoreData = useCallback(async () => {
      if (hasMoreData) {
        if (!session?.user?.id) {
          return;
        }
        const start = (page - 1) * PAGE_COUNT;
        const end = start + PAGE_COUNT - 1;

        let newItems = [] as Notifications_Detail[] | null;
        let error = null;
        const data = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/paging/notifications?userId=${session?.user?.id}&start=${start}&end=${end}`,
          {
            method: "GET",
          },
        );
        if (data.ok) {
          const res = await data.json();
          newItems = res.result;
        }
        setLoading(false);
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
              !prev.some((prevItem: any) => prevItem.id === newItem?.id),
          );
          return [...prev, ...uniqueNewItems];
        });

        setPage((prev) => prev + 1);
      }
    }, [hasMoreData, page, session?.user?.id]);
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
    return { datas, setData, scrollTrigger, loading };
  };

  return {
    GetNotifications,
    PagingNotifications,
  };
};
