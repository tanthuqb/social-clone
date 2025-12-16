import { CloseIcon, CommonButton, Modal, ModalAlert } from "@suzu/ui";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { ContentModalAlert } from "./components/content-modal-alert";

function CancelFeedModal({
  showCancelFeedModal,
  setShowCancelFeedModal,
}: {
  showCancelFeedModal: boolean;
  setShowCancelFeedModal: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <ModalAlert
      showModal={showCancelFeedModal}
      setShowModal={setShowCancelFeedModal}
    >
      <ContentModalAlert />
    </ModalAlert>
  );
}

export function useCancelFeedModalModal() {
  const [showCancelFeedModal, setShowCancelFeedModal] = useState(false);

  const CancelFeedModalCallback = useCallback(() => {
    return (
      <CancelFeedModal
        showCancelFeedModal={showCancelFeedModal}
        setShowCancelFeedModal={setShowCancelFeedModal}
      />
    );
  }, [showCancelFeedModal, setShowCancelFeedModal]);

  return useMemo(
    () => ({
      setShowCancelFeedModal,
      CancelFeedModal: CancelFeedModalCallback,
    }),
    [setShowCancelFeedModal, CancelFeedModalCallback],
  );
}
