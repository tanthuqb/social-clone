import Profile from "@/components/settings/profile";
import { HeaderCommonSettings } from "@/components/shared/header/local/header-common-settings";
import { createClient } from "@/lib/supabase/server";

export default async function EditProfile() {
  const supabase = createClient();
  const { data: session, error } = await supabase.auth.getUser();
  if (error) {
    // đoạn này trả về tramg error hay 404
  }
  let user;
  if (session && session.user) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session?.user?.id! as string)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      return;
    }
    user = data;
  }

  return (
    <div className="flex h-dvh flex-col">
      <HeaderCommonSettings text="Chỉnh sửa hồ sơ" />
      <div className="shadow-common-sm h-[calc(100dvh_-_60px)] rounded-none bg-neutral-50 py-4 sm:h-[calc(100dvh_-_80px)] sm:rounded-3xl">
        <Profile user={user} session={session} />
      </div>
    </div>
  );
}
