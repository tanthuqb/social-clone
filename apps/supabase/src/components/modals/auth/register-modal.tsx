import { CloseIcon, Modal } from "@suzu/ui";
import {
  Dispatch,
  SetStateAction,
  Suspense,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import RegisterForm from "@/components/modals/auth/register-form";
import { ModalContext } from "../provider";
import { BaseCommonBTN } from "@/components/master-layout";

function RegisterModal({
  showRegisterModal,
  setShowRegisterModal,
}: {
  showRegisterModal: boolean;
  setShowRegisterModal: Dispatch<SetStateAction<boolean>>;
}) {
  const { setShowLoginModal } = useContext(ModalContext);
  return (
    <Modal showModal={showRegisterModal} setShowModal={setShowRegisterModal}>
      <div className="flex w-full flex-col items-start gap-1 self-stretch pb-2">
        <div className="flex w-full items-center gap-2">
          <BaseCommonBTN
            className="p-2 opacity-0"
            srcImgRight={"/assets/icons/close-icon-24.png"}
            isButton={true}
          />
          <div className="flex-1 text-center text-[15px] font-semibold leading-6 text-white">
            Đăng ký
          </div>
          <BaseCommonBTN
            isButton={true}
            className="p-2"
            srcImgLeft={"/assets/icons/close-icon-24.png"}
            onClick={() => {
              setShowRegisterModal(false);
            }}
          />
        </div>
      </div>
      <div className="flex transform flex-col items-center justify-center gap-5 rounded-t-2xl bg-white pt-8 md:rounded-2xl">
        <div className="flex flex-col gap-5 px-4 md:px-0">
          <div className="flex flex-col gap-2.5 text-left">
            <div className="text-[23px] font-semibold leading-7 text-slate-700">
              Vẫn chưa có tài khoản lun 🙄!
            </div>

            <div className="text-xs font-normal text-slate-500">
              Mạng xã hội để giải trí và vui chơi thoải mái nhưng hãy
              <br />
              <span className="text-xs font-semibold text-gray-900 underline">
                có chơi có chịu
              </span>{" "}
              khi chia sẻ những suy nghĩ của{" "}
              <span className="text-xs font-normal text-gray-700">
                bản thân
              </span>{" "}
              mình!
            </div>

            <RegisterForm />
          </div>

          <div className="flex items-center justify-center border-t border-slate-100 px-4 pb-10 pt-3 md:pb-6">
            <div className="text-center text-[15px] font-normal text-slate-500">
              Bạn đã có tài khoản 😉?
            </div>
            <BaseCommonBTN
              className="p-2"
              text="Đăng nhập nào"
              isButton={true}
              onClick={() => {
                setShowLoginModal(true);
                setShowRegisterModal(false);
              }}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}

export function useRegisterModal() {
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const RegisterModalCallback = useCallback(() => {
    return (
      <RegisterModal
        showRegisterModal={showRegisterModal}
        setShowRegisterModal={setShowRegisterModal}
      />
    );
  }, [showRegisterModal, setShowRegisterModal]);

  return useMemo(
    () => ({
      setShowRegisterModal,
      RegisterModal: RegisterModalCallback,
    }),
    [setShowRegisterModal, RegisterModalCallback],
  );
}
