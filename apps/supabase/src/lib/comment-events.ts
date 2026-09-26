/**
 * In-page notification that a comment was created, updated or deleted.
 *
 * The comment list on the post page refreshes on Supabase Realtime events, but
 * delivery is best-effort (the channel may still be connecting, or the socket
 * may drop). The composer dispatches this event after a successful mutation so
 * the list refetches right away regardless of Realtime.
 */
export const COMMENT_CHANGED_EVENT = "suzu:comment-changed";

export type CommentChangedDetail = { feedId: string | null };

export function notifyCommentChanged(feedId?: string | null) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<CommentChangedDetail>(COMMENT_CHANGED_EVENT, {
      detail: { feedId: feedId ?? null },
    }),
  );
}
