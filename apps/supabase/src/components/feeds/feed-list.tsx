"use client";
import Loading from "@/app/(app)/(outside)/loading";
import { Suspense, useEffect, useRef, useState } from "react";
import { FeedDetail } from "./feed-detail";
import { LoadingSpinner, cn, toast } from "@suzu/ui";
import {
  getFeedsAction,
  getFeedsProfileAction,
} from "@/lib/actions/feed/actions";
import { useInView } from "react-intersection-observer";
import { getFeedCollectionsAction } from "@/lib/actions/feedCollections/actions";
import { fetchSearchDataAction } from "@/lib/actions/user/actions";
import { createClient } from "@/lib/supabase/client";
import { useRealtimeTable } from "@/hooks/useRealtimeTable";
import { useRouter } from "next/navigation";
const NUMBER_OF_FEEDS_TO_FETCH = 5;
const NUMBER_OF_FEEDS_TO_USERSEARCH = 5;
const FeedList = ({
  feeds,
  inFeed,
  userIdByParams,
  session,
  user,
  type,
  searchParams,
  className,
}: {
  feeds?: Feed_Detail[] | null | any[];
  inFeed: boolean;
  userIdByParams?: string;
  session?: Session;
  user?: Profile;
  type: string;
  searchParams?: string;
  className?: string;
}) => {
  const [offset, setOffset] = useState(NUMBER_OF_FEEDS_TO_FETCH)
  const [feedList, setFeedList] = useState<Feed_Detail[] | any[] | null[]>(feeds!)
  const [loading, setLoading] = useState(true)
  const router = useRouter();
  const { ref, inView } = useInView()
  const supabase = createClient()
  async function getName(user_id: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user_id)
      .single();
    if (error) {
      console.log(error);
      return null
    } else {
      return data;
    }
  }
  // Keep the list in sync with fresh server data (router.refresh() after a
  // create/edit/delete): replace the server-rendered first page, keep any
  // extra pages loaded by infinite scroll, and drop rows that disappeared.
  const previousFirstPage = useRef<Set<string>>(
    new Set((feeds ?? []).map((f: any) => f?.id)),
  );
  useEffect(() => {
    const fresh = (feeds ?? []) as any[];
    const freshIds = new Set(fresh.map((f) => f?.id));
    const removed = previousFirstPage.current;
    setFeedList((prev: any[]) => [
      ...fresh,
      ...(prev ?? []).filter(
        (f: any) => f && !freshIds.has(f.id) && !removed.has(f.id),
      ),
    ]);
    previousFirstPage.current = freshIds;
  }, [feeds]);

  useRealtimeTable({
    table: "feeds",
    event: "INSERT",
    filter: "type=eq.feed",
    onChange: async (payload: any) => {
      if (!session?.user?.id || type !== "feed") return;
      // Own posts are added by the composer's router.refresh().
      if (payload?.new?.user_id && payload.new.user_id !== session.user.id) {
        const author = await getName(payload.new.user_id);
        if (author) toast.success("New posts available");
      }
    },
  });

  const loadMoreFeeds = async () => {
    if (type == "feed-collections") {
      const getMoreFeeds = await getFeedCollectionsAction(
        offset,
        NUMBER_OF_FEEDS_TO_FETCH,
        user?.id!,
      );
      setFeedList([...feedList, ...getMoreFeeds]);
      setOffset(offset + NUMBER_OF_FEEDS_TO_FETCH);
      if (getMoreFeeds.length < NUMBER_OF_FEEDS_TO_FETCH) {
        setLoading(false);
      }
    } else if (type == "feed-profiles") {
      const getMoreFeeds = await getFeedsProfileAction(
        offset,
        NUMBER_OF_FEEDS_TO_FETCH,
        user?.id!,
      );
      setFeedList([...feedList, ...getMoreFeeds]);
      setOffset(offset + NUMBER_OF_FEEDS_TO_FETCH);
      if (getMoreFeeds.length < NUMBER_OF_FEEDS_TO_FETCH) {
        setLoading(false);
      }
    } else if (type == "search") {
      const getMoreFeeds = await fetchSearchDataAction(
        searchParams!,
        offset,
        NUMBER_OF_FEEDS_TO_USERSEARCH,
      );
      setFeedList([...feedList, ...getMoreFeeds]);
      setOffset(offset + NUMBER_OF_FEEDS_TO_USERSEARCH);
      if (getMoreFeeds.length < NUMBER_OF_FEEDS_TO_USERSEARCH) {
        setLoading(false);
      }
    } else {
      const getMoreFeeds = await getFeedsAction(
        offset,
        NUMBER_OF_FEEDS_TO_FETCH,
      );
      setFeedList([...feedList, ...getMoreFeeds]);
      setOffset(offset + NUMBER_OF_FEEDS_TO_FETCH);
      if (getMoreFeeds.length < NUMBER_OF_FEEDS_TO_FETCH) {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    if (inView) {
      loadMoreFeeds();
    }
  }, [inView]);

  return (
    <>
      <Suspense fallback={<Loading />}>
        <div
          className={cn(
            "flex flex-col items-center gap-2 self-stretch sm:gap-4",
            className,
          )}
        >
          {type == "feed-collections"
            ? //@ts-ignore
            feedList?.map((feed: Feed_Collections_Detail, index: number) => {
              return (
                <div className="w-full gap-2.5" key={index} z-10>
                  <FeedDetail
                    inFeed={inFeed}
                    feed={feed?.feed_id}
                    userIdByParams={userIdByParams}
                    session={session!}
                    profiles={user}
                  />
                </div>
              );
            })
            : feedList?.map((feed: Feed_Detail, index: number) => {
              return (
                <div className="w-full gap-2.5" key={index}>
                  {/* {index !== 0 && <Divider />} */}
                  <FeedDetail
                    inFeed={inFeed}
                    feed={feed}
                    userIdByParams={userIdByParams}
                    session={session!}
                    profiles={user}
                  />
                </div>
              );
            })}
        </div>
      </Suspense>
      {loading && (
        <div className="flex justify-center gap-2 py-4" ref={ref}>
          <>
            <LoadingSpinner />
            <div className="text-[15px] font-semibold leading-6 text-slate-500">
              Hang on, there's plenty more below...
            </div>
          </>
        </div>
      )}
    </>
  );
};

export { FeedList };
