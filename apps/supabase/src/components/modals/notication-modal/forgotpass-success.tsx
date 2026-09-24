import { CommonButton, Modal } from "@suzu/ui";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { ModalContext } from "@/components/modals/provider";
import { BaseCommonBTN } from "@/components/master-layout";

function ForgotPassSuccess({
  showNoticationForgotPassModal,
  setShowNoticationForgotPassModal,
}: {
  showNoticationForgotPassModal: boolean;
  setShowNoticationForgotPassModal: Dispatch<SetStateAction<boolean>>;
}) {
  const { setShowForgotPasswordModal, setShowLoginModal } =
    useContext(ModalContext);
  return (
    <Modal
      showModal={showNoticationForgotPassModal}
      setShowModal={setShowNoticationForgotPassModal}
    >
      <div className="flex w-full flex-col items-start gap-1 self-stretch pb-2">
        <div className="flex w-full items-center gap-2">
          <BaseCommonBTN
            className="p-2 opacity-0"
            srcImgRight={"/assets/icons/close-icon-24.png"}
            isButton={true}
          />
          <div className="flex-1 text-center text-[15px] font-semibold leading-6 text-white">
            Sign up
          </div>
          <BaseCommonBTN
            isButton={true}
            className="p-2"
            srcImgLeft={"/assets/icons/close-icon-24.png"}
            onClick={() => {
              setShowForgotPasswordModal(false);
            }}
          />
        </div>
      </div>
      <div className="flex w-full max-w-[600px] transform flex-col items-center justify-center gap-5 rounded-t-2xl bg-white pt-8 md:rounded-2xl">
        <div className="flex w-full max-w-[358px] flex-col items-center justify-center px-3">
          <img src="/assets/chim.png" alt="" />
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center gap-2.5 self-stretch px-4 text-left">
              <div className="text-left text-[23px] font-semibold text-slate-700">
                Check your email!
              </div>
              <div className="text-[15px] font-normal text-slate-900">
                SuZu has sent a password reset link to admin@suzu.vn,
                the email you entered.
              </div>
              <div className="mt-5 text-[15px] font-normal text-slate-900">
                If you can't find our email, please check your
                spam folder.
              </div>
            </div>
            {/*=========== DESKTOP ========== */}
            <div
              className="mt-2.5 hidden items-center justify-center gap-1 self-stretch md:flex"
              onClick={() => {
                setShowNoticationForgotPassModal(false),
                  setShowForgotPasswordModal(true);
              }}
            >
              <div className="rounded-full bg-slate-900">
                <CommonButton
                  text="Resend verification email"
                  states="default"
                  activeButton={false}
                />
              </div>
            </div>

            {/*=========== MOBILBE ========== */}
            <div
              className="mt-2.5 w-full cursor-pointer items-center gap-1 self-stretch px-4 pb-5 text-center md:hidden"
              onClick={() => {
                setShowNoticationForgotPassModal(false),
                  setShowForgotPasswordModal(true);
              }}
            >
              <div className="rounded-full bg-slate-900">
                <CommonButton
                  text="Resend verification email"
                  states="default"
                  activeButton={false}
                />
              </div>
            </div>
          </div>

          <div className="flex w-full items-center justify-center border-t border-slate-100 px-4 pb-10 pt-3 md:pb-6">
            <div className="flex text-center text-slate-500">
              Already have an account 😉?
              <button
                onClick={(event) => {
                  setShowLoginModal(true);
                  setShowNoticationForgotPassModal(false);
                }}
                className="ml-2 text-[15px] font-semibold leading-6 text-slate-900"
              >
                Log in
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export function useNoticationForgotPassModal() {
  const [showNoticationForgotPassModal, setShowNoticationForgotPassModal] =
    useState(false);

  const NoticationForgotPassModalCallback = useCallback(() => {
    return (
      <ForgotPassSuccess
        showNoticationForgotPassModal={showNoticationForgotPassModal}
        setShowNoticationForgotPassModal={setShowNoticationForgotPassModal}
      />
    );
  }, [showNoticationForgotPassModal, setShowNoticationForgotPassModal]);

  return useMemo(
    () => ({
      setShowNoticationForgotPassModal,
      NoticationForgotPassModal: NoticationForgotPassModalCallback,
    }),
    [setShowNoticationForgotPassModal, NoticationForgotPassModalCallback],
  );
}
