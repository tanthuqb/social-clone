import { CloseIcon, CommonButton, Modal } from "@suzu/ui";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";

function SupportSuccess({
  showNoticationSupportModal,
  setShowNoticationSupportModal,
}: {
  showNoticationSupportModal: boolean;
  setShowNoticationSupportModal: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Modal showModal={showNoticationSupportModal} setShowModal={setShowNoticationSupportModal}>
      <div className="flex flex-col items-start self-stretch w-full gap-1 p-2 rounded-full">
        <div className="flex items-center w-full gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="20"
            viewBox="0 0 21 20"
            fill="none"
          ></svg>
          <div className="flex-1 text-center text-[15px] font-semibold leading-6 text-white">
            Hỗ trợ
          </div>
          <div onClick={() => setShowNoticationSupportModal(false)}>
            <CloseIcon className="flex items-center justify-center text-center cursor-pointer" />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-5 pt-8 transition-all transform bg-white md:rounded-t-2xl">
        <div className="flex flex-col items-center justify-center gap-5 md:py-6 py:4 w-[354px] mx-auto">
          <img src="/assets/chim.png" alt="" />
          <div className="flex flex-col items-center">

            <div className="flex flex-col gap-2.5 self-stretch items-center text-left px-4">
              <div className="font-semibold text-[23px] text-slate-700 text-left">Thông tin hỗ trợ đã được gửi!</div>
              <div className="font-normal text-[15px] text-slate-900">Thông tin của bạn đã được gửi đi thành công. Chúng tôi sẽ phản hồi thông tin cho bạn sớm nhất.</div>
            </div>
            {/*=========== DESKTOP ========== */}
            <div className="mt-2.5 hidden items-center justify-center gap-1 self-stretch md:flex" onClick={() => setShowNoticationSupportModal(false)}>
              <div className="rounded-full bg-slate-900">
                <CommonButton text="Gửi hỗ trợ khác?" states="default" activeButton={false} />
              </div>
            </div>

            {/*=========== MOBILBE ========== */}
            <div className="mt-2.5 w-full items-center gap-1 self-stretch text-center md:hidden cursor-pointer pb-10 px-4" onClick={() => setShowNoticationSupportModal(false)}>
              <div className="rounded-full bg-slate-900">
                <CommonButton text="Gửi hỗ trợ khác?" states="default" activeButton={false} />
              </div>
            </div>
          </div>
        </div>
      </div>

    </Modal>
  );
}

export function useNoticationSupportModal() {
  const [showNoticationSupportModal, setShowNoticationSupportModal] = useState(false);

  const NoticationSupportModalCallback = useCallback(() => {
    return (
      <SupportSuccess
        showNoticationSupportModal={showNoticationSupportModal}
        setShowNoticationSupportModal={setShowNoticationSupportModal}
      />
    );
  }, [showNoticationSupportModal, setShowNoticationSupportModal]);

  return useMemo(
    () => ({
      setShowNoticationSupportModal,
      NoticationSupportModal: NoticationSupportModalCallback,
    }),
    [setShowNoticationSupportModal, NoticationSupportModalCallback],
  );
}
