import { CloseIcon, Modal } from "@suzu/ui";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { ModalContext } from "@/components/modals/provider";
import ForgotPassForm from "./forgot-pasword-form";
import { BaseCommonBTN } from "@/components/master-layout";

function ForgotPasswordModal({
  showForgotPasswordModal,
  setShowForgotPasswordModal,
}: {
  showForgotPasswordModal: boolean;
  setShowForgotPasswordModal: Dispatch<SetStateAction<boolean>>;
}) {
  const { setShowLoginModal } = useContext(ModalContext);
  return (
    <Modal
      showModal={showForgotPasswordModal}
      setShowModal={setShowForgotPasswordModal}
    >
      <div className="flex w-full flex-col items-start gap-1 self-stretch rounded-full pb-2">
        <div className="flex w-full items-center gap-2">
          <div className="flex-1 text-center text-[15px] font-semibold leading-6 text-white">
            Quên mật khẩu
          </div>
          <BaseCommonBTN
            className="p-2"
            srcImgRight={"/assets/icons/close-icon-24.png"}
            isButton={true}
            onClick={() => {
              setShowForgotPasswordModal(false);
              setShowLoginModal(true);
            }}
          />
        </div>
      </div>
      <div className="flex transform flex-col items-center justify-center gap-5 rounded-t-2xl bg-white pt-8 transition-all md:rounded-2xl">
        <div className="mx-auto flex w-[354px] flex-col gap-5 px-5">
          <div className="flex flex-col gap-2.5 text-left">
            <div className="text-left text-[23px] font-semibold leading-7 text-slate-700">
              Quên mật khẩu rồi 🤧!
            </div>

            <div className="text-xs font-normal text-slate-500">
              <div className="text-xs font-normal text-slate-500">
                Hãy nhập địa chỉ email của bạn bên dưới.
                <br />
                Email đã đăng ký trên SuZu, để tạo mật khẩu mới.
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="w-full">
                <ForgotPassForm />
              </div>
            </div>
          </div>

          <div className="flex w-full items-center justify-center border-t border-slate-100 pb-10 pt-3 md:pb-6">
            <div className="text-center text-[15px] font-normal text-slate-500">
              Bạn đã có tài khoản 😉?
            </div>
            <BaseCommonBTN
              className="p-2"
              text="Đăng nhập nào"
              isButton={true}
              onClick={() => {
                setShowForgotPasswordModal(false);
                setShowLoginModal(true);
              }}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}

export function useForgotPasswordModal() {
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const ForgotPasswordModalCallback = useCallback(() => {
    return (
      <ForgotPasswordModal
        showForgotPasswordModal={showForgotPasswordModal}
        setShowForgotPasswordModal={setShowForgotPasswordModal}
      />
    );
  }, [showForgotPasswordModal, setShowForgotPasswordModal]);

  return useMemo(
    () => ({
      setShowForgotPasswordModal,
      ForgotPasswordModal: ForgotPasswordModalCallback,
    }),
    [setShowForgotPasswordModal, ForgotPasswordModalCallback],
  );
}
