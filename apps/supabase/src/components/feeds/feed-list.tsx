"use client";
import Loading from "@/app/(app)/(outside)/loading";
import { Suspense, useEffect, useState } from "react";
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
  useEffect(() => {
    if (session?.user?.id) {
      const channel = supabase.channel(`feed_home_${session?.user?.id}`);
      channel
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "feeds" },
          async (payload: any) => {
            switch (payload?.eventType) {
              case "INSERT":
                if (payload && payload?.new && payload?.new?.user_id != session?.user?.id && payload.new?.type === "feed") {
                  const followingName = await getName(
                    payload?.new?.user_id,
                  );
                  if (followingName) toast.success('Có bài viết mới')
                }
                else if (payload?.new?.user_id == session?.user?.id) {
                  setTimeout(async () => {
                    const { data: getNewFeed } = await supabase.from("feeds")
                    .select("*,user_id!left(*)")
                    .eq("type", "feed")
                    .eq('id', payload?.new?.id)
                    .single()
                  const { data: getImages, error } = await supabase.from("feed_images")
                    .select("*")
                    .eq('feed_id', payload?.new?.id)
                  if (error) {
                    setFeedList([getNewFeed, ...feedList])
                    router.refresh();
                  }
                  else {
                    console.log(getImages);
                    
                    const fulldata = {
                      ...getNewFeed,
                      feed_images: getImages
                    }
                    setFeedList([fulldata, ...feedList])
                    router.refresh();
                  }
                }, 5000);
                  
                }
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
  }, [supabase]);

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
              Chờ tí nhé, bên dưới còn nhiều lắm...
            </div>
          </>
        </div>
      )}
    </>
  );
};

export { FeedList };
