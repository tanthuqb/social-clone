"use client";
import { Suspense, memo} from "react";
import { ContentForm } from "./components/content-form-feed";
import { ContentProvider } from "@/components/tiptap/providers/content-provider";
import { CountCharactersProvider } from "@/components/tiptap/providers/count-character-provider";
import Loading from "@/app/(app)/(outside)/loading";

export const FeedCreateForm = memo(({
  feed,
  type,
  user,
  parentFeedId,
  session,
}: {
  feed: Feed_Detail;
  type: boolean;
  user: Profile;
  parentFeedId?: string;
  feedIdReply?: string;
  session: Session;
  // postSuccess?: () => void;
}) => {
  return (
    <Suspense fallback={<Loading />}>
      <ContentProvider feed={feed}>
        <CountCharactersProvider>
            <ContentForm
              user={user!}
              type={type}
              feed={feed}
              parentFeedId={parentFeedId}
              session={session}
            />
        </CountCharactersProvider>
      </ContentProvider>
    </Suspense>
  );
})
