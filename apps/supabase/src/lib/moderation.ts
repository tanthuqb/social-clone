import {
  CommentPermission,
  FeedPrivacy,
  ProfileVisibility,
} from "@/lib/supabase/database.types";

/** Report reasons; must match the report_reason_check constraint. */
export const REPORT_REASONS = [
  { value: "spam", label: "Spam" },
  { value: "harassment", label: "Harassment or bullying" },
  { value: "hate_speech", label: "Hate speech" },
  { value: "violence", label: "Violence or threats" },
  { value: "nudity", label: "Nudity or sexual content" },
  { value: "false_information", label: "False information" },
  { value: "fake_account", label: "Fake account", userOnly: true },
  { value: "other", label: "Something else" },
] as const;

export type ReportReason = (typeof REPORT_REASONS)[number]["value"];
export type ReportTarget = "post" | "comment" | "user";

export const REPORT_DETAILS_MAX = 500;

export const POST_PRIVACY_OPTIONS = [
  { value: FeedPrivacy.PUBLIC, label: "Public", description: "Anyone can see this post" },
  { value: FeedPrivacy.FOLLOW, label: "Followers", description: "Only your followers" },
  { value: FeedPrivacy.PRIVATE, label: "Only me", description: "Only you can see this post" },
] as const;

export const PROFILE_VISIBILITY_OPTIONS = [
  { value: ProfileVisibility.PUBLIC, label: "Everyone", description: "Anyone can see your public posts" },
  {
    value: ProfileVisibility.FOLLOWERS,
    label: "Followers only",
    description: "Only your followers can see your posts",
  },
] as const;

export const COMMENT_PERMISSION_OPTIONS = [
  { value: CommentPermission.EVERYONE, label: "Everyone" },
  { value: CommentPermission.FOLLOWERS, label: "Followers" },
  { value: CommentPermission.NOBODY, label: "No one" },
] as const;

export function privacyLabel(privacy: string | null | undefined) {
  return (
    POST_PRIVACY_OPTIONS.find((option) => option.value === privacy)?.label ?? "Public"
  );
}

/** Custom DOM event fired after blocking, so lists can drop that user's posts. */
export const USER_BLOCKED_EVENT = "suzu:user-blocked";
