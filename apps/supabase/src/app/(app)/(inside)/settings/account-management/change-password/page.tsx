import { BackButton } from "@/components/master-layout/button/back-button";
import ChangePassword from "@/components/settings/change-password";
import { createClient } from "@/lib/supabase/server";

async function Home() {
  const supabase = createClient();
  const { data: session } = await supabase.auth.getUser();
  return (
    <div className="flex h-dvh flex-col">
      <div className="relative hidden h-[64px] items-center justify-center sm:flex">
        <div className="sz-label-m-semi text-neutral-700">Thay đổi mật khẩu</div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2">
          <BackButton currentResource={`/`} />
        </div>
      </div>

      <div className="h-[calc(100dvh_-_60px)] overflow-hidden rounded-none shadow-common-sm bg-neutral-50 py-4 sm:h-[calc(100dvh_-_80px)] sm:rounded-3xl">
        <ChangePassword session={session} />;
      </div>
    </div>
  );
}

export default Home;
