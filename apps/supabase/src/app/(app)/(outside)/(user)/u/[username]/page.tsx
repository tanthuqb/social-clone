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
import { notFound } from "next/navigation";
import { getBlockRelation } from "@/lib/api/moderation/queries";


type Props = {
  params: Promise<{ username: string }>
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Profiles are addressed by username (`full_name`). Users who have not picked
 * a username yet are linked by their id instead, so accept both.
 */
async function getProfileByUsername(rawUsername: string) {
  let username = rawUsername;
  try {
    username = decodeURIComponent(rawUsername);
  } catch {
    // keep the raw value
  }
  const supabase = await createClient();
  const { data: byName } = await supabase
    .from("profiles")
    .select("*")
    .eq("full_name", username)
    .maybeSingle();
  if (byName) return byName;
  if (!UUID_RE.test(username)) return null;
  const { data: byId } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", username)
    .maybeSingle();
  return byId;
}

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const { username } = await params;
  const profile = await getProfileByUsername(username);
  if (!profile) {
    return constructMetadata({ title: "Profile not found", noIndex: true });
  }
  const metadata = constructMetadata({
    title: `${profile.full_name ?? profile.display_name} - Profile`,
    description: `${profile.full_name ?? profile.display_name} - Profile - SuZu Social Network`,
    image: profile.avatar_url || ``,
    noIndex: false
  });

  return metadata
}

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const supabase = await createClient();
  const { data: session } = await supabase.auth.getUser();
  const { username: usernameByParams } = await params;
  const user = await getProfileByUsername(usernameByParams);
  if (!user) notFound();

  // Feed visibility (post privacy, followers-only profiles, blocks, hidden
  // posts) is enforced by RLS; a block also skips the timeline query.
  const relation = await getBlockRelation(session?.user?.id, user.id, supabase);
  const blocked = relation.blockedByMe || relation.blockedMe;
  const { data: feeds } = blocked ? { data: [] } : await getFeedsPrepared(user.id);

  return (
    <div className="">
      {/* InFeed */}
      <HeaderSectionCommon
        text={`@${user.full_name ?? user.display_name ?? "user"}`}
        session={session}
        user={user!}
      />
      <ScrollArea className="shadow-common-sm [:>*]:h-full h-[calc(100dvh_-_64px_-_16px)] overflow-hidden bg-neutral-50 sm:rounded-3xl">
        <div className="flex flex-col bg-white p-4">
          <UserHeader
            user={user! ? user : null}
            userIdByParams={user?.id!}
            session={session}
            relation={relation}
          />
          {session?.user?.id === user?.id && (
            <Link href="/settings">
              <Button
                variant={"ghost"}
                className="w-full rounded-full border border-slate-300"
              >
                <Pencil className="mr-1 h-4 w-4" />
                Edit profile
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
            user={user ?? undefined}
            session={session}
          />
        </div>
      </ScrollArea>
      <MainFooter />
    </div>
  );
}
