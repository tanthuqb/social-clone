import { Globe, Lock, Users } from "lucide-react";
import { cn } from "@suzu/ui";
import { FeedPrivacy } from "@/lib/supabase/database.types";
import { privacyLabel } from "@/lib/moderation";

const ICONS = {
  [FeedPrivacy.PUBLIC]: Globe,
  [FeedPrivacy.FOLLOW]: Users,
  [FeedPrivacy.PRIVATE]: Lock,
};

/** Small audience icon shown next to a post's timestamp. */
export function PrivacyIcon({
  privacy,
  className,
}: {
  privacy: string | null | undefined;
  className?: string;
}) {
  const label = privacyLabel(privacy);
  const Icon = ICONS[privacy as FeedPrivacy] ?? Globe;
  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      data-testid="feed-privacy"
      className={cn("inline-flex items-center text-neutral-500", className)}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
    </span>
  );
}
