import Link from "next/link";
import { UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@suzu/ui";
import { redirect } from "next/navigation";
import { HeaderCommonSettings } from "@/components/shared/header/local/header-common-settings";
import { UnblockButton } from "@/components/moderation/unblock-button";
import { getBlockedUsers } from "@/lib/api/moderation/queries";
import { FEATURE_UNAVAILABLE } from "@/lib/supabase/schema-errors";
import { createClient } from "@/lib/supabase/server";

export default async function BlockedUsersPage() {
  const supabase = await createClient();
  const { data: session } = await supabase.auth.getUser();
  if (!session?.user) redirect("/");

  const { available, users } = await getBlockedUsers(session.user.id);

  return (
    <div className="flex h-dvh flex-col">
      <HeaderCommonSettings text="Blocked users" />
      <div className="shadow-common-sm h-[calc(100dvh-60px)] overflow-y-auto rounded-none bg-neutral-50 px-4 py-4 sm:h-[calc(100dvh-80px)] sm:rounded-3xl">
        <h1 className="sr-only">Blocked users</h1>
        {!available ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-[15px] text-amber-900">
            {FEATURE_UNAVAILABLE}
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-2xl bg-white p-4 text-[15px] text-slate-500">
            You haven&apos;t blocked anyone.
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {users.map((user) => {
              const name = user.display_name ?? user.full_name ?? "User";
              return (
                <li
                  key={user.id}
                  className="flex items-center gap-3 rounded-2xl bg-white p-3"
                  data-testid="blocked-user"
                >
                  <Avatar className="h-10 w-10">
                    {user.avatar_url && <AvatarImage src={user.avatar_url} alt="" />}
                    <AvatarFallback>
                      <UserRound className="h-5 w-5 text-slate-500" aria-hidden />
                    </AvatarFallback>
                  </Avatar>
                  <Link
                    href={`/u/${user.full_name ?? user.id}`}
                    className="flex min-w-0 flex-1 flex-col"
                  >
                    <span className="truncate text-[15px] font-semibold text-slate-900">
                      {name}
                    </span>
                    {user.full_name && (
                      <span className="truncate text-[13px] text-slate-500">
                        @{user.full_name}
                      </span>
                    )}
                  </Link>
                  <UnblockButton userId={user.id} name={name} />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
