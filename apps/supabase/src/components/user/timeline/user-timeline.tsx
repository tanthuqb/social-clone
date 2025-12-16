import { FeedList } from "@/components/feeds/feed-list";

import { Divider, EmptyIcon, Tabs, TabsContent } from "@suzu/ui";

import { createClient } from "@/lib/supabase/server";
import { TabListCustom } from "./tabs-list-custom";
import FeedCreateCommon from "@/components/modals/feeds/feed-create-common";
export const UserTimeline = async ({
  feeds,
  user,
  session,
}: {
  feeds?: Feed_Detail[];
  user?: Profile;
  session?: Session;
}) => {
  const supabase = createClient();
  const { data: feed_collections, error } = await supabase
    .from("feed_collections")
    .select("*, feed_id!left(*,feed_images(*),user_id!left(*))")
    .eq("user_id", session?.user?.id as string)
    .order("created_at", { ascending: false })
    .limit(5);
  return (
    <div className="flex flex-grow flex-col">
      {session && session?.user?.id !== user?.id ? (
        <div className="px-0 py-4 sm:p-4">
          {/* <div className="flex justify-center border-b-[1px] border-b-slate-900">
            <div className="px-4 py-2 font-semibold text-slate-900">Bài đăng</div>
          </div> */}
          {(feeds?.length ?? 0) > 0 ? (
            <FeedList
              feeds={feeds}
              inFeed
              userIdByParams={user?.id}
              user={user}
              session={session}
              type="feed-profiles"
            />
          ) : (
            <div className="my-10 flex flex-col items-center justify-center gap-2 self-stretch">
              <div className="">
                <EmptyIcon type="feeds" />
              </div>
              <div className="text-center text-[15px] font-normal leading-6 text-slate-500">
                Chưa có bài đăng
              </div>
            </div>
          )}
        </div>
      ) : (
        <Tabs
          defaultValue="feeds"
          className="flex w-full flex-grow flex-col"
          activationMode="manual"
        >
          {/* <div className="!sticky inset-0 z-20"> */}
          <TabListCustom />
          {/* </div> */}

          <div className="px-0 py-4 sm:p-4">
            {session?.user?.id === user?.id && (
              <FeedCreateCommon user={user!} session={session} />
            )}
            <TabsContent value="feeds" className="mt-0">
              {(feeds?.length ?? 0) > 0 ? (
                <FeedList
                  feeds={feeds}
                  inFeed
                  user={user}
                  session={session}
                  type="feed-profiles"
                // className=""
                />
              ) : (
                <div className="flex h-[calc(100dvh_-_64px_-_16px_-_390px)] flex-col items-center justify-center gap-2 self-stretch sm:h-[calc(100dvh_-_64px_-_16px_-_350px)]">
                  <div className="">
                    <EmptyIcon type="feeds" />
                  </div>
                  <div className="text-center text-[15px] font-normal leading-6 text-slate-500">
                    Chưa có bài đăng
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="bookmarks">
              {(feed_collections?.length ?? 0) > 0 ? (
                <FeedList
                  feeds={feed_collections}
                  inFeed
                  user={user}
                  session={session}
                  type="feed-collections"
                />
              ) : (
                <div className="flex h-[calc(100dvh_-_64px_-_16px_-_390px)] flex-col items-center justify-center gap-2 self-stretch sm:h-[calc(100dvh_-_64px_-_16px_-_350px)]">
                  <div className="">
                    <EmptyIcon type="bookmarks" />
                  </div>
                  <div className="text-center text-[15px] font-normal leading-6 text-slate-500">
                    Chưa có bài viết lưu trữ
                  </div>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      )}
    </div>
  );
};
