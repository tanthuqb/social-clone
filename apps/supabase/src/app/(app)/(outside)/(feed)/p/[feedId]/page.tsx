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
  params: Promise<{ feedId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createClient();
  const { feedId } = await params;

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
