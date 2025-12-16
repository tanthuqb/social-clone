import { getFeaturedUserAction } from "@/lib/actions/user/actions";
import { createClient } from "@/lib/supabase/server";
import { DrawerCommon } from "./drawer-common";

const INITIAL_NUMBER_OF_SEARCH = 20;

export default async function MainSidebar() {
  const supabase = createClient();
  const { data: user } = await supabase.auth.getUser();
  const { data: profile } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", user?.user?.id as string)
  .maybeSingle();
  let notification = 0;
  if (user?.user?.id) {
    const { count: totalCount } = await supabase
      .from("notifications")
      .select("*", { count: "exact" })
      .eq("status", false)
      .eq("user_noti_id", user?.user?.id)
      .neq("user_id", user?.user?.id);
    notification = totalCount ?? 0;
  }

  return (
    <DrawerCommon
      session={user}
      notifications={notification!}
      profile={profile}
    />

  );
}
