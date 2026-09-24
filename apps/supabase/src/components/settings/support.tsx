"use client";

import { CommonButton, Textarea, cn, toast } from "@suzu/ui";
import { useContext, useState } from "react";
import { ModalContext } from "@/components/modals/provider";
import { createClient } from "@/lib/supabase/client";

function Support() {
  // const { data: session, status } = useSession();
  const { setShowNoticationSupportModal, setShowLoginModal } =
    useContext(ModalContext);

  const [activeButton, setActiveButton] = useState(false);
  const [content, setContent] = useState("");
  const handleChangeValue = (value: string) => {
    if (value !== "") {
      setActiveButton(true);
      setContent(value);
    } else {
      setActiveButton(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const supabase = createClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) {
      setShowLoginModal(true);
      return;
    }
    // report.user_id defaults to auth.uid() in the database.
    const { error } = await supabase.from("report").insert([{ content }]);
    if (error) {
      toast.error("Failed to send report");
      return;
    }
    toast.success("Sent successfully");
    setShowNoticationSupportModal(true);
    setActiveButton(false);
  };

  return (
    <div className="h-full max-h-full overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="flex h-full max-w-xl flex-col gap-4"
      >
        <div className="flex flex-col gap-2 px-4">
          <div className="flex w-full flex-col items-start gap-5 rounded-[20px]">
            <div className="flex flex-col items-start gap-1 self-stretch">
              <div className="flex w-full justify-between">
                <div className="text-[15px] font-semibold text-slate-700">
                  Describe the problem you are having
                </div>
                <div className="text-[15px] font-normal text-slate-500">
                  1/500
                </div>
              </div>

              <Textarea
                placeholder="Describe your issue"
                onChange={(e) => handleChangeValue(e.target.value)}
                className="max-h-[300px] min-h-[184px] border-0"
              />
            </div>
          </div>

          <div className="hidden max-w-xl items-start gap-1 self-stretch md:flex">
            <div className="h-[1px] w-full bg-slate-100"></div>
          </div>
        </div>
        <div className="flex-grow border-b border-b-[#1f1f1f/1]"></div>
        <div
          className={`w-full items-center gap-1 self-stretch px-4 text-center md:text-right ${activeButton ? "cursor-pointer" : ""}`}
        >
          <button
            type="submit"
            className="btn btn-default block w-full md:inline-block md:w-auto"
            disabled={!activeButton}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default Support;
