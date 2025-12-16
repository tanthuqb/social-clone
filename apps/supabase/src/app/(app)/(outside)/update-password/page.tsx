import { BaseText } from "@/components/master-layout/base-text";
import UpdatePasswordForm from "@/components/modals/auth/update-password-form";
import MainFooter from "@/components/shared/footer/main-footer";
import { createClient } from "@/lib/supabase/server";
export default function UpdatePasswordPage() {
  const supabase = createClient();

  return (
    <div className="flex flex-col md:mt-56">
      <BaseText
        text={"Đặt lại mật khẩu"}
        className="mx-auto sz-label-m-semi text-neutral-800"
      />
      <div className="mt-[18px] w-full max-w-[600px] bg-neutral-50 md:rounded-2xl md:shadow-[0px_1px_2px_0px_#1018280F,_0px_1px_3px_0px_#1018281A]">
        <UpdatePasswordForm />
      </div>
      <MainFooter />
    </div>
  );
}
