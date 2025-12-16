import { CommonButton, Modal } from "@suzu/ui";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import ContentStepForm from "./content-step-form";

function UpdateInfoUser({
  showUpdateInfoUserModal,
  setShowUpdateInfoUserModal,
}: {
  showUpdateInfoUserModal: boolean;
  setShowUpdateInfoUserModal: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Modal
      showModal={showUpdateInfoUserModal}
      setShowModal={setShowUpdateInfoUserModal}
      preventDefaultClose={true}
    >
      <ContentStepForm />
    </Modal>
  );
}

export function useUpdateInfoUserModal() {
  const [showUpdateInfoUserModal, setShowUpdateInfoUserModal] = useState(false);

  const UpdateInfoUserModalCallback = useCallback(() => {
    return (
      <UpdateInfoUser
        showUpdateInfoUserModal={showUpdateInfoUserModal}
        setShowUpdateInfoUserModal={setShowUpdateInfoUserModal}
      />
    );
  }, [showUpdateInfoUserModal, setShowUpdateInfoUserModal]);

  return useMemo(
    () => ({
      setShowUpdateInfoUserModal,
      UpdateInfoUserModal: UpdateInfoUserModalCallback,
    }),
    [setShowUpdateInfoUserModal, UpdateInfoUserModalCallback],
  );
}
