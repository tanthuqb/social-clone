import { FeedDetail } from "@/components/feeds/feed-detail";
import MainFooter from "@/components/shared/footer/main-footer";
import { HeaderCommonIcon } from "@/components/shared/header/local/header-common-icon";
import { getFeedById, getFeedByIdWithComments } from "@/lib/api/feeds/queries";
import { createClient } from "@/lib/supabase/server";
import { ScrollArea } from "@suzu/ui";
import { notFound } from "next/navigation";
import { constructMetadata, stripHtml } from "@/lib/ultis";
import type { Metadata } from "next";

type Props = {
  params: { feedId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient();

  const { data: feed } = await supabase
    .from("feeds")
    .select("*, feed_images(*)")
    .eq("id", params.feedId)
    .maybeSingle();

  const metadata = constructMetadata({
    title: stripHtml(feed.content),
    description: stripHtml(feed.content),
    image: feed?.feed_images?.length > 0 ? feed.feed_images[0].image : ``,
    noIndex: false,
  });
  return metadata;
}

const FeedDetailPage = async ({ params }: { params: { feedId: string } }) => {
  const supabase = createClient();
  const { data: session } = await supabase.auth.getUser();
  const feedId = params.feedId;
  const feeds = await getFeedByIdWithComments(feedId);
  const { feed } = await getFeedById(feedId);
  const { data: user } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session?.user?.id as string)
    .maybeSingle();
  if (!feeds) return notFound();

  return (
    <div>
      <HeaderCommonIcon
        text={"Chi tiết bài viết"}
        session={session}
        user={user! ? user : null}
        feed={feed! ? feed : null}
      />
      <ScrollArea className="h-custom shadow-common-sm overflow-hidden bg-neutral-50 sm:rounded-3xl">
        <FeedDetail
          inFeed={false}
          feed={feeds!}
          session={session}
          profiles={user}
        />
      </ScrollArea>
      {/* <MainFooter /> */}
    </div>
  );
};

export default FeedDetailPage;
