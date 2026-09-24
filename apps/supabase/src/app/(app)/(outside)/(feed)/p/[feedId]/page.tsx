import { FeedDetail } from "@/components/feeds/feed-detail";
import MainFooter from "@/components/shared/footer/main-footer";
import { HeaderCommonIcon } from "@/components/shared/header/local/header-common-icon";
import { getFeedById } from "@/lib/api/feeds/queries";
import { createClient } from "@/lib/supabase/server";
import { ScrollArea } from "@suzu/ui";
import { notFound } from "next/navigation";
import { constructMetadata, stripHtml } from "@/lib/ultis";
import type { Metadata } from "next";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Props = {
  params: Promise<{ feedId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createClient();
  const { feedId } = await params;
  if (!UUID_RE.test(feedId)) return notFound();

  const { data: feed } = await supabase
    .from("feeds")
    .select("*, feed_images(*)")
    .eq("id", feedId)
    .maybeSingle();

  if (!feed) return notFound();

  const metadata = constructMetadata({
    title: stripHtml(feed.content ?? ""),
    description: stripHtml(feed.content ?? ""),
    image: feed?.feed_images?.length > 0 ? feed.feed_images[0].image : ``,
    noIndex: false,
  });
  return metadata;
}

const FeedDetailPage = async ({ params }: { params: Promise<{ feedId: string }> }) => {
  const supabase = await createClient();
  const { data: session } = await supabase.auth.getUser();
  const { feedId } = await params;
  if (!UUID_RE.test(feedId)) notFound();
  // maybeSingle(): a missing (or not visible) feed is a 404, not a server error.
  const { feed } = await getFeedById(feedId);
  if (!feed) notFound();
  const feeds = feed;
  const { data: user } = session?.user?.id
    ? await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle()
    : { data: null };

  return (
    <div>
      <HeaderCommonIcon
        text={"Post details"}
        session={session}
        user={user ?? undefined}
        feed={feed! ? feed : null}
      />
      <ScrollArea className="h-custom shadow-common-sm overflow-hidden bg-neutral-50 sm:rounded-3xl">
        <FeedDetail
          inFeed={false}
          feed={feeds!}
          session={session}
          profiles={user ?? undefined}
        />
      </ScrollArea>
      {/* <MainFooter /> */}
    </div>
  );
};

export default FeedDetailPage;
