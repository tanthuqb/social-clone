import Profile from "@/components/settings/profile";
import SidebarSetings from "@/components/settings/sidebar";
import { HeaderCommonSettings } from "@/components/shared/header/local/header-common-settings";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Settings() {
  const supabase = await createClient();
  const { data: session, error } = await supabase.auth.getUser();
  if (error) {
    // should this return the error page or 404?
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
  } else {
    redirect("/");
  }
  return (
    <div className="flex h-dvh flex-col">
      <div className="md:hidden">
        <HeaderCommonSettings text="Settings" />
      </div>
      <div className="hidden sm:flex sm:justify-center">
        <HeaderCommonSettings text="Edit profile" />
      </div>

      <div className="shadow-common-sm hidden h-[calc(100dvh_-_60px)] overflow-hidden rounded-none bg-neutral-50 py-4 sm:h-[calc(100dvh_-_80px)] sm:rounded-3xl md:block">
        {user && <Profile user={user!} session={session} />}
      </div>
      <div className="h-full w-full md:hidden">
        <SidebarSetings />
      </div>
    </div>
  );
}
