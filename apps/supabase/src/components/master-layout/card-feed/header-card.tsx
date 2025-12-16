"use client";
import { Avatar } from "@/components/shared/avatar";
import DropdownMenuComponent, {
  DropdownTrigger,
} from "@/components/shared/dropdownMenu/dropdown-menu";
import { cn, timeAgo } from "@suzu/ui";
import Link from "next/link";
import { BaseText } from "../base-text";

interface HeaderCardProps {
  feed: Feed_Detail;
  session: Session;
  following?: boolean;
  loading?: boolean;
  iconTrigger: DropdownTrigger;
  comment: boolean;
  inFeed?: boolean | undefined;
  notifications: boolean;
  user: Profile;
}

const HeaderCard = ({
  feed,
  session,
  iconTrigger,
  comment,
  notifications,
  user,
  inFeed
}: HeaderCardProps) => {
  return (
    <div className="flex items-start self-stretch justify-between pl-4 pr-2">
      {session?.user?.id ? (
        <div className="flex items-center flex-1 gap-2">

          {feed?.user_id && (
            <Avatar
              user={feed?.user_id}
              session={session}
              feed={feed}
            />
          )}

          <Link href={`/u/${feed?.user_id?.full_name}`}>
            <BaseText text={feed?.user_id?.display_name as string} className="sz-label-m-semi" textColor="neutral-700" />
          </Link>
        </div>
      ) : (
        <div className="flex items-center flex-1 gap-2">
          {feed?.user_id && <Avatar user={feed?.user_id} />}
          <Link href={`/u/${feed?.user_id?.full_name}`}>
            <BaseText text={feed?.user_id?.display_name as string} className="sz-label-m-semi" textColor="neutral-700" />
          </Link>
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className={cn("sz-label-m-reg text-neutral-500",
          { "pr-2": !inFeed }
        )}>
          <Link href={`/p/${feed?.id}`}>
            {feed?.created_at
              ? timeAgo(new Date(feed?.created_at), { withAgo: true })
              : ""}
          </Link>
        </div>
        <div className={cn({ "hidden": !inFeed && feed?.type === "feed" })}>
          <DropdownMenuComponent
            iconTrigger={iconTrigger}
            feed={feed}
            comments={comment}
            notification={notifications}
            user={user}
            session={session}
          />
        </div>

      </div>
    </div>
  );
};

export { HeaderCard };
