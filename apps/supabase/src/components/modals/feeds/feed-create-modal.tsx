import { Modal } from "@suzu/ui";
import {
  Dispatch,
  SetStateAction,
  memo,
  useCallback,
  useMemo,
  useState,
} from "react";
import { FeedCreateForm } from "@/components/modals/feeds/feed-create-form";

const FeedCreateModal = memo(function FeedCreateModal({
  showFeedCreateModal,
  setShowFeedCreateModal,
  feed,
  type,
  user,
  parentFeedId,
  session
}: {
  showFeedCreateModal: boolean;
  setShowFeedCreateModal: Dispatch<SetStateAction<boolean>>;
  feed?: Feed_Detail;
  setFeed?: Dispatch<SetStateAction<Feed_Detail | undefined>>;
  type?: boolean;
  user?: Profile | null;
  session?: Session | null;
  setUserProfile?: Dispatch<SetStateAction<Profile | null>>;
  parentFeedId?: Feed["id"];
  setParentFeedId?: Dispatch<SetStateAction<Feed["id"]>>;
}) {
  // type = true gọi form cho comment ngược lại cho feed
  return (
    <Modal
      className="!h-auto"
      showModal={showFeedCreateModal}
      setShowModal={setShowFeedCreateModal}
    >
      {type ? (
        <FeedCreateForm
          feed={feed!}
          type={type!}
          user={user!}
          session={session!}
          parentFeedId={parentFeedId}
        />
      ) : (
        <FeedCreateForm feed={feed!} type={type!} user={user!} session={session!} />
      )}
    </Modal>
  );
})

export function useFeedCreateModal() {
  const [showFeedCreateModal, setShowFeedCreateModal] = useState(false);
  const [feed, setFeed] = useState<any | undefined>(undefined);
  const [type, setType] = useState<boolean>(false);
  const [user, setUserProfile] = useState<Profile | null>(null);
  const [parentFeedId, setParentFeedId] = useState<Feed["id"] | undefined>();
  const [session, setSession] = useState<Session | null>(null);

  const FeedCreateModalCallback = useCallback(() => {
    return (
      <FeedCreateModal
        showFeedCreateModal={showFeedCreateModal}
        setShowFeedCreateModal={setShowFeedCreateModal}
        feed={feed}
        setFeed={setFeed}
        type={type}
        setUserProfile={setUserProfile}
        user={user}
        session={session}
        parentFeedId={parentFeedId}
      />
    );
  }, [
    showFeedCreateModal,
    setShowFeedCreateModal,
    feed,
    setFeed,
    type,
    setUserProfile,
    user,
    setSession,
    session,
    parentFeedId,
  ]);

  return useMemo(
    () => ({
      setShowFeedCreateModal,
      FeedCreateModal: FeedCreateModalCallback,
      setFeed,
      setType,
      setSession,
      setUserProfile,
      setParentFeedId,
    }),
    [
      setShowFeedCreateModal,
      FeedCreateModalCallback,
      feed,
      setFeed,
      setType,
      setUserProfile,
      setSession,
      session,
      user,
      setParentFeedId,
    ],
  );
}
