import AccountManagement from "@/components/settings/account-management";
import { HeaderCommonSettings } from "@/components/shared/header/local/header-common-settings";
import { createClient } from "@/lib/supabase/server";

async function Home() {
  const supabase = createClient();
  const { data: session } = await supabase.auth.getUser();
  return (
    <div className="flex h-dvh flex-col">
      <HeaderCommonSettings text="Quản lý tài khoản" />
      <div className="shadow-common-sm h-[calc(100dvh_-_60px)] overflow-hidden rounded-none bg-neutral-50 py-4 sm:h-[calc(100dvh_-_80px)] sm:rounded-3xl">
        <AccountManagement session={session ?? null} />;
      </div>
    </div>
  );
}

export default Home;
