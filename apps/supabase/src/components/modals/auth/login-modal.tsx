import { Modal } from "@suzu/ui";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import LoginForm from "@/components/modals/auth/login-form";
import { ModalContext } from "@/components/modals/provider";
import { BaseCommonBTN, BaseIconBTN } from "@/components/master-layout";

import { BaseText } from "@/components/master-layout/base-text";

function LoginModal({
  showLoginModal,
  setShowLoginModal,
}: {
  showLoginModal: boolean;
  setShowLoginModal: Dispatch<SetStateAction<boolean>>;
}) {
  const { setShowRegisterModal } = useContext(ModalContext);
  return (
    <Modal showModal={showLoginModal} setShowModal={setShowLoginModal}>
      <div className="flex w-full flex-col items-start gap-1 self-stretch rounded-full pb-2">
        <div className="flex w-full items-center justify-between gap-2">
          <button type="button" title="...">
            <BaseIconBTN
              className="p-2 opacity-0"
              src={""}
              width={24}
              height={24}
            />
          </button>
          <BaseText text={"Đăng nhập"} className="sz-label-m-semi" />
          <button
            onClick={() => {
              setShowLoginModal(false);
            }}
            type="button"
          >
            <BaseIconBTN
              className="p-2"
              src={"/assets/icons/close-icon-24.png"}
              width={24}
              height={24}
            />
          </button>
        </div>
      </div>
      <div className="flex transform flex-col items-center justify-center gap-5 rounded-t-2xl bg-white pt-8 transition-all md:rounded-2xl">
        <div className="flex flex-col gap-5 px-4">
          <div className="flex flex-col gap-2.5 text-left">
            <div className="text-[23px] font-semibold leading-7 text-slate-700">
              Chào mừng đến SuZu nà!
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

            <LoginForm />
          </div>

          <div className="flex w-full items-center justify-center border-t border-slate-100 pb-10 pt-3 text-[15px] md:pb-6">
            <div className="text-center font-normal text-slate-500">
              Bạn vẫn chưa có tài khoản 🙄?
            </div>
            <BaseCommonBTN
              className="ml-1 py-2"
              text="Đăng ký ngay"
              isButton={true}
              onClick={() => {
                setShowLoginModal(false);
                setShowRegisterModal(true);
              }}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}

export function useLoginModal() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const LoginModalCallback = useCallback(() => {
    return (
      <LoginModal
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
      />
    );
  }, [showLoginModal, setShowLoginModal]);

  return useMemo(
    () => ({
      setShowLoginModal,
      LoginModal: LoginModalCallback,
    }),
    [setShowLoginModal, LoginModalCallback],
  );
}
