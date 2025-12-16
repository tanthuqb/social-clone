import { CloseIcon, Modal } from "@suzu/ui";
import {
  Dispatch,
  SetStateAction,
  Suspense,
  useCallback,
  useMemo,
  useState,
} from "react";
import { ButtonExtras as Button } from "@suzu/ui";

import { Feed } from "@/lib/db/schema/feeds";
import FeedDeleteForm from "./feed-delete-form";

function FeedDeleteModal({
  showFeedDeleteModal,
  setShowFeedDeleteModal,
  feedDelete,
  setFeedDelete,
}: {
  showFeedDeleteModal: boolean;
  setShowFeedDeleteModal: Dispatch<SetStateAction<boolean>>;
  feedDelete?: Feed_Detail;
  setFeedDelete?: Dispatch<SetStateAction<Feed_Detail | undefined>>;
}) {
  return (
    <Modal
      showModal={showFeedDeleteModal}
      setShowModal={setShowFeedDeleteModal}
    >
      <div className="relative z-10 w-full overflow-hidden sm:rounded-2xl sm:shadow-xl">
        <div className="bg-white p-4 ">
          <Suspense
            fallback={
              <>
                <Button disabled={true} text="" variant="secondary" />
                <Button disabled={true} text="" variant="secondary" />
                <Button disabled={true} text="" variant="secondary" />
                <div className="mx-auto h-5 w-3/4 rounded-lg bg-gray-100" />
              </>
            }
          >
            <FeedDeleteForm feedDelete={feedDelete ?? null} />
          </Suspense>
        </div>
      </div>
    </Modal>
  );
}

export function useFeedDeleteModal() {
  const [showFeedDeleteModal, setShowFeedDeleteModal] = useState(false);
  const [feedDelete, setFeedDelete] = useState<Feed_Detail | undefined>(
    undefined,
  );

  const FeedDeleteModalCallback = useCallback(() => {
    return (
      <FeedDeleteModal
        showFeedDeleteModal={showFeedDeleteModal}
        setShowFeedDeleteModal={setShowFeedDeleteModal}
        feedDelete={feedDelete}
        setFeedDelete={setFeedDelete}
      />
    );
  }, [showFeedDeleteModal, setShowFeedDeleteModal, feedDelete, setFeedDelete]);

  return useMemo(
    () => ({
      setShowFeedDeleteModal,
      FeedDeleteModal: FeedDeleteModalCallback,
      setFeedDelete,
    }),
    [
      setShowFeedDeleteModal,
      FeedDeleteModalCallback,
      feedDelete,
      setFeedDelete,
    ],
  );
}
