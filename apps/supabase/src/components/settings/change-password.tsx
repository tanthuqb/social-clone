"use client";

import { BackButton, CommonButton, Input, toast } from "@suzu/ui";
import { useState } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
function ChangePassword({ session }: { session: Session }) {
  const supabase = createClient();
  // const [activeButton, setActiveButton] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  if (!session?.user?.id) {
    redirect(`/`);
  }
  const handleChangeValue = async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
  ) => {
    if (currentPassword == "" || newPassword == "" || confirmPassword == "") {
      toast.error("vui lòng nhập đầy đủ thông tin");
    } else if (newPassword != confirmPassword) {
      toast.error("Mật khẩu không trùng khớp");
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: session?.user?.email as string,
        password: currentPassword as string,
      });
      if (error) {
        toast.error("mật khẩu hiện tại không đúng");
      } else {
        const { data, error: passwordError } = await supabase.auth.updateUser({
          password: newPassword,
        });
        if (passwordError) {
          toast.error("mật khẩu mới phải khác mật khẩu hiện tại");
        } else {
          toast.success("Thay đổi mật khẩu thành công");
          redirect(`/`);
        }
      }
    }
  };

  const handleResetPassword = async () => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(
      session?.user?.email,
      {
        redirectTo: `${window.location.origin}/update-password?email=${session?.user?.email}`,
      },
    );
    if (error) {
      toast.error("Tài khoản không tồn tại");
    } else toast.message("Đã gửi email xác nhận thay đổi mật khẩu");
  };
  return (
    <div className="h-full max-h-full overflow-y-auto">
      <div className="flex min-h-full max-w-xl flex-col gap-2.5">
        <div className="flex flex-col gap-2 px-4">
          <div className="gap-0.5 self-stretch">
            <div className="py-1 text-[15px] font-semibold text-[#334155]">
              Mật khẩu hiện tại
            </div>
            <Input
              className="w-full items-center gap-2 rounded-md border border-[#1F1F1F]/10 bg-white p-2 placeholder:text-neutral-500"
              type="password"
              name="password"
              required
              placeholder="Nhập mật khẩu hiện tại"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCurrentPassword(e?.target?.value.replace(/\s/g, ""))
              }
            />
            <button
              className="py-4 text-[15px] font-semibold text-slate-900"
              onClick={async () => handleResetPassword()}
            >
              Quên mật khẩu
            </button>
          </div>
          <div className="flex max-w-xl items-start gap-1 self-stretch">
            <div className="h-[1px] w-full bg-slate-100"></div>
          </div>

          <div className="self-stretch">
            <div className="py-1 text-[15px] font-semibold text-[#334155]">
              Mật khẩu mới
            </div>
            <Input
              className="w-full items-center gap-2 rounded-md border border-[#1F1F1F]/10 bg-white p-2 placeholder:text-neutral-500"
              type="password"
              name="password"
              required
              placeholder="Thay đổi mật khẩu"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewPassword(e?.target?.value.replace(/\s/g, ""))
              }
            />
            <div className="mt-5 py-1 text-[15px] font-semibold text-[#334155]">
              Nhập lại mật khẩu mới
            </div>
            <Input
              className="w-full items-center gap-2 rounded-md border border-[#1F1F1F]/10 bg-white p-2 placeholder:text-neutral-500"
              type="password"
              name="password"
              required
              placeholder="Thay đổi mật khẩu"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setConfirmPassword(e?.target?.value.replace(/\s/g, ""))
              }
            />
          </div>
        </div>
        <div className="flex-grow border-b border-b-[#1f1f1f/1]"></div>
        <div
          className={`w-full items-center gap-1 self-stretch px-4 text-center md:text-right ${true ? "cursor-pointer" : ""}`}
        >
          <button
            type="submit"
            className="btn btn-default block w-full md:inline-block md:w-auto"
            disabled={!true}
          >
            Cập nhật thông tin
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
