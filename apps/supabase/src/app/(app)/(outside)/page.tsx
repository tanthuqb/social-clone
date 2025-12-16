import { FeedList } from "@/components/feeds/feed-list";
import MainFooter from "@/components/shared/footer/main-footer";
import { createClient } from "@/lib/supabase/server";
import FeedCreateCommon from "@/components/modals/feeds/feed-create-common";
import { ScrollArea } from "@suzu/ui";
import { getFeedsAction } from "@/lib/actions/feed/actions";
import { HeaderSectionCommon } from "@/components/shared/header/global/header-section-common";
import Error from "./error";
import { redirect } from "next/navigation";

const INITIAL_NUMBER_OF_FEEDS = 5;
export default async function HomePage() {
  const supabase = createClient();
  const { data: session, error } = await supabase.auth.getUser();
  const { data: user, error: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session?.user?.id as string)
    .maybeSingle();
  const feeds = await getFeedsAction(0, INITIAL_NUMBER_OF_FEEDS);
  // if (profile) {
  //   return redirect("/error")
  // }

  return (
    <main className="py-0 sm:py-2">
      {/* TODO - Làm phase sau */}
      {/* <FeedHeaderSection inFeed={true} text={"Dành cho bạn"} /> */}
      <HeaderSectionCommon
        text={"Dành cho bạn"}
        session={session}
        user={user! ? user : null}
      />
      <ScrollArea className="h-custom shadow-common-sm flex flex-col items-center sm:rounded-3xl">
        <div className="mb-10 bg-neutral-50 sm:mb-0 sm:p-4">
          {session && session.user && (
            <FeedCreateCommon user={user!} session={session} inFeed={true} />
          )}
          <FeedList
            feeds={feeds!}
            inFeed
            user={user}
            session={session}
            type="feed"
          />
        </div>
      </ScrollArea>
      <MainFooter />
    </main>
  );
}
