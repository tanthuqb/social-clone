import { UserHeader } from "@/components/user/user-header";
import { getFeedsPrepared } from "@/lib/api/feeds/queries";
import { Button, Pencil, ScrollArea, cn } from "@suzu/ui";
import Link from "next/link";
import { UserTimeline } from "@/components/user/timeline/user-timeline";
import { createClient } from "@/lib/supabase/server";
import MainFooter from "@/components/shared/footer/main-footer";
import { HeaderSectionCommon } from "@/components/shared/header/global/header-section-common";
import type { Metadata } from 'next'
import { constructMetadata } from "@/lib/ultis";
import { redirect } from "next/navigation";


type Props = {
  params: { username: string }
}

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const supabase = createClient();
  const username = params.username;
  const { data: profile } = await supabase.from('profiles').select('*').eq('full_name', username).single()
  if (!profile) {
    return redirect('/error')
  }
  const metadata = constructMetadata({
    title: `${profile.full_name} - Profile`,
    description: `${profile.full_name} - Profile - SuZu Social Network`,
    image: profile.avatar_url || ``,
    noIndex: false
  });

  return metadata
}

export default async function Page({
  params,
}: {
  params: { username: string };
}) {
  const supabase = createClient();
  const { data: session } = await supabase.auth.getUser();
  const usernameByParams = params.username;
  let feeds;

  const { data: user, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("full_name", usernameByParams)
    .maybeSingle();
  if (!session?.user?.id) {
    let data = null;
    feeds = data;
  } else {
    const { data } = await getFeedsPrepared(user?.id);
    feeds = data;
  }

  return (
    <div className="">
      {/* InFeed */}
      <HeaderSectionCommon
        text={`@${user?.full_name ?? "full_name"}`}
        session={session}
        user={user! ? user : null}
      />
      <ScrollArea className="shadow-common-sm [:>*]:h-full h-[calc(100dvh_-_64px_-_16px)] overflow-hidden bg-neutral-50 sm:rounded-3xl">
        <div className="flex flex-col bg-white p-4">
          <UserHeader
            user={user! ? user : null}
            userIdByParams={user?.id!}
            session={session}
          />
          {session?.user?.id === user?.id && (
            <Link href="/settings">
              <Button
                variant={"ghost"}
                className="w-full rounded-full border border-slate-300"
              >
                <Pencil className="mr-1 h-4 w-4" />
                Chỉnh sửa thông tin
              </Button>
            </Link>
          )}
        </div>
        <div
          className={cn("bg-neutral-50", {
            "pb-10 md:pb-0": feeds && feeds?.length < 10,
            "shadow-common-sm": feeds && feeds?.length > 0,
          })}
        >
          {/* ===========  Tabs  ============ */}

          <UserTimeline
            feeds={feeds || undefined}
            user={user}
            session={session}
          />
        </div>
      </ScrollArea>
      <MainFooter />
    </div>
  );
}
